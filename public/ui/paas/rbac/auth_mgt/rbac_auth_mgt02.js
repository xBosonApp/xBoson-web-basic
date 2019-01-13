rbac_auth_mgt02 = (function () {

  var PT = rbac_auth_mgt02.prototype;
  var thiz;
  var currentId = '';

  var thisPage = $('#rbac_auth_mgt02');
  var clientJumbotron = thisPage.find('#rbac_auth_mgt02_client_jumbotron');
  var scopeJumbotron = thisPage.find('#rbac_auth_mgt02_scope_jumbotron');
  var mainContainer = thisPage.find('#rbac_auth_mgt02_main');
  var tmplContainer = thisPage.find('#rbac_auth_mgt02_client_container');
  var tmpl = $.templates('#rbac_auth_mgt02_tmpl');
  var scopeContainer = thisPage.find('#rbac_auth_mgt02_scope_container');
  var newScopeContainer = thisPage.find('#rbac_auth_mgt02_scope_new_container');
  var scopeEditerContainer = thisPage.find('#rbac_auth_mgt02_scope_edit_container');
  var btnNewScope = thisPage.find('#rbac_auth_mgt02_scope_new');
  var scopeForm = thisPage.find('#rbac_auth_mgt02_scope_edit_form');
  var btnSave = thisPage.find('#rbac_auth_mgt02_scope_save');
  var inputScope = scopeForm.find('input[name=scope]');
  var inputScopenm = scopeForm.find('input[name=scopenm]');
  var hiddenClientId = scopeForm.find('input[name=client_id]');
  var hiddenOpType = scopeForm.find('input[name=op_type]');
  var hiddenOldRole = scopeForm.find('input[name=oldroleid]');
  var roleDropdown = scopeForm.find('[name=roleid]');
  var dtContainer = thisPage.find('#rbac_auth_mgt02_scope_dt_container');
  var dt = thisPage.find('#rbac_auth_mgt02_scope_dt');

  var scopeColumns = [
    { 'data': 'scope' },
    { 'data': 'scopenm' },
    { 'data': 'rolenm' },
    { 'render': function(data, type, row, meta) {
                  return '<a href="javascript:void(0);">删除</a>';
                }
    }
  ];

  var authData;
  var authDataKeeper = thisPage.find('#rbac_auth_mgt02_auth');

  // 构造函数
  function rbac_auth_mgt02() {
    thiz = this;
    authData = zy.ui.authData(authDataKeeper, thisPage);
    thiz.init();
    return this;
  }

  // 初始化页面
  PT.init = function() {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/authmgtclients', function(msg) {
      if (msg && msg.result) {
        if (_.isEmpty(msg.result)) {
          clientJumbotron.show();
          mainContainer.hide();
        } else {
          setRoleDropdown();
          clientJumbotron.hide();
          mainContainer.show();
          tmplContainer.empty();
          tmplContainer.html(tmpl.render(msg.result));
          // 事件
          tmplContainer.find('a').on('click',function () {
            tmplContainer.find('a').removeClass('active');
            $(this).addClass('active');
            currentId = $(this).attr('data-client_id');
            hiddenClientId.val(currentId);
            getClientScopes(currentId);
            scopeJumbotron.hide();
            scopeContainer.show();
            switchScopeContainer(true);
            return false;
          });
          // 双击事件
          tmplContainer.find('a').on('dblclick', function(e) {
            $(this).trigger('click');
          });
          scopeJumbotron.show();
        }
      }
    });
  };

  // 角色列表
  function setRoleDropdown() {
    zy.g.am.app='auth';
    zy.g.am.mod='rbac';
    zy.net.get('api/authmgtroleselect2',function(msg){
      roleDropdown.zySelectCustomData('', false, {width:'100%', allowClear:false}, msg.result);
    });
  }

  // 获取客户端 Scope
  function getClientScopes(client_id) {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/authmgtclientscopes', function(msg){
      if (msg && msg.result) {
        if (_.size(msg.result) === 0) {
          dtContainer.hide();
        } else {
          dtContainer.show();
          setDataTable(msg.result);
        }
      }
    },{client_id: client_id});
  }

  function setDataTable(data) {
    //预设初始化参数
    var options = {
      data: data,
      columns: scopeColumns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
  }

  dt.on('click', 'tr', function(e) {
    // 当前选择行 index
    if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
      return false;

    // 变换选择行状态颜色
    if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
      $(this).removeClass('active');
      switchScopeContainer(true);
    } else {
      dt.DataTable().$('tr.active').removeClass('active');
      $(this).addClass('active');
      switchScopeContainer(false);
      var data = dt.DataTable().row('.active').data();
      hiddenOpType.val('u');
      hiddenOldRole.val(data.roleid);
      roleDropdown.select2('val', data.roleid);
      inputScope.val(data.scope);
      inputScope.attr('readonly', true);
      inputScopenm.val(data.scopenm);
    }
    if ($(e.target).is('a')) {
      var row = dt.DataTable().row('.active').data();
			zy.g.am.app = 'auth';
			zy.g.am.mod = 'rbac';
			zy.net.get('api/authmgtscopemaint', function(msg) {
        if (msg) {
          getClientScopes(currentId);
          switchScopeContainer(true);
          zy.ui.msg('提示信息：', '删除成功！', 's');
        }
			}, {op_type: 'd', client_id: currentId, scope: row.scope, roleid: row.roleid});
    }
  });

  // 切换Scope设定容器
  function switchScopeContainer(showNetScopeBtn) {
    if (showNetScopeBtn) {
      newScopeContainer.show();
      scopeEditerContainer.hide();
      scopeForm.clearForm();
      hiddenClientId.val(currentId);
    } else {
      newScopeContainer.hide();
      scopeEditerContainer.show();
    }
  }

  // 添加新Scope
  btnNewScope.on('click', function() {
    switchScopeContainer(false);
    hiddenOpType.val('i');
    inputScope.attr('readonly', false);
  });

  // Scope保存
  scopeForm.validate({
		// Rules for form validation
		rules: {
			scope: {
				required: true,
				isAlphabetNumber: true,
				maxlength: 40
			},
			scopenm: {
				required: true,
				stringCheck: true,
				maxlength: 100
			},
			roleid: {
				required: true
			}
		},
		// 验证成功后保存
		submitHandler: function (form) {
			zy.g.am.app = 'auth';
			zy.g.am.mod = 'rbac';
			zy.net.get('api/authmgtscopemaint', function(msg) {
        if (msg) {
          getClientScopes(currentId);
          switchScopeContainer(true);
          zy.ui.msg('提示信息：', '保存成功！', 's');
        }
			}, scopeForm.serialize(), null, function(msg) {
				if (msg) {
					if ('8' === msg.ret) {
						zy.ui.msg('保存失败', msg.msg, 'e');
					} else {
						zy.ui.msg('服务器请求失败', msg.ret + ' : ' + msg.msg, 'e');
					}
				}
			});
		},
		// Do not change code below
		errorPlacement: function (error, element) {
			error.insertAfter(element.parent());
		}
	});

  return rbac_auth_mgt02;
})();