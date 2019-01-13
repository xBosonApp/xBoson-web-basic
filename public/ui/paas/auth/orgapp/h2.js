/**
 * 机构应用管理
 * @class AuthOrgAppH2
 */
AuthOrgAppH2 = (function () {

	var PT = AuthOrgAppH2.prototype;
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
	var dt = $('#auth_orgapp_h2_dt');

	/**
	 * 事件绑定规则定义
	 * @property Events
	 */
	PT.Events = {};

	/**
	 * @class AuthOrgAppH2
	 * @constructor
	 */
	function AuthOrgAppH2() {
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
		thiz.ShowOrgTree();
	};

	/**
	 * 表格加载
	 * @method DataTable
	 * @param {Object} data 数据对象
	 */
	PT.DataTable = function (data) {
		//定义绑定数据结构
		var columns = [
			{
				"data": "org_app_status",
				"render": function (data, type, row, meta) {
					var str;
					//初始化复选框勾选状态
					if (row.org_app_status === '1') {
						str = ' checked=\'true\'';
					} else {
						str = ' ';
					}
					//设置应用状态无效的复选框不可选
					if (row.app_status === '1') {} else {
						str = str + ' disabled=\'true\'';
					}
					return '<input type=\'checkbox\' name=\'org_app_status\'' + str + '>';
				}
      },
			{
				"data": "appnm"
      },
			{
				"data": "flagnm"
      },
			{
				"data": "source_orgnm"
      },
			{
				"data": "app_statusnm"
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
		//存储原第一列值
		thiz._g.param.status_array1 = dt.DataTable().column(0).data().toArray();
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

			if ($(e.target).is('input')) {
				//使org_app_status的值与复选框勾选状态同步
				var data = dt.DataTable().row(this).data();
				if (typeof data == "undefined") {
					zy.ui.msg("提示信息：", "请选择一行", "s");
				} else {
					if (data.org_app_status == '1') {
						data.org_app_status = '';
					} else {
						data.org_app_status = '1';
					}
				}
				zy.log("is input");
				zy.log(data.org_app_status);
			}

			// 变换选择行状态颜色
			if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				dt.DataTable().$('tr.active').removeClass('active');
				$(this).addClass('active');
			}
		});
		//保存
		$('#auth_orgapp_h2_save').click(function () {
			//初始化时datatable没有值，点击保存按钮时，弹出提示信息
			if (dt.DataTable().data().length == 0) {
				zy.ui.msg("提示信息：", "请先选择左边机构！", "w");
				return;
			}
			//获取第一列的值作为数组
			thiz._g.param.status_array2 = dt.DataTable().column(0).data().toArray();

			var data;
			var orgid = thiz._g.param.orgid;
			var appid_delete = '',
				appid_insert = '';
			if (thiz._g.param.status_array1.toString() == thiz._g.param.status_array2.toString()) {
				zy.ui.msg("提示信息：", "保存成功！", "s");
			} else {
				for (var i in thiz._g.param.status_array2) {
					if (thiz._g.param.status_array2[i] != thiz._g.param.status_array1[i]) {
						//获取当前行数据
						data = dt.DataTable().row(i).data();
						if (thiz._g.param.status_array2[i] == '1') {
							appid_insert = appid_insert + data.appid + ',';
						} else {
							appid_delete = appid_delete + data.appid + ',';
						}
					}
				}
				//去除最后一个逗号
				appid_insert = appid_insert.substring(0, appid_insert.length - 1);
				appid_delete = appid_delete.substring(0, appid_delete.length - 1);
				var paramjson = {
					'orgid': thiz._g.param.orgid,
					'appid_insert': appid_insert,
					'appid_delete': appid_delete
				};
				var cb = function (msg) {
					if (msg.ret == '0') {
						zy.ui.msg("提示信息：", "保存成功！", "s");
						thiz._g.param.status_array1 = thiz._g.param.status_array2;
					} else {
						zy.ui.msg("提示信息：", "保存失败！", "e");
					}
				};
				zy.g.am.app = "auth";
				zy.g.am.mod = "orgapp";
				zy.net.post("api/uapps", cb, paramjson);
			}
		});
		//    //选择机构
		//    $('#auth_orgapp_h2_select').click(function () {
		//        //点击选择机构按钮之前先判断 当前机构的修改是否以保存
		//        //获取第一列的值作为数组
		//        thiz._g.param.status_array2=dt.DataTable().column( 0 ).data().toArray();
		//        //比较之前之后第一列的变化
		//        if(thiz._g.param.status_array1.toString()==thiz._g.param.status_array2.toString()){
		//          zy.log("第一列无变化");
		//          zy.net.loadHTML("auth/orgapp/h1.html", $("#auth_orgapp_h2_con"));
		//        }else{
		//        zy.ui.msg("提示信息：","请先保存此页的修改！","w");
		//        }
		//    });
	};

	/**
	 * 分页处理
	 * @method Pagination
	 * @param {Number} page 页码
	 */
	PT.Pagination = function (page) {
		zy.log('Pagination page = ' + page);
		$.jqPaginator('#auth_orgapp_h2_pagination', {
			totalCounts: thiz._g.count,
			pageSize: zy.g.page.pagesize,
			currentPage: page,
			onPageChange: function (num) {
				zy.log('onPageChange num = ' + num);
				thiz.SetDt(num);
			}
			/* //获取第一列的值作为数组
        thiz._g.param.status_array2 = dt.DataTable().column(0).data().toArray();
        //比较之前之后第一列的变化
        if (thiz._g.param.status_array1.toString() == thiz._g.param.status_array2.toString()) {
          zy.log("第一列无变化");
        } else {
          zy.ui.msg("提示信息：", "请先保存此页的修改！", "w");
        }*/
		});
	};
	/**
	 * 设置表格数据
	 * @method SetDt
	 * @param {Number} page 页码
	 */
	PT.SetDt = function (page) {
		var cb = function (msg) {
			if (msg) {
				thiz._g.count = msg.count; //获取总记录数
				thiz.DataTable(msg.result);
				if (msg.count > 0) {
					$('#auth_orgapp_h2_pagination').jqPaginator('option', {
						totalCounts: thiz._g.count,
						pageSize: zy.g.page.pagesize,
						currentPage: page
					});
				} else {
					thiz._g.count = 1;
					thiz._g.page = 1;
					$('#auth_orgapp_h2_pagination').jqPaginator('destroy');
				}
				// DO NOT REMOVE : GLOBAL FUNCTIONS!
				pageSetUp();
			}
		};
		zy.g.am.app = "auth";
		zy.g.am.mod = "orgapp";
		var param = {
			orgid: thiz._g.param.orgid
		};
		zy.net.get("api/sapps", cb, param, page);
	};
	/**
	 * 更新表格数据
	 * @method UpDt
	 */
	PT.UpDt = function () {
		thiz.Pagination(1);
	};
	/**
	 * 显示左边的机构tree
	 * @method ShowOrgTree
	 */
	PT.ShowOrgTree = function () {
		//平台管理员的ztree设置
		var setting1 = {
			data: {
				key: {
					name: "name"
				},
				simpleData: {
					enable: true,
					idKey: "orgid",
					pIdKey: "higher_orgid"
				}
			},
			callback: {
				beforeClick: beforeClick
			},
			view: {
				showTitle: false,
				selectedMulti: false,
				showIcon: false
			}
		};
		//机构管理员的ztree设置
		var setting2 = {
			callback: {
				beforeExpand: beforeExpand,
				beforeClick: beforeClick
			},
			view: {
				showTitle: false,
				selectedMulti: false,
				showIcon: false
			}
		};

		function beforeExpand(treeid, treenode) {
			if (typeof treenode.children == "undefined") {
				var treeObj = $.fn.zTree.getZTreeObj("auth_h1_tree");
				var auth_h1_cb0 = function (msg) {
					if (msg) {
						for (var i in msg.result) {
							msg.result[i].isParent = "true";
						}
						treeObj.addNodes(treenode, msg.result);
					}
				};
				zy.g.am.app = "auth";
				zy.g.am.mod = "orgapp";
				var param = {
					orgid: treenode.orgid
				};
				zy.net.get("api/orgs", auth_h1_cb0, param);
			}
		}

		function beforeClick(treeid, treenode, clickflag) {
			//thiz._g.param.orgid赋值
			thiz._g.param.orgid = treenode.orgid;
			thiz.Pagination();
		}
		var auth_h1_cb = function (msg) {
			if (msg) {
				if (msg.result) {
					if (msg.result.length != 0) {
						//如果是平台管理员，初始化对应的ztree
						if (msg.result[0].appflag != "undefined" && msg.result[0].adminflag == "admin") {
							$.fn.zTree.init($("#auth_h1_tree"), setting1, msg.result);
							zy.log("平台管理员");
						} else {
							//如果为机构管理员，且机构只有一个则直接显示app列表
							if (typeof msg.result[0].children == "undefined") {
								$.fn.zTree.init($("#auth_h1_tree"), setting2, msg.result);
								thiz._g.param.orgid = zy.g.comm.org;
								thiz.Pagination();
							} else {
								for (var i = 0; i < msg.result[0].children.length; i++) {
									msg.result[0].children[i].isParent = true;
								}
								$.fn.zTree.init($("#auth_h1_tree"), setting2, msg.result);
							}
						}
//						//默认选中当前机构
//				    var treeObj = $.fn.zTree.getZTreeObj("auth_h1_tree");
//				    treeObj.selectNode(treeObj.getNodeByParam("orgid",zy.g.comm.org));
					}
				} else {
					$('#widget-grid').remove();
					zy.ui.msg("提示信息：", "用户不是管理员！", "w");
				}
			}
		};
		zy.g.am.app = "auth";
		zy.g.am.mod = "orgapp";
		//测试参数
		//zy.g.comm.org='zr';
		zy.log("org" + zy.g.comm.org);
		var param = {
			orgid: zy.g.comm.org
		};
		zy.net.get("api/orgs", auth_h1_cb, param);
	};
	return AuthOrgAppH2;
})();