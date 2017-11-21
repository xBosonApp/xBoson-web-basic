/**
 * 服务器列表
 * @class EtlServersList
 */
EtlServersList = (function () {

  var PT = EtlServersList.prototype;
  var thiz;
  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    _status: 0 //查看状态时，0为显示<a>可点击
  };
  //表格元素对象
  var dt = $('#etl_serverscript_dt');


  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MdmMoniEquipH19
   * @constructor
   */
  function EtlServersList() {
    Console.log("new EtlServersList()");
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
    $('#etl_serverscript_detail').btnDisable(true);
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
        "data": "id_slave"
      },
      {
        "data": "slavename"
      },
      {
        "data": "host_name"
      },
      {
        "data": "port"
      },
      {
        "data": "web_app_name"
      },
      {
        "data": "proxy_host_name"
      },
      {
        "data": "proxy_port"
      },
      {
        "data": "master"
      },
      {
        "render": function (data, type, row, meta) {
          if (thiz._g._status == 1) {
            return '<label style=\"width:52px;font-size:13px\">' + row.status + '</label>';
          } else {
            return '<a style=\"width:52px;line-height:18px;font-size:13px\" href=\"javascript:void(0);\">' + row.status + '</a>';
          }
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
   * 查看状态
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function (data) {
    var param = {};
    var cb = function (msg) {
      thiz._g._status = 0;
      if (msg) {
        var status = msg.slavestatus[0].status;
        param.status = status;
        thiz.SetRow(param);
      }
    };
    param.id_slave = data.id_slave;
    param.username = data.username;
    param.host_name = data.host_name;
    param.port = data.port;
    param.name = data.slavename;
    zy.net.get('ETLServer/api/cheserstatus', cb, param);
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
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#etl_serverscript_detail').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#etl_serverscript_detail').btnDisable(false);
      }
      if ($(e.target).is('a')) {
        //【修改状态,保存按钮】事件托管
        thiz._g._status = 1;
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        var data1 = dt.DataTable().row('.active').data();
        var param1 = {};
        param1.status = '<i class=\"fa fa-refresh fa-spin\"></i>';
        thiz.SetRow(param1);
        thiz.SaveStatus(data1);
      }
    });
    //查询
    $('#etl_serverscript_search').click(function () {
      thiz._g._status = 0;
      $('#etl_serverscript_search').button('loading');
      thiz.Pagination(1);
    });

    //查看服务器详细
    $('#etl_serverscript_detail').click(function () {
      thiz._g._status = 0;
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      var host_Name = data.host_name; //获取选择行数据，设置参数
      var port = data.port;
      thiz._g.param.etlLink = "http://" + host_Name + ":" + port;
      window.open(thiz._g.param.etlLink, 'newwindow', 'z-look=yes,height=500,width=700,top=1,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=yes');
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#etl_serverscript_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        thiz._g._status = 0;
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
      $('#etl_serverscript_detail').btnDisable(true);
      if (msg) {
        $('#etl_serverscript_search').button('reset');
        thiz._g.count = msg.count; //获取总记录数
        thiz.DataTable(msg.slavelist);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#etl_serverscript_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#etl_serverscript_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.net.get("ETLServer/api/getserverlist", cb, $('#serverslist_form').serialize(), page);
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
    Console.log("更新修改的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  return EtlServersList;
})();