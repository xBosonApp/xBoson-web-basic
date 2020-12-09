jQuery(function($) {
  const ENTER = 13;
  const App = "0d8b740dbaa9440c8ddfc392cc9780a4";
  const parm = parseParm();
  const state = $(".state");
  const jlabels = $("#labels");
  const jbody = $(document.body);
  
  // {id:数据}
  let nodes = {};
  let edges = {};
  // {类型: 样式表}
  let types = {};
  
  const operator = {
    // 定义模块
    module : null,
    // Function() 生成基础查询参数
    gen_parm,
    // Function() 
    clean_graph,
    // Function(...)
    error, msg, warn,
    // Function(parm:{_id, cql, limit}, cb:(err)) 执行查询, 更新图
    query : null,
    // Function(apiname, parameater, callback:(err, data)) http错误或接口返回错误视为 err, 同时打印错误消息
    api,
    // Function(id, type:""|[], data) id 必须是字符串
    addNode,
    // Function() 更新视图
    update,
    // Function(id, type, source, target, data) id 必须是字符串
    addEdge,
    // function(cb:(id, obj)) 迭代所有节点
    eachNode,
    // Function()
    newTable,
  };
  
  const layout_opt = {
    name: 'cose', // breadthfirst: 树, cose: 星
    animate: true,
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
    
    nodeRepulsion(node) {
      //indegree 200000
      var r = node.indegree() * 5000000 + 10000;
      console.log(r)
      return r;
    },
  };
  
  const cy = operator.cy = cytoscape({
    container: document.getElementById('graph'),
  });
  
  state.find(".id").text(parm._id);
  init_graph_type(parm.uri);
  
  $('.operator a').click(function() {
    var thiz = $(this);
    try {
      operating(thiz.attr("href"));
    } catch(e) {
      operator.error("异常", e.message);
    }
    return false;
  });
  
  jbody.click(function() {
    jbody.trigger('close_editor');
  })
  
  $("#cql").keydown(function(e) {
    if (e.keyCode == ENTER) {
      if (!this.value) return;
      var p = operator.gen_parm();
      p.cql = this.value;
      
      operating("query", p, function(err) {
        if (err) {
          operator.error("查询错误", err.message);
        } else {
          operator.msg("完成");
        }
      });
    }
  });
  
  $(window).resize(function() {
    cy.resize();
  });
  
  
  function update() {
    cy.layout(layout_opt).run();
    cy.center();
  }
  
  
  function addNode(id, type, data) {
    if (nodes[id]) return false;
    nodes[id] = data;
    
    var st = {
      'label' : 'data(id)',
    };
    
    if (typeof type == 'string') {
      setStyle(type, st, data);
    } else {
      for (var i=0; i<type.length; ++i) {
        setStyle(type[i], st, data);
      }
    }
    
    cy.add({
      group   : 'nodes',
      classes : type,
      data    : { id, x:data },
    });
    return true;
  }
  
  
  function addEdge(id, type, source, target, data) {
    if (edges[id]) return false;
    edges[id] = data;
    
    var lc = randomColor();
    setStyle(type, {
      'target-arrow-shape': 'vee',
      'curve-style'       : 'bezier',
      'line-color'        : lc,
      'target-arrow-color': lc,
      'width'             : 2,
      'label'             : 'data(name)',
    }, data);
    
    cy.add({
      group   : 'edges',
      classes : type,
      data    : { id, name: type, source, target, x:data } 
    });
    return true;
  }
  
  
  function setStyle(type, exstyle, attr) {
    if (types[type]) {
      types[type] = $.extend(types[type], attr);
      return;
    } else {
      types[type] = $.extend({id:1}, attr);
    }
    
    const style_key = 'graph.'+ parm._id +'.style.'+ type;
    var st = $.extend({
      'background-color': randomColor(),
      'color'           : '#aaa',
      'font-size'       : '10px',
    }, exstyle, load_label_style());
    updateStyle();
    
    var l = $("<label>").text(type).css({
      'background-color' : st['background-color'],
      'color' : reverseColor(st['background-color']),
    });
    jlabels.append(l);
    
    
    var editor = template('.label_editor');
    editor.find(".title").text(type);
    editor.hide();
    
    var alist = editor.find(".attr_list");
    label_item('默认', exstyle.label);
    label_item('id', 'data(id)');
    for (var n in attr) {
      label_item(n);
    }
    
    jbody.on("close_editor", function() {
      editor.hide();
    });
    
    l.click(function(e) {
      var attr = types[type];
      jbody.trigger('close_editor');
      editor.css({
        'position': 'absolute', 
        'top'     : l.offset().top +'px', 
        'left'    : (l.offset().left + l.outerWidth()) +'px',
        'z-index' : 30,
      }).show();
      return false;
    });
    
    function label_item(n, labelExp) {
      var li = $("<a href='#'>").text(n).appendTo(alist);
      li.click(function() {
        st.label = labelExp || ('data(x.'+ n +')');
        updateStyle();
        editor.hide();
        save_label_style(st)
        return false;
      });
    }
    
    function updateStyle() {
      cy.style().selector('.'+ type).style(st).update();
    }
    
    function save_label_style() {
      localStorage.setItem(style_key, JSON.stringify(st));
    }
    
    function load_label_style() {
      try {
        return JSON.parse( localStorage.getItem(style_key) );
      } catch(e) {}
      return {};
    }
  }
  
  
  function eachNode(cb) {
    for (var n in nodes) {
      cb(n, nodes[n]);
    }
  }
  
  
  function api(name, _parm, cb) {
    var url = [parm.pf, 'app/', parm.org, '/', App, '/', operator.module, '/', name].join('');
    if (parm.s == 'd') {
      _parm.s = 'd';
    }
    
    $.ajax(url, {
      data   : _parm,
      method : 'post',
      async  : true,
      
      error(req, text, err) {
        operator.error(text, err);
        cb(err);
      },
      
      success(data) {
        if (data.code == 0) {
          cb(null, data);
        } else {
          operator.error("请求 "+ name +" 时错误,", data.msg);
          cb(new Error(data.msg));
        }
      },
    });
  }
  
  
  function init_graph_type(uri) {
    var type = uri.split("://")[0];
    switch (type) {
      case "bolt":
      case "bolt+ssc":
      case "bolt+s":
      case "neo4j+ssc":
      case "neo4j+s":
        type = 'neo4j';
        break;
    }
    $("<script>").attr("src", type +".op.js").appendTo(jbody);
    for (var n in window.graph_operator) {
      operator[n] = window.graph_operator[n];
    }
  }
  
  
  function clean_graph() {
    jbody.off('close_editor');
    nodes = {};
    edges = {};
    types = {};
    cy.remove('*');
    jlabels.empty();
  }
  
  
  function gen_parm() {
    return {
      _id   : parm._id,
      limit : 100,
    };
  }
  
  
  function error() {
    var div = $("<div class='error'>").html(array(arguments).join(' '));
    state.find(".msg").empty().append(div);
  }
  
  
  function warn() {
    var div = $("<div class='warn'>").html(array(arguments).join(' '));
    state.find(".msg").empty().append(div);
  }
  
  
  function msg() {
    state.find(".msg").html(array(arguments).join(' '));
  }
  
  
  function operating(name) {
    if (!operator[name]) {
      var err = new Error("系统错误, 不存在的操作函数 "+ name);
      operator.error(err.message);
      throw err;
    }
    operator[name].apply(operator, array(arguments, 1));
  }
  
  
  function array(arg, begin) {
    var a = [];
    for (var i=begin || 0; i<arg.length; ++i) {
      a.push(arg[i]);
    }
    return a;
  }
  
  
  function parseParm() {
    var pm = {};
    location.search.substr(1).split('&').forEach(function(p) {
      var x = p.split('=');
      pm[x[0]] = decodeURIComponent(x[1]);
    });
    // console.log("URI P", pm);
    return pm;
  }
  
  
  function randomColor() {
    return '#'+ cc() + cc() + cc();
  }
  
  
  function reverseColor(str) {
    var buf = ['#'];
    for (var i=1; i<str.length; ++i) {
      var c = str[i];
      c = (0x8 + parseInt(c, 16)) & 0xF;
      buf[i] = c.toString(16);
    }
    return buf.join('');
  }
  
  
  function arr2obj(o, arr) {
    arr.forEach(function(k) {
      o[k] = 1;
    });
    return o;
  }
  
  
  function template(name) {
    return $( $("#template").find(name).html() ).appendTo(document.body);
  }
  
  
  function cc() {
    var a = Math.random() * 0xDF + 0x20;
    a = parseInt(a).toString(16);
    if (a.length < 2) a = '0'+ a;
    return a;
  }
  
    
  function newTable() {
    var table = { head:[], body:[] };
    var colmap = {};
    var rc = 0;
    var hasdata = false;
    
    function put(c, d) {
      let tw = table.body[rc];
      if (!tw) {
        tw = table.body[rc] = [];
      }
      tw[c] = JSON.stringify(d);
      hasdata = true;
    }
    
    function col(name) {
      let c = colmap[name];
      if (c === undefined) {
        c = colmap[name] = table.head.length;
        table.head[c] = name;
      }
      return c;
    }
    
    function next() {
      if (hasdata) {
        rc++;
        hasdata = false;
      }
    }
    
    function hasData() {
      return rc > 0;
    }
    
    function show(title) {
      var jtable = $("<table class='datatable'>");
      var jhead = $("<thead>").appendTo(jtable);
      table.head.forEach(function(h) {
        $("<th>").text(h).appendTo(jhead);
      });
      
      var jbody = $("<tbody>").appendTo(jtable);
      table.body.forEach(function(r) {
        var tr = $("<tr>").appendTo(jbody);
        r.forEach(function(c) {
          $("<td>").text(c).appendTo(tr);
        });
      });
      
      var tpl = template(".data_table");
      tpl.find('.title').text(title).click(function() {
        $("#cql").val(this.innerText);
      });
      tpl.find(".content").append(jtable);
      tpl.find(".close").click(function() {
        tpl.remove();
      });
      $("#data_tables").append(tpl);
    }
    
    return {
      // (name) 列名返回列索引
      col,
      // (col, data) 向当前行 col 列中插入数据
      put,
      // () 下一行数据
      next,
      // () 有数据返回 true
      hasData,
      // () 显示表格
      show,
    }
  }
});