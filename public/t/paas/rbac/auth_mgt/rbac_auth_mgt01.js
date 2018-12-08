rbac_auth_mgt01 = (function () {

  var PT = rbac_auth_mgt01.prototype;
  var thiz;
  var currentId = '';
  var currentTreeOjb;
  var allRoles = [];
  var roles = [];

  var thisPage = $('#rbac_auth_mgt01');
  var staffTree = thisPage.find('#rbac_auth_mgt01_staff');
  var assignedRoles = thisPage.find('#assigned_roles');
  var tmpl = $.templates('#rbac_auth_mgt01_tmpl');
  var rlsTmpl = $.templates('#rbac_auth_mgt01_rls_tmpl');
  var lblRoleTitle = $('#rbac_auth_mgt01_role_title');
  var lblRlsRoleTitle = $('#rbac_auth_mgt01_rls_role_title');
  var leftTmplContainer = thisPage.find('#rbac_auth_mgt01_role_l_container');
  var rightTmplContainer = thisPage.find('#rbac_auth_mgt01_role_r_container');
  var leftRlsTmplContainer = thisPage.find('#rbac_auth_mgt01_rls_role_l_container');
  var rightRlsTmplContainer = thisPage.find('#rbac_auth_mgt01_rls_role_r_container');
  var menuTreeAlert = $('#rbac_auth_mgt01_menu_alert');
  var btnSave = $('#rbac_auth_mgt01_save');
  var btnRefresh = $('#rbac_auth_mgt01_refresh');

  var authData;
  var authDataKeeper = thisPage.find('#rbac_auth_mgt01_auth');

	// 人员Tree设定
  var staffTreeSetting = {
		data: {
			key: {
				checked: 'checked',
				name: 'nm'
			}
		},
		check: {
      enable: true,
      chkStyle: 'radio',
      radioType: 'all'
		},
		callback: {
      onCheck: onCheck,
      onClick: function(event, treeId, treeNode, clickFlag) {
        currentTreeOjb.checkNode(treeNode, !treeNode.checked, true, true);
      }
    },
		view: {
			showIcon: false
		}
	};

  // 构造函数
  function rbac_auth_mgt01() {
    thiz = this;
    authData = zy.ui.authData(authDataKeeper, thisPage);
    thiz.init();
    return this;
  }

  // 初始化页面
  PT.init = function() {
    // 清空菜单Tree
    staffTree.empty();
    assignedRoles.tagsInput({
      // 'height':'100%',
       'height':'auto',
       'width':'100%',
       'interactive':false,
       'defaultText':'',
       'onRemoveTag': function() {
         setButton();
       }
    });
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/authmgtstaff', function(msg) {
      if (msg && msg.result) {
        currentTreeOjb = $.fn.zTree.init(staffTree, staffTreeSetting, msg.result);
      }
    });
    setRoles();
    setButton();
  };

  function setRoles() {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/roles', function(msg) {
      allRoles = [];
      if (msg) {
        var leftList = [];
        var rightList = [];
        var leftRlsList = [];
        var rightRlsList = [];
        if (_.isEmpty(msg.result)) {
          lblRoleTitle.hide();
        } else {
          setAllRoles(msg.result);
          $.each(msg.result, function(i, v) {
            if (i % 2 === 0) {
              leftList = _.concat(leftList, v);
            } else {
              rightList = _.concat(rightList, v);
            }
          });
          if (!_.isEmpty(leftList)) {
            leftTmplContainer.empty();
            leftTmplContainer.html(tmpl.render(leftList));
          }
          if (!_.isEmpty(rightList)) {
            rightTmplContainer.empty();
            rightTmplContainer.html(tmpl.render(rightList));
          }
        }
        if (_.isEmpty(msg.rlsroles)) {
          lblRlsRoleTitle.hide();
        } else {
          setAllRoles(msg.rlsroles);
          $.each(msg.rlsroles, function(i, v) {
            if (i % 2 === 0) {
              leftRlsList = _.concat(leftRlsList, v);
            } else {
              rightRlsList = _.concat(rightRlsList, v);
            }
          });
          if (!_.isEmpty(leftRlsList)) {
            leftRlsTmplContainer.empty();
            leftRlsTmplContainer.html(rlsTmpl.render(leftRlsList));
          }
          if (!_.isEmpty(rightRlsList)) {
            rightRlsTmplContainer.empty();
            rightRlsTmplContainer.html(rlsTmpl.render(rightRlsList));
          }
        }
        
        thisPage.find('.list-group a').on('click',function () {
          var nodes = currentTreeOjb.getCheckedNodes();
          if (nodes && nodes.length > 0) {
            if (_.isEmpty(nodes[0].userid) && nodes[0].ugid==='0') {
              return false;
            }
          } else {
            return false;
          }
          thisPage.find('.list-group a').removeClass('active');
          $(this).addClass('active');
          var rolenm = $(this).attr('data-rolenm');
          if (!assignedRoles.tagExist(rolenm)) {
            assignedRoles.addTag(rolenm);
          }
          setButton();
          return false;
        });
        // 双击事件
        thisPage.find('.list-group a').on('dblclick', function(e) {
          $(this).trigger('click');
        });
      }
    });
  }

  function setAllRoles(roles) {
    $.each(roles, function(i, v) {
      if (v.children) {
        $.each(v.children, function(ii, vv) {
          allRoles = _.concat(allRoles, vv);
        });
      }
    });
  }

  // 菜单保存
  btnSave.on('click', function() {
    //checked的节点
    var nodes = currentTreeOjb.getCheckedNodes();
    if (nodes && nodes.length > 0) {
      zy.g.am.app = 'auth';
      zy.g.am.mod = 'rbac';
      zy.g.am.json = true;
      var submitData;
      if (_.isEmpty(nodes[0].userid)) {
        submitData={ugid: nodes[0].ugid};
      } else {
        submitData={userid: nodes[0].userid};
      }
      var reloadRoleParam = _.cloneDeep(submitData);
      var submitRoleIds = [];
      var tags = assignedRoles.val().split(',');
      $.each(allRoles, function(i, v) {
         $.each(tags, function(ii, vv) {
            if (v.rolenm===vv) {
              submitRoleIds = _.concat(submitRoleIds, v.roleid);
            }
         });
      });
      submitData = $.extend(true, submitData, {roles: submitRoleIds});
      zy.net.post('api/saveuguserrole', function(msg){
        if (msg) {
          getRoles(reloadRoleParam);
          setButton();
          zy.ui.msg('提示信息：', '保存成功！', 's');
        }
      }, submitData, null, null);
    }
  });

  // 重置
  btnRefresh.on('click', function() {
    if (roles) {
      assignedRoles.importTags('');
      thisPage.find('.well').removeClass('well-light');
      thisPage.find('.list-group a').removeClass('active');
      $.each(roles, function(i, v) {
        if (!assignedRoles.tagExist(v.rolenm)) {
          assignedRoles.addTag(v.rolenm);
        }
        // tmplContainer.find('.list-group a').each(function (ii, vv) {
        //   if ($(this).attr('data-roleid')===v.roleid) {
        //           $(this).addClass('active');
        //   }
        // });
      });
    }
    setButton();
  });

  // 根据有无变更来设置菜单Tree下面的保存和重置按钮的状态
  function setButton() {
    if (isChanged()) {
      btnSave.removeAttr('disabled');
      btnRefresh.removeAttr('disabled');
    } else {
      btnSave.attr('disabled', true);
      btnRefresh.attr('disabled', true);
    }
    if (!_.isEmpty(authData)) {
      if (authData.rbac_auth_mgt01_save === '2') {
        btnSave.attr('disabled', true);
      } else if (authData.rbac_auth_mgt01_save === '3') {
        btnSave.hide();
      }
    }
  }

  function isChanged() {
    var submitRoleIds = [];
    var tags = assignedRoles.val().split(',');
    $.each(allRoles, function(i, v) {
       $.each(tags, function(ii, vv) {
          if (v.rolenm===vv) {
            submitRoleIds = _.concat(submitRoleIds, v.roleid);
          }
       });
    });
    var oRoles = [];
    $.each(roles, function(i, v) {
      oRoles = _.concat(oRoles, v.roleid);
    });
    submitRoleIds=_.sortBy(submitRoleIds);
    oRoles=_.sortBy(oRoles);
    if (_.isEqual(submitRoleIds, oRoles)) {
      return false;
    } else {
      return true;
    }
  }

  // 人员checkbox事件
  function onCheck(event, treeId, treeNode) {
    assignedRoles.importTags('');
    roles = [];
    if (treeNode.checked) {
      var param;
      if (_.isEmpty(treeNode.userid)) {
        param={ugid: treeNode.ugid};
      } else {
        param={userid: treeNode.userid};
      }
      getRoles(param);
    } else {
      assignedRoles.importTags('');
      roles = [];
      setButton();
    }
  }

  function getRoles(param) {
    thisPage.find('.list-group a').removeClass('active');
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/authmgtstaffrole', function(msg) {
      if (msg && msg.result) {
        roles = msg.result;
        $.each(roles, function(i, v) {
          if (!assignedRoles.tagExist(v.rolenm)) {
            assignedRoles.addTag(v.rolenm);
          }
          // tmplContainer.find('.list-group a').each(function (ii, vv) {
          //   if ($(this).attr('data-roleid')===v.roleid) {
          //           $(this).addClass('active');
          //   }
          // });
        });
        setButton();
      }
    }, param);
  }
  
  return rbac_auth_mgt01;
})();