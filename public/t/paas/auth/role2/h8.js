 /**
 * 授权 角色
 * @class AuthRoleH8
 */
AuthRoleH8 = (function() {

  var PT = AuthRoleH8.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {
      orgid: zy.g.comm.org
    },
    page: 1, //开始页数
    count: 1, //总记录数
    adminFlag: 0 //管理员标记
  };

  //widget
  var widgetDiv = $('#mdm_datadict_h1_wid1');
  //表格元素对象
  var dt = $('#auth_role_h8_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleH8
   * @constructor
   */
  function AuthRoleH8() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.Select();
    thiz.Toolbar();
    thiz.dialogInit();
    // thiz.ReturnAdminType();
    $('#auth_role_h8_edit').btnDisable(true);
    $('#auth_role_h8_set').btnDisable(true);
    $('#auth_role_h8_del').btnDisable(true);
    $('#auth_role_h8_preview').btnDisable(true);
    $('#auth_role_h8_page_auth').btnDisable(true);
    
    //判断租户还是开发商
     zy.extend.get({
      app:'zyapp_login',
      mod:'zymodule_login',
      apinm:'getuserorgtype'
     },function(msg){
       if(msg.result[0].org_type === "t"){
         $('#auth_role_h8_set').attr('style','display:none');
       }
     });
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
      $('.dataTables_scrollHeadInner').css('width', '100%');
      $('.dataTables_scrollBody table').css('width', '100%');
      $('.dataTables_scrollHeadInner table').css('width', '100%');
    }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "rolenm"
        // "render": function(data, type, row, meta) {
        //   return '<div style="float:right;">'+row.rolenm+'</div>';
        // }
      }, 
      {
        "data": "role_desc"
      }, 
      {
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('ZR.0010', row.op_type);
        }
      }, 
      {
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('ZR.0046',row.role_type);
        }
      }, 
      {
        "render": function(data, type, row, meta) {
          return $.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss');
        }
      }, 
      {
        "render": function(data, type, row, meta) {
          var _data, str, str0, str1;
          // 参数设置
          _data = 'data-roleid=\'' + row.roleid + '\'';
          _data += ' data-status=\'' + row.status + '\'';
          if (row.status === '1') {
            str0 = '';
            str1 = 'checked=\'checked\'';
          } else {
            str0 = 'checked=\'checked\'';
            str1 = '';
          }
          str = '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'0\' ' + str0 + '><span>无效</span></label></div>';
          str += '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'1\' ' + str1 + '><span>有效</span></label></div>';
          return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'auth_role_h8_status\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + zy.cache.cd2name('ZR.0001', row.status) + '</a>';
        }
      }];
    //根据管理员类型，决定是否返回comm_flag
    // zy.g.am.app = 'ZYAPP_LOGIN';
    // zy.g.am.mod = 'ZYMODULE_LOGIN';
    // zy.net.get("api/usertype", function(msg) {
    //   if (msg) {
        // if (thiz._g.adminFlag != "1") {
        //   columns.splice(3, 1);
        //   $("#auth_role_h8_comm_flag").remove();
        // }
        //预设初始化参数
        var options = {
          "data": data,
          "columns": columns
        };
        // 合并初始化参数选项
        $.extend(options, zy.ui.dataTable);
        //初始化 DataTable
        dt.dataTable(options);
        DynamicWidth();
    //   }
    // });
  };

  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#auth_role_h8_edit').btnDisable(true);
        $('#auth_role_h8_set').btnDisable(true);
        $('#auth_role_h8_del').btnDisable(true);
        $('#auth_role_h8_preview').btnDisable(true);
        $('#auth_role_h8_page_auth').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#auth_role_h8_edit').btnDisable(false);
        $('#auth_role_h8_set').btnDisable(false);
        $('#auth_role_h8_del').btnDisable(false);
        $('#auth_role_h8_preview').btnDisable(false);
        $('#auth_role_h8_page_auth').btnDisable(false);
      }
    });
    //为用户分配角色
    $('#auth_role_h8_usr').click(function() {
      zy.net.loadHTML("auth/userrole/h12.html", $("#widget-grid").parent());
    });
    //为部门分配角色
    $('#auth_role_h8_dept').click(function() {
      zy.net.loadHTML("auth/deptrole/h14.html", $("#widget-grid").parent());
    });
    //查询
    $('#auth_role_h8_search').click(function() {
      $('#auth_role_h8_edit').btnDisable(true);
      $('#auth_role_h8_set').btnDisable(true);
      $('#auth_role_h8_del').btnDisable(true);
      $('#auth_role_h8_preview').btnDisable(true);
      $('#auth_role_h8_page_auth').btnDisable(true);
      $('#auth_role_h8_search').button('loading');
      thiz.Pagination(1);
    });
    //添加
    $('#auth_role_h8_add').click(function() {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("auth/role2/h9h10.html", $("#auth_role_h8_form"));
    });
    //修改
    $('#auth_role_h8_edit').click(function() {
    // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      zy.log('active row data=',data);
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.roleid = data.roleid; //获取选择行数据，设置参数
      zy.net.loadHTML("auth/role2/h9h10.html", $("#auth_role_h8_form"));
    });
    //设置权限
    $('#auth_role_h8_set').click(function() {
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.roleid = data.roleid; //获取选择行数据，设置参数
      thiz._g.param.rolenm = data.rolenm;
      thiz._g.param.status = data.status;
      thiz._g.param.op_type = data.op_type;
      if (thiz._g.param.status != '1') {
        zy.ui.msg('提示信息：', '此角色状态为无效,只可查看不可修改！', 'w');
      }
      console.log(thiz._g.param.roleid + thiz._g.param.rolenm);
      zy.net.loadHTML("auth/role2/h11.html", $("#auth_role_h8_form"));
    });
    //预览角色菜单
    $('#auth_role_h8_preview').click(function() {
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.roleid = data.roleid; //获取选择行数据，设置参数
      thiz._g.param.rolenm = data.rolenm;
      zy.net.loadHTML("auth/role2/h12.html", $("#auth_role_h8_form"));
    });
    //点击左侧菜单栏时，销毁对话框实例
    $('#left-panel nav').bind("click", function() {
      $('#auth_role_dialog_div').dialog('destroy');
    });
    //删除
    $('#auth_role_h8_del').click(function() {
      //获取选择行数据，设置参数
      thiz._g.param.roleid = dt.DataTable().row('.active').data().roleid;
      $('#auth_role_dialog_div').dialog('open');
    });
    //角色页面权限
    $('#auth_role_h8_page_auth').click(function() {
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.roleid = data.roleid; //获取选择行数据，设置参数
      thiz._g.param.rolenm = data.rolenm;
      zy.net.loadHTML("auth/role2/h13.html", $("#auth_role_h8_form"));
    });
    //页面一览
    $('#auth_role_h8_page_view').click(function() {
      zy.net.loadHTML("auth/role2/h14.html", $("#auth_role_h8_form"));
    });
  };

  PT.dialogInit = function() {
    //对话框标题转换为html
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
      _title: function(title) {
        if (!this.options.title) {
          title.html("&#160;");
        } else {
          title.html(this.options.title);
        }
      }
    }));
    //对话框
    $('#auth_role_dialog_div').dialog({
      autoOpen: false,
      width: 600,
      resizable: false,
      modal: true,
      title: "<div class='widget-header'><h4><i class='fa fa-warning'></i> 是否确定删除该数据？</h4></div>",
      open: function(event, ui) {
        var callback1 = function(msg) {
          console.log(msg);
          var content0 = "受影响的用户：";
          var content1 = "受影响的部门：";
          content0 = content0 + "<table>";
          content1 = content1 + "<table>";
          //判断
          if (msg.user.length == 0) {
            $('#auth_role_cont_user').attr('style', 'vertical-align:top; display: none;');
          } else {
            $('#auth_role_cont_user').attr('style', 'vertical-align:top;');
          }
          if (msg.dept.length == 0) {
            $('#auth_role_cont_dept').attr('style', 'vertical-align:top; display: none;');
          } else {
            $('#auth_role_cont_dept').attr('style', 'vertical-align:top;');
          }
          if (msg) {
            //循环msg.user   msg.dept
            for (var i = 0; i < msg.user.length; i++) {
              content0 = content0 + "<tr><td style='padding: 4px;'>" + msg.user[i].userid + "</td><td style='padding: 4px;'>" + msg.user[i].usernm + "</td><tr/>";
            }
            for (var i = 0; i < msg.dept.length; i++) {
              content1 = content1 + "<tr><td style='padding: 4px;'>" + msg.dept[i].deptnm + "</td><tr/>";
            }

            content0 = content0 + "</table>";
            content1 = content1 + "</table>";
            $('#auth_role_cont_user').html(content0);
            $('#auth_role_cont_dept').html(content1);
          }
          //判断
          if (msg.sys && msg.menu) {
            console.log('kak');
            var content2 = "受影响的系统：";
            var content3 = "受影响的菜单：";
            content2 = content2 + "<table>";
            content3 = content3 + "<table>";
            //判断
            if (msg.sys.length == 0) {
              $('#auth_role_cont_sys').attr('style', 'vertical-align:top; display: none;');
            } else {
              $('#auth_role_cont_sys').attr('style', 'vertical-align:top;');
            }
            if (msg.menu.length == 0) {
              $('#auth_role_cont_menu').attr('style', 'vertical-align:top; display: none;');
            } else {
              $('#auth_role_cont_menu').attr('style', 'vertical-align:top;');
            }
            if (msg) {
              //循环msg.user   msg.dept  msg.sys   msg.menu
              for (var i = 0; i < msg.sys.length; i++) {
                content2 = content2 + "<tr><td style='padding: 4px;'>" + msg.sys[i].sysnm + "</td><tr/>";
              }
              for (var i = 0; i < msg.menu.length; i++) {
                content3 = content3 + "<tr><td style='padding: 4px;'>" + msg.menu[i].menunm + "</td><tr/>";
              }
              content2 = content2 + "</table>";
              content3 = content3 + "</table>";
              $('#auth_role_cont_sys').html(content2);
              $('#auth_role_cont_menu').html(content3);
            }
          }
        };
        var param1 = {};
        param1.roleid = thiz._g.param.roleid;
        param1.flag = '0'; //返回受影响的部分用户和部门操作
        zy.g.am.app = 'auth';
        zy.g.am.mod = 'role';
        zy.net.get("api/deleterole", callback1, param1);
      },
      buttons: [{
        html: "<i class='fa fa-trash-o'></i>&nbsp; 确定",
        "class": "btn btn-danger",
        click: function() {
          var callback = function(msg) {
            if (msg) {
              $('#auth_role_h8_form').formDisable(false);
              dt.DataTable().row('.active').remove().draw();
              thiz.Pagination(thiz._g.crt_page); //更新当前页
              zy.ui.msg("提示信息：", "删除成功！", "s");
            }
          };
          var param = {};
          param.roleid = thiz._g.param.roleid;
          param.flag = '1'; //删除操作
          zy.g.am.app = 'auth';
          zy.g.am.mod = 'role';
          zy.net.get("api/deleterole", callback, param);
          $(this).dialog("close");
        }
      }, {
        html: "<i class='fa fa-times'></i>&nbsp; 取消",
        "class": "btn btn-default",
        click: function() {
          $(this).dialog("close");
        }
      }]
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#auth_role_h8_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        thiz._g.crt_page = num; //当前页码
        Console.log('onPageChange num = ' + num);
        thiz.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function(page) {
    var cb = function(msg) {
      $('#auth_role_h8_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        widgetDiv.find('[name=total_count]').html('总数：'+msg.count);
        thiz.DataTable(msg.result);
        if (msg.count > 0) {
          $('#auth_role_h8_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#auth_role_h8_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    //    zy.g.comm.org="test";
    zy.g.am.app = "auth";
    zy.g.am.mod = "role";
    $("#auth_role_h8_search_form input[name=orgid]").val(thiz._g.param.orgid);
    zy.net.get("api/roles", cb, $('#auth_role_h8_search_form').serialize(), page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function(msg) {
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function(el) {
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function(msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function() {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
    };
    param.roleid = el.data('roleid');
    param.status = st;
    param.orgid = thiz._g.param.orgid;
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'role';
    zy.net.get('api/setrolestatus', cb, param);
  };
  PT.Select = function() {
    // 数据字典处理
    var cb = function() {
      // 字典数据绑定
      $('#auth_role_h8_search_form input[name=status]').zySelect('ZR.0001', true, {
        width: '100%'
      });
      $('#auth_role_h8_search_form input[name=role_type]').zySelect('ZR.0046', true, {
        width: '100%'
      });
      $('#auth_role_h8_search_form input[name=status]').select2('val','1');  //默认值
      $('#auth_role_h8_search_form input[name=role_type]').select2('val','01');  //默认值
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001,ZR.0010,ZR.0046', cb);
  };
  /**
   * 返回管理员类型
   * @method ReturnAdminType
   */
  PT.ReturnAdminType = function() {
    var callbackUser = function(msg) {
      if (msg) {
        //为adminFlag赋值
        thiz._g.adminFlag=msg.result[0].adminflag;
        if (msg.result[0].adminflag == '1' || msg.result[0].adminflag == '3' || msg.result[0].adminflag == '5') {
          thiz.Pagination(1);
        } else {
          $('#widget-grid').remove();
          zy.ui.msg("提示信息：", "用户不是管理员！", "w");
        }
      }
    };
    zy.g.am.app = 'ZYAPP_LOGIN';
    zy.g.am.mod = 'ZYMODULE_LOGIN';
    zy.net.get("api/usertype", callbackUser);
  };
  return AuthRoleH8;
})();
