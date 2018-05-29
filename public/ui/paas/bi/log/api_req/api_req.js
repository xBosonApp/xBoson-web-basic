 /**
 * API 请求日志
 * @class LogApiReq
 */
LogApiReq = (function() {

  var PT = LogApiReq.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //widget
  var widgetDiv = $('#log_api_req_wid');
  //searchForm
  var searchForm = $('#log_api_req_search_form');
  //表格元素对象
  var dt = $('#log_api_req_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class AuthRoleH8
   * @constructor
   */
  function LogApiReq() {
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
  };
  /*窗口改变时，重新调整画面大小*/
  // function DynamicWidth() {
  //   $('.dataTables_scrollHeadInner').css('width', '100%');
  //   $('.dataTables_scrollBody table').css('width', '100%');
  //   $('.dataTables_scrollHeadInner table').css('width', '100%');
  // }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "log_time"
      },
      {
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('ZR.0021', row.log_level);
        }
      },
      {
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('ZR.0024', row.log_error_type);
        }
      },
      {
        "data": "log"
      },
      {
        "data": "requestid"
      },
      {
        "data": "userid"
      },
      {
        "data": "sysnm"
      },
      {
        "data": "orgnm"
      },
      {
        "data": "remote_ip"
      },
      {
        "data": "elapsed"
      },
      {
        "data": "user_referer"
      },
      {
        "data": "user_key"
      },
      {
        "data": "user_agent"
      },
      {
        "data": "cookie"
      }
    ];
    //预设初始化参数
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    // DynamicWidth();
  };
  
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
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
    //APP select2
    searchForm.find('[name=appid]').change(function(){
      if(!$(this).val()){
        searchForm.find('[name=modid]').zySelectCustomData('',false,{
          width:'100%'
        },[]);
        searchForm.find('[name=modid]').val('');
        return false;
      }
      //为MOD select2初始化数据源
      zy.g.am.app = "cfb82858dc0a4598834d356c661a678f";
      zy.g.am.mod = "log_request";
      zy.net.get('api/mod_select',function(msg){
        if(msg){
          searchForm.find('[name=modid]').zySelectCustomData('',false,{
            width:'100%'
          },msg.result);  
        }
      },{appid:$(this).val()});
    });
    //MOD select2
    searchForm.find('[name=modid]').change(function(){
      if(!$(this).val()){
        searchForm.find('[name=apiid]').zySelectCustomData('',false,{
          width:'100%'
        },[]);
        searchForm.find('[name=apiid]').val('');
        return false;
      }
      //为API select2初始化数据源
      zy.g.am.app = "cfb82858dc0a4598834d356c661a678f";
      zy.g.am.mod = "log_request";
      zy.net.get('api/api_select',function(msg){
        if(msg){
          searchForm.find('[name=apiid]').zySelectCustomData('',false,{
            width:'100%'
          },msg.result);  
        }
      },{appid:searchForm.find('[name=appid]').val(),modid:$(this).val()});
    });
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
        elapsed: {
          digits: true,
          min: 0,
          max: 10000000
        }
      },
      // 验证成功后保存
      submitHandler: function (form) {
        $('#log_api_req_search').button('loading');
        thiz.Pagination(1);
      },
      // Do not change code below
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
    });
  };
  
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    zy.log('Pagination page = ' + page);
    $.jqPaginator('#log_api_req_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        zy.log('onPageChange num = ' + num);
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
      $('#log_api_req_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        widgetDiv.find('[name=total_count]').text('总数：'+msg.count);
        thiz.DataTable(msg.result);
        if (msg.count > 0) {
          $('#log_api_req_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#log_api_req_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = "cfb82858dc0a4598834d356c661a678f";
    zy.g.am.mod = "log_request";
    zy.net.get("api/query", cb, $('#log_api_req_search_form').serialize(), page);
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
  PT.SetRow = function(msg) {};
  
  PT.Select = function() {
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0021,ZR.0024',function(){
      // searchForm.find('[name=log_level]').zySelect('ZR.0021',false,{width:'100%'});
      // searchForm.find('[name=log_error_type]').zySelect('ZR.0024',false,{width:'100%'});
    });
    // 预处理APP select2
    zy.g.am.app = "cfb82858dc0a4598834d356c661a678f";
    zy.g.am.mod = "log_request";
    zy.net.get('api/app_select',function(msg){
      if(msg){
        searchForm.find('[name=appid]').zySelectCustomData('',false,{
          width:'100%'
        },msg.result);  
      }
    });
  };
  
  return LogApiReq;
})();
