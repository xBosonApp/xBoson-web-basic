(function($) {
  
if (window.xb) return;
  
var nameCache = {};
var ebus = {};
var dataPool = {};

//
// 消息类型
//
var events = {
  // 表格行选择事件, 参数是当前行选择行的数据集, 
  // 参数为 null 时说明没有选择任何行
  SELECT_TABLE_ROW : 'SELECT_TABLE_ROW',
  // 请求表格重新从数据源获取内容并更新画面.
  TABLE_UPDATE_REQ : 'TABLE_UPDATE_REQ',
  // 当 api 接口返回后的事件, 参数是接口的返回数据集.
  FORM_API_RESULT  : 'FORM_API_RESULT',
  // 画面重新绘制后发出这个时间, 不需要事件 id
  PAGE_UPDATED     : 'PAGE_UPDATED',
  // 关闭组件的请求
  CLOSE            : 'CLOSE',
  // 组件被用户按下
  CLICK            : 'CLICK',
};


var xb = window.xb = {
  getDictNameByTypecd : getDictNameByTypecd,
  createDataTable     : createDataTable,
  select2fromApi      : select2fromApi,
  setupPagination     : setupPagination,
  sendEvent           : sendEvent,
  emit                : sendEvent,
  regListener         : regListener,
  on                  : regListener,
  events              : events,
  selectedTable       : selectedTable,
  usebilityControl    : usebilityControl,
  autoWidth           : autoWidth,
  sendDataRequest     : sendDataRequest,
  getText             : getText,
  regListenerWithCode : regListenerWithCode,
  toggleDisplay       : toggleDisplay,
  postDataUseApi      : postDataUseApi,
  sendApiResultEvent  : sendApiResultEvent,
  valiStrMinMax       : valiStrMinMax,
  valiStruct          : valiStruct,
  vali_bind           : vali_bind,
  deleteControl       : deleteControl,
  eval_short          : eval_short,
  auto_filter         : auto_filter,
  save_data           : save_data,
  load_data           : load_data,
  dataToForm          : dataToForm,
  
  // 事件处理框架
  getEventSettingFromParent      : getEventSettingFromParent,
  dealEventToDom                 : dealEventToDom,
  findEventDealFromParentAndSend : findEventDealFromParentAndSend,
};


//
// 向消息总线发送消息
// type : 来自 events 中定义的常量.
// id   : 发出组件的 ide
// message: 消息参数
//
function sendEvent(type, id, message) {
  zy.log("Send Event", type, id, message);
  getEvent(type, id).fire(message);
}


//
// 注册消息监听器
//
function regListener(type, id, callback) {
  if (typeof id == 'function' && type.type && callback == undefined) {
    callback = id;
    id       = type.id;
    type     = type.type;
  }
  
  if (!callback) throw new Error("xboson.js:regListener callback is null");
  getEvent(type, id).add(callback);
  zy.log("Reg Event Listener", type, id);
  return {
    remove: function() {
      getEvent(type, id).remove(callback);
    },
  };
}


//
// 内部函数, 构造消息总线
//
function getEvent(type, id) {
  if (type == events.PAGE_UPDATED) id = 'GLOBAL';
  if (!type) throw new Error("xboson.js:getEvent type is null");
  if (!id  ) throw new Error("xboson.js:getEvent id is null");
  var n = type +":"+ id;
  var v = ebus[n];
  if (!v) {
    v = ebus[n] = $.Callbacks();
  }
  return v;
}


//
// 返回字典的名称
//
function getDictNameByTypecd(typecd, cb) {
  if (nameCache[typecd]) {
    cb(nameCache[typecd]);
    return;
  }
  zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
  zy.g.am.mod = 'DataDict';
  zy.net.get('api/getname', function(ret) {
    var r = ret && ret.result && ret.result[0];
    if (r && r.typenm) {
      var name = r.typenm;
      nameCache[typecd] = name;
      cb(name);
    }
  }, { typecd: typecd });
}


//
// 在 jobj 对象上渲染分页组件, 返回后 pageset 绑定更新方法.
//
function setupPagination(jobj, pageset, pageChangeCB) {
  var updating = false;
  
  pageset.onPageChange = function(num) {
    pageset.currentPage = num;
    if (!updating) pageChangeCB(pageset);
  };
  
  pageset.update = function() {
    updating = true;
    if (pageset.totalCounts > 0) {
      jobj.show();
      jobj.jqPaginator(pageset);
    } else {
      jobj.hide();
    }
    updating = false;
  };
  
  jobj.jqPaginator(pageset);
};


//
// 处理 get/post 返回结果, 弹出消息, 发送数据到消息总线
// _cb : function(err)
//
function sendApiResultEvent(ret, id, _cb) {
  try {
    if (ret) {
      if (ret.code == 0) {
        zy.ui.msg("成功", ret.msg, 's');
        xb.sendEvent(xb.events.FORM_API_RESULT, id, ret);
        _cb && _cb();
      } else {
        zy.ui.msg("失败", ret.msg, 'e');
        _cb && _cb(new Error(ret.msg));
      }
    }
  } catch(err) {
    zy.ui.msg("异常", err.message, 'e');
    console.error(err);
    _cb && _cb(err);
  }
}


//
// 从父节点获取消息定义, 这些消息固定的写在标签属性上
//
function getEventSettingFromParent(jdata) {
  var pt_event  = jdata.parents("[data-event-type]").first();
  var evet_type = pt_event.data('event-type');
  var evet_id   = pt_event.attr("id") || pt_event.data('id');
  var NAME      = 'getEventSettingFromParent';
  
  if (!pt_event.length) return zy.ui.msg(NAME, '找不到含有 data-event-type 的父组件', 'w'); 
  if (!evet_type) return zy.ui.msg(NAME, 'event-type 定义无效', 'w');
  if (!evet_id) return zy.ui.msg(NAME, 'id 定义无效', 'w');
  return {
    type  : evet_type,
    id    : evet_id,
    jdata : jdata,
  };
}


//
// 在 jdom 上绑定事件监听器 (允许子节点发现该容器的监听器)
//
function dealEventToDom(jdom, eventType, eventFn) {
  var id = jdom.attr("id") || jdom.data("id");
  jdom.addClass('deal-event-'+ eventType);
  xb.regListener(eventType, id, eventFn);
}


//
// 找到能处理 dealEvent 事件的父容器, 并发送这个事件, 参数是 jdata.
// 用于发现代码中定义的事件, 与 getEventSettingFromParent 区别.
//
function findEventDealFromParentAndSend(jdata, dealEvent) {
  var jtag = jdata.parents('.deal-event-'+ dealEvent).first();  
  if (jtag.length) {
    var id = jtag.attr('id') || jdom.data("id");
    if (id) {
      xb.sendEvent(dealEvent, id, jdata);  
    } else {
      zy.ui.msg("deal-event", "组件 "+ jtag.selector +" 没有 id 属性", 'w');
    }
    return jtag;
  }
  zy.ui.msg("deal-event", "没有找到能处理 "+ dealEvent + " 事件的父组件", 'w');
}


//
// 从 jdata 的 _name 数据中获取代码并执行, 适合执行小的代码片段.
//_name: 默认为 'when'
// _cb: function(err, data, isnull)
//
function eval_short(jdata, _name, context, _cb) {
  var when  = jdata.data(_name || 'when');
  if (when) {
    try {
      var fn = eval('(function() { return '+ when +'})');
      _cb(null, fn.apply(context));
    } catch(e) { 
      zy.ui.msg("eval_short 表达式错误", e.stack, 'e');
      console.error("Code:", when, "Context:", context, e);
      _cb(e);
    }
  } else {
    _cb(null, null, true);
  }
}


//
// Get 方法调用接口, jdata 中有 data[app, mod, api], jform 是表单参数,
// pageset 可以空
//
function sendDataRequest(jdata, jform, pageset, reciveDataCB) {
  if (pageset) {
    zy.g.am.pagesize = pageset.pageSize;
    zy.g.am.pagenum  = pageset.currentPage;
  }
  zy.g.am.app = jdata.data('app');
  zy.g.am.mod = jdata.data('mod');
  var api = 'api/'+ jdata.data('api');
  var conditions = jform.jquery ? jform.serialize() : jform;
  
  zy.net.get(api, reciveDataCB, conditions, pageset && pageset.currentPage);
}


//
// Get 方法调用接口, jdata 中有 data[app, mod, api], jform 是表单参数
//
function postDataUseApi(jdata, jform, reciveDataCB) {
  zy.g.am.app = jdata.data('app');
  zy.g.am.mod = jdata.data('mod');
  var api = 'api/'+ jdata.data('api');
  var conditions =jform.jquery ? jform.serialize() : jform;
  
  zy.net.post(api, reciveDataCB, conditions, 0, reciveDataCB, new Error());
}


//
// 绑定 form 查询条件表单, 从接口获取数据, 绑定分页.
//
function createDataTable(table) {
  var id      = table.attr('id');
  var form    = $(table.data('form'));
  var pageset = defaultPageset();
  var mapper  = table.find('.table_mapper');
  
  var pagination      = table.parent().find('.auto_tag_table_api_pagination');
  var total_count_num = table.parent().find('.total_count_num');
  
  var options = $.extend({}, zy.ui.dataTable, {
    "data"      : [],
    "columns"   : getColumnMapper(mapper),
  });
  
  regListener(events.TABLE_UPDATE_REQ, id, request);
  selectedTable(table, onselect);
  form.submit(request);
  
  setupPagination(pagination, pageset, function() {
    request();
  });
  
  
  function request() {
    sendDataRequest(table, form, pageset, reciveData);
  }
  
  function reciveData(ret) {
    if (ret && ret.code==0) {
      var rows = ret[table.data('dataName')] || ret.data || ret.result;
      pageset.totalCounts = ret[table.data('dataName')+'_count'] || ret.count || ret.result_count || 0;
      pageset.update();
      total_count_num.text("总数："+ pageset.totalCounts);
      // 如果没有生成配置, 则使用表格数据生成动态表格
      if (!options.columns) {
        options.columns = getColumns(rows);
        generateHead();
      }
      options.data = rows || [];
      
      if (table.fnClearTable) {
        table.fnClearTable();
        delete options.aaData;
      }
      table.dataTable(options);
      onselect(null);
    }
  }
  
  function onselect(data) {
    if (id) sendEvent(events.SELECT_TABLE_ROW, id, data);
  }
  
  function getColumns(rows) {
    var names = [];
    if (rows && rows[0]) {
      var r = rows[0];
      for (n in r) {
        names.push({
          'data': n,
        });
      }
    }
    return names;
  }
  
  function getColumnMapper(mapper) {
    if (mapper.length < 1) return;
    var names = [];
    
    mapper.each(function() {
      var thiz = $(this);
      var func = thiz.find('.render_function');
      var render_func;
      
      if (func.length) {
        render_func = eval('('+ func.text() +')');  
      } 
      
      names.push({
        'render' : render_func,
        'data'   : thiz.attr('key'),
      });
    });
    return names;
  }
  
  function generateHead() {
    var head = table.find('thead');
    options.columns.forEach(function(hset) {
      $('th').text(hset.data).appendTo(head);
    });
  }
  
  function defaultPageset() {
    return { 
      totalCounts : 1, 
      pageSize    : zy.g.page.pagesize, 
      currentPage : 1, 
      update      : function() {},
    };
  }
}


//
// 从 api 返回的数据组装为 selet2
//
function select2fromApi(jobj) {
  zy.g.am.app = jobj.data('app');
  zy.g.am.mod = jobj.data('mod');
  zy.net.get('api/'+ jobj.data('api'),function(msg){
    if(msg){
      jobj.zySelectCustomData('', false, { width:'100%' }, msg.result);  
    }
  });
}


//
// 使表格的行可以选择 (并固定)
//
function selectedTable(jtable, selectcb) {
  jtable.on('click', 'tr', function(e) {
    // 当前选择行 index
    var thiz = $(this);
    if (thiz.find('th').is('th') || thiz.find('td').hasClass('dataTables_empty')) {
      selectcb();
      return false;
    }
    
    // 变换选择行状态颜色
    if (!thiz.find('div').hasClass('popover') && thiz.hasClass('active')) {
      thiz.removeClass('active');
      //$('#user_view_edit').btnDisable(true);
    } else {
      jtable.DataTable().$('tr.active').removeClass('active');
      thiz.addClass('active');
      //$('#user_view_edit').btnDisable(false);
    }
    selectcb(jtable.DataTable().row('.active').data(), thiz);
  });
}


//
// 控制组件 可用/不可用
//
function usebilityControl(accused) {
  var thiz = $(accused);
  var id   = thiz.attr('recvid');
  var from = $('#'+id);
  var ctrl = thiz.parent().add(thiz);
  ctrl.prop('disabled', true);
  
  from.each(function() {
    var tagname = this.tagName.toLowerCase();
    var from = $(this);
    
    // 不同的控制组件发出不同的消息
    switch (tagname) {
      case 'table':
        regListener(events.SELECT_TABLE_ROW, id, function(data) {
          ctrl.prop('disabled', !data);
        });
        break;
    }
  });
}


function deleteControl(jdata, deletedcb) {
  var dataid    = jdata.data('id');
  var pri       = jdata.data('primary');
  var curr_data = {};
  var button    = jdata.parent();
  
  if (!dataid) return zy.ui.msg("&lt;mp:delete>", "dataid 参数无效", 'w');
  if (!pri) return zy.ui.msg("&lt;mp:delete>", "primary 参数无效", 'w');
  if (!button.length) return zy.ui.msg("&lt;mp:delete>", "父级标签没有按钮", 'w');
  
  button.click(function() {
    zy.ui.mask("删除数据", "数据将被删除! 请确认, 如果误操作请 '取消'.", function() {
      curr_data[pri] = load_data(dataid)[pri];
      sendDataRequest(jdata, curr_data, 0, function(ret) {
        sendApiResultEvent(ret, dataid, function(err) {
          deletedcb(err, dataid, curr_data);
        });
      });
    });
  });
}


//
// 依据 frame 子元素 col 的排列来返回宽度, 以更好的显示窗口.
//
function autoWidth(frame) {
  var width = '';
  if (frame.find('.col-1').length) {
    width = '90%';
  }
  else if (frame.find('.col-2').length) {
    width = '84%';
  }
  else if (frame.find('.col-3').length) {
    width = '75%';
  }
  else if (frame.find('.col-4').length) {
    width = '66%';
  }
  else if (frame.find('.col-5').length) {
    width = '59%';
  }
  else if (frame.find('.col-6').length) {
    width = '50%';
  }
  return width;
}


//
// 获取文本.
// url -- 以 '/' 开始则从 paas 下获取文件, 否则在 saas 中获取文件
// callback -- Function(err, text);
//
function getText(url, callback) {
  var _u = zy.g.host.ui + (zy.debug? '/t':'/ui');
  if ('/' === url.charAt(0)) {
    _u += '/paas/'+ url;
  } else {
    _u += '/saas/' + zy.g.comm.org + '/' + url;
  }
  
  $.ajax({
    type: 'get', url: _u, dataType: 'text', // data: { '_': Date.now() },
    success: function(txt) {
      callback(null, txt);
    },
    error: function(xhr, ajax, error) {
      callback(error);
    },
  });
}


//
// 设置(消息总线)事件监听器,
// code -- js 代码文本, 代码中必须返回一个函数
// type -- 消息类型
// pid  -- 消息 id
//
// 函数模板: (function(data, type, id, handle) { })
//    data   : 接收发来的数据.
//    type   : 消息类型
//    id     : 消息 id
//    handle : 标签本身的 jquery 对象
//
function regListenerWithCode(code, type, pid, handle) {
  if (!code) {
    return zy.ui.msg("regListenerWithCode", "代码无效<br/>", 'e');
  }
  var fn = eval('('+ code + ')');
  if (typeof fn != 'function') {
    return zy.ui.msg("regListenerWithCode", "标签体中必须定义一个函数<br/>"+code, 'e');
  }
  
  xb.regListener(type, pid, function(data) {
    try {
      fn(data, type, pid, handle);
    } catch(e) {
      zy.ui.msg("regListenerWithCode 处理器异常", e.stack, 'e');
      throw e;
    }
  });
}


function toggleDisplay(controlor, accusedSelector, reverse) {
  var refindcb = jQuery.Callbacks();
  var accused;
  var ret = {
    setDisplay : setDisplay,
    onrefind   : function(fn) { refindcb.add(fn) },
  };
  
  refind();
  regListener(events.PAGE_UPDATED, null, refind);
  
  function refind() {
    accused = $(accusedSelector);
    refindcb.fire();
  }
  
  function setDisplay(disp_bool) {
    if (reverse) {
      if (!disp_bool) {
        accused.show();
      } else {
        accused.hide();
      }
    } else {
      if (disp_bool) {
        accused.show();
      } else {
        accused.hide();
      }
    }
  }
  
  return ret;
}


//
// 构建 字符串 验证配置
//
function valiStrMinMax(struct) {
  var fieldname = struct.unit.attr('name');
  var tagname = struct.tagname;
  var max  = struct.jdata.attr('max');
  var min  = struct.jdata.attr('min');
  
  if (isNaN(min) || min < 0) {
    zy.ui.msg(tagname +" 标签异常", 'min 值无效', 'w');
  }
  if (max && max < min) {
    zy.ui.msg(tagname +" 标签异常", 'max 值无效', 'w');
  }
  
  var rules = struct.setting.rules;
  //
  // 必须写成合并式的语法.
  //
  rules[fieldname] = $.extend(true, rules[fieldname], {
    required  : min > 0,
    minlength : parseInt(min),
    maxlength : parseInt(max) || Number.MAX_VALUE,
  });
  vali_bind(struct);
}


//
// 将配置与 form 绑定
//
function vali_bind(struct) {
  var v = struct.form.validate(struct.setting);
  // hack the validate settings.
  $.extend(true, v.settings.rules, struct.setting.rules);
}


//
// 构建 validate 结构, 返回验证数据结构对象.
//
function valiStruct(jdata, tagname) {
  var form = jdata.parents("form").first();
  var unit = jdata.parent();
  
  if (! unit.is(":input")) {
    unit = unit.find(":input");
  }
  if (unit.length < 1) {
    return zy.ui.msg(tagname +" 标签异常", '没有找到父级表单元件', 'e');
  }
  if (form.length < 1) {
    return zy.ui.msg(tagname +" 标签异常", '没有找到表单', 'e');
  }
  
  var setting = form.data("vali:data");
  if (!setting) {
    setting = { rules: {}, message: {} };
    form.data("vali:data", setting);
  }
  
  setting.errorPlacement = function(error, element) {  
    error.insertAfter(element);
    error.css({'position': 'absolute', 'right': '1px'});
  };
  
  return {
    unit    : unit,
    form    : form,
    setting : setting,
    tagname : tagname,
    jdata   : jdata,
  };
}


//
// 返回被选中的 jquery 对象, 这些对象被标记为处理过.
// 下次再经过该函数的对象将被过滤
//
function auto_filter(selector) {
  var className = 'auto_tag__flag__is_processed';
  var s = $(selector);
  s = s.filter(":not(."+ className +")");
  s.addClass(className);
  return s;
}


function save_data(id, val) {
  dataPool[id] = val;
}


function load_data(id) {
  return dataPool[id];
}


//
// 将行数据推入表单中, row 的键名对应表单控件的 name, 值压入控件的 value
//
function dataToForm(row, jform) {
  for (var name in row) {
    jform.find("[name='"+ name +"']").val(row[name]);
    //console.log(name, row[name], jform.find("[name='"+ name +"']"))
  }
}


})(jQuery);