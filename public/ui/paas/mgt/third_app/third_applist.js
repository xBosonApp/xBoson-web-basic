/**
 * 第三方应用信息
 * @class MgtThirdAppList
 */
MgtThirdAppList = (function() {

  var PT = MgtThirdAppList.prototype;
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
    count: 1, //总记录数
    crt_page: 1 //当前页
  };

  //表格元素对象
  var dt = $('#mgt_third_applist_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MgtThirdAppList
   * @constructor
   */
  function MgtThirdAppList() {
    Console.log("new MgtThirdAppList()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.tab_h1 = new zyTabs('#mgt_third_applist_wid');
    thiz.tab_h1.AddTab('h1', '第三方应用管理', false, $('#mgt_third_applist'));
    thiz.DataTable();
    thiz.Toolbar();
    thiz.Select();
    $('#mgt_third_applist_edit').btnDisable(true);
    $('#mgt_third_applist_delete').btnDisable(true);
    $('#mgt_third_applist_tab').btnDisable(true);
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
  PT.DataTable = function(data) {
    //定义绑定数据结构，平台机构
    columns = [{
      "data": "tp_appid"
    }, {
      "data": "tp_appnm"
    }, {
      "data": "orgnm"
    }, {
      "data": "mark"
    }, {
      "data": "number"
    }, {
      "render": function(data, type, row, meta) {
        var _data, str, str0, str1;
        // 参数设置
        _data = 'data-tp_appid=\'' + row.tp_appid + '\'';
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
        return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'mgt_third_app_status_form\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button id=\'mgt_third_app_status\' class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + zy.cache.cd2name('ZR.0001', row.status) + '</a>';
      }
    }];
    //根据登录机构类型，决定是否返回comm_flag
    zy.g.am.app = 'ZYAPP_LOGIN';
    zy.g.am.mod = 'ZYMODULE_LOGIN';
    zy.net.get("api/getuserorgtype", function(msg) {
      if (msg) {
        if (msg.result[0].isplatorg != true) {
          Console.log('当前登录为其他机构');
          columns.splice(2, 1);
          $("#mgt_third_applist_comm_flag").remove();
          $("#mgt_third_applist_form input[name=orgid]").remove();
        }
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
      }
    });
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
        $('#mgt_third_applist_edit').btnDisable(true);
        $('#mgt_third_applist_delete').btnDisable(true);
        $('#mgt_third_applist_tab').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        var data = dt.DataTable().row($(this)).data();
        if (data.orgid == zy.g.comm.org) {
          $('#mgt_third_applist_edit').btnDisable(false);
          $('#mgt_third_applist_delete').btnDisable(false);
          $('#mgt_third_applist_tab').btnDisable(false);
        } else {
          $('#mgt_third_applist_edit').btnDisable(true);
          $('#mgt_third_applist_delete').btnDisable(true);
          $('#mgt_third_applist_tab').btnDisable(false);
        }
      }
    });
    //查询
    $('#mgt_third_applist_search').click(function() {
      conditions = $('#mgt_third_applist_form').serialize();
      $('#mgt_third_applist_edit').btnDisable(true);
      $('#mgt_third_applist_delete').btnDisable(true);
      $('#mgt_third_applist_tab').btnDisable(true);
      $('#mgt_third_applist_search').button('loading');
      thiz.Pagination(1);
    });
    //添加
    $('#mgt_third_applist_add').click(function() {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("mgt/third_app/add_updthird_app.html", $("#mgt_third_applist_form2"));
    });
    //修改
    $('#mgt_third_applist_edit').click(function() {
      var rowIdx = dt.DataTable().row('.active').index();
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.tp_appid = data.tp_appid; //获取选择行数据，设置参数
      zy.net.loadHTML("mgt/third_app/add_updthird_app.html", $("#mgt_third_applist_form2"));
    });
    //删除
    $('#mgt_third_applist_delete').click(function() {
      zy.ui.mask('删除确认', '数据删除后将不能再恢复，是否确定删除该数据？', function() {
        $('#mgt_third_applist_form').formDisable(true);
        var data = dt.DataTable().row('.active').data();
        var param = {
          tp_appid: data.tp_appid
        };
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'third_app_mgt';
        zy.net.get('api/deletethirdapp', function(msg) {
          if (msg) {
            $('#mgt_third_applist_form').formDisable(false);
            dt.DataTable().row('.active').remove().draw();
            thiz.Pagination(thiz._g.crt_page); //更新当前页
            zy.ui.msg("提示信息：", "删除成功！", "s");
          } else {
            zy.ui.msg('提示信息：', '删除失败', 'e');
          }
        }, param);
      });
    });
    //tab页面
    $('#mgt_third_applist_tab').click(function() {
      var cb = function(msg) {
        $('#mgt_third_applist_form').formDisable(false);
        if (msg) {
          // 当前选择行数据
          var data = dt.DataTable().row('.active').data();
          thiz._g.param.tp_appid = data.tp_appid;
          thiz._g.param.orgid = data.orgid;
          var index = thiz.tab_h1.AddTab('h2', '托管用户管理', true, msg);
          if (index) {
            thiz.tab_h1.active(index);
          }
          $('#managed_user_search').click(); // 这里调用 h4 画面查询按钮事件
          buildTokenList();
        }
      };
      zy.net.loadPage("mgt/third_app/managed_user.html", cb);
    });
  };
  
  function buildTokenList() {
    zy.net.loadPage("mgt/third_app/tokens.html", function(msg) {
      if (msg) {
        // 当前选择行数据
        var data = dt.DataTable().row('.active').data();
        thiz._g.param.tp_appid = data.tp_appid;
        thiz._g.param.orgid = data.orgid;
        var index = thiz.tab_h1.AddTab('h3', '令牌管理', true, msg);
        if (index) {
          thiz.tab_h1.active(index);
        }
        $('#managed_token_search').click(); // 这里调用 h4 画面查询按钮事件
      }
    });
  }
  
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#mgt_third_applist_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
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
  PT.SetDt = function(page) {
    Console.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#mgt_third_applist_search').button('reset');
      if (msg) {
        $('#mgt_third_applist_edit').btnDisable(true);
        $('#mgt_third_applist_delete').btnDisable(true);
        $('#mgt_third_applist_tab').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#mgt_third_applist_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#mgt_third_applist_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get("api/getthirdapplist", cb, conditions, page);
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
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function(el) {
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function(msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function() {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
    };
    param.tp_appid = el.data('tp_appid');
    param.status = st;
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get('api/setthirdappstatus', cb, param);
  };
  /**
   * Select2 加载
   * @method Select
   */
  PT.Select = function() {
    // 数据字典处理
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get('api/select2org', function(msg) {
      if (msg) {
        $("#mgt_third_applist_form input[name=orgid]").zySelectCustomData('', true, {
          width: '100%'
        }, msg.result);
      }
    });
    var cb = function() {
      // 字典数据绑定
      $("#mgt_third_applist_form input[name=status]").zySelect('ZR.0001', true, {
        width: '100%'
      });
      $("#mgt_third_applist_form input[name=status]").select2("val", '1');
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001', cb);
  };
  return MgtThirdAppList;
})();