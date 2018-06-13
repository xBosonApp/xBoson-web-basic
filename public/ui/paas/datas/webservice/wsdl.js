(function(data, type, id, handle) {
  var wsdl = $('#wsdl2').find('.wsdl_define');
  var func_def = $('#wsdl2').find('.function_define');
  var func_tpl = $('#wsdl2').find('.function_define_tpl').html();
  var currentJdom;
  
  wsdl.find(":input").prop('readonly', true);
  currentJdom = wsdl;
  setVal('[name=doc]', nohtml(data.wsdl.doc));
  setSelect(wsdl.find('[name=types]'), data.wsdl.types);
  setSelect(wsdl.find('[name=ns]'), data.wsdl.ns);
  wsdl.removeClass('hide');
  
  func_def.empty().removeClass('hide');
  for (var modname in data.wsdl.modules) {
    var mod = data.wsdl.modules[modname];
    var ctype = mod.ctype;
    
    for (var funcname in mod.functions) {
      var func = mod.functions[funcname];
      var funcdefdiv = $(func_tpl);
      funcdefdiv.appendTo(func_def).find(":input").prop('readonly', true);
      funcdefdiv.addClass('wsdl_function').addClass(ctype);
      currentJdom = funcdefdiv;
      setVal('.fname',        funcname);
      setVal('[name=doc]',    nohtml(func.doc));
      setVal('[name=curl]',   func.curl);
      setVal('[name=mod]',    modname);
      setVal('[name=ctype]',  ctype);
      setVal('[name=input]',  JSON.stringify(func.input));
      setVal('[name=output]', JSON.stringify(func.output));
      
      if (ctype == 'soap') {
        openApply(funcdefdiv, func, modname);
      }
    }
  }
  
  xb.sendEvent(xb.events.PAGE_UPDATED, null, wsdl);
  
  
  function openApply(funcdefdiv, func, modname) {
    var apply = funcdefdiv.find('[name="apply"]');
    apply.removeClass('hide');
    
    apply.click(function() {
      $('a.tab_create').trigger('click');
      currentJdom = $(".update_form");
      setVal('[name=wsnote]',         nohtml(func.doc));
      setVal('[name=ws_uri]',         func.curl);
      setVal('[name=ws_mod_name]',    modname);
      setVal('[name=ws_func_name]',   func.name);
      setVal('[name=ws_config_json]', JSON.stringify(func));
    });
  }
  
  function setVal(selecter, val) {
    var j = currentJdom.find(selecter);
    if (j.is(':input')) {
      j.val(val || '无');
    } else {
      j.html(val || '无');
    }
  }
  
  function setSelect(selecter, data) {
    var sub = currentJdom.find(selecter);
    for (var n in data) {
      sub.append("<option>"+ n +'['+ data[n] + "]</option>");
    }
  }
  
  function nohtml(txt) {
    return $("<p>"+ txt + "</p>").text();
  }
})