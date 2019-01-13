rbac_role_mgt02 = (function () {
  var PT = rbac_role_mgt02.prototype;
  var thiz;
  var PAGE_NUM = 1;
  var PAGE_SIZE = 10;
  PT._g = {
    roleid: '',
    user_pagesize: PAGE_SIZE,
    user_count: 0
  };

  var thisPage = $('#rbac_role_mgt02');
  var spanUg = thisPage.find('#rbac_role_mgt02_tab_ug_span');
  var spanUser = thisPage.find('#rbac_role_mgt02_tab_user_span');
  var spanClient = thisPage.find('#rbac_role_mgt02_tab_client_span');
  var ugContainer = thisPage.find('#rbac_role_mgt02_accordion_ug');
  var tmplUg = $.templates('#rbac_role_mgt02_tmpl_ug');
  var btnMoreUser = thisPage.find('#rbac_role_mgt02_btn_user_more');
  var tblUser = thisPage.find('#rbac_role_mgt02_table_user');
  var tblClient = thisPage.find('#rbac_role_mgt02_table_client');
  var userColumns = [
    { 'data': 'userid' },
    { 'data': 'usernm' }
  ];
  var clientColumns = [
    { 'data': 'clientnm' }
  ];

  // 构造函数
  function rbac_role_mgt02(roleid) {
    thiz = this;
    thiz._g.roleid = roleid;
    // // 隐藏时将自身删除
    // thisPage.on('hidden.bs.modal', function () {
    //   thisPage.remove();
    // });
    init();
    return this;
  }

  // 初始化页面
  function init() {
    DataTable(userColumns, [], tblUser);
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    var roleeffectParam = {
      roleid: thiz._g.roleid,
      uguser_pagenum: PAGE_NUM,
      uguser_pagesize: 10,
      user_pagenum: PAGE_NUM,
      user_pagesize: thiz._g.user_pagesize
    };

    zy.net.get("api/roleeffect", function(msg){
      if (msg) {
        // 设置各个count
        spanUg.text(msg.ug.length);
        spanUser.text(msg.user_count);
        spanClient.text(msg.client.length);
        thiz._g.user_count = msg.user_count;
        // 用户组及其关联用户
        var html = tmplUg.render(msg.ug);
        ugContainer.empty();
        ugContainer.html(html);

        thisPage.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = $(e.target).closest('li');
          var id = target.attr('id');
          // 用户组用户table
          if (id === 'rbac_role_mgt02_tab_li_ug') {
            if (msg.ug) {
              $.each(msg.ug, function(i, v) {
                var tblUgUser = thisPage.find('#rbac_role_mgt02_table_uguser'+v.ugid);
                DataTable(msg.ug, tblUgUser);
              });
            }
          }
          // 用户table
          if (id === 'rbac_role_mgt02_tab_li_user') {
            DataTable(userColumns, msg.user, tblUser);
          }
          // 客户端table
          if (id === 'rbac_role_mgt02_tab_li_client') {
            DataTable(clientColumns, msg.client, tblClient);
          }
        });
        // if (msg.ug.length > 0) {
        //   $('#rbac_role_mgt02_tab_li_ug').addClass('active');
        //   $('#rbac_role_mgt02_tab_ug').addClass('active');
        // } else if (msg.user_count > 0) {
        //   $('#rbac_role_mgt02_tab_li_user').addClass('active');
        //   $('#rbac_role_mgt02_tab_user').addClass('active');
        // } else if (msg.client.length > 0) {
        //   $('#rbac_role_mgt02_tab_li_client').addClass('active');
        //   $('#rbac_role_mgt02_tab_client').addClass('active');
        // }
        // 更多用户组用户事件
        //
      }
    }, roleeffectParam);
  }

  DataTable = function(columns, data, dt) {
    //预设初始化参数
    var options = {
      data: data,
      columns: columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    $(dt.DataTable().table().header()).hide();
  };

  // 更多用户按钮事件
  btnMoreUser.on('click', function() {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    var roleeffectParam = {
      roleid: thiz._g.roleid,
      user_pagenum: PAGE_NUM,
      user_pagesize: thiz._g.user_pagesize + PAGE_SIZE,
      user_count: thiz._g.user_count
    };
    zy.net.get("api/roleeffect", function(msg){
      if (msg) {
        if (thiz._g.user_pagesize >= msg.user.length) {
          zy.ui.msg('提示', '没有更多数据了', 'i');
        }
        // 用户table
        DataTable(userColumns, msg.user, tblUser);
      }
    }, roleeffectParam);
  });

  return rbac_role_mgt02;
})();