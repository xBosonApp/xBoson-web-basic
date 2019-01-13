/**
 * UI 修改记录
 * @class UI_history_log
 */
UI_history_log = (function() {

  var PT = UI_history_log.prototype;
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

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleH8
   * @constructor
   */
  function UI_history_log() {
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
  };
  /*窗口改变时，重新调整画面大小*/
  // function DynamicWidth() {
  //   $('.dataTables_scrollHeadInner').css('width', '100%');
  //   $('.dataTables_scrollBody table').css('width', '100%');
  //   $('.dataTables_scrollHeadInner table').css('width', '100%');
  // }
  
  function createView(id, code) {
    $('#'+ id).click(function() {
      var dialog = $("<dialog>").html("<div>ESC 键可退出</div>" + getCode(code));
      dialog.appendTo(document.body);
      dialog[0].showModal();
      
      var style = { 
        position: 'fixed', 
        "font-size": 30, 
        top:100, 
        right:100, 
        'box-shadow': '5px 5px 5px #333333',
        padding: '6px 15px',
      };
      
      var close = $("<button>关闭代码预览</button>")
        .css(style)
        .appendTo(dialog)
        .click(function() {
          dialog.remove();
          close.remove();
        });
    });
  }
  
  function getCode(str) {
    return '<pre><code>' + $('<a>').text(str).html() + "</code></pre>";
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
        "data": "user_id"
      },
      {
        "data": "dt"
      },
      {
        "data": "path"
      },
      {
        "render": function(data, type, row, meta) {
          var patch = row.patch;
          if (patch.length > 300) {
            patch = patch.substr(0, 300);
          }
          
          var id = "view_all_" + parseInt(Math.random() * 10000000);
          var button = "<input type='button' value='查看全部' id='"+ id +"' />";
          //
          // 在下一个 loop 中, button 已经附加到 body 上, 可以通过 id 获取.
          //
          setTimeout(function() {
            createView(id, row.patch);
          }, 1);
          return getCode(patch) + button;
        }
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
    // DynamicWidth();
  };
  
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    //开始日期
    searchForm.find('[name=dt_from]').datepicker({
      language:'zh-CN',
      format:'yyyy-mm-dd'
    });
    searchForm.find('[name=dt_from]').datepicker('setDate',Date());
    //结束日期
    searchForm.find('[name=dt_to]').datepicker({
      language:'zh-CN',
      format:'yyyy-mm-dd'
    });
    searchForm.find('[name=dt_to]').datepicker('setDate',Date());
    //开始时间
    searchForm.find('[name=time_from]').timepicker({
      'showMeridian':false,
      'showSeconds':true,
      'defaultTime':'00:00:00',
      'minuteStep':5,
      'secondStep':5
    });
    //结束时间
    searchForm.find('[name=time_to]').timepicker({
      'showMeridian':false,
      'showSeconds':true,
      'defaultTime':'23:59:59',
      'minuteStep':5,
      'secondStep':5
    });

    //查询Form
    searchForm.validate({
      // Rules for form validation
      rules: {
        dt_from:{
          required: true
        },
        dt_to:{
          required: true
        },
        time_from:{
          required: true
        },
        time_to:{
          required: true
        },
        // appid: {
        //   required: true
        // },
        elapsed: {
          digits: true,
          min: 0,
          max: 10000000
        }
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
        thiz._g.count = msg.count; //获取总记录数
        widgetDiv.find('[name=total_count]').text('总数：'+msg.count);
        thiz.DataTable(msg.result);
        if (msg.count > 0) {
          $('#log_access_log_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#log_access_log_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = "cfb82858dc0a4598834d356c661a678f";
    zy.g.am.mod = "ui_history";
    zy.net.get("api/query", cb, $('#log_access_log_search_form').serialize(), page);
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
  
  return UI_history_log;
})();