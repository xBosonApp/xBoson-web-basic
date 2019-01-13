// (function ($) {
/*
 *   !完成后用自调用包裹，防止命名污染!  
 */

/* 模块 */
function Module(con, param, done) {
  
  /* 默认 */
  var module = {
    modtype: '',
    modid: '',
    modnm: '',
    jsondata: '',
    shareable: '0',
    fileid: '',
    modolcd: '',
    apiid: '',
    chart: {},
    list: [],
    level: 0,
    paramlist: [],
    formhtml: null,
  };

  var thiz = this;
  var chart_form_div = con.parents('.widget-body').find('.chart_form_div').hide();
  
  thiz.fn = {};
  
  /* 预留 */
  thiz.fn.NewModule = function () {
  };
  
  /* 获取模块 */
  thiz.fn.GetModule = function (moduleid, cb) {
    zy.extend.get({
      apinm: 'mod_json_selone',
      mod: 'echart',
      app: 'a6929eedff5c49e5a1a0f5b490873b39'
    }, function (msg) {
      var mod = msg.mods[0];
      cb && cb(mod);
    }, {modid: moduleid})
  };
  
  /* 获取模型 */
  thiz.fn.GetModol = function (modolid, apiid, param, cb) {
    //参数组合......
    zy.log('GetModol-param=',param);
    if(param.modolcd && param.modolcd.trim()!==''){
    }else{
      param.modolcd = modolid;
    }
    zy.log('GetModol-param=',param);
    //.......
    zy.extend.get({
      apinm: apiid,
      mod: 'commapi',
      app: 'c770045becc04c7583f626faacd3b456'
    }, function (msg) {
      cb && cb(msg);
    }, param)
  };
  
  /* 获取模版 */
  thiz.fn.GetHTML = function (cb) {
    
    con.empty();
    
    zy.net.loadHTML('bi/chart_widget.html', $('<div>'), function (HTMLstr) {

      var t = $(HTMLstr).appendTo(con);

      cb && cb(t);
    })
  };
  
  /* 构建图表 */
  thiz.fn.BuildChart = function (chartmsg, modulemsg, modolmsg) {
    var chartcon = con.find('#echart');
    Chart(chartcon, chartmsg, modulemsg, modolmsg, thiz);
  };
  
  /* 获取私有数据 */
  thiz.fn.GetSelf = function () {
    return module;
  };
  
  /* 设置私有数据 */
  thiz.fn.SetSelf = function (param) {
    $.extend(true, module, param);
    thiz.fn.UpdateDom(module);
  };
  
  /* 构建表格 */
  thiz.fn.BuildGrid = function (gridoptions) {

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

    function ResetDom() {
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
    InnerCon.find('[index=closeTable]').click(function () {
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
  };

  /* 暂无用 */
  thiz.fn.ToModule = function () {
    console.log(module);
  };

  /* 内部方法 按需求外放 找到模块基本信息对应的标签 */
  function FindDom() {
    var row, modnm, modtype, modshare, modfile;
    row = con.prev();
    modnm = row.find('[index=modTitle]');
    modtype = row.find('[index=modClass]');
    modshare = row.find('[index=share]');
    modfile = row.find('[index=fileName]');

    return {
      modnm: modnm,
      modtype: modtype,
      modshare: modshare,
      modfile: modfile
    }
  }
  
  /* 更新标签 */
  thiz.fn.UpdateDom = function (mod) {

    var dom, modnm, modtype, modshare, modfile;
    dom = FindDom();

    modnm = dom.modnm;
    modtype = dom.modtype;
    modshare = dom.modshare;
    modfile = dom.modfile;

    modnm && modnm.val(mod.modnm);
    modtype && modtype.val(mod.modtype);
    modshare && modshare.prop('checked', Number(mod.share) || Number(mod.shareable));
    modfile && modfile.val(mod.fileid);
  };

  /* 从标签中取数据 */
  thiz.fn.GetDom = function () {
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
    };
  };
  
  function fix_height() {
    con.height(con.height());
    setTimeout(function() {
      con.height('auto');
    }, 1000);
  }
  
  /* 向下钻取 */
  thiz.fn.DrillDown = function(param){
    //zy.log('before DrillDown', module.list);
    fix_height();
    chart_form_div.hide();
    thiz.fn.ParamHander(param.searchparam);
    
    //console.log('before DrillDown', param.searchparam);
    
    if(module.list.length === 0){
      //console.log('xxxxx1', module.chart.modoldata.search)
      param.search = module.chart.modoldata.search;
      Init(param,  [{
        modid: module.modid,
        search: param.search,
        searchparam: $.extend(true,{},param.searchparam)
      }], 1);
    }else{
      param.search = module.list[module.level].search;
      //console.log('xxxxx2', param.search)
      Init(param,  module.list, module.level + 1); 
    }
  };
  
  /* 回退 */
  thiz.fn.DrillUp = function(){
    //zy.log('before DrillUp', module.list);
    fix_height();
    if(module.level) {
      var param = module.list[module.level - 1];
      //zy.log('newwwwwww',param);
      thiz.fn.ParamHander(param.searchparam);
      Init(param,  module.list, module.level - 1);
    }
    if (module.level < 2) {
      // con.parents('.widget-body')
      //   .find('.chart_form_div').html('').show();
    }
  };
  
  /* 模块查询条件处理 */
  thiz.fn.ParamHander = function (searchparam){
      module.paramlist.forEach(function(inner,index){
        if(inner.type == 'date'){
          var dt = inner.obj.get();
          // {dt_type:'1',flg:'1',dt_from:'2015-01-01',dt_to:'2015-02-05'}
          searchparam[inner.en] = JSON.stringify({
            dt_type: dt.dt_type,
            dt_from: dt.dt_from,
            dt_to: dt.dt_to,
            flg: Number(dt.flg).toString(),
          });
        }else{
          // 不知道为什么这么做，导致传参错误，暂时注释掉 - 纪
          //searchparam[inner.en] = inner.obj.val();
        }
      });
    };
  
  /* 构建查询条件 */
  thiz.fn.BuildSearch = function(search, searchparam, jformdiv){
      zy.log('BuildSearch-search=',search);
      var Param_list = [];
      var elemtype = {
        empty: Empty,
        select2_radio: select2_radio,
        date: BuildDateTime,
        text: text,
        textarea: textarea
      };
      
      if (!module.formhtml) return;
      if (!jformdiv) {
        jformdiv = con.parents('.widget-body').find('.chart_form_div');
      }
      
      jformdiv.html(module.formhtml);

      for (var n in searchparam) {
        var inp = jformdiv.find('[name=' + n + ']');
        inp.val(searchparam[n]);
      }
      
      jformdiv.append("<hr style='clear: both'/>");
      
      jformdiv.find(':input').each(function() {
        var thiz = $(this);
        var name = thiz.attr('name');
        var val  = searchparam[name];
        var type = thiz.attr('type');
        
        var getter = function() {
          return thiz.val();
        };
        
        switch(type) {
          case 'select2_radio':
            var dict = thiz.attr('dict');
            zy.org.cache.initDicts(dict, zy.g.comm.org, function() {
              $(thiz).orgSelect(dict, zy.g.comm.org, true, {  width: '100%' });
            });
            break;
            
          case 'date2':
            thiz.datepicker({
              language :'zh-CN',
              format   :'yyyy-mm-dd'
            });
            break;
            
          case 'date':
            var searchCon = $('<div>');
            searchCon.appendTo(jformdiv);
            var searchObj = thiz.fn.createDataComponent(searchCon, {});
            if(searchparam && searchparam[name]) 
                searchObj.set(searchparam[name]);
                
            getter = function() {
              return JSON.stringify(searchObj.get());
            };
            break;
            
          default:
            val && thiz.val(val);
        }
        
        Param_list.push({
          en  : name,
          val : getter
        });
      });
      
      jformdiv.find('form').off('submit').on('submit', function() {
        if(!module.apiid || !module.modolcd) return false;
        var _parm = $.extend(true, {}, DyParam2(), { modolcd: module.modolcd });
        
        zy.extend.get({
          apinm: module.apiid,
          mod:'commapi',
          app:'c770045becc04c7583f626faacd3b456'
        }, function(msg){
          thiz.fn.BuildChart(
            module.chart.chartdata, 
            module.chart.moduledata, 
            { data:msg.data });
        }, _parm);
      });
      
      module.paramlist = Param_list;
      
      
      function DyParam2(){
        var o = {};
        Param_list.forEach(function(inner) {
          o[inner.en] = inner.val();
        });
        return o;
      }
      
      return; //  屏蔽自动构建的 form
      
      var searchCon, searchObj, Jq_search, Jq_search_btn, Param_list = [];
      Jq_search = con.find('#search');
      Jq_search_btn = con.find('#search_btn');
      Jq_search_form = Jq_search.closest('form');
      
      function GetFieldset(){
        // var simple_ele = Jq_search.find('#simple_ele');
        // if(simple_ele.length === 0){
        //   simple_ele = $('<fieldset id="simple_ele">').appendTo(Jq_search);
        // }
        // return simple_ele;
      }
      
      function BuildDom(en,label_class,cn){
        // var section, label, input, labelForName;
        // section = $('<section>').addClass('col col-2');
        // labelForName = $('<label>').addClass('label');
        // label = $('<label>').addClass(label_class);
        // input = $('<input>').attr('name',en);
        // return section.append(labelForName.html(cn)).append(label.append(input));
      }
      
      function Reset(){
        Jq_search.empty();
      }
      
      function Empty(){
        var fieldset, section, input;
        fieldset = GetFieldset();
        section = BuildDom('','input', '无查询条件');
        fieldset.append(section);
        section.find('.input').remove();
      }
      
      function Hide(){
        Jq_search_form.hide();
      }
      
      function select2_radio(search_inner){
        var fieldset, section, input;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'input', search_inner.cn);
        input = section.find('input[name]');
        
        fieldset.append(section);
        
        zy.org.cache.initDicts(search_inner.dict, zy.g.comm.org, function(){
          input.orgSelect(search_inner.dict, zy.g.comm.org, false, {
            width: '100%'
          });
          if(searchparam) input.select2('val',searchparam[search_inner.en]);
        });
        
        return {
          en: search_inner.en,
          type: 'select2_radio',
          obj: input
        };
      }
      
      function text(search_inner){
        zy.log('search_inner',search_inner);
        var fieldset, section, input;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'input', search_inner.cn);
        fieldset.append(section);
        input = section.find('input');
        if(searchparam) input.val(searchparam[search_inner.en]);
        return {
          en: search_inner.en,
          type: 'text',
          obj: input
        };
      }
      
      function textarea(search_inner){
        var fieldset, section, textarea;
        fieldset = GetFieldset();
        section = BuildDom(search_inner.en,'textarea', search_inner.cn);
        
        fieldset.append(section);
        textarea = section.find('textarea');
        if(searchparam) textarea.val(searchparam[search_inner.en]);
        return {
          en: search_inner.en,
          type: 'textarea',
          obj: textarea
        };
      }
      
      function BuildDateTime(search_inner){
        searchCon = $('<div>');
        searchCon.appendTo(Jq_search);
        searchObj = thiz.fn.createDataComponent(searchCon, search_inner || {});
        // zy.log('search_inner=',search_inner);
        // zy.log('searchparam=',searchparam);
        if(searchparam && searchparam[search_inner.en]) searchObj.set(searchparam[search_inner.en]);
        return {
          en: search_inner.en,
          type: 'date',
          obj: searchObj
        };
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
              o[en] = JSON.stringify({
                dt_type: inner.dt_type,
                dt_from: inner.dt_from,
                dt_to: inner.dt_to,
                flg: Number(inner.flg).toString(),
              });
              break;
            default :
              o[en] = obj.val();
          }
        });
        return o;
      }
      
      Reset();
      if(search.length === 0 ){
        Empty();
        Jq_search_btn.btnDisable(true);
        Hide();
        return false;
      }
      
      Jq_search_btn.btnDisable(false);
      Jq_search.closest('form').show();
      
      search.forEach(function(inner){
        console.log('inner',inner);
        var eleType = inner.elemtype;
        if(elemtype[eleType]){
          Param_list.push(elemtype[eleType](inner));
        }
      });
      
      Jq_search_btn.unbind('click').click(function(){
        if(!module.apiid || !module.modolcd) return false;
        console.log(module);
        zy.extend.get({
          apinm: module.apiid,
          mod:'commapi',
          app:'c770045becc04c7583f626faacd3b456'
        },function(msg){
          thiz.fn.BuildChart(module.chart.chartdata, module.chart.moduledata, { data:msg.data });
        },$.extend(true,{},DyParam(),{modolcd: module.modolcd}));
      });
      module.paramlist = Param_list;
  };
  
  /* 时间控件 by jym */
  thiz.fn.createDataComponent = function (parent_jq, option) {

    function isnul(_obj) {
      return _obj == null || _obj == '';
    }

    zy.net.loadHTML("bi/chart_time.html", parent_jq);

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
    };
  };
  
  /* 模块钻取时合并查询条件 */
  thiz.fn.combineSearch = function(arr1, arr2){
    arr2.forEach(function(sinner){
      var flag = true;
      arr1.forEach(function(dinner){
        if(sinner.en == dinner.en) return flag = false, true;
      });
      if(flag) arr1.push(sinner);
    });
  };
  
  /* Main */
  function Init(param, list, level) {
    var modid, search, searchparam;
    modid = param ? param.modid : null;
    search = [];
    searchparam = param ? param.searchparam : null;
    param.search && thiz.fn.combineSearch(search, param.search);

    thiz.fn.GetHTML(function (conn) {

      if (!modid) return done && done(conn, thiz);
      
      if(typeof list != 'undefined'){
        if(!list[level]) list[level] = param;
        module.list = list;
        module.level = level;
        console.log('dirll down', list, level, param);
      }
      
      thiz.fn.GetModule(modid, function (module) {
        var apiid, modolcd, ownsearchparam;
        thiz.fn.SetSelf(module);
        apiid = module.apiid;
        modolcd = module.modolcd;
        ownsearchparam = JSON.parse(module.jsondata).searchparam || {};
        $.extend(true, ownsearchparam, searchparam);
        if (apiid && modolcd) thiz.fn.GetModol(modolcd, apiid, ownsearchparam, function (modol) {
          var newtype = JSON.parse(module.jsondata);
          // var search=modol.search;
          zy.log('ownsearchparam=',ownsearchparam);
          thiz.fn.combineSearch(search, modol.search); //合并查询条件
          thiz.fn.BuildSearch(search, ownsearchparam);
          
          thiz.fn.BuildChart(newtype, newtype, modol);
          done && done(conn, thiz);
        });
      });
    });
  }

  Init(param);
}

/* 基于Echarts 若不传module 也可独立运行*/
function Chart(con, newType, modulemsg, modolmg, module) {
  
  
  /* 图形优先级 */
  var zlevel = {
    line: 999,
    pie: 9,
    bar: 8,
    column: 8,
    stagecolumn: 8,
    stagebar: 8,
    arealine: 10,
  };

  var match = {
    line: DefaultXy,
    pie: DefaultXy,
    bar: DefaultXy,
    column: DefaultXy,
    stagecolumn: DefaultXy,
    stagebar: DefaultXy,
    arealine: DefaultXy,
    gauge: DefaultGauge,
    radar: DefaultRadar,
    scatter: DefaultScatter
  };

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
    },
    stagecolumn: {
      id: 'stagecolumn',
      name: '堆叠条形图',
      text: '堆叠条形图stagecolumn'
    }
  };

  /* 基类 */
  function Base(newType, modulemsg, modolmg) {

    var thiz = this;

    thiz.fn = {};

    /* 默认配置 */
    thiz.chartoption = {
      calculable: false, //拖拽开关
      tooltip: {
        show: true
      },
      legend: {
        y: 'bottom',
        data: [],
        selected: {}
      },
      toolbox: {
        show: true,
        feature: {
          chartedit: {
            show: true,
            title: '配置',
            icon: 'bi/image/edit.png',
            onclick: function () {
              zy.net.loadHTML('bi/edit_table.html', $('#modal'), function () {
                edit_table(thiz, chartlistmap);
              });
              return false;
            }
          },
          rollback: {
            show: true,
            title: '还原',
            icon: 'bi/image/reset.png',
            onclick: function () {
              Echart(thiz.moduledata, thiz.moduledata, thiz.modoldata);
            }
          },
          saveAsImage: {show: true},
          datagrid: {
            show: true,
            title: '数据表格',
            icon: 'bi/image/grid.png',
            onclick: function () {
              var chartdata = thiz.chartdata;
              var o = {};
              o.columns = [];
              chartdata.type.forEach(function (col) {
                o.columns.push({
                  title: col.cn,
                  data: col.en
                });
              });
              o.data = chartdata.data;
              module && module.fn.BuildGrid(o);
            }
          },
          backtoparent: {
            show:false,
            title:'回到上一个模块',
            icon:'bi/image/back.png',
            onclick: function(){
              module && module.fn.DrillUp();
            }
          }
        }
      },
      series: []
    };

    /* 三个数据源 */
    thiz.moduledata = modulemsg;
    thiz.modoldata = modolmg;
    thiz.chartdata = newType;
    console.log('modoldata',modolmg)
    console.log('chartdata',newType)

    /* 获取x轴数据  */
    thiz.fn.getx = function () {
      console.log(thiz.chartdata.type[0])
      var type = thiz.chartdata.type[0], result;
      // 第一列是x轴
      if (type && !type.chart) {
        var en = type.en;
        result = thiz.fn.typetodata(en);
      }
      // 每一列的列头为x轴
      return result || [];
    };

    /* 构造series内部对象 */
    thiz.fn.common = function (inner) {
      var o;
      o = {
        name: inner.cn,
        en: inner.en,
        cn: inner.cn,
        unit: inner.unit,
        view: inner.view,
        chart: inner.chart,
        next: inner.next,
        dicttype: inner.dicttype || inner.chart.split(',')[0],
        data: []
      };

      return o;
    };

    /* 用en查询数据 返回对应的数组 */
    thiz.fn.typetodata = function (en) {
      console.log(en)
      var data = thiz.chartdata.data;
      // zy.log('thiz.chartdata:',thiz.chartdata);
      var result = [];
      console.log(data);
      window.pp=en;
      window.ll=data;
      data.forEach(function (col) {
        var target = col[en] || '';
        result.push(target);
      });
      return result;
    };

    /* 初始化 */
    thiz.fn.Init = function (match) {

      thiz.chartdata.type.forEach(function (inner, index) {
        var type;
        if (!inner.chart) return null;

        if (inner.dicttype) type = inner.dicttype;
        else type = inner.chart.split(',')[0];
        if (match[type]) match[type](inner, index);
      });
    };

    /* 数据合并 */
    thiz.fn.combine = function () {
      var modol, module, chart;
      modol = thiz.modoldata;
      module = thiz.moduledata;
      chart = thiz.chartdata;

      chart.data = $.extend(true, [], modol.data);

    };

    /* 更改类型  */
    thiz.fn.changeType = function (newType) {
      Echart(newType, thiz.moduledata, thiz.modoldata);
    };

    /* 编辑页面表格数据 */
    thiz.fn.editData = function () {
      var series, result = [];
      series = thiz.chartoption.series;
      series.forEach(function (inner, index) {
        var o = {
          cn: inner.cn,
          en: inner.en,
          next: inner.next,
          view: inner.view,
          unit: inner.unit,
          dicttype: inner.dicttype,
          type: inner.type,
          chart: inner.chart,
          chartlist: JSON.stringify(inner.chart.split(','))
        };
        result.push(o);
      });
      return result;
    };

    /* 获取x轴的type数据 */
    thiz.fn.xbacktotype = function () {
      var targetType = thiz.chartdata.type[0];
      if (!targetType.chart) return targetType;
      return null;
    };

    /* 从编辑页面返回数据 */
    thiz.fn.fromEdit = function (newtype) {
      var x = thiz.fn.xbacktotype();
      if (x) newtype.type.unshift(x);

      var result = [];

      $.each(newtype.type, function (index, val) {
        result.push(val);
      });

      Echart({type: result}, thiz.moduledata, thiz.modoldata);
    };
    
    /* 钻取检测 */
    thiz.fn.drillBtn = function (){
      if(!module) return null;
      var mod = module.fn.GetSelf();
      thiz.chartoption.toolbox.feature.backtoparent.show = Boolean(mod.level);
    };
    
    /* 图例 */
    thiz.fn.legend = function(){
      var type, data;
      type = thiz.chartdata.type;
      data = thiz.chartoption.legend.data;
      type.forEach(function(inner){
        if(inner.chart) data.push(inner.cn);
      });
    };
    
    /* 显示与否 */
    thiz.fn.showornot = function(){
      var type, selected;
      type = thiz.chartdata.type;
      selected = thiz.chartoption.legend.selected;
      type.forEach(function(inner){
        if(inner.chart){
          var flag = Boolean(Number(inner.view));
          selected[inner.cn] = flag;
        }
      });
    };
    
    /* 往回钻取 !!!高阶函数处理计数问题!!!*/
    thiz.fn.drillbackcount = function(){
      var count = 0, all;
      if(thiz.chartdata.type[0].chart){
        all = thiz.chartdata.type.length;
      }else{
        all = thiz.chartdata.type.length - 1;
      }
      return function(innerseries, data, cb){
        var flag = DataTypeCheck(innerseries, data);
        if(flag){ 
          count++; 
        }else{
          cb && cb();
        }
        
        if(count == all){
          if(module){  //回钻执行
            var info = module.fn.GetSelf();
            if(info.level){
              zy.extend.msg('模块:' + info.modnm + ' 所有指标数据不正确,回退到上一个模块','w');
              module.fn.DrillUp();
            }
          }
        }
      };
    };

    /* 执行合并 */
    thiz.fn.combine();
    
    /* 执行图例 */
    thiz.fn.legend();
    
    /* 执行显示判断 */
    thiz.fn.showornot();
    
    /* 钻取检测 */
    thiz.fn.drillBtn();
    
    /* 数据异常回钻 */
    thiz.fn.drillback = thiz.fn.drillbackcount();
  }

  /* 直角基类 */
  function DefaultXy(newType, modulemsg, modolmg) {
    var thiz = this, match;
    Base.call(thiz, newType, modulemsg, modolmg);

    thiz.fn.setxAxis = function (x) {
      thiz.fn.remxAxis();
      thiz.chartoption.xAxis = [];
      thiz.chartoption.xAxis[0] = x || {
        type: 'category',
        data: thiz.fn.getx()
      };
      console.log(thiz.chartoption.xAxis)
    };

    thiz.fn.remxAxis = function () {
      delete thiz.chartoption.xAxis;
    };

    thiz.fn.setyAxis = function (y) {
      thiz.fn.remyAxis();
      thiz.chartoption.yAxis = [];
      thiz.chartoption.yAxis[0] = y || {
        type: 'category',
        data: thiz.fn.getx()
      };
    };

    thiz.fn.remyAxis = function () {
      delete thiz.chartoption.yAxis;
    };

    /* 各种类型的直角系 */
    thiz.fn.line = function (typeinner) {
      var innerseries, data;
      innerseries = thiz.fn.common(typeinner);

      var xAxis, yAxis;
      xAxis = thiz.chartoption.xAxis;
      yAxis = thiz.chartoption.yAxis;

      if (!yAxis || !xAxis) {
        thiz.fn.setxAxis();  //设定x轴
        thiz.fn.setyAxis({
          type: 'value'
        }); //设定y轴
      }

      innerseries.type = 'line';
      innerseries.z = 10;
      innerseries.zlevel = 10;
      data = thiz.fn.typetodata(typeinner.en);
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });
      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.pie = function (typeinner) {
      var innerseries, data, x;
      x = thiz.fn.getx();
      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'pie';
      data = thiz.fn.typetodata(typeinner.en);
      data.forEach(function (num, index) {
        innerseries.data.push({
          value: num,
          name: x[index]
        });
      });

      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.bar = function (typeinner) {
      var innerseries, data, y;
      y = {
        type: 'value'
      };

      thiz.fn.setxAxis();  //设定x轴
      thiz.fn.setyAxis(y); //设定y轴

      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'bar';
      data = thiz.fn.typetodata(typeinner.en);
      
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });

      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.column = function (typeinner) {
      var innerseries, data, x;
      x = {
        type: 'value'
      };

      thiz.fn.setxAxis(x);  //设定x轴
      thiz.fn.setyAxis(); //设定y轴

      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'bar';
      data = thiz.fn.typetodata(typeinner.en);
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });

      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.stagecolumn = function (typeinner) {
      var innerseries, data, x;
      x = {
        type: 'value'
      };

      thiz.fn.setxAxis(x);  //设定x轴
      thiz.fn.setyAxis(); //设定y轴

      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'bar';
      innerseries.stack = '堆叠'; //堆叠关键属性
      data = thiz.fn.typetodata(typeinner.en);
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });

      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.stagebar = function (typeinner) {
      var innerseries, data, y;
      y = {
        type: 'value'
      };

      thiz.fn.setxAxis();  //设定x轴
      thiz.fn.setyAxis(y); //设定y轴

      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'bar';
      innerseries.stack = '堆叠'; //堆叠关键属性
      data = thiz.fn.typetodata(typeinner.en);
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });

      thiz.chartoption.series.push(innerseries);
    };

    thiz.fn.arealine = function (typeinner) {
      var innerseries, data;
      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'line';
      innerseries.smooth = true;
      innerseries.itemStyle = {normal: {areaStyle: {type: 'default'}}}; //面积图关键属性
      data = thiz.fn.typetodata(typeinner.en);
      
      data.forEach(function (num, index) {
        innerseries.data[index] = num;
      });

      thiz.chartoption.series.push(innerseries);
    };
    
    /* 饼位置处理 */
    thiz.fn.pies = function(){
      
      function Location(flag,pies){
        if(flag){
          switch(pies.length){
            case 1:
              pies[0].radius = '20%';
              pies[0].center = ['20%','20%'];
              break;
            case 2:
              pies[0].radius = '20%';
              pies[0].center = ['20%','20%'];
              pies[1].radius = '20%';
              pies[1].center = ['50%','20%'];
              break;
            case 3:
              pies[0].radius = '20%';
              pies[0].center = ['20%','20%'];
              pies[1].radius = '20%';
              pies[1].center = ['50%','20%'];
              pies[2].radius = '20%';
              pies[2].center = ['80%','20%'];
              break;
          }
        }else{
          switch(pies.length){
            case 1:
              pies[0].radius = '55%';
              pies[0].center = ['50%','60%'];
              break;
            case 2:
              pies[0].radius = '40%';
              pies[0].center = ['25%','60%'];
              pies[1].radius = '40%';
              pies[1].center = ['75%','60%'];
              break;
            case 3:
              pies[0].radius = '20%';
              pies[0].center = ['20%','60%'];
              pies[1].radius = '20%';
              pies[1].center = ['50%','60%'];
              pies[2].radius = '20%';
              pies[2].center = ['80%','60%'];
              break;
          }
        }
      }
      
      var flag = false, pies = [], series;
      series = thiz.chartoption.series;
      series.forEach(function(inner,index){
        if(inner.type == 'pie') pies.push(inner);
        else flag = true;
      });
      Location(flag, pies);
    };

    match = {
      line: thiz.fn.line,
      pie: thiz.fn.pie,
      bar: thiz.fn.bar,
      column: thiz.fn.column,
      stagecolumn: thiz.fn.stagecolumn,
      stagebar: thiz.fn.stagebar,
      arealine: thiz.fn.arealine
    };

    thiz.fn.Init(match);
    
    thiz.fn.pies();
  }

  /* 雷达基类 */
  function DefaultRadar(newType, modulemsg, modolmg) {
    var thiz = this, match;
    Base.call(thiz, newType, modulemsg, modolmg);
    
    thiz.fn.getmax=function(value){
      var max;
      var maxvalue=value[0];
      var len = value.length; 
       for (var i = 1; i < len; i++){   
        if (value[i] > maxvalue) {      
         maxvalue = value[i];   
        } 
       }  
     max=Number(maxvalue);
   
      return max;
    }

    thiz.fn.setpolar = function () {
      var x = thiz.fn.getx();
      thiz.fn.rempolar();
      thiz.chartoption.polar = [{
        indicator: []
      }];
      var type = thiz.chartdata.type,data
      x.forEach(function(name){
          thiz.chartoption.polar[0].indicator.push({
          text:name
        });
        })
        
      type.forEach(function(tinner,num){
        data=thiz.fn.typetodata(tinner.en);
        thiz.chartoption.polar[0].indicator.forEach(function(v){
          v.max=thiz.fn.getmax(data);
        })
        console.log('maxdata:',data);
      })
    };

    thiz.fn.rempolar = function () {
      delete thiz.chartoption.polar;
    };

    thiz.fn.defaultR = function (typeinner) {
      thiz.fn.setpolar(); 
      var innerseries, data;
      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'radar';
      data = thiz.fn.typetodata(typeinner.en);
      innerseries.data.push({
        value: data,
        name: innerseries.cn
      });
      thiz.chartoption.series.push(innerseries);
      zy.log(thiz.chartoption);
      window.ss=thiz.chartoption
    };

    match = {
      radar: thiz.fn.defaultR
    };

    thiz.fn.Init(match);
  }

  /* 散点基类 */
  function DefaultScatter(newType, modulemsg, modolmg) {
    var thiz = this, match;
    // zy.log('newType=',newType);
    // zy.log('modulemsg=',modulemsg);
    // zy.log('modolmg=',modolmg);
    Base.call(thiz, newType, modulemsg, modolmg);

    thiz.fn.setxAxis = function () {
      thiz.fn.remxAxis();
      thiz.chartoption.xAxis = [{
        type: 'value',
        scale: true
      }];
    };

    thiz.fn.remxAxis = function () {
      delete thiz.chartoption.xAxis;
    };
    
    thiz.fn.setdataZoom = function () {
      thiz.fn.remdataZoom();
      thiz.chartoption.dataZoom =  {
        show: true,
        start : 30,
        end : 40
      };
    };

    thiz.fn.remdataZoom = function () {
      delete thiz.chartoption.dataZoom;
    };

    thiz.fn.setyAxis = function () {
      thiz.fn.remyAxis();
      thiz.chartoption.yAxis = [{
        type: 'value',
        scale: true
      }];
    };

    thiz.fn.remyAxis = function () {
      delete thiz.chartoption.yAxis;
    };

    // 默认处理
    thiz.fn.defaultS = function (typeinner, typeindex) {
      thiz.fn.setxAxis(); //添加X轴
      thiz.fn.setyAxis(); //添加Y轴
      thiz.fn.setdataZoom(); //添加缩放轴

      var innerseries, data;
      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'scatter';
      data = thiz.fn.typetodata(typeinner.en); //
      
      thiz.fn.drillback(innerseries, data, function(){
        
        // zy.log('innerseries=',innerseries);
        // zy.log('data=',data);
        data.forEach(function (datastr) {
          innerseries.data.push(datastr.split(','));
        });
  
        thiz.chartoption.series.push(innerseries);
        zy.log(thiz.chartoption);
      });
    };
    
    //对结果集自行处理
    thiz.fn.customS = function (typeinner, typeindex) {
      thiz.fn.setxAxis(); //添加X轴
      thiz.fn.setyAxis(); //添加Y轴
      thiz.fn.setdataZoom(); //添加缩放轴
      thiz.chartoption.legend.data = [];  //清空图例
      
      var innerseries;
      innerseries = thiz.fn.common(typeinner);
      innerseries.type = 'scatter';
      
      var _isBubble = false;  //气泡数据
      if(thiz.chartdata.type[typeindex+2]){
        var type1 = thiz.chartdata.type[typeindex+1]; //数组第一个元素
        var type2 = thiz.chartdata.type[typeindex+2]; //数组第二个元素
        var type3; //数组第三个元素
        
        if(thiz.chartdata.type[typeindex+3]){
          _isBubble = true;
          type3 = thiz.chartdata.type[typeindex+3]; //数组第三个元素
        }
        //循环数据结果集
        thiz.chartdata.data.forEach(function(inner, index){
          var _nameExist = false; //指标是否存在
          var _refIndex;
          thiz.chartoption.series.forEach(function(_inner, _index){
            if(_inner.name == inner[typeinner.en]){
              _nameExist = true;
              _refIndex = _index;
            }
          });
          if(_nameExist){
            if(type3){
              thiz.chartoption.series[_refIndex].data.push([inner[type1.en], inner[type2.en], inner[type3.en]]);
            }else{
              thiz.chartoption.series[_refIndex].data.push([inner[type1.en], inner[type2.en]]);
            }
          }else{
            innerseries.name = inner[typeinner.en];
            var tmp = $.extend(true,{},innerseries);
            if(type3){
              tmp.data.push([inner[type1.en], inner[type2.en], inner[type3.en]]);
            }else{
              tmp.data.push([inner[type1.en], inner[type2.en]]);
            }
            
            thiz.chartoption.series.push(tmp);  //series
            thiz.chartoption.legend.data.push(tmp.name);  //legend
          }
        });
      }else{
        zy.extend.msg(' 返回不正确的数据格式','w');
        return false;
      }
    };

    //路由 — 使用defaultS 或 customS
    thiz.fn.routeS = function (typeinner, typeindex) {
      var isCustom = false;
      var _data = thiz.fn.typetodata(typeinner.en);
      //检查是否是以逗号分隔的数据格式
      _data.forEach(function(point, index){
        if(point.trim() === ""){
          return false;
        }
        var len = String(point).split(',').length;
        if(len != 2 && len != 3){
          isCustom = true;
          return true;
        }
      });
      if(isCustom){
        thiz.fn.customS(typeinner, typeindex);
      }else{
        thiz.fn.defaultS(typeinner, typeindex);
      }
    };
    match = {
      scatter: thiz.fn.routeS
    };

    thiz.fn.Init(match);
  }

  /* 仪表盘基类 */
  function DefaultGauge(newType, modulemsg, modolmg) {
    var thiz = this, match;

    Base.call(thiz, newType, modulemsg, modolmg);
    
    delete thiz.chartoption.legend;
    delete thiz.chartoption.toolbox;

    thiz.fn.settooltip = function () {
      thiz.fn.remtooltip();
      thiz.tooltip = {};
    };

    thiz.fn.remtooltip = function () {
      delete thiz.tooltip;
    };

    thiz.fn.defaultG = function (typeinner) {

      thiz.fn.settooltip();//添加tooltip

      var innerseries, data;
      innerseries = thiz.fn.common(typeinner);
      data = thiz.fn.typetodata(typeinner.en);
      innerseries.type = 'gauge';
      innerseries.data.push({
        value: data[0],
        name: innerseries.cn
      });

      thiz.chartoption.series.push(innerseries);
      zy.log(thiz.chartoption);
    };

    match = {
      gauge: thiz.fn.defaultG
    };

    thiz.fn.Init(match);
  }

  /* 分类函数 */
  function CheckClass(newType, modulemsg, modolmg) {
    var flg, basetype, innertype, option;
    basetype = newType.type[0].chart ? newType.type[0].chart.split(',')[0] : null;
    nexttype = newType.type[1] ? (newType.type[1].dicttype ? newType.type[1].dicttype : newType.type[1].chart.split(',')[0]) : null;
    if (basetype) {
      if (match[basetype]) {
        option = new match[basetype](newType, modulemsg, modolmg); //处理散点 or 仪表盘
      }
    } else {
      if (match[nexttype]) {
        option = new match[nexttype](newType, modulemsg, modolmg);//处理直角 or 雷达
      }
    }
    return option;
  }
  
  /* 数据格式检测 */
  function DataTypeCheck(inner, data){
    
    console.log(inner, data);
    
    var match, type, flag = false;
    
    type = inner.type;
    
    /* 状态机 */
    match = {
      line: Default,
      pie: Default,
      bar: Default,
      gauge: Default,
      radar: Default,
      scatter: Scatter
    };
    
    function Default(){ //默认数据结构检测
      data.forEach(function(point, index){
        data[index] = Number(point);
        if(data[index] != data[index]){ //NaN != NaN 
          flag = true; 
        }
      });
    }
    
    function Scatter(){ //散点数据结构检测
      data.forEach(function(point, index){
        if(point.trim() === ""){
          return false;
        }
        var len = String(point).split(',').length;
        if(len != 2 && len != 3){
          flag = true;
        }
      });
    }
    
    if(match[type]) match[type]();
    if(flag) zy.extend.msg(inner.cn + ' 返回不正确的数据格式','w');
    return flag;
  }

  /* Echarts 构造 也可用于内部重构 */
  function Echart(newType, modulemsg, modolmg) {
    
    var chart, option,searchfield;
    chart = echarts.init(con[0], 'macarons');
    option = CheckClass(newType, modulemsg, modolmg);
    searchfield=$('#simple_ele');
    if(option){
    }else{
      zy.ui.msg('提示信息：','模型无图表类型信息！','w');
      return;
    }
    console.log("option")
    console.log(JSON.stringify(option.chartoption));
    
    //  2017.1.3 修改（echart因无类目出现程序错误）改为（生成错误提示信息） start
    option.chartoption.series.forEach(function(inner){
      if(inner.data.length > 1){
        axisDataFlag = 0;
      }
    });
    if(axisDataFlag === 0) {
      // 判断x是否为类目轴
      option.chartoption.xAxis.forEach(function(inner){
        if(!inner.type || inner.type == 'category'){
          axisMsg(inner);
          return
        }
      });
      // 判断y轴是否为类目轴
      option.chartoption.yAxis.forEach(function(inner){
        if(inner.type == 'category'){
          axisMsg(inner);
          return
        }
      });
    }
    // 类目轴的data数组为空则提示信息
    function axisMsg(inner) {
      if (inner.data.length > 1){
      }else{
        zy.ui.msg('提示信息：','模型无类目信息！','w');
        option.chartoption.series.forEach(function(inner){
          inner.data = [];
        });
      }
    }
    // end
    
    // zy.log('chart option=',option);
    chart.setOption(option.chartoption);
    con.unbind('resize').resize(function () {
      chart.resize();
    });

    window.ww = chart;

    if(module){
      chart.on('click', function (param) {
        console.log(param);
        var index, series;
        index = param.seriesIndex;
        series = option.chartoption.series[index];
        if(series.next && series.next != 'undefined'){
          var o = {
            modid: series.next,
            searchparam: {}
          };

          o.searchparam[series.en] = param.value;
          if(!option.chartdata.type[0].chart){
            o.searchparam[option.chartdata.type[0].en] = param.name;
            if(searchfield.length>0){
              o.searchparam[$($('#simple_ele').children().children()[1]).children().attr('name')]=$($('#simple_ele').children().children()[1]).children().val()
            }

          }
          console.log('before o',o)
          module.fn.DrillDown(o);
        }
      });

      module.fn.SetSelf({
        chart: option
      });
    }
  }

  return Echart(newType, modulemsg, modolmg);
}

// })(jQuery);