 
 
 md_mm_h2h3=(function(){
   
    var PT = md_mm_h2h3.prototype;
    var thiz;
    
    /**
     * 默认配置参数
     * @attribute _g
     * @private
     */
    PT._g = {
      ztreeObj:null,
      node:{},
      flag:"i",       //添加修改标记
      addSubmit:null,   //添加后回调函数
      editSubmit:null,  //修改后回调函数
      addCancle:null,   //添加模态，取消回调函数
      editCancle:null,   //修改模态，取消回调函数
      _typecd:'',       //铺数据之前的typecd
      _datatable:''     //铺数据之前的datatable
    };
    
    //元素对象
    var modal=$('#md_mm_h2h3');
    var form = $('#md_mm_h2h3_form');
    
    /**
     * @class AuthRoleH8
     * @constructor
     */
    function md_mm_h2h3(ztreeObj,node,flag,submit,cancle) {
      thiz = this;
      //变量赋值
      thiz._g.ztreeObj=ztreeObj;
      thiz._g.node=node;
      thiz._g.flag=flag;
      if(flag=="i"){
        thiz._g.addSubmit=submit;
        thiz._g.addCancle=cancle;
      }else if(flag=="u"){
        thiz._g.editSubmit=submit;
        thiz._g.editCancle=cancle;
      }else{
        zy.ui.msg("提示信息：","new md_mm_h2h3()时缺少参数！","w");
        return;
      }
      
      thiz.Show();
      thiz.Init();
      return this;
    }
    
    /**
     * 页面初始化
     * @method Init
     * */
    PT.Init=function(){
      zy.cache.initDicts("ZR.0001,ZR.0039", function(){
        //select2
        $("#md_mm_h2h3_form input[name=status]").zySelect('ZR.0001', false, {
          width: '100%'
        });
        $('#md_mm_h2h3_form input[name=standard]').zySelect("ZR.0039", false, {
          width: '100%'
        });
        //类别
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/modalsel2",function(msg){
          $('#md_mm_h2h3_form [name=datatable]').zySelectCustomData('', false, {
            width: '100%'
          }, msg.result);
          if(thiz._g.flag=="i"){
            $('#md_mm_h2h3_form [name=datatable]').select2("val",msg.def_value);
          }
        },{typecd:thiz._g.node.typecd});
        
        //页面初始化
        if(thiz._g.flag=="i"){
          thiz.AddInit();
        }else if(thiz._g.flag=="u"){
          thiz.EditInit();
        }
        
        //事件
        thiz.Events.cancleBtn();
        thiz.Events.closeBtn();
        
        //formValidate
        thiz.FormValidate();
      });
    }
    
    /**
     * 添加时初始化
     * @method AddInit
     * */
    PT.AddInit = function (){
      
      $("#md_mm_h2h3_title").text('添加');
      $('#md_mm_h2h3_form [name=typecd]').val(thiz._g.node.typecd);
      // $('#md_mm_h2h3_form [name=typecd]').attr('readonly', true);
      $('#md_mm_h2h3_form input[name=parentcd]').attr('readonly', true);
      $("#md_mm_h2h3_form input[name=status]").select2("val", '1');
      $("#md_mm_h2h3_form input[name=parentcd]").val(thiz._g.node.typecd);
      $("#md_mm_h2h3_form input[name=version]").val('v1.0');
      $("#md_mm_h2h3_form input[name=standard]").select2("val", '02');
    }
    
    /**
     * 修改时初始化（铺数据等）
     * @method EditInit
     * */
    PT.EditInit = function (){
      $('#md_mm_h2h3_form').formDisable(true);
      var callback = function(msg) {
        $('#md_mm_h2h3_form').formDisable(false);
        if (msg) {
          //Console.log("获取字典类型信息数据 = " + JSON.stringify(msg));
          $('#md_mm_h2h3_form').json2form(msg.result[0]);
          thiz._g._typecd = msg.result[0].typecd;
          thiz._g._datatable = msg.result[0].datatable;
        }
      };
      //设置参数
      var h2h3 = {
        typecd: thiz._g.node.typecd
      };
      zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
      zy.g.am.mod = 'mm';
      zy.net.get("api/settreeupd", callback, h2h3);
      $('#md_mm_h2h3_title').text('修改');
      $('#md_mm_h2h3_form input[name=typecd]').attr('readonly', true);
      $('#md_mm_h2h3_form input[name=parentcd]').attr('readonly', true);
      $('#md_mm_h2h3_typecd').remove();
    }
    
    /**
     * 事件绑定规则定义
     * @property Events
     */
    PT.Events = {
      //取消按钮事件回调函数
      cancleBtn: function(){
        $('#md_mm_h2h3').find('footer').find('.btn-default').unbind('click')
        .click(function(){
          if(thiz._g.flag=="i"){
            thiz._g.addCancle&&thiz._g.addCancle();
          }else if(thiz._g.flag=="u"){
            thiz._g.editCancle&&thiz._g.editCancle();
          }
        })
      },
      closeBtn: function(){
        $('#md_mm_h2h3').find('.close').click(function(){
          $('#md_mm_h2h3').find('footer').find('.btn-default').click();
        });
      }
    };
    
    /**
     * 显示模态
     * @method Show
     * */
    PT.Show=function(){
      modal.modal('show');
    }
    
    var value = {
      typecd: {
        required: true,
        maxlength: 100
      },
      typenm: {
        required: true,
        maxlength: 150
      },
      parentcd: {
        required: true,
        maxlength: 100
      },
      datatable: {
        maxlength: 100
      },
      shortkey: {
        maxlength: 100
      },
      standard: {
        maxlength: 2
      },
      version: {
        maxlength: 100
      },
      mark: {
        maxlength: 200
      }
    }
    /**
     * 注册表单验证
     * @method FormValidate
     * */
    PT.FormValidate = function(){
      form.validate({
        // Rules for form validation
        rules: value,
        // 验证成功后保存
        submitHandler: function(form) {
          if(thiz._g.flag=="i"){
            var typecdNm = $('#md_mm_h2h3_form').find('[name=typecd]').val();
            if(/[@#\$%\^&\*]+/g.test(typecdNm)){
              zy.ui.msg("提示信息：", "类别不能为特殊字符！", "i");
              $('#md_mm_h2h3_form').formDisable(false);
            }
            else{
              var callback = function(msg) {
  
                $('#md_mm_h2h3_form').formDisable(false);
                if (msg) {
                  //Console.log("保存成功 = " + JSON.stringify(msg));
                  $('#md_mm_h2h3').modal('hide');
                  
                  //更新树节点
                  var newNode = {
                    typecd: msg.data.typecd,
                    typenm: msg.data.typenm,
                    shownm: msg.data.shownm,
                    datatable: msg.data.datatable
                  };
                  //console.log("12311111",thiz._g.ztreeObj,thiz._g.node);
                  thiz._g.ztreeObj.addNodes(thiz._g.node, newNode);
                  thiz._g.addSubmit&&thiz._g.addSubmit(newNode);
                  zy.ui.msg("提示信息：", "保存成功！", "s");
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.post("api/addtreedata", callback, $('#md_mm_h2h3_form').serialize());
              $('#md_mm_h2h3_form').formDisable(true);
            }
          }
          else if(thiz._g.flag=="u"){
            var typecdNm = $('#md_mm_h2h3_form').find('[name=typecd]').val();
            if(/[@#\$%\^&\*]+/g.test(typecdNm)){
              zy.ui.msg("提示信息：", "类别不能为特殊字符！", "i");
            }
            else{
              var callback = function(msg) {
                $('#md_mm_h2h3_form').formDisable(false);
                if (msg) {
                  //Console.log("保存成功 = " + JSON.stringify(msg));
                  $('#md_mm_h2h3').modal('hide');
                  
                  // 更新节点
                  var t = thiz._g.ztreeObj.getNodeByParam('typecd',thiz._g.node.typecd,null);
                  t.typecd = msg.data.typecd;
                  t.typenm = msg.data.typenm;
                  t.shownm = msg.data.shownm;
                  t.datatable = msg.data.datatable;
                  thiz._g.ztreeObj.updateNode(t);    //更新节点
                  
                  thiz._g.editSubmit&&thiz._g.editSubmit(t);
                  zy.ui.msg("提示信息：", "保存成功！", "s");
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.post("api/settreedata", callback, $('#md_mm_h2h3_form').serialize() + "&_typecd=" + thiz._g._typecd + "&_datatable=" + thiz._g._datatable);
            }
          }
        },
        errorPlacement: function(error, element) {
          error.insertAfter(element.parent());
        }
      });
    }
    
    return md_mm_h2h3;
  })();