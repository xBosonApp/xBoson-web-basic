(function () {
  var tools = {
    label: function (str) {
      var t = '<' + str + '></' + str + '>';
      return $(t);
    }
  }
  var emptyTable = tools.label('table').attr({
    name: 'table',
    class: 'table table-bordered table-striped'
  });
  var chartoption={
        calculable: false, //拖拽开关
        tooltip: {
          show: true
        },
        toolbox: {
          show: true,
          feature: {
            restore: {show: true},
            saveAsImage: {show: true},
            backtoparent: {
            show:false,
            title:'回退',
            icon:'bi/image/back.png',
            onclick: function(){
              DrillUp();
            }
          }
          }
        },
        xAxis: [
          {
            name:'',
            type: 'category',
            data: [],
          }
        ],
        yAxis: [
          {
            name:'数量',
            type: 'value'
          }
        ],
        series: []
      };
  var DrillUPcontainer;

  function Init() {
    $('[name=dt]').html(getDates(0));
    $('[name=dt]').val(getDates(0));
    initInner($('[name=orginal_1]'), {'dt':getDates(0)});
    // initChart($('[name=orginal_1]'), {'dt': getDates(0)});
    getInstanceid();
    new_datepicker($('.form_yes').find('[index=dt_from]'), 4);
    new_datepicker($('.form_now').find('[index=dt_from]'), 4);
    var yes = getDates(-7);
    $('.form_yes').find('[index=dt_from]').datepicker('setDate', yes)
    $('[name=dt_from]').val(yes);
    $('[name=dt_to]').val(getDates(0));
    
    bindChange();
  }
  
  function bindChange(){
    $('.form_yes').find('[index=dt_from]').bind('change',function(){
      var $this=$(this);
      var form=$this.closest('form').siblings('form');
      form.find('[name=dt_from]').val($this.val());
    });
    $('.form_now').find('[index=dt_from]').bind('change',function(){
      var $this=$(this);
      var form=$this.closest('form').siblings('form');
      form.find('[name=dt_to]').val($this.val());
    });
    $('[name=instanceid]').bind('change',function(){
      var $this=$(this);
      var form=$this.closest('form').siblings('form');
      form.find('[name=instanceid]').val($this.val());
    });
    $('[name=serviceid]').bind('change',function(){
      var $this=$(this);
      var form=$this.closest('form').siblings('form');
      form.find('[name=serviceid]').val($this.val());
    });
  }
  
  function initInner(container, param,flg) {
    var match = {
      'orginal_1': {
        api: 'node',
        columns: [{
          "title": '节点',
          "render": function (data, type, row, meta) {
            return '<a href="javascript:void(0);" _instancenm="' + row.instancenm +'" _value="' + row.instanceid + '">' + row.instancenm + '</a>'
          }

        }, {
          "title": '服务数量',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.serv_cnt+'</div>'
          }
          
        }, {
          "title": '调用次数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.req_cnt+'</div>'
          }
          
        }, {
          "title": '成功数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.successed_cnt+'</div>'
          }
        }, {
          "title": '失败数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.failed_cnt+'</div>'
          }
        }]
      },
      'his_1': {
        api: 'node',
        columns: [{
          'title': '日期',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.dt+'</div>'
          }
        }, {
          "title": '节点',
          "render": function (data, type, row, meta) {
            return '<a href="javascript:void(0);" _instancenm="' + row.instancenm +'" _value="' + row.instanceid + '">' + row.instancenm + '</a>'
          }

        }, {
          "title": '服务数量',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.serv_cnt+'</div>'
          }
        }, {
          "title": '调用次数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.req_cnt+'</div>'
          }
        }, {
          "title": '成功数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.successed_cnt+'</div>'
          }
        }, {
          "title": '失败数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.failed_cnt+'</div>'
          }
        }]
      },
      'orginal_2': {
        api: 'service',
        columns: [{
          "title": '服务',
          "data": 'servicenm'

        }, {
          "title": '调用次数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.req_cnt+'</div>'
          }
        }, {
          "title": '成功数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.successed_cnt+'</div>'
          }
        }, {
          "title": '失败数',
          "render": function (data, type, row, meta) {
            return '<a href="javascript:void(0);" style="text-align:right" _servicenm="' + row.servicenm +'" _index="failuredata" _failure="' + row.failed_cnt + '" _value="' + row.serviceid + '">' + '<div style="text-align:right">'+row.failed_cnt+'</div>' + '</a>'
          }
        }]
      },
      'his_2': {
        api: 'service',
        columns: [{
          'title': '日期',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.dt+'</div>'
          }
        }, {
          "title": '服务',
          "data": 'servicenm'

        }, {
          "title": '调用次数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.req_cnt+'</div>'
          }
        }, {
          "title": '成功数',
          "render": function (data, type, row, meta) {
            return '<div style="text-align:right">'+row.successed_cnt+'</div>'
          }
        }, {
          "title": '失败数',
          "render": function (data, type, row, meta) {
            return '<a href="javascript:void(0);" _servicenm="' + row.servicenm +'" _index="failuredata" _failure="' + row.failed_cnt + '" _value="' + row.serviceid + '">' + '<div style="text-align:right">'+row.failed_cnt+'</div>' + '</a>'
          }
        }]
      },
      'failure': {
        api: 'faildetail',
        columns: [{
          'title': '时间',
          "render": function (data, type, row, meta) {
            return row.log_date_char + ' ' + log_time_char
          }
        }, {
          "title": '执行ID',
          "data": 'runningid'

        }, {
          "title": '消息',
          "data": "log"
        }]
      }
    }
    var api = match[container.attr('name')].api;
    var columns = match[container.attr('name')].columns;
   
    function clean() {
      var target = container.find('.dataTables_wrapper');
      target.empty();
      target.append(emptyTable.clone());
    }
    
     var pagenation = container.find('.dataTables_wrapper').next();
    if(pagenation.length == 0 ){
      container.find('.dataTables_wrapper').after($('<div></div>'));
      pagenation = container.find('.dataTables_wrapper').next();
    }
    function Pagination(page) {
      $.jqPaginator(pagenation, {
        totalCounts: 1,
        pageSize: zy.g.page.pagesize,
        currentPage: page,
        onPageChange: function (num) {
          SetDt(num);
        }
      });
    };

    function SetDt(page) {
      var cb = function (msg) {
        if (msg) {
             clean();
            container.find('.widget-body-toolbar').attr('style','');
            container.find('[name=table]').attr('_index', container.attr('name'))
            initTable(container.find('[name=table]'), msg.data, columns);
            abnormal(container,container.find('[name=table]'),msg.data,columns);
            
            if(msg.chart_type) initChart(container, msg,flg);
            
          if (msg.data.length > 0) {
            pagenation.jqPaginator('option', {
              totalCounts: msg.count,
              pageSize: zy.g.page.pagesize,
              currentPage: page
            });
          } else {
            pagenation.jqPaginator('destroy');
          }
        }
      };
      zy.g.am.app = 'bf1d70edb9d6463d968a175ce7a6fd3a';
      zy.g.am.mod = 'esb_statistics';
      zy.net.get('api/' + api, cb, param, page);
    };
    Pagination(1);
    
    History();
    search(container.find('[name=search]'));
  }

  function abnormal(con,dt,data,columns){
    var abmormaldata=Abmormaldata(data);
    con.find('[name=abnormal]').unbind().bind('click',function(){
      console.log(abmormaldata)
      if(con.find('[name=abnormal]:checked').length>0) initTable(dt,abmormaldata,columns)
      
      else initTable(dt,data,columns)
    })
  }
  
  function Abmormaldata(arr){
    var data=[];
    $.each(arr,function(i,v){
      if(v.failedcnt>0)
      data.push(v);
    })
    console.log(data);
    return data
  }

  function initTable(dt, data, columns) {
    var columns = columns
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    Toolbar(dt);
    // format(dt);
    return dt;
  }
  
  // function format(dt){
  //   dt.each( function (ii,tr) {
  //         $.each($(tr).children(),function(iii,td){
  //           console.log(td);
  //           $(td).attr('style','text-align:right')
  //         })
  //       });
  // }
  
  function initChart(container,msg,flg){
    var match = {
      'orginal_1': {
        api: 'chart_node',
        name:'节点名称'
      },
      'his_1': {
        api: 'chart_node',
        name:'日期',
        drilldownname:'节点名称'
      },
      'orginal_2': {
        api: 'chart_service',
        name:'服务名称'
      },
      'his_2': {
        api: 'chart_service',
        name:'日期',
        drilldownname:'服务名称'
      }
    }
    if(flg){
      var name=match[container.attr('name')].drilldownname;
    }else{
      var name= match[container.attr('name')].name;
    }
     var mychart=echarts.init(container.find('#chart').get(0));

       Chart(container,mychart,msg,name);
       container.find('[name=f]').html(msg.chart_count.f);
       container.find('[name=s]').html(msg.chart_count.s);
       container.find('[name=p]').html(msg.chart_count.p);
  }
  
  function isDate(dateString){
    if(dateString.length>0 && dateString.trim()=="")return true;
    var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
    if(r==null){
    return false;
    }
    var d=new Date(r[1],r[3]-1,r[4]);   
    var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    if(num==0){
    }
    return (num!=0);
 } 
  
  function Chart(con,mychart,msg,xname){
    function getx() {
      var type = msg.chart_type[0], result;
      // 第一列是x轴
      if (type && !type.chart) {
        var en = type.en;
        result = typetodata(en);
      }

      return result || [];
    };
    
    function typetodata(en) {
      var data = msg.chart_data;
      var result = [];
      $.each(data,function (_index,col) {
        var target = col[en] || '';
        result.push(target);
      });
      return result;
    };
    
    function getserise(){
      var type = msg.chart_type, result;
      var serise=[];
      $.each(type,function(i,inner){
        var seriseery=common(inner)
        if(inner.chart){
          seriseery.data=typetodata(inner.en);
          serise.push(seriseery);
        }
      })
     
      return serise
  };
    
    function common(inner) {
      var o;
      o = {
        name: inner.cn,
        en: inner.en,
        cn: inner.cn,
        type: inner.chart,
        stack:inner.stack,
        data: []
      };

      return o;
    };

    makechart(con,mychart,getx(),getserise(),xname)
  }
  //生成图表
  function makechart(con,myChart,data, series,xname) {
      myChart.clear();
      chartoption.xAxis[0].name=xname;
      chartoption.xAxis[0].data=data;
      chartoption.series=series;
      myChart.setOption(chartoption);
      
      myChart.on(echarts.config.EVENT.CLICK, function(i,v){
        
        if(isDate(i.name)){
          DrillDown(i,con)
          
          DrillUPcontainer=con;
          console.log(chartoption);
        }
         
      });
      con.unbind('resize').resize(function () {
        myChart.resize();
      });
    } 

  function Toolbar(dt) {
    dt.off().on('click', 'tr', function (e) {
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
      }
    });

    dt.find('a').unbind().bind('click', function () {
      var $this = $(this);
      if ($this.attr('_index')) failure($this, dt);
      else Changepage($this, dt)

    })
  }
  
  function Changepage($a, dt) {

    var _index = dt.attr('_index');
    var match = {
      'orginal_1': {
        con: 'orginal_2',
        excon: 'orginal_1',
        partner: 'his_1',
        param: {
          'dt': getDates(0),
          'instanceid': $a.attr('_value')
        }
      }, 'his_1': {
        con: 'his_2',
        excon: 'his_1',
        partner: 'orginal_1',
        param: {
          'dt_from': $('[name=dt_from]:visible').val(),
          'dt_to': $('[name=dt_to]:visible').val(),
          'instanceid': $a.attr('_value')
        }
      }
    }
    var con = match[_index].con;
    var excon = match[_index].excon;
    var partner = match[_index].partner;
    var param = match[_index].param;
    $('[name=' + excon + ']').attr('style', 'display:none');
    $('[name=' + partner + ']').attr('style', 'display:none');
    $('[name=' + con + ']').attr('style', '');
    $('[name=failure]').attr('style', 'display:none');
    $('[_index=instancenm]').html($a.attr('_instancenm'));
    $('[_index=instanceid]').val($a.attr('_value'));
    if(_index=='his_1'){
       $('[name=' + con + ']').find('[name=dt_from]:visible').datepicker('setDate', $('[name=' + excon + ']').find('[name=dt_from]').val());

      $('[name=' + con + ']').find('[name=dt_to]:visible').datepicker('setDate', $('[name=' + excon + ']').find('[name=dt_to]').val())
    
      sigelhistory($('[name=' + con + ']'),$('[name=' + excon + ']'));
    }
    chartoption.toolbox.feature.backtoparent.show = false;
    initInner($('[name=' + con + ']'), param);
    // initChart($('[name=' + con + ']'), param);
    getServiceid(param);
    goback();
  }
  
  function sigelhistory(con,excon){
    var div=tools.label('div').attr({
    class: 'col-md-1'
  });
    var button=tools.label('button').attr('class','btn btn-info btn-sm').html('返 回');
    div.append(button);
    con.find('[name=sigelhis]').append(div);
    button.unbind().bind('click',function(){
      con.attr('style','display:none');
      excon.attr('style','');
      excon.siblings('div').attr('style','');
      $('[name=failure]').attr('style', 'display:none');
      var form=excon.find('form')[1];
      initInner(excon,$(form).serialize());
      // initChart(excon,$(form).serialize());
      div.remove();
    });
  }

  function failure($a, dt) {
    var _index = dt.attr('_index');
    var match = {
      'orginal_2': {
        param: {
          'dt': getDates(0),
          'instanceid': $('[_index=instanceid]').val(),
          'serviceid': $a.attr('_value')
        }
      }, 'his_2': {
        param: {
          'dt_from': $('[name=dt_from]:visible').val(),
          'dt_to': $('[name=dt_to]:visible').val(),
          'instanceid': $('[_index=instanceid]').val(),
          'serviceid': $a.attr('_value')
        }
      }

    }
    var param = match[_index].param;
    var con = $('[name=failure]').attr('style', '');
    $('[name=servicenm]').html($a.attr('_servicenm'));
    $('[name=failed_cnt]').html($a.attr('_failure'));
    initInner(con, param);
    download(param);
  }

  function History() {
    var button = $('[name=history]:visible');
    button.unbind().bind('click', function () {
      var historycon = button.parent().siblings('[_index=his]');
      if (historycon.attr('style') != ''){ 
        historycon.attr('style', '');
        var form=historycon.find('[name=search]').closest('form').siblings('form');
        initInner(historycon,form.serialize());
        // initChart(historycon,form.serialize())
        search(historycon.find('[name=search]'));
      }
      else historycon.attr('style', 'display:none');
    })
  }
  
  function search(button){
    var form=button.closest('form').siblings('form');
    var con=form.parent();
    button.unbind().bind('click',function(){
      chartoption.toolbox.feature.backtoparent.show = false;
      if(con.find('[name=dt_from]').val()=='' || con.find('[name=dt_to]').val()==''){
        zy.ui.msg('提示','日期不可以为空','w');
      }else{
        initInner(con,form.serialize());
      }
      // initChart(con,form.serialize())
    })
    
  }
  
  function goback(){
    var button=$('[name=goback]');
     var form=button.closest('form').siblings('form');
    var con=form.parent();
    parentcon=$('[name=orginal_1]');
    button.unbind().bind('click',function(){
      parentcon.attr('style','');
      initInner(parentcon,form.serialize());
      // initChart(parentcon,form.serialize());
      con.attr('style','display:none');
    $('[name=failure]').attr('style','display:none');
    $('[name=his_2]').attr('style','display:none');
    })
    
  }
  
  function download(param){
    var button=$('[name=download]');
    button.unbind().bind('click',function(){
       zy.g.am.app = 'bf1d70edb9d6463d968a175ce7a6fd3a';
        zy.g.am.mod = 'esb_statistics';
        zy.net.postDownload('download/down_fail_data', param);
    })
  }
  
  function getInstanceid(){
    var cb = function (msg) {
      if (msg) {
        var result = msg.result;
        $('#first').find('[name=instanceid]').zySelectCustomData('', true, {
          width: '100%',
          allowClear: false
        },result)
      }

    };
    zy.g.am.app = 'bf1d70edb9d6463d968a175ce7a6fd3a';
    zy.g.am.mod = 'etl_statistics';
    zy.net.get('api/select2', cb);
  }
  
  function getServiceid(param){
    var cb = function (msg) {
      if (msg) {
        var result = msg.result;
        $('[_index=serviceid]').zySelectCustomData('', true, {
          width: '100%',
          allowClear: false
        },result)
      }

    };
    zy.g.am.app = 'bf1d70edb9d6463d968a175ce7a6fd3a';
    zy.g.am.mod = 'esb_statistics';
    zy.net.get('api/serv_select2', cb,param);
  }
  
    //钻取
  function DrillDown(inner,con){
    _match={
      'his_1':{
        'exit':true,
        'param':{
          'dt':inner.name,
          'instanceid':con.find('[name=instanceid]').val()
        }
      },
      'his_2':{
        'exit':true,
        'param':{
          'dt':inner.name,
          'instanceid':con.find('[name=instanceid]').val(),
          'serviceid':con.find('[name=serviceid]').val()
        }
      }
    }
    chartoption.toolbox.feature.backtoparent.show = true;
   if(_match[con.attr('name')].exit) initInner(con,_match[con.attr('name')].param,true)
  // chartoption.toolbox.feature.backtoparent.show = true;

  }
  //回退
  function DrillUp(){
    console.log(DrillUPcontainer)
    var form=$(DrillUPcontainer.find('form')[1])
    var param=form.serialize();
    chartoption.toolbox.feature.backtoparent.show = false;
    initInner(DrillUPcontainer,param);
    
  }

  Init()
})()