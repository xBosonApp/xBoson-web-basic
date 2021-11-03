/* Create By xBoson System */


function MsgLog(tenantId,dateObj){
  
  // var tenantID = window.tenantID; //租户ID参数
  
  dateObj = dateObj || new Date();
  
  $msg_log_wid = $("#msg_log_wid");
  var searchForm = $msg_log_wid.find("#msg_log_search_form");
  // $modal_container = $("#member-manage-modal");
  
  // var $add = $member_manage.find("#member-grid-toolbar-add");
  // var $edit = $member_manage.find("#member-grid-toolbar-edit");
  // var $delete = $member_manage.find("#member-grid-toolbar-delete");
  
  var memberDataTableApi; //表格DataTable API对象
  var pageNum = 1; // 分页
  
  // 发送状态
  var stateArr = [
    {id:0, name:'待发送'},
    {id:1, name:'发送成功'},
    {id:2, name:'发送失败'},
  ];
  
  // if(!tenantID){
  //   // 获取当前登录用户是哪个租户管理员
  //   zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
  //   zy.g.am.mod = 'tenant';
  //   zy.net.get("api/getLoginUserTenant", function(msg){
  //     if(msg && msg.result && msg.result[0]){
  //       tenantID = msg.result[0]._id;
  //       Init();
  //     }else{
  //       zy.ui.msg("提示", "非租户管理员！", "w");
  //     }
  //   });
  // }else{
    
    Init();
  // }
  
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
    var $grid = $msg_log_wid.find("#msg_log_dt");
    
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
    $grid.on('click', '[data-toggle="popover"]', function (e) {
      // console.log('e=',e);
      var $tr = $(e.currentTarget).closest('tr');
      // $(e.currentTarget).popover({sanitize:false});
      // $(e.currentTarget).popover('toggle');
      var rowData = memberDataTableApi.row($tr).data(); // 所在行数据
      // 显示内容
      var content = '无';
      if(rowData.state==1) {
        content = JSON.stringify(rowData.sms_status.success,null,2);
      }
      if(rowData.state==2){
        content = JSON.stringify(rowData.sms_status.error,null,2);
      } 
      content = '<pre>'+content+'</pre>';
      // 触发显示
      $(e.currentTarget).popover({content:content}).popover('toggle');
    });
    
    var options = {
      columns: [
        {
          title: "消息ID",
          data: "_id"
        },
        {
          title: "提醒时间",
          data: "date"
        },
        // {
        //   title: "租户ID",
        //   data: "orgid",
        //   defaultContent: ''
        // },
        {
          title: "计划任务状态",
          data: "schedule_status",
          defaultContent: ''
        },
        {
          title: "发送状态",
          "render": function(data, type, row, meta) {
            
            for(var i in stateArr){
              if(stateArr[i].id == row.state){
                return stateArr[i].name;
              }
            }
            
          },
          defaultContent: ''
        },
        {
          title: "消息发送时间",
          "render": function(data, type, row, meta) {
            if(row.state ==0) return '';
            if(row.state==1) return row.sms_status.date;
            if(row.state==2){
              var tmp = row.sms_status.error;
              return tmp[tmp.length-1].date
            } 
          },
          defaultContent: ''
        },
        {
          title: "消息响应内容",
          "render": function(data, type, row, meta) {
            if(!row.state || row.state=='0'){
              return '';
            }
            return '<a tabindex="0" class="btn" role="button"  data-toggle="popover" data-placement="left" data-trigger="focus" title="" data-html="true">查看</a>'
          },
          defaultContent: ''
        },
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
    
    memberDataTableApi.on('draw',function(e){
      zy.log('draw',e);
      // $('[data-toggle="popover"]').popover()
    });
    // 合并初始化参数选项
    // $.extend(options, zy.ui.dataTable);
  }
  
  function Paginator_Init(page){
    $.jqPaginator('#msg_log_pagination', {
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
        $('#msg_log_pagination').jqPaginator('option', {
          totalCounts: result.count,
          pageSize: zy.g.page.pagesize,
          currentPage: pageNum
        });
      }else{
        pageNum = 1;
        $('#msg_log_pagination').jqPaginator('destroy');
      }
    });
    
      // 查询数据
    function query(cb){
      // zy.log('query:',searchForm);
      var formData = searchForm.form2json();
      var params = {
        tenantId: tenantId || '',
        year: formData.year || new Date().getFullYear(),
        startTime: new Date(formData.dt_from+' '+formData.time_from).toISOString(),
        endTime: new Date(formData.dt_to+' '+formData.time_to).toISOString(),
        state: formData.state,
        pageSize: zy.g.page.pagesize,
        pageNum: pageNum
      }
      
      zy.g.am.app = 'f1b4adf82ee54a1c8e18d31349988a4b';
      zy.g.am.mod = 'message';
      zy.net.get("api/getMsgList", function(msg){
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
    searchForm.find('[name=dt_from]').datepicker('setDate',dateObj || Date());
    //结束日期
    searchForm.find('[name=dt_to]').datepicker({
      language:'zh-CN',
      format:'yyyy-mm-dd'
    });
    searchForm.find('[name=dt_to]').datepicker('setDate',dateObj || Date());
    //开始时间
    searchForm.find('[name=time_from]').timepicker({
      'showMeridian':false,
      'showSeconds':true,
      'defaultTime':'00:00:00',
      'minuteStep':5,
      'secondStep':5
    });
    //结束时间
    searchForm.find('[name=time_to]').timepicker({
      'showMeridian':false,
      'showSeconds':true,
      'defaultTime':'23:59:59',
      'minuteStep':5,
      'secondStep':5
    });
    
    // 年份select初始化
    get_years_data(function(data){
      searchForm.find('[name=year]').zySelectCustomData('',false,{
        width:'100%'
      },data);  
      searchForm.find('[name=year]').select2('val',data[data.length-1].id);
    });
    
    // state初始化
    searchForm.find('[name=state]').zySelectCustomData('',true,{
        width:'100%'
      },stateArr); 
    searchForm.find('[name=state]').select2('val','');

    //查询Form
    searchForm.validate({
      // Rules for form validation
      rules: {
        year:{
          required: true
        },
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
  
  // 获取年份数据
  function get_years_data(cb){
    
    zy.g.am.app = "f1b4adf82ee54a1c8e18d31349988a4b";
    zy.g.am.mod = "message";
    zy.net.get('api/getMsgYears',function(msg){
      if(msg){
        var data = [];
        msg.result.forEach(function(year){
          data.push({
            id: year,
            name: year
          });
        });
        cb && cb(data);
      }
    });
  }
}