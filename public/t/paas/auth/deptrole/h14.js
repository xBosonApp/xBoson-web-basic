/**
 * 部门授权管理
 * @class AuthRoleH14
 */
AuthRoleH14 = (function () {

	var PT = AuthRoleH14.prototype;
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
		count: 1 //总记录数
	};

	//表格元素对象
	var dt = $('#auth_h14_dt');

	/**
	 * 事件绑定规则定义
	 * @property Events
	 */
	PT.Events = {};

	/**
	 * @class AuthRoleH14
	 * @constructor
	 */
	function AuthRoleH14() {
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
		$('#auth_h14_set').btnDisable(true);
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
				"data": "deptcd"
      },
			{
				"data": "deptnm"
      },
			{
				"render": function(data, type, row, meta) {
            return zy.cache.cd2name('ZR.0001', row.status);
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
			if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
				return false;

			// 变换选择行状态颜色
			if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
				$(this).removeClass('active');
				$('#auth_h14_set').btnDisable(true);
			} else {
				dt.DataTable().$('tr.active').removeClass('active');
				$(this).addClass('active');
				$('#auth_h14_set').btnDisable(false);
			}
		});
		//查询
		$('#auth_h14_search').click(function () {
			$('#auth_h14_set').btnDisable(true);
			$('#auth_h14_search').button('loading');
			thiz.Pagination(1);
		});
		//分配角色
		$('#auth_h14_set').click(function () {
			// 当前选择行数据
			var data = dt.DataTable().row('.active').data();
			thiz._g.param.deptcd = data.deptcd; //获取选择行数据，设置参数
			thiz._g.param.deptnm = data.deptnm;
			thiz._g.param.deptid = data.deptid;
			zy.net.loadHTML("auth/deptrole/h15.html", $("#auth_h14_form"));
		});
	};

	/**
	 * 分页处理
	 * @method Pagination
	 * @param {Number} page 页码
	 */
	PT.Pagination = function (page) {
		zy.log('Pagination page = ' + page);
		$.jqPaginator('#auth_h14_pagination', {
			totalCounts: thiz._g.count,
			pageSize: zy.g.page.pagesize,
			currentPage: page,
			onPageChange: function (num) {
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
	PT.SetDt = function (page) {
		var cb = function (msg) {
			$('#auth_h14_search').button('reset');
			if (msg) {
				thiz._g.count = msg.count; //获取总记录数
				thiz.DataTable(msg.result);
				if (msg.count > 0) {
					$('#auth_h14_pagination').jqPaginator('option', {
						totalCounts: thiz._g.count,
						pageSize: zy.g.page.pagesize,
						currentPage: page
					});
				} else {
					thiz._g.count = 1;
					thiz._g.page = 1;
					$('#auth_h14_pagination').jqPaginator('destroy');
				}
				// DO NOT REMOVE : GLOBAL FUNCTIONS!
				pageSetUp();
			}
		};
		//调用接口前设置app,mod参数
		zy.g.am.app = "auth";
		zy.g.am.mod = "deptrole";
		$("#auth_h14_search_form input[name=orgid]").val(thiz._g.param.orgid);
		zy.net.get("api/getorgdept", cb, $('#auth_h14_search_form').serialize(), page);
	};
	/**
	 * 更新表格数据
	 * @method UpDt
	 */
	PT.UpDt = function () {
		thiz.Pagination(1);
	};
  /**
   * Select2 加载
   * @method Select
   */
  PT.Select = function() {
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001', function(){});
  };
	return AuthRoleH14;
})();