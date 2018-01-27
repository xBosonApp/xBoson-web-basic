/**
 * @class ApiProcessManager
 */
ApiProcessManager = (function() {

  var PT = ApiProcessManager.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //widget
  var widgetDiv = $('#log_access_log_wid');
  //searchForm
  var searchForm = $('#log_access_log_search_form');
  //表格元素对象
  var dt = $('#log_access_log_dt');
  var pid;

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleH8
   * @constructor
   */
  function ApiProcessManager() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.Select();
    thiz.Toolbar();
    thiz.Pagination(1);
    $('#log_access_log_kill').btnDisable(true);
    
    $("#log_access_log_kill").click(function() {
      zy.g.am.app = "e0ef1b25da204227b305fd40382693e6";
      zy.g.am.mod = "api_manager";
      
      zy.net.get("api/kill", function(ret) {
        $('#log_access_log_kill').btnDisable(true);
        zy.ui.msg("结束进程", ret.msg, "i");
        thiz.UpDt();
      }, { pid: pid });
    });
  };
  /*窗口改变时，重新调整画面大小*/
  // function DynamicWidth() {
  //   $('.dataTables_scrollHeadInner').css('width', '100%');
  //   $('.dataTables_scrollBody table').css('width', '100%');
  //   $('.dataTables_scrollHeadInner table').css('width', '100%');
  // }
  
  function formatUseTime(usetime) {
    if (usetime < 1000) {
      return usetime.toFixed(1) + ' 毫秒';
    }
    usetime /= 1000;
    if (usetime < 60) {
      return usetime.toFixed(1) + ' 秒';
    }
    usetime /= 60;
    if (usetime < 60) {
      return usetime.toFixed(1) + " 分";
    }
    usetime /= 60;
    return usetime.toFixed(1) + " 小时";
  }
  
  function sortProcess(a, b) {
    return a.beginAt - b.beginAt;
  }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      {
        "render": function(data, type, row, meta) {
          return formatUseTime(row.runningTime);
        }
      },
      {
        "data": "api"
      },
      {
        "data": "mod"
      },
      {
        "data": "app"
      },
      {
        "data": "org"
      },
      {
        "data": "callUser",
      },
      {
        "data": "processId"
      },
      {
        "render": function(data, type, row, meta) {
          return new Date(row.beginAt).toLocaleString();
        }
      },
    ];
    //预设初始化参数
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    // DynamicWidth();
  };
  
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    //查询Form
    searchForm.validate({
      // Rules for form validation
      rules: {
        // dt_from:{
        //   required: true
        // },
      },
      // 验证成功后保存
      submitHandler: function (form) {
        $('#log_access_log_search').button('loading');
        thiz.Pagination(1);
      },
      // Do not change code below
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
    });
    
    dt.on('click', 'tr', function(e) {
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty')) {
        $('#log_access_log_kill').btnDisable(true);
        pid = null;
        return false;
      }
        
      $('#log_access_log_kill').btnDisable(false);
      dt.DataTable().$('tr.active').removeClass('active');
      $(this).addClass('active');
      pid = dt.DataTable().row('.active').data().processId;
    });
  };
  
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    zy.log('Pagination page = ' + page);
    $.jqPaginator('#log_access_log_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        zy.log('onPageChange num = ' + num);
        thiz.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function(page) {
    var cb = function(msg) {
      $('#log_access_log_search').button('reset');
      if (msg) {
        msg.list.sort(sortProcess);
        thiz._g.count = msg.count; //获取总记录数
        widgetDiv.find('[name=total_count]').text('总数：'+ msg.list.length);
        thiz.DataTable(msg.list);
        thiz._g.count = 1;
        thiz._g.page = 1;
        $('#log_access_log_pagination').jqPaginator('destroy');
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = "e0ef1b25da204227b305fd40382693e6";
    zy.g.am.mod = "api_manager";
    zy.net.get("api/list", cb, $('#log_access_log_search_form').serialize(), page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function(msg) {};
  
  PT.Select = function() {
  };
  
  return ApiProcessManager;
})();