/**
 * 数据字典类型
 * @class MdmDatadictH1
 */
P_log = (function() {

  var PT = P_log.prototype;
  var thiz;
  var conditions;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //表格元素对象
  var dt = $('#EWATERBI_pdmr_prodcplan_log_dt'); //变更信息表格
  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class P_log
   * @constructor
   */
  function P_log() {
    Console.log("new P_log()");
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
    thiz.Pagination(1);
    thiz.Toolbar();
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }

  /**
   * 表格加载
   * @method DataTable @method DataTable2  @method DataTable3
   * @param {Object} data 数据对象
   */

  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [{
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('57', row.p_change_reason);
        }
      }, {
        "data": "p_change_usrnm"
      }, {
        "render": function(data, type, row, meta) {
          return $.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss');
        }
      }, {
        "data": "p_change_sn"
      }
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
    DynamicWidth();
  };
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    //变更记录查询
    $('#EWATERBI_pdmr_prodcplan_log_search').click(function() {
      conditions = $('#EWATERBI_pdmr_prodcplan_log_form').serialize();
      $('#EWATERBI_pdmr_prodcplan_log_search').button('loading');
      thiz.Pagination(1);
    });
  };
  PT.Pagination = function(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#EWATERBI_pdmr_prodcplan_log_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        Console.log('onPageChange num = ' + num);
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
    Console.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#EWATERBI_pdmr_prodcplan_log_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if(msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#EWATERBI_pdmr_prodcplan_log_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#EWATERBI_pdmr_prodcplan_log_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.comm.app = 'EWATERBI';
    zy.g.comm.mod = 'pdmr';
    zy.net.get("api/plan_change_view", cb, conditions, page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    thiz.Pagination(1);
  };
  PT.Select = function() {
    // 数据字典处理
    var cb = function() {
      // 字典数据绑定
      $("#EWATERBI_pdmr_prodcplan_log_form input[name=p_change_reason]").zySelect('57', false, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('57', cb);
  };
  return P_log;
})();