/**
 * 通用角色机构授权管理
 * @class AuthRoleh20
 */
AuthRoleh20 = (function() {

  var PT = AuthRoleh20.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {
      org_id: zy.g.comm.org
    },
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //表格元素对象
  var dt = $('#orgrole_view_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleh20
   * @constructor
   */
  function AuthRoleh20() {
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
    thiz.DataTable();
    thiz.Toolbar();
    thiz.ReturnAdminType();
    $('#orgrole_view_set').btnDisable(true);
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
    //定义绑定数据结构
    var columns = [{
      "data": "org_nm"
    }, {
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name('ZR.0034', row.org_type);
      }
    }, {
      "render": function(data, type, row, meta) {
       return (row.updatedt != "" && row.updatedt != null) ? ($.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss')) : row.updatedt;
      }
    }];
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
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#orgrole_view_set').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#orgrole_view_set').btnDisable(false);
      }
    });
    //查询
    $('#orgrole_view_search').click(function() {
      $('#orgrole_view_set').btnDisable(true);
      $('#orgrole_view_search').button('loading');
      thiz.Pagination(1);
    });
    //修改权限
    $('#orgrole_view_set').click(function() {
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.org_nm = data.org_nm; //获取选择行数据，设置参数
      thiz._g.param.org_type = data.org_type;
      thiz._g.param.org_id = data.org_id;
      zy.net.loadHTML("auth/orgrole/orgrole_manage.html", $("#orgrole_view_form"));
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    zy.log('Pagination page = ' + page);
    $.jqPaginator('#orgrole_view_pagination', {
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
    zy.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#orgrole_view_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz.DataTable(msg.result);
        zy.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#orgrole_view_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          // $('#orgrole_view_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    //调用接口前设置app,mod参数
    zy.g.am.app = "auth";
    zy.g.am.mod = "jgsqtyjs";
    $("#orgrole_view_search_form input[name=org_id]").val(thiz._g.param.org_id);
    zy.net.get("api/orgrole_view", cb, $('#orgrole_view_search_form').serialize(), page);
  };

  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    thiz.Pagination(1);
  };

  /**
   * Select2 加载
   * @method Select
   */
  PT.Select = function() {
    // 数据字典处理
    var cb = function() {
      // 字典数据绑定
      $("#orgrole_view_search_form input[name=org_type]").zySelect('ZR.0034', true, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    $("#orgrole_view_search_form input[name=org_type]").val('v');
    zy.cache.initDicts('ZR.0034', cb);
  };

  /**
   * 返回管理员类型
   * @method ReturnAdminType
   */
  PT.ReturnAdminType = function() {
    var callbackUser = function(msg) {
      if (msg) {
        if (msg.result[0].adminflag == '1' || msg.result[0].adminflag == '3') {} else {
          $('#widget-grid').remove();
          zy.ui.msg("提示信息：", "用户不是管理员！", "w");
        }
      }
    };
    zy.g.am.app = 'ZYAPP_LOGIN';
    zy.g.am.mod = 'ZYMODULE_LOGIN';
    zy.net.get("api/usertype", callbackUser);
  };
  return AuthRoleh20;
})();