var api_help = (function(){
  function _init(apiinfo,helpcontainer){
    var modal = $('#api_assist');
    var url = null;
    var rowList = {};
    try{
      app.load();
      app.resize();
    } catch(e) { }

    loadScript("lib/js/plugin/x-editable/moment.min.js", loadMockJax);
  function loadMockJax() {
    loadScript("lib/js/plugin/x-editable/jquery.mockjax.min.js", loadXeditable);
  }
  function loadXeditable() {
    loadScript("lib/js/plugin/x-editable/x-editable-new.min-n.js", loadTypeHead);
  }
  function loadTypeHead() {
    loadScript("lib/js/plugin/typeahead/typeahead.bundle.min.js", loadTypeaheadjs);
  }
  function loadTypeaheadjs() {
    loadScript("lib/js/plugin/typeahead/typeaheadjs.min.js", function(){
      url = urlClass();
      init(function(){
        var data=helpcontainer.val();
        if(data!==''){
          jsonToform(JSON.parse(data));
        }
        modal.modal('show');
        url.trigger('_param');
      });
    });
  }

  function newlabel(row) {
    var row = row || {key:'',desc:'',value:''};
    var rk = Random();
    function createkey(c){
      var section = $('<section>').addClass('col-sm-3');
      var label = $('<label>').addClass('input').html('参数名称');
      var a =$(' <a href="form-x-editable.html#"  class="editable editable-click" name="key" data-type="text" data-pk="1" data-placement="right" data-placeholder="Required"></a> ');
      section.append(label).append(a);
      a.html(row.key);
      
      a.editable({
        validate: function (value) {
          if ($.trim(value) == '')
            return '参数key';
        },
        display:function(value){
          $(this).html(value);
          url.trigger('_param');
        }
      });
      c.append(section);
      return a;
    }

    function createdesc(c){
      var section= $('<section>').addClass('col-sm-4');
      var label = $('<label>').addClass('input').html('描述');
      var a = $(' <a href="form-x-editable.html#"  class="editable editable-click" name="desc" data-type="textarea" data-pk="1" data-placeholder="Your comments here..."></a> ');
      section.append(label).append(a);
      a.html(row.desc);
      a.editable({
        showbuttons: 'bottom'
      });
      c.append(section);
      return a;
    }

    function createvalue(c){
      var section = $('<section>').addClass('col-sm-3');
      var label = $('<label>').addClass('input').html('值');
      var a =$(' <a href="form-x-editable.html#"  class="editable editable-click" name="value" data-type="text" data-pk="1" data-placement="right" data-placeholder="Required"></a> ');
      section.append(label).append(a);
      a.html(row.value);
      a.editable({
        validate: function (value) {
          if ($.trim(value) == '')
            return '参数值';
        },
        display:function(value){
          $(this).html(value);
          url.trigger('_param');
        }
      });
      c.append(section);
      return a;
    }

    var h4='<h4><i name="removekey" class="fa fa-fw fa-times-circle txt-color-red" style="display:none"></i></h4>';
    var _c = $('<div>').addClass('row').attr('_index',rk);
    modal.find('#api_assist_2').append(_c);

    var rowdata={
      key:createkey(_c),
      desc:createdesc(_c),
      value:createvalue(_c)
    };

    rowList[rk] = _getrow;

    function _getrow(){
      var key= rowdata.key.html();
      var value=rowdata.value.html();
      return key+'='+value;
    }

    _c.append(h4);

    _c.mouseover(function(){
      $($(this).find('[name=removekey]')).attr('style','cursor:pointer');
      _c.find('i').click(function () {
        url.trigger('_param');
        var target = $(this).closest('div');
        var k = target.attr('_index');
        delete rowList[k];
        target.remove();
      });
    });
    _c.mouseout(function(){
      $('[name=removekey]').attr('style','display:none');
    });
  }

  function jsonToform(data){
    $.each(data,function(i,v){
       var t = modal.find('[name="' + i + '"]');
        t.val(v);
        if (t.hasClass('select2-offscreen'))
          t.select2('val', v);
    });
    modal.find('[name=apifl]').html(data.api_classify);
    // 17.1.12 add api_desc start
    if(data.api_desc){
      modal.find('[name=api_desc]').html(data.api_desc);
    }
    
    if(data.param.length>0){
      $.each(data.param,function(i,v){
        newlabel(v);
      });
    }
    
    if(data.result){
      // 17.2.6  修改关联页面时重复formatter出现 
      var editor = new jsoneditor.JSONEditor(modal.find('#jsoneditor').get(0), {})
      editor.set(data.result);
      if(modal.find('#jsonformatter .jsoneditor').length === 0){
        formatter = new jsoneditor.JSONFormatter(modal.find('#jsonformatter').get(0), {});
      }
      formatter.set(data.result);
    }
    if(data.url){
      modal.find('[name=url]').html(data.url);
    }
  }

  function init(_cb) {
    // 数据字典处理
    var cb = function () {
      // 字典数据绑定
      modal.find('[name=requests]').zySelect('ZR.0052', false, { width: '100%', allowClear: false });
      modal.find('[name=api_classify]').zySelect('ZR.0053', false, { width: '100%', allowClear: false });
      modal.find('[name=requests]').select2('val', '01');
      modal.find('[name=api_classify]').select2('val', 'api');
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0052,ZR.0053', cb);
    $.each(apiinfo,function(i,v){
      var target=modal.find('#api_assist_1');
      var t = target.find('[name="' + i + '"]');
      t.html(v);
    });

    modal.find('[name=addkey]').click(function () {
      newlabel();
    });
    modal.find('[name=api_classify]').change(function(e){
      var type = e.val;
      url.trigger('_apitype',[type]);
    });
    modal.find('[name=apifl]').html(modal.find('[name=api_classify]').val());
    modal.find('[name=apiidd]').html(apiinfo.apiid);
    _cb && _cb();
  }

  function urlClass(){
    var target= modal.find('[name=url]');
    var top='/ds/';
    var commP = $.extend({},zy.g.comm);
    $.each(commP,function(i){
      commP[i] = '';
    });

    var cp = zy.net.parseParam(commP);
    var param = '';
    var apitype = 'api';

    target.bind('_param',function(e){
      var t = [];
      $.each(rowList,function(i,v){
        t.push(v());
      });
      param = t.join('&');
      fullURL();
    });
    target.bind('_apitype',function(e,type){
      apitype = type;
      fullURL();
    });

    function fullURL(){
      var full = top + apitype + '/' + apiinfo.apiid +  '?' + param + '&' + cp;
      target.html(full);
    }
    return target;
  }

  function getparam(id){
    var _arr = [];
      $('#' + id).children().each(function (i, v) {
        var role = {};
        $(v).find('a').each(function (ii, vv) {
          if ($(vv).attr('name') !== undefined) {
            role[$(vv).attr('name')] = $(vv).html();
          }
        });
        _arr.push(role);
      });
      return _arr;
  }
  function getnames(id){
    var _arr = [];
      $('#' + id).each(function (i, v) {
        var role = {};
        $(v).find('label').each(function (ii, vv) {
          if ($(vv).attr('name') !== undefined) {
            role[$(vv).attr('name')] = $(vv).html();
          }
        });
        _arr.push(role);
      });
      return _arr;
  }
  //确定
  modal.find('[name=submit]').click(function(){
      var _help = getnames('api_assist_1');
      _help[0].requests=modal.find('[name=requests]').val();
      _help[0].api_classify=modal.find('[name=api_classify]').val();
      // 17.1.12 add api_desc
      _help[0].api_desc=modal.find('[name=api_desc]').val();
      _help[0].param=getparam('api_assist_2');
      _help[0].result=editor.get();
      _help[0].url=url.text();
      helpcontainer.val(JSON.stringify(_help[0]));
      modal.modal('hide');
      $('#ide_edit').modal('show');
    });
    
  modal.find('[name=cancle]').click(function(){ 
    modal.modal('hide');
    $('#ide_edit').modal('show');
  });
  }

  function _buildButton(fieldset,c,input,_node){
    var btn=$('<button>').attr('name','api_help').addClass('btn btn-default btn-sm pull-right buttom').html('API 帮助');
    var div=$('<div>').addClass('row').append($('<section>').addClass('col col-6')).append($('<section>').addClass('col col-6').append(btn));
    fieldset.append(div);
      btn.click(function(){
        zy.net.loadHTML('projectmanagement/api_assist.html',c,function(){
          var _apiid=$(fieldset).find('[name=apiid]').val();
          var _apinm=$(fieldset).find('[name=apinm]').val();
          if(_apiid===''){
            zy.ui.msg('提示','ApiID不可为空', 'w');
            return;
          }
          if(_apinm===''){
            zy.ui.msg('提示','Api名称不可为空', 'w');
            return;
          }
          $('#api_assist').modal('show');
          fieldset.closest('.modal').modal('hide');
          parentnode=_node.getParentNode();
          var apiinfo;
          if(_node.level==3){
            apiinfo={
              apiid:_apiid,
              apinm:_apinm,
              appid:parentnode.getParentNode().appid,
              appnm:parentnode.getParentNode().appnm,
              moduleid:parentnode.moduleid,
              modulenm:parentnode.modulenm
            };
          }
          if(_node.level==2){
            apiinfo={
              apiid:_apiid,
              apinm:_apinm,
              appid:parentnode.appid,
              appnm:parentnode.appnm,
              moduleid:_node.moduleid,
              modulenm:_node.modulenm
            };
          }
          _init(apiinfo,input);
        });
      });
  }

  function Random(){
    return Math.round(Math.random() * 1000000);
  }

  return {
    init:_init,
    button:_buildButton
  };
 })();