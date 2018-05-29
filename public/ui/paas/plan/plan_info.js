/**
 * 数据字典类型
 * @class MdmDatadictH1
 */
Info1 = (function () {

  var PT = Info1.prototype;
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
  var dt = $('#EWATERBI_pdmr_prodcplan_info_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MdmDatadictH1
   * @constructor
   */
  function Info1() {
    Console.log("new Info1()");
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
    thiz.Toolbar();
    $('#EWATERBI_pdmr_prodcplan_info_edit').btnDisable(true);
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
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
        "render": function (data, type, row, meta) {
          return zy.cache.cd2name('56', row.p_finish_usr_typecd);
        }
      },
      {
        "data": "p_finish_usr"
      },
      {
        "data": "p_val"
      },
      {
        "render": function (data, type, row, meta) {
          return zy.cache.cd2name('11', row.p_valunit);
        }
      },
      {
        "render": function (data, type, row, meta) {
          return $.format.date(row.createdt, 'yyyy-MM-dd HH:mm:ss');
        }},
      {
        "render": function (data, type, row, meta) {
          var _data, str, str0, str1;
          // 参数设置
          _data = 'data-p_infosn=\'' + row.p_infosn + '\'';

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
      Console.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;

      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }
      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#EWATERBI_pdmr_prodcplan_info_edit').btnDisable(true);

      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#EWATERBI_pdmr_prodcplan_info_edit').btnDisable(false);
      }
    });
    //查询
    $('#EWATERBI_pdmr_prodcplan_info_search').click(function () {
      $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_sn]").val(md_h1._g.param.p_sn);
      conditions = $('#EWATERBI_pdmr_prodcplan_info_form').serialize();
      $('#EWATERBI_pdmr_prodcplan_info_edit').btnDisable(true);
      $('#EWATERBI_pdmr_prodcplan_info_search').button('loading');
      thiz.Pagination(1);
    });
    //添加详细计划
    $('#EWATERBI_pdmr_prodcplan_info_add').click(function () {
      thiz._g.param.flg = 'i1'; //设置添加模式标记
      md_h1._g.param.flg = '';
      zy.net.loadHTML("plan/plan_manage.html", $("#EWATERBI_pdmr_prodcplan_form1"));
    });
    //修改详细计划
    $('#EWATERBI_pdmr_prodcplan_info_edit').click(function () {
      // 当前选择行 index
      md_h1._g.param.flg = '';
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      console.log(data);
      thiz._g.param.flg = 'u1'; //设置修改模式标记
      thiz._g.param.p_infosn = data.p_infosn; //获取选择行数据，设置参数
      thiz._g.param.p_sn = data.p_sn;
      zy.net.loadHTML("plan/plan_manage.html", $("#EWATERBI_pdmr_prodcplan_form1"));
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#EWATERBI_pdmr_prodcplan_info_pagination', {
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
      $('#EWATERBI_pdmr_prodcplan_info_search').button('reset');
      if (msg) {
        $('#EWATERBI_pdmr_prodcplan_info_edit').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#EWATERBI_pdmr_prodcplan_info_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#EWATERBI_pdmr_prodcplan_info_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = 'EWATERBI';
    zy.g.am.mod = 'pdmr';
    zy.net.get("api/plan_info_view", cb, conditions, page);

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
    param.p_infosn = el.data('p_infosn');
    param.status = st;
    zy.g.am.app = 'EWATERBI';
    zy.g.am.mod = 'pdmr';
    zy.net.get('api/upd_plan_info_status', cb, param);
  };

  PT.Select = function () {
    // 数据字典处理
    var cb = function () {
      // 字典数据绑定
      $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr_typecd]").zySelect('56', false, {
        width: '100%'
      });
      $("#EWATERBI_pdmr_prodcplan_info_form input[name=status]").zySelect('3', false, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('3,56', cb);
    $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr]").zySelectCustomData('', false, {
      width: '100%'
    }, []);
    $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr_typecd]").on("change", function (e) {
      var cb_usr = function (msg) {
        if (msg) {
          $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr]").val('');
          $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr]").zySelectCustomData(e.val, false, {
            width: '100%', multiple: 'multiple'
          }, msg.result);
        }
      };
      var paramT = {};
      zy.g.am.app = 'EWATERBI';
      zy.g.am.mod = 'pdmr';
      paramT.p_finish_usr_typecd = $("#EWATERBI_pdmr_prodcplan_info_form input[name=p_finish_usr_typecd]").val();
      zy.net.get('api/get_finish_usr_dict', cb_usr, paramT);
    });
  };
  return Info1;
})();


