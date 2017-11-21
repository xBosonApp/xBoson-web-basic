/**
 * 多维模型定义页面js
 * */
bm_mddm0401 = (function(){
  var PT = bm_mddm0401.prototype;
  var thiz;
  
  /**
   * 默认选项
   * @attribute defaults
   * @private
   */
  PT.defaults={
    
  };
  /**
   * 选项
   * @attribute opts
   * @private
   */
  PT.opts={
    node: null,   //维度tree节点
    typecd: '' , //对应的视图模型ID
    editingtype: '',  //视图模型ID的SQL是否手写
    table_json: {'en':'','cn':'','did':''},   //视图模型ID对应的物理表信息
    data: {
      // tblcol_data: {'table':[],'column':{}}, //表名列名的数据源数据结构
      item_data: {'sql_radio':[],'tbl_radio':[]}   //维度设置里的项目select2数据源(两种情况)
    },
    obj: {
      bm_mddm0402Obj: null
    }
    
  };
  /**
   * View 画面元素对象
   * @attribute v
   * @private
   */
  var topform = $('#bm_mddm0401_form');    //选择数据来源和追加条件form
  PT.v={
    fieldset: $('#bm_mddm04_fieldset'),
    showhide: $('#bm_show_hide'),  //选择数据来源和追加where条件的显示隐藏
    dataway: topform.find('[name=dataway]'),  //选择数据来源单选按钮
    tblspan: topform.find('[name=tblspan]'),    //选择物理表后面的span
    
    sqlinfo: topform.find('[name=sqlinfo]'),  //sql语句和参数div
    sqltext: topform.find('[name=sqltext]'),  //sql语句
    sqlparams: topform.find('[name=sqlparams]'),  //sql参数
    
    //追加where条件
    addwhere: topform.find('[name=addwhere]'),
    // table_name: topform.find('[name=table-name]'),  //表名select2（多个）
    column_name: topform.find('[name=column-name]'),  //列名select2（多个）
    condition: topform.find('[name=condition]'),  //SQL条件select2（多个）
    val_or_para: topform.find('[name=val-or-para]'),  //预设值或参数切换控件
    andor: topform.find('[name=andor]'),  //SQL条件下拉（多个）
    
    dimension: $('#bm_mddm04_set_dimension'),   //多维设置容器，用来装载多维设置画面
    
    submitBtn: $('[name=bm_mddm04_submitBtn]')  //保存维度定义按钮
  };
  /**
   * constructor
   * */
  function bm_mddm0401(node){
    thiz=this;
    // 初始化参数选项
    thiz.opts.node=node;
    thiz.opts.typecd=node.view_nodecd;
    thiz.Init();
  }
  
  /**
   * 初始化
   * @method Init
   * */
  PT.Init=function(){
    zy.g.am.app="c770045becc04c7583f626faacd3b456";
    zy.g.am.mod="getmodelinfo";
    zy.net.get("api/type2tabledata",function(msg){
      if(msg && msg.result){
        //判断对应的视图模型是否有物理表
        if(msg.table_json){
          thiz.opts.table_json=msg.table_json;
          thiz.v.tblspan.text(msg.table_json.cn+'（'+msg.table_json.en+'）');
        }else{
          thiz.v.tblspan.text('（无）');
          thiz.v.tblspan.prev().attr("disabled",true);
        }
        //变量赋值
        thiz.opts.editingtype=msg.result[0].editingtype;
        //获取维度设置里项目select2数据源
        thiz.opts.data.item_data=thiz.getItemSource(msg.type);
        //为sql语句和sql参数铺数据
        thiz.v.sqltext.text(msg.result[0].sqltext);
        //获取参数
        var _tmpObj_whe=JSON.parse(msg.result[0].jsondata_where);
        var _tmpObj_sel_whe=JSON.parse(msg.result[0].sel_whe_columns);
        if(msg.result[0].editingtype=='0'){
          if(_tmpObj_whe && _tmpObj_sel_whe){
            if(_tmpObj_whe.params &&_tmpObj_whe.params.length>0){
              //--生成参数html片段--
              var _res_html=thiz.gene_sqlparams(_tmpObj_whe.params,_tmpObj_sel_whe.length);
              thiz.v.sqlparams.append(_res_html);
              //--获取表名列名select2数据源结构（追加条件用）
              // thiz.opts.data.tblcol_data=thiz.getTblColSource(_tmpObj_sel_whe);
            }else{
              thiz.v.sqlparams.text('无');
            }
          }else{
            zy.ui.msg('提示信息：','获取视图where条件部分异常！','w');
            return;
          }
        }
        
        //注册事件
        events.top_show_hide();
        events.dataway();
        // events.table_name();
        events.condition();
        events.submitBtn();
        
        //load维度设置页面
        fn.loadmddm0402(thiz.opts.data.item_data.sql_radio,function(){
          //添加还是修改
          zy.log('thiz.opts.node.new_node=',thiz.opts.node.new_node);
          thiz.opts.node.new_node===true?creator():editor();
        });
        
      }
    },{"typecd":thiz.opts.typecd});
    
    //初始化SQL条件select2
    zy.cache.initDicts('ZR.0049,ZR.004101',function(){
      thiz.v.condition.zySelect('ZR.0049',false,{
        width: '100%',
        allowClear:true
      });
    });
    
    //
    
  }
  
  /**
   * 添加
   * @method creator
   * */
  function creator(){
    thiz.v.submitBtn.html('添加维度定义');
    //选择数据来源单选按钮设置默认值
    if(thiz.v.dataway.filter(':disabled').length===0){
      thiz.v.dataway.filter('[value="2"]').click();
    }else{
      thiz.v.dataway.filter('[value="1"]').click();
    }
  }
  
  /**
   * 修改
   * @method editor
   * */
  function editor(){
    thiz.v.submitBtn.html('修改维度定义');
    //调接口铺数据
    zy.g.am.app="c770045becc04c7583f626faacd3b456";
    zy.g.am.mod="mddm_dimension";
    zy.net.get("api/getdimensionmodelupd",function(msg){
      if(msg){
        if(msg.result&&msg.result.length>0){
          var res=msg.result[0];
          //数据来源单选按钮
          //视图物理表
          if(res.tablesource&&res.tablesource!==''){
            if(thiz.v.dataway.filter(':disabled').length===0){
              thiz.v.dataway.filter('[value="2"]').click();
            }
          }
          //视图SQL
          else{
            thiz.v.dataway.filter('[value="1"]').click();
          }
          
          //追加where条件
          var _where_jsonObj=JSON.parse(res.where_json);
          json2where(_where_jsonObj.add_where_params);
          
          //为维度设置界面变量赋值，维度设置grid
          var _colArray=JSON.parse(res.column_json);
          var _rowArray=JSON.parse(res.row_json);
          thiz.opts.obj.bm_mddm0402Obj.gene_grid(_colArray,_rowArray);
        }else{
          zy.ui.msg('提示信息：','接口数据异常！','w');
          pt.v.submitBtn.attr('disabled',true);
          return;
        }
      }
    },{'typecd':thiz.opts.node.typecd});
  }
  //画面元素事件
  var events={
    //显示隐藏
    top_show_hide: function(){
      thiz.v.showhide.click(function(){
        var $this = $(this);
        if($this.hasClass('fa fa-plus')){
          $this.removeClass('fa-plus').addClass('fa fa-minus');
          thiz.v.fieldset.show();
        }else{
          $this.removeClass('fa fa-minus').addClass('fa fa-plus');
          thiz.v.fieldset.hide();
        }
      });
    },
    //数据来源单选按钮事件
    dataway: function(){
      thiz.v.dataway.change(function(){
        //如果选择了SQL语句方式，则显示sql语句和参数 1为视图sql，2为视图物理表
        if($(this).val()=="1"){
          thiz.v.sqlinfo.show();
          //视图模型SQL为手写时，隐藏追加where条件
          // if(thiz.opts.editingtype=='1'){
          //   thiz.v.addwhere.hide();
          // }else{
            
          // }
          //设置表名select2数据源（追加where条件）
          // thiz.setTblSelect2(thiz.opts.data.tblcol_data.table);
          //清空列名select2数据源（追加where条件）
          thiz.v.column_name.zySelectCustomData('',false,{
            width:"100%",
            allowClear:true
          },thiz.opts.data.item_data.sql_radio);
          //重置列名select2数据源（维度设置页面）
          if(thiz.opts.obj.bm_mddm0402Obj!=null){
            thiz.opts.obj.bm_mddm0402Obj.SetColSelect2(thiz.opts.data.item_data.sql_radio);
          }
        }else if($(this).val()=="2"){
          thiz.v.sqlinfo.hide();
          thiz.v.addwhere.show();
          //设置表名select2数据源
          // thiz.v.table_name.zySelectCustomData('',false,{
          //   width:"100%",
          //   allowClear:false
          // },[{'id':thiz.opts.table_json.en,'name':thiz.opts.table_json.cn}]);
          // thiz.v.table_name.select2('val',thiz.opts.table_json.en);
          //设置列名select2数据源（追加where条件）
          thiz.v.column_name.zySelectCustomData('',false,{
            width:"100%",
            allowClear:true
          },thiz.opts.data.item_data.tbl_radio);
          
          //重置列名select2数据源（维度设置页面）
          if(thiz.opts.obj.bm_mddm0402Obj!=null){
            thiz.opts.obj.bm_mddm0402Obj.SetColSelect2(thiz.opts.data.item_data.tbl_radio);
          }
        }
      });
    },
    
    //SQL条件和预设值参数的change事件
    condition: function(){
      thiz.v.condition.add(thiz.v.val_or_para).change(function(){
        var $this=$(this);
        var condVal=$this.closest('div.row').find('[name=condition]').val();
        var varOrPara=$this.closest('div.row').find('[name=val-or-para]').prop('checked');
        //参数时
        zy.log(condVal,varOrPara);
        //between,not between
        if(condVal=='12' || condVal=='13'){
          //参数
          if(varOrPara==true){
            $this.closest('div.row').find('[name=val-or-para]').closest('section').show();
            $this.closest('div.row').find('[name=val]').closest('section').hide();
            $this.closest('div.row').find('[name=val2]').closest('section').hide();
          }
          //预设值
          else{
            $this.closest('div.row').find('[name=val-or-para]').closest('section').show();
            $this.closest('div.row').find('[name=val]').closest('section').show();
            $this.closest('div.row').find('[name=val2]').closest('section').show();
          }
        }
        //is null,is not null
        else if(condVal=='14' || condVal=='15'){
          $this.closest('div.row').find('[name=val-or-para]').closest('section').hide();
          $this.closest('div.row').find('[name=val]').closest('section').hide();
          $this.closest('div.row').find('[name=val2]').closest('section').hide();
        }
        else{
          //参数
          if(varOrPara==true){
            $this.closest('div.row').find('[name=val-or-para]').closest('section').show();
            $this.closest('div.row').find('[name=val]').closest('section').hide();
            $this.closest('div.row').find('[name=val2]').closest('section').hide();
          }
          //预设值
          else{
            $this.closest('div.row').find('[name=val-or-para]').closest('section').show();
            $this.closest('div.row').find('[name=val]').closest('section').show();
            $this.closest('div.row').find('[name=val2]').closest('section').hide();
          }
        }
      });
    },
    
    //追加条件处的表名select2的change事件
    // table_name: function(){
    //   thiz.v.table_name.change(function(){
    //     //动态为列名设置数据源
    //     var _value=$(this).val();
    //     thiz.v.column_name.zySelectCustomData('',false,{
    //       width:"100%",
    //       allowClear:false
    //     },thiz.opts.data.tblcol_data.column[_value]);
    //   });
    // },
    //保存维度定义按钮
    submitBtn: function(){
      thiz.v.submitBtn.click(function(){
        var _params=getSubmitParams();
        if(_params.row_json=='[]'||_params.column_json=='[]'){
          zy.ui.msg('提示信息：','行定义或列定义不存在！','w');
          return;
        }
        if(thiz.opts.node.new_node===true){
          zy.g.am.app='c770045becc04c7583f626faacd3b456';
          zy.g.am.mod='mddm_dimension';
          zy.net.post('api/adddimensionmodel',function(msg){
            if(msg){
              thiz.opts.node.new_node=false;
              thiz.opts.node.bm004='1';
              thiz.v.submitBtn.html('修改维度定义');
              zy.ui.msg('提示信息：','添加成功！','s');
            }
          },_params);
        }else{
          zy.g.am.app='c770045becc04c7583f626faacd3b456';
          zy.g.am.mod='mddm_dimension';
          zy.net.post('api/upddimensionmodel',function(msg){
            if(msg){
              zy.ui.msg('提示信息：','修改成功！','s');
            }
          },_params);
        }
      });
    }
  };
  
  //方法
  var fn={
    //load设置维度页面
    loadmddm0402: function(item_select2,cb){
      zy.net.loadHTML("bm/bm_mddm0402.html",thiz.v.dimension,function(){
        thiz.opts.obj.bm_mddm0402Obj = new bm_mddm0402(item_select2);
        cb&&cb();
      });
    }
  };
  
  /**
   * 生成sql参数及预设值
   * @method gene_sqlparams
   * @params where_jsonObj where条件，tbl_num SQL语句包含的表数量
   * */
  PT.gene_sqlparams = function (where_jsonObj,tbl_num){
    var _result=[];
    if(where_jsonObj.length===0){
      return '';
    }
    zy.cache.initDicts('ZR.0049',function(){
      if(tbl_num==1){
        $.each(where_jsonObj,function(i,v){
          var tmp='<div>'+v.column_name+' '+zy.cache.cd2name('ZR.0049',v.condition);
          //参数
          if(v.flag == '1'){
            tmp=tmp+' --参数</div>';
          }
          //预设值
          else{
            tmp=tmp+' '+v.value.join(',')+'--预设值</div>';
          }
          _result.push(tmp);
        });
      }else{
        $.each(where_jsonObj,function(i,v){
          var tmp='<div>'+v.table_name+'.'+v.column_name+' '+zy.cache.cd2name('ZR.0049',v.condition);
          //参数
          if(v.flag == '1'){
            tmp=tmp+' --参数</div>';
          }
          //预设值
          else{
            tmp=tmp+' '+v.value.join(',')+'--预设值</div>';
          }
          _result.push(tmp);
        });
      }
    });
    return _result.join(' ');
  }
  
  /**
   * 获取项目select2数据源
   * @method getItemSource
   * @params type 接口返回的type
   * @return {sql_radio:[],tbl_radio:[]}
   *         返回两种数据源，视情况选择
   **/
  PT.getItemSource = function(type){
    var _result={'sql_radio':[],'tbl_radio':[]};
    
    $.each(type,function(i,v){
      var _tmp={'id':v.en,'name':v.cn,'text':v.cn,'plat_data_type':zy.cache.cd2name('ZR.004101',v.datatype)};
      _result.sql_radio.push(_tmp);
    });
    $.each(type,function(i,v){
      var _tmp={'id':v.en,'name':v.cn,'text':v.cn,'plat_data_type':zy.cache.cd2name('ZR.004101',v.datatype)};
      _result.tbl_radio.push(_tmp);
    });
    return _result;
  }
  
  /**
   * 生成追加where条件参数JSON
   * @method where2json
   * @return 数组JSON
   * */
  function where2json(){
    var _result={'add_where_content':'','add_where_params':[]};
    thiz.v.addwhere.children().each(function(i,v){
      if(!$(this).is('div.row')){
        return true;
      }
      zy.log(tmp);
      var tmp={'column_name':'','cn_name':'','condition':'','flag':'','value':[],'andor':''};
      var _column_data=$(this).find('[name=column-name]').select2('data');
      var _column_name;  //列名
      var _cn_name;  //中文名
      var _condition=$(this).find('[name=condition]').val();  //条件
      var _val_or_para=$(this).find('[name=val-or-para]').prop('checked');
      var _val=$(this).find('[name=val]').val();  //值1
      var _val2=$(this).find('[name=val2]').val();  //值2
      var _andor=$(this).find('[name=andor]').val();
      
      //无效行时，break
      if(!_column_data){
        return false;
      }
      if(_condition===''){
        return false;
      }
      _column_name = _column_data.id;
      _cn_name = _column_data.name;
      //预设值(如果此行没有填写完，则退出循环)
      if(_val_or_para===false){
        if(_condition=='12' || _condition=='13'){
          if(_val==='' || _val2===''){
            return false;
          }
        }
        else if(_condition=='14' || _condition=='15'){
        }
        else {
          if(_val===''){
            return false;
          }
        }
      }
      //赋值
      tmp.column_name=_column_name;
      tmp.cn_name=_cn_name;
      tmp.condition=_condition;
      tmp.andor=_andor===undefined?'and':_andor;
      //is null,is not null
      if(_condition=='14'||_condition=='15'){
        //add_where_content
        _result.add_where_content=_result.add_where_content+tmp.column_name+' '+zy.cache.cd2name('ZR.0049',tmp.condition)+' '+tmp.andor+' ';
        //add_where_params
        _result.add_where_params.push(tmp);
        return true;
      }else{
        //参数
        if(_val_or_para===true){
          tmp.flag='1';
          //between,not between
          if(_condition=='12'||_condition=='13'){
            _result.add_where_content=_result.add_where_content+tmp.column_name+' '+zy.cache.cd2name('ZR.0049',tmp.condition)+' {'+tmp.column_name+'1} and {'+tmp.column_name+'2} '+tmp.andor+' ';
          }else{
            _result.add_where_content=_result.add_where_content+tmp.column_name+' '+zy.cache.cd2name('ZR.0049',tmp.condition)+' {'+tmp.column_name+'} '+tmp.andor+' ';
          }
        }
        //预设值
        else if(_val_or_para===false){
          tmp.flag='0';
          //between,not between
          if(_condition=='12'||_condition=='13'){
            tmp.value=[_val,_val2];
            
            _result.add_where_content=_result.add_where_content+tmp.column_name+' '+zy.cache.cd2name('ZR.0049',tmp.condition)+' \''+_val+'\' and \''+_val2+'\' '+tmp.andor+' ';
          }else{
            tmp.value=[_val];
            
            _result.add_where_content=_result.add_where_content+tmp.column_name+' '+zy.cache.cd2name('ZR.0049',tmp.condition)+' \''+_val+'\' '+tmp.andor+' ';
          }
        }
        //add_where_params
        _result.add_where_params.push(tmp);
      }
    });
    _result.add_where_content=_result.add_where_content.substring(0,_result.add_where_content.length-4);
    zy.log('where_json=',_result);
    return _result;
  }
  
  /**
   * 根据json数据为where赋值
   * @method json2where
   * @params dataArray
   * */
  function json2where(dataArray){
    thiz.v.addwhere.children().each(function(i,v){
      //第一次循环为header部分
      if(i===0){
        return true;
      }
      //数组中元素循环完之后退出循环
      if(!dataArray[i-1]){
        return false;
      }
      zy.log('dataArray[i-1]=',dataArray[i-1]);
      zy.log('$(this).find(\'[name=column-name]\').select2("data")=',$(this).find('[name=column-name]').select2('data'));
      //列中文名
      $(this).find('[name=cn-name]').select2('val',dataArray[i-1].cn_name);
      
      //列名
      $(this).find('[name=column-name]').select2('val',dataArray[i-1].column_name);
      //条件
      $(this).find('[name=condition]').select2('val',dataArray[i-1].condition);
      //参数预设值
      $(this).find('[name=val-or-para]').click();
      if(dataArray[i-1].flag=='0'){
        $(this).find('[name=val-or-para]').click();
      }
      //值1
      $(this).find('[name=val]').val(dataArray[i-1].value.length>0?dataArray[i-1].value[0]:'');
      //值2
      $(this).find('[name=val2]').val(dataArray[i-1].value.length>1?dataArray[i-1].value[1]:'');
    });
  }
  
  /**
   * 获取保存维度定义参数
   * @method getSubmitParams
   * @return {}
   * */
  function getSubmitParams(){
    var _result={
      'typecd':thiz.opts.node.typecd,
      'typecd_parent':thiz.opts.typecd,
      'tablesource':'',   //不为空表示数据来源为物理表，为空则为SQL语句
      'row_json': '',   //行定义
      'column_json': '',  //列定义
      'where_json': '', //追加where条件
    };
    //tablesource
    if(thiz.v.dataway.filter(':checked').val()=='2'){
      _result.tablesource=thiz.opts.table_json.en;
    }
    //where_json
    var _where_json=where2json();
    _result.where_json=JSON.stringify(_where_json);
    //row_json,column_json
    var _row_col_json=thiz.opts.obj.bm_mddm0402Obj.getParamsData();
    _result.row_json=JSON.stringify(_row_col_json.row_param);
    _result.column_json=JSON.stringify(_row_col_json.col_param);
    return _result;
  }
  
  /**
   * 获取表名和列名select2数据源（追加where条件时用）
   * @method getTblColSource
   * @params sel_whe_columns 接口返回的结构
   * @return {'table':[],'column':{table_name:[]}}
   * */
  // PT.getTblColSource = function(sel_whe_columns){
  //   var _result={'table':[],'column':[]};
    //表
    // $.each(sel_whe_columns,function(i,v){
    //   var _tmp={'id':v.table_name,'name':v.cn_name+'（'+v.table_name+'）','text':v.cn_name+'（'+v.table_name+'）'};
    //   _result.table.push(_tmp);
    // });
    //列
    // $.each(sel_whe_columns,function(i,v){
    //   _result.column[v.table_name]=[];
    //   $.each(v.column_info,function(_i,_v){
    //     var _tmp={'id':_v.column_name,'name':v.cn_name+'（'+v.column_name+'）','text':v.cn_name+'（'+v.column_name+'）'};
    //     _result.column[v.table_name].push(_tmp);
    //   });
    // });
    // return _result;
  // }
  
  /**
   * 设置表名select2数据源（追加where条件时用）
   * @method setTblSelect2
   * @params data
   * */
  // PT.setTblSelect2 = function(data){
  //   thiz.v.table_name.zySelectCustomData('',false,{
  //     width:"100%",
  //     allowClear:false
  //   },data);
  // }
  
  return bm_mddm0401;
})();