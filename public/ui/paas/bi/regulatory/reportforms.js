/**
 * Created by liang on 2014-07-10.
 */
/**
 * 数据字典详细
 * @class MdmDataDictH64
 */
ReportForm = (function() {

  var PT = ReportForm.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data : [],
    param : {},
    page : 1, //开始页数
    count : 1 //总记录数
  };

  //表格元素对象
  var dt = $('#report_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MdmDataDictH64
   * @constructor
   */
  function ReportForm() {
    Console.log("new ReportForm()");
    thiz = this;
    thiz.Init();

    thiz.tab_report = new zyTabs('#report_wid');
    thiz.tab_report.AddTab('report', '报表管理', false, $('#widget-grid'));

    zy.g.am.app = 'ZYAPP_LOGIN';
    zy.g.am.mod = 'ZYMODULE_LOGIN';
    zy.net.get("api/usertype", callbackUser);
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.Select();
    thiz.DataTable();
    thiz.Toolbar();
    DynamicWidth()
    $('#report_download').btnDisable(true);
  };

  function DynamicWidth() {
    $('#report').resize(function() {
      thiz.DataTable(thiz._g.data);
    })
  }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [{
      "data" : "filenm"
    },
        {
      "render" : function(data, type, row, meta) {
        //return '<i class=\"fa fa-lg fa-fw ' + row.menu_icon + '\"></i>';
        return zy.cache.cd2name("49", row.report_type);

      }
    }, {
      "render" : function(data, type, row, meta) {
        return $.format.date(row.createdt, 'yyyy-MM-dd HH:mm:ss');
      }
    }, {
      "render" : function(data, type, row, meta) {
        return $.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss');
      }

    }];
    //预设初始化参数
    var options = {
      "data" : data,
      "columns" : columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
  };
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
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
        $('#report_download').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#report_download').btnDisable(false);
      }
    });
    //查询
    $('#report_search').click(function() {
      zy.g.am.app = "EWATERBI";
      zy.g.am.mod = "chartbi";
      $('#report_download').btnDisable(true);
      $('#report_search').button('loading');
      thiz.Pagination(1);
    });
    //上传
    $('#report_upload').click(function() {

      thiz._g.param.flg = 'i';
      //设置添加模式标记
      zy.net.loadHTML("bi/regulatory/upload.html", $("#report_3_form"));
    });
    //下载
    $('#report_download').click(function() {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.filenm = data.filenm;
      thiz._g.param.report_api = data.report_api;
      thiz._g.param.report_type = data.report_type;
      thiz._g.param.report_appid = data.appid;
      thiz._g.param.report_moduleid = data.moduleid;
      thiz._g.param.report = data.filenm;
      zy.net.loadHTML("bi/regulatory/download.html", $("#download_form"));
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#report_pagination', {
      totalCounts : thiz._g.count,
      pageSize : zy.g.page.pagesize,
      currentPage : page,
      onPageChange : function(num) {
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
      $('#report_search').button('reset');
      if (msg) {
        $('#report_download').btnDisable(true);
        thiz._g.count = msg.count;
        //获取总记录数
        thiz.DataTable(msg.result);
        thiz._g.data = msg.result;
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#report_pagination').jqPaginator('option', {
            totalCounts : thiz._g.count,
            pageSize : zy.g.page.pagesize,
            currentPage : page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#report_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = "EWATERBI";
    zy.g.am.mod = "chartbi";
    zy.net.get("api/reportselect", cb, $('#report_form').serialize(), page);
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
  PT.SetRow = function(msg) {
    Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    Console.log("更新前的行数据 = " + JSON.stringify(data));
    // 修改数据并刷新 dataTable
    $.extend(data, msg);

    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };

  PT.Select = function() {
    // 数据字典处理
    var cb = function() {

      $("#report_form input[name=report_type]").zySelect('49', true, {
        width : '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('3,49', cb);
  };

  var callbackUser = function(msg) {
    if (msg) {
      if (msg.result[0].adminflag == '1' || msg.result[0].adminflag == '3') {
		$("#report_form").find(".btn-group").append("<button id='plugsedit' class='btn btn-info btn-xs' >&emsp;<i class='fa fa-edit'></i>&nbsp;筛选组合维护&emsp;</button>");
        $("#plugsedit").click(function() {
          var cb = function(msg) {
            if (msg) {
              // 当前选择行数据
              //var data = dt.DataTable().row('.active').data();
              //thiz._g.param.typecd = data.typecd;
              //thiz._g.param.typenm = data.typenm;
              if (thiz.tab_report.getCount() < 2) {
                thiz.tab_report.AddTab("", '筛选组合维护', true, msg);
              } else {
                thiz.tab_report.active(1);
              }
            }
          };
          zy.net.loadPage("bi/sqlplug/sqlplug.html", cb);
        });
      } else { }
    }
  };

  return ReportForm;
})();
