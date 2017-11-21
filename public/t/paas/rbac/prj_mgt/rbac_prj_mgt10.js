rbac_prj_mgt10 = (function() {
  var PT = rbac_prj_mgt10.prototype;
  var thiz;
  var modal = $('#rbac_prj_mgt10_modal');
  var saveBtn = modal.find('[name=rbac_prj_mgt10_submit]');
  var checkedModels;
  var checkedApis;
  PT._g = {
    prjid: '',
    pageid:'',
    elementid: '',
    api:'',
    model:'',
    mgt09_selfid:''
  };

  function rbac_prj_mgt10(prjid,pageid,elementid,api,model,mgt09_selfid) {
    thiz = this;
    thiz._g.prjid = prjid;
    thiz._g.pageid = pageid;
    thiz._g.elementid = elementid;
    thiz._g.api = api;
    thiz._g.model = model;
    thiz._g.mgt09_selfid = mgt09_selfid;
    Init();
    return this;
  }

  function Init() {
    var local_obj_rbac_prj_mgt09 = rbac_prj_mgt09_cache[thiz._g.mgt09_selfid];
    // 隐藏时将自身删除
    modal.on('hidden.bs.modal', function () {
      $('#rbac_prj_mgt10_modal').remove();
    });

    if (thiz._g.api && thiz._g.api.length > 0) {
      checkedApis = thiz._g.api.split('|');
    } else {
      checkedApis = [];
    }
    
    if (thiz._g.model && thiz._g.model.length > 0) {
      checkedModels = thiz._g.model.split('|');
    } else {
      checkedModels = [];
    }

    // 回调函数定义
    var cb = function (msg) {
      var setting = {
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
      if (msg) {
        $.fn.zTree.init($("#tree_api"), setting, msg.result);
        checkApiTree(msg.result);
        saveBtn.button('reset');
      }
    };
    zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
    zy.g.am.mod = 'XMGL';
    var param = {
      prjid: thiz._g.prjid,
      pageid: thiz._g.pageid,
      elementid: thiz._g.elementid
    };
    // 发送请求并注册回调函数
    zy.net.get("api/prjpageelementapi", cb, param);

    var cb2 = function (msg) {
      var setting = {
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
        },
        callback: {
          onClick: function (e, tid, tnode) {
            zy.log(tnode);
          }
        }
      };
      if (msg) {
        modal.modal('show');
        $.fn.zTree.init($("#tree_model"), setting, msg.result);
        checkModelTree(msg.result);
        saveBtn.button('reset');
      }
    };
    zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
    zy.g.am.mod = 'XMGL';
    // 发送请求并注册回调函数
    zy.net.get("api/getrolemodeltree", cb2);
    //点击保存按钮
    saveBtn.click(rbac_prj_mgt10_save);
    function rbac_prj_mgt10_save() {
      var treeObj = $.fn.zTree.getZTreeObj("tree_api");
      //checked的节点
      var nodes = treeObj.getCheckedNodes();
      var children = [];
      var cnt = 0;
      for (var i = 0; i < nodes.length; i++) {
        //选取要更新到数据库的api节点
        var node = nodes[i];
        if ((node.appid !== undefined) && (node.moduleid !== undefined) && (node.children === undefined)) {
          var modNode = node.getParentNode();
          var appNode = modNode.getParentNode();
          children[cnt] = {appid:node.appid,moduleid:node.moduleid,apiid:node.id,appnm:appNode.name,modulenm:modNode.name,apinm:node.name};
          cnt++;
        }
      }
      //模型选中节点
      var modeltreeObj = $.fn.zTree.getZTreeObj("tree_model");
      //checked的节点
      var treenodes = modeltreeObj.getCheckedNodes();
      $.each(treenodes, function (i, v) {
        if (v.ismodel && v.ismodel === '1' && v.children === undefined) {
          children[cnt] = {modelid:v.typecd,modelnm:v.typenm};
          cnt++;
        }
      });

      $.each(local_obj_rbac_prj_mgt09._g.elements, function(i,v){
        if (v.elementid === thiz._g.elementid) {
          v.children = children;
          return;
        }
      });
      local_obj_rbac_prj_mgt09.loadElements(local_obj_rbac_prj_mgt09._g.elements);
      modal.modal('hide');
    }
  }

    //选中节点
  function checkApiTree(result) {
    var treeObj = $.fn.zTree.getZTreeObj("tree_api");
    if (checkedApis.length > 0) {
      $.each(checkedApis, function (ii, vv) {
        var apis = vv.split(',');
        var app = apis[0];
        var mod = apis[1];
        var api = apis[2];
        $.each(result, function (i, v) {
          var appNode;
          var modNode;
          if (v.id === app) {
            appNode = treeObj.getNodeByParam('id', app, null);
          }
          var appChildren = v.children;
          if (appChildren) {
            $.each(appChildren, function (j, vj) {
              if (v.id === app && vj.id === mod) {
                modNode = treeObj.getNodeByParam('id', mod, appNode);
              }
              var modChildren = vj.children;
              if (modChildren) {
                $.each(modChildren, function (k, vk) {
                  if (v.id === app && vj.id === mod && vk.id === api) {
                    node = treeObj.getNodeByParam('id', api, modNode);
                    treeObj.checkNode(node, true, true);
                  }
                });
              }
            });
          }
        });
      });
    }
  }
  function checkModelTree(result) {
    var treeObj = $.fn.zTree.getZTreeObj("tree_model");
    if (checkedModels.length > 0) {
      $.each(result, function (i, v) {
        $.each(checkedModels, function (ii, vv) {
          if (v.typecd === vv) {
            var node = treeObj.getNodeByParam('typecd', v.typecd, null);
            treeObj.checkNode(node, true, true);
          }
        });
      });
    }
  }

  return rbac_prj_mgt10;
})();