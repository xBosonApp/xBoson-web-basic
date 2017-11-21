/**
 * 用户授权管理
 * @class AuthRoleH12
 */
AuthRoleH12 = (function () {

  var PT = AuthRoleH12.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {orgid:zy.g.comm.org},
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //表格元素对象
  var dt = $('#auth_h12_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleH12
   * @constructor
   */
  function AuthRoleH12() {
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
		// thiz.ReturnAdminType();
    $('#auth_h12_set').btnDisable(true);
    // $('.dataTables_wrapper').unbind('resize').bind('resize',function(){
    //   thiz.DataTable(thiz._g.data);
    // });
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
        "data": "userid"
      },
      {
        "data": "usernm"
      },
      {
        "render": function(data, type, row, meta) {
            return zy.cache.cd2name('ZR.0001', row.status);
        }
      }
    ];
    //预设初始化参数
    var options = {
      "data":data,
      "columns":columns
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
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#auth_h12_set').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#auth_h12_set').btnDisable(false);
      }
    });
    //查询
    $('#auth_h12_search').click(function () {
      $('#auth_h12_set').btnDisable(true);
      $('#auth_h12_search').button('loading');
      thiz.Pagination(1);
    });
    //分配角色
    $('#auth_h12_set').click(function () {
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.userid = data.userid; //获取选择行数据，设置参数
      thiz._g.param.usernm = data.usernm;
      zy.net.loadHTML("auth/userrole/h13.html", $("#auth_h12_form"));
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#auth_h12_pagination', {
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
    var cb = function (msg) {
      $('#auth_h12_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        if (msg.count > 0) {
          $('#auth_h12_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#auth_h12_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    //调用接口前设置app,mod参数
    zy.g.am.app="auth";
    zy.g.am.mod="userrole";
		$("#auth_h12_search_form input[name=orgid]").val(thiz._g.param.orgid);
    zy.net.get("api/getorgusers", cb, $('#auth_h12_search_form').serialize(), page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    thiz.Pagination(1);
  };
		/**
   * 返回管理员类型
   * @method ReturnAdminType
   */
// 	PT.ReturnAdminType = function () {
//     var callbackUser = function (msg) {
//       if (msg) {
//         if (msg.result[0].adminflag == '1'||msg.result[0].adminflag == '3' || msg.result[0].adminflag == '5') {
//         }else{
// 					$('#widget-grid').remove();
// 					zy.ui.msg("提示信息：","用户不是管理员！","w");
// 				}
//       }
//     };
//     zy.g.am.app = 'ZYAPP_LOGIN';
//     zy.g.am.mod = 'ZYMODULE_LOGIN';
//     zy.net.get("api/usertype", callbackUser);
//   };
  
  PT.Select = function() {
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001', function(){});
  };
  return AuthRoleH12;
})();