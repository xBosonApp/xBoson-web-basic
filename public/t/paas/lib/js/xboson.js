(function($) {
  
var nameCache = {};


var xb = window.xb = {
  getDictNameByTypecd : getDictNameByTypecd,
  createDataTable     : createDataTable,
  select2fromApi      : select2fromApi,
  setupPagination     : setupPagination,
};  


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
    var name = ret.result[0].typenm;
    nameCache[typecd] = name;
    cb(name);
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
// 绑定 form 查询条件表单, 从接口获取数据, 绑定分页.
//
function createDataTable(table) {
  var id      = table.data('id');
  var form    = $(table.data('form'));
  var pageset = defaultPageset();
  var mapper  = table.find('.table_mapper');
  
  var pagination      = table.parent().find('.auto_tag_table_api_pagination');
  var total_count_num = table.parent().find('.total_count_num');
  
  var options = $.extend({}, zy.ui.dataTable, {
    "data"      : [],
    "columns"   : getColumnMapper(mapper),
  });
  //sendDataRequest(); // call from setupPagination()
  form.submit(sendDataRequest);
  
  setupPagination(pagination, pageset, function() {
    sendDataRequest();
  });
  
  
  function sendDataRequest() {
    zy.g.am.app = table.data('app');
    zy.g.am.mod = table.data('mod');
    zy.g.am.pagesize = pageset.pageSize;
    zy.g.am.pagenum  = pageset.currentPage;
    var api = 'api/'+ table.data('api');
    var conditions = form.serialize();
    
    zy.net.get(api, reciveData, conditions, pageset.currentPage);
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
    }
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


function select2fromApi(jobj) {
  zy.g.am.app = jobj.data('app');
  zy.g.am.mod = jobj.data('mod');
  zy.net.get('api/'+ jobj.data('api'),function(msg){
    if(msg){
      jobj.zySelectCustomData('', false, { width:'100%' }, msg.result);  
    }
  });
}

})(jQuery);