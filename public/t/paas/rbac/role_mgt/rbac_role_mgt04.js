rbac_role_mgt04 = (function() {
  var PT = rbac_role_mgt04.prototype;
  var thiz;
  var thisPage = $('#rbac_role_mgt04');
  var title = thisPage.find('#rbac_role_mgt04_title');
  var form = thisPage.find('#rbac_role_mgt04_form');
  var formRg = thisPage.find('#rbac_role_mgt04_rg_info');
  var btnRgOP = thisPage.find('#rbac_role_mgt04_rg_op');
  var btnRgAdd = thisPage.find('#rbac_role_mgt04_rg_add');
  var btnRgEdit = thisPage.find('#rbac_role_mgt04_rg_edit');
  var btnRgDel = thisPage.find('#rbac_role_mgt04_rg_del');
  var btnRgCancel = thisPage.find('#rbac_role_mgt04_rg_cancel');
  var btnConfirm = thisPage.find('#rbac_role_mgt04_confirm');
  var btnCancel = thisPage.find('#rbac_role_mgt04_cancel');
  var dropdownRgId = form.find('input[name=rg_id]');
  var inputRolenm = form.find('input[name=rolenm]');
  var inputRgnm = formRg.find('input[name=rg_nm]');
  var dlg = $('#rbac_role_mgt04_dialog');

  PT._g = {
    op_type: '',
    roleid: '',
    rg_id: '',
    rg_op_type: '',
    title: ''
  };
  var submitFlag = true;
  var rgChanged = false;

  // 构造函数
  function rbac_role_mgt04(op_type, roleid, rg_id) {
    thiz = this;
    thiz._g.op_type = op_type;
    thiz._g.roleid = roleid;
    thiz._g.rg_id = rg_id;
    init();
    return this;
  }

  // 初始化
  function init() {
    initDropdownRg(function(){
      if (!_.isEmpty(thiz._g.rg_id)) {
        dropdownRgId.select2('val', thiz._g.rg_id);
      } else {
        dropdownRgId.val('');
      }
    });

    form.find('input[name=op_type]').val(thiz._g.op_type);
    form.find('input[name=roleid]').val(thiz._g.roleid);

    // 隐藏时将自身删除
    thisPage.on('hidden.bs.modal', function () {
      thisPage.remove();
    });

    btnRgOP.on('click', function() {
      if (formRg.is(':hidden')) {
        submitFlag = false;
        form.hide();
        formRg.show();
        title.text('角色组操作');
        var rg_id = dropdownRgId.val();
        if (_.isEmpty(rg_id)) {
          inputRgnm.val('');
          btnRgEdit.btnDisable(true);
          btnRgDel.btnDisable(true);
        } else {
          inputRgnm.val(dropdownRgId.select2('data').name);
          btnRgEdit.btnDisable(false);
          btnRgDel.btnDisable(false);
        }
        inputRgnm.focus();
      }
    });

    btnRgAdd.on('click', function() {
      thiz._g.rg_op_type = 'i';
      // Registration validation script
      submitFlag = true;
      formRg.validate(rgValidate);
    });

    btnRgEdit.on('click', function() {
      thiz._g.rg_op_type = 'u';
      // Registration validation script
      submitFlag = true;
      formRg.validate(rgValidate);
    });

    btnRgDel.on('click', function() {
      // Registration validation script
      thiz._g.rg_op_type = 'd';
      submitFlag = true;
      formRg.validate(rgValidate);

      // TODO: 2 doalogs 用div+按钮替换dialog
      //thisPage.formDisable(true);
      //dialogInit().dialog('open');
    });

    btnRgCancel.on('click', function() {
      submitFlag = false;
      formRg.hide();
      form.show();
      title.text(thiz._g.title);
    });

    // 确认
    btnConfirm.on('click', function() {
      // Registration validation script
      submitFlag = true;
      form.validate(roleValidate);
    });
  
    // 取消
    btnCancel.on('click', function() {
      if (rgChanged) {
				if (rbac_role_mgt01Obj) {
          // 重新初始化角色管理页面
          rbac_role_mgt01Obj.init();
				}
      }
    });

    if (thiz._g.op_type === 'i') {
      thiz._g.title = '角色添加';
    } else if (thiz._g.op_type === 'u') {
      thiz._g.title = '角色修改';
      zy.g.am.app = 'auth';
      zy.g.am.mod = 'rbac';
      zy.net.get('api/roleinfo', function (msg) {
        if (msg && msg.result.length > 0) {
          form.json2form(msg.result[0]);
          thiz._g.gotRoleInfo = true;
        }
      }, {roleid: thiz._g.roleid});
    }
    title.text(thiz._g.title);
    formRg.hide(); // 隐藏
    thisPage.modal('show');
  }

  // 角色组dropdown初始化
  function initDropdownRg(cb) {
    zy.g.am.app='auth';
    zy.g.am.mod='rbac';
    zy.net.get('api/rolegrouplist', function(msg){
      if (msg) {
        dropdownRgId.zySelectCustomData('', false, { allowClear: true, width: '100%' }, msg.result);
        if (cb) {
          cb();
        }
      }
    });
  }

  var roleValidate = {
		// Rules for form validation
		rules: {
			rolenm: {
				required: submitFlag,
				maxlength: 100
			},
			role_desc: {
				maxlength: 200
			}
		},
		// 验证成功后保存
		submitHandler: function (frm) {
      if(!submitFlag){
        return;
      }
			zy.g.am.app = 'auth';
			zy.g.am.mod = 'rbac';
			zy.net.get("api/rolemaint", function (msg) {
				if (msg) {
					if (rbac_role_mgt01Obj) {
            // 重新初始化角色管理页面
            if (thiz._g.op_type==='i' || thiz._g.op_type==='c') {
              // 添加新角色并返回时默认选中新角色
              rbac_role_mgt01Obj._g.currentRoleId = msg.roleid;
              rbac_role_mgt01Obj._g.currentRoleStatus = '1';
            }
            rbac_role_mgt01Obj.init();
					}
					thisPage.modal('hide');
					zy.ui.msg('提示信息：', '保存成功！', 's');
				}
			}, form.serialize(), null, function (msg) {
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
  var rgValidate = {
    debug: false,
		// Rules for form validation
		rules: {
			rg_nm: {
				required: submitFlag,
				maxlength: 100
			}
		},
		// 验证成功后保存
		submitHandler: function (frm) {
      if(!submitFlag){
        return;
      }
      zy.g.am.mod = 'rbac';
      zy.g.am.app = 'auth';
      zy.net.get('api/rgmaint',
        function(msg){
          if (msg) {
            zy.ui.msg('提示信息：', '保存成功！', 's');
            rgChanged = true;
            btnRgCancel.trigger('click');
            initDropdownRg(function(){
              if (msg.result){
                dropdownRgId.select2('val', msg.result);
              } else {
                dropdownRgId.val('');
              }
            });
          }
        },
        {op_type: thiz._g.rg_op_type, rg_id: dropdownRgId.val(), rg_nm:inputRgnm.val()},
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
    // var setting = {
    //   autoOpen: false,
    //   width: 300,
    //   resizable: false,
    //   modal: true,
    //   focus: function(event, ui) {
    //     // 在dialog获得焦点时设置焦点到取消按钮
    //     $(dlg.siblings('.ui-dialog-buttonpane').find('button:eq(1)')).focus();
    //   },
    //   title: '<div class="widget-header"><h4><i class="fa fa-warning"></i>&nbsp;确定删除该角色组？</h4></div>',
    //   open: function(event, ui) {
    //     dlg.append('<div class="ui-dialog-content">角色组内的角色将不会被删除</div>');
    //   },
    //   buttons: [{
    //     html: '<i class="fa fa-trash-o"></i>&nbsp;确定',
    //     class: 'btn btn-danger btn-xs',
    //     click: function() {
    //       thisPage.formDisable(false);
    //       thiz._g.rg_op_type = 'd';
    //       // Registration validation script
    //       submitFlag = true;
    //       formRg.validate(rgValidate);
    //       $(this).dialog('close');
    //     }
    //   }, {
    //     html: '<i class="fa fa-times"></i>&nbsp;取消',
    //     class: 'btn btn-default btn-xs',
    //     click: function() {
    //       thisPage.formDisable(false);
    //       $(this).dialog('close');
    //     }
    //   }],
    //   close: function() {
    //     $(this).remove();
    //   }
    // };

    //对话框
    dlg.dialog({
      autoOpen: false,
      width: 300,
      resizable: false,
      modal: true,
      focus: function(event, ui) {
        // 在dialog获得焦点时设置焦点到取消按钮
        $(dlg.siblings('.ui-dialog-buttonpane').find('button:eq(1)')).focus();
      },
      title: '<div class="widget-header"><h4><i class="fa fa-warning"></i>&nbsp;确定删除该角色组？</h4></div>',
      open: function(event, ui) {
        dlg.append('<div class="ui-dialog-content">角色组内的角色将不会被删除</div>');
      },
      buttons: [{
        html: '<i class="fa fa-trash-o"></i>&nbsp;确定',
        class: 'btn btn-danger btn-xs',
        click: function() {
          thisPage.formDisable(false);
          thiz._g.rg_op_type = 'd';
          // Registration validation script
          submitFlag = true;
          formRg.validate(rgValidate);
          $(this).dialog('close');
        }
      }, {
        html: '<i class="fa fa-times"></i>&nbsp;取消',
        class: 'btn btn-default btn-xs',
        click: function() {
          thisPage.formDisable(false);
          $(this).dialog('close');
        }
      }],
      close: function() {
        $(this).remove();
      }
    });
  }

  return rbac_role_mgt04;
})();