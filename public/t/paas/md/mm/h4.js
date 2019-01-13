(function(){
  
  var tools = {
    label : function(str,type){
      var t = '<' + str +'></' + str + '>';
      if(type)
        t = '<' + str +'/>';
      return $(t);
    }
  }
  
  function toNestable(array){
    var div = tools.label('div');
    var ol = tools.label('ol');
    var li = tools.label('li');
    var _container = div.clone().addClass('dd');
    var _ol = ol.clone().addClass('dd-list');
    if(array && array.length >0){
      $.each(array,function(i,v){
        var _li = li.clone().addClass('dd-item').attr('data-id',v.en);
        var _divInner = div.clone().addClass('dd-handle').html(v.cn);
        _ol.append(_li.append(_divInner));
      });
      _container.append(_ol);
      return _container;
    }
    return null;
  }
  
  function Event(){
    
    function _each(){
      var arr = [];
      $('.dd-item').each(function(i,v){
        arr.push($(v).attr('data-id'));
      });
      return arr.join(',');
    }
    
    $('#md_mm_h4 .smart-form').find('[type=submit]').unbind()
      .click(function(e){
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get('api/sortmodaldata',function(msg){
          if(msg.ret && msg.ret == '0')
            zy.ui.msg('提示','排序成功','s');
            $('#md_mm_h4').modal('hide');
        },{
          typecd:'test211',
          fields:_each()
        })
      })
  }
  
  loadScript("lib/js/plugin/jquery-nestable/jquery.nestable.js", function(){
    zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
    zy.g.am.mod = 'mm';
    zy.net.get('api/getmodalfields',function(msg){
      var target = $('.modal-body').find('div.col-xs-6');
      var tree = toNestable(msg.result);
      target.append(tree);
      tree.nestable({
        maxDepth:1
      });
      Event();
      $('#md_mm_h4').modal('show');
    },{typecd:'test211'});
  });
  
})();