/**
 * 维度设置小页面
 * */
bm_mddm0402=(function(){
  var PT = bm_mddm0402.prototype;
  var thiz;
  
  var form=$('#bm_mddm0402_form');
  var table=$('#bm_mddm0402_table');
  
  /**
   * 默认参数选项
   * defaults
   * */
  PT.defaults={
    
  };
  
  /**
   * 参数选项
   * opts
   * */
  PT.opts = {
    item_select2: [],  //项目select2数据源
    col_data: [],   //列定义数据  form.form2json获得
    row_data: [],    //行定义数据  form.form2json获得
    status: {
      add_edit: 'i',   //行或列定义的添加状态还是修改状态  i:添加，u:修改
      delObj: null     //修改前的grid里对应的行或列jquery对象
    }
    
  };
  
  /**
   * 画面元素jquery对象
   * */
  PT.v={
    //div
    sel_row_col: form.find('[name=sel-row-col]'), //行或列
    sel_row_way: form.find('[name=sel-row-way]'), //自定义或group by
    sel_col_item: form.find('[name=sel-col-item]'), //列项目
    sel_whe_cond: form.find('[name=sel-whe-cond]'), //where条件
    sel_whe_cond_rows: form.find('[name=sel-whe-cond-rows]'), //where条件内的条件行
    sel_group_by: form.find('[name=sel-group-by]'), //group by
    
    //element
    rowcol_radio: form.find('[name=row-col]'),  //行列单选按钮
    rowway_radio: form.find('[name=row-way]'),  //行定义方式单选按钮
    
    def_name: form.find('[name=def-name]'),  //定义名称
    
    
    
    sql_func: form.find('[name=sql-func]'),   //合计函数
    sql_func_item: form.find('[name=sel-col-item]').find('[index=col-name]'),   //列项目->选择项目
    col_item_area: form.find('[name=col-item-area]'), //sql条件文本区
    
    items: form.find('[index=col-name]'),  //所有列名
    sql_condition: form.find('[index=col-cond]'),   //所有sql条件
    hand_whe: form.find('[name=hand-whe]'),
    col_whe_area: form.find('[name=col-whe-area]'),  //sql条件文本区
    
    //group by
    col_name_group: form.find('[name=col-name-group]'), //group by 列
    group_by_area: form.find('[name=group-by-area]'), //group by 列
    
    //button
    add_def: form.find('[name=add-def]')  
    
  };
  
  /**
   * 构造方法
   * */
  function bm_mddm0402(item_select2){
    thiz = this;
    zy.log('new bm_mddm0402');
    console.log('new bm_mddm0402');
    
    thiz.opts.item_select2=item_select2;
    thiz.Init();
  }
  
  /**
   * 初始化
   * @method Init
   * */
  PT.Init = function(){
    //初始化列名select2
    thiz.SetColSelect2(thiz.opts.item_select2);
    //初始化数据字典
    initData.dict();
    //事件
    events.rowcol_radio();
    events.rowway_radio();
    events.col_item();
    events.whe_cond();
    events.hand_whe_edit();
    // events.add_def();
    events.form_validate();
    events.col_name_group();
    //默认选择列
    thiz.v.rowcol_radio.filter('[value="1"]').click();
  }
  
  /**数据初始化**/
  var initData={
    //数据字典初始化
    dict: function(){
      //初始化SQL条件select2
      zy.cache.initDicts('ZR.0049,ZR.0062',function(){
        thiz.v.sql_condition.zySelect('ZR.0049',false,{
          width: '100%',
          allowClear:true
        });
        thiz.v.sql_func.zySelect('ZR.0062',false,{
          width: '100%'
        });
      });
    }
  };
  
  /**
   * 画面元素事件
   * event
   * */
  var events={
    //行或列单选按钮
    rowcol_radio: function(){
      thiz.v.rowcol_radio.change(function(){
        zy.log($(this));
        var _val=$(this).val();
        //列
        if(_val=="1"){
          thiz.v.sel_row_way.hide();  //选择行定义方式
          thiz.v.sel_group_by.hide(); //group by
          
          thiz.v.sel_col_item.show(); //选择列项目
          thiz.v.sel_whe_cond.show(); //where条件
          
          //改变label名
          form.find('[name=def-label]').html('<列>');
        }
        //行
        else if(_val=="2"){
          thiz.v.sel_col_item.hide(); //选择列项目
          thiz.v.sel_row_way.show();  //选择行定义方式
          //行定义方式：默认自定义
          thiz.v.sel_row_way.find('[value="1"]').click();
          
          //改变label名
          form.find('[name=def-label]').html('<行>');
        }
      });
    },
    //行定义方式单选按钮
    rowway_radio: function(){
      thiz.v.rowway_radio.change(function(){
        var _val=$(this).val();
        //行自定义
        if(_val=="1"){
          thiz.v.sel_whe_cond.show(); //where条件
          thiz.v.sel_group_by.hide(); //group by
        }
        //group by
        else if(_val=="2"){
          thiz.v.sel_whe_cond.hide(); //where条件
          thiz.v.sel_group_by.show(); //group by
        }
      });
    },
    //列项目（合计函数和项目）
    col_item: function(){
      //为两个input框添加事件,动态改变文本区的内容
      thiz.v.sql_func.change(_changeEvent);
      thiz.v.sql_func_item.change(_changeEvent);
      thiz.v.def_name.change(_changeEvent);
      function _changeEvent(){
        var _funcData = thiz.v.sql_func.select2('data');
        var _itemData = thiz.v.sql_func_item.select2('data');
        if(_itemData!==null){
          var _val = '';
          //合计函数不为空
          if(_funcData!==null){
            if(thiz.v.def_name.val().trim()!==''){
              _val=_funcData.name+'('+_itemData.id+') AS '+thiz.v.def_name.val();
            }else{
              _val=_funcData.name+'('+_itemData.id+')';
            }
          }else{
            _val=_itemData.id;
          }
          thiz.v.col_item_area.val(_val);
        }
      }
    },
    //where条件
    whe_cond: function(){
      thiz.v.sel_whe_cond_rows.find('[index=col-name],[index=col-cond],[index=col-value],[index=col-andor]').change(function(e){
        zy.log('e=',e);
        zy.log('$(this).attr(\'index\')=',$(this).attr('index'));
        //sql条件
        if($(this).attr('index')=='col-cond'){
          zy.log($(this).closest('div.row').find('input[index=col-value]').closest('section'));
          //is null,is not null
          if($(this).val()=='14' || $(this).val()=='15'){
            $(this).closest('div.row').find('input[index=col-value]:first').closest('section').hide();
            $(this).closest('div.row').find('input[index=col-value]:last').closest('section').hide();
          }
          //between,not between
          else if($(this).val()=='12' || $(this).val()=='13'){
            $(this).closest('div.row').find('input[index=col-value]:first').closest('section').show();
            $(this).closest('div.row').find('input[index=col-value]:last').closest('section').show();
          }
          else{
            $(this).closest('div.row').find('input[index=col-value]:first').closest('section').show();
            $(this).closest('div.row').find('input[index=col-value]:last').closest('section').hide();
          }
        }
        //改变where条件文本区的值
        var _val=fn.gene_whe_area();
        thiz.v.col_whe_area.val(_val);
      });
    },
    //手动编辑where复选框
    hand_whe_edit: function(){
      thiz.v.hand_whe.change(function(){
        zy.log('$(this).val()=',$(this).val());
        zy.log('$(this).is(\':checked\')=',$(this).is(':checked'));
        var _ischecked=$(this).is(':checked');
        //改变条件文本区的只读状态
        if(_ischecked){
          thiz.v.col_whe_area.attr('readonly',false);
        }else{
          thiz.v.col_whe_area.attr('readonly',true);
        }
      });
    },
    //form验证
    form_validate: function(){
      form.validate({
        rules:{
          'def-name':{
            required: true,
            maxlength: 100
          },
          // 'sql-func':{
          //   required: function(){
          //     return thiz.v.rowcol_radio.filter(':checked').val()=="1";
          //   }
          // },
          'col-name-item':{
            required: function(){
              return thiz.v.rowcol_radio.filter(':checked').val()=="1";
            }
          },
          'col-item-area':{
            required: function(){
              return thiz.v.rowcol_radio.filter(':checked').val()=="1";
            }
          },
          'col-name-group':{
            required: function(){
              if(thiz.v.rowway_radio.filter(':checked').val()=="2" && thiz.v.rowcol_radio.filter(':checked').val()=="2"){
                return true;
              }else{
                return false;
              }
            }
          },
          'group-by-area':{
            required: function(){
              if(thiz.v.rowway_radio.filter(':checked').val()=="2" && thiz.v.rowcol_radio.filter(':checked').val()=="2"){
                return true;
              }else{
                return false;
              }
            }
          }
        },
        submitHandler: function (form) {
          zy.log('submitHandler');
          //如果是修改行定义或列定义，则先删除之前的定义
          if(thiz.opts.status.add_edit=='u'){
            thiz.opts.status.delObj.click();
            fn.add_def();
            thiz.opts.status.add_edit='i';
            zy.ui.msg('提示信息：','修改成功！','s');
            thiz.v.add_def.text("追加定义");
          }else{
            fn.add_def();
          }
        },
        errorPlacement: function (error, element) {
          error.insertAfter(element.parent());
        }
      });
    },
    //group by列的change事件
    col_name_group: function(){
      thiz.v.col_name_group.change(function(){
        //为group by文本区赋值
        var _val = $(this).val();
        if(_val === ''){
          thiz.v.group_by_area.val('');
        }else{
          thiz.v.group_by_area.val('group by '+_val);
        }
      });
    }
  };
  
  /**
   * 方法
   * */
  var fn={
    //生成where条件文本区的值
    gene_whe_area: function(){
      var _result='';
      var _i=0;
      thiz.v.sel_whe_cond_rows.children().each(function(i,v){
        var col_nameData=$(v).find('[index=col-name]').select2('data');
        var col_condData=$(v).find('[index=col-cond]').select2('data');
        var col_value=$(v).find('[index=col-value]:first').val();
        var col_value2=$(v).find('[name=col-value2]').val();
        var col_andor=$(v).find('[index=col-andor]');
        if(col_nameData!==null && col_condData!==null){
          _result=_result+' '+col_nameData.id+' '+col_condData.name;
          //value
          //like,not like
          if(col_condData.id=='08' || col_condData.id=='09'){
            _result=_result+' \'%'+col_value+'%\'';
          }
          //in, not in
          else if(col_condData.id=='10' || col_condData.id=='11'){
            _result=_result+' (\''+col_value+'\')';
          }
          //between not between
          else if(col_condData.id=='12' || col_condData.id=='13'){
            if(col_nameData.plat_data_type=='Double'){
              _result=_result+' '+col_value+' AND '+col_value2;
            }else{
              _result=_result+' \''+col_value+'\' AND \''+col_value2+'\'';
            }
          }
          //is null,is not null
          else if(col_condData.id=='14' || col_condData.id=='15'){
          }
          else{
            if(col_nameData.plat_data_type=='Double'){
              _result=_result+' '+col_value;
            }else{
              _result=_result+' \''+col_value+'\'';
            }
          }
          //andor
          if(col_andor.length==1){
            _result=_result+' '+col_andor.val();
          }
        }else{
          return false;
        }
        _i=i;
      });
      if(_i===0||_i===1){
        _result=_result.substring(0,_result.length-3);
      }
      return _result;
    },
    //生成行或列定义
    gene_tr_td: function(flag,name,data){
      //添加列
      if(flag == '1'){
        //td
        var _td=$('<th name="'+name+'">'+name+'</th>');
        //修改删除
        var _span_edit=$('<span style="cursor:pointer"><i class="fa fa-edit" title="修改"></i></span>');
        var _span_remove=$('<span style="cursor:pointer"><i class="fa fa-times" title="删除"></i></span>');
        _td.append('&nbsp;').append(_span_edit).append('&nbsp;').append(_span_remove);
        // var _td='<td>'+name+' <span name="">修改</span> '+' <span>删除</span> '+'</td>';
        table.find('[name=first-tr]').append(_td);
        
        //修改
        _span_edit.click(function(){
          zy.log('_span_edit',thiz.v.rowcol_radio);
          thiz.v.rowcol_radio.filter('[value="1"]').click();
          zy.log("edit_data=",data);
          //清空select2
          form.find('[data-type="select2"]').each(function(i,v){
            $(this).select2('val','');
          });
          form.json2form(data);
          zy.log('data.hand_whe=',data['hand-whe']);
          zy.log('thiz.v.hand_whe.prop("checked")=',thiz.v.hand_whe.prop("checked"));
          thiz.v.hand_whe.trigger('change');
          //更改编辑界面的状态
          thiz.opts.status.add_edit='u';
          thiz.opts.status.delObj=_span_remove;
          thiz.v.add_def.text("修改定义");
        });
        //删除
        _span_remove.click(function(){
          zy.log('_span_remove');
          var _index;
          $.each(thiz.opts.col_data,function(i,v){
            zy.log(v);
            if(v['def-name']==name){
              _index = i;
            }
          });
          thiz.opts.col_data.splice(_index,1);
          _td.remove();
        });
      }
      //添加行
      else if(flag=='2'){
        // var _tr='<tr>'+name+'</tr>';
        //tr
        zy.log(name);
        var _tr=$('<tr name="'+name+'"></tr>');
        var _td=$('<td>'+name+'</td>');
        //group by时显示group by行
        if(data['row-way']=='2'){
          _td.text('[group by] '+name);
        }
        //修改删除
        var _tr_edit=$('<span style="cursor:pointer"><i class="fa fa-edit" title="修改"></i></span> ');
        var _tr_remove=$('<span style="cursor:pointer"><i class="fa fa-times" title="删除"></i></span> ');
        _td.append('&nbsp;').append(_tr_edit).append('&nbsp;').append(_tr_remove);
        _tr.append(_td);
        table.find('tbody').append(_tr);
        
        //修改
        _tr_edit.click(function(){
          thiz.v.rowcol_radio.filter('[value="2"]').click();
          thiz.v.rowway_radio.filter('[value="'+data['row-way']+'"]').click();
          zy.log("edit_data=",data);
          //清空select2
          form.find('[data-type="select2"]').each(function(i,v){
            $(this).select2('val','');
          });
          form.json2form(data);
          thiz.v.col_name_group.select2('val',data['col-name-group'].split(','));
          zy.log('data.hand_whe=',data['hand-whe']);
          thiz.v.hand_whe.prop("checked",data['hand-whe']);
          thiz.v.hand_whe.trigger('change');
          //更改编辑界面的状态
          thiz.opts.status.add_edit='u';
          thiz.opts.status.delObj=_tr_remove;
          thiz.v.add_def.text("修改定义");
          zy.log('_tr_edit');
        });
        //删除
        _tr_remove.click(function(){
          zy.log('_tr_remove');
          var _index;
          $.each(thiz.opts.row_data,function(i,v){
            if(v['def-name']==name){
              _index = i;
            }
          });
          thiz.opts.row_data.splice(_index,1);
          _tr.remove();
        });
      }
    },
    
    /**
     * 转换行或列定义的数据为参数(数据结构转换)
     * @method data2param
     * @return {'col_param':col_param,'row_param':row_param}
     * */
    data2param: function(){
      //列
      // {name:'3分未满',func:'',column_name:'',column_content:'',where_radio:'',where_auto:[{column_name:'',condition:'',value:'',andor:''}],where_area:''}
      //行
      // {name:'',where_group:'',group:{column_name:'',groupby_area:''},where:{where_radio:'',where_auto:[{column_name:'',condition:'',value:'',andor:''}],where_area:''}}
      var col_param=[];
      var row_param=[];
      //列定义数据转参数col_param
      $.each(thiz.opts.col_data,function(i,v){
        var _t={'name':v['def-name'],'func':v['sql-func'],'column_name':v['col-name-item'],'column_content':v['col-item-area'],'where_radio':'','where_auto':[],'where_area':v['col-whe-area']};
        //_t.where_radio
        if(v['hand-whe']){
          _t.where_radio='1';
        }else{
          _t.where_radio='0';
        }
        //_t.where_auto
        _t.where_auto.push({
          'column_name': v['col-name1'],
          'condition': v['col-cond1'],
          'value': v['col-value1'],
          'andor': v['col-andor1']
        });
        _t.where_auto.push({
          'column_name': v['col-name2'],
          'condition': v['col-cond2'],
          'value': v['col-value2'],
          'andor': v['col-andor2']
        });
        _t.where_auto.push({
          'column_name': v['col-name3'],
          'condition': v['col-cond3'],
          'value': v['col-value3']
        });
        col_param.push(_t);
      });
      
      //行定义数据转参数row_param
      $.each(thiz.opts.row_data,function(i,v){
        var _t={'name':v['def-name'],'where_group':v['row-way'],'group':{'column_name':v['col-name-group'],'groupby_area':v['group-by-area']},'where':{'where_radio':'','where_auto':[],'where_area':v['col-whe-area']}};
        //_t.where_radio
        if(v['hand-whe']){
          _t.where.where_radio='1';
        }else{
          _t.where.where_radio='0';
        }
        //_t.where_auto
        _t.where.where_auto.push({
          'column_name': v['col-name1'],
          'condition': v['col-cond1'],
          'value': v['col-value1'],
          'andor': v['col-andor1']
        });
        _t.where.where_auto.push({
          'column_name': v['col-name2'],
          'condition': v['col-cond2'],
          'value': v['col-value2'],
          'andor': v['col-andor2']
        });
        _t.where.where_auto.push({
          'column_name': v['col-name3'],
          'condition': v['col-cond3'],
          'value': v['col-value3']
        });
        row_param.push(_t);
      });
      
      return {'col_param':col_param,'row_param':row_param};
    },
    
    /**
     * 将接口返回的数据转为行定义或列定义的form数据(数据结构转换)
     * 并为thiz.opts.row_data,thiz.opts.col_data赋值
     * @method param2formdata
     * @params rowArray,colArray
     * @return 
     * */
    param2formdata: function(colArray,rowArray){
      thiz.opts.col_data=[];
      thiz.opts.row_data=[];
      zy.log('colArray=',colArray);
      //列
      $.each(colArray,function(i,v){
        var _t={'row-col':'1','def-name':v.name,'col-name-item':v.column_name,'sql-func':v.func,'col-item-area':v.column_content,'hand-whe':v.where_radio=='1'?true:false,'col-whe-area':v.where_area};
        //where条件
        $.each(v.where_auto,function(_i,_v){
          _t['col-name'+(_i+1)]=_v.column_name;
          _t['col-cond'+(_i+1)]=_v.condition;
          _t['col-value'+(_i+1)]=_v.value;
          if(_i<2){
            _t['col-andor'+(_i+1)]=_v.andor;
          }
        });
        thiz.opts.col_data.push(_t);
      });
      zy.log('thiz.opts.col_data=',thiz.opts.col_data);
      
      //行
      $.each(rowArray,function(i,v){
        var _t={
          'row-col':'2',
          'def-name':v.name,
          'row-way':v.where_group,
          'hand-whe':v.where.where_radio=='1'?true:false,
          'col-whe-area':v.where.where_area,
          'col-name-group':v.group.column_name,
          'group-by-area':v.group.groupby_area
        };
        //where条件
        $.each(v.where.where_auto,function(_i,_v){
          _t['col-name'+(_i+1)]=_v.column_name;
          _t['col-cond'+(_i+1)]=_v.condition;
          _t['col-value'+(_i+1)]=_v.value;
          if(_i<2){
            _t['col-andor'+(_i+1)]=_v.andor;
          }
        });
        thiz.opts.row_data.push(_t);
      });
    },
    //添加行或列定义
    add_def: function(){
      var colrow_radio=thiz.v.rowcol_radio.filter(':checked').val(); //行或列的值
      var def_name=thiz.v.def_name.val(); //行或列定义的名称
      // var _jsonForm = form.serializeArray();
      var _jsonForm = form.form2json();
      
      zy.log(colrow_radio);
      //列定义
      if(colrow_radio=='1'){
        if(fn.check_defname('1',def_name)){
          zy.ui.msg('提示信息：','列定义名称"'+def_name+'"已存在！','w');
          return;
        }
        thiz.opts.col_data.push(_jsonForm);
        fn.gene_tr_td('1',def_name,_jsonForm);
      }
      //行定义
      else if(colrow_radio=='2'){
        //group by 只能添加一个,并且不能再添加自定义的行定义
        var _isGroup=false;
        $.each(thiz.opts.row_data,function(i,v){
          if(v['row-way']=='2'){
            _isGroup=true;
            zy.ui.msg('提示信息：','行定义已经定义为Group By','w');
            return false
          }
        });
        if(_isGroup){
          return;
        }
        //如果添加了自定义行，则不可再添加group by
        if(_jsonForm['row-way']=='2' && thiz.opts.row_data.length>0){
          zy.ui.msg('提示信息：','行定义已经定义为自定义','w');
          return false
        }
        //定义名称不可重复
        if(fn.check_defname('2',def_name)){
          zy.ui.msg('提示信息：','行定义名称"'+def_name+'"已存在！','w');
          return;
        }
        thiz.opts.row_data.push(_jsonForm);
        fn.gene_tr_td('2',def_name,_jsonForm);
      }
    },
    //检查定义名称是否已存在
    check_defname: function(flag,defname){
      var _isExist=false;
      //列定义名称
      if(flag=='1'){
        $.each(thiz.opts.col_data,function(i,v){
          _chk(i,v);
        });
      }
      //行定义名称
      else if(flag=='2'){
        $.each(thiz.opts.row_data,function(i,v){
          _chk(i,v);
        });
      }
      function _chk(i,v){
        if(v['def-name']==defname){
          _isExist=true;
          return false;
        }
      }
      return _isExist;
    }
  };
  
  /**
   * 设置列名select2的数据源
   * @method SetColSelect2
   * @params data
   * */
  PT.SetColSelect2 = function(data){
    //列名
    thiz.v.items.zySelectCustomData('',false,{
      width:"100%",
      allowClear:true
    },data);
    //group by 列名
    thiz.v.col_name_group.zySelectCustomData('',false,{
      width:'100%',
      multiple: 'multiple'
    },data);
  }
  
  /**
   * 输出行定义列定义参数数据
   * @method getParamsData
   * */
  PT.getParamsData = function(){
    return fn.data2param();
  }
  
  /**
   * 生成维度设置grid等操作（修改时）
   * @method gene_grid
   * */
  PT.gene_grid=function(colArray,rowArray){
    //为变量赋值
    fn.param2formdata(colArray,rowArray);
    
    //生成行和列
    //列
    $.each(thiz.opts.col_data,function(i,v){
      fn.gene_tr_td('1',v['def-name'],v);
    });
    //行
    $.each(thiz.opts.row_data,function(i,v){
      fn.gene_tr_td('2',v['def-name'],v);
    });
  }
  
  return bm_mddm0402;
})();