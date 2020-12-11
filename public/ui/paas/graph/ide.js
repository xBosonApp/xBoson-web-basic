jQuery(function($) {
  const ENTER = 13;
  const App = "0d8b740dbaa9440c8ddfc392cc9780a4";
  const parm = parseParm();
  const state = $(".state");
  const jlabels = $("#labels");
  const jbody = $(document.body);
  const jwin = $(window);
  const analysis_list = new_analysis_list();
  
  // {id:数据}
  let nodes = {};
  let edges = {};
  // {类型: 样式表}
  let types = {};
  let dialogIndex = 50;
  
  const operator = {
    //--- 从外部模块中导入的函数 ---
    // 定义模块
    module : null,
    // Function(parm:{_id, cql, limit}, cb:(err)) 执行查询, 更新图
    query : null,
    // Function(id, label, del_rel, isEdge) 生成一个 cql 用于删除节点或边
    genDeleteCql : null,
    // Function(id, label, k, v, isEdge) 生成 cql 用于修改/插入属性
    genInsertAttrCql : null,
    // Function(id, label, k, isEdge) 生成 cql 用于删除属性
    genDeleteProp : null,
    // Function (label, prop:{}) 生成 cql 用于创建无关系节点
    genCreateNode : null,
    // Function(beginNodeId, endNodeId, label, prop) 生成 cql 用于创建关系
    genCreateEdge : null,
    
    // Function() 生成基础查询参数
    gen_parm,
    // Function(...)
    error, msg, warn,
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
    
    //--- Function() 菜单函数
    new_analysis,
    update_analysis_list,
    remove_select,
    insert_attr,
    create_node_menu,
    clean_graph,
    create_rel_menu,
  };
  
  const layout_opt = {
    cose : {
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
        // console.log(r)
        return r;
      },
    }
  };
  
  const cy = operator.cy = new_cytoscape();
  
  jquery_plugin();
  state.find(".id").text(parm._id);
  init_graph_type(parm.uri);
  analysis_list.update();
  resize_event();
  inmediatamente_query();
  operator_menu_bind();
  
  jbody.click(function() {
    jbody.trigger('close_editor');
  });
  
  
  function new_cytoscape() {
    const propertie_show = state.find('.propertie');
    const cy = cytoscape({
      container: document.getElementById('graph'),
      // style : '.selected { background-color: #fff }',
    });
    let selected_obj = null;
  
    cy.on("select", (e)=>{ 
      e.target.style({'background-color': '#fff', 'line-color': '#fff'});
      update(e.target);
      selected_obj = e.target;
    });
    
    cy.on('unselect', unselect);
    cy.on('select_none', unselect);
    
    cy.on("get_select", (e, cb)=>{
      if (selected_obj) {
        cy.animate({zoom: 4, center: {eles: selected_obj}});
        cb(null, selected_obj);
      } else {
        cb(new Error("没有选中任何对象"));
      }
    });
    
    cy.on('update_prop', (e, obj)=>{
      update(obj);
    });
    
    function unselect() {
      selected_obj.removeStyle('background-color line-color');
      selected_obj = null;
      propertie_show.empty();
    }
    
    function update(obj) {
      let data = obj.data();
      propertie_show.empty();
      
      insert_prop('ID', data.id, true);
      for (let n in data.x) {
        insert_prop(n, data.x[n]);
      }
    }
  
    function insert_prop(k, v, notDel) {
      let row = $("<tr>").appendTo(propertie_show);
      $("<td class='tag'>").text(k).appendTo(row);
      $("<td>").text(v).appendTo(row);
      if (!notDel) {
        let del = $("<td><a href='#' class='button'>x</a></td>").appendTo(row)
        del.click(remove_prop(k, row));
      } else {
        $("<td>").appendTo(row);
      }
    }
    
    function remove_prop(k, row) {
      return function() {
        let dia = openDialog('.yes_no_dialog');
        dia.find(".message").html('是否删除属性' + k);
        
        let pos = propertie_show.offset();
        pos.left -= dia.outerWidth() + 10;
        dia.offset(pos);
      
        dia.find(".yes").click(function() {
          let d = selected_obj.data();
          let cql = operator.genDeleteProp(d.realID, d.label, k, selected_obj.isEdge());
          
          operator.query(gen_parm(cql), (err, r)=>{
            if (err) return operator.error("删除属性失败", err.message);
            operator.msg(k +" 属性已经删除");
            row.remove();
            delete d.x[k];
            selected_obj.data(d);
          });
        });
      }
    }
    
    return cy;
  }
    
  
  function operator_menu_bind() {
    $('.operator a').click(function() {
      var thiz = $(this);
      try {
        operating(thiz.attr("href"));
      } catch(e) {
        operator.error("异常", e.message);
      }
      return false;
    });
  }
  
  
  function inmediatamente_query() {
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
  }
  
  
  function resize_event() {
    jwin.resize(function() {
      cy.resize();
      $("#data_tables").css("max-width", jbody.innerWidth() - $("#menus").outerWidth() - 10);
    }).trigger("resize");
  }
  
  
  function jquery_plugin() {
    $.fn.extend({
      center() {
        var x = (jwin.width()  - this.outerWidth()) / 2;
        var y = (jwin.height() - this.outerHeight()) / 2;
        this.offset({left:x, top:y});
        return this;
      }
    });
  }
  
  
  function update() {
    cy.layout(layout_opt.cose).run();
    cy.center();
  }
  
  
  function remove_select() {
    cy.emit('get_select', [select_cb]);
    
    function select_cb(err, obj) {
      if (err) {
        operator.error('删除失败', err.message);
        return;
      }
    
      flash_obj(obj);
      
      var dia = openDialog('.yes_no_dialog');
      dia.find(".message").html('是否删除选中的' + (obj.isNode()? '节点?': '关系?') 
        + (obj.isNode() ? '<br/><input value="true" type="checkbox" class="rel"/>同时删除关联关系' : ''));
      follow_render(dia, obj);
      
      dia.find(".yes").click(function() {
        var d = obj.data();
        var del_rel = dia.find('.rel').prop('checked');
        var cql = operator.genDeleteCql(d.realID, d.label, del_rel, obj.isEdge());
        
        operator.query(gen_parm(cql), (err, d)=>{
          if (err) return error('删除失败', err.message);
          msg("数据已经删除");
          obj.remove();
          cy.emit("select_none");
        });
      });
    }
  }
  
  
  function follow_render(dialog, render) {
    cy.animate({ complete, duration:1 });
    
    function complete() {
      let pos = render.renderedPosition();
      // 边会返回 null
      if (pos) {
        dialog.animate({left: pos.x + 100, top: pos.y});
      }
    }
  }
  
  
  function insert_attr() {
    cy.emit('get_select', [(err, obj)=>{
      if (err) return operator.error(err.message);
      let dia = openDialog('.new_attr_dialog');
      let msg = dia.find(".msg");
      follow_render(dia, obj);
      
      dia.find(".yes").click(function() {
        let k = dia.find("[name=k]").val();
        let v = dia.find("[name=v]").val();
        let d = obj.data();
        let cql = operator.genInsertAttrCql(d.realID, d.label, k, v, obj.isEdge());
        
        operator.query(gen_parm(cql), (err, r)=>{
          if (err) return msg.text("设置属性失败", err.message);
          msg.text("属性已经设置");
          d.x[k] = v;
          obj.data(d);
          cy.emit("update_prop", [obj]);
        });
      });
    }]);
  }
  
  
  function create_node_menu() {
    let dia = openDialog(".new_node_dialog");
    let jprop = dia.find(".prop").clone();
    let target = dia.find(".prop_target");
    let msg = dia.find(".msg");
    
    dia.find(".iprop").click(function() {
      target.before(jprop.clone());
    });
    
    dia.find(".yes").click(function() {
      let label = dia.find("[name=label]").val();
      let prop = {};
      if (!label) return msg.text("必须填写标签名");
      
      dia.find('.prop').each(function() {
        let n = $(this).find("[name=name]").val();
        let k = $(this).find("[name=val]").val();
        if (n && k) {
          prop[n] = k;
        }
      });
      
      let cql = operator.genCreateNode(label, prop);
      operator.query(gen_parm(cql), (err, r)=>{
        if (err) return msg.text("创建节点失败", err.message);
        msg.text("节点已经创建");
        dia.find(":input").val('');
      });
    });
  }
  
  
  function create_rel_menu() {
    let dia = openDialog(".new_edge_dialog");
    let jprop = dia.find(".prop").clone();
    let target = dia.find(".prop_target");
    let sl = { begin:null, end:null };
    let curr_name = null;
    let msg = dia.find(".msg");
    
    cy.on("select", on_select);
    
    dia.one('closing', function() {
      cy.removeListener('select', on_select);
    });
    
    dia.find(".iprop").click(function() {
      target.before(jprop.clone());
    });
    
    dia.find(".yes").click(function() {
      if (!sl.begin) return msg.text("必须选择起始节点");
      if (!sl.end) return msg.text("必须选择结束节点");
      let label = dia.find("[name=label]").val();
      let prop = {};
      if (!label) return msg.text("必须填写标签名");
      
      dia.find('.prop').each(function() {
        let n = $(this).find("[name=name]").val();
        let k = $(this).find("[name=val]").val();
        if (n && k) {
          prop[n] = k;
        }
      });
      
      let cql = operator.genCreateEdge(sl.begin, sl.end, label, prop);
      operator.query(gen_parm(cql), (err, r)=>{
        if (err) return msg.text("创建关系失败", err.message);
        msg.text("关系已经创建");
        dia.find(":input").val('');
        delete sl.begin;
        delete sl.end;
      });
    });
    
    dia.find(".select_node").click(function() {
      curr_name = $(this).attr("href");
      dia.find("[name='"+ curr_name +"']").val('选择节点...');
      return false;
    });
    
    function on_select(e) {
      var d = e.target.data();
      dia.find("[name='"+ curr_name +"']").val(d.id);
      sl[curr_name] = d.realID;
    }
  }
  
  
  function flash_obj(obj) {
    try {
      let bg = obj.style("background-color");
      
      _next("red", ()=>{
        _next('#fff', ()=>{
          _next('red', ()=>{
            _next('#fff', ()=>{
              _next(bg);
            });
          })
        });
      });
      
      function _next(c, n) {
        obj.animate({ style: { backgroundColor: c }, complete : n });
      }
    } catch(e) {
      console.error(e)
    }
  }
  
  
  function addNode(id, type, data) {
    if (nodes[id]) return false;
    nodes[id] = data;
    
    var st = {
      'label' : 'data(id)',
      'background-color': randomColor(),
    };
    
    if (typeof type == 'string') {
      _set_style(type);
    } else {
      type.forEach(_set_style);
    }
    
    function _set_style(type) {
      setStyle(type, st, data, { 
        colorAttr : 'background-color',
        editType  : 'node',
      });
    }
    
    cy.add({
      group   : 'nodes',
      classes : type,
      data    : { 
        id      : 'node.'+ id, 
        x       : data, 
        realID  : id ,
        label   : type,
      },
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
      'width'             : 1,
      'label'             : 'data(name)',
    }, data, {
      colorAttr : 'line-color',
      editType  : 'edge',
    });
    
    cy.add({
      group   : 'edges',
      classes : type,
      data    : { 
        id      : 'edge.'+ id, 
        name    : type, 
        source  : 'node.'+ source, 
        target  : 'node.'+ target, 
        x       : data,
        realID  : id,
        label   : type,
      } 
    });
    return true;
  }
  
  
  function setStyle(type, exstyle, attr, opt) {
    if (types[type]) {
      types[type] = $.extend(types[type], attr);
      return;
    } else {
      types[type] = $.extend({id:1}, attr);
    }
    
    const style_key = 'graph.'+ parm._id +'.style.'+ type;
    let style_change = 0;
    let st = $.extend({
      'color'     : '#aaa',
      'font-size' : '10px',
    }, exstyle, load_label_style());
    updateStyle();
    
    let editor = newStyleEditor({
      title     : type,
      type      : type,
      style     : st,
      editType  : opt.editType,
      colorAttr : opt.colorAttr,
      
      updateStyle,
      save_label_style,
    });
    
    editor.insertAttr('默认', exstyle.label);
    editor.insertAttr('id', 'data(id)');
    for (let n in attr) {
      editor.insertAttr(n);
    }
    
    function updateStyle() {
      cy.style().selector('.'+ type).style(st).update();
      style_change = 1;
    }
    
    function save_label_style() {
      if (!style_change) return;
      localStorage.setItem(style_key, JSON.stringify(st));
      style_change = 0;
    }
    
    function load_label_style() {
      try {
        return JSON.parse( localStorage.getItem(style_key) );
      } catch(e) {}
      return {};
    }
  }
  
  
  function newStyleEditor(opt) {
    const editor = template('.label_editor');
    const alist = editor.find(".attr_list");
    editor.find(".title").text(opt.title);
    editor.hide();
    editor.addClass('label_editor_instance');
    
    editor.find("form").not('.'+ opt.editType).remove();
    const form = editor.find("form");
    let in_editor_range = 0;
    
    const l = $("<label>").text(opt.type).appendTo(jlabels);
    updateLabel();
    
    l.click(function(e) {
      var attr = types[opt.type];
      jbody.trigger('close_editor');
      editor.css({
        'position': 'absolute', 
        'top'     : l.offset().top +'px', 
        'left'    : (l.offset().left + l.outerWidth()) +'px',
        'z-index' : 30,
      }).show();
      return false;
    });
    
    editor.mouseover(function() {
      in_editor_range = 1;
    }).mouseleave(function() {
      in_editor_range = 0;
    });
    
    jbody.on("close_editor", function() {
      if (in_editor_range) return;
      editor.hide();
      opt.save_label_style();
      updateLabel();
    });
    
    
    for (var n in opt.style) {
      form.find('[name="'+ n +'"]').val(opt.style[n]);
    }
    
    form.find(":input").each(function() {
      const thiz = $(this);
      const name = thiz.attr("name");
      
      thiz.change(function() {
        opt.style[name] = thiz.val();
        opt.updateStyle();
      });
    });
    
    return {
      editor,
      insertAttr,
    }
    
    function updateLabel() {
      let bg = opt.style[opt.colorAttr];
      l.css({
        'background-color' : bg,
        'color' : reverseColor(bg),
      });
    }
    
    function insertAttr(n, labelExp) {
      const li = $("<a href='#'>").text(n).appendTo(alist);
      li.click(function() {
        opt.style.label = labelExp || ('data(x.'+ n +')');
        opt.updateStyle();
        return false;
      });
    }
  }
  
  
  function eachNode(cb) {
    for (var n in nodes) {
      cb(n, nodes[n]);
    }
  }
  
  
  function capi(name, _parm, cb) {
    __api('basic', name, _parm, cb);
  }
  
  
  function api(name, _parm, cb) {
    __api(operator.module, name, _parm, cb);
  }
    
  function __api(module, name, _parm, cb) {
    var url = [parm.pf, 'app/', parm.org, '/', App, '/', module, '/', name].join('');
    if (parm.s == 'd') {
      if (typeof _parm == 'string') {
        _parm += '&s=d';
      } else {
        _parm.s = 'd';
      }
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
          operator.msg("完成");
          cb(null, data);
        } else {
          operator.error("请求 "+ name +" 时错误,", data.msg);
          cb(new Error(data.msg));
        }
      },
    });
  }
  
  
  function init_graph_type(uri) {
    if (!uri) {
      error("初始化失败, 缺少参数, 请返回图连接列表重试");
      throw new Error();
    }
    
    var type = uri.split("://")[0];
    switch (type) {
      case "bolt":
      case "bolt+ssc":
      case "bolt+s":
      case "neo4j+ssc":
      case "neo4j+s":
        type = 'neo4j';
        break;
        
      default:
        error("无法识别的 URI "+ uri);
        return;
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
    $(".label_editor_instance").remove();
    $("#data_tables").empty();
  }
  
  
  function open_analysis_form(name, parm, cb) {
    var dia = openDialog(".open_analysis_form");
    dia.find(".title").text(name);
    var message = dia.find('.message');
    var content = dia.find(".gen_target");
    message.text("正在读取...")
    
    capi('gen_form', parm, function(err, r) {
      message.text('');
      if (err) {
        content.html("错误: "+ err.message);
        return;
      }
      content.html(r.form.join(''));
      cb(dia, message, r);
    });
  }
  
  
  function update_analysis_list() {
    analysis_list.update();
  }
  
  
  function new_analysis_list() {
    var jlist = $(".analysis_list");
    
    return {
      // (d: {_id, name})
      insertAnalysis,
      update,
    };
    
    function update() {
      jlist.empty();
      
      capi('analysis_list', {connid: parm._id}, function(err, r) {
        if (err) return;
        r.data.forEach(insertAnalysis);
      });
    }
    
    function insertAnalysis(d) {
      let jdiv = $("<div>").appendTo(jlist);
      jdiv.addClass(d._id);
      
      $("<a href='#'>").text(d.name).appendTo(jdiv).click(function() {
        open_analysis_form(d.name, d, query_form);
      });
      
      $("<a href='#' class='delete_button'>x</a>").appendTo(jdiv).click(function() {
        if (!confirm('点击 "确定" 删除分析项 '+ d.name)) return;
        capi('del_analysis', d, function(err) {
          if (!err) {
            jlist.find("."+ d._id).remove();
          }
        });
      });
      
      $("<a href='#' class='edit_button'>m</a>").appendTo(jdiv).click(function() {
        var edit = new_analysis();
        edit.find(".title").text("修改分析项");
        capi('get_analysis', d, function(err, r) {
          if (err) return;
          for (var n in r.data) {
            edit.find("[name='"+ n +"']").val(r.data[n]);
          }
          edit.find("form").attr('action', 'edit_analysis');
        });
      });
    }
    
    function query_form(dia, message, r) {
      var form = dia.find("form");
      
      form.submit(function() {
        var data = form.serialize();
        var submits = form.find("[type=submit]").prop("disabled", true);
        
        capi(form.attr("action"), data, (err, r)=>{
          if (err) {
            submits.prop("disabled", false);
            message.text(err.message);
            return;
          }
          operator.query({_id:parm._id, cql: r.data.join('')}, function(err, r) {
            if (err) {
              submits.prop("disabled", false);
              message.text(err.message);
            } else {
              dia.trigger('close'); 
            }
          });
        });
        return false;
      });
      
      if (r.empty_form) {
        form.submit();
      }
    }
  }
  
  
  function new_analysis() {
    var dia = openDialog(".new_analysis_dialog");
    dia.find("[name=connid]").val(parm._id);
    
    dia.on("submit_success", function(e, r) {
      analysis_list.insertAnalysis(r.data);
      dia.trigger("close");
    });
    
    dia.find('.help').click(function() {
      dia.find(".help-text").removeClass('hide');
    });
    
    dia.find('.test').click(function() {
      var parm = {
        name : dia.find('[name=name]').val(),
        cql  : dia.find('[name=cql]').val(),
        tpl  : dia.find('[name=tpl]').val(),
      };
      if (!parm.cql) {
        dia.find(".ajax-message").text("必须填写 cql");
        return;
      }
      open_analysis_form(parm.name || parm.cql, parm, function(dia) {
        dia.find("[type=submit]").remove();
      });
    });
    return dia;
  }
  
  
  // 可用安全的在一个 dom 上多次调用
  // 对话框可移动位置, 默认显示, 绑定关闭按钮
  // 绑定表单递交
  function openDialog(sl) {
    const dia = $(sl).not('.usage').clone().appendTo(jbody);
    const form = dia.find("form");
    const amsg = form.find(".ajax-message");
    let x = 0, y = 0, dx = 0, dy = 0;
    let closed = false;
    
    dia.addClass("usage");
    dia.show().center();
    
    // jbody.one("close_editor", _close);
    // dia.click(()=>{ return false; });
    dia.find(".close").click(_close);
    dia.find("[href=close]").click(_close);
    dia.css("z-index", dialogIndex++);
    dia.on("close", _close);
    
    dia.find("h5").mousedown((e)=>{
      x = e.pageX;
      y = e.pageY;
      let off = dia.position();
      dx = off.left;
      dy = off.top;
      jbody.one('mouseup', ()=>{
        jbody.off('mousemove', _move);
      });
      jbody.mousemove(_move);
    });
    
    form.submit(function() {
      var data = form.serialize();
      capi(form.attr("action"), data, (err, r)=>{
        if (err) {
          amsg.text(err.message);
          return;
        }
        form.trigger("submit_success", r);
        msg("完成");
      });
      return false;
    });
    
    function _move(e) {
      dia.offset({
        left : dx + e.pageX - x,
        top  : dy + e.pageY - y,
      });
    }
    
    function _close() {
      if (closed) return;
      dia.trigger("closing");
      closed = true;
      dia.hide();
      dia.find(":input").val('');
      jbody.off('mousemove', _move);
      dia.remove();
      --dialogIndex;
      return false;
    }
    return dia;
  }
  
  
  function gen_parm(cql) {
    return {
      cql   : cql,
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
      putx(rc, c, d);
    }
    
    function putx(r, c, d) {
      let tw = table.body[r];
      if (!tw) {
        tw = table.body[r] = [];
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
    
    function rowNum() {
      return rc;
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
      // (row, col, data) 向指定行列插入数据
      putx,
      // () 下一行数据
      next,
      // () 有数据返回 true
      hasData,
      // () 显示表格
      show,
      // () 返回当前行号
      rowNum,
    }
  }
});
console.log("上海竹呗信息技术有限公司, 版权所有 http://xboson.net");