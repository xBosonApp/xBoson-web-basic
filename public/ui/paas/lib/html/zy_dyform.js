

var dyForm = (function (zy, $) {
  var tools = {
    label: function (_str) {
      var _t = '<' + _str + '></' + _str + '>';
      return $(_t);
    }
  };

   var _d = DOM();

  function dyForm() {
    this.searchform = _buildSearchForm;
    this.modalform = _buildModalForm;
  }

  function DOM() {

    function _form() {
      var form = tools.label('form');
      form.addClass('smart-form')
        .attr({
          'onsubmit': 'return false;',
          'method': 'post'
        });
      return form;
    }

    function _fieldset() {
      var fieldset = tools.label('fieldset');
      return fieldset;
    }

    function _row() {
      var row = tools.label('div');
      row.addClass('row');
      return row;
    }

    function _section(_width) {
      var section = tools.label('section');
      if(!Boolean(_width))
        return section;
      var _class = 'col col-' + _width;
      section.addClass(_class);
      return section;
    }

    function _labelForName(_nm) {
      var label = tools.label('label');
      label.addClass('label')
        .html(_nm);
      return label;
    }

    function _labelForContent(_class) {
      var label = tools.label('label');
      label.addClass(_class);
      return label;
    }

    function _input(nm, title, type, readonly,num) {
      console.log(type);
      var input = tools.label('input');
      switch (type) {
        case 'text':
          input.attr({
            type: 'text',
            name: nm,
            placeholder: title,
          });
          if(readonly == "1"){
            input.attr('readonly',true);
          }
          break;
        case 'select2_radio':
          input.attr({
            type: 'hidden',
            'data-type': 'select2',
            name: nm,
            placeholder: title
          });
          if(readonly == "1"){
            input.attr('readonly',true);
          }
          break;
        case 'radio':
          input.addClass('radio');
          input.attr({
            type: 'radio',
            name: nm
          });
          break;
        case 'checkbox':
          input.addClass('checkbox');
          input.attr({
            type: 'checkbox',
            name: nm
          });
          break;
        case 'file':
          var btn = tools.label('div');
          var _i = tools.label('input');
          var _ishow = tools.label('input');
          _ishow.attr('type', 'text');
          _i.attr({
            type: 'file',
            name: nm,
            onchange: 'this.parentNode.nextSibling.value = this.value'
          });
          btn.addClass('button');
          break;
        case 'hidden':
          input.attr({
            type: 'hidden',
            name: nm
          });
          break;
        case 'date2':
          input.attr({
            type: 'text',
            name: nm,
            placeholder: title,
          });
          new_datepicker(input,num);
          break;
      }
      return input;
    }

    function _textarea(nm, title, _rowsize) {
      var textarea = tools.label('textarea');
      textarea.attr({
        name: nm,
        placeholder: title,
        rows: _rowsize
      });
      return textarea;
    }

    function _footer() {
      var footer = tools.label('footer');
      return footer;
    }

    function _button(nm, title, cb) {
      var button = tools.label('button');
      button.addClass('btn btn-default');
      button.attr({
        name: nm
      });
      button.html(title);
      button.unbind();
      button.bind('click', function (e) {
        cb();
      });
      return button;
    }

    return {
      form: _form,
      fieldset: _fieldset,
      row: _row,
      section: _section,
      labelForName: _labelForName,
      labelForContent: _labelForContent,
      input: _input,
      textarea: _textarea,
      button: _button,
      footer: _footer
    }
  }
  
  function isplatorg(){
    var isplatorg=true;
    var ls = zy.cache.get('_zy_user_info', 'ls');
    var org=ls.get('user_selected_org');
    var arr=ls.get('user_org_list');
    $.each(arr,function(i,v){
      if(v.orgid==org) isplatorg=v.isplatorg
    })
    
    return isplatorg
  }

  function get_option(type) {
		var date_opt;

    switch (type) 
    {
			case "yyyy":
				date_opt = 1;
			break;
			case "yyyy-mm":
				date_opt = 3;
			break;
			case "yyyy-mm-dd":
				date_opt = 4;
			break;
		  case "":
		    date_opt = 4;
			break;
			}
		return date_opt;
  }
  
  function _buildModalForm(_type,_submitf,_canclef) {

    var _match = {
      'date2':_buildtext,
      'text': _buildtext,
      'textarea': _buildtextarea,
      'select2_radio': _buildselect2_radio
    };

    function _buildtext(_obj) {
      var section = _d.section(6);
      var show = _d.labelForName(_obj.cn);
      var label = _d.labelForContent('input');
      var datetype=get_option(_obj.format);
      var input = _d.input(_obj.en, _obj.cn, _obj.elemtype, _obj.ro,datetype);
      section.append(show)
        .append(label.append(input));
      fieldset.children('div:last').append(section);
    }

    function _buildtextarea(_obj) {
      var section = _d.section(0);
      var show = _d.labelForName(_obj.cn);
      var label = _d.labelForContent('textarea');
      var textarea = _d.textarea(_obj.en, _obj.cn, 3);
      section.append(show)
        .append(label.append(textarea));
      fieldset.append(section);
    }

    function _buildselect2_radio(_obj) {
      var section = _d.section(6);
      var label = _d.labelForContent('input');
      var show = _d.labelForName(_obj.cn);
      var input = _d.input(_obj.en, _obj.cn, _obj.elemtype);
      section.append(show)
        .append(label.append(input));
      fieldset.children('div:last').append(section);
      var result=isplatorg();
      if(result){
        zy.cache.initDicts.call(this,_obj.dict, function(){
        var _str = "[name="+ _obj.en +"]";
        var input = form.find(_str);
        input.zySelect(_obj.dict, false, {
          width: '100%'
        });
      });
      }else{
        var ls = zy.cache.get('_zy_user_info', 'ls');
        var org=ls.get('user_selected_org');
        zy.org.cache.initDicts(_obj.dict,org,function(){
        var _str = "[name="+ _obj.en +"]";
        var input = form.find(_str);
        input.orgSelect(_obj.dict,org, false, {
          width: '100%'
        });
      });
      }
      
    }
    
    function _buildhidden(_obj) {
      var input = _d.input(_obj.en, _obj.cn, 'hidden', _obj.ro);
      fieldset.append(input);
    }

    if (!_type) {
      zy.ui.msg('提示', '数据源异常', 'e');
      return;
    }
    var form = _d.form();
    var fieldset = _d.fieldset();
    var footer = _d.footer();
    var submit = _d.button('submit', '提交', function () {
      // _submitf();
    });
    submit.attr('type','submit');
    submit.addClass('btn-primary');
    var cbtn = _d.button('cancle', '取消', function () {
      _canclef && _canclef();
    });
    cbtn.attr('type','button');
    form.append(fieldset)
      .append(footer.append(cbtn).append(submit));
    
    // 过滤_type
    var _type_view = [],_type_hide = [];
    $.each(_type, function(i, v){
      // 是否显示
      if(v.view == '1'){
        _type_view.push(v);
      }else{
        _type_hide.push(v);
      }
    });
    zy.log(_type_view);
    $.each(_type_view, function (i, v) {
      var c = i;
      if (Math.round(c / 2) == c / 2) {
        var row = _d.row();
        row.appendTo(fieldset);
      }
      if (_match[v.elemtype]){
        _match[v.elemtype](v); 
      }
    });
    $.each(_type_hide, function(i,v){
      // _buildhidden(v);
    });
    
    //表单验证
    _formValidate(form,_type,_submitf);
    return form;
  }

  function _buildSearchForm(_type,_searchf,isplatDict) {
    console.log(_type);
    var _match = {
      'text': _buildtext,
      'textarea': _buildtextarea,
      'select2_radio': _buildselect2_radio
    };

    function _buildtext(_obj) {
      var section = _d.section(2);
      var label = _d.labelForContent('input');
      var input = _d.input(_obj.en, _obj.cn, _obj.elemtype);
      section
        .append(label.append(input));
      form.append(section);
    }

    function _buildtextarea(_obj) {
      var section = _d.section(0);
      var show = _d.labelForName(_obj.cn);
      var label = _d.labelForContent('textarea');
      var textarea = _d.textarea(_obj.en, _obj.cn, 3);
      section.append(show)
        .append(label.append(textarea));
      form.append(section);
    }

    function _buildselect2_radio(_obj) {
      var section = _d.section(2);
      var label = _d.labelForContent('input');
      var input = _d.input(_obj.en, _obj.cn, _obj.elemtype);
      section
        .append(label.append(input));
      form.append(section);
      //是否是平台数据字典
      if(isplatDict){
        zy.cache.initDicts.call(this,_obj.dict, function(){
          var _str = "[name="+ _obj.en +"]";
          var input = form.find(_str);
          input.zySelect(_obj.dict, false, {
            width: '100%'
          });
        });
      }else{
        zy.org.cache.initDicts.call(this,_obj.dict,zy.g.comm.org, function(){
          var _str = "[name="+ _obj.en +"]";
          var input = form.find(_str);
          input.orgSelect(_obj.dict, zy.g.comm.org, false, {
            width: '100%'
          });
        });
      }
    }

    if (!_type) {
      zy.ui.msg('提示', '数据源异常', 'e');
      return;
    }
    var form = _d.form();
    
    var search = _d.button('search', '&emsp;查 询&emsp;', function () {
      _searchf();
    });
    search.append(tools.label('i').addClass('fa fa-search fa-1'));
    search.addClass('btn-sm');
    search.addClass('btn-info');
    search.addClass('btn-primary');
    

    $.each(_type, function (i, v) {
      if (_match[v.elemtype])
        _match[v.elemtype](v)
    });

    form.append(_d.section(2).append(search));

    return form;
  }
  
  function getnumber(num){
    var number;
    number=Math.pow(10,Number(num))-1;
    
    return number
  }
  
  /**表单验证*/
  function _formValidate(form,_type,_submitf){
    console.log(_type);
    var rules = {};
    $.each(_type,function(i,v){
      
      //var arr=v.numrange.split(',');
      var arr=[];
      if(typeof v.numrange === 'string'){
         arr=v.numrange.split(',');
      }
      if(arr.length>1){
        var n1=Number(arr[0])-Number(arr[1]);
        num=getnumber(n1)
        rules[v.en] = {
        'required': v.must=="1" ? true : false,
        'isDecimal':([0,num,arr[1]]),
        'number':v.datatype=='DECIMAL' ? true : false
      }
      }else{
        if(!isNaN(v.numrange) && v.numrange){
          rules[v.en] = {
          'required': v.must=="1" ? true : false,
          'maxlength':Number(v.numrange),
          'number':v.datatype=='DECIMAL' ? true : false
          }
        }else{
          rules[v.en] = {
          'required': v.must=="1" ? true : false,
          'number':v.datatype=='DECIMAL' ? true : false
          }
        }
        
      }
    });
    zy.log('rules=',rules);
    form.validate({
      'rules' : rules,
      'submitHandler' : function (form) {
        _submitf && _submitf();
      },
      'errorPlacement': function (error, element) {
        error.insertAfter(element.parent());
      }
    });
  }
  
  loadScript("bi/js/datetime_custom.js", function(){
   
  });

  return dyForm;
})
(zy, jQuery);