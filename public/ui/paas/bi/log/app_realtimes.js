 /**
 * app_realtimes
 * @class MdmDatadictH1
 */
Apprealtimes = (function () {
  var PT = Apprealtimes.prototype;
  var thiz;
  var conditions;
 		var realtime1;
    var realtime2;
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
   * @class Apprealtimes
   * @constructor
   */
  function Apprealtimes() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
      
    $('#app_realtemes_jsw').find('.widget-body').css('min-height','0');
    //thiz.SetChart(option);
    refreshDate();
    var realtime3=setInterval(refreshDate, 30000);
        refrespapa();
        refreschart();
        thiz.Select();
    thiz.Toolbar();
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }
function refrespapa(){
    var cb=function(msg){
          if(msg.result){
            $("#login_register").html(msg.result[0].login_num);
            $("#register_fail").html(msg.result[0].login_fale_num);
            $("#unaccredit").html(msg.result[0].unaccredit_num);
          }
      };
         zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/real_login_all", cb, []);
}
function refreschart(){
  var cb=function(msg){
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
          data:['登录&注册','登录&注册失败','未授权请求']
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              data : ['00:00','01:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
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
     series : [
          {
              name:'登录&注册',
              type:'line',
              data:msg.result[0].login_num
          },
          {
              name:'登录&注册失败',
              type:'line',
              data:msg.result[0].login_fale_num
          },
          {
              name:'未授权请求',
              type:'line',
              data:msg.result[0].unaccredit_num
          },
      ],
    };
    thiz.SetChart(option);
  };
         zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/realtime_chart", cb, []);
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
        thiz.SaveStatus($(e.target).parents("form"));
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(true);
        $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#EWATERBI_pdmr_prodcplan_edit').btnDisable(false);
        $('#EWATERBI_pdmr_prodcplan_tab').btnDisable(false);
      }
    });
      $('#start_interval').click(function() {
     		$this = $(this);
  		if($this.prop('checked')){
  
      realtime1=setInterval(refrespapa, 30000);
   
      realtime2=setInterval(refreschart, 30000);
  		} else {
  	clearInterval(realtime1);
  	clearInterval(realtime2);
  		}
      });
    
    
  };
  
  PT.Select = function () {
    // 数据字典处理
    //var cb = function () {
      // 字典数据绑定
      // $("#input[name=status]").zySelect('3', false, {
      //   width: '100%'
      // });
    //};
    // 预处理该画面所需的字典类型，以 , 号分割
    //zy.cache.initDicts('3', cb);
  };
  
  PT.SetChart = function (option) {
    var chart = 'updating-chart';
    var myChart = echarts.init($('#'+chart).get(0));
    $('#'+chart).unbind('resize').resize(function () {
      myChart.resize();
    });
    myChart.setOption(option);
    showTable();
  }
  
  function refreshDate () {
    $('#app_realtemes_jsw').find('.real_times').html(zy.tool.Date.getTime());
  }
  //显示datatable
  function showTable () {
    var cb=function(msg){
    var o = {};
    o.columns = [
      {title:'时间',data:'logdt'},
      {title:'登录&注册',data:'login_num'},
      {title:'登录&注册失败',data:'login_fale_num'},
      {title:'未授权请求',data:'unaccredit_num'},
    ];
    o.data = msg.result;
    BuildGrid($('#app_realtemes_table'),o);
    $('button[index=closeTable]').hide();
    }
        zy.g.am.app = 'cfb82858dc0a4598834d356c661a678f';
          zy.g.am.mod = 'log_analy';
          zy.net.post("api/realtime_datatable", cb, []);
  }
  
  return Apprealtimes;
})();