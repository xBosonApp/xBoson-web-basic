//
// 从父窗口获取 zy 对象, 并继承 jQuery 功能
//
window.zy = window.parent.zy;
for (var n in window.parent.jQuery.fn) {
  if (!$.fn[n]) {
    $.fn[n] = window.parent.jQuery.fn[n];
  }
}


//
// 被 wpt.js 调用, 创建 zy 数据源模块
//
function createZySrcHtml(wptc) {
  var searchroot;
  
  var root = $('<div class="root"/>');
  root.append('<p>选择模型</p>');
  var sel = $('<input type="hidden" data-type="select2"/>');
  root.append(sel);
  var ok = $('<button>确定</button>');
  root.append(ok);
  
  _do_call_get_module_tree(function(err, data) {
    if (err) return zy.ui.msg(err);
    sel.zySelectCustomData('', false, {width:'100%'}, data);
  });
  
  ok.click(function() {
    _do_call_get_module_data(sel.select2('data'), null, function(err, data) {
      if (err) return zy.ui.msg(err, 'Error', 'e');
      buildSearch(data);
      trans_zy_piot(data, function(err, h, b) {
        if (err) return zy.ui.msg(err, 'Error', 'e');
        setData(h, b);
      });
    });
  });
  
  return {domNode: root[0]};
  
  //
  // 创建查询条件表单
  //
  function buildSearch(zdata) {
    try {
      if (!searchroot) {
        searchroot = $('<div class="root"/>');
        wptc.modalContext.zyLoadPane.addChild({ 
          domNode: searchroot[0], 
          _started: true,
          isLeftToRight: function() { return true; }
        });
        
        wptc.modalContext.loadContainer.selectChild(
          wptc.modalContext.zyLoadPane);
      }
      searchroot.html('');
      
      if (zdata.search && zdata.search.length) {
        searchroot.append('<h4>查询条件</h4>');
        var form = $('<form class="piot_search"></form>');
        searchroot.append(form);
        
        zdata.search.forEach(function(s, i) {
          var div = $('<div class="item"/>');
          var label = $('<label>' + s.cn + '</label>');
          var input;
          if (s.dict) {
            input = bindDict(s.dict);
          } else {
            input = $('<input/>');
          }
          input.attr({ type: s.elemtype, name: s.en });
          div.append(label).append(input);
          form.append(div);
        });
        form.append('<input type="submit"/>');
        
        form.submit(function() {
          var parm = form.serializeArray();
          
          _do_call_get_module_data(sel.select2('data'), parm, function(err, data) {
            if (err) return zy.ui.msg(err, 'Error', 'e');
            trans_zy_piot(data, function(err, h, b) {
              if (err) return zy.ui.msg(err, 'Error', 'e');
              setData(h, b);
            });
          });
          return false;
        });
      }
      //console.log(zdata.search)
    } catch(e) {
      zy.ui.msg(e.stack, e, 'e');
    }
  }
  
  //
  // 设置数据源, head=[], body=[[],[],...]
  //
  function setData(head, body) {
    wptc.loadDataArray(head, body, null, function(j) {
      wptc.updateLoadedSourcePane({
          mode: "MEMORY",
          url: '',
          data: j.data,
          fields: j.fields
      });
    }, function(j) {
        wptc.setMessage({
            text: j.message || j
        });
    });
  }
}

//
// 创建字典选择列表
//
function bindDict(dict) {
  var select = $('<select></select>');
  zy.org.cache.initDicts(dict, zy.g.comm.org, function() {
    //jinput.attr({type: 'hidden'});
    //jinput.orgSelect(dict, zy.g.comm.org, false, {width: '100%'});
    var ret = zy.org.cache.getDict(dict, zy.g.comm.org);
    ret.forEach(function(item) {
      var opt = $('<option/>');
      opt.attr('value', item.id);
      opt.html(item.name);
      select.append(opt);
    });
    console.log('bind dict.', ret);
  });
  return select;
}

//
// zy 平台数据转换为 piot 数据
//
function trans_zy_piot(zyd, rcb) {
  try {
    var head = [];
    var body = [];
    var hi = [];
    
    zyd.type.forEach(function(h, i) {
      head[i] = h.cn || h.en;
      hi[h.en] = i;
    });
    
    zyd.data.forEach(function(r, i) {
      if (!body[i]) body[i] = [];
      for (var cn in r) {
        body[i][ hi[cn] ] = r[cn]; 
      }
    });
    
    rcb(null, head, body);
  } catch(e) {
    rcb(e);
  }
}


//
// 查询模型列表
//
function _do_call_get_module_tree(rcb) {
  zy.g.am.app="c770045becc04c7583f626faacd3b456";
  zy.g.am.mod="bmtree";
  zy.net.get('api/getmddmtree',function(msg2){
    if(msg2&&msg2.ret=='0'){
      rcb(null, msg2.result);
    }
  });
}


//
// 获取模型数据
//
function _do_call_get_module_data(selected_md, url_parm, rcb) {
  if (!selected_md) {
    return rcb('选择一个模型');
  }
  zy.g.am.app = 'c770045becc04c7583f626faacd3b456';
  zy.g.am.mod = 'commapi';
  var api = 'api/';
  
  if (selected_md.bm003 == '1') {
    api += 'exc_select';
  }
  else if (selected_md.bm004 == '1') {
    api += 'exc_chart_select';
  }
  else {
    return rcb('目录不能查询');
  }
  
  var parm = {
    modolcd: selected_md.typecd
  };
  if (url_parm) {
    url_parm.forEach(function(p) {
      parm[p.name] = p.value;
    });
  }
  
  zy.net.get(api ,function(ret){
    if(ret && ret.ret=='0'){
      // console.log(ret)
      rcb(null, ret);
    }
  }, parm);
}

