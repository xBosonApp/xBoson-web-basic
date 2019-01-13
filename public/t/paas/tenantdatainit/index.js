(function($){

  var container = $('#widget-grid').find('.widget-body');
  var table = container.find('.widget-body-toolbar').next(),
  pagenation = container.find('[name=pagenation]'),
  form = $('[name=searchparam]'),
  addbtn = form.next().find('[name=create]'),
  editbtn = form.next().find('[name=update]'),
  delbtn = form.next().find('[name=delete]'),
  conbtn = form.next().find('[name=content]'),
  copybtn = form.next().find('[name=copy]');
      
  var tools = {
    get:function (apiinfo, cb, param, str) {

      $.extend(zy.g.am,apiinfo);

      zy.net.get('api/'+ apiinfo.apinm,function(data){
        if(data && data.ret && data.ret == '0')
          cb&&cb(data);
      },param);
    },
    post:function (apiinfo, cb, param, str) {
      
      $.extend(zy.g.am,apiinfo);
      
      zy.net.post('api/'+ apiinfo.apinm,function(data){
        if(data && data.ret && data.ret == '0')
          cb&&cb(data);
        else
          zy.ui.msg('提示','接口异常','e');
      },param);
    },
    random : function(){
      return new Date().getTime() + '' + Math.round(Math.random() * 10000);
    },
    async: function(count){
      return function(callback){
        var index = 0;
        var result = {};
        return function(key,value){
          index++;
          if(!result[key])
            result[key] = value;
          if(index == count)
            callback&&callback(result);
        }
      }
    },
    msg:function(content,flg){
      zy.ui.msg('提示',content,flg);
    },
    label:function(str){
      var t = '<' + str + '></' + str +'>';
      return $(t);
    }
  }

  function TooBar(form,addbtn,searchFun,modaladdfun,init){

    var param = form.form2json();

    form.find('[type=submit]').unbind().click(function(event){
      param = form.form2json();
      searchFun&&searchFun(param);
    })

    addbtn.unbind().click(function(event){
      modaladdfun&&modaladdfun(null,init,param);
    });

    function EditAndDelete(editbtn,delbtn,conbtn,copybtn,tr,modalfun,delectfun,contentfun,dt){
      if(tr){
        editbtn.btnDisable(false);
        delbtn.btnDisable(false);
        conbtn.btnDisable(false);
        copybtn.btnDisable(false);
      }else{
        editbtn.btnDisable(true);
        delbtn.btnDisable(true);
        conbtn.btnDisable(true);
        copybtn.btnDisable(true);
      }

      editbtn.unbind();
      delbtn.unbind();
      conbtn.unbind();
      copybtn.unbind();
      
      if(tr&&contentfun){
        conbtn.click(function(event){
          contentfun&&contentfun(tr.data().presetid);
        })
      }

      if(modalfun&&tr){
        editbtn.click(function(event){
          modalfun&&modalfun(tr,init,param,dt);
        })
      }

      if(delectfun&&tr){
        delbtn.click(function(event){
          delectfun&&delectfun(tr.data(),init,param);
        })
      }
      //复制按钮
      copybtn.click(function(event){
        copypreset(tr.data(),init,param);
      })
    }

    return {
      btn : EditAndDelete
    }
  }

  function DataTable(dt,data,trueFun,falseFun) {

    function Event(){
      dt.on('click','tr',function(e){
        var $this = $(this);
        $this.siblings('tr').removeClass('active');

        if($this.hasClass('active')){
          falseFun&&falseFun();
          $this.removeClass('active');
        }else{
          var trdata = dt.DataTable().row($this);
          trueFun&&trueFun(trdata,dt);
          $this.addClass('active');
        }
      })
    }

    var columns = [{
      "data": "presetid",
      title:'初始化预设ID'
    }, {
      "data": "presetnm",
      title:'初始化名称'
    }, {
      title:'说明',
      "data": "mark"
    }, {
      title:'状态',
      render:function(data, type, row, meta){
        return zy.cache.cd2name('ZR.0001',row.status);
      }
    }, {
      title:'创建时间',
      render:function(data, type, row, meta){
        return $.format.date(row.createdt, 'yyyy-MM-dd HH:mm:ss');
      }
    }, {
      title:'修改时间',
      render:function(data, type, row, meta){
        return $.format.date(row.updatedt, 'yyyy-MM-dd HH:mm:ss');
      }
    }];
    var options = {
      "data": data || [],
      "columns": columns
    };
    $.extend(options, zy.ui.dataTable);
    dt.dataTable(options);
    Event();
  };

  function Pagination(target) {

    function init(page,cb){
      $.jqPaginator(target, {
        totalCounts: 1,
        pageSize:20,
        currentPage: page,
        onPageChange: function(num) {
          cb&&cb(num);
        }
      });
    }

    function config(msg,page){
      target.jqPaginator('option', {
        totalCounts: msg.count,
        pageSize: 20,
        currentPage: page
      });
    }

    function destroy(){
      target.jqPaginator('destroy');
    }

    return {
      config :config,
      init:init,
      destroy:destroy
    }
  };

  function GetFormServer(page,param,cb){
    tools.get({
      apinm:'getpresetlist',
      mod:'pre_init_tenant_data',
      app:'zyapp_sysmgt'
    },function(msg){
      cb&&cb(msg);
    },param || {});
  }

  function FirstModal(tr,tableinit,param,dt){

    var container = $('#tenantInitFirst');

    var form = container.find('form');
    var title = container.find('h4');

    function init(cb){

      container.find('[name=status]').zySelect('ZR.0001', false, { width: '100%',allowClear:false});
      container.find('[name=status]').select2('val','1');

      var form = container.find('form');

      if(tr){
        tools.get({
          apinm:'getpresetupd',
          app:'zyapp_sysmgt',
          mod:'pre_init_tenant_data'
        },function(msg){
          title.html('修改');
          form.json2form(msg.result[0]);
          cb&&cb(msg);
        },{presetid:tr.data().presetid})
      }else{
        cb&&cb()
      }
    }

    function check(submit){

      var form = container.find('form');

      var option = {
        rules: {
          presetnm: {
            required: true,
            maxlength: 100
          },
          mark:{
            maxlength:200
          }
        },
        submitHandler: submit,
        errorPlacement: function(error, element) {
          error.insertAfter(element.parent());
        }
      };

      form.validate(option);
    }

    function checkData(obj){
      $.each(obj,function(i,v){
        if(i.indexOf('s2id') > -1 || i == 'undefined'){
          delete obj[i];
        }
      })
      return obj
    }

    zy.net.loadHTML('tenantdatainit/firstModal.html',container,function(){
      container.find('.modal').modal('show');
      var form = container.find('form');
      init(function(msg){
        check(function(){
          if(msg){
            tools.get({
              app:'zyapp_sysmgt',
              mod:'pre_init_tenant_data',
              apinm:'updatepreset'
            },function(result){
              tools.msg('修改成功','s');
              container.find('.modal').modal('hide');
              $.extend(true,tr.data(),form.form2json());
              dt.DataTable().rows().invalidate().draw();
            },checkData(form.form2json()));
          }else{
            tools.get({
              app:'zyapp_sysmgt',
              mod:'pre_init_tenant_data',
              apinm:'createpresetinfo'
            },function(result){
              tools.msg('添加成功','s');
              tableinit&&tableinit(param);
              container.find('.modal').modal('hide');
              SecondModal(result.result[0].presetid);
            },checkData(form.form2json()));
          }
        })
      })
    })
  }
  
  function SecondModal(id){
    
    var container = $('#tenantInitSecond');
    
    function ToolBarFirst(firstT,clickFun){
      var btn = firstT.find('[name=save]');
      
      btn.unbind();
      
      if(clickFun){
        btn.bind('click',clickFun);
      }
    }
    
    function _i(Node,hander){
      
      var FirstTable = $('#tabledata [name=table]'),
          SecondTable = $('#predata [name=table]'),
          FirstToolBar = $('#tabledata [name=toolbar]'),
          SecondToolBar = $('#predata [name=toolbar]');
          
          
      _ii();
      _iii();
      
      function _each(array){
        var result = [];
        $.each(array,function(i,v){
          result.push(v['data_sorting']);
        });
        return result.join(',');
      }
      
      function _iii(_p){
        
        function tool(){
          FirstToolBar.find('[name=param]').unbind('click').click(function(e){
              container.find('.modal').modal('hide');
              zy.net.loadHTML('md/mm/tab4_where_conditions.html',$('#tenantInitFirst'),function(){
                function async(num){
                  var padding = (function(num){
                    return function(callback){
                      var i = 0;
                      var arr = [];
                      return function(msg){
                        if(msg){
                          arr.push(msg);
                          i++;
                          if(i == num)
                            callback&&callback(arr);
                        }
                      }
                    }
                  })(num);
                  return padding;
                }
    
                var async = async(2);
                var alldone = async(function(result){
                  $('#tab4_where_conditions').modal('show');
                });
    
                function Select() {
                  function cb() {
                    $("#tab4_where_conditions_form input[name=condition]").zySelect('ZR.0049', false, {
                      width: '100%'
                    });
                    $("#tab4_where_conditions_form input[name=collation]").zySelect('ZR.0050', false, {
                      width: '100%'
                    });
                    alldone(1);
                  }
    
                  zy.cache.initDicts('ZR.0049,ZR.0050', cb);
                }
    
                function column() {
                  var cb_column = function(msg) {
                    if (msg) {
                      $("#tab4_where_conditions_form input[name=column]").zySelectCustomData('', false, {
                        width: '100%'
                      }, msg.result);
                      $("#tab4_where_conditions_form input[name=column1]").zySelectCustomData('', false, {
                        width: '100%'
                      }, msg.result);
                      alldone(msg);
                    }
                  };
                  zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                  zy.g.am.mod = 'indexinfo';
                  zy.net.get('api/columnselect2', cb_column, {
                    typecd: Node.typecd
                  });
    
                }
    
                function tools() {
    
                  var target = $('#tab4_where_conditions_form');
                  var _text = "";
                  var wherearea = $('#tab4_where_conditions_form').find('[name=wherearea]');
                  var onarea = $('#tab4_where_conditions_form').find('[name=onarea]');
    
                  $('#tab4_where_conditions_form').find('[name=condition]').change(function(e){
                    var $this = $(this);
                    if($this.val() == '')
                      return;
                    var name = $this.select2('data').name
                    if(name == 'BETWEEN' || name == 'NOT BETWEEN')
                      target.find('[name=value2]').closest('section').show();
                    else
                      target.find('[name=value2]').closest('section').hide();
                    target.find('[name=value2]').val('');
                  })
    
                  //and
                  $('#tab4_where_conditions_form').find('[name=and]').click(function(e) {
                    var col = target.find('[name=column]').val();
                    var _condition = target.find('[name=condition]').val();
                    _condition = _condition ==''?_condition:target.find('[name=condition]').select2('data').name;
                    var _value = target.find('[name=value]').val();
                    var _value2 = target.find('[name=value2]').val();
                    var oldValue = wherearea.val();
                    oldValue = oldValue == "''" || oldValue == ""?'':oldValue + ' and ';
                    if (_condition == "IS NOT NULL" || _condition == "IS NULL") {
                      wherearea.val(oldValue + col + " " + _condition);
                      return;
                    }
                    if(_condition == 'IN' || _condition == 'NOT IN'){
                      wherearea.val(oldValue + col + ' '+ _condition + " ('" + _value + "') ");
                      return;
                    }
                    if(_condition == 'BETWEEN' || _condition == 'NOT BETWEEN'){
                      if(col == '' || _condition == '' || _value == '' || _value2 == '')
                        return zy.ui.msg('提示','语法非法','i');
                      wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' and '"+_value2 +"'");
                      return;
                    }
                    if(col == '' || _condition == '' || _value == '')
                      return zy.ui.msg('提示','语法非法','i');
                    wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' ");
                  });
    
                  //or
                  $('#tab4_where_conditions_form').find('[name=or]').click(function(e) {
                    var col = target.find('[name=column]').val();
                    var _condition = target.find('[name=condition]').val();
                    _condition = _condition ==''?_condition:target.find('[name=condition]').select2('data').name;
                    var _value = target.find('[name=value]').val();
                    var _value2 = target.find('[name=value2]').val();
                    var oldValue = wherearea.val();
                    oldValue = oldValue == "''" || oldValue == ""?'':oldValue + ' or ';
                    if (_condition == "IS NOT NULL" || _condition == "IS NULL") {
                      wherearea.val(oldValue + col + " " + _condition);
                      return;
                    }
                    if(_condition == 'IN' || _condition == 'NOT IN'){
                      wherearea.val(oldValue + col + ' '+ _condition + " ('" + _value + "') ");
                      return;
                    }
                    if(_condition == 'BETWEEN' || _condition == 'NOT BETWEEN'){
                      if(col == '' || _condition == '' || _value == '' || _value2 == '')
                        return zy.ui.msg('提示','语法非法','i');
                      wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' and '"+_value2 +"'");
                      return;
                    }
                    if(col == '' || _condition == '' || _value == '')
                      return zy.ui.msg('提示','语法非法','i');
                    wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' ");
                  });
                  //on
                  $('#tab4_where_conditions_form').find('[name=on]').click(function(e) {
                    var col = target.find('[name=column1]').val();
                    var _collation = target.find('[name=collation]').val();
                    _collation = _collation ==''?_collation:target.find('[name=collation]').select2('data').name;
                    var oldValue = $('[name=onarea]').val();
                    oldValue = oldValue == "''" || oldValue == ""?'orderby ':oldValue + ' , ';
    
                    if(col == '' || _collation == '')
                      return zy.ui.msg('提示','语法非法','i');
                    onarea.val(oldValue + col +" "+ _collation);
                  });
                  //确定
                  $('#tab4_where_conditions').find('[name=btn_ok]').click(function(e) {
                    var _wherearea = wherearea.val();
                    var _onarea = onarea.val();
                    $('#tab4_where_conditions').modal('hide');
                    container.find('[name=wherearea]').val(_wherearea + ' ' + _onarea);
                    container.find('.modal').modal('show');
                  });
                  //取消
                  $('#tab4_where_conditions').find('[name=btn_cancel]').click(function(e) {
                    $('#tab4_where_conditions').modal('hide');
                    container.find('.modal').modal('show');
                  });
                }
                Select();
                column();
                tools();
              })
            })
          
          FirstToolBar.find('[name=search]').unbind().click(function(event){
            var param = $(this).closest('form').form2json();
            _iii(param);
          })
        }
        
          hander.first.init(FirstTable,$.extend(true,_p || {},{
            did:Node.did,
            typecd:Node.typecd,
            en:Node.en
          }),function(msg){
            tool();
            FirstToolBar.find('[name=save]').btnDisable(true);
            $('#tabledata').children().show();
          },function(data){
            FirstToolBar.find('[name=save]').btnDisable(false);
            ToolBarFirst(FirstToolBar,function(event){
              if(data.length && data.length > 0){
                tools.post({
                  app:'zyapp_sysmgt',
                  mod:'pre_init_tenant_data',
                  apinm:'savedata'
                },function(msg){
                  tools.msg('保存成功','s');
                  $('a#' + Node.tId + '_a').css('color','blue');
                  Node.exist_table = true;
                  _ii();
                  $('[href=#predata]').tab('show');
                },{
                 presetid:id,
                 did:Node.did,
                 en:Node.en,
                 typecd:Node.typecd,
                 data:data
                })
              }
            });
          },function(){
            FirstToolBar.find('[name=save]').btnDisable(true);
            ToolBarFirst(FirstToolBar);
          },true);
      }
      
      function _ii(){
        
        hander.second.init(SecondTable,{
          presetid:id,
          typecd:Node.typecd,
          did:Node.did,
          en:Node.en
        },function(msg){
          SecondToolBar.find('button').btnDisable(true);
          SecondToolBar.find('button').unbind();
          $('#predata').children().show();
        },function(data){
          SecondToolBar.find('button').btnDisable(false);
          ToolBarSecond(SecondToolBar,function(event){
            if(data.length && data.length > 0){
              tools.post({
                app:'zyapp_sysmgt',
                mod:'pre_init_tenant_data',
                apinm:'deletepredata'
              },function(msg){
                tools.msg('删除成功','s');
                $('#predata').children().hide();
                _ii();
              },{
                presetid:id,
                sorting:data[0].sorting,
                datasorting:_each(data)
              })
            }
          });
        },function(){
          SecondToolBar.find('button').btnDisable(true);
          ToolBarSecond(SecondToolBar);
        },true);
      }
    }
    
    function ToolBarSecond(secondT,clickFun){
      var btn = secondT.find('button');
      
      btn.unbind();
      
      if(clickFun){
        btn.bind('click',clickFun);
      }
    } 
    
    function BuildTable(callback){
      
      function init(){
        loadScript('lib/html/zy_dytable.js',function(){
          
          var cb = tools.async(2);
          var done = cb(function(result){
            callback&&callback(result);
          })
          
          dyTable({
            app:'zyapp_sysmgt',
            mod:'pre_init_tenant_data',
            api:'getgriddata'
          },function(hander){
            done('first',hander);
          });
          dyTable({
            app:'zyapp_sysmgt',
            mod:'pre_init_tenant_data',
            api:'getpregriddata'
          },function(hander){
            done('second',hander);
          })
        })
      }
      
      init();
    }
    
    function BuildTree(data,clickfun,colorfun,tablehander){
      
      var tree = null;
      
      function click(event, treeId, treeNode, clickFlag){
        window.ee = $(event.target)
        if(!treeNode || treeNode.isParent)
          return;
        clickfun&&clickfun(treeNode,tablehander);
      }

      function _addHoverDom(_id, _node) {
          
            var sObj = $("#" + _node.tId + "_span");
            if (_node.editNameFlag || $("#remBtn_" + _node.tId).length > 0)
                return;
            var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
            
            if (!_node.isParent && _node.exist_table)
                sObj.after(remStr);
            
            $("#remBtn_" + _node.tId).bind('click', function () {
              tree.selectNode(_node);
              container.find('.modal').modal('hide');
              zy.ui.mask('提示','确定要删除预设表?',function(){
                tools.get({
                  app:'zyapp_sysmgt',
                  mod:'pre_init_tenant_data',
                  apinm:'deletepretable'
                },function(msg){
                  container.find('.modal').modal('show');
                  tools.msg('删除成功','s');
                  _node.exist_table = null;
                  _node.table_change = null;
                  $("#remBtn_" + _node.tId).unbind().remove();
                  $('a#'+_node.tId+'_a').css('color','black');
                },{
                  presetid:id,
                  typecd:_node.typecd,
                  did:_node.did,
                  en:_node.en
                })
              })
            });
        }

      function _removeHoverDom(_id, _node) {
            $("#remBtn_" + _node.tId).unbind().remove();
        }

      function option(){
        
        var o = {
          view:{
            fontCss:colorfun,
            addHoverDom:_addHoverDom,
            removeHoverDom:_removeHoverDom
          },
          data:{
            key:{
              name:'typenm',
              title:'shownm'
            },
            simpleData: {
        			enable: true,
        			idKey: "typecd",
        			pIdKey: "parentcd",
        			rootPId: 0
        		}
          },
          callback:{
            onClick:click
          }
        }
        
        return o;
      }
      
      var setting = option();
      
      tree = $.fn.zTree.init($("#tablelist"), setting, data);
      
    }
    
    function Color(treeId, treeNode){
      return treeNode.exist_table?(treeNode.table_change?{color:"red"} : {color:"blue"} ): {};
    }
    
    function TreeClick(Node, hander){
      $('[href=#tabledata]').tab('show');
      $('#predata').children().hide();
      _i(Node,hander);
    }
    
    function InnerInit(){
      var target = container.find('.nav');
      
      tools.get({
        app:'zyapp_sysmgt',
        mod:'pre_init_tenant_data',
        apinm:'getdstree'
      },function(msg){
        BuildTable(function(tablehander){
          BuildTree(msg.result,TreeClick,Color,tablehander);
        })
      },{presetid:id})
      container.find('.modal').modal('show');
    }
    
    zy.net.loadHTML('tenantdatainit/secondModal.html',container,function(){
      InnerInit();
    })
  }

  function FirstDelect(tr,tableinit,param){
    zy.ui.mask('提示','确定要删除?',function(){
      tools.get({
        app:'zyapp_sysmgt',
        mod:'pre_init_tenant_data',
        apinm:'deletepreset'
      },function(msg){
        tools.msg('删除成功','s');
        tableinit&&tableinit(param);
        editbtn.btnDisable(true);
        delbtn.btnDisable(true);
        conbtn.btnDisable(true);
        copybtn.btnDisable(true);
      },{
        presetid:tr.presetid
      })
    })
  }
  
  function copypreset(tr,tableinit,param){
    zy.ui.mask('提示','确定复制?',function(){
      tools.get({
        app:'zyapp_sysmgt',
        mod:'pre_init_tenant_data',
        apinm:'copypreset'
      },function(msg){
        tools.msg('复制成功','s');
        tableinit&&tableinit(param);
        editbtn.btnDisable(true);
        delbtn.btnDisable(true);
        conbtn.btnDisable(true);
        copybtn.btnDisable(true);
      },{
        presetid:tr.presetid
      })
    })
  }

  function Init(callback){

    // var container = $('#widget-grid').find('.widget-body');

    // var table = container.find('.widget-body-toolbar').next(),
    //   pagenation = container.find('[name=pagenation]'),
    //   form = $('[name=searchparam]'),
    //   addbtn = form.next().find('[name=create]'),
    //   editbtn = form.next().find('[name=update]'),
    //   delbtn = form.next().find('[name=delete]'),
    //   conbtn = form.next().find('[name=content]');
    //   copybtn = form.next().find('[name=copy]');

    editbtn.btnDisable(true);
    delbtn.btnDisable(true);
    conbtn.btnDisable(true);
    copybtn.btnDisable(true);

    var pageController = Pagination(pagenation);

    var cb = tools.async(2);
    var done = cb(function(result){
      _i();
      callback && callback();
    });
    
    function NewTable(){
      table.empty();
      var target = tools.label('table').addClass('table table-bordered table-striped').attr('name','table');
      table.append(target);
      return target;
    }

    function _i(_p){
      pageController.init(1,function(num){
        GetFormServer(num, _p || null,function(msg){
          var toolbar = TooBar(form,addbtn,function(param){
            _i(param);
          },FirstModal,_i);
          DataTable(NewTable(),msg.result,function(tr,dt){
            toolbar.btn(editbtn,delbtn,conbtn,copybtn,tr,FirstModal,FirstDelect,SecondModal,dt);
          },function(){
            toolbar.btn(editbtn,delbtn,conbtn,copybtn);
          });
          if(msg.result.length > 0){
            pageController.config(msg,1);
          }
          // }else{
          //   pageController.destory();
          // }
        });
      });
    }

    loadScript('lib/js/plugin/jquery-pagination/jqPaginator.js',done);

    zy.cache.initDicts('ZR.0001',function(){
      container.find('[name=status]').zySelect('ZR.0001', true, { width: '100%',allowClear:false});
      container.find('[name=status]').select2('val','1');
      done();
    });
  }

  Init();

})(jQuery)