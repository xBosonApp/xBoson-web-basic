/* Create By xBoson System */
// api_view
api_view = (function(){
  var _m = {};
  var pt = api_view.prototype;

  // 画面元素对象
  var $run_param = $('#ws_api_m_api_param'),
      v_requests = $('#ws_api_v_view_requests'),
      v_url = $('#ws_api_v_view_url');
  
  // 构造方法
  // 参数 node tree节点数据
  function api_view(node){
    pt.node=node;
    DataInit();
    Init();
  }
  // 初始化 数据
  function DataInit(){
    // API基本信息
    _m={
      prjid: pt.node.prjid, //项目id
      appid: pt.node.aid, //appid
      moduleid: pt.node.pid,
      apiid: pt.node.id,
      apinm: pt.node.apinm,
      stability: pt.node.stability, //api标记
      sta: pt.node.sta, //api标记名（开发/发布）
      optype: pt.node.optype,
      status: pt.node.status,
      uri: pt.node.uri,
      param:"",pam:null,pams:{}
    };
    // API 帮助信息
    _m.help_info={
      requests: "01",
      methodid: "01",
      methodnm: "GET",
      api_classify: "api",
      ver: "1.0",
      api_desc: '',
    };
    // apigongneng信息
    pt.api_desc='';

    // API URL 相关路径参数
    _m.path = {
      host: zy.g.host.api,
      auth: "app",
      org: "/"+zy.g.comm.org,
      api: '/'+pt.node.uri,
      sys: "?s=d&ems=ems"
    };
  }

  // 初始化 UI
  function Init(){
    zy.cache.initDicts("ZR.0052,ZR.0053", ParamInit);
  }
  
  // 画面 init
  function ViewInit(){
    $('#ws_api_v_view_apinm').html(' '+_m.apinm+'【'+_m.apiid+'】');
zy.log('_m.help_info.var111==='+_m.help_info.ver);
    $('#ws_api_v_view_ver').html('v'+_m.help_info.ver);
    $('#ws_api_v_view_sta').html(_m.sta);
    v_url.val(pt.FullUrl(null));
    $('#ws_api_v_view_cdt').html(pt.node.createdt);
    $('#ws_api_v_view_udt').html(pt.node.updatedt);
    $('#ws_api_v_view_classify').html(zy.cache.cd2name("ZR.0053", _m.help_info.api_classify));

    // 获取API帮助信息
    zy.extend.get({
      app: 'apils',
      mod: 'apihelp',
      apinm: 'getapiinfo'
    }, function (msg) {
      // API 帮助信息
      if (msg.result[0].help_info){
        var _h = JSON.parse(msg.result[0].help_info);
        _m.help_info_obj=_h;
        if(_h.requests) _m.help_info.requests=_h.requests;
        if(_h.methodid) _m.help_info.methodid=_h.methodid;
        if(_h.methodnm) _m.help_info.methodnm=_h.methodnm;
        if(_h.api_classify) _m.help_info.api_classify=_h.api_classify;
        if(_h.ver) _m.help_info.ver=_h.ver;
        if(_h.api_desc) _m.help_info.api_desc=_h.api_desc;
        if(_h.result) _m.help_info.result=_h.result;
        if(_h.header) _m.help_info.header=_h.header;

        $('#ws_api_v_view_classify').html(zy.cache.cd2name("ZR.0053", _m.help_info.api_classify));
        $('#ws_api_v_view_ver').html('v'+_m.help_info.ver);
        $('#ws_api_v_view_desc').append(_m.help_info.api_desc);
        // API返回数据JSON内容
        jsoneditorInit(_m.help_info.result);
        _m.jsonEditorHeader = jsoneditorInit1('ws_api_v_view_jsoneditor_header',_m.help_info.header);
         // 参数列表项
        if(_h.param) {
          _m.pam = _h.param;
          jsonToform(_m.pam);
          // 获取完整URL
          v_url.val(pt.FullUrl(_m.pam));
        }
        MethodInit({id:_m.help_info.methodid,name:_m.help_info.methodnm});
      } else {
        jsoneditorInit(null);
        _m.jsonEditorHeader = jsoneditorInit1('ws_api_v_view_jsoneditor_header',null);
      }
      //事件绑定
      pt.Events.descBtn();
      pt.Events.classifyBtn();
      pt.Events.methodBtn();
      pt.Events.authBtn();
      pt.Events.testBtn();
      pt.Events.saveBtn();
    },{appid:_m.appid,moduleid:_m.moduleid,apiid:_m.apiid});
  }

  //param 画面元素初始化（请求参数画面元素）
  function ParamInit(){
    loadScript("lib/js/plugin/x-editable/moment.min.js", loadMockJax);
    function loadMockJax() {
      loadScript("lib/js/plugin/x-editable/jquery.mockjax.min.js", loadXeditable);
    }
    function loadXeditable() {
      loadScript("lib/js/plugin/x-editable/x-editable-new.min-n.js", loadTypeHead);
    }
    function loadTypeHead() {
      loadScript("lib/js/plugin/typeahead/typeahead.bundle.min.js", function(){
        $('#ws_api_m_api_param_addkey').click(function () {
          newlabel();
        });
        MethodInit();
        ViewInit();
      });
    }
  }
  //Method 画面元素初始化（请求模式）
  function MethodInit(_method){
    if (!_method) {
      _m.help_info.methodid ='01';
      v_requests.data("id",_m.help_info.methodid);
      v_requests.html(_m.help_info.methodnm+' <span class="caret"></span>');
      var list=zy.cache.getDict("ZR.0052");
      var txtColor={
        '01':'txt-color-green',
        '02':'txt-color-red',
        '03':'txt-color-yellow',
        '04':'txt-color-blue',
        '05':'txt-color-red',
        '06':'txt-color-pink',
        '07':'txt-color-yellow',
        '08':'txt-color-orange',
        '09':'txt-color-orange',
        '10':'txt-color-orange',
      };
      for (var i in list) {
        if (list[i].id === v_requests.data())
          $('.request-method-update').append('<li class="active"><a href="javascript:void(0);" data-id="'+list[i].id+'"><i class="fa fa-circle '+txtColor[list[i].id]+'"></i> '+list[i].name+'</a></li>');
        else
          $('.request-method-update').append('<li><a href="javascript:void(0);" data-id="'+list[i].id+'"><i class="fa fa-circle '+txtColor[list[i].id]+'"></i> '+list[i].name+'</a></li>');
      }
    } else {
        _m.help_info.methodid = _method.id;
        _m.help_info.methodnm = _method.name;
        v_requests.data("id",_m.help_info.methodid);
        v_requests.html(_m.help_info.methodnm + ' <span class="caret"></span>');
        if("01"===_m.help_info.methodid){ // GET
          UpPm();
        }else{
          v_url.val(pt.FullUrl(null));
        }
        $('request-method-update').find('li').removeClass('active');
    }
  }

  // 添加参数
  function newlabel(_row) {
    var row = _row || {key:'',desc:'',value:''};
    var rk = Random();
      // 参数名
      function createkey(c){
        var $section = $('<section>').addClass('col-sm-2');
        var $label = $('<label>').addClass('ainput').html('参数名称：');
        var $a =$(' <a href="form-x-editable.html#" class="editable editable-click" name="key" data-type="text" data-pk="1" data-placement="right" data-placeholder="Required"></a> ');
        $section.append($label).append($a);
        $a.html(row.key);
        $a.editable({
          validate: function (value) {
            if ($.trim(value) === '') return 'This field is required';
          },
          display:function(value){
            $(this).html(value);
          }
        });
        $a.on('save', function(e, params) {
          var i=$(this).parents("div").data('id');
          _m.pams[i].key=params.newValue;
          UpPm();
        });
        c.append($section);
        return $a.html();
      }
      // 参数描述
      function createdesc(c){
        var $section= $('<section>').addClass('col-sm-5');
        var $label = $('<label>').addClass('ainput').html('描述：');
        var $a = $(' <a href="form-x-editable.html#" class="editable editable-click" name="desc" data-type="textarea" data-pk="1" data-placeholder="Your comments here..."></a> ');
        $section.append($label).append($a);
        $a.html(row.desc);
        $a.editable({showbuttons:'bottom'});
        $a.on('save', function(e, params) {
          var i=$(this).parents("div").data('id');
          _m.pams[i].desc=params.newValue;
        });
        c.append($section);
        return $a.html();
      }
      // 参数值
      function createvalue(c){
        var $section = $('<section>').addClass('col-sm-4');
        var $label = $('<label>').addClass('ainput').html('值：');
        var $a =$(' <a href="form-x-editable.html#" class="editable editable-click" name="value" data-type="text" data-pk="1" data-placement="right" data-placeholder="Required"></a> ');
        $section.append($label).append($a);
        $a.html(row.value);
        $a.editable({
          validate: function (value) {
            if ($.trim(value)==='') return 'This field is required';
          },
          display:function(value){
            $(this).html(value);
          },
        });
        $a.on('save', function(e, params) {
          var i=$(this).parents("div").data('id');
          _m.pams[i].value=params.newValue;
          UpPm();
        });
        c.append($section);
        return $a.html();
      }

    var $h4='<h4><i name="removekey" class="fa fa-fw fa-times-circle txt-color-red" style="display:none"></i></h4>';
    var $_c = $('<div data-id="'+rk+'">').addClass('row');
    $run_param.append($_c);
    $run_param.append('<hr class="simple">');
    // 创建参数画面元素
    var rowdata={};
    rowdata.key=createkey($_c);
    rowdata.value=createvalue($_c);
    rowdata.desc=createdesc($_c);
    _m.pams[rk] = rowdata;
    UpPm();

    $_c.append($h4);
    $_c.mouseover(function(){
      $($(this).find('[name=removekey]')).attr('style','cursor:pointer');
      $_c.find('i').click(function () {
        //$url.trigger('_param');
        var $target = $(this).closest('div');
        var k = $target.data('id');
        delete _m.pams[k];
        $target.remove();
        UpPm();
      });
    });
    $_c.mouseout(function(){
      $run_param.find('[name=removekey]').attr('style','display:none');
    });
  }
  // 参数赋值
  function jsonToform(_pm){
    $.each(_pm,function(i,v){
      newlabel(v);
    });
  }

  //JsonEditor初始化,可以两种只读模式切换
  function jsoneditorInit(_json){
    var container = document.getElementById('ws_api_v_view_jsoneditor');
    var options = {
      mode: 'tree',
      modes: ['code','tree','preview'], //['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
      onError: function (err) {
        alert(err.toString());
      }
    };
    _m.jsonEditor = new JSONEditor(container, options, _json); 
  }

  /**
    * JsonEditor初始化,可以多种只读模式切换
    * @property {String} _id 元素id
    * @property {Object} _json 对象 
    */
  function jsoneditorInit1(_id,_json){
    var container = document.getElementById(_id);
    var options = {
      mode: 'tree',
      modes: ['code','tree','preview'], //['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
      onError: function (err) {
        zy.ui.msg('错误', err.toString(), 'e');
      }
    };
    return new JSONEditor(container, options, _json); 
  }

  /**
    * 事件绑定规则定义
    * @property Events
    */
  pt.Events = {
    // API功能描述
    descBtn: function(){
      $('#ws_api_v_view_desc').click(function () {
        zy.net.loadHTML('ws/api/m/api_desc.html',$('#ws_api_v_pagination'),function(r){
          // 打开编辑画面
          ApiDesc(_m.help_info.api_desc, function (_desc) {
            _m.help_info.api_desc = _desc;
            $('#ws_api_v_view_desc').html('<i class="fa fa-pencil-square-o fa-fw"></i>描述：'+_desc);
          });
        });
      });
    },
    // 服务分类选择：API、download、upload
    classifyBtn: function(){
      $('.alert-heading').on('click','#ws_api_v_view_classify_btn',function(e){
        _m.help_info.api_classify=$("input[name='ws_api_v_view_classify']:checked").val();
        $('#ws_api_v_view_classify').html(zy.cache.cd2name("ZR.0053", _m.help_info.api_classify));
        $('.popover-classify').popover('toggle');
    	});
    },
    //请求方式选择
    methodBtn: function(){
      // 请求方式选择
      $('.request-method-update a').click(function () {
        var $this = $(this);
        var selId = $this.data("id");
        var selText = $this.text();
        MethodInit({id:selId,name:selText});
        $this.parents('.dropdown-menu').find('li').removeClass('active');
        $this.parent().addClass('active');
    	});
    },
    authBtn: function(){
      // 访问授权模式选择
      $('.auth-method-update a').click(function () {
        var selText = $(this).html();
        var $this = $(this);
        $('#ws_api_v_view_auth').html($this.html() + ' <span class="caret"></span>');
        if (selText.indexOf('fa-eye-slash') >= 0){
          _m.path.auth = "openapp";
        }else{
          _m.path.auth = "app";
        }
        UpPm();
        $this.parents('.dropdown-menu').find('li').removeClass('active');
        $this.parent().addClass('active');
    	});
    },
    testBtn: function(){
      $('#ws_api_v_view_test').click(function () {
        var url = v_url.val();
        var param = {};
        if(_m.help_info.methodid!='01'){
          $.each(_m.pams,function(i,v){
            param[v.key] = v.value;
          });
        }
        Ajax(url,param);
      });
    },
    //保存API信息
    saveBtn: function(){
      $('button[name=ws_api_m_api_info_save]').click(function () {
    		$.smallBox({
    			title : "保存确认!",
    			content : "是否确认保存? <p class='text-align-right'><a href='javascript:void(0);' onclick='api_viewObj.YesAnswer();' class='btn btn-primary btn-sm'>　是　</a> <a href='javascript:void(0);' class='btn btn-danger btn-sm'>　否　</a></p>",
    			color : "#296191",
    			//timeout: 8000,
    			icon : "fa fa-bell swing animated"
    		});
      });
    },
  };

  // 确认保存
  pt.YesAnswer = function(){
        var _tools = {
          // 调api
          _api : function(_param, _success, _nodata_cb) {
            var _cb = function(msg) {
              if (msg) {
                _success && _success(msg);
              } else {
                _nodata_cb && _nodata_cb(msg);
              }
            }
            zy.g.am.app = 'apils';
            zy.g.am.mod = 'apihelp';
            // zy.g.am.api = 'apiinfo';
            zy.net.post('ide/apiinfo', _cb, _param);
          }
        }
        var _pm = {
          type: '1', //更新操作
          prjid:_m.prjid,
          appid:_m.appid,
          moduleid:_m.moduleid,
          apiid:_m.apiid,
          apinm:_m.apinm,
          op_type:_m.optype,
          status:_m.status,
        };

        var _prm=[]; 
        $.each(_m.pams,function(i,v){
          _prm.push(v);
        });
        _pm.help_info=_m.help_info;
        _pm.help_info.requests=_m.help_info.methodid;
        _pm.help_info.result=_m.jsonEditor.get()?_m.jsonEditor.get():{};
        _pm.help_info.param=_prm;
        delete _pm.help_info.url;//废弃
        _pm.help_info=JSON.stringify(_pm.help_info);
 zy.log('saveBtn._pm===='+JSON.stringify(_pm));
        _tools._api(_pm, function(msg) {
          zy.ui.msg('提示信息', '成功', 's');
        });
  }
  /**
   * 运行API
   * @method Ajax
   * @param {String} url 请求地址
   * @param {Object} param 参数对象
   */
  function Ajax(url,param){
    function showResult(msg){
      if (typeof msg == 'string') {
        msg = JSON.parse(msg);
      }
      msg = zy.fix_xboson_data(msg);
      if (msg.datatype && msg.datatype.indexOf("stack_trace_element") >= 0) {
        var content = '<pre style="background-color:#8a3737; color:#eee; border:0; word-wrap: break-word; white-space: pre-wrap;">' + msg.data +'</pre>'
          $.smallBox({
            title: "Stack Trace",
            content: content,
            color: "#8a3737",
            timeout: 50000,
            icon: "fa fa-frown-o bounce animated"
          });
      }
      zy.ui.msg('提示信息', 'API请求成功', 's');
      _m.jsonEditor.set(msg);
    }
    if('01'===_m.help_info.methodid){
      $.get(url,param,function(msg){
        showResult(msg);
      });
    }else{
      $.post(url,param,function(msg) {
        showResult(msg);
      });
    }
  }

  // 更新请求参数
  function UpPm(){
    var _pm=[]; //{"key":"id","desc":"查询用id","value":"apihelp"}
    $.each(_m.pams,function(i,v){
      _pm.push(v);
    });
    v_url.val(pt.FullUrl(_pm));
  }
  /**
   * 获取 API 完整URL
   * @method FullUrl
   * @param {Object} pam GET参数对象
   * @return {String} url 路径
   */
  pt.FullUrl = function(pam) {
zy.log("pt.FullUrl(pam)==="+JSON.stringify(pam));
    _m.url=_m.path.host+_m.path.auth+_m.path.org;
    // method=GET
    if('01'===_m.help_info.methodid){
      if(!pam){
        _m.fullurl = _m.url+_m.path.api+_m.path.sys+_m.param;
        return _m.fullurl;
      }
      var tt = [];
      // _m.pam=pam;
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
  // 随机数，用于设置画面动态元素ID
  function Random(){
    return Math.round(Math.random() * 1000000);
  }
  return api_view;
})();