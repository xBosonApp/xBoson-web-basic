  /**
 * app_realtimes
 * @class MdmDatadictH1
 */
liveNess = (function () {
  var PT = liveNess.prototype;
  var thiz;
  var conditions;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */

  //表格元素对象
  var dt = $('#chart_table');  
  
  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class liveNess
   * @constructor
   */
  function liveNess() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    Date.prototype.format = function(format){ 
    var o = { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(), //day 
    "h+" : this.getHours(), //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
    "S" : this.getMilliseconds() //millisecond 
    } 

if(/(y+)/.test(format)) { 
format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
} 

for(var k in o) { 
if(new RegExp("("+ k +")").test(format)) { 
format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
} 
} 
return format; 
}
        var cb=function(msg){
          if(msg.result){
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
      xAxis : [
          {
              type : 'category',
              data : msg.result[0].x_data
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}'
              }
          },
          {
              type : 'value',
              name : '百分比',
              axisLabel : {
                  formatter: '{value} %'
              }
          }
      ],
      series :  [
          {
              name:'',
              type:'line',
              data:msg.result[0].data
          }
      ]
    };  
    thiz.SetChart(option,$('#form_liveness').find('input[index=dt_to]').val(),$('#form_liveness').find('input[index=dt_from]').val(),$('#form_liveness').find('input[name=liveness_dept]').val());
     
        }
      };
      var myDate = new Date(); 
      var mytime=myDate.format("yyyy-MM-dd");
       var param={dt_from:mytime,dt_to:mytime,orgid:$('#form_liveness').find('input[name=liveness_dept]').val()};
         zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/data_view", cb, param);
    thiz.Select();
    thiz.Toolbar();
    $('#liveness_datapicker').hide();
    refreshDate();
    setInterval(refreshDate, 1000);
    //昨日关键数据绑定
    var cb=function(msg){
      if(msg.result){
      $('#daylive').html(msg.result[0].day);
      $('#weeklive').html(msg.result[0].week);
      $('#monthlive').html(msg.result[0].month);
      $('#DMlive').html(msg.result[0].day_month);
      $('#dayChainlive').html(msg.result[0].dayChain+"%");
      $('#weekChainlive').html(msg.result[0].weekChain+"%");
      $('#monthChainlive').html(msg.result[0].monthChain+"%");
      $('#DMChainlive').html(msg.result[0].day_month_Chain+"%");
      if(msg.result[0].dayChain<0){
        $('#day-icon').attr("class","fa  fa-arrow-down icon-color-good");
      }
        if(msg.result[0].weekChain<0){
        $('#week-icon').attr("class","fa  fa-arrow-down icon-color-good");
      }
        if(msg.result[0].monthChain<0){
        $('#month-icon').attr("class","fa  fa-arrow-down icon-color-good");
      }
        if(msg.result[0].day_month_Chain<0){
        $('#DM-icon').attr("class","fa  fa-arrow-down icon-color-good");
      }
    }
    };
        zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/data_statistics", cb, []);
    var callback=function(msg){
      if(msg.result){
      if(msg.result[0].adminflag==1&&zy.g.comm.org=="a297dfacd7a84eab9656675f61750078"){
        $('#nidaye').attr('hidden','false');
        $('#nidaye1').attr('hidden','false');
      }
    }
    };
          zy.g.am.app = 'ZYAPP_LOGIN';
          zy.g.am.mod = 'ZYMODULE_LOGIN';
          zy.net.post("api/usertype", callback, []);
    
    
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
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
      }
    });
    new_datepicker($('#form_liveness').find('[index=dt_from]'),4);
    new_datepicker($('#form_liveness').find('[index=dt_to]'),4);
      $('#time_interval').click(function() {
  		$this = $(this);
  		if($this.prop('checked')){
  		  $('#liveness_datapicker').show();
  			$('#liveness_customdt').hide();
  		} else {
  			$('#liveness_datapicker').hide();
  			$('#liveness_customdt').show();
  		}
  	});	
    $('#liveness_submit').click(function(){
       var cb=function(msg){
         if(msg.result){
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
      xAxis : [
          {
              type : 'category',
              data : msg.result[0].x_data
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}'
              }
          },
          {
              type : 'value',
              name : '百分比',
              axisLabel : {
                  formatter: '{value} %'
              }
          }
      ],
      series :  [
          {
              name:'',
              type:'line',
              data:msg.result[0].data
          }
      ]
    };  
    thiz.SetChart(option,$('#form_liveness').find('input[index=dt_to]').val(),$('#form_liveness').find('input[index=dt_from]').val(),$('#form_liveness').find('input[name=liveness_dept]').val());
      
       }
       };
      
       var param={dt_from:$('#form_liveness').find('input[index=dt_from]').val(),dt_to:$('#form_liveness').find('input[index=dt_to]').val(),orgid:$('#form_liveness').find('input[name=liveness_dept]').val()}
         zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/data_view", cb, param);
      
      
    });
    $('#liveness_customdt').find('a').on('click',function(){
      var dt_to = zy.tool.Date.getDate();
      var num =$(this).attr('data-tag')*1;
      var dt_from = getDates(num);
      var cb=function(msg){
        if(msg.result){
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
      xAxis : [
          {
              type : 'category',
              data : msg.result[0].x_data
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel : {
                  formatter: '{value}'
              }
          },
          {
              type : 'value',
              name : '百分比',
              axisLabel : {
                  formatter: '{value} %'
              }
          }
      ],
      series :  [
          {
              name:'',
              type:'line',
              data:msg.result[0].data
          }
      ]
    };  
    thiz.SetChart(option,dt_to,dt_from,$('#form_liveness').find('input[name=liveness_dept1]').val());
      }
        
      };
      var param={dt_from:dt_from,dt_to:dt_to,orgid:$('#form_liveness').find('input[name=liveness_dept1]').val()}
         zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/data_view", cb, param);
      
    });
  };
  
  PT.Select = function () {
    var cb = function (msg) {
      //字典数据绑定
      $('#form_liveness').find('input[name=liveness_dept]').zySelectCustomData('', false, {
        width: '100%'
      },msg.data);
        $('#form_liveness').find('input[name=liveness_dept1]').zySelectCustomData('', false, {
        width: '100%'
      },msg.data);
    };
    //预处理该画面所需的字典
    zy.g.am.app='c770045becc04c7583f626faacd3b456';
    zy.g.am.mod='commapi';
    zy.net.get('api/exc_select', cb ,{modolcd:'ORG'});
  };
    
  function refreshDate(){
    $('#liveness_jsw').find('.real_times').html(zy.tool.Date.getTime());
  }
  
  PT.SetChart = function (option,dt_to,dt_from,orgid) {
    var chart = 'updating-chart';
    var myChart = echarts.init($('#'+chart).get(0));
    $('#'+chart).unbind('resize').resize(function () {
      myChart.resize();
    });
    myChart.setOption(option);
    showTable(dt_to,dt_from,orgid);
  }
  
  //显示datatable
  function showTable(dt_to,dt_from,orgid){
    var cb=function(msg){
    var o = {};
    o.columns = [
      {title:'时间',data:'logdt'},
      {title:'日活跃账号数',data:'active_num'},
      {title:'活跃数据时间段',data:'active_times'}
    ];
    o.data = msg.result;
    BuildGrid($('#liveness_table'),o);
    $('button[index=closeTable]').hide();
    }
    var param={dt_to:dt_to,dt_from:dt_from,orgid:orgid};
      zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/datable_show", cb, param);
  }
  
  return liveNess;
})();