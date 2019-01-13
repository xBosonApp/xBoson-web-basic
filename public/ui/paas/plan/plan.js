/**
 * 数据字典类型
 * @class MdmDatadictH1
 */
TextH1 = (function () {

  var PT = TextH1.prototype;
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
  var dt = $('#EWATERBI_pdmr_prodcplan_dt');  //生产计划信息表格
  PT.tab_h1 = new zyTabs('#EWATERBI_pdmr_prodcplan_wid');
  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class TextH1
   * @constructor
   */
  function TextH1() {
    Console.log("new TextH1()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    thiz.Select();
    thiz.DataTable();
    thiz.Toolbar();
    thiz.Tab();
    $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(true);
    $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(true);
    thiz.tab_h1.active(0);
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }

  PT.Tab = function () {
    thiz.tab_h1.AddTab('h1', '生产计划信息', false, $('#EWATERBI_pdmr_prodcplan'));
    var cb = function (msg) {
      if (msg) {
        // 当前选择行数据
        thiz.tab_h1.AddTab('h2', '变更记录', false, msg);
      }
    };
    zy.net.loadPage("plan/plan_log.html", cb);
  };
  /**
   * 表格加载
   * @method DataTable @method DataTable2  @method DataTable3
   * @param {Object} data 数据对象
   */
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "p_nm"
      },
      {
        "render": function (data, type, row, meta) {
          return zy.cache.cd2name('58', row.p_typecd);
        }
      },
      {
        "render": function (data, type, row, meta) {
          return zy.cache.cd2name('55', row.p_dttypecd);
        }
      },
      {
        "data": "p_usrnm"
      },
      {
        "render": function (data, type, row, meta) {
          return $.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss');
        }
      },
      {
        "render": function (data, type, row, meta) {
          var _data, str, str0, str1;
          // 参数设置
          _data = 'data-p_sn=\'' + row.p_sn + '\'';
          _data += ' data-status=\'' + row.status + '\'';
          if (row.status === '1') {
            str0 = '';
            str1 = 'checked=\'checked\'';
          } else {
            str0 = 'checked=\'checked\'';
            str1 = '';
          }
          str = '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'0\' ' + str0 + '><span>无效</span></label></div>';
          str += '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'1\' ' + str1 + '><span>有效</span></label></div>';
          return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'mdm_datadict_h1_status\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + row.statusnm + '</a>';
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
      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(true);
        $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(false);
        $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(false);
      }
    });

    //查询
    $('#EWATERBI_pdmr_prodcplan_search').click(function () {
      conditions = $('#EWATERBI_pdmr_prodcplan_form').serialize();
      $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(false);
      $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(false);
      $('#EWATERBI_pdmr_prodcplan_search').button('loading');
      thiz.Pagination(1);
    });

    //添加计划
    $('#EWATERBI_pdmr_prodcplan_add').click(function () {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("plan/plan_manage.html", $("#EWATERBI_pdmr_prodcplan_form1"));
    });

    // 修改计划
    $('#EWATERBI_pdmr_prodcplan_edit').click(function () {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.p_sn = data.p_sn; //获取选择行数据，设置参数
      zy.net.loadHTML("plan/plan_manage.html", $("#EWATERBI_pdmr_prodcplan_form1"));
    });

    //tab页面
    $('#EWATERBI_pdmr_prodcplan_tab').click(function () {
      var cb = function (msg) {
        $('#EWATERBI_pdmr_prodcplan_info_form').formDisable(false);
        if (msg) {
          // 当前选择行数据
          var data = dt.DataTable().row('.active').data();
          console.log(data.updatedt);
          thiz._g.param.p_sn = data.p_sn;
          thiz._g.param.p_nm = data.p_nm;
          thiz._g.param.p_dttypecd = data.p_dttypecd;
          console.log(data);
          if (thiz.tab_h1.getCount() < 3)
            thiz.tab_h1.AddTab(data.p_sn, '生产计划详细信息', true, msg);
          else
            thiz.tab_h1.active(2);
          $('#EWATERBI_pdmr_prodcplan_info_search').click(); // 这里调用 info 画面查询按钮事件
        }
      };
      zy.net.loadPage("plan/plan_info.html", cb);
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#EWATERBI_pdmr_prodcplan_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
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
  PT.SetDt = function (page) {
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      $('#EWATERBI_pdmr_prodcplan_search').button('reset');
      if (msg) {
        $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(true);
        $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        console.log(msg.result.updatedt);
        thiz.DataTable(msg.result);
        Console.log('if(msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#EWATERBI_pdmr_prodcplan_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#EWATERBI_pdmr_prodcplan_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = 'EWATERBI';
    zy.g.am.mod = 'pdmr';
    zy.net.get("api/plan_view", cb, conditions, page);
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
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
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
    param.p_sn = el.data('p_sn');
    param.status = st;
    zy.g.am.app = 'EWATERBI';
    zy.g.am.mod = 'pdmr';
    zy.net.get('api/set_plan_status', cb, param);
  };

  PT.Select = function () {
    // 数据字典处理
    var cb = function () {
      // 字典数据绑定
      $("#EWATERBI_pdmr_prodcplan_form input[name=status]").zySelect('3', false, {
        width: '100%'
      });
      $("#EWATERBI_pdmr_prodcplan_form input[name=p_dttypecd]").zySelect('55', false, {
        width: '100%'
      });
      $("#EWATERBI_pdmr_prodcplan_form input[name=p_typecd]").zySelect('58', false, {
        width: '100%'
      });
      $("#EWATERBI_pdmr_prodcplan_log_form input[name=p_change_reason]").zySelect('57', false, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('3,55,57,58', cb);
  };
  return TextH1;
})();