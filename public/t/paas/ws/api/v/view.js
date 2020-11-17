/* Create By xBoson System */
// 数据字典一览
api_view = (function(){
  var _m = {param:"",pam:null}; //API请求参数
  var pt = api_view.prototype;
  pt.node=null; //tree节点数据

  // 表格元素对象
  var v_tb = $('#ws_api_v_view_tb');
  
  // 构造方法
  // 参数 node
  function api_view(node){
    pt.node=node;
    Init();
  }
  
  // 初始化
  function Init(){
    _m.path = {
      method: "GET",
      host: zy.g.host.api,
      auth: "app",
      org: "/"+zy.g.comm.org,
      api: '/'+pt.node.uri,
      sys: "?s=d&ems=ems"
    };
    zy.cache.initDicts("ZR.0052,ZR.0053", ViewInit);
  }
  
  // 画面 init
  function ViewInit(){
    $('#ws_api_v_view_apinm').html(' '+pt.node.apinm+'【'+pt.node.id+'】');
    $('#ws_api_v_view_sta').html(pt.node.sta);
    $('#ws_api_v_view_uri').val(pt.FullUrl());
    $('#ws_api_v_view_cdt').html(pt.node.createdt);
    $('#ws_api_v_view_udt').html(pt.node.updatedt);

    // 获取API帮助信息
    _m.appid=pt.node.aid;
    _m.moduleid=pt.node.pid;
    _m.apiid=pt.node.id;

    zy.extend.get({
      app: 'apils',
      mod: 'apihelp',
      apinm: 'getapiinfo'
    }, function (msg) {
      // API 帮助信息
      if (msg.result[0].help_info){
        var _h = JSON.parse(msg.result[0].help_info);
        // $('#ws_api_v_view_classify').html(_h.api_classify?_h.api_classify:'API');
        $('#ws_api_v_view_classify').html(_h.api_classify?zy.cache.cd2name("ZR.0053", _h.api_classify):'API');
        $('#ws_api_v_view_desc').append(_h.api_desc?_h.api_desc:'');
        $('#ws_api_v_view_requests').html(_h.requests?_h.requests+' <span class="caret"></span>':'GET <span class="caret"></span>');
        if(_h.requests)
          _m.path.method =_h.requests;
        // 参数列表项
        if(_h.param) {
          _m.help_info = msg.result[0].help_info;
          _m.pam = _h.param;
          pt.DataTable(_m.pam);
          // 获取完整URL
          $('#ws_api_v_view_uri').val(pt.FullUrl(_m.pam));
        }
      } else {}
    },_m);
  }
  
  /**
   * API 参数列表项【表格加载】
   * @method DataTable
   * @param {Object} data 数据对象
   */
  pt.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "key"
      },
      {
        "data": null//function(data,type,row,meta) {return zy.cache.cd2name("mdm001", row.operation_type);}
      },
      {
        "data": "value"
      }, 
      {
        "data": "desc"
      },
    ];
    //预设初始化参数
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    v_tb.dataTable(options);
  };

  // 请求方式选择
  $('.request-method-update a').click(function () {
    var selText = $(this).text();
    var $this = $(this);
    $('#ws_api_v_view_requests').html(selText + ' <span class="caret"></span>');
    if ("GET"===selText.trim()){
      _m.path.method = selText.trim();
      $('#ws_api_v_view_uri').val(pt.FullUrl(_m.pam));
    }else{
      _m.path.method = selText.trim();
      $('#ws_api_v_view_uri').val(pt.FullUrl(null));
    }
    $this.parents('.dropdown-menu').find('li').removeClass('active');
    $this.parent().addClass('active');
	});

  // 访问模式选择
  $('.auth-method-update a').click(function () {
    var selText = $(this).html();
    var $this = $(this);
    $('#ws_api_v_view_auth').html($this.html() + ' <span class="caret"></span>');
    if (selText.indexOf('fa-eye-slash') >= 0){
      _m.path.auth = "openapp";
    }else{
      _m.path.auth = "app";
    }
    $('#ws_api_v_view_uri').val(pt.FullUrl(_m.pam));
    $this.parents('.dropdown-menu').find('li').removeClass('active');
    $this.parent().addClass('active');
	});

  $('#ws_api_v_view_test').click(function () {
    zy.net.loadHTML('ws/api/v/run.html',$('#ws_api_v_test_modal'),function(r){
      // JYM: 缓存api测试页, 使之打开更快
      // _m.ide_run_html_cache = r;
      // 打开测试页
      RunApi(_m, _m.help_info);
    });
    // $('#ws_api_v_modal').html(_m.ide_run_html_cache);
  });

  /**
   * 获取 API 完整URL
   * @method FullUrl
   * @param {Object} pam GET参数对象
   * @return {String} url 路径
   */
  pt.FullUrl = function(pam) {
    _m.url=_m.path.host+_m.path.auth+_m.path.org;
// zy.log("_m.url==="+_m.url);
    // get
    if(_m.path.method ==='GET'){
      if(!pam){
        _m.fullurl = _m.url+_m.path.api+_m.path.sys+_m.param;
        return _m.fullurl;
      }
      var tt = [];
      _m.pam=pam;
      $.each(pam,function(i,v){
        var _tmp = [v.key,encodeURIComponent(v.value)];
        tt.push(_tmp.join('='));
      });
      _m.param='&'+tt.join('&');
// zy.log("_m.param==="+_m.param);
      _m.fullurl = _m.url+_m.path.api+_m.path.sys+_m.param;
    }else{ //post等
      _m.fullurl = _m.url+_m.path.api+_m.path.sys;
    }
    return _m.fullurl;
  };
  return api_view;
})();