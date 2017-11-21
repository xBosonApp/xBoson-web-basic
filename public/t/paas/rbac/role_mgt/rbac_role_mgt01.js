rbac_role_mgt01 = (function () {

  var PT = rbac_role_mgt01.prototype;
  var thiz;
  PT._g = {
    currentRg_id: '',
    currentRoleId: '',
    currentRoleStatus: '',
    currentMenuData: [],
    currentMenuTreeOjb: null,
    currentDeactivateRole:{
      roleid: '', 
      status: '',
      dom: null
    },
    currentOpType: '',
    objPageTabs: null
  };

  var thisPage = $('#rbac_role_mgt01');
  var menuTree = $('#rbac_role_mgt01_menu');
  var menuTreeAlert = $('#rbac_role_mgt01_menu_alert');
  var menuTreeButtons = $('#rbac_role_mgt01_menu_buttons');
  var btnMenuSave = $('#rbac_role_mgt01_menu_save');
  var btnMenuRefresh = $('#rbac_role_mgt01_menu_refresh');
  var btnSrvConfirm = $('#rbac_role_mgt01_srv');
  var menuTreeContainer = $('#rbac_role_mgt01_menu_container');
  var tmpl = $.templates('#rbac_role_mgt01_tmpl');
  var tmplContainer = $('#rbac_role_mgt01_role_container');
  var btnAdd = $('#rbac_role_mgt01_add');
  var btnEdit = $('#rbac_role_mgt01_edit');
  var btnCopy = $('#rbac_role_mgt01_copy');
  var btnDel = $('#rbac_role_mgt01_del');
  var btnEffect = $('#rbac_role_mgt01_effect');
  var roleEffectModalContainer = $('#rbac_role_mgt01_role_effect_modal_container');
  var roleMaintModalContainer = $('#rbac_role_mgt01_role_maint_modal_container');
  var roleSrvModalContainer = $('#rbac_role_mgt01_role_srv_modal_container');
  var dlg = thisPage.find('#rbac_role_mgt01_dialog');
  var roleEffectModalPath = 'rbac/role_mgt/rbac_role_mgt03.htm';
  var roleEffectPath = 'rbac/role_mgt/rbac_role_mgt02.htm';
  var roleMaintModalPath = 'rbac/role_mgt/rbac_role_mgt04.htm';
  var rolePagePath = 'rbac/role_mgt/rbac_role_mgt05.htm';
  var rolePageTabPath = 'rbac/role_mgt/rbac_role_mgt06.htm';
  var roleSrvConfirmPath = 'rbac/role_mgt/rbac_role_mgt07.htm';

  var authData;
  var authDataKeeper = thisPage.find('#rbac_role_mgt01_auth');

  var returnFlag = false;
  var cacheMenu = zy.cache.get('rbac_role_mgt01_cache_key_menu', 'ls');
  var cachePages = zy.cache.get('rbac_role_mgt01_cache_key_pages', 'ls');

	// 菜单Tree设定
  var menuTreeSetting = {
		data: {
			key: {
				checked: 'checked',
				name: 'menunm',
				title: 'menu_desc'
			},
			simpleData: {
				enable: true,
				idKey: 'menuid',
				pIdKey: 'p_menuid'
			}
		},
		check: {
      enable: true
		},
		callback: {
      onCheck: onCheck,
      onClick: onClick
    },
		view: {
			showIcon: false
		}
	};

  // 构造函数
  function rbac_role_mgt01(inroleid) {
    thiz = this;
    if (!_.isEmpty(inroleid)) {
      thiz._g.currentRoleId = inroleid;
      returnFlag = true;
    } else {
      clearCache(); // 第一次进入该页面，非回调，清空缓存
    }
    authData = zy.ui.authData(authDataKeeper, thisPage);
    thiz.init();
    return this;
  }

  // 初始化页面
  PT.init = function() {
    // 清空菜单Tree
    clearMenuTree();
    // 设置顶部按钮状态
    setTopButtons();

    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/roles', function(msg){
      if (msg && msg.result) {
        var html = tmpl.render(msg.result);
        tmplContainer.empty();
        tmplContainer.html(html);
        // 角色组事件
        // tmplContainer.find('.well').on('click',function() {
        //   tmplContainer.find('.well').removeClass('well-light');
        //   $(this).addClass('well-light');
        //   thiz._g.currentRg_id = $(this).attr('data-rg_id');
        //   // 清空菜单Tree
        //   clearMenuTree();
        // });
        // 角色事件
        tmplContainer.find('.list-group a').on('click',function () {
          tmplContainer.find('.well').removeClass('well-light');
          $(this).parent().parent().parent().addClass('well-light');
          thiz._g.currentRg_id = $(this).parent().parent().parent().attr('data-rg_id');
          tmplContainer.find('.list-group a').removeClass('active');
          $(this).addClass('active');
          var roleid = $(this).attr('data-roleid');
          var status = $(this).attr('data-status');
          if (!returnFlag) {
            clearCache(); // 清空缓存
          }
          thiz._g.currentRoleId = roleid;
          thiz._g.currentRoleStatus = status;
          // 清空菜单Tree
          clearMenuTree();
          setMenuTree(roleid, status);
          // 仅当大屏时设定Tree div 的高度与当前用户组所在div的高度相同
          if ($.device === 'desktop') {
            menuTreeContainer.css('top', $(this).parent().parent().parent().position().top);
            if (thisPage.height() < menuTreeContainer.position().top + menuTreeContainer.height() + 21) {
              thisPage.css('height', menuTreeContainer.position().top + menuTreeContainer.height() + 20);
            } else {
              thisPage.css('height', tmplContainer.position().top + tmplContainer.height());
            }
          }

          // 设置顶部按钮状态
          setTopButtons();
          return false;
        });
        // 双击事件
        tmplContainer.find('.list-group a').on('dblclick', function(e) {
          $(this).trigger('click');
          btnEdit.trigger('click');
        });
        // 停用事件
        tmplContainer.find('.list-group a span').on('click',function () {
          var roleid = $(this).parent().attr('data-roleid');
          var status = $(this).parent().attr('data-status');
          var tmpThis = $(this);
          thiz._g.currentDeactivateRole = {
            roleid: roleid,
            status: status,
            dom: tmpThis
          };
          thiz._g.currentOpType = 'a';
          // 初始化对话框
          dialogInit();
          dlg.dialog('open');
          return false;
        });

        // 如果之前保存过角色ID或迁移到该页面时传递过来角色ID，则默认选中该角色ID
        if (!_.isEmpty(thiz._g.currentRoleId)) {
          var domA = tmplContainer.find('.list-group a');
          if (domA) {
            $.each(domA, function(i, v) {
              if (thiz._g.currentRoleId === $(this).attr('data-roleid')) {
                $(this).trigger('click');
              }
            });
          }
        }
      }
    }, {allstatus: true}, null);
  };

  function dialogInit() {
    dlg.empty();
    //对话框标题转换为html
    $.widget('ui.dialog', $.extend({}, $.ui.dialog.prototype, {
      _title: function(title) {
        if (!this.options.title) {
          title.html('&#160;');
        } else {
          title.html(this.options.title);
        }
      }
    }));
    var opRoleId;
    if (thiz._g.currentOpType === 'a') {
      opRoleId = thiz._g.currentDeactivateRole.roleid;
    } else if (thiz._g.currentOpType === 'd') {
      opRoleId = thiz._g.currentRoleId;
    }
    var setting = {
      autoOpen: false,
      width: 600,
      resizable: false,
      modal: true,
      focus: function(event, ui) {
        // 在dialog获得焦点时设置焦点到取消按钮
        $(dlg.siblings('.ui-dialog-buttonpane').find('button:eq(1)')).focus();
      },
      title: null,
      open: function(event, ui) {
        // 检查受影响的用户组 用户 客户端
        var dlgContent = $('<div class="ui-dialog-content"></div>');
        dlgContent.attr('href', roleEffectPath + '?roleid=' + opRoleId);
        dlg.append(dlgContent);
        dlgContent.load(dlgContent.attr('href'));
      },
      buttons: [{
        html: '<i class="fa fa-trash-o"></i>&nbsp;确定',
        class: 'btn btn-danger btn-xs',
        click: function() {
          zy.g.am.app = 'auth';
          zy.g.am.mod = 'rbac';
          zy.net.get('api/rolemaint', function(msg){
            if (msg) {
              if (thiz._g.currentOpType === 'a') {
                var dom = thiz._g.currentDeactivateRole.dom;
                // 根据修改后的状态改变该角色显示效果
                if (thiz._g.currentDeactivateRole.status === '1'){
                  dom.text('已停用');
                  dom.removeClass('label-success');
                  dom.addClass('label-warning');
                  dom.parent().attr('data-status', '0');
                  dom.parent().addClass('list-group-item-warning');
                } else {
                  dom.text('停用');
                  dom.removeClass('label-warning');
                  dom.addClass('label-success');
                  dom.parent().attr('data-status', '1');
                  dom.parent().removeClass('list-group-item-warning');
                }
                // 重载当前角色菜单Tree
                thiz._g.currentRoleStatus = thiz._g.currentDeactivateRole.status;
                if (thiz._g.currentRoleId === thiz._g.currentDeactivateRole.roleid) {
                  dom.parent().trigger('click');
                }
              } else if (thiz._g.currentOpType === 'd') {
                thiz._g.currentRoleId = '';
                thiz._g.currentRoleStatus = '';
                thiz.init();
              }
            }
          }, {
            op_type: thiz._g.currentOpType,
            roleid: opRoleId,
            status: thiz._g.currentDeactivateRole.status
          });
          $(this).dialog('close');
        }
      }, {
        html: '<i class="fa fa-times"></i>&nbsp;取消',
        class: 'btn btn-default btn-xs',
        click: function() {
          $(this).dialog('close');
        }
      }],
      close: function() {
        $(this).remove();
      }
    };
    
    if (thiz._g.currentOpType === 'a') {
      if (thiz._g.currentDeactivateRole.status === '1') {
        $.extend(true, setting, {title: '<div class="widget-header"><h4><i class="fa fa-warning"></i>&nbsp;确定停用该角色？</h4></div>'});
      } else {
        $.extend(true, setting, {title: '<div class="widget-header"><h4><i class="fa fa-warning"></i>&nbsp;确定激活该角色？</h4></div>'});
      }
    } else if (thiz._g.currentOpType === 'd') {
      $.extend(true, setting, {title: '<div class="widget-header"><h4><i class="fa fa-warning"></i>&nbsp;确定删除该角色？</h4></div>'});
    }
    //对话框
    dlg.dialog(setting);
  }

  // 清空菜单Tree
  function clearMenuTree() {
    menuTree.empty();
    thiz._g.currentMenuData = [];
    thiz._g.currentMenuTreeOjb = null;
    menuTreeContainer.hide();
  }

  // 设定菜单Tree
  function setMenuTree(roleid, status) {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/rolemenus', function(msg){
      if (msg && msg.result) {
        sortOrder(msg.result);
				if (status !== '1') {
          // 无效的角色不可修改
          menuTreeAlert.show();
          menuTreeButtons.hide();
          loopResultForDisable(msg.result);
          loopParentChecking(msg.result);
          thiz._g.currentMenuData = _.cloneDeep(msg.result);
				} else {
          menuTreeAlert.hide();
          menuTreeButtons.show();
          loopParentChecking(msg.result);
          thiz._g.currentMenuData = _.cloneDeep(msg.result);
          if (returnFlag) {
            // 设置checked属性为上次用户选中的
            var preRoleid = cacheMenu.get('roleid');
            if (!_.isEmpty(preRoleid) && preRoleid === thiz._g.currentRoleId) {
              loopMenuResultForChecked(msg.result, cacheMenu.get('menu'));
            }
            returnFlag = false;// reset
          }
				}
				thiz._g.currentMenuTreeOjb = $.fn.zTree.init(menuTree, menuTreeSetting, msg.result);
				menuTreeContainer.show();
				setMenuTreeButton();
      }
    }, {roleid: roleid});
  }

  // 递归设置chkDisabled属性
  function loopResultForDisable(jsonResult) {
    for (var i = 0; i < jsonResult.length; i++) {
      var tmp = jsonResult[i];
      tmp.chkDisabled = true;
      var tmpChildren = tmp.children;
      if (tmpChildren) {
        loopResultForDisable(tmpChildren);
      }
    }
  }

  function loopParentChecking(jsonResult) {
    for (var i = 0; i < jsonResult.length; i++) {
      var tmp = jsonResult[i];
      var tmpChildren = tmp.children;
      if (tmp.checked !== 'true' && haveCheckedLeaf(tmpChildren)) {
        tmp.checked = 'true';
        loopParentChecking(tmpChildren);
      }
    }
  }

  function haveCheckedLeaf(jsonResult) {
    if (!jsonResult) {
      return false;
    }
    var ret = false;
    for (var i = 0; i < jsonResult.length; i++) {
      var tmp = jsonResult[i];
      if (tmp.checked==='true') {
        ret = true;
        break;
      } else {
        var tmpChildren = tmp.children;
        if (tmpChildren) {
          haveCheckedLeaf(tmpChildren);
        }
      }
    }
    return ret;
  }

  // 递归设置checked属性为上次用户选中的
  function loopMenuResultForChecked(jsonResult, data) {
    for (var i = 0; i < jsonResult.length; i++) {
      var tmp = jsonResult[i];
      var tmpChildren = tmp.children;
      if (tmpChildren) {
        loopMenuResultForChecked(tmpChildren, data);
      } else {
        if (_.findIndex(data, {menuid: tmp.menuid}) >= 0) {
          tmp.checked = 'true';
        } else {
          tmp.checked = 'false';
        }
      }
    }
  }

  // 菜单显示排序
  function sortOrder(data) {
    data = data.sort(function (a, b) {
      return (Number(a.sorting_order) - Number(b.sorting_order));
    });
    $.each(data, function (i, v) {
      if (v.children) {
        sortOrder(v.children);
      }
    });
  }

  // 同步check状态
  function setCheckedNodes(data) {
    $.each(data, function (i, v) {
      if (v.checkedOld !== v.checked) {
        v.checkedOld = v.checked;
      }
      if (v.children) {
        setCheckedNodes(v.children);
      }
    });
  }

  // 菜单保存
  btnMenuSave.on('click', function() {
    //checked的节点
    var nodes = thiz._g.currentMenuTreeOjb.getCheckedNodes();
    if (nodes && nodes.length > 0) {
      // 页面权限配置页面的pageid
      var existingData = cachePages.get('page');
      if (!existingData){
        existingData = {};
      }
      var menus = [];
      var pages = [];
      $.each(nodes, function(i, v) {
        if (!v.children) {
          menus = _.concat(menus, {menuid: v.menuid, pageid: v.pageid});
          if (!_.isEmpty(v.pageid)) {
            // 只保留勾选的菜单的菜单对应的页面的配置数据
            var menuPageData = existingData[v.menuid];
            if (_.isEmpty(menuPageData)) {
              // 将菜单上勾选但没有打开过页面权限配置页面的pageid合并到一起
              pages = _.concat(pages, {pageid: v.pageid});
            } else {
              $.each(menuPageData, function(kk, vv) {
                pages = _.concat(pages, {pageid: kk, elementinfo: vv.elementinfo, nextpages: vv.nextpages});
              });
            }
          }
        }
      });
      zy.g.am.app = 'auth';
      zy.g.am.mod = 'rbac';
      zy.g.am.json = true;
      // 存储时，保存过的页面按保存的数据（pages）存储，未保存过的页面按最大权限存储
      var submitData = {
        roleid: thiz._g.currentRoleId,
        menus: menus,
        pages: pages
      };
      zy.net.post('api/saverolemenu', function(msg){
        if (msg) {
          // 同步check状态
          setCheckedNodes(thiz._g.currentMenuTreeOjb.getNodes());
          thiz._g.currentMenuData = _.cloneDeep(thiz._g.currentMenuTreeOjb.getNodes());
          clearCache();
          setMenuTreeButton();
          zy.ui.msg('提示信息：', '保存成功！', 's');
        }
      }, submitData, null, null);
    }
  });

  // 菜单重置
  btnMenuRefresh.on('click', function() {
    clearCache(); // 清空缓存
    menuTree.empty();
    thiz._g.currentMenuTreeOjb = $.fn.zTree.init(menuTree, menuTreeSetting, thiz._g.currentMenuData);
    setMenuTreeButton();
  });

  // 服务确认
  btnSrvConfirm.on('click', function() {
    zy.net.loadHTML(roleSrvConfirmPath + '?roleid=' + thiz._g.currentRoleId + '&status=' + thiz._g.currentRoleStatus, roleSrvModalContainer);
  });

  // 添加按钮事件
  btnAdd.on('click', function() {
    thiz._g.currentOpType = 'i';
    zy.net.loadHTML(roleMaintModalPath + '?op_type=i&rg_id=' + thiz._g.currentRg_id, roleMaintModalContainer);
  });

  // 修改按钮事件
  btnEdit.on('click', function() {
    thiz._g.currentOpType = 'u';
    zy.net.loadHTML(roleMaintModalPath + '?op_type=u&rg_id=' + thiz._g.currentRg_id + '&roleid=' + thiz._g.currentRoleId, roleMaintModalContainer);
  });

  // 修改按钮事件
  btnCopy.on('click', function() {
    thiz._g.currentOpType = 'c';
    zy.net.loadHTML(roleMaintModalPath + '?op_type=c&rg_id=' + thiz._g.currentRg_id + '&roleid=' + thiz._g.currentRoleId, roleMaintModalContainer);
  });

  // 删除按钮事件
  btnDel.on('click', function() {
    thiz._g.currentOpType = 'd';
     // 初始化对话框
    dialogInit();
    dlg.dialog('open');
  });

  // 授权情况按钮事件
  btnEffect.on('click', function() {
    zy.net.loadHTML(roleEffectModalPath + '?roleid=' + thiz._g.currentRoleId, roleEffectModalContainer);
  });

  // 根据有无变更来设置菜单Tree下面的保存和重置按钮的状态
  function setMenuTreeButton() {
    if (_.size(thiz._g.currentMenuTreeOjb.getChangeCheckedNodes()) > 0) {
      btnMenuSave.removeAttr('disabled');
      btnMenuRefresh.removeAttr('disabled');
      btnSrvConfirm.attr('disabled', true);
    } else {
      var hasPageData = false;
      var existingData = cachePages.get('page');
      if (!_.isEmpty(existingData)) {
        var nodes = thiz._g.currentMenuTreeOjb.getCheckedNodes();
        if (nodes && nodes.length > 0) {
          $.each(nodes, function(i, v) {
            if (!v.children) {
              if (existingData[v.menuid] !== null) {
                hasPageData = true;
                return false;
              }
            }
          });
        }
      }
      if (hasPageData) {
        btnMenuSave.removeAttr('disabled');
        btnMenuRefresh.removeAttr('disabled');
        btnSrvConfirm.attr('disabled', true);
      } else {
        btnMenuSave.attr('disabled', true);
        btnMenuRefresh.attr('disabled', true);
        btnSrvConfirm.removeAttr('disabled');
      }
    }
    if (!_.isEmpty(authData)) {
      if (authData.rbac_role_mgt01_srv === '2') {
        btnSrvConfirm.attr('disabled', true);
      } else if (authData.rbac_role_mgt01_srv === '3') {
        btnSrvConfirm.hide();
      }
    }
  }

  // 设置顶部按钮状态
  function setTopButtons() {
    var disabled = _.isEmpty(thiz._g.currentRoleId);
    btnEdit.btnDisable(disabled);
    btnCopy.btnDisable(disabled);
    btnDel.btnDisable(disabled);
    btnEffect.btnDisable(disabled);
  }

  // 菜单checkbox事件
  function onCheck(event, treeId, treeNode) {
    setMenuTreeButton();
  }
  // 菜单节点单击事件
  // 如果设置了 pageid，迁移页面ID配置tab界面
  function onClick(event, treeId, treeNode) {
    if (_.isEmpty(authData) || authData.rbac_role_mgt01_menu_node !== '1') {
      return false;
    }
    if (thiz._g.currentRoleStatus !== '1') {
      return false;
    }
    var pageid = treeNode.pageid;
    if (treeNode.checked && !_.isEmpty(pageid)) {
      var menuid = treeNode.menuid;
      zy.g.am.app = 'auth';
      zy.g.am.mod = 'rbac';
      zy.net.get('api/rolepagemaint', function(msg){
        if (msg && msg.result) {
          if (_.isEmpty(msg.result)) {
            zy.ui.msg('提示信息：', '这是一个未配置过的页面，请先保存菜单设置然后再次点击', 'i');
          } else {
            // 临时存储checked的节点
            var nodes = thiz._g.currentMenuTreeOjb.getCheckedNodes();
            if (nodes && nodes.length > 0) {
              var menus = [];
              $.each(nodes, function(i, v) {
                if (!v.children) {
                  menus = _.concat(menus, {menuid: v.menuid});
                }
              });
              cacheMenu.set('roleid',thiz._g.currentRoleId);
              cacheMenu.set('menu', menus);
            }

            zy.g.tmp_hash_path = 'paas';  // 设定临时变量为迁移path
            window.location.hash = rolePageTabPath+'?roleid='+thiz._g.currentRoleId+'&pageid='+pageid+'&menuid='+menuid;
          }
        }
      },{roleid:thiz._g.currentRoleId,pageid:pageid});
    }
  }

  // 清空缓存
  function clearCache() {
    cacheMenu.removeAll();
    cachePages.removeAll();
  }

  return rbac_role_mgt01;
})();