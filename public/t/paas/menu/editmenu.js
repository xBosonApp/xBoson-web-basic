MenuGetMenu = (function() {
  var PT = MenuGetMenu.prototype;
  var thiz;
  var tmp_menuid; //机构应用菜单拖放时使用

  function MenuGetMenu() {
    thiz = this;
    thiz.userType();
    return this;
  }
  //本机构tree的设置
  var sourceSetting = {
    view : {
      showTitle : false,
      addHoverDom : addHoverDom,
      removeHoverDom : removeHoverDom,
      selectedMulti : false,
      showIcon : false
    },
    edit : {
      enable : true,
      drag : {
        isCopy : false,
        isMove : true
      },
      editNameSelectAll : true,
      showRemoveBtn : false,
      showRenameBtn : false
    },
    data : {
      key : {
        name : 'menunm'
      },
      simpleData : {
        enable : false
      }
    },
    callback : {
      onExpand : OnExpand,
      beforeDrop : beforeDrop,
      onCheck : OnCheck
    },
    check : {
      enable : true,
      chkStyle : "checkbox",
      chkboxType : {
        "Y" : "ps",
        "N" : "s"
      }
    }
  };

  function OnExpand(event, treeId, treeNode) {
  }

  PT._g = {
    param : {},
    Sorgid : '',
    Borgid : ''
  };

  PT.userType = function() {
    $('#closeCtree').closest('.row').hide();
    $('#closeCtree').closest('div.col-sm-2').find('ul').empty();
    $('#Stree').empty();
    thiz.initList();
  };
  //排序tree
  function sortTree(treeNode) {
    $('#closeCtree').closest('.row').hide();
    $('#closeCtree').closest('div.col-sm-2').find('ul').empty();
    var target = {};
    var setting = {
      view : {
        showTitle : false,
        showIcon : false
      },
      edit : {
        enable : true,
        showRemoveBtn : false,
        showRenameBtn : false
      },
      data : {
        key : {
          name : 'menunm'
        },
        simpleData : {
          enable : false
        }
      },
      callback : {
        beforeDrag : beforeDrag,
        beforeDrop : beforeDrop
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
      return (targetNode !== null) && (targetNode.level === treeNodes[0].level) && (targetNode.parentTId === treeNodes[0].parentTId);
    }

    if (treeNode.children && treeNode.children.length > 0) {
      zy.ui.msg('提示', '排序对当前菜单下一层子菜单生效', 'i');
      $('#closeCtree').closest('.row').show();
      $.extend(true, target, treeNode);
      $.each(target.children, function(s, a) {
        if (a.children) {
          a.children = null;
        }
      });
      $('#closeCtree').closest('.row').show();
      $('#closeCtree').closest('div.col-sm-2').find('ul').empty();
      (function() {
        $.fn.zTree.init($("#Ctree"), setting, target);
        var zTree = $.fn.zTree.getZTreeObj("Ctree");
        zTree.setting.edit.drag.prev = true;
        zTree.setting.edit.drag.inner = false;
        zTree.setting.edit.drag.next = true;
      })();
    } else {
      zy.ui.msg('提示', '当前目录下无子菜单', 'w');
    }
    $('[name="sort"]').unbind('click');
    $('[name="sort"]').click(function() {
      var menuid = '';
      var sortorder = '';
      for (i in sortNode.children) {
        menuid += sortNode.children[i].menuid + ',';
        sortorder += i + ',';
      }
      menuid = menuid.trimCom();
      sortorder = sortorder.trimCom();
      if (menuid !== '' && sortorder !== '') {
        thiz._get_data({
          app : 'ZYAPP_MENU',
          mod : 'ZYMODULE_MENU',
          api : 'sortmenu',
          r_parm : {
            menuid : menuid,
            sorting_order : sortorder,
            orgid : thiz._g.Sorgid
          }
        }, function(msg) {
          initSMenuTree(zy.g.comm.org);
          zy.ui.msg('提示', '排序成功', 's');
        });
      }
    });

    $('#closeCtree').click(function() {
      $(this).closest('div.col-sm-2').find('ul').empty();
      $(this).closest('.row').hide();
    });
  }

  function _sortOrder(_list) {
    _list = _list.sort(function(a, b) {
      return (Number(a.sorting_order) - Number(b.sorting_order));
    });
    $.each(_list, function(i, v) {
     
      if (v.children) {
        _sortOrder(v.children);
      }
    });
  }

  PT.initList = function() {
    //初始化本机构tree
		initSMenuTree(zy.g.comm.org);
		thiz._g.Sorgid = zy.g.comm.org;
		//初始化机构application tree
		initPMenuTree();
  };

  PT._checkChildren = function(ztree, list) {
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

  PT._checkNameAndSort = function(menuid, p_menuid, menunm, sort, done) {
    var result = {};
    thiz._get_data({
      api : 'check_menunm',
      app : 'ZYAPP_MENU',
      mod : 'ZYMODULE_MENU',
      r_parm : {
        menuid : menuid,
        p_menuid : p_menuid,
        menunm : menunm,
        sorting_order : sort,
        orgid : thiz._g.Sorgid
      }
    }, function(msg) {
      done(msg.result[0]);
    });
  };

  //调接口获取数据
  PT._get_data = function(req_model, _success, _nodata_cb) {
    var parm = $.extend({}, req_model.r_parm);

    var _cb = function(msg) {
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
  function initSMenuTree(Sorgid, selectNode) {
    thiz._get_data({
      api : 'getorgmenu',
      app : 'ZYAPP_MENU',
      mod : 'ZYMODULE_MENU',
      org : zy.g.comm.org,
      r_parm : {
        orgid : Sorgid
      }
    }, function(msg) {
      $("#Stree").empty();
      var result = msg.result;
      _sortOrder(result);
      var obj = {
        menunm : '顶层',
        uri : '',
        levels : 0,
        menuid : '',
        drag : false,
        open : true,
        children : result
      };
      for (i in result) {
        (result[i].checked) ? (obj.checked = true) : (obj.checked = false);
      }
      $.fn.zTree.init($("#Stree"), sourceSetting, obj);
      var treeObj = $.fn.zTree.getZTreeObj("Stree");
      var nodes = treeObj.getNodes();
      if (selectNode) {
        treeObj.selectNode(selectNode);
      }
    });
  }

  function _editNode(treeNode) {
    zy.net.loadHTML('menu/addupdmenu.html', $('#menu_getmenu_form2'));
    thiz._g.treeNode = treeNode;
  }
  
  function _newNode(treeNode) {
    thiz._g.treeNode = treeNode;
    if (treeNode.uri !== '' && treeNode.roleid !== '') {
      $.SmartMessageBox({
        title : "",
        content : "新菜单保存后当前菜单的链接信息将会被清空，请确认",
        buttons : '[No][Yes]'
      }, function(ButtonPressed) {
        if (ButtonPressed === "Yes") {
          zy.net.loadHTML('menu/addupdmenu.html', $('#menu_getmenu_form2'));
        }
        if (ButtonPressed === "No") {
        }
      });
    } else {
      zy.net.loadHTML('menu/addupdmenu.html', $('#menu_getmenu_form2'));
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
    if(treeId != "Stree"){
      return false;
    }
    var zTree = $.fn.zTree.getZTreeObj("Stree");
    if ( (targetNode.roleid === '' || targetNode.roleid ===undefined) && (targetNode.uri === '' || targetNode.uri === undefined)) {
      console.log(treeNodes[0]);
      thiz._get_data({
        app : 'ZYAPP_MENU',
        mod : 'ZYMODULE_MENU',
        api : 'dropmenu',
        r_parm : {
          menuid : treeNodes[0].menuid,
          pmenuid : targetNode.menuid,
          levels : treeNodes[0].level
        }
      }, function(msg) {
        if (msg.result[1].levelflag) {
          treeNodes[0].menunm = msg.result[0].menunm;
          treeNodes[0].levels = Number(targetNode.levels)+1;
          zTree.moveNode(targetNode, treeNodes[0], "inner");
          zTree.updateNode(treeNodes[0]);
          zy.ui.msg('提示', '移动成功', 's');
        } else {
          zy.ui.msg('提示', '其他管理员正在操作！', 'w');
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
        api : 'setmenustatus',
        app : 'ZYAPP_MENU',
        mod : 'ZYMODULE_MENU',
        r_parm : {
          menuid : treeNode.menuid,
          status : treeNode.checked,
          orgid : thiz._g.Sorgid
        }
      }, function(msg) {
        zy.ui.msg('提示', treeNode.menunm + " , " + (treeNode.checked ? '显示' : '不显示'), 's');
        var zTree = $.fn.zTree.getZTreeObj("Stree");
        var nodes = zTree.getCheckedNodes(true);
        for (i in nodes) {
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

    if (treeNode.menuid === ''){
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
      addbtn.bind("click", function() {
        var zTree = $.fn.zTree.getZTreeObj("Stree");
        zTree.selectNode(treeNode);
        thiz._g.param.flg = 'i';
        _newNode(treeNode);
        return false;
      });
    }
    if (sortbtn) {
      sortbtn.bind("click", function() {
        var zTree = $.fn.zTree.getZTreeObj("Stree");
        zTree.selectNode(treeNode);
        sortTree(treeNode);
        return false;
      });
    }
    if (editbtn) {
      editbtn.bind('click', function() {
        var zTree = $.fn.zTree.getZTreeObj("Stree");
        zTree.selectNode(treeNode);
        thiz._g.param.flg = 'u';
        thiz._g.treeNode = treeNode;
        _editNode(treeNode);
        return false;
      });
    }
    if (rembtn) {
      rembtn.bind('click', function() {
        var zTree = $.fn.zTree.getZTreeObj("Stree");
        $.SmartMessageBox({
          title : "请确认!",
          content : treeNode.children === undefined ? "确定要删除当前菜单?" : "确定要删除当前菜单及其子菜单?",
          buttons : '[No][Yes]'
        }, function(ButtonPressed) {
          if (ButtonPressed === "Yes") {
            thiz._get_data({
              api : 'deletemenu',
              app : 'ZYAPP_MENU',
              mod : 'ZYMODULE_MENU',
              r_parm : {
                orgid : thiz._g.Sorgid,
                menuid : treeNode.menuid
              }
            }, function(msg) {
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

  //2014-11-14新加代码
  //机构应用菜单tree
  //drop之前
  function PTreeDrop(treeId, treeNodes, targetNode, moveType){
    if(treeId != "Stree"){
      return false;
    }
    if(treeNodes[0].isParent){
      zy.ui.msg('提示', '只可以移动子菜单', 'w');
      return false;
    }
    
    var tNode = null;
    
    if(moveType == 'inner'){
      tNode = targetNode;
    }else{
      tNode = targetNode.getParentNode();
    }
    
    if(!treeNodes[0].menuid){
      zy.ui.msg('提示信息：','菜单无效','w');
      return false;
    }
    
    thiz._get_data({
      api : 'savetropmenu',
      app : 'ZYAPP_MENU',
      mod : 'commmenu',
      r_parm : {menuid:treeNodes[0].menuid,targetmenuid:tNode.menuid}
    }, function(msg) {
      if (msg.ret == "0") {
        // initSMenuTree(thiz._g.Sorgid, tNode);
        // 将接口返回的menuid存起来
        tmp_menuid = msg.result[0].menuid;
      }
    }, function(){
      zy.ui.msg('提示', '菜单复制失败', 'w');
      return false;
    });
  }
  //drop之后
  function PTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
      //更新菜单id
      treeNodes[0].menuid = tmp_menuid;
  }
  var PMenuTreeSetting={
    view : {
      showTitle : false,
      selectedMulti : false,
      showIcon : false
    },
    data : {
      key : {
        children: 'children',
        name : 'menunm'
      }
    },
    edit : {
      showRenameBtn : false,
      showRemoveBtn : false,
      enable : true,
      drag : {
        isCopy : true,
        isMove : false
      }
    },
    callback : {
      beforeDrop : PTreeDrop,
      onDrop : PTreeOnDrop
    }
  };
  function initPMenuTree(){
    thiz._get_data({
      api : 'getorgappmenu',
      app : 'ZYAPP_MENU',
      mod : 'commmenu',
      r_parm : {}
    }, function(msg) {
      if (msg.result.length > 0) {
        $("#Ptree").empty();
        $.fn.zTree.init($("#Ptree"), PMenuTreeSetting, msg.result);
        var zTree = $.fn.zTree.getZTreeObj("Ptree");
        zTree.setting.edit.drag.prev = false;
        zTree.setting.edit.drag.inner = true;
        zTree.setting.edit.drag.next = false;
      } else {
        $("#Ptree").empty();
      }
    });
  }
  return MenuGetMenu;
})();