/**
 * Web服务列表页面js
 * */
datas_index = (function(){
  var PT = datas_index.prototype;
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

  };
  /**
   * View 画面元素对象
   * @attribute v
   * @private
   */
  var topform = $('#sys_datas_index_search');    //查询条件form
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
    
    submitBtn: $('[name=bm_mddm04_submitBtn]')  //保存按钮
  };
  /**
   * constructor
   * */
  function datas_index(){
    thiz=this;
    // 初始化
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
    //load设置页面
    load_datas_01: function(item,cb){

    }
  };

  return datas_index;
})();