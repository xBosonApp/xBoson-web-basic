/* Create By xBoson System */


function MsgStatsLog(){
  
  var tenantID = window.tenantID; //租户ID参数
  
  $msg_log_wid = $("#msg_stats_log_wid");
  
  var searchForm = $msg_log_wid.find("#msg_stats_log_search_form");
  var paginationDiv = $msg_log_wid.find('#msg_stats_log_pagination');
  
  var $grid = $msg_log_wid.find("#msg_stats_log_dt");
  
  var contentDiv= $('#msg_stats_log_innercontent');
  // $modal_container = $("#member-manage-modal");
  
  // var $add = $member_manage.find("#member-grid-toolbar-add");
  // var $edit = $member_manage.find("#member-grid-toolbar-edit");
  // var $delete = $member_manage.find("#member-grid-toolbar-delete");
  
  var memberDataTableApi; //表格DataTable API对象
  var pageNum = 1; // 分页
  
  // 发送状态
  // var stateArr = [
  //   {id:0, name:'已启动计划任务'},
  //   {id:1, name:'发送成功'},
  //   {id:2, name:'发送失败'},
  // ];
  
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
    // Grid_Toolbar_Event();
    
    //表格初始化
    grid_init(function(isSelected){
      // 编辑删除按钮 disable状态
      // $edit.btnDisable(!isSelected);
      // $delete.btnDisable(!isSelected);
    });
    
    Search_Form_Init();
    Paginator_Init(1,20);
    
  }
  
  // 表格初始化
  function grid_init(rowSelectedCB){
    
    
    //注册DataTable行点击事件
    // $grid.on('click', 'tr', function () {
      // if ($(this).hasClass('active')) {
      //   $(this).removeClass('active');
      //   rowSelectedCB && rowSelectedCB(false);
      // }
      // else {
      //   memberDataTableApi.$('tr.active').removeClass('active');
      //   $(this).addClass('active');
      //   rowSelectedCB && rowSelectedCB(true);
      // }
    // });
    $grid.on('click', '[name="detail"]', function (e) {
      // console.log('e=',e);
      var $tr = $(e.currentTarget).closest('tr');
      // $(e.currentTarget).popover({sanitize:false});
      // $(e.currentTarget).popover('toggle');
      var rowData = memberDataTableApi.row($tr).data(); // 所在行数据
      // 
      
      zy.net.loadHTMLs("saas/tasks/msg/view.html",contentDiv,function(){
        // main(node);
        // tenant_member_view(node._id);
        MsgLog(tenantID, new Date(rowData.date));
      });
    });
    
    var options = {
      columns: [
        {
          title: "日期",
          "render": function(data, type, row, meta) {
            
            return row.date.substring(0,10);
            
          }
        },
        // {
        //   title: "租户ID",
        //   data: "orgid",
        //   defaultContent: ''
        // },
        {
          title: "已启动计划任务",
          data: "count.state0",
          defaultContent: ''
        },
        {
          title: "发送成功",
          data: "count.state1",
          defaultContent: ''
        },
        {
          title: "发送失败",
          data: "count.state2",
          defaultContent: ''
        },
        {
          title: "详情",
          "render": function(data, type, row, meta) {
            return '<a tabindex="0" class="btn" role="button" name="detail">查看</a>'
          },
          defaultContent: ''
        }
      ],
      "language": zy.ui.dataTable.language,
      "select": false,
      "searching": false,
      "paging": false,
      "ordering": false,
      "info": false,
    };
    // 合并初始化参数选项
    // $.extend(options, zy.ui.dataTable);
    
    memberDataTableApi = $grid.DataTable(options);
    
    // memberDataTableApi.on('draw',function(e){
    //   zy.log('draw',e);
    //   // $('[data-toggle="popover"]').popover()
    // });
    // 合并初始化参数选项
    // $.extend(options, zy.ui.dataTable);
  }
  
  function Paginator_Init(page){
    $.jqPaginator(paginationDiv, {
      totalCounts: 1,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        zy.log('onPageChange num = ' + num);
        // zy.log('onPageChange',this);
        pageNum = num;
        grid_setData();
        // query(function(result){
        //   grid_setData(result.data);
        // });
        // thiz.SetDt(num);
      }
    });
  }
  
  function grid_setData(){
    
    query(function(result){
      memberDataTableApi.clear();
      memberDataTableApi.rows.add(result.data).draw();
      // 总数
      $msg_log_wid.find('[name=total_count]').text('总数：'+result.count);
      // 分页更新
      if(result.count>0){
        paginationDiv.jqPaginator('option', {
          totalCounts: result.count,
          pageSize: zy.g.page.pagesize,
          currentPage: pageNum
        });
      }else{
        pageNum = 1;
        paginationDiv.jqPaginator('destroy');
      }
    });
    
      // 查询数据
    function query(cb){
      // zy.log('query:',searchForm);
      var formData = searchForm.form2json();
      var params = {
        tenantId: tenantID,
        startTime: new Date(formData.dt_from+' 00:00:00').toISOString(),
        endTime: new Date(formData.dt_to+' 00:00:00').toISOString(),
        pageSize: zy.g.page.pagesize,
        pageNum: pageNum
      }
      
      zy.g.am.app = 'f1b4adf82ee54a1c8e18d31349988a4b';
      zy.g.am.mod = 'message';
      zy.net.get("api/getMsgStatistic", function(msg){
        if(msg && msg.result){
          cb && cb(msg.result);
        }
      }, params);
    }
  }
  
  
  // 搜索表单初始化
  function Search_Form_Init(){
    //开始日期
    searchForm.find('[name=dt_from]').datepicker({
      language:'zh-CN',
      format:'yyyy-mm-dd'
    });
    searchForm.find('[name=dt_from]').datepicker('setDate',Date());
    //结束日期
    searchForm.find('[name=dt_to]').datepicker({
      language:'zh-CN',
      format:'yyyy-mm-dd'
    });
    searchForm.find('[name=dt_to]').datepicker('setDate',Date());
    
    
    
    // 年份select初始化
    // get_years_data(function(data){
    //   searchForm.find('[name=year]').zySelectCustomData('',false,{
    //     width:'100%'
    //   },data);  
    //   searchForm.find('[name=year]').select2('val',data[data.length-1].id);
    // });
    
    // state初始化
    // searchForm.find('[name=state]').zySelectCustomData('',true,{
    //     width:'100%'
    //   },stateArr); 
    // searchForm.find('[name=state]').select2('val','');

    //查询Form
    searchForm.validate({
      // Rules for form validation
      rules: {
        dt_from:{
          required: true
        },
        dt_to:{
          required: true
        },
        time_from:{
          required: true
        },
        time_to:{
          required: true
        },
        // appid: {
        //   required: true
        // },
        // elapsed: {
        //   digits: true,
        //   min: 0,
        //   max: 10000000
        // }
      },
      // 验证成功后保存
      submitHandler: function (form) {
        $('#msg_log_search').button('loading');
        Paginator_Init(1);
      },
      // Do not change code below
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
    });
  }
  
}