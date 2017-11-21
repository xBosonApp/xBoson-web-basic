/**
 * 选择项目模态画面
 * 
 * */
 bm_mddm02=(function () {
   
   var PT = bm_mddm02.prototype;
   var thiz;
   
   /**
   * 默认参数
   * @attribute defaults
   * @private
   */
  PT.defaults = {
    id: 'bm_mddm02',
    did: '',
    ztreeObj: null,
    flag:true,
    data:[],
    select2DataSource:[]
  };
  
  var modal=$('#bm_mddm02_modal');
  
   /**
   * @class bm_mddm02 构造方法
   * @constructor
   * @param {Object} options 参数{did:'',flag:true}
   */
  function bm_mddm02(options,outdata,modal_close_cb) {
    zy.log("new bm_mddm02(options)");
    thiz = this;
    // 合并初始化参数选项
    thiz.opts = $.extend({}, thiz.defaults, options);
    thiz.opts.data=outdata;
    zy.log(thiz.opts);
    thiz.Init(modal_close_cb);
    // 注册模态隐藏后事件
    // thiz.SetHiddenEvent($('#bm_mddm02_submit'),callback);
    return this;
  }
  
  /**
   * 初始化
   * @method init
   * */
   PT.Init = function(modal_close_cb){
      thiz.Show();
      thiz.btnEvent();
      //调接口为选择表select2设置数据源
      zy.g.am.app="c770045becc04c7583f626faacd3b456";
      zy.g.am.mod="mddm_view";
      zy.log("thiz.opts = "+JSON.stringify(thiz.opts));
      var _callback=function(msg){
        if(msg && msg.data){
          thiz.opts.select2DataSource=msg.data;
          $('#bm_mddm02_modal').find('[name=tables]').zySelectCustomData('',false,{
            width: '100%',
            multiple: 'multiple'
          },msg.data);
          //初始化ztree
          thiz.SetZtree($('#bm_mddm02_ztree'));
          //注册select2事件
          SetTableChange($('#bm_mddm02_modal').find('[name=tables]'),thiz.opts.ztreeObj);
          //注册提交事件
          thiz.SubmitEvent($('#bm_mddm02_submit'),$('#bm_mddm02_modal').find('[name=tables]'),thiz.opts.ztreeObj,modal_close_cb);
          
          //铺数据
          if(thiz.opts.data.length>0){
            thiz.SetData($('#bm_mddm02_modal').find('[name=tables]'),thiz.opts.ztreeObj,thiz.opts.data);
          }
        }
      };
      if(thiz.opts.select2DataSource.length>0){
        _callback({msg:thiz.opts.select2DataSource});
      }else{
        zy.net.get("api/getdstables",_callback,{"did":thiz.opts.did});
      }
   };
   
  /**
   * 模态显示
   * @method Show
   * */
  PT.Show = function(){
     $('#bm_mddm02_modal').modal('show');
   };
  /**
   * 注册模态隐藏后事件
   * @method SetHiddenEvent
   * */
  // PT.SetHiddenEvent = function(submitBtn,event_func){
  //   $('#bm_mddm02_modal').on("hidden.bs.modal",function(e){
  //     zy.log(e);
  //     event_func&&event_func();
  //   });
  // }
  
  /**
   * 模态隐藏
   * @method hide
   * */
  PT.hide = function(){
    $('#bm_mddm02_modal').modal('hide');
  };
   
  /**
   * 初始化ztree
   * @method SetZtree
   * 参数 container ztree容器
   * */
  PT.SetZtree = function(container){
     var setting={
       data:{
         key:{
           name:"cn"
         },
       },
       callback:{
         beforeExpand:beforeExpand,
         onExpand:onExpand
       },
       view:{
         addDiyDom: addDiyDom,
         showIcon: false,
         showTitle: false,
         fontCss: getFont
       }
     };
     function getFont(treeId, treeNode) {
        if((treeNode.is_select && treeNode.is_select=="1") || (treeNode.is_where && treeNode.is_where=="1")) {
          return  {'color':'blue'};
        }
     }
     function addDiyDom(treeId,treeNode){
       if(treeNode.isParent){
         return;
       }
       var aObj = $("#" + treeNode.tId + "_a");
        if ($("#diyBtn1_"+treeNode.tId).length>0) return;
        var editStr = "<span id='diyBtn_space_" +treeNode.tId+ "' > </span>"+ "<label><input type='checkbox' id='diyBtn1_" + treeNode.tId+ "' onfocus='this.blur();'/>查询条件</label> "+ "<label><input type='checkbox' id='diyBtn2_" + treeNode.tId+ "' onfocus='this.blur();'/>项目选择</label>";
        aObj.after(editStr);
        var _chkbox1=$('#diyBtn1_'+treeNode.tId);
        var _chkbox2=$('#diyBtn2_'+treeNode.tId);
        //查询条件复选框事件
        if(_chkbox1) _chkbox1.bind("click",function(){
          if(this.checked){
            treeNode.is_where = "1";
            //改变节点颜色
            aObj.css("color","blue");
          }else{
            treeNode.is_where = "0";
            //恢复颜色
            if(treeNode.is_select == '0'){
              aObj.css("color","#333");
            }
          }
        });
        //选择项目复选框事件
        if(_chkbox2) _chkbox2.bind("click",function(){
          if(this.checked){
            treeNode.is_select = "1";
            aObj.css("color","blue");
          }else{
            treeNode.is_select = "0";
            //恢复颜色
            if(treeNode.is_where == '0'){
              aObj.css("color","#333");
            }
          }
        });
        //铺数据时触发根据is_select,is_where点击事件
        if(treeNode.is_where=="1"){
          zy.log("trigger _chkbox1");
          _chkbox1.trigger("click");
        }
        if(treeNode.is_select=="1"){
          zy.log("trigger _chkbox2");
          _chkbox2.trigger("click");
        }
     }
     function beforeExpand(treeId,treeNode){
        if(treeNode.children && treeNode.children.length!==0){
          return true;
        }
        zy.g.am.app="c770045becc04c7583f626faacd3b456";
        zy.g.am.mod="mddm_view";
        zy.net.get("api/gettablecolumns",function(msg){
          if(msg && msg.result){
            var _ztreeObj=$.fn.zTree.getZTreeObj(treeId);
            //组装数据
            if(thiz.opts.data.length>0){
              $.each(thiz.opts.data,function(i,v){
                if(v.table_name==treeNode.en){
                  $.each(v.column_info,function(_i,_v){
                    for(var j=0,len=msg.result.length; j<len; j++){
                      if(msg.result[j].en==_v.column_name){
                        msg.result[j].is_select=_v.is_select;
                        msg.result[j].is_where=_v.is_where;
                      }
                    }
                  });
                }
              });
            }
            //添加子节点
            _ztreeObj.addNodes(treeNode,msg.result,true);
          }
        },{"did":thiz.opts.did,"table_name":treeNode.en});
       return true;
     }
     
     function onExpand(e,treeId,treeNode){
        zy.log(treeNode);
        adjustWidth($('#'+treeNode.tId).find('ul a'));
     }
     // 调整children样式
     function adjustWidth(jqyArr){
       var _tmpWidth=0;
       for(var i=0;i<jqyArr.length;i++){
         if(jqyArr[i].offsetWidth>_tmpWidth){
           _tmpWidth=jqyArr[i].offsetWidth;
         }
       }
       jqyArr.width(_tmpWidth);
     }
     //初始化tree
     thiz.opts.ztreeObj = $.fn.zTree.init(container,setting,[]);
   };
   
  /**
   * 注册选择表的多选下拉的change事件
   * @method SetTableChange
   * 参数
   * */
  function SetTableChange(container,ztreeObj){
      container.on('change',function(){
        zy.log('tables = '+$(this).val());
        //多选下拉的值的数组形式
        _arrayValue=$(this).val().split(",");
        //ztree的全部节点数据
        var _allNodes=ztreeObj.getNodes();
        //比较多选下拉值和ztree根节点的差异部分
        var needAdd=[]; //需要添加的根节点
        var needRemove=[];  //需要移除的根节点
        for(var i=0;i<_arrayValue.length;i++){
          var _find=false;
          $.each(_allNodes,function(_i,_v){
            if(_v.en==_arrayValue[i]){
              _find=true;
              return false;
            }
          });
          if(_find===false){
            needAdd.push(_arrayValue[i]);
          }
        }
        $.each(_allNodes,function(_i,_v){
          if(_arrayValue.indexOf(_v.en)==-1){
            needRemove.push(_v.en);
          }
        });
        //ztree移除一个节点
        $.each(needRemove,function(_i,_v){
          ztreeObj.removeNode(ztreeObj.getNodeByParam("en",_v));
        });
        if($(this).val()!==""){
          //ztree添加一个节点
          $.each(needAdd,function(_i,_v){
            ztreeObj.addNodes(null,{"en":_v,"cn":_getcname(_v,"name"),"cn_name":_getcname(_v,"cn_name"),"isParent":"true"},true);
          });
        }
        
        //列别名前缀li
        // col_alias_pre_li($(this).select2('data'));
      });
    }
  
  /**
   * 获取表英文名对应的中文名
   * @method _getcname
   * @params en key
   * @return cn
   * */
  function _getcname(en,key){
    var _cn="";
    $.each(thiz.opts.select2DataSource,function(_i,_v){
      if(_v.id==en){
        _cn=_v[key];
      }
    });
    return _cn;
  }
    
  /**
   * 获取选定的表和列的数据
   * @method GetData
   * 参数：select2Obj，treeObj
   * 返回[{table_name:'',column_info:[{column_name:'',is_select:'1',is_where:'1',datatype:'',numrange:''}]}]
   * */
  function GetData(select2Obj,treeObj){
    var _result=[];
    if(select2Obj.val()===""){
      zy.ui.msg('提示信息：','请选择表和列！','w');
      return false;
      // return [];
    }
    //判断多选下拉与根节点数量是否相等
    var _arrayValue=select2Obj.val().split(",");
    var allNodes=treeObj.getNodes();
    if(_arrayValue.length != allNodes.length){
      zy.ui.msg("提示信息","页面处理异常！","w");
      return false;
    }
    // var col_alias_pre = col_alias_pre_get();
    var _flag=false; //是否选择了select项
    //遍历所有根节点
    for(var i=0,len=allNodes.length;i<len;i++){
      var _tmp={"table_name":allNodes[i].en, "cn_name":allNodes[i].cn_name, "column_info":[]};
      if(typeof(allNodes[i].children)=="undefined"){
        continue;
      }
      //遍历根节点下的子节点
      for(var j=0,len_j=allNodes[i].children.length; j<len_j; j++){
        var _this=allNodes[i].children[j];
        var _tmp_j={"column_name":_this.en,"cn_name":_this.cn_name, "alias_name":"","datatype":_this.datatype,"numrange":_this.numrange,"is_select":_this.is_select,"is_where":_this.is_where,"dict":_this.dict,"elemtype":_this.elemtype};
        if(_this.is_select=="1" || _this.is_where=="1"){
          if(typeof(_tmp_j.is_select)=="undefined"){
            _tmp_j.is_select="0";
          }
          if(typeof(_tmp_j.is_where)=="undefined"){
            _tmp_j.is_where="0";
          }
          _tmp.column_info.push(_tmp_j);
          //检测是否选择了select项
          if(!_flag){
            if(_this.is_select=="1"){
              _flag=true;
            }
          }
        }
        //列别名
        // if(col_alias_pre[_tmp_j.column_name]){
        //   _tmp_j.alias_name=col_alias_pre[_tmp_j.column_name]+_tmp_j.column_name;  
        // }else{
        //   _tmp_j.alias_name=_tmp_j.column_name;
        // }
      }
      _result.push(_tmp);
    }
    if(!_flag){
      zy.ui.msg("提示信息","请至少选择一个项目（项目选择）！","w");
      return false;
    }
    return _result;
  }
  
  /**
   * 注册点击模态确定按钮事件
   * @method Submit
   * 参数：submitBtn
   * */
  PT.SubmitEvent = function (submitBtn,select2Obj,treeObj,modal_close_cb){
    submitBtn.click(function(){
      var res_data=GetData(select2Obj,treeObj);
      if(res_data===false){
        return;
      }
      thiz.opts.data=res_data;
      zy.log(thiz.opts.data);
      thiz.hide();
      modal_close_cb&&modal_close_cb();
    });
  };
  
  /**
   * 铺数据
   * @method SetData
   * @params select2Obj,treeObj,data
   * */
  PT.SetData = function(select2Obj,treeObj,data){
     if(data.length===0){
       return;
     }
     var _tables=[];
     //tree赋第一层tree节点,并通过ztree对象展开节点
     $.each(data,function(i,v){
       _tables.push(v.table_name);
       treeObj.addNodes(null,{"en":v.table_name,"cn":_getcname(v.table_name,"name"),"cn_name":_getcname(v.table_name,"cn_name"),"isParent":"true"},true);
       treeObj.expandNode(treeObj.getNodeByParam("en",v.table_name),true,false,true,true);
     });
     //select2赋值
     select2Obj.select2("val",_tables);
   };
   
  PT.btnEvent = function(){
    //列全选
    modal.find('[name=allSel]').click(function(){
      modal.find('[id=bm_mddm02_ztree]').find('[id^=diyBtn2_]').click();
    });
  }
  
  //列别名前缀设置 li
  // function col_alias_pre_li(tablesArr){
  //   var ul = modal.find('[name=col-alias-set-ul]');
  //   ul.empty();
  //   for(var i in tablesArr){
  //     ul.append('<li><label>'+tablesArr[i].name+'</label><input type="text" name="'+tablesArr[i].id+'"/></li>');
  //   }
  // }
  
  // //列别名前缀获取
  // function col_alias_pre_get(){
  //   var li = modal.find('[name=col-alias-set-ul]').find('li');
  //   var ret = {};
  //   li.each(function(i,e){
  //     ret[$(this).find('input').attr('name')] = $(this).find('input').val();
  //   });
  //   zy.log('列别名前缀：'+ret);
  //   return ret;
  // }

  return bm_mddm02;
 })();