rbac_role_mgt06 = (function () {

  var PT = rbac_role_mgt06.prototype;
  var thiz;
  PT._g = {
    currentRg_id: '',
    currentRoleId: '',
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

  var thisPage = $('#rbac_role_mgt06');
  var btnConfirm = thisPage.find('#rbac_role_mgt06_page_confirm');
  var btnCancel = thisPage.find('#rbac_role_mgt06_page_cancel');
  var divPageId = 'rbac_role_mgt06_tab';
  var divPageTabs = thisPage.find('#rbac_role_mgt06_page_tabs');
  var pageTabsId = 'rbac_role_mgt06_page_tabs';
  var rolePagePath = 'rbac/role_mgt/rbac_role_mgt05.htm';
  var roleMgtPath = 'rbac/role_mgt/rbac_role_mgt01.htm';

  var objTabs;
  var rbac_role_mgt05_cache = {};
  var roleid;
  var pageid;
  var menuid;
  var cachePages = zy.cache.get('rbac_role_mgt01_cache_key_pages', 'ls');

  // 构造函数
  function rbac_role_mgt06(inroleid, inpageid, inmenuid) {
    thiz = this;
    roleid = inroleid;
    pageid = inpageid;
    menuid = inmenuid;
    thiz.init();
    return this;
  }

  // 初始化页面
  PT.init = function() {
    objTabs = new zyTabs('#' + pageTabsId);
    thiz.addTab(pageid);

    // 确定按钮
    btnConfirm.on('click', function() {
      // 组织提交数据
      var menuPages = {};
      var pages = {};
      var pagesTobeDel = [];//未被授权的next_pageid,如果该next_pageid的页面打开过，则返回前将不将其包含在已配置的页面中
      // 循环所有tab内的数据
      $.each(rbac_role_mgt05_cache, function(i, v) {
        $.each(v._g.nextpages, function(ii, vv) {
          if (vv.authorized === null) {
            pagesTobeDel = _.concat(pagesTobeDel, vv.pageid);
          }
        });
      });
      $.each(rbac_role_mgt05_cache, function(i, v) {
        if (_.indexOf(pagesTobeDel, v._g.pageid) < 0) {
          pages[v._g.pageid] = {elementinfo: v._g.elementinfo, nextpages: v._g.nextpages};
        }
      });
      menuPages[menuid] = pages;

      var existingData = cachePages.get('page');
      if (existingData) {
        $.extend(true, existingData, menuPages);
        cachePages.set('page', existingData);
      } else {
        cachePages.set('page', menuPages);
      }
      existingData = cachePages.get('page');
      showRoles();
    });

    // 返回按钮
    btnCancel.on('click', function() {
      // 传入menuid或缓存中以menuid为key，只清空本次menuid对应的数据，主页面提交时检查并只留下选中的节点的menuid对应的page数据
      var existingData = cachePages.get('page');
      if (!_.isEmpty(existingData)) {
        existingData[menuid] = null;
      }
      showRoles();
    });
  };

  PT.addTab = function(inpageid) {
    if (zyTabs.prototype.getTab(inpageid)) {
        var index = objTabs.AddTab(inpageid, null, null, null);
        if (index) {
          objTabs.active(index);
        }
    } else {
      zy.net.loadPage(rolePagePath+'?roleid='+roleid+'&pageid='+inpageid, function(msg) {
        if (msg) {
          var index = objTabs.AddTab(inpageid, inpageid, false, msg);
          rbac_role_mgt05_cache[inpageid] = new rbac_role_mgt05(roleid,inpageid);
          if (index) {
            objTabs.active(index);
          }
        }
      });
    }
  };

  function showRoles(){
    zy.g.tmp_hash_path = 'paas';
    window.location.hash = roleMgtPath + '?roleid='+roleid;
  }

  return rbac_role_mgt06;
})();