/**
 * 系统授权管理
 * @class AuthRoleH16
 */
AuthRoleH16 = (function () {

	var PT = AuthRoleH16.prototype;
	var thiz;

	/**
	 * 默认配置参数
	 * @attribute _g
	 * @private
	 */
	PT._g = {
		param: {
			orgid: zy.g.comm.org
		},
		page: 1, //开始页数
		count: 1, //总记录数
		data: [], //datatable数据
		paramdata: [] //h18里用的参数数据
	};

	//表格元素对象
	var dt = $('#auth_h16_dt');

	/**
	 * 事件绑定规则定义
	 * @property Events
	 */
	PT.Events = {};

	/**
	 * @class AuthRoleH16
	 * @constructor
	 */
	function AuthRoleH16() {
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
		// thiz.ReturnAdminType();
		$('#auth_h16_set').btnDisable(true);
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
				"data": "sysid"
      },
			{
				"data": "sysnm"
      },
			{
				"data": "statusnm"
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
			if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
				return false;

			// 变换选择行状态颜色
			if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
				$(this).removeClass('active');
				$('#auth_h16_set').btnDisable(true);
			} else {
				dt.DataTable().$('tr.active').removeClass('active');
				$(this).addClass('active');
				$('#auth_h16_set').btnDisable(false);
			}
		});
		//查询
		$('#auth_h16_search').click(function () {
			$('#auth_h16_set').btnDisable(true);
			$('#auth_h16_search').button('loading');

			thiz.Pagination(1);
		});
		//分配角色
		$('#auth_h16_set').click(function () {
			// 当前选择行数据
			var data = dt.DataTable().row('.active').data();
			thiz._g.param.sysid = data.sysid; //获取选择行数据，设置参数
			thiz._g.param.sysnm = data.sysnm;
			zy.net.loadHTML("auth/systemrole/h17.html", $("#auth_h16_form"));
		});
		//选择系统
		$('#auth_h16_systemlist').click(function () {
			//加载模态框
			zy.net.loadHTML("auth/systemrole/h18.html", $("#auth_h16_form"), function () {
				$('#auth_h18_modal').modal('show');
				//此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发
				$('#auth_h18_modal').on('shown.bs.modal', function (e) {
					var AuthGetSysList = new AuthGetsystemlist();
				});
			});
			//		  zy.net.loadHTML("auth/systemrole/h18.html", $("#auth_h16_form"));
		});
	};

	/**
	 * 分页处理
	 * @method Pagination
	 * @param {Number} page 页码
	 */
	PT.Pagination = function (page) {
		//h18用的参数清空
		auth_h16._g.paramdata = [];
		Console.log('Pagination page = ' + page);
		$.jqPaginator('#auth_h16_pagination', {
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
			$('#auth_h16_search').button('reset');
			if (msg) {
				thiz._g.count = msg.count; //获取总记录数
				//将表格数据放到data里
				thiz._g.data = msg.result;
				thiz.DataTable(msg.result);
				if (msg.count > 0) {
					$('#auth_h16_pagination').jqPaginator('option', {
						totalCounts: thiz._g.count,
						pageSize: zy.g.page.pagesize,
						currentPage: page
					});
				} else {
					thiz._g.count = 1;
					thiz._g.page = 1;
					$('#auth_h16_pagination').jqPaginator('destroy');
				}
				// DO NOT REMOVE : GLOBAL FUNCTIONS!
				pageSetUp();
			}
		};
		//调用接口前设置app,mod参数
		zy.g.am.app = "auth";
		zy.g.am.mod = "systemrole";
		$("#auth_h16_search_form input[name=orgid]").val(thiz._g.param.orgid);
		zy.net.get("api/getorgsystem", cb, $('#auth_h16_search_form').serialize(), page);
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
// 		var callbackUser = function (msg) {
// 			if (msg) {
// 				if (msg.result[0].adminflag == '1' || msg.result[0].adminflag == '3' || msg.result[0].adminflag == '5') {} else {
// 					$('#widget-grid').remove();
// 					zy.ui.msg("提示信息：", "用户不是管理员！", "w");
// 				}
// 			}
// 		};
// 		zy.g.am.app = 'ZYAPP_LOGIN';
// 		zy.g.am.mod = 'ZYMODULE_LOGIN';
// 		zy.net.get("api/usertype", callbackUser);
// 	};
	return AuthRoleH16;
})();