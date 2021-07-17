/* Create By xBoson System */


function tenant_member_view(){
  
  var tenantID = window.tenantID; //租户ID参数
  
  $member_manage = $("#member-manage");
  $modal_container = $("#member-manage-modal");
  
  var $add = $member_manage.find("#member-grid-toolbar-add");
  var $edit = $member_manage.find("#member-grid-toolbar-edit");
  var $delete = $member_manage.find("#member-grid-toolbar-delete");
  
  var memberDataTableApi; //表格DataTable API对象
  
  
  if(!tenantID){
    // 获取当前登录用户是哪个租户管理员
    zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
    zy.g.am.mod = 'tenant';
    zy.net.get("api/getLoginUserTenant", function(msg){
      if(msg && msg.result && msg.result[0]){
        tenantID = msg.result[0]._id;
        Init();
      }else{
        zy.ui.msg("提示", "非租户管理员！", "w");
      }
    });
  }else{
    Init();
  }
  
  function Init(){
    
    //表格工具栏事件
    Grid_Toolbar_Event();
    
    //表格初始化
    grid_init(function(isSelected){
      // 编辑删除按钮 disable状态
      $edit.btnDisable(!isSelected);
      $delete.btnDisable(!isSelected);
    });
    
  }
  
  // 表格工具栏事件
  function Grid_Toolbar_Event(){
    
    
    $add.on("click",function(){
      zy.net.loadHTMLs("saas/om/tenant/member_add_edit.html",$modal_container,function(){
        member_add_edit({_id:tenantID},"i",function(formData){
          // 添加表格行数据
          memberDataTableApi.row.add(formData).draw();
        })
      });
    });
    
    $edit.on("click",function(){
      zy.net.loadHTMLs("saas/om/tenant/member_add_edit.html",$modal_container,function(){
        //获取当前选择表格行数据
        var data = memberDataTableApi.row('tr.active').data();
        data._id = tenantID;
        
        member_add_edit(data,"u",function(formData){
          // 修改表格行数据
          memberDataTableApi.row('tr.active').data(formData).draw();
        });
        
      });
    });
    
    //删除分类
    $delete.on("click", function () {
      
      //获取当前选择表格行数据
      var data = memberDataTableApi.row('tr.active').data();
      
      //确认删除
      zy.ui.mask("删除确认", "是否确认删除此成员", function () {


        zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
        zy.g.am.mod = 'tenant';

        zy.net.get("api/memberDel", function (msg) {
          if (msg) {
            zy.ui.msg("提示", "删除成功", "s");
            
            memberDataTableApi.row('tr.active').remove().draw();
          
            $edit.btnDisable(true);
            $delete.btnDisable(true);
          }
        },
          {
            _id: tenantID,
            tel: data.tel
          });

        
      });
      
    });
    
    
  }
  
  // 表格初始化
  function grid_init(rowSelectedCB){
    var $grid = $member_manage.find("#member-grid");
    
    //注册DataTable行点击事件
    $grid.on('click', 'tr', function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        rowSelectedCB && rowSelectedCB(false);
      }
      else {
        memberDataTableApi.$('tr.active').removeClass('active');
        $(this).addClass('active');
        rowSelectedCB && rowSelectedCB(true);
      }
    });
    
    var options = {
      columns: [
        {
          title: "成员姓名",
          data: "name"
        },
        {
          title: "成员手机号",
          data: "tel"
        },
        {
          title: "成员职位",
          data: "post",
          defaultContent: ""
        },
        {
          title: "成员备注",
          data: "mark",
          defaultContent: ""
        }
      ],
      "language": zy.ui.dataTable.language,
      select: true
    };
    
    var cb = function(msg){
      if(msg && msg.result){
        options.data = msg.result[0].member;
        memberDataTableApi = $grid.DataTable(options);
      }
    }
    
    zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
    zy.g.am.mod = 'tenant';
    zy.net.get("api/memberGet", cb, {
      _id: tenantID
    });
    // 合并初始化参数选项
    // $.extend(options, zy.ui.dataTable);
  }
  
  // function grid_setData(data){
  //   memberDataTableApi.clear();
  //   memberDataTableApi.rows.add(data).draw();
  // }
}