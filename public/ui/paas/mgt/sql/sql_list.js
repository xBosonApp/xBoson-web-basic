/**
 * Created by chenqi1 on 2014/7/24.
 */
/**
 * SQL语句信息
 * @class MdmEwaterwbsH37
 */
MgtSqlList = (function () {

  var PT = MgtSqlList.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    crt_page: 1 //当前页
  };

  //表格元素对象
  var dt = $('#mgt_sql_sqllist_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MgtSqlList
   * @constructor
   */
  function MgtSqlList() {
    Console.log("new MgtSqlList()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    thiz.DataTable();
    thiz.Toolbar();
    $('#mgt_sql_sqllist_edit').btnDisable(true);
    $('#mgt_sql_sqllist_delete').btnDisable(true);
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width','100%');
    $('.dataTables_scrollBody table').css('width','100%');
    $('.dataTables_scrollHeadInner table').css('width','100%');
  }
  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "sqlid"
      },
      {
        "data": "content"
      },
      {
        "data": "sql_desc"
      },
      {
        "data": "sql_group"
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
  PT.Toolbar = function () {
    // 单击事件
    dt.on('click', 'tr', function (e) {
      // 当前选择行 index
      Console.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#mgt_sql_sqllist_edit').btnDisable(true);
        $('#mgt_sql_sqllist_delete').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#mgt_sql_sqllist_edit').btnDisable(false);
        $('#mgt_sql_sqllist_delete').btnDisable(false);
      }
    });

    //查询
    $('#mgt_sql_sqllist_search').click(function () {
      $('#mgt_sql_sqllist_edit').btnDisable(true);
      $('#mgt_sql_sqllist_delete').btnDisable(true);
      $('#mgt_sql_sqllist_search').button('loading');
      thiz.Pagination(1);
    });
    //添加
    $('#mgt_sql_sqllist_add').click(function () {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("mgt/sql/add_updsql.html", $("#mgt_sql_sqllist_form2"));
    });
    //修改
    $('#mgt_sql_sqllist_edit').click(function () {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.sqlid = data.sqlid; //获取选择行数据，设置参数
      zy.net.loadHTML("mgt/sql/add_updsql.html", $("#mgt_sql_sqllist_form2"));
    });
    //点击左侧菜单栏时，关闭dialog
    $('#left-panel nav').bind("click", function () {
      if ($('#mgt_sqllist_dialog_div').dialog('isOpen')) {
        $('#mgt_sqllist_dialog_div').dialog('close');
      }
    });
    //删除
    $('#mgt_sql_sqllist_delete').click(function () {
      zy.ui.mask('删除确认', '数据删除后将不能再恢复，是否确定删除该数据？', function() {
        $('#mgt_third_applist_form').formDisable(true);
        var param = {};
        var data = dt.DataTable().row('.active').data();
        param.sqlid = data.sqlid;
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'sys_sql_mgt';
        zy.net.get('api/deletesql', function(msg) {
          if (msg) {
             $('#mgt_third_applist_form').formDisable(false);
              dt.DataTable().row('.active').remove().draw();
              thiz.Pagination(thiz._g.crt_page); //更新当前页
              zy.ui.msg("提示信息：", "删除成功！", "s");
          } else {
             zy.ui.msg('提示', '删除失败', 'e');
          }
        }, param);
      });
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#mgt_sql_sqllist_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        Console.log('onPageChange num = ' + num);
        thiz._g.crt_page = num; //当前页码
        thiz.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function (page) {
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      $('#mgt_sql_sqllist_search').button('reset');
      if (msg) {
        $('#mgt_sql_sqllist_edit').btnDisable(true);
        $('#mgt_sql_sqllist_delete').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#mgt_sql_sqllist_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#mgt_sql_sqllist_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'sys_sql_mgt';
    zy.net.get("api/getsqllist", cb, $('#mgt_sql_sqllist_form').serialize(), page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function (msg) {
    Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  return MgtSqlList;
})();