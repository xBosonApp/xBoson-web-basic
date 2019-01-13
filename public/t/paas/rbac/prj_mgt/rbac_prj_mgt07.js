rbac_prj_mgt07 = (function () {

  var PT = rbac_prj_mgt07.prototype;
  var thiz;
  PT._g = {
    prjid:''
  };

  var domStree;
  var streeId;
  var domCloseCtree;
  var domSort;
  var domCtree;
  var ctreeId;
  var fieldsetsort;
  var domEditmenu;
  //var domPageInfo;

  function rbac_prj_mgt07(prjid) {
    thiz = this;
    thiz._g.prjid = prjid;
    streeId = 'stree' + prjid;
    domStree = $('#stree').attr('id', streeId);
    domCloseCtree = $('#closeCtree').attr('id','closeCtree' + prjid);
    domSort = $('#sort').attr('id', 'sort' + prjid);
    ctreeId = 'ctree' + prjid;
    domCtree = $('#ctree').attr('id', ctreeId);
    fieldsetsort = $('#fieldsetsort').attr('id', 'fieldsetsort'+prjid);
    domEditmenu = $('#rbac_prj_mgt01_editmenu');
    //domPageInfo = $('#rbac_prj_mgt01_rbac_prj_mgt09_modal');
    thiz.userType();
    return this;
  }

  //本机构tree的设置
  var sourceSetting = {
    view: {
      showTitle: false,
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,
      selectedMulti: false,
      showIcon: false
    },
    edit: {
      enable: true,
      drag: {
        isCopy: false,
        isMove: true
      },
      editNameSelectAll: true,
      showRemoveBtn: false,
      showRenameBtn: false
    },
    data: {
      key: {
        name: 'menunm'
      },
      simpleData: {
        enable: false
      }
    },
    callback: {
      onExpand: OnExpand,
      beforeDrop: beforeDrop,
      onCheck: OnCheck,
      onClick: onClick
    },
    check: {
      enable: true,
      chkStyle: "checkbox",
      chkboxType: {
        "Y": "ps",
        "N": "s"
      }
    }
  };

  function OnExpand(event, treeId, treeNode) {
  }

  PT._g = {
    param: {}
  };

  PT.userType = function () {
    //domCloseCtree.closest('.row').hide();
    //domCloseCtree.closest('div.col-sm-2').find('ul').empty();
    domCtree.empty();
    fieldsetsort.hide();
    domStree.empty();
    thiz.initList();
  };
  //排序tree
  function sortTree(treeNode) {
    //domCloseCtree.closest('.row').hide();
    //domCloseCtree.closest('div.col-sm-2').find('ul').empty();
    fieldsetsort.hide();
    domCtree.empty();
    var target = {};
    var setting = {
      view: {
        showTitle: false,
        showIcon: false
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        key: {
          name: 'menunm'
        },
        simpleData: {
          enable: false
        }
      },
      callback: {
        beforeDrag: beforeDrag,
        beforeDrop: beforeDrop
      }
    };
    var sortNode = {};

    function beforeDrag(treeId, treeNodes) {
      for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
          return false;
        }
      }
      return true;
    }

    function beforeDrop(treeId, treeNodes, targetNode, moveType) {
      sortNode = treeNodes[0].getParentNode();
      return (targetNode != null) && (targetNode.level == treeNodes[0].level) && (targetNode.parentTId == treeNodes[0].parentTId)
    }

    if (treeNode.children && treeNode.children.length > 0) {
      zy.ui.msg('提示', '排序对当前菜单下一层子菜单生效', 'i');
      domCloseCtree.closest('.row').show();
      $.extend(true, target, treeNode);
      $.each(target.children, function (s, a) {
        if (a.children) {
          a.children = null;
        }
      });
      //domCloseCtree.closest('.row').show();
      // domCloseCtree.closest('div.col-sm-2').find('ul').empty();
      fieldsetsort.show();
      domCtree.empty();
      (function () {
        $.fn.zTree.init(domCtree, setting, target);
        var zTree = $.fn.zTree.getZTreeObj(ctreeId);
        zTree.setting.edit.drag.prev = true;
        zTree.setting.edit.drag.inner = false;
        zTree.setting.edit.drag.next = true;
      })();
    } else {
      zy.ui.msg('提示', '当前目录下无子菜单', 'w');
    }

    domSort.unbind('click');
    domSort.click(function () {
      var menuid = '';
      var sortorder = '';
      for (i in sortNode.children) {
        menuid += sortNode.children[i].menuid + ',';
        sortorder += i + ',';
      }
      menuid = menuid.trimCom();
      sortorder = sortorder.trimCom();
      if (menuid != '' && sortorder != '') {
        thiz._get_data({
          app: '03229cbe4f4f11e48d6d6f51497a883b',
          mod: 'XMGL',
          api: 'sortmenu',
          r_parm: {
            menuid: menuid,
            sorting_order: sortorder
          }
        }, function (msg) {
          initSMenuTree();
          domCloseCtree.trigger('click');
          zy.ui.msg('提示', '排序成功', 's');
        });
      } else {
        zy.ui.msg('提示', '没有变化', 's');
      }
    });

    domCloseCtree.click(function () {
      // $(this).closest('div.col-sm-2').find('ul').empty();
      domCtree.empty();
      fieldsetsort.hide();
      //$(this).closest('.row').hide();
    });
  }

  function _sortOrder(_list) {
    _list = _list.sort(function (a, b) {
      return (Number(a.sorting_order) - Number(b.sorting_order));
    });
    $.each(_list, function (i, v) {
      if (v.children) {
        _sortOrder(v.children);
      }
    });
  }

  PT.initList = function () {
    //初始化tree
    initSMenuTree();
  };

  PT._checkChildren = function (ztree, list) {
    if (list && list.length > 0) {
      for (i in list) {
        if (list[i].children) {
          thiz._checkChildren(list[i].children);
        } else {
          list[i].checked = false;
          ztree.updateNode(list[i]);
        }
      }
    }
  };

  PT._checkNameAndSort = function (menuid, p_menuid, menunm, sort, done) {
    thiz._get_data({
      api: 'check_menunm',
      app: '03229cbe4f4f11e48d6d6f51497a883b',
      mod: 'XMGL',
      r_parm: {
        menuid: menuid,
        p_menuid: p_menuid,
        menunm: menunm,
        sorting_order: sort
      }
    }, function (msg) {
      done(msg.result[0]);
    });
  };

  //调接口获取数据
  PT._get_data = function (req_model, _success, _nodata_cb) {
    var parm = $.extend({}, req_model.r_parm);
    var _cb = function (msg) {
      if (msg) {
        _success && _success(msg);
      } else {
        _nodata_cb && _nodata_cb(msg);
      }
    };

    zy.g.am.mod = req_model.mod;
    zy.g.am.app = req_model.app;
    zy.g.am.org = req_model.org;
    zy.net.get("api/" + req_model.api, _cb, parm);
  };

  //本机构菜单tree
  function initSMenuTree() {
    thiz._get_data({
      api: 'getprjmenu',
      app: '03229cbe4f4f11e48d6d6f51497a883b',
      mod: 'XMGL',
      org: zy.g.comm.org,
      r_parm: {
        prjid: thiz._g.prjid
      }
    }, function (msg) {
      domStree.empty();
      var result = msg.result;
      _sortOrder(result);
      var obj = {
        menunm: '顶层',
        uri: '',
        pageid: '',
        levels: 0,
        menuid: '',
        drag: false,
        open: true,
        children: result
      };
      for (i in result) {
        (result[i].checked) ? (obj.checked = true) : (obj.checked = false);
      }
      $.fn.zTree.init(domStree, sourceSetting, obj);
    });
  }

  function _editNode(treeNode, flag) {
    zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt08.htm?flag=u&prjid=' + thiz._g.prjid + '&streeid=' + streeId, domEditmenu);
    thiz._g.treeNode = treeNode;
  }

  function _newNode(treeNode, flag) {
    thiz._g.treeNode = treeNode;
    if (treeNode.uri === '' && treeNode.pageid === '') {
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt08.htm?flag=i&prjid=' + thiz._g.prjid + '&streeid=' + streeId, domEditmenu);
    } else {
      $.SmartMessageBox({
        title: "确认",
        content: "新菜单保存后当前菜单的链接会被清空，继续吗？",
        buttons: '[No][Yes]'
      }, function (ButtonPressed) {
        if (ButtonPressed === "Yes") {
          zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt08.htm?flag=i&prjid=' + thiz._g.prjid + '&streeid=' + streeId, domEditmenu);
        }
        if (ButtonPressed === "No") {
        }
      });
    }
  }

  function beforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }

  function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    if (treeId != streeId) {
      return false;
    }
    var zTree = $.fn.zTree.getZTreeObj(streeId);
    if ((targetNode.pageid == '' || targetNode.pageid == undefined) && (targetNode.uri == '' || targetNode.uri == undefined)) {
      thiz._get_data({
        app: '03229cbe4f4f11e48d6d6f51497a883b',
        mod: 'XMGL',
        api: 'dropmenu',
        r_parm: {
          menuid: treeNodes[0].menuid,
          p_menuid: targetNode.menuid,
          levels: treeNodes[0].levels
        }
      }, function (msg) {
        if (msg.result[1].levelflag) {
          treeNodes[0].menunm = msg.result[0].menunm;
          treeNodes[0].levels = Number(targetNode.levels) + 1;
          zTree.moveNode(targetNode, treeNodes[0], "inner");
          zTree.updateNode(treeNodes[0]);
          zy.ui.msg('提示', '移动成功', 's');
        } else {
          zy.ui.msg('提示', '其他管理者正在操作！', 'w');
        }
      });
    } else {
      zy.ui.msg('提示', '目标菜单不是父菜单！', 'w');
    }
    return false;
  }

  function OnCheck(event, treeId, treeNode) {
    if (treeNode.menuid === '' && treeNode.children && treeNode.children.length === 0) {
    } else {
      thiz._get_data({
        api: 'setmenustatus',
        app: '03229cbe4f4f11e48d6d6f51497a883b',
        mod: 'XMGL',
        r_parm: {
          prjid: thiz._g.prjid,
          menuid: treeNode.menuid,
          status: treeNode.checked
        }
      }, function (msg) {
        zy.ui.msg('提示', treeNode.menunm + " , " + (treeNode.checked ? '显示' : '不显示'), 's');
        var zTree = $.fn.zTree.getZTreeObj(streeId);
        var nodes = zTree.getCheckedNodes(true);
        for (var i in nodes) {
          nodes[i].status = '1';
        }
      });
    }
  }

  function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0 || $("#sortBtn_" + treeNode.tId).length > 0 || $("#editBtn_" + treeNode.tId).length > 0 || $("#remBtn_" + treeNode.tId).length > 0)
      return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加新菜单' onfocus='this.blur();'></span>";
    var sortStr = "<span class='button sort' id='sortBtn_" + treeNode.tId + "' title='排序' onfocus='this.blur();'></span>";
    var editStr = "<span class='button edit' id='editBtn_" + treeNode.tId + "' title='修改' onfocus='this.blur();'></span>";
    var remStr = "<span class='button remove' id='remBtn_" + treeNode.tId + "' title='删除' onfocus='this.blur();'></span>";

    if (treeNode.menuid === '') {
      sObj.after(sortStr);
      sObj.after(addStr);
    } else if (!treeNode.children) {
      sObj.after(remStr);
      sObj.after(editStr);
      sObj.after(addStr);
    } else {
      sObj.after(remStr);
      sObj.after(sortStr);
      sObj.after(editStr);
      sObj.after(addStr);
    }

    var addbtn = $("#addBtn_" + treeNode.tId);
    var sortbtn = $("#sortBtn_" + treeNode.tId);
    var editbtn = $("#editBtn_" + treeNode.tId);
    var rembtn = $("#remBtn_" + treeNode.tId);
    if (addbtn) {
      addbtn.bind("click", function () {
        var zTree = $.fn.zTree.getZTreeObj(streeId);
        zTree.selectNode(treeNode);
        _newNode(treeNode);
        return false;
      });
    }
    if (sortbtn) {
      sortbtn.bind("click", function () {
        var zTree = $.fn.zTree.getZTreeObj(streeId);
        zTree.selectNode(treeNode);
        sortTree(treeNode);
        return false;
      });
    }
    if (editbtn) {
      editbtn.bind('click', function () {
        var zTree = $.fn.zTree.getZTreeObj(streeId);
        zTree.selectNode(treeNode);
        thiz._g.treeNode = treeNode;
        _editNode(treeNode);
        return false;
      });
    }
    if (rembtn) {
      rembtn.bind('click', function () {
        var zTree = $.fn.zTree.getZTreeObj(streeId);
        $.SmartMessageBox({
          title: "确认删除",
          content: treeNode.children === undefined ? "确定要删除当前菜单？" : "确定要删除当前菜单及其子菜单？",
          buttons: '[No][Yes]'
        }, function (ButtonPressed) {
          if (ButtonPressed === "Yes") {
            thiz._get_data({
              api: 'deletemenu',
              app: '03229cbe4f4f11e48d6d6f51497a883b',
              mod: 'XMGL',
              r_parm: {
                prjid: thiz._g.prjid,
                menuid: treeNode.menuid
              }
            }, function (msg) {
              zTree.removeNode(treeNode);
              zy.ui.msg('提示', treeNode.menunm + '删除成功', 's');
            });
          }
          if (ButtonPressed === "No") {
          }
        });
        return false;
      });
    }
  }

  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
    $("#sortBtn_" + treeNode.tId).unbind().remove();
    $("#editBtn_" + treeNode.tId).unbind().remove();
    $("#remBtn_" + treeNode.tId).unbind().remove();
  }

  // 菜单节点单击事件
  // 如果设置了 pageid，弹出页面ID配置界面
  function onClick(event, treeId, treeNode) {
    var pageid = treeNode.pageid;
    if (pageid && pageid !== '') {
      var domPageInfos = $('#rbac_prj_mgt01_rbac_prj_mgt09_modals');
      var selfid = 'rbac_prj_mgt01_rbac_prj_mgt09_modal_' + zy.tool.random();
      var domPageInfo = $('<div>').attr('id', selfid);
      domPageInfos.append(domPageInfo);
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt09.htm?op_type=u&prjid=' + thiz._g.prjid + '&pageid=' + pageid + '&selfid=' + selfid, domPageInfo);
    }
  }

  return rbac_prj_mgt07;
})();