jQuery(function($) { 
  
var root          = $('.dbmap_edit_root');
var form_tpl      = root.find('.mapper_template');
var form_tpl_html = form_tpl.html();
var json          = root.find('[name=map_json]');
var jdictdialog   = root.find('.dbmap_dict_dialog');

form_tpl.html('');

  
var dbmap = window.dbmap = {
  parseSql      : parseSql,
  jsonBuildForm : jsonBuildForm,
  play          : play,
};


function parseSql(handle, _over) {
  var form    = handle || root.find('#edit');
  var sql_str = form.find('[name=sql_str]').val();
  var src_did = form.find('[name=source_did]').val();
  var criid   = form.find('[name=criid]').val();
  
  if (!sql_str) return xb.warn("缺少参数", "提取数据的 SQL 文");
  if (!src_did) return xb.warn("缺少参数", "SQL 数据源");
  if (!criid)   return xb.warn("缺少参数", "交换标准");
  
  var conditions = {
    sql : sql_str,
    did : src_did,
  };
  
  api('9da3e4550d1f42d3979ae30931d498c9', 'nsdata', 'cri_list', {criid:criid}, function(ret) {
    var typecd = ret.data[0].typecd;
    
    getDict(typecd, function(dict) {
      api(null, 'dbop', 'meta', conditions, function(dat) {
        makeMapping(dat.data, dict);
        _over && _over();
      });
    });
  });
}


function makeMapping(dbfield, dict) {
  var dbfi = 0;
  var dbfl = dbfield.length;
  form_tpl.empty();
  
  dict.forEach(function(src, i) {
    var row = $(form_tpl_html);
    row.addClass(src.dictcd);
    form_tpl.append(row);
    row.find('[name=target]').val(src.dictcd);
    row.find(".notetext").html(src.dictnm || src.mark);
    setupDict(row.find('[name=typecd]'), row.find('[name=typenm]'));
    var select = row.find('[name=dbfield]');
    if (i%2 == 0) row.addClass('odd');
    
    dbfield.forEach(function(df) {
      var op = $("<option>");
      op.val(df.ColumnLabel);
      op.html(df.ColumnLabel); // +'&emsp;'+ df.ColumnTypeName);
      select.append(op);
    });
    
    select.val(dbfield[dbfi].ColumnLabel);
    dbfi = (dbfi+1) % dbfl;
  });
  
  mappingFormToJson();
  form_tpl.find(":input").change(mappingFormToJson);
}


function mappingFormToJson() {
  var config = {};
  form_tpl.find('.configrow').each(function() {
    var row = $(this);
    var key = row.find("[name=target]").val();
    var rowcfg = config[key] = {};
    
    row.find(":input").each(function() {
      var ip = $(this);
      rowcfg[ ip.attr('name') ] = ip.smartval();
    });
  });
  json.val(JSON.stringify(config));
}


function jsonBuildForm(handle) {
  var obj = JSON.parse(json.val());
  parseSql(handle, function() {
    for (var k in obj) {
      var row = root.find("."+ k);
      var s = obj[k];
      for (var n in s) {
        row.find('[name="'+ n +'"]').val(s[n]);
      }
      row.find('[name=usedict]').val('on').prop('checked', s.usedict);
    }
    mappingFormToJson();
  });
}


function getDict(typecd, cb) {
  api('d2c8511b47714faba5c71506a5029d94', 'datadict', 'getdatatable', {typecd:typecd}, function(r) {
    cb(r.data);
  });
}


function api(app, mod, api, conditions, cb) {
  zy.g.am.app = app || 'a1e22425b8574d67bf4f200b4ccde506',
  zy.g.am.mod = mod
  zy.net.post('api/'+ api, _cb, conditions, 0, _cb, new Error());
  
  function _cb(ret) {
    if (ret && ret.code == 0) {
      cb(ret);
    } else {
      xb.warn('提取字段错误', ret.msg);
    }
  }
}


function setupDict(real, diaplay) {
  var jdconfig = {
    realInput    : real,
    displayInput : diaplay,
    dialog       : jdictdialog,
  };
  xb.configDictDialog(jdconfig);
  return jdconfig;
}


function play(data) {
  var url = xb.apiURL(null, '9da3e4550d1f42d3979ae30931d498c9', 'nsdata', 'exchange');
  var query = { 's': zy.debug ? 'd': null, 'mapid': data.mapid };
  var beginat = Date.now();
  
  var d = $("<div title='调用 SOAP 接口'></div>");
  d.append('<div>ID:'+ data.mapid +"</div>");
  d.append('<div class="wait">请求已经发送, 请耐心等待...<b class="usetime"></b></div>');
  
  var tid = setInterval(function() {
    d.find(".usetime").html(xb.stringifyUsedTime(Date.now()-beginat));
  }, 1000);
  
  var ajaxobj = $.ajax(url, {
    data: query,
    timeout: 0,
    success: function(ret) {
      msg = ["完成<br/>", "接口返回码:"+ ret.code +"<br/>返回消息:<hr/><pre class='htmlcode'></pre>"];
      over(msg);
      d.find('.htmlcode').text(ret.msg);
    },
    error: function(ret, msg, err) {
      msg = ["错误<br/>", msg||err];
      over(msg);
    },
  });
  
  xb.openDialog(d, function() {
    if (ajaxobj.readyState < 4) {
      ajaxobj.abort();
      zy.ui.msg("中断", "请求已经中断, 但任务未停止, 请到进程管理中确认.", 'i');
    }
    over();
  });
  
  function over(msg) {
    clearInterval(tid);
    msg && d.append(msg.join(''));
    d.find('.wait').hide();
  }
}


});