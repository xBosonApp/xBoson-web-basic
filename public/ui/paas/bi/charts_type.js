(function () {
  
    var chartlistmap = {
      bar: {
        id: 'bar',
        name: '柱形图',
        text: '柱形图bar'
      },
      line: {
        id: 'line',
        name: '线形图',
        text: '线形图line'
      },
      arealine: {
        id: 'arealine',
        name: '范围线形图',
        text: '范围线形图arealine'
      },
      pie: {
        id: 'pie',
        name: '饼形图',
        text: '饼形图pie'
      },
      stagebar: {
        id: 'stagebar',
        name: '堆叠柱形图',
        text: '堆叠柱形图stagebar'
      },
      column: {
        id: 'column',
        name: '条形图',
        text: '条形图column'
      },
      radar: {
        id: 'radar',
        name: '雷达图',
        text: '雷达图radar'
      },
      gauge: {
        id: 'gauge',
        name: '仪表盘',
        text: '仪表盘gauge'
      },
      scatter: {
        id: 'scatter',
        name: '散点/气泡图',
        text: '散点/气泡图scatter'
      }
    }

  var config = {
    line: xy,
    bar: xy,
    pie: pie,
    radar: radar,
    scatter: scatter,
    gauge: gauge,
    arealine: arealine,
    stagebar: stagebar,
    column: column
  };

  /*工具*/

  function isType(type, obj) {
    var t = type.replace(type[0], type[0].toUpperCase());
    var toString = Object.prototype.toString;
    var T = '[object ' + t + ']';
    return toString.call(obj) === T;
  }

  function extend() {
    var target, i, ii, args = [];
    target = arguments[0] || {};
    for (ii in arguments) {
      args.push(arguments[ii]);
    }
    args.forEach(function (value, index) {
      if (!index) return null;
      if (isType('Object', value)) {
        for (i in value) {
          target[i] = value[i];
        }
      }
    });
    return target;
  }

  function randomId() {
    return (new Date()).getTime() + Math.round(Math.random() * 100000);
  }

  function createDataComponent(parent_jq, option) {

    function isnul(_obj) {
      return _obj == null || _obj == '';
    }

    zy.net.loadHTML("bi/chart_time.html", parent_jq)

    var i_fr = parent_jq.find('[index=dt_from]'),
      i_to = parent_jq.find('[index=dt_to]'),
      i_ty = parent_jq.find('[index=dt_type]'),
      i_fs = parent_jq.find('[index=dt_flag_state]'),
      i_fl = parent_jq.find('[index=dt_flag]');

    // dt_type: 1、年，2、（季），3、月，4、日,
    var DT_YEA = 1,
      DT_MON = 3,
      DT_DAY = 4,
      DT_SEA = 2;

    var date_parm_key = {
      dt_from: 1,
      dt_to: 1,
      dt_type: 1,
      flg: 1,
      dt_q: 1,
      autotime: 1
    };

    i_fr.css({
      cursor: 'cell'
    });
    i_to.css({
      cursor: 'cell'
    });
    i_ty.change(function () {
      _changeDate(i_ty.val());
    }).prop('checked', true).trigger('change');

    i_fl.change(function () {
      if (!this.checked) {
        i_fs.html('时间点');
        i_to.closest('section').fadeOut();
      } else {
        i_fs.html('时间段');
        i_to.closest('section').fadeIn();
      }
    }).prop('checked', true).trigger('change');

    /** 如果日期为空，则实行默认日期　*/
    function _auto_date(_parm) {
      if (_parm.flg) {
        if ((!isnul(_parm.dt_from)) && (!isnul(_parm.dt_to)))
          return;
      } else {
        if (!isnul(_parm.dt_from))
          return;
      }

      var now = new Date();
      _parm.autotime = true;

      function _fdate(y, m, d) {
        return (now.getFullYear() + y) + '-' + _2(now.getMonth() + 1 + m) + '-' + _2(now.getDate() + d);
      }

      function _2(_n) {
        return _n < 10 ? '0' + _n : _n;
      }

      if (parse_data(_parm.dt_from) < 0) {
        switch (parseInt(_parm.dt_type)) {
          case DT_DAY:
            _parm.dt_from = _fdate(0, 0, -1);
            break;
          case DT_MON:
            _parm.dt_from = _fdate(0, -1, 0);
            break;
          case DT_YEA:
            _parm.dt_from = _fdate(-1, 0, 0);
            break;
          case DT_SEA:
            break;
          //XXX季度未处理
        }
      }

      if (_parm.flg) {
        _parm.dt_to = _parm.dt_from;
      }
    } // [End] _auto_date

    function remove_x_parm(r_parm) {
      $.each(r_parm, function (k, v) {
        if (!date_parm_key[k]) {
          r_parm[k] = null;
          delete r_parm[k];
        }
      });
    }

    function _get_data_parm() {
      // flg: true 是范围, false 相同的日期
      var _parm = {
        dt_from: i_fr.val(),
        dt_to: i_to.val(),
        dt_type: parseInt(i_ty.val()),
        flg: i_fl.prop('checked'),
        dt_q: 0,
        autotime: false
      };

      _auto_date(_parm);
      if (!_parm.flg)
        _parm.dt_to = _parm.dt_from;
      return _fix_date(_completed_date(_parm));
    }

    function _set_data_parm(_r_parm) {
      i_fr.val(_r_parm.dt_from);
      i_to.val(_r_parm.dt_to);
      i_fl.prop('checked', _r_parm.flg).trigger('change');
      /* dt_from / dt_to 是年月日格式，不能直接传递给控件，
       利用　_changeDate　做格式转换 */
      (_r_parm.dt_type != DT_SEA) && _changeDate(DT_DAY);
      i_ty.val(_r_parm.dt_type);
      _changeDate(_r_parm.dt_type);
    }

    function _fix_date(_r_parm) {
      function __fix_date(date_str) {
        switch (parseInt(_r_parm.dt_type)) {
          case DT_YEA:
            date_str = date_str.replace(/-[0-9]{1,2}-/g, '-01-');
          case DT_MON:
            date_str = date_str.replace(/-[0-9]{1,2}$/g, '-01');
          case DT_DAY:
          case DT_SEA:
          //XXX季度未处理
        }
        return date_str;
      }


      _r_parm.dt_from = __fix_date(_r_parm.dt_from);
      _r_parm.dt_to = __fix_date(_r_parm.dt_to);
      return _r_parm;
    }

    /** 补全不完整的日期 */
    function _completed_date(_data_parm) {
      function _comp(_field) {
        switch (parse_data(_data_parm[_field])) {
          case DT_YEA:
            _data_parm[_field] += '-01';
          case DT_MON:
            _data_parm[_field] += '-01';
          case DT_DAY:
          case DT_SEA:
          //XXX 季度未完成
        }
      }

      _comp('dt_from');
      _comp('dt_to');
      return _data_parm;
    }

    function _season(_input) {
      var season = 0;
      var old_html, season_html = '<tr><td colspan="7">' + '<span class="season month" season="1">第一季度</span>' + '<span class="season month" season="2">第二季度</span>' + '<span class="season month" season="3">第三季度</span>' + '<span class="season month" season="4">第四季度</span>' + '</td></tr>';

      function _gpk() {
        return _input.data('datepicker').picker;
      }

      function _remove() {
        _input.off('click', set_html);
        _input.off('changeYearFillover', set_html);
        _input.off('changeDate', change_date);
        _input.off('change', _picker_event_change);
        set_html({}, old_html);
        _input.removeData('removeSeason');

        var d = _input.datepicker('getDate');
        if (d.getDay() > 0) {
          d.setMonth([0, 3, 6, 9][d.getMonth()]);
          _input.datepicker('setDate', d);
        }
      }

      function set_html(_e, _h) {
        var jq = _gpk().find(".datepicker-months tbody");
        old_html = jq.html();
        jq.html(_h || season_html);
        jq.find('.season').css({
          clear: 'both',
          width: '100%'
        });
        jq.find('[season=' + season + ']').addClass('active');
      }

      function change_date(_e) {
        var d = _e.date;
        if (d) {
          season = d.getMonth() + 1;
        }
      }

      function month_season(d, q) {
        if (!q) {
          if (d.getMonth() < 3)
            q = 1;
          else if (d.getMonth() > 8)
            q = 4;
          else if (d.getMonth() < 6)
            q = 2;
          else
            q = 3;
        }
        season = q;
        d.setMonth(q - 1);
        return d;
      }

      function _picker_event_change() {
        _input.off('change', _picker_event_change);
        var d = _input.datepicker('getDate');

        if (d.getFullYear() > 0) {
          month_season(d);
          _input.datepicker('setDate', d);
        }
      }


      _input.on('change', _picker_event_change);
      _input.on('changeDate', change_date);
      _input.on('changeYearFillover', set_html);
      _input.click(set_html);
      _input.data('removeSeason', _remove);
    }

    function _changeDate(_dtype) {
      var date_opt, func;

      (func = i_fr.data('removeSeason')) && func();
      (func = i_to.data('removeSeason')) && func();

      switch (parseInt(_dtype)) {
        case DT_YEA:
          date_opt = {
            forceParse: false,
            format: "yyyy",
            minViewMode: 2,
            startView: 1
          };
          break;
        case DT_SEA:
          date_opt = {
            format: "yyyy,m季度",
            minViewMode: 1
          };
          _season(i_fr);
          _season(i_to);
          break;
        case DT_MON:
          date_opt = {
            forceParse: false,
            format: "yyyy-mm",
            minViewMode: 1
          };
          break;
        case DT_DAY:
          date_opt = {
            format: "yyyy-mm-dd"
          };
          break;
        default:
          throw new Error("无效的数据格式:" + _dtype);
      }

      date_opt = $.extend({}, date_opt, {
        language: "zh-CN",
        autoclose: true
      });

      _set_datepicker(i_fr, date_opt);
      _set_datepicker(i_to, date_opt);
    }

    function _set_datepicker(_dt_input, _opt) {
      var od = _dt_input.datepicker('getDate');

      if (isNaN(od.getTime())) {
        od = _dt_input.val();
      }
      _dt_input.datepicker('remove');
      _dt_input.datepicker(_opt);
      _dt_input.datepicker('setDate', od);
    }

    function parse_data(_d) {
      if (/^[0-9]{4}$/g.test(_d)) {
        return 1;
      }
      if (/^[0-9]{4}-[0-9]{1,2}$/g.test(_d)) {
        return 3;
      }
      if (/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g.test(_d)) {
        return 4;
      }
      if (/^[1-4]季$/g.test(_d)) {
        return 2;
      }
      return -1;
    }

    return {
      // 日期类型
      DT_DAY: DT_DAY,
      DT_YEAR: DT_YEA,
      DT_MONTH: DT_MON,
      DT_SEASON: DT_SEA

      // 改变控件中时间的(类型)格式,               并保持原日期数据不变
      // function(int:[date type num])
      ,
      changeType: _changeDate

      // 补全日期,                例: 2014 -> 2014-01-01
      // function(object:[date_parm_key])
      ,
      completed: _completed_date

      // 依据 dt_type 的类型,                修正日期值,
      // 例: dt_type:DT_YEAR, 2014-03-05 -> 2014-01-01
      // function(object:[date_parm_key])
      ,
      fix: _fix_date

      // 设置日期到控件
      // function(object:[date_parm_key])
      ,
      set: _set_data_parm

      // 从控件取得日期,                返回的日期经过了有效性／格式检查及补全
      // function() : return object:[date_parm_key]
      ,
      get: _get_data_parm

      // 删除除日期之外的所有扩展查询条件
      // function(object:[date_parm_key])
      ,
      rmNotDate: remove_x_parm

      // 如果日期为空，则实行默认日期
      // function(object:[date_parm_key])
      ,
      fill_default: _auto_date

      // 解析日期格式,                返回格式id, 非日期返回 -1
      // function(string:'yyyy-mm-dd') : return int
      ,
      parseType: parse_data
    }
  }
  
  function GetModule(modid,param,module,cb){
    zy.extend.get({
      apinm:'mod_json_selone',
      mod:'echart',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
      var mod = msg.mods[0];
      module.set(mod);
      cb && cb(JSON.parse(mod.jsondata));
    },{modid:modid})
  }

  /*echart 类型*/
  
  /*直角坐标系*/

  function xy(inner, data, x, option) {
    var key;
    key = inner.en;
    inner.data = typetodata(key, data);
  }
  
  /*堆叠柱*/
  function stagebar(inner, data, x, option){
    xy(inner, data, x, option);
    inner.stack = 'defaultstack';
  }
  
  /*饼*/
  function pie(inner, data, x, option, inner_index) {

    var key, t, inneroption, result = [], xx, i = 0, series;
    key = inner.en;
    xx = x ? x : inner._x;
    t = typetodata(key, data);
    
    series = option.series || [];
    
    inneroption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      center: [25, 25],
      radius: [0, '20%'],
      itemStyle: {
        normal: {
          labelLine: {
            show: true
          },
          label: {
            show: true
          }
        }
      }
    };
    
    series.forEach(function(col,index){
      var otherKey = col.en;
      if(otherKey == key) return null;
      if(col.type == 'pie'){
        inneroption.center[0] += 25;
        if(inneroption.center[0] > 75){
          inneroption.center[0] -= 50;
          inneroption.center[1] = 75;
        }
      }
    })

    inneroption.center[0] += '%';
    inneroption.center[1] += '%';
    
    
    if(inner.data.length > 0){
      inner = common({
        cn:inner.cn,
        chart:inner.chart,
        en:inner.en,
        view:inner.view,
        next:inner.next
      }, data, inner._x);
      option.series[inner_index] = inner;
    }

    extend(inner, inneroption);

    if (t.length != xx.length) {
      console.log('pie初始化异常:x轴与数据不匹配!');
      inner.data = [];
    } else {
      t.forEach(function (value, i) {
        var o = {
          value: value,
          name: xx[i]
        };
        result.push(o);
      });
      inner.data = result;
    }
  }
  
  /*雷达*/

  function radar(inner, data, x, option) {

    var key, t, option, result = [];
    key = inner.en;
    t = typetodata(key, data);

    if (!option.polar) {
      option.polar = [{indicator: []}];
    }

    inner.data.push({
      value: t,
      name: inner.name
    });
  }
  
  /*散点*/
  
  function scatter(inner, data, x, option){
    var key, t, option, result = [];
    key = inner.en;
    t = typetodata(key, data);
    
    t.forEach(function(str,index){
      inner.data.push(str.split(','));
    })
    
    option.xAxis = [
        {
            type : 'value',
            scale:true
        }
    ];
    
    option.yAxis =  [
        {
            type : 'value',
            scale:true
        }
    ]
    
    /* 辅助线 */
    // inner.markPoint = {
    //   data: [
    //     {type : 'max', name: '最大值'},
    //     {type : 'min', name: '最小值'}
    //   ]
    // };
    // inner.markLine = {
    //   data: [
    //     {type : 'average', name: '平均值'}
    //   ]
    // };
    
    option.tooltip = {
        trigger: 'axis',
        showDelay : 0,
        axisPointer:{
            show: true,
            type : 'cross',
            lineStyle: {
                type : 'dashed',
                width : 1
            }
        }
    };
  }
  
  /*仪表盘*/
  
  function gauge(inner, data, x, option){
    var key, t, result = [];
    key = inner.en;
    t = typetodata(key, data);
    
    console.log(option);
    
    delete option.tooltip;
    delete option.polar;
    delete option.legend;

    inner.data[0] = {
      value: t[0],
      name: inner.name
    };
    
  }
  
  /*范围线形*/
  
  function arealine(inner, data, x, option){
    var key;
    key = inner.en;
    $.extend(true,inner,{
      smooth: true,
      itemStyle: {normal: {areaStyle: {type: 'default'}}}
    })
    inner.data = typetodata(key, data);
  }
  
  /*条形图*/
  function column(inner, data, x, option){
    
  }

  /*echart option*/

  function tooltip_co() {
    var tooltip = {
      trigger: 'axis'
    };
    return {
      tooltip: tooltip
    }
  }

  function toolbox_co(option, con, chart, old, levellist, level) {
    
    var toolbox = {
      show: true,
      feature: {
        //mark: {show: true},
        //dataView: {show: true, readOnly: false},
        chartedit: {
          show: true,
          // show: old ? false: true,
          title: '配置',
          icon : 'bi/image/edit.png',
          onclick: function () {
            zy.net.loadHTML('bi/edit_table.html', $('#modal'), function () {
              edit_table(option, chartlistmap);
            });
            return false;
          }
        },
        toradar: {
          show: true,
          title: '雷达',
          icon:'bi/image/radar-20x20.png',
          onclick: function () {
            option.changetype('radar');
            return false;
          }
        },
        toxy: {
          show: true,
          title: '直角坐标系',
          icon:'bi/image/xy.png',
          onclick: function () {
            var type = $.extend(true,[],option._oldData.type);
            type.forEach(function(inner,index){
              if(!index) return null;
              inner.type = 'line';
              inner.chart = 'line';
            });
            InitChart(con, {type:type,data:option._oldData.data}, option._oldData, levellist, level, option._module);
            return false;
          }
        },
        tocol: {
          show: true,
          title: '柱/条切换',
          icon:'bi/image/col-20x20.png',
          onclick: function(){
            var oo;
            
            oo = {
              xAxis:[],
              yAxis:[]
            }
            
            if(typeof option.xAxis[0].data != 'undefined'){
              oo.xAxis[0] = {
                type: 'value'
              };
              oo.yAxis[0] = {
                type: 'category',
                data: $.extend(true,[],option.xAxis[0].data)
              };
            }else{
              oo.xAxis[0] = {
                type: 'category',
                data: $.extend(true,[],option.yAxis[0].data)
              };
              oo.yAxis[0] = {
                type:'value',
                position: 'right'
              };
            }
            
            InitChart(con, option.toModule(), option._oldData, levellist, level, option._module, oo);
            
            return false;
          }
        },
        // 'pie', 'funnel','force','chord'
        magicType: {show: true, type: ['stack', 'tiled']},
        rollback: {
          show: true,
          title: '还原',
          icon:'bi/image/reset.png',
          onclick: function () {
            InitChart(con, option._oldData, null, levellist, level, option._module);
            return false;
          }
        },
        saveAsImage: {show: true},
        datagrid: {
          show: true,
          title: '数据表格',
          icon:'bi/image/grid.png',
          onclick: function(){
            option.toDataTable();
          }
        },
        backtoparent: {
          show:false,
          title:'回到上一个模块',
          icon:'bi/image/back.png',
          onclick: function(){
            var parent = levellist[level - 1];
            GetModule(parent.modid,parent, option._module, function(msg){
              InitChart(con, msg, null, levellist, level - 1, option._module);
            })
          }
        }
      }
    };
    
    if(levellist && levellist[level - 1]) toolbox.feature.backtoparent.show = true;

    return {
      toolbox: toolbox
    };
  }

  function calculable_co() {
    var calculable = false;
    return {
      calculable: calculable
    };
  }

  function legend_co(type) {
    var legend;
    legend = {
      y: 'bottom',
      data: []
    };

    type.forEach(function (value, index) {
      if (!index) return null;
      legend.data.push(value.cn);
    });

    return {
      legend: legend
    };
  }

  /* 图表核心方法 */
  function series_co(type, data, chart, option) {

    function specialCheck(list, option) {
      list.forEach(function (type, index) {
        if (type == 'radar' || type == 'gauge')  delete option.yAxis, delete option.xAxis, true;
      });
      if (option.yAxis || option.xAxis) delete option.polar;
    }
    
    if(!option.series) option.series = [];

    var x, charttype, inner = {}, typelist = [], cn;
    type.forEach(function (col, index) {
      if (!col.chart) {
        x = typetodata(col.en, data);
        return null;
      }
      charttype = col.chart.split(',')[0] || 'line';
      if (config[charttype]) {
        inner = common(col, data, x, chart);
        config[charttype](inner, data, x, option, index);
        typelist.push(charttype);
        option.series.push(inner);
      }
      cn = col.cn;
      if(option.legend && !option.legend.selected) option.legend.selected = {};
      if(option.legend) option.legend.selected[cn] = Boolean(Number(col.view));
    });

    specialCheck(typelist, option);
  }

  //直角坐标系专有!!!

  function xAxis_co(type, data) {
    var x, key;
    key = type[0].en;
    x = [{
      type: 'category',
      splitLine: {show: false},
      data: typetodata(key, data)
    }];
    return {
      xAxis: x
    };
  }

  function yAxis_co() {
    var yAxis = [
      {
        type: 'value',
        position: 'right'
      }
    ];
    return {
      yAxis: yAxis
    };
  }

  //雷达专有!!!
  function polar_co(type, data) {
    var polar, key, indicator = [];
    key = type[0].en;
    typetodata(key, data).forEach(function (val, index) {
      var o = {
        text: val
      };
      indicator.push(o);
    });
    polar = [{
      indicator: indicator
    }];
    return {
      polar: polar
    };
  }

  /*echart constructor*/

  function common(o, data, x, chart) {
    var inner = {}, modal;
    inner = extend({}, o);
    inner.type = o.chart.split(',')[0];
    inner.name = o.cn;
    inner.data = [];
    inner.$id = o.$id || randomId();
    inner._x = x;

    return inner;
  }

  function typetodata(en, data) {
    var result = [];
    data.forEach(function (col) {
      var target = col[en] || '';
      result.push(target);
    });
    return result;
  }

  /*echart 内部事件*/

  function Event(con, chart, option, data, type, levellist, level) {
    
    /* 钻取核心代码 */
    
    function Drill(series){
      
      if(!series.next) return false;
      
      if(!option._moduleid) return zy.extend.msg('请先保存当前模块再进行钻取操作','i');
      
      var list, modid, le;
      list = levellist ? levellist : [];
      le = level ? level : 0;
      modid = series.next;
      
      list[ le ] = {
        modid:option._moduleid,
        param: series
      }
      
      GetModule(modid, series, option._module,function(msg){
        InitChart(con, msg, null, list, le + 1, option._module);
      })
    }

    con.unbind('resize').resize(function () {
      chart.resize();
    });

    chart._redraw = function () {
      
      console.log('_redraw',chart);
      
      //单指标变化时XY判断
      function Piecheck(){
        var series, flag = true;
        series = option.series;
        $.each(series,function(index,col){
          if(col.type != 'pie'){
            flag = false;
            return flag;
          }
        });
        if(option.yAxis) option.yAxis[0].show = !flag;
        if(option.xAxis) option.xAxis[0].show = !flag;
      }
      
      var t = $.extend(true,{},option._module), series;
      delete option._module;
      
      Piecheck();
      
      this.setOption(option);
      option._module = t;
    };

    chart.on('click', function (param) {
      var index, series;
      index = param.seriesIndex;
      series = option.series[index];
      
      console.log(param, series);
      Drill(series);
    });
    
    chart.on('legendSelected', function(param){
      option.series.forEach(function(inner){
        if(inner.cn == param.target){
          inner.view = Number(param.selected[param.target]);
        }
      });
    });

    option.delseries = function (index) {
      if (!index) return console.log('删除指标时错误:缺少参数');
      var ta = [], series;
      series = this.series;
      String(index).split(',').forEach(function (t) {
        series.forEach(function (inner,i) {
          if (t == inner.$id) {
            series.splice(i,1);
          }
        })
      });
      series.unshift(option._oldData.type[0]);
      InitChart(con, {type: series, data: option._oldData.data}, option._oldData, levellist, level, option._module);
    };

    option.changetype = function (innertype, index) {
      if (index) { //单个指标
        var series;
        series = this.series;
        series.forEach(function (inner,inner_index) {
          if (index == inner.$id) {
            inner.type = innertype;
            inner.chart = innertype;
            config[innertype](inner, data, null, option, inner_index);
          }
        });
        
        chart._redraw();
      } else {    //全部指标
        type.forEach(function (inner, index) {
          if(!index) return null;
          inner.chart = innertype;
        });
        InitChart(con, {type: type, data: data}, option._oldData, levellist, level, option._module);
      }
    };

    option.showornot = function (index, flag) {
      if (!index) return console.log('修改指标类型时错误:缺少参数');
      var series, cn, legend, o;
      series = this.series;
      legend = this.legend;
      series.forEach(function (inner) {
        if (index == inner.$id) {
          cn = inner.cn;
          inner.view = flag;
          return true;
        }
      });
      o = option.legend.selected || {};
      o[cn] = Boolean(Number(flag));
      InitChart(con, option.toModule(), null, levellist, level, option._module, {
        legend:{
          selected: o
        }
      });
    };
    
    option.changenext = function(modid,index){
      if (!index) return console.log('修改指标类型时错误:缺少参数');
      var series, cn;
      series = this.series;
      series.forEach(function (inner) {
        if (index == inner.$id) {
          inner.next = modid;
          return true;
        }
      });
      chart._redraw();
    }

    option.toModule = function () {
      
      var newType = [];
      newType[0] = $.extend(true,{},this._oldData.type[0]);
      
      Xycheck();
      
      this.series.forEach(function (inner, index) {
        var t = extend({}, inner);
        delete t.data;
        newType.push(t);
      });
      
      /*横纵判断*/
      function Xycheck(){
        if(option.xAxis) newType[0].Xy = option.xAxis[0].type == 'category' ? true: false;
      }
      
      return {
        type: newType,
        data: data,
        search: this._oldData.search
      };
    };
  }

  /*入口*/

  function InitChart(con, msg, oldmsg, levellist, level, module, extendo) {
    var option = {}, type, data, chart, param, old, flg;
    old = oldmsg ? oldmsg : msg;
    flg = oldmsg ? true : false;
    chart = echarts.init(con[0],'macarons');
    type = $.extend(true, [], msg.type);
    data = $.extend(true, [], msg.data);
    module.chartObject = chart;
    
    option = extend({
        _oldData: old
      },
      tooltip_co(),
      calculable_co(),
      legend_co(type),
      xAxis_co(type, data),
      polar_co(type, data),
      yAxis_co()
    );
    option = DataChange_reg(option, chart);
    Event(con, chart, option, data, type, levellist, level);
    series_co(type, data, chart, option);
    extend(option,
      toolbox_co(option, con, chart, flg, levellist, level)
    );
    
    BeforeEnd(option,extendo);
    
    chart.setOption(option);
    
    option._module = module;
    option._moduleid = module.modid;
    
    window.chart = chart;
    
    return {
      chart: chart,
      model: option,
      data: msg
    }
  }
  
  /*输出之前最后检查,也可用于扩充之用*/
  
  function BeforeEnd(option,extendo){
    
    /*BOX控制*/
    function checkType(){
      var type, feature, oldtype;
      if(option.series[0]) type = option.series[0].type;
      if(option._oldData.type[1]) oldtype = option._oldData.type[1].type;
      feature = option.toolbox.feature;
      if(type == 'gauge'){
        option.toolbox.show = false;
        return null;
      }
      
      if(type == 'scatter'){
        feature.toxy.show = false;
        feature.chartedit.show = true;
        feature.toradar.show = false;
        feature.tocol.show = false;
        feature.magicType.show = false;
        feature.dataZoom = {show: true};
        return null;
      }
      
      if(type == 'radar'){
        if(type != oldtype) feature.toxy.show = false;
        feature.chartedit.show = true;
        feature.toradar.show = false;
        feature.tocol.show = false;
        feature.magicType.show = false;
      }else{
        feature.toxy.show = false;
      }
    }
    
    /*柱条判断*/
    function XyCheck(){
      var flag, temp;
      flag = option._oldData.type[0].Xy;
      if(typeof flag != 'undefined' && !flag && option.xAxis){
        temp = $.extend(true,{},option.xAxis[0]);
        option.xAxis[0] = $.extend(true,{},option.yAxis[0]);
        option.yAxis[0] = temp;
        option.yAxis[0].position = 'left';
      }
    }
    
    /* pie位置控制 */
    function PieLocation(){
      var flag = false, series, pieList = [];
      series = option.series;
      series.forEach(function(inner,index){
        if(inner.type != 'pie'){
          flag = true;
          return flag;
        }else{
          pieList.push(inner);
        }
      })
      
      if(flag) return null;
      
      switch(pieList.length){
        case 1:
          pieList[0].center = ['50%','50%'];
          pieList[0].radius = [0, '50%'];
          break;
        case 2:
          pieList[0].center = ['33%','50%'];
          pieList[0].radius = [0, '33%'];
          pieList[1].center = ['67%','50%'];
          pieList[1].radius = [0, '33%'];
          break;
        case 3:
          pieList[0].center = ['25%','50%'];
          pieList[0].radius = [0, '20%'];
          pieList[1].center = ['50%','50%'];
          pieList[1].radius = [0, '20%'];
          pieList[2].center = ['75%','50%'];
          pieList[2].radius = [0, '20%'];
          break;
      }
    }
    
    /* 是否要显示xy轴判定 */
    function PieXYcheck(){
      var series, flag = false;
      series = option.series;
      
      series.forEach(function(inner){
        var type = inner.type;
        if(type == 'line' || inner.type == 'bar' || inner.type == 'scatter') flag = true;
      })
      
      if(option.xAxis) option.xAxis[0].show = flag;
      if(option.yAxis) option.yAxis[0].show = flag;
    }
    
    
    PieLocation();
    checkType();
    XyCheck();
    PieXYcheck();
    
    console.log('beforeInit',option);
    console.log('String',JSON.stringify(option));
    
    /*内部重构*/
    if(extendo) $.extend(true,option,extendo);
  }

  /*数据转换接口*/

  function DataChange_reg(option, chart) {

    var t = {
      toEditTable: chartToEditTable,
      toDataTable: chartToDataTable
    };

    function chartToEditTable() {
      var series, result = [];
      series = option.series;
      series.forEach(function (inner, index) {
        var o = {
          name: inner.name,
          next: inner.next,
          view: inner.view,
          unit: inner.unit,
          type: inner.type,
          $id: inner.$id,
          chartlist: JSON.stringify(inner.chart.split(','))
        };
        result.push(o);
      });
      return result;
    }

    function chartToDataTable() {
      var o = {}, chartData;
      o.columns = [];
      chartData = option.toModule();
      o.data = chartData.data;
      chartData.type.forEach(function(col, index){
        o.columns.push({
          title:col.cn,
          data:col.en
        });
      });
      return option._module.grid(o);
    }

    return extend(option, t);
  }

  /*模块Class*/

  var Module = function (con, modelid, param, cb, cache) {
    
    /* 默认配置 */
    var module = {
      modid: '',
      modtype: '',
      name: '',
      share : false,
      systag: '0',
      chart: NewChart,
      search: SearchParam,
      set: Set,
      get: GetDom,
      grid: Grid,
      chartObject : {},
      modelid: '',
      modapi: ''
    }
    
    /* class 构造 */
    function Module() {
      
      $.extend(true,module,param);

      GetHTML(function (jq) {
        if(modelid){
          GetData(function(mod){
            Init(jq,mod);
            cb && cb(module);
          });
        }else{
          cb && cb(module);
        }
      })
    }
    
    /* 初始化 
    *  参数: 1.容器 2.模块
    */
    function Init(con, mod){
      
      // 测试用
      var data = {
        "type": [
          // {
          //   "en": "en1",
          //   "cn": "分类名",
          //   "view": "1",
          //   "ro": "是否只读:1",
          //   "must": "是否必须输入(sys_md_mm002):1",
          //   "search": "是否检索条件:1",
          //   "elemtype": "元素标签类型",
          //   "datatype": "数据类型",
          //   "numrange": "数据长度",
          //   "format": "显示格式",
          //   "unit": "单位",
          //   "dict": "字典类别(typecd)",
          //   "chart": null
          // },
          {
            "en": "en2",
            "cn": "统计A",
            "view": "1",
            "ro": "是否只读:1",
            "must": "是否必须输入(sys_md_mm002):1",
            "search": "是否检索条件:1",
            "elemtype": "元素标签类型",
            "datatype": "数据类型",
            "numrange": "数据长度",
            "format": "显示格式",
            "unit": "单位",
            "dict": "字典类别(typecd)",
            "chart": "scatter"
          },
          // {
          //   "en": "en3",
          //   "cn": "统计B",
          //   "view": "1",
          //   "ro": "是否只读:1",
          //   "must": "是否必须输入(sys_md_mm002):1",
          //   "search": "是否检索条件:1",
          //   "elemtype": "元素标签类型",
          //   "datatype": "数据类型",
          //   "numrange": "数据长度",
          //   "format": "显示格式",
          //   "unit": "单位",
          //   "dict": "字典类别(typecd)",
          //   "chart": "pie"
          // },
          // {
          //   "en": "en4",
          //   "cn": "统计C",
          //   "view": "1",
          //   "ro": "是否只读:1",
          //   "must": "是否必须输入(sys_md_mm002):1",
          //   "search": "是否检索条件:1",
          //   "elemtype": "元素标签类型",
          //   "datatype": "数据类型",
          //   "datalength": "数据长度",
          //   "format": "显示格式",
          //   "unit": "单位",
          //   "dict": "字典类别(typecd)",
          //   "chart": "pie"
          // }
        ],
        "data": [
          {
            "en1": "直接访问",
            "en2": '121,111',
            "en3": 122,
            "en4": 123
          },
          {
            "en1": "邮件营销",
            "en2": '221,333',
            "en3": 222,
            "en4": 223
          },
          {
            "en1": "联盟广告",
            "en2": '321,222',
            "en3": 322,
            "en4": 323
          },
          {
            "en1": "视频广告",
            "en2": '635,111',
            "en3": 636,
            "en4": 637
          },
          {
            "en1": "搜索引擎",
            "en2": '757,222',
            "en3": 758,
            "en4": 759
          }
        ],
        "search":[				
          {				
              "en": "enName1",				
              "cn": "名称1",				
              "elemtype": "text",				
              "datatype": "数据类型",				
              "numrange": "数据长度",				
              "format": "显示格式",				
              "unit": "单位",				
              "dict": "字典类别(typecd)"				
          },				
          {				
              "en": "enName2",				
              "cn": "名称2",				
              "elemtype": "date",				
              "datatype": "数据类型",				
              "numrange": "数据长度",				
              "format": "显示格式",				
              "unit": "单位",				
              "dict": "字典类别(typecd)"				
          }				
        ]
      };
      
      var title, msg;
      title = con.find('strong');
      module.fileid = mod.fileid;
      
      msg = JSON.parse(mod.jsondata);
      
      // 测试用
      // msg = data;
      
      title.html(mod.modnm);
      UpdateDom(mod);
      SearchParam(mod, msg.search || []);
      if(msg.type) return NewChart(msg);
    }
    
    /* Ajax获取页面 
    *  参数: 1.回调函数
    */
    function GetHTML(cb) {
      
      var t = null;
      
      if(cache && cache.HTMLcache){
        con.empty();
        t = $(cache.HTMLcache).appendTo(con);
        cb && cb(t);
      }else{
        zy.net.loadHTML('bi/chart_widget.html', $('<div>'), function (HTMLstr) {
          if(cache) cache['HTMLcache'] = HTMLstr;
          var t = $(HTMLstr).appendTo(con);
          cb && cb(t);
        })
      }
    }

    /* Ajax请求数据 
    *  参数: 1.回调函数
    */
    function GetData(cb) {
      
      if(cache && cache.DataCache && cache.DataCache[modelid]){
        $.extend(true, module, cache.DataCache[modelid]);
        cb && cb(cache.DataCache[modelid]);
      }else{
        zy.extend.get({
          apinm:'mod_json_selone',
          mod:'echart',
          app:'a6929eedff5c49e5a1a0f5b490873b39'
        },function(msg){
          if(cache){
            if(!cache.DataCache) cache.DataCache = {};
            cache.DataCache[modelid] = msg.mods[0];
          }
          $.extend(true, module, msg.mods[0]);
          cb && cb(msg.mods[0]);
        },{modid:modelid})
      }
    }

    /* 查询条件 
    *  参数: 1.模块 2.数据中的search字段 3.默认值及其他参数
    */
    function SearchParam(mod, search, param) {
      
      var elemtype = {
        select2_radio: select2_radio,
        date: BuildDateTime,
        text: text,
        textarea: textarea
      };
      
      var searchCon, searchObj, Jq_search, Jq_search_btn, Param_list = [];
      Jq_search = con.find('#search');
      Jq_search_btn = con.find('#search_btn');
      
      function GetFieldset(){
        var simple_ele = Jq_search.find('#simple_ele');
        if(simple_ele.length == 0){
          simple_ele = $('<fieldset id="simple_ele">').appendTo(Jq_search);
        }
        return simple_ele;
      }
      
      function BuildDom(en,label_class,cn){
        var section, label, input, labelForName;
        section = $('<section>').addClass('col col-2');
        labelForName = $('<label>').addClass('label');
        label = $('<label>').addClass(label_class);
        input = $('<input>').attr('name',en);
        return section.append(labelForName.html(cn)).append(label.append(input));
      }
      
      function Reset(){
        Jq_search.empty();
      }
      
      function select2_radio(search_inner){
        var fieldset, section, input;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'input', search_inner.cn);
        input = section.find('input');
        
        fieldset.append(section);
        
        zy.cache.initDicts(search_inner.dict, function(){
          input.zySelect(search_inner.dict, false, {
            allowClear:false,
            width: '100%'
          });
        });
        
        return {
          en: search_inner.en,
          type: 'select2_radio',
          obj: input
        }
      }
      
      function text(search_inner){
        var fieldset, section;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'input', search_inner.cn);
        
        fieldset.append(section);
        return {
          en: search_inner.en,
          type: 'text',
          obj: section.find('input')
        }
      }
      
      function textarea(search_inner){
        var fieldset, section;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'textarea', search_inner.cn);
        
        fieldset.append(section);
        return {
          en: search_inner.en,
          type: 'textarea',
          obj: section.find('textarea')
        }
      }
      
      function BuildDateTime(search_inner){
        searchCon = $('<div>');
        searchCon.appendTo(Jq_search);
        searchObj = createDataComponent(searchCon, search_inner || {});
        return {
          en: search_inner.en,
          type: 'date',
          obj: searchObj
        }
      }
      
      function DyParam(){
        var o = {};
        Param_list.forEach(function(inner){
          var type = inner.type;
          var en = inner.en;
          var obj = inner.obj;
          switch(type){
            case 'date':
              var inner = obj.get();
              // {dt_type:'1',flg:'1',dt_from:'2015-01-01',dt_to:'2015-02-05'}
              o[en] = {
                dy_type: inner.dt_type,
                dt_from: inner.dt_from,
                dt_to: inner.dt_to,
                flg: Number(inner.flg),
              };
              break;
            default :
              o[en] = obj.val();
          }
        })
        return o;
      }
      
      if(search.length > 0 ) Jq_search.closest('form').show();
      
      search.forEach(function(inner){
        var eleType = inner.elemtype;
        if(elemtype[eleType]){
          Param_list.push(elemtype[eleType](inner));
        }
      });
      
      Jq_search_btn.click(function(){
        var oldmsg = module.chartObject.getOption().toModule();
        zy.extend.get({
          apinm: mod.apiid,
          mod:'commapi',
          app:'c770045becc04c7583f626faacd3b456'
        },function(msg){
          NewChart({
            type:oldmsg.type,
            data:msg.data,
            search:msg.search
          },oldmsg);
        },$.extend(true,{},DyParam(),{modolcd: mod.modolcd}))
      });
    }
    
    /* 构造图表 
    *  参数: 1.接口数据
    */
    function NewChart(msg,old) {
      
      var chartCon, chartObj;
      chartCon = con.find('#echart');
      
      InitChart(chartCon, msg, old, null, null, module);
    }
    
    /* 修改模块属性 
    *  参数: 1.参数对象
    */
    function Set(param){
      
      var chart, option;
      chart = module.chartObject;
      option = chart.getOption();
      option._moduleid = param.modid;
      chart.setOption(option);
      
      $.extend(module,param);
      
      UpdateDom(module);
    }

    /* 获取模块属性 
    */
    function Get(){
      return module;
    }

    /* 模块对应数据表格
    *  参数: 1.表格配置
    */
    function Grid(gridoptions){
      
      var InnerCon = con.find('#chart_table_con');
      
			jQuery.fn.dataTableExt.oSort['chinese-asc'] = function (x, y) {
  			//javascript 本身提供的本地化比较函数。
  			return x.localeCompare(y);
  		};
  
  		jQuery.fn.dataTableExt.oSort['chinese-desc'] = function (x, y) {
  			return y.localeCompare(x);
  		};
  
  		jQuery.fn.dataTableExt.aTypes.push(function (sData) {
  			var reg = /^[\u4e00-\u9fa5]{0,}$/;
  			if (reg.test(sData)) {
  				return 'chinese';
  			}
  			return null;
  		});
  		
  		function ResetDom(){
  		  var target = con.find('#chart_table_template').children().clone();
  		  InnerCon.empty();
  		  target.appendTo(InnerCon);
  		}
  		
			function buildHeader() {
				var arr = [];
				$.each(gridoptions.columns, function (i, v) {
					arr.push(v.title);
				});
				return arr;
			}

			function OutData(str) {
				var condition = '';
				zy.g.am.mod = 'echart';
				zy.g.am.app = 'a6929eedff5c49e5a1a0f5b490873b39';
				var r_parm = {
					chartdata: str,
					filenm: module.fileid,
					rowcount: gridoptions.data.length,
					colcount: gridoptions.columns.length,
					condition: condition || '空'
				};
				zy.net.postDownload("download/chart_prol_build", r_parm);
			}
			
			ResetDom();
			
			/*dataTable初始化参数 */
			var dataTable = {
						"language": {
							"sProcessing": "处理中...",
							"sLengthMenu": "显示 _MENU_ 项结果",
							"sZeroRecords": "没有匹配结果",
							"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
							"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
							"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
							"sInfoPostFix": "",
							"sSearch": "搜索:",
							"sUrl": "",
							"sEmptyTable": "表中数据为空",
							"sLoadingRecords": "载入中...",
							"sInfoThousands": ",",
							"oPaginate": {
								"sFirst": "首页",
								"sPrevious": "上页",
								"sNext": "下页",
								"sLast": "末页"
							},
							"oAria": {
								"sSortAscending": ": 以升序排列此列",
								"sSortDescending": ": 以降序排列此列"
							}
						},
						"searching": false,
						// "autoWidth": true,
						"paging": true,
						// "ordering": true,
						// "info": true,
						// "destroy": true,
						// "scrollY": "auto",
						// "scrollCollapse": true,
						"scrollX": true
					};
			// 合并初始化参数选项
			dataTable = $.extend({}, dataTable, gridoptions);
			var table = InnerCon.find('#chart_table').DataTable(dataTable);
			var dataTableS = $.extend({}, dataTable);
			dataTableS.paging = false;
			InnerCon.find('#chart_table_ods').DataTable(dataTableS);
			InnerCon.find('#chart_table_ods_wrapper').hide();
			InnerCon.find(".dataTables_length").removeClass("dataTables_length");
			silderbarinit(gridoptions.columns);
			InnerCon.find('a.toggle-vis').on('click', function (e) {
				e.preventDefault();
				var column = table.column($(this).attr('data-column'));
				column.visible(!column.visible());
			});
			InnerCon.find('[index=outData]').click(function () {
				var str = InnerCon.find('#chart_table_ods').table2CSV({
					separator: ',',
					delivery: 'value',
					header: buildHeader()
				});
				OutData(str);
			});
			InnerCon.find('[index=closeTable]').click(function(){
			  var $this = $(this);
			  $this.closest('#chart_table_con').empty();
			});
	
      function silderbarinit(columnstr) {
				var silderbar = "显示/隐藏: ";
				$.each(columnstr, function (i, type) {
						$.each(type, function (j, val) {
							if ("title" == j) {
								silderbar = silderbar + "-<a class='toggle-vis' data-column='" + i + "'>" + val + "</a>"
							}
						});
					});
				InnerCon.find('#chart_table_slider_bar').html(silderbar);
			}
    }
    
    /* 把DOM写在模型里边很不好!暂时如此 */
    
    /* 定位标签
    */
    function FindDom(){
      var row, modnm, modtype, modshare, modfile;
      row = con.prev();
      modnm = row.find('[index=modTitle]');
      modtype = row.find('[index=modClass]');
      modshare = row.find('[index=share]');
      modfile = row.find('[index=fileName]');
      
      return {
        modnm : modnm,
        modtype : modtype,
        modshare : modshare,
        modfile : modfile
      }
    }
    
    /* 更新标签
    *  参数: 1.模块数据
    */
    function UpdateDom(mod){
      
      var dom, modnm, modtype, modshare, modfile;
      dom = FindDom();
      
      modnm = dom.modnm;
      modtype = dom.modtype;
      modshare = dom.modshare;
      modfile = dom.modfile;
      
      modnm && modnm.val(mod.modnm);
      modtype && modtype.val(mod.modtype);
      modshare && modshare.prop('checked',Number(mod.share) || Number(mod.shareable));
      modfile && modfile.val(mod.fileid);
    }
    
    /* 从标签取数据
    */
    function GetDom(){
      var dom, modnm, modtype, modshare, modfile;
      dom = FindDom();
      
      modnm = dom.modnm;
      modtype = dom.modtype;
      modshare = dom.modshare;
      modfile = dom.modfile;
      
      return {
        modnm: modnm.val(),
        modtype: modtype.val(),
        modshare: modshare.prop('checked'),
        modfile: modfile.val()
      }
    }
    
    return Module.call(this);
  };

  if (!window.zychart) {
    window.zychart = Module;
  }

})();