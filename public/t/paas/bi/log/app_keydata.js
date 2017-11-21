  /**
 * app_realtimes
 * @class MdmDatadictH1
 */
Appkeydata = (function () {
  
  var PT = Appkeydata.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    x_data : [],
    legend_data : [],
    series : {},
    tabledata :[],
    keydata_infos : {},
    dt_from : getDates(-1),//yesterday
    dt_to : getDates(-1),//now
    kpitype : 'user',
    pt_admin : false,
  };

  //表格元素对象
  var dt = $('#chart_table');  
  
  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class Appkeydata
   * @constructor
   */
  function Appkeydata() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    $('#app_keydata_datapicker').hide();
    thiz.Select();
    thiz.Toolbar();
    showadminTool();
    //thiz.SetChart(option);
    getKeyDataTitle();
    thiz.GetChartData();
  };
  
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }
  
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function () {
    // 单击事件
    dt.on('click', 'tr', function (e) {
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents('form'));
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
      }
    });
    
    new_datepicker($('#form_app_keydata').find('[index=dt_from]'),4);
    new_datepicker($('#form_app_keydata').find('[index=dt_to]'),4);
    $('#form_app_keydata').find('[index=dt_from]').val(getDates(0));
    $('#form_app_keydata').find('[index=dt_to]').val(getDates(1));
    
    $('#time_interval').click(function() {
      $this = $(this);
      if($this.prop('checked')){
        $('#app_keydata_datapicker').show();
        $('#app_keydata_customdt').hide();
      } else {
        $('#app_keydata_datapicker').hide();
        $('#app_keydata_customdt').show();
      }
    });	
    
    $('#app_keydata_customdt').find('a').on('click',function(){
      $('#app_keydata_customdt').find('a').removeClass('active');
      $(this).addClass('active');
    });
    
    $('#keydata_kpi').find('a').on('click',function(){
      $('#keydata_kpi').find('a').removeClass('active');
      $(this).addClass('active');
      thiz._g.kpitype = $(this).attr('data-tag');
      thiz.SetChart();
    });
    
    $('#form_app_keydata').find('._search').on('click',function(){
      thiz.GetChartData();
    });
  };
  
  /**
   * 查询选项初始化
   * @method Select
   */
  PT.Select = function () {
    //数据字典处理
    var cb = function (msg) {
      //字典数据绑定
      $('#form_app_keydata').find('input[name=app_keydata_dept]').zySelectCustomData('', false, {
        width: '100%'
      },msg.data);
    };
    //预处理该画面所需的字典
    zy.g.am.app='c770045becc04c7583f626faacd3b456';
    zy.g.am.mod='commapi';
    zy.net.get('api/exc_select', cb ,{modolcd:'ORG'});
  };
  
  /**
   * 取图表数据
   * @method GetChartData
   */
  PT.GetChartData = function(){
    thiz._g.kpitype = $("#keydata_kpi").find(".active").attr('data-tag');
    var cb = function(msg){
      if(msg){
        var res = msg.result;
        var apps = [];
        var mods = [];
        var apis = [];
        var users = [];
        var orgs = [];
        var tabledata =[];
        var user_nums = 0;
        var admin_nums = 0;
        var dep_nums = 0;
        var nor_nums = 0;
        var app_nums = 0;
        var app_on_nums = 0;
        var other_nums = 0;
        var mod_nums = 0;
        var api_nums = 0;
        var org_nums = 0;
        var flg = thiz._g.dt_from == thiz._g.dt_to;
        for(var r in res){
          var dt = new Date(res[r].logdt.replace(/-/g,"/").replace('.0',''));
          var logdt = flg?zy.tool.Date.dateTime2str(dt,'hh'):zy.tool.Date.dateTime2str(dt,'yyyy-MM-dd');
          var _map = {};
          
          user_nums = user_nums+res[r].user_num*1;
          admin_nums = admin_nums+res[r].admin_num*1;
          dep_nums = dep_nums+res[r].dep_num*1;
          nor_nums = nor_nums+res[r].nor_num*1;
          
          app_nums = app_nums+res[r].app_num*1;
          app_on_nums = app_on_nums+res[r].app_on_num*1;
          other_nums = other_nums+res[r].other_num*1;
          
          mod_nums=mod_nums+res[r].mod_num*1;
          api_nums=api_nums+res[r].api_num*1;
          
          org_nums=org_nums+res[r].org_num*1;
          
          var index = getIndex(logdt);
          apps[index] = res[r].app_num;
          mods[index] = res[r].mod_num;
          apis[index] = res[r].api_num;
          users[index] = res[r].user_num;
          orgs[index] = res[r].org_num;
          // apps.push({name:logdt,value:res[r].app_num});
          // mods.push({name:logdt,value:res[r].mod_num});
          // apis.push({name:logdt,value:res[r].api_num});
          // users.push({name:logdt,value:res[r].user_num});
          // orgs.push({name:logdt,value:res[r].org_num});
          
          _map.logdt=res[r].logdt;
          _map.app_num=res[r].app_num;
          _map.mod_num=res[r].mod_num;
          _map.api_num=res[r].api_num;
          _map.user_num=res[r].user_num;
          tabledata.push(_map);
        }
        
        thiz._g.keydata_infos = {
          user_nums : user_nums,
          admin_nums : admin_nums,
          dep_nums : dep_nums,
          nor_nums : nor_nums,
          app_nums : app_nums,
          app_on_nums : app_on_nums,
          other_nums : other_nums,
          mod_nums : mod_nums,
          api_nums : api_nums, 
          org_nums : org_nums
        };
        thiz._g.series = {
          app:{ name:'应用总数',type:'line',data:apps},
          mod:{ name:'模块总数',type:'line',data:mods},
          api:{ name:'API总数',type:'line',data:apis},
          user:{ name:'用户总数',type:'line',data:users},
          org:{ name:'机构总数',type:'line',data:orgs}
        };
        thiz._g.tabledata = tabledata;
        thiz.SetChart();
      }
    };
    if($('#time_interval').prop('checked')){
      thiz._g.dt_from = $('#form_app_keydata').find('[index=dt_from]').val();
      thiz._g.dt_to = $('#form_app_keydata').find('[index=dt_to]').val();  
    } else {
      var _from = $('#app_keydata_customdt').find('.active').attr('data-tag');
      var num = (typeof _from == 'undefined') ? -1 : _from*1;
      thiz._g.dt_from = getDates(num);
      thiz._g.dt_to = getDates(-1);
    }
    var orgid = $('#form_app_keydata').find('input[name=app_keydata_dept]').val();
    var dcount = parseInt(Math.abs(((new Date(thiz._g.dt_from.replace(/-/g,"/")))-(new Date(thiz._g.dt_to.replace(/-/g,"/"))))/86400000));
    if(dcount==0){
      thiz._g.x_data = ['00','01','02','03','04','05','06','07','08','09','10','11','12'
      ,'13','14','15','16','17','18','19','20','21','22','23'];  
    } else {
      var x_data = [];
      for(var i=dcount+1;i>0;i--){
        x_data.push(getDates(-i));
      }
      thiz._g.x_data=x_data;
    }
    
    zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
    zy.g.am.mod = 'log_analy';
    zy.net.get("api/keydata_infos",cb,{dt_from:thiz._g.dt_from,dt_to:thiz._g.dt_to,orgid:orgid,dcount:dcount});
  }  
  
 /**
   * 画图
   * @method SetChart
   */  
  PT.SetChart = function () {
    var series = thiz._g.series[thiz._g.kpitype];
    var legend_data = [series.name];
    var option = {
      tooltip : {
          trigger: 'axis',
      },
      toolbox: {
          show : true,
          feature : {
              saveAsImage : {show: true}
          }
      },
      calculable : true,
      legend: {
          x: 'center',
          y: 'bottom',
          data:legend_data
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              data : thiz._g.x_data
          }
      ],
      yAxis : [
          {
              type : 'value',
              name : '',
              axisLabel : {
                  formatter: '{value}'
              }
          }
      ],
      series : [series]
    };
    var chart = 'updating-chart';
    var myChart = echarts.init($('#'+chart).get(0));
    $('#'+chart).unbind('resize').resize(function () {
      myChart.resize();
    });
    myChart.setOption(option);
    showTable();
    showKeydatainfos();
  }
  
  //显示datatable
  function showTable () {
    var o = {};
    o.columns = [
      {title:'时间',data:'logdt'},
      {title:'用户总数',data:'user_num'},
      {title:'应用总数',data:'app_num'},
      {title:'模块总数',data:'mod_num'},
      {title:'API总数',data:'api_num'}
    ];
    o.data = thiz._g.tabledata;
    BuildGrid($('#app_keydata_table'),o);
  }
  
  //获取关键数据
  function getKeyDataTitle() {
    var cb = function (msg) {
      if(msg.result){
        var res = msg.result[0];
        $('[name=org_nums]').html(numformat(res.org_nums,2));
        $('[name=org_num]').html(numformat(res.org_num,2));
        $('[name=org_z]').html(numformat(res.org_z,2));
        $('[name=icon_org]').html(getIcon(res.org_z));
        $('[name=user_nums]').html(numformat(res.user_nums,2));
        $('[name=user_num]').html(numformat(res.user_num,2));
        $('[name=user_z]').html(numformat(res.user_z,2));
        $('[name=icon_user]').html(getIcon(res.user_z));
        $('[name=app_nums]').html(numformat(res.app_nums,2));
        $('[name=app_num]').html(numformat(res.app_num,2));
        $('[name=app_z]').html(numformat(res.app_z,2));
        $('[name=icon_app]').html(getIcon(res.app_z));
        $('[name=mod_nums]').html(numformat(res.mod_nums,2));
        $('[name=mod_num]').html(numformat(res.mod_num,2));
        $('[name=mod_z]').html(numformat(res.mod_z,2));
        $('[name=icon_mod]').html(getIcon(res.mod_z));
        $('[name=api_nums]').html(numformat(res.api_nums,2));
        $('[name=api_num]').html(numformat(res.api_num,2));
        $('[name=api_z]').html(numformat(res.api_z,2));
        $('[name=icon_api]').html(getIcon(res.api_z));
      }
    }
    zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
    zy.g.am.mod = 'log_analy';
    zy.net.get('api/keyword_view',cb,{});
  }
  
  //判断上升下降
  function getIcon(num){
    var str = '<i class="fa fa-arrow-up icon-color-bad"></i>';
    if(num===0){
      str = '<i class="fa fa-arrow-right"></i>';
    }
    if(num<0){
      str = '<i class="fa fa-arrow-down icon-color-good"></i>';
    }
    return str;
  }
  
  //四舍五入截取长度
  function numformat(num,length){
    var _tmp = "1";
    for(var i=0;i<length;i++){
      _tmp = _tmp + "0";
    }
    _tmp = _tmp * 1;
    return Math.round(num*_tmp)/_tmp;
  }
  
  //关键值详情
  function showKeydatainfos(){
      var str ="";
      var v = thiz._g.keydata_infos;
      switch(thiz._g.kpitype){
          case 'user' : str= '<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">用户总数:</label> <label class="col label">'+v.user_nums+'</label></div> <div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">管 理 员:</label><label class="col label">'+v.admin_nums+'</label></div><div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"><label class="col label">开发人员:</label><label class="col label">'+v.dep_nums+'</label></div><div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"><label class="col label" >普通用户:</label><label class="col label" >'+v.nor_nums+'</label></div>'; break;
          case "app" : str='<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">应用总数:</label> <label class="col label">'+v.app_nums+'</label></div> <div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">第 三 方:</label><label class="col label">'+v.other_nums+'</label></div> <div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">上线应用:</label><label class="col label">'+v.app_on_nums+'</label></div>';break;
          case "mod" : str='<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">模块总数:</label> <label class="col label">'+v.mod_nums+'</label></div>';break;
          case "api" : str='<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">API总数:</label> <label class="col label">'+v.api_nums+'</label></div>';break;
          case "org" : str='<div class="col-xs-6 col-sm-6 col-md-12 col-lg-12"> <label class="col label">机构总数:</label> <label class="col label">'+v.org_nums+'</label></div>';break;
        }
      $("#keydata_infos").html(str);
  }
  
  function showadminTool(){
      var callbackUser=function(msg){
            if(msg.result[0].adminflag =='1'){
              $('#kedata_org').removeClass("hidden");
              $('#app_keydata_dept').removeClass("hidden");
              $('#keydata_kpi').find('a[data-tag=org]').removeClass("hidden");
            }
        };
        zy.g.am.app = 'ZYAPP_LOGIN';
        zy.g.am.mod = 'ZYMODULE_LOGIN';
        zy.net.get("api/usertype", callbackUser);
  }
  
  function getIndex(data){
    for(var i = 0 ;i<thiz._g.x_data.length;i++){
      if(thiz._g.x_data[i]==data){
        return i; 
      }
    }
  }
  return Appkeydata;
})();