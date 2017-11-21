add_edit_modal = (function() {
  var PT = add_edit_modal.prototype;
  var thiz;
  var modal = $('#app_add_upd');
  
  
  var title = thisPage.find('#add_edit_modal_title');
  var form = thisPage.find('#add_edit_modal_form');
  var formRg = thisPage.find('#add_edit_modal_rg_info');
  var btnRgOP = thisPage.find('#add_edit_modal_rg_op');
  var btnRgAdd = thisPage.find('#add_edit_modal_rg_add');
  var btnRgEdit = thisPage.find('#add_edit_modal_rg_edit');
  var btnRgDel = thisPage.find('#add_edit_modal_rg_del');
  var btnRgCancel = thisPage.find('#add_edit_modal_rg_cancel');
  var btnConfirm = thisPage.find('#add_edit_modal_confirm');
  var btnCancel = thisPage.find('#add_edit_modal_cancel');
  var dropdownRgId = form.find('input[name=rg_id]');
  var inputRolenm = form.find('input[name=rolenm]');
  var inputRgnm = formRg.find('input[name=rg_nm]');
  var dlg = $('#add_edit_modal_dialog');

  var applicationid;

  // 构造函数
  function add_edit_modal(applicationid) {
    thiz = this;
    applicationid = applicationid;
    init();
    return this;
  }

  // 初始化
  function init() {
    zy.cache.initDicts('ZR.0051,ZR.0045', function(){
      zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
      zy.g.am.mod = 'yyfb';
      zy.net.get('api/p_app_get', function(msg) {
        var _c = modal.find('#accordion-4').find("#publicapilisttree");
        var _Mc = modal.find('#accordion-4').find("#secondModeltree");
        apilistTree('', '', _c, _Mc);
        modal.trigger('init');

      modal.find('textarea').unbind()
        .bind('input', function (e) {
          if ($(this).val() !== '')
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-check');
          else
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-exclamation');
        });

      modal.find('[name=appnm]').unbind('input')
        .bind('input', function (e) {
          if ($(this).val() !== '')
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-check');
          else
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-exclamation');
        });

        modal.find('[name=category]').zySelect('ZR.0051', false, {width: '100%', allowClear: false});
        modal.find('[name=excl]').zySelect('ZR.0045', false, {width: '100%', allowClear: false});
        modal.find('[name=category]').select2('val', '01');
        modal.find('[name=excl]').select2('val', '0');

        var _appcontainer = modal.find('[name=intro_path]');
        modal.find('[name=appuilist]').unbind()
          .bind('click', function () {
            $('#app_add_upd').modal('hide');
            zy.net.loadHTML('yingyong_ptgl/yyfb2/app_ui_list.html', $("#app_view_modal2"), function () {
              uilisttree(_appcontainer);
            });
          });

        if (msg) {
          var result = msg.result;
          if (appid) {
            result = [];
            $.each(msg.result, function (i, v) {
              if (appid != v.id)
                result.push(v);
            });
          }
          modal.find('[name=p_application_id]').zySelectCustomData('', false, {width: '100%'}, result);
        }
      });
      modal.modal('show');
      // 隐藏时将自身删除
      modal.on('hidden.bs.modal', function () {
        modal.remove();
      });
    });
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

  return add_edit_modal;
})();