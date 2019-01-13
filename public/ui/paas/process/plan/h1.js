/**
 * 数据字典类型
 * @class ProcessPlanIndex
 */
ProcessPlanIndex = (function () {
  var PT = ProcessPlanIndex.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {},
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //表格元素对象
  var dt = $('#process_plan_index_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class ProcessPlanIndex
   * @constructor
   */
  function ProcessPlanIndex() {
    Console.log("new ProcessPlanIndex()");
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
    $('#process_plan_index_edit').btnDisable(true);
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
        "data": "plannm"
      },
      {
        "data": "event_type"
      },
      {
        "data": "event_content"
      },
      //{
      //  "data": "event_solution"
      //},
      {
        "data": "dispatcher"
      },
      {
        "data": "event_responder"
      },
      {
        "data": "event_responder_tel"
      },
      {
        "data": "event_status"
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
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#process_plan_index_edit').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#process_plan_index_edit').btnDisable(false);
      }
    });
    //查询
    $('#process_plan_index_search').click(function () {
      $('#process_plan_index_edit').btnDisable(true);
      $('#process_plan_index_search').button('loading');
      thiz.Pagination(1);
    });
    //添加
    $('#process_plan_index_add').click(function () {
      thiz._g.param.flg = 'i';  //设置添加模式标记
      zy.net.loadHTML("process/plan/h2h3.html", $("#process_plan_index_iu_form"));
    });
    //修改
    $('#process_plan_index_edit').click(function () {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u';  //设置修改模式标记
      thiz._g.param.plancd = data.plancd; //获取选择行数据，设置参数
      thiz._g.param.eventcd = data.eventcd; //获取选择行数据，设置参数
      zy.net.loadHTML("process/plan/h2h3.html", $("#process_plan_index_iu_form"));
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#process_plan_index_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        Console.log('onPageChange num = ' + num);
        thiz.SetDt(num);
      }
    });
  };

  var row1 = {
    plancd : 'xxxxcd',
    plannm : '英特尔半导体（大连）有限公司供水保障应急预案',
    eventcd : 'zzzzcd1',
    event_type : '水质',
    event_content : '净水厂生产和供水管道水质保障',
    event_solution : '',
    dispatcher : '赵主任',
    event_responder : '钱部长',
    event_responder_tel : '13500000000',
    event_status : '待办'
  };
  var row2 = {
    plancd : 'xxxxcd',
    plannm : '英特尔半导体（大连）有限公司供水保障应急预案',
    eventcd : 'zzzzcd2',
    event_type : '管道',
    event_content : '淮河中路供水管道在20-1号路西侧破裂',
    event_solution : '',
    dispatcher : '赵主任',
    event_responder : '孙主任',
    event_responder_tel : '13600000000',
    event_status : '接受'
  };
  var row3 = {
    plancd : 'xxxxcd',
    plannm : '英特尔半导体（大连）有限公司供水保障应急预案',
    eventcd : 'zzzzcd3',
    event_type : '管道',
    event_content : '淮河中路供水管道在20-2号路东侧破裂',
    event_solution : '',
    dispatcher : '赵主任',
    event_responder : '孙主任',
    event_responder_tel : '13600000000',
    event_status : '接受'
  };
  var row4 = {
    plancd : 'xxxxcd',
    plannm : '英特尔半导体（大连）有限公司供水保障应急预案',
    eventcd : 'zzzzcd4',
    event_type : '供水',
    event_content : '湾里净水厂短时间停产',
    event_solution : '',
    dispatcher : '赵主任',
    event_responder : '李厂长',
    event_responder_tel : '13700000000',
    event_status : '已办'
  };
  var dataList = [row1, row2, row3, row4];

  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function (page) {
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      $('#process_plan_index_search').button('reset');
      //if (msg) {
        thiz._g.count = 3;//msg.count; //获取总记录数
        thiz.DataTable(dataList);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        //if (msg.count > 0) {
        if (thiz._g.count > 0) {
          $('#process_plan_index_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#process_plan_index_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      //}
    };
    //zy.net.get("api/gettypelist", cb, $('#process_plan_index_form').serialize(), page, null);
    cb(null);
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
    Console.log("更新前的行数据 = " + JSON.stringify(data));
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '0') {
      data.statusnm = '待办';
    } else if (data.status === '1') {
      data.statusnm = '接受';
    } else if (data.status === '2') {
      data.statusnm = '已办';
    } else {
      data.statusnm = '结束';
    }
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function (el) {
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function (msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function () {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
    };
    param.typecd = el.data('typecd');
    param.status = st;
    zy.net.get('api/settypestatus', cb, param);
  };
  return ProcessPlanIndex;
})();