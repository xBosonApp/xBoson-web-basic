user_group = (function() {
  var PT = user_group.prototype;
  var thiz;
  var thisPage = $('#user_group');
  var staffTree = thisPage.find('#user_group_staff');
  var currentTreeOjb;
  var btnSave = thisPage.find('#user_group_save');
  var btnRefresh = thisPage.find('#user_group_refresh');
  var dropdownUg = thisPage.find('[name=ugid]');
  var chkRemoveFlag = thisPage.find('[name=removeflag]');

  var btnUgOP = thisPage.find('#user_group_ug_op');
  var staffInfo = thisPage.find('#user_group_staffinfo');
  var ugInfo = thisPage.find('#user_group_ug_info');
  var inputUgnm = thisPage.find('#ugnm');
  var btnUgAdd = thisPage.find('#user_group_ug_add');
  var btnUgEdit = thisPage.find('#user_group_ug_edit');
  var btnUgDel = thisPage.find('#user_group_ug_del');
  var btnUgCancel = thisPage.find('#user_group_ug_cancel');
  var submitFlag = true;

	// 菜单Tree设定
  var staffTreeSetting = {
		data: {
			key: {
				checked: 'checked',
				name: 'nm'
			}
		},
		check: {
      enable: true
		},
		callback: {
      onCheck: onCheck,
      onClick: function(event, treeId, treeNode, clickFlag) {
        currentTreeOjb.checkNode(treeNode, !treeNode.checked, true);
      }
    },
		view: {
			showIcon: false
		}
	};

  // 构造函数
  function user_group() {
    thiz = this;
    Init();
    return this;
  }

  // 初始化
  function Init() {
    setStaffTree();

    thisPage.modal('show');
    // 隐藏时将自身删除
    thisPage.on('hidden.bs.modal', function () {
      thisPage.remove();
    });

    ugInfo.hide();

    // 用户组列表
    setUgDropdown('');
    // 默认选中
    initRemoveFlag(true);
    // btnRefresh.attr('disabled', true);
  }

  // 用户
  function setStaffTree() {
    zy.g.am.app = 'c9e98ea6fc7148d186289e8c33776f8a';
    zy.g.am.mod = 'user_manager';
    zy.net.get('api/orgugstaff', function(msg) {
      if (msg && msg.result) {
        currentTreeOjb = $.fn.zTree.init(staffTree, staffTreeSetting, msg.result);
      }
    });
  }

  // 用户组列表
  function setUgDropdown(v) {
    zy.g.am.app='c9e98ea6fc7148d186289e8c33776f8a';
    zy.g.am.mod='user_manager';
    zy.net.get('api/orgugselect2',function(msg){
      dropdownUg.zySelectCustomData('', false, {width:'100%', allowClear:true}, msg.result);
      dropdownUg.select2('val', v);
      dropdownUg.on('change', function() {
        // 选择空时强制从所有用户组中移出，checkbox选中并不可修改
        initRemoveFlag(_.isEmpty($(this).val()));
      });
    });
  }

  // 初始化全部移出标记
  function initRemoveFlag(flag) {
    if (flag) {
      chkRemoveFlag.attr('checked', 'true');
      chkRemoveFlag.attr('disabled', true);
      chkRemoveFlag.parent().addClass('state-disabled');
    } else {
      chkRemoveFlag.attr('disabled', false);
      chkRemoveFlag.parent().removeClass('state-disabled');
    }
  }

  function onCheck(event, treeId, treeNode, clickFlag) {
    // desktop时设置部分跟随滚动条移动
    
    //checked的节点
    var nodes = currentTreeOjb.getCheckedNodes();
    if (nodes && nodes.length > 0) {
      btnRefresh.attr('disabled', false);
    } else {
      btnRefresh.attr('disabled', true);
    }
  }

  btnSave.on('click', function() {
    //checked的节点
    var nodes = currentTreeOjb.getCheckedNodes();
    if (nodes && nodes.length > 0) {
      var users = [];
      $.each(nodes, function(i, v) {
        if (!_.isEmpty(v.userid)) {
          users = _.concat(users, v.userid);
        }
      });
      if (users.length === 0) {
        zy.ui.msg('提示信息：', '请至少选择一位用户', 'w');
        return false;
      }
      var submitData = {};
      submitData.removeFlag = chkRemoveFlag.is(':checked');
      submitData.ugid = dropdownUg.val();
      submitData.users = users;

      zy.g.am.app = 'c9e98ea6fc7148d186289e8c33776f8a';
      zy.g.am.mod = 'user_manager';
      zy.g.am.json = true;
      zy.net.post('api/orgugstaffmaint', function(msg){
        if (msg) {
          zy.ui.msg('提示信息：', '保存成功！', 's');
          thisPage.modal('hide');
        }
      }, submitData, null, null);
    }
  });

  // 重置所有选择
  btnRefresh.on('click', function() {
    currentTreeOjb.checkAllNodes(false);
    dropdownUg.select2('val', '');
    initRemoveFlag(true);
  });

  btnUgOP.on('click', function() {
    if (ugInfo.is(':hidden')) {
      var ugid = dropdownUg.val();
      staffInfo.hide();
      ugInfo.show();
      if (_.isEmpty(ugid)) {
        inputUgnm.val('');
        btnUgEdit.btnDisable(true);
        btnUgDel.btnDisable(true);
      } else {
        inputUgnm.val(dropdownUg.select2('data').name);
        btnUgEdit.btnDisable(false);
        btnUgDel.btnDisable(false);
      }
      inputUgnm.focus();
    }
  });

  btnUgAdd.on('click', function() {
    ug_op_type = 'i';
    // Registration validation script
    submitFlag = true;
    ugInfo.validate(ugValidate);
  });

  btnUgEdit.on('click', function() {
    ug_op_type = 'u';
    // Registration validation script
    submitFlag = true;
    ugInfo.validate(ugValidate);
  });

  btnUgDel.on('click', function() {
    // Registration validation script
    ug_op_type = 'd';
    submitFlag = true;
    ugInfo.validate(ugValidate);

    // TODO: 2 doalogs 用div+按钮替换dialog
    //thisPage.formDisable(true);
    //dialogInit().dialog('open');
  });

  btnUgCancel.on('click', function() {
    submitFlag = false;
    ugInfo.hide();
    staffInfo.show();
  });

  var ugValidate = {
		// Rules for form validation
		rules: {
			ugnm: {
				required: submitFlag,
				maxlength: 100
			}
		},
		// 验证成功后保存
		submitHandler: function (frm) {
      if(!submitFlag){
        return;
      }
      zy.g.am.app='c9e98ea6fc7148d186289e8c33776f8a';
      zy.g.am.mod='user_manager';
      zy.net.get('api/orgugmaint',
        function(msg){
          if (msg) {
            zy.ui.msg('提示信息：', '保存成功！', 's');
            rgChanged = true;
            btnUgCancel.trigger('click');
            setStaffTree();
            if (msg.result){
              setUgDropdown(msg.result);
            } else {
              setUgDropdown('');
            }
          }
        },
        {op_type: ug_op_type, ugid: dropdownUg.val(), ugnm:inputUgnm.val()},
        null,
        function(msg){
          if (msg) {
            zy.ui.msg('保存失败', msg.msg, 'e');
          }
        });
		},
		// Do not change code below
		errorPlacement: function (error, element) {
			error.insertAfter(element.parent());
		}
  };

  return user_group;
})();