rbac_role_mgt07 = (function() {
  var PT = rbac_role_mgt07.prototype;
  var thiz;
  var modal = $('#rbac_role_mgt07');
  var saveBtn = modal.find('[name=rbac_role_mgt07_submit]');
  var srvAlert = $('#rbac_role_mgt07_alert');
  var saveAlert = $('#rbac_role_mgt07_save_alert');
  var checkedModels;
  var checkedApis;
  PT._g = {
    roleid: '',
    status: ''
  };

  // API Tree设定
  var apiTreeSetting = {
    data: {
      key: {
        title: 'id'
      }
    },
    check: {
      enable: true,
      chkDisabledInherit: true,
      chkStyle: "checkbox",
      chkboxType: {
        "Y": "ps",
        "N": "ps"
      }
    }
  };

  // 模型Tree设定
  var modelTreeSetting = {
    data: {
      key: {
        checked: 'checked',
        name: 'typenm',
        title: 'typecd'
      },
      simpleData: {
        enable: true,
        idKey: "typecd",
        pIdKey: "parentcd"
      }
    },
    check: {
      enable: true,
      chkDisabledInherit: true,
      chkStyle: "checkbox",
      chkboxType: {
        "Y": "ps",
        "N": "ps"
      }
    },
    view: {
      showTitle: true,
      selectedMulti: false,
      showIcon: true,
      dblClickExpand: false
    }
  };

  function rbac_role_mgt07(roleid,status) {
    thiz = this;
    thiz._g.roleid = roleid;
    thiz._g.status = status;
    Init();
    return this;
  }

  function Init() {
    // 隐藏时将自身删除
    modal.on('hidden.bs.modal', function () {
      modal.remove();
    });

    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/roleapis', function(msg){
      if (msg && msg.result) {
        if (thiz._g.status !== '1') {
          loopResultForDisable(msg.result);
        }
        $.fn.zTree.init($("#tree_api"), apiTreeSetting, msg.result);
        saveBtn.button('reset');
      }
    },{roleid: thiz._g.roleid});

    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/rolemodels', function(msg){
      if (msg && msg.result) {
        loopParentChecking(msg.result);
        if (thiz._g.status !== '1') {
          loopResultForDisable(msg.result);
        }
        $.fn.zTree.init($("#tree_model"), modelTreeSetting, msg.result);
        saveBtn.button('reset');
      }
    }, {roleid: thiz._g.roleid});

    //点击保存按钮
    saveBtn.on('click', function() {
      var treeObj = $.fn.zTree.getZTreeObj("tree_api");
      //checked的节点
      var nodes = treeObj.getCheckedNodes();
      var apis = [];
      if (nodes && nodes.length > 0) {
        $.each(nodes, function(i, v) {
          if (!_.isEmpty(v.appid) && !_.isEmpty(v.moduleid) && v.children === undefined) {
            apis = _.concat(apis, {appid: v.appid, moduleid: v.moduleid, apiid: v.id});
          }
        });
      }

      //模型选中节点
      var modeltreeObj = $.fn.zTree.getZTreeObj("tree_model");
      //checked的节点
      var treenodes = modeltreeObj.getCheckedNodes();
      var models = [];
      if (treenodes && treenodes.length > 0) {
        $.each(treenodes, function(i, v) {
          if (v.ismodel && v.ismodel=='1') {
            models = _.concat(models, {modelid: v.typecd});
          }
        });
      }

      zy.g.am.app = 'auth';
      zy.g.am.mod = 'rbac';
      zy.g.am.json = true;

      var submitData = {
        roleid: thiz._g.roleid,
        apis: apis,
        models: models
      };
      zy.net.post('api/saverolesrv', function(msg){
        if (msg) {
          modal.modal('hide');
          zy.ui.msg('提示信息：', '保存成功！', 's');
        }
      }, submitData, null, null);
    });

    if (thiz._g.status !== '1') {
      srvAlert.show();
      saveAlert.hide();
      saveBtn.hide();
    } else {
      srvAlert.hide();
      saveAlert.show();
      saveBtn.show();
    }
    modal.modal('show');
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

  return rbac_role_mgt07;
})();