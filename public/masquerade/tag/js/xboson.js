(function($) {
  
if (window.xb) return;
  
var nameCache = {};
var ebus = {};
var dataPool = {};
var zy = getZY();

//
// 消息类型
//
var events = {
  // 表格行选择事件, 参数是当前行选择行的数据集, 
  // 参数为 null 时说明没有选择任何行
  SELECT_TABLE_ROW : 'SELECT_TABLE_ROW',
  // 请求表格重新从数据源获取内容并更新画面.
  TABLE_UPDATE_REQ : 'TABLE_UPDATE_REQ',
  // 表格数据已经构建完成.
  TABLE_DATA_READY : 'TABLE_DATA_READY',
  // 当 api 接口返回后的事件, 参数是接口的返回数据集.
  FORM_API_RESULT  : 'FORM_API_RESULT',
  // 画面重新绘制后发出这个时间, 不需要事件 id
  PAGE_UPDATED     : 'PAGE_UPDATED',
  // 关闭组件的请求
  CLOSE            : 'CLOSE',
  // 组件已经关闭发出这个消息
  CLOSED           : 'CLOSED',
  // 组件被用户按下
  CLICK            : 'CLICK',
  // 页面销毁时被调用
  PAGE_DESTROY     : 'PAGE_DESTROY',
};

//
// 不区分消息 id 的消息.
//
var global_events = new Set([
  events.PAGE_DESTROY, events.PAGE_UPDATED,
]);


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
  valiNumberMinMax    : valiNumberMinMax,
  valiStruct          : valiStruct,
  vali_bind           : vali_bind,
  deleteControl       : deleteControl,
  eval_short          : eval_short,
  auto_filter         : auto_filter,
  save_data           : save_data,
  load_data           : load_data,
  dataToForm          : dataToForm,
  warn                : warn,
  safeHtml            : safeHtml,
  openDialog          : openDialog,
  apiURL              : apiURL,
  refreshAllDict      : refreshAllDict,
  getTableConfig      : getTableConfig,
  configDictDialog    : configDictDialog,
  stringifyUsedTime   : stringifyUsedTime,
  pageDestroy         : pageDestroy,
  sendToEachParents   : sendToEachParents,
  createLogger        : createLogger,
  api                 : callapi,
  waitDisplay         : waitDisplay,
  iframeMax           : iframeMax,
  
  // 事件处理框架
  getEventSettingFromParent      : getEventSettingFromParent,
  dealEventToDom                 : dealEventToDom,
  findEventDealFromParentAndSend : findEventDealFromParentAndSend,
};


jQuery.fn.extend({
  smartval : jqSmartValue,  
});

// 当页面销毁时清空消息总线
xb.on(events.PAGE_DESTROY, null, onPageDestroy);


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
  if (global_events.has(type)) id = '*';
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
// 遍历所有父级组件, 只要组件有 id 属性, 就向组件发布 type 消息, id 就是 组件 id.
// 比如 close 事件需要向父组件散发, 使用该方法.
//
function sendToEachParents(jdata, type, data) {
  jdata.parents().each(function() {
    var target = $(this);
    var eid    = target.attr("id") || target.data('id');
    if (eid) {
      xb.emit(type, eid, data);
    }
  });
}


function onPageDestroy(newPage) {
  ebus = {};
  dataPool = {};
  xb.on(events.PAGE_DESTROY, null, onPageDestroy);
}


function pageDestroy(d) {
  xb.emit(events.PAGE_DESTROY, null, d);
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
    xb.warn("异常", err.message, 'e');
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
  var id        = jdata.data('id');
  var NAME      = 'getEventSettingFromParent::'+id;
  
  if (!pt_event.length) return xb.warn(NAME, '找不到含有 data-event-type 的父组件', 'w'); 
  if (!evet_type) return xb.warn(NAME, 'event-type 定义无效', 'w');
  if (!evet_id) return xb.warn(NAME, 'id 定义无效', 'w');
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
  throw new Error("dealEventToDom() 废弃");
  var id = jdom.attr("id") || jdom.data("id");
  jdom.addClass('deal-event-'+ eventType);
  xb.regListener(eventType, id, eventFn);
}


//
// 找到能处理 dealEvent 事件的父容器, 并发送这个事件, 参数是 jdata.
// 用于发现代码中定义的事件, 与 getEventSettingFromParent 区别.
//
function findEventDealFromParentAndSend(jdata, dealEvent) {
  throw new Error("findEventDealFromParentAndSend() 废弃");
  var jtag = jdata.parents('.deal-event-'+ dealEvent).first();  
  if (jtag.length) {
    var id = jtag.attr('id') || jdom.data("id");
    if (id) {
      xb.sendEvent(dealEvent, id, jdata);  
    } else {
      xb.warn("[deal-event]", "组件 "+ jtag.selector +" 没有 id 属性", 'w');
    }
    return jtag;
  }
  xb.warn("[deal-event]", "没有找到能处理 "+ dealEvent 
    +"(From:"+ jdata.data('id')||jdata.attr('id') +") 事件的父组件", 'w');
}


function warn(title, msg, _err) {
  var type;
  if (!_err) {
    type = 'w';
  } else if (typeof _err == 'string') {
    type = _err;
  } else {
    type = 'e';
  }
  
  var stack = (_err && _err.stack) || new Error('xboson.js::warn()').stack;
  console.warn(title, msg, stack);
  if (zy.debug) {
    msg = [msg, "<pre style='color: #fff; background: rgba(255, 255, 255, 0);", 
          "border:0;'>", stack, "</pre>"].join('');
  }
  zy.ui.msg(title, msg, type);
  return false;
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
      xb.warn("eval_short 表达式错误", e.stack, 'e');
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
  var tableObj;
  
  var pagination      = table.parent().find('.auto_tag_table_api_pagination');
  var total_count_num = table.parent().find('.total_count_num');
  
  var options = $.extend(null, {}, zy.ui.dataTable, {
    "data"      : [],
  });
  setTimeout(init, 230);
  
  
  function init() {
    regListener(events.TABLE_UPDATE_REQ, id, request);
    selectedTable(table, onselect);
    form.submit(request);
    
    if (table.data('hidepage')) {
      pagination.hide();
      request();
    } else {
      setupPagination(pagination, pageset, request);
    }
  }
  
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
        if (mapper.length > 0) {
          options.columns = getColumnFromMapper(mapper);
        } else {
          options.columns = getColumnsFromData(rows);
          generateHead();
        }
      }
      
      options.data = rows || [];
      
      if (tableObj) {
        tableObj.destroy();
        delete options.aaData;
      }
      tableObj = table.DataTable(options);
      onselect(null);
      sendEvent(events.TABLE_DATA_READY, id, ret);
    }
  }
  
  function onselect(data) {
    if (id) sendEvent(events.SELECT_TABLE_ROW, id, data);
  }
  
  function getColumnsFromData(rows) {
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
  
  function getColumnFromMapper(mapper) {
    var names = [];
    
    mapper.each(function() {
      var render_func;
      var thiz = $(this);
      
      var config = thiz.find('.render_function');
      var delayid = config.data('delay-function');
      if (delayid) {
        render_func = function(data, type, row, meta) {
          var fn = config.data(delayid);
          return fn ? fn(data, type, row, meta) : data;
        };
      } 
      else {
        var code = config.text();
        if (code) {
          render_func = eval('('+ code +')');  
        }
      }
      
      names.push({
        'render' : render_func,
        'data'   : thiz.attr('key'),
      });
    });
    return names;
  }
  
  function generateHead() {
    var headdrawd = false;
    options.headerCallback = function(thead, data, start, end, display) {
      if (headdrawd) return;
      headdrawd = true;
      options.columns.forEach(function(hset, i) {
        $('<th>').text(hset.data).appendTo(thead);
        console.log(hset.data)
      });
    };
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
// 返回 api 调用完整地址
// 如果有 jobj 则后面的参数被忽略
//
function apiURL(jobj, _app, _mod, _api) {
  if (jobj) {
    _app = jobj.data('app');
    _mod = jobj.data('mod');
    _api = jobj.data('api');
  }
  var url = [ zy.g.host.api,'app/', zy.g.comm.org, '/', _app, '/', _mod, '/', _api ];
  return url.join('');
}


//
// 从 api 返回的数据组装为 selet2, 支持标准分页参数.
// select doc: /xboson/face/t/paas/lib/js/plugin/select2/Select2-3.4.8.html
//
function select2fromApi(jobj) {
  var url           = xb.apiURL(jobj);
  var id_field      = jobj.data('id_field')   || 'id';
  var text_field    = jobj.data('text_field') || 'text';
  var result_field  = jobj.data('result_field');
  var pagesize      = parseInt(zy.g.page.pagesize) || 10;
  var val           = jobj.val();
  var count;
  
  jobj.select2({
    placeholder : "查找...", //默认显示的文本
    allowClear  : true, //选择后出现清除按钮图标
    width       : '100%',
    ajax: {
      url     : url,
      data    : getQuery,
      results : filterResult,
    },
    initSelection: initSelection,
  });
  return jobj;
  
  
  function initSelection(element, callback) {
    if (!val) return;
    var q = {};
    q[id_field] = jobj.val();
    
    $.get(url, q, function(r) {
      var arr = r && (r[result_field] || r.data || r.result);
      if (arr && arr[0]) {
        callback({
          id   : arr[0][id_field],
          text : arr[0][text_field],
        });
      }
    });
  }
  
  
  function filterResult(data, page, context) {
    var arr = data[result_field] || data.data || data.result;
    var ret = [];
    count   = data.count;
    
    for (var i=arr.length-1; i>=0; --i) {
      var id = arr[i][id_field];
      var tx = arr[i][text_field];
      
      if (id && tx) {
        ret.push({ id:id, text:tx }) ;
      } else {
        xb.warn("中断 select2fromApi", '设置的字段没有有效数据<br/>'+ url 
            +'<br/>id_field:'+ id_field +"<br/>text_field:"+ text_field);
        break;
      }
    }
    
    return {
      more    : page * pagesize < count,
      results : ret,
    };
  }
  
  
  function getQuery(term, page, context) {
    var query = {
      pagenum  : page || 1,
      pagesize : pagesize,
      count    : count,
    };
    //
    // 用文本域做搜索条件
    //
    query[text_field] = term;
    return query;
  }
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
  
  if (!dataid) return xb.warn("&lt;mp:delete>", "dataid 参数无效", 'w');
  if (!pri) return xb.warn("&lt;mp:delete>", "primary 参数无效", 'w');
  if (!button.length) return xb.warn("&lt;mp:delete>", "父级标签没有按钮", 'w');
  
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
// HTTP GET 获取文本.
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
    return xb.warn("regListenerWithCode", "代码无效<br/>", 'e');
  }
  var fn = eval('('+ code + ')');
  if (typeof fn != 'function') {
    return xb.warn("regListenerWithCode", "标签体中必须定义一个函数<br/>"+code, 'e');
  }
  
  xb.regListener(type, pid, function(data) {
    try {
      fn(data, type, pid, handle);
    } catch(e) {
      xb.warn("regListenerWithCode 处理器异常", e.stack, 'e');
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
    xb.warn(tagname +" 标签异常", 'min 值无效', 'w');
  }
  if (max && max < min) {
    xb.warn(tagname +" 标签异常", 'max 值无效', 'w');
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


function valiNumberMinMax(struct) {
  var fieldname = struct.unit.attr('name');
  var tagname = struct.tagname;
  var max  = struct.jdata.attr('max');
  var min  = struct.jdata.attr('min');
  
  if (isNaN(min) || min < 0) {
    xb.warn(tagname +" 标签异常", 'min 值无效', 'w');
  }
  if (max && max < min) {
    xb.warn(tagname +" 标签异常", 'max 值无效', 'w');
  }
  
  var rules = struct.setting.rules;
  //
  // 必须写成合并式的语法.
  //
  rules[fieldname] = $.extend(true, rules[fieldname], {
    required  : min > 0,
    min : parseInt(min),
    max : parseInt(max) || Number.MAX_VALUE,
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
    return xb.warn(tagname +" 标签异常", '没有找到父级表单元件', 'e');
  }
  if (form.length < 1) {
    return xb.warn(tagname +" 标签异常", '没有找到表单', 'e');
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


//
// 删除不安全的 html 元素
//
function safeHtml(h) {
  var jh;
  if (typeof h == 'string') {
    jh = $('<div>').append(h);
  } else {
    jh = h;
  }
  jh.find('script, style, link').remove();
  return jh;
}


//
// 将 frame 设置为模态对话框并显示, 当对话框关闭时销毁对话框和内部数据.
// 适合显示比较短, 而且不需要用户交互的内容.
//
function openDialog(frame, _onclose) {
  frame.dialog({
    width    : '70%',
    height   : '500',
    modal    : 'true',
    hide     : 'slide',
    show     : 'slide',
    appendTo : '#content',
    close    : function() {
      frame.dialog('destroy');
      frame.remove();
      frame.hide();
      _onclose && _onclose();
    }
  });
  frame.dialog('open');
  return frame;
}


function refreshAllDict() {
  try {
    if (zy) {
      zy.cache.get('_mdm_dict', 'ls').removeAll();
    }
  } catch(e) {
    console.error("refreshAllDict", e);
  }
}


//
// $.fn.dataTable 的默认配置
// dataTable() 返回 jquery 对象自身, DataTable() 返回 TableApi 对象.
//
function getTableConfig() {
  var config = { data: [], columns:[], language: {} };
  $.extend(true, config.language, zy.ui.dataTable.language);
  return config;
}


//
// config.displayInput 用于显示字典字面值的 input 元素
// config.dialog 对话框框架根元素
// config.realInput 实际存储值的表单元素
// config.destroy 出参: 返回后绑定销毁的方法
// config.show 出参: 返回后绑定显示的方法
//
function configDictDialog(config) {
  var select  = config.realInput;
  var disp    = config.displayInput;
  var dialog  = config.dialog; 
  var ok      = dialog.find(".ok");
  var body    = dialog.find(".modal-body");
  var url     = xb.apiURL(null, 'd2c8511b47714faba5c71506a5029d94', 'datadict', 'gettree');
  var treediv = $("<div class='ztree'>");
  var current_select;
  var okx = -1;
  var zTreeObj = dialog.data('zTreeObj');
  
  var setting = {
    async: {
      url        : url,
      enable     : true,
      dataFilter : dataFilter,
      autoParam  : [ 'typecd' ],
      otherParam : [ 'openid', zy.g.comm.openid ],
    },
    callback: {
      onMouseDown : onMouseDown,
    },
    view: { nameIsHTML: true },
  };
  
  if (! ok.length) {
    ok = $('<button type="button" class="ok btn btn-primary btn-sm">应用</button>');
    ok.prependTo(dialog.find('.modal-footer'));
  }
  
  config.destroy = destroy;
  config.show = show;
  disp.click(show).css('cursor', 'pointer');
  
  
  if (select.val()) {
    xb.getDictNameByTypecd(select.val(), function(name) {
      disp.val(name);
    });
  }
  
  
  ok.click(function() {
    if (current_select) {
      select.val(current_select.typecd);
      disp.val(current_select.typenm);
      select.trigger('change');
    }
    dialog.modal('hide');
    resetOk();
  });
  
  
  function resetOk() {
    ok.css("position", 'static');
    okx = -1;
  }
  
  
  function show() {
    if (!zTreeObj) {
      dialog.data("is_setting_to_dict", true);
      dialog.appendTo(document.body);
      dialog.find('.modal-dialog').css('width', '600px');
      dialog.on('hidden.bs.modal', resetOk);
      body.empty().append(treediv);
      zTreeObj = $.fn.zTree.init(treediv, setting);
      dialog.data('zTreeObj', zTreeObj);
      xb.on('PAGE_DESTROY', null, destroy);
    }
    dialog.modal('show');
  }
  
  
  function destroy() {
    if (zTreeObj) {
      dialog.removeData('bs.modal');
      dialog.empty();
      dialog.remove();
      zTreeObj.destroy();
      zTreeObj = null;
    }
  }
  
  
  function onMouseDown(event, treeId, treeNode) {
    if (okx < 0) {
      okx = body.offset().left + body.width() - 100;
      ok.css("position", 'absolute');
    }
    ok.offset({ left: okx, top: event.pageY-15 });
    current_select = treeNode;
  }
  
  
  function dataFilter(treeid, parentNode, rdata) {
    rdata.result.forEach(function(row) {
      // BUG: 接口不应该返回这个数据
      // if (row.typecd == 'ROOT') return;
      row.name = row.typenm +' <span class="note">'+ row.typecd +' v'+ row.version +'</span>'
    });
    return rdata.result;
  }
}


//
// val() 的替代品, 通常返回 val() 的值, 除非:
// 1. 当 checkbox 被选中返回 val() 否则返回 null.
//
function jqSmartValue() {
  var dom = this[0];
  var v = null;
  if (dom) {
    switch (dom.tagName) {
      default:
        v = this.val();
        break;
        
      case 'INPUT': {
        if (this.prop('disabled'))
          return v;
          
        switch(dom.type) {
          case 'checkbox':
          case 'radio':
            v = this.prop('checked') && this.val();
            break;
            
          default:
            v = this.val();
            break;
        }
      }
      break;
    }
  }
  return v;
}


function stringifyUsedTime(i) {
  var ms = parseInt(i);
  if (!ms) return i;
  var unit;
  if (ms < 1000) {
    unit = '毫秒';
  } else if (ms < 60*1000) {
    ms /= 1000;
    unit = '秒';
  } else if (ms < 60*60*1000) {
    ms /= 60*1000;
    unit = '分种';
  } else if (ms < 24*60*60*1000) {
    ms /= 60*60*1000;
    unit = '小时';
  } else {
    ms /= 24*60*60*1000;
    unit = '天';
  }
  return [ms.toFixed(1), "<span class='note'>", unit, "</span>"].join('&emsp;');
}


//
// 在 jdom 对象上创建日志
//
function createLogger(jdom, _max_line) {
  var maxline  = _max_line || 100;
  var keepline = parseInt(maxline/2);
  var count    = 0;
  var ret = {
    log     : log,
    info    : info,
    success : success,
    error   : error,
    err     : error,
    fail    : error,
    warn    : warn,
    warning : warn,
    debug   : debug,
    apiret  : apiret,
    api     : apiret,
  };
  return ret;
  
  function log() {
    _log(arguments).addClass("text-primary");
  }
  
  function error() {
    _log(arguments).addClass("text-danger");
  }
  
  function success() {
    _log(arguments).addClass("text-success");
  }
  
  function warn() {
    _log(arguments).addClass("text-warning");
  }
  
  function debug() {
    _log(arguments).addClass("text-muted");
  }
  
  function info() {
    _log(arguments).addClass("text-info");
  }
  
  function apiret(ret) {
    var func = ret.code ? success : error;
    arguments[0] = ret.msg;
    func.apply(null, arguments);
  }
  
  function _log(args) {
    var buf = ['['+new Date().toLocaleTimeString()+']'];
    for (var i=0; i<args.length; ++i) {
      buf.push(args[i]);
    }
    var line = $("<div class='item'>").html(buf.join(' '));
    jdom.prepend(line);
    
    if (++count > maxline) {
      count = removeExcessLine();
    }
    return line;
  }
  
  function removeExcessLine() {
    var items = jdom.find(".item");
    for (var i=items.length-1; i>keepline; --i) {
      items.eq(i).remove();
    }
    return items.size();
  }
}


//
// 调用平台接口
//
function callapi(app, mod, api, parm, cb) {
  zy.g.am.app = app;
  zy.g.am.mod = mod;
  var api = 'api/'+ api;
  if (cb == null && typeof parm == 'function') {
    cb = parm;
    parm = {};
  }
  zy.net.get(api, cb, parm, null, cb);
}


//
// 等待隐藏的 jdom 元素显示出来, jdom 在显示时宽度必须大于 0,
// 15秒超时, cb 被调用.
//
function waitDisplay(jdom, cb) {
  var endtime = Date.now() + 15e3;
  var tid = setInterval(function() {
    if ((jdom.height() > 0 && jdom.width() > 0) || Date.now() > endtime) {
      cb();
      clearInterval(tid);
    }
  }, 30);
}


function getZY() {
  var z = window.zy;
  if (!z) {
    z = {
      log : console.log,
    };
  }
  return z;
}


//
// 当 iframe 内容改变时, iframe 本身的尺寸也跟随改变.
//
function iframeMax(jiframe) {
  var jdom = $(jiframe);
  var iwin = jdom[0].contentWindow;
  jdom.css({ border: 0, width: '100%', margin: 0, padding: 0 });
  
  jdom.on('load', fix);
  jdom.resize(fix);
  
  xb.on('PAGE_DESTROY', null, function() {
    jdom.off();
  });
  
  function fix() {
    // 一些组件在 resize 之后更改画面高度, 加入延迟可以修正这个问题.
    setTimeout(function() {
      console.debug("fix iframe size");
      jdom.height(iwin.document.body.scrollHeight);
    }, 10);
  }
}


})(jQuery);