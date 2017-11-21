(function(){
   
    var _domLabel = {
      app : {
        add : [{
          name : '应用名称',
          type : 'input',
          id : 'appnm',
          write : true,
          width : 6
        }, {
          name : '应用状态',
          type : 'select2',
          id : 'status',
          write : true,
          width : 6
        }, {
          name : '应用说明',
          type : 'textarea',
          id : 'about',
          write : true,
          width : 12
        }],
        edit : [{
          name : '应用ID',
          id : 'appid',
          type : 'input',
          write : false,
          width : 6
        }, {
          name : '应用名称',
          type : 'input',
          write : true,
          id : 'appnm',
          width : 6
        }, {
          name : '应用状态',
          type : 'select2',
          id : 'status',
          write : true,
          width : 6
        }, {
          name : '创建时间',
          type : 'input',
          id : 'createdt',
          write : false,
          width : 6
        }, {
          name : '修改时间',
          type : 'input',
          id : 'updatedt',
          write : false,
          width : 6
        }, {
          name : '应用说明',
          type : 'textarea',
          id : 'about',
          write : true,
          width : 12
        }]
      },
      mod : {
        add : [{
          name : '业务ID',
          id : 'moduleid',
          type : 'input',
          write : true,
          width : 6
        }, {
          name : '业务名称',
          type : 'input',
          id : 'modulenm',
          write : true,
          width : 6
        }, {
          name : '业务分类',
          id : 'auflag',
          type : 'select2',
          write : true,
          width : 6
        }, {
          name : '业务状态',
          id : 'status',
          type : 'select2',
          write : true,
          width : 6
        }, {
          name : '业务说明',
          type : 'textarea',
          id : 'about',
          write : true,
          width : 12
        }],
        edit : [{
          name : '业务ID',
          type : 'input',
          id : 'moduleid',
          write : false,
          width : 6
        }, {
          name : '业务名称',
          type : 'input',
          id : 'modulenm',
          write : true,
          width : 6
        }, {
          name : '业务分类',
          type : 'select2',
          id : 'auflag',
          write : true,
          width : 6
        }, {
          name : '业务状态',
          type : 'select2',
          id : 'status',
          write : true,
          width : 6
        }, {
          name : '创建时间',
          type : 'input',
          id : 'createdt',
          write : false,
          width : 6
        }, {
          name : '修改时间',
          type : 'input',
          id : 'updatedt',
          write : false,
          width : 6
        }, {
          name : '业务说明',
          type : 'textarea',
          id : 'about',
          write : true,
          width : 12
        }]
      },
      api : {
        add : [{
          name : 'ApiID',
          id : 'apiid',
          type : 'input',
          write : true,
          width : 6
        }, {
          name : 'Api名称',
          id : 'apinm',
          type : 'input',
          write : true,
          width : 6
        }, {
          name : 'Api状态',
          type : 'select2',
          id : 'status',
          write : true,
          width : 6
        }, {
          name : '操作类型',
          type : 'select2',
          id : 'optype',
          write : true,
          width : 6
        }],
        edit : [{
          name : 'ApiID',
          type : 'input',
          id : 'apiid',
          write : false,
          width : 6
        }, {
          name : 'Api名称',
          type : 'input',
          id : 'apinm',
          write : true,
          width : 6
        }, {
          name : '操作类型',
          type : 'select2',
          id : 'optype',
          write : true,
          width : 6
        }, {
          name : 'Api状态',
          id : 'status',
          type : 'select2',
          write : true,
          width : 6
        }, {
          name : '创建时间',
          id : 'createdt',
          type : 'input',
          write : false,
          width : 6
        }, {
          name : '修改时间',
          id : 'updatedt',
          type : 'input',
          write : false,
          width : 6
        }]
      }
    }
   
   var widPath = 'projectmanagement/wid.html';
   var apiModalPath = 'projectmanagement/project_api_modal.html';
   var userModalPath = 'projectmanagement/add_user.html';
   var apiStatusPath = 'projectmanagement/api_tree.html';
   
   function innerEvent(container,projectObject){
     
     function roleGroup(){
       var target = container.find('#rolegroup').attr('id',zy.extend.random());
       if(target.children().length == 0)
         zy.extend.get({
           apinm:'selectuser',
           mod:'XMGL',
           app:'03229cbe4f4f11e48d6d6f51497a883b'
         },function(msg){
           buildTree(target,{name:'de0201039',title:'userid'},msg.result,projectObject);
         },{roleid:projectObject.roleid});
     }
     
     function apiList(){
       zy.log('container=',container);
       var target = container.find('#apilist').attr('id',zy.extend.random());
       if(target.children().length == 0) 
        buildTree(target,{name:'appnm',title:'showid'},null,projectObject,function(_t){
         container.find('#up').unbind('click').click(function(event){
           var $this = $(this);
           zy.net.loadHTML(apiStatusPath,$('#modal_container'),function(){
             $('#modal_container').find('.modal').modal('show');
             apiStatus($this.attr('id'),$('#modal_container'),_t);
           });
         });
         
         container.find('#down').unbind('click').click(function(event){
           var $this = $(this);
           zy.net.loadHTML(apiStatusPath,$('#modal_container'),function(){
             $('#modal_container').find('.modal').modal('show');
             apiStatus($this.attr('id'),$('#modal_container'),_t);
           });
         });
         
         container.find('#redit').unbind('click').click(function(event){
           var $this = $(this);
           zy.net.loadHTML(apiStatusPath,$('#modal_container'),function(){
             $('#modal_container').find('.modal').modal('show');
             apiStatus($this.attr('id'),$('#modal_container'),_t);
           });
         });
        });
     }
     
     function apiStatus(id,container,_t){
    
       function tree(data){
         
         container.find('#empty').hide();
         
         var tree = null;
         
         if(!$.isArray(data)) return null;
         
         var target = container.find('.ztree');
         
         function handerData(){
           
           function each(o){
             if(!tt[o.id]){
               result.push(o);
               tt[o.id] = true;
               if(match[o.pid]) each(match[o.pid]);
             }
           }
           
           var result = [],match = {},tt = {};
           
           $.each(data,function(i,v){
             match[v.id] = v;
           });
           
           var i = 0;
           
           $.each(data,function(i,v){
              var t = v.id.split('--');
              if(t.length == 3){
                each(v);
                i++;
                console.log(v);
              }
           })
           
           return result;
         }
         
         var setting = {
            view: {
              dblClickExpand: false,
            },
            data: {
              key: {
                name: "name",
                title: "id"
              },
              simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
              }
            },
            check:{
              enable: true,
              chkDisabledInherit: true,
              chkStyle: "checkbox",
              chkboxType: {
                "Y": "ps",
                "N": "ps"
              }
            }
         }
         
         var nodes = handerData();
         
         var flg = true;
         
         tree = $.fn.zTree.init(target, setting, nodes);
         
         if(nodes.length == 0) {
           container.find('#empty').show();
           flg = false;
         }
         
         Event(tree,flg);
       }
       
       function Event(tree,flag){
         container.find('[name=submit]').unbind('click').click(function(event){
           var nodos = tree.getNodesByFilter(function(node){
             return node.level == 2 && node.checked;
           });
           
           if(nodos.length > 0){
             zy.extend.get({
               app:'03229cbe4f4f11e48d6d6f51497a883b',
               mod:'yyxxgl',
               apinm:config[id].editApi
             },function(msg){
               zy.extend.msg('成功','s');
               buildTree(_t,{name:'appnm',title:'showid'},null,projectObject);
               container.find('.modal').modal('hide');
             },{
               roleid:projectObject.roleid,
               nodesRes:$.map(nodos,function(v){
                 return v.id
               }).join(',')
             })
           }else{
             if(flag) zy.extend.msg('请至少选择一个Api','i');
             else container.find('.modal').modal('hide');
           }
         });
       }
       
       if(!id)return null;
       
       var config = {
         app:'03229cbe4f4f11e48d6d6f51497a883b',
         mod:'yyxxgl',
         up:{
           treeApi:'api_up_tree',
           editApi:'api_manage_up',
           title:'待上线'
         },
         down:{
           treeApi:'api_down_tree',
           editApi:'api_manage_down',
           title:'待下线'
         },
         redit:{
           treeApi:'api_dev_tree',
           editApi:'api_manage_dev',
           title:'待转开发'
         }
       }
       
       container.find('h4').html(config[id].title);
       
       zy.extend.post({
         app:config.app,
         mod:config.mod,
         apinm:config[id].treeApi
       },function(msg){
         tree(msg.result);
       },{
         roleid:projectObject.roleid
       })
     }
     
     container.find('#edit_project').click(function(e){
         zy.net.loadHTML('projectmanagement/add_project.html',$('#modal_container'),function(){
           var _modal = $('#modal_container').find('.modal');
           
           _modal.find('.modal-title').html('修改项目');
          
            zy.cache.initDicts('ZR.0001', function(){
              var _in = _modal.find("input[name=status]");
              _in.zySelect('ZR.0001', false, {
                allowClear:false,
                width: '100%'
              });
              _in.select2('val','1');
              
              _modal.find('form').json2form(projectObject);
            });
           
           _modal.find('[name=add]').unbind('click').click(function(e){
             zy.extend.get({
               apinm:'setitem',
               app:'03229cbe4f4f11e48d6d6f51497a883b',
               mod:'XMGL'
             },function(msg){
               _modal.modal('hide');
               zy.extend.msg('修改成功','s');
               $('#widget-grid').empty();
               init();
             },$.extend({roleid:projectObject.roleid},_modal.find('form').form2json()));
           })
           
           _modal.modal('show');
         })
     });
     
      container.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        console.log(e.target,e.relatedTarget,projectObject);
        var target = $(e.target).closest('li');
        if(target.index()==2)roleGroup();
        
        if(target.index()==1)apiList();
      });
   }
   
  function enableJ(target){
    target.jarvisWidgets({
      grid: 'article',
      widgets: '.jarviswidget',
      localStorage: true,
      deleteSettingsKey: '#deletesettingskey-options',
      settingsKeyLabel: '重置设置?',
      deletePositionKey: '#deletepositionkey-options',
      positionKeyLabel: '重置位置?',
      sortable: true,
      buttonsHidden: false,
      
      // toggle button
      toggleButton: true,
      toggleClass: 'fa fa-minus | fa fa-plus',
      toggleSpeed: 200,
      onToggle: function () {},
      // delete btn
      deleteButton: false,
      deleteClass: 'fa fa-times',
      deleteSpeed: 200,
      onDelete: function () {},
      // edit btn
      editButton: true,
      editPlaceholder: '.jarviswidget-editbox',
      editClass: 'fa fa-cog | fa fa-save',
      editSpeed: 200,
      onEdit: function () {},
      // color button
      colorButton: true,
      // full screen
      fullscreenButton: true,
      fullscreenClass: 'fa fa-expand | fa fa-compress',
      fullscreenDiff: 3,
      onFullscreen: function () {},
      // custom btn
      customButton: false,
      customClass: 'folder-10 | next-10',
      customStart: function () {
        alert('你好, 这是一个自定义按钮...');
      },
      customEnd: function () {
        alert('下次再会...');
      },
      // order
      buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
      opacity: 1.0,
      dragHandle: '',
      placeholderClass: 'jarviswidget-placeholder',
      indicator: true,
      indicatorTime: 600,
      ajax: true,
      timestampPlaceholder: '.jarviswidget-timestamp',
      timestampFormat: '更新时间: %y%/%m%/%d% %h%:%i%:%s%',
      refreshButton: true,
      refreshButtonClass: 'fa fa-refresh',
      labelError: '对不起有一个错误:',
      labelUpdated: '最新更新:',
      labelRefresh: '刷新',
      labelDelete: '删除 widget:',
      afterLoad: function () {
      },
      rtl: false, // 暂时不能切换!
      onChange: function () {

      },
      onSave: function () {

      },
      ajaxnav: $.navAsAjax // 应当保存在本地存储里 localstorage

    });
  }
   
   function HandleData(Array){
     if($.isArray(Array)){
       var cb = zy.extend.async(Array.length);
       var done = cb(function(result){
         console.log(result);
         var container = $('#widget-grid');
        enableJ(container);
       });
       $.each(Array,function(i,v){
         buildDom(v,done);
       })
     }
   }
   
   function buildDom(projectObject,callback){
     
     var container = $('#widget-grid');
     
     function HandleDom(cb){
       
       function info(article){
        article.find('#projectName').html(projectObject.rolenm);
        article.find('#projectDe').html(projectObject.role_desc == ''?'<br>':projectObject.role_desc);
         article.find('#createdt').html(projectObject.createdt.replace(/\.0/g,''));
       }
       
       function newDom(article){
         var target = article.find('.tabs-left');
         var li_a = target.children('ul');
         var tab_content = target.children('div').children();
         
         li_a.children().each(function(i){
           
           var $this = $(this).find('a');
           var $that = $(tab_content[i]);
           var newid = zy.extend.random();
           
          $this.attr('href','#' + newid);
           $that.attr('id',newid);
         })
       }
       
       var rows = container.children();
       
       if(rows.length == 0){
         var row = $('<div>').addClass('row');
         container.append(row);
         rows = container.children();
       }
       
         var article = $('<article>').addClass('col-xs-12 col-sm-6 col-md-6 col-lg-6');
         zy.net.loadHTML(widPath,article,function(){
           rows.append(article);
           info(article);
           newDom(article);
           innerEvent(article.find('.jarviswidget'),projectObject);
          // enableJ(container,projectObject);
           cb&&cb(article);
         })
     }
     
     HandleDom(function(at){
       var header = at.find('header:has(h2)');
       header.children('h2').text(projectObject.rolenm);
       callback&&callback(projectObject.roleid,projectObject);
     })
     
   }
   
   function buildTree(c,info,data,project,cb){
     
     var _tree = null;
     
     function _fromServer(_id, _cb, _flag) {
        var _f = true;
        if ( typeof _flag !== 'undefined')
          _f = _flag;
  
        function _children(_arr) {
          $.each(_arr, function(_i, _v) {
            _v.isParent = true;
          });
        }
  
        zy.extend.get({
          mod:'yyxx',
          app:'03229cbe4f4f11e48d6d6f51497a883b',
          apinm : 'treeapis',
        }, function(msg) {
          var _result = msg;
          if (!_result.value)
            return;
          if (_f)
            _children(_result.value)
          _cb && _cb(_result.value);
        },{id : _id,roleid:project.roleid});
        
      }
     
     function setting(){
       
      function _expand(_e, _id, _node) {
        console.log('onExpand',_node);
        var _flg = _node.moduleid ? false : true;
        if (!_node.children)
          _fromServer(_node.someid, function(_m) {
            var _result = _m
            if (_node.contentid)
              $.each(_result, function(_i, _v) {
                _v.appnm = _v.appnm.replace(/(.0)$/g, '');
              });
            _node.children = _result;
            _tree.refresh();
          }, _flg);
      }
      
      function _addHoverDom(_id, _node) {
        
        //API管理=1，人员管理=2
        var check = $('#'+_node.tId).closest('div.tab-pane').index();
        // var flg = null;
        // if(check==1) flg = true;
        // else flg = false;
        
        var sObj = $("#" + _node.tId + "_span");
        if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
          return;
        var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
        var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
        var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
        
        //API管理
        if(check == 1){
          if(_node.isParent)sObj.after(addStr);
          if(_node.level != 0) sObj.after(editStr);
          if((_node.level ==1 ||_node.level ==2) && (!_node.children)) sObj.after(remStr);
          //添加
          $('#addBtn_' + _node.tId).bind("click", function() {
            _tree.selectNode(_node);
            _addModal(_node);
            return false;
          });
          //删除
          $('#remBtn_' + _node.tId).bind("click", function() {
            var del_apinm='';
            if(_node.level==1){
              del_apinm='delapp';
            }else if(_node.level==2){
              del_apinm='delmod';
            }
            zy.ui.mask('提示','确定删除?',function(){
              zy.extend.get({
                apinm:del_apinm,
                app:'03229cbe4f4f11e48d6d6f51497a883b',
                mod:'yyxx'
              },function(msg){
                zy.extend.msg('删除成功','s');
                _tree.removeNode(_node);
              },{
                appid:_node.appid,
                moduleid:_node.moduleid,
                roleid:project.roleid
              },function(msg){
                zy.extend.msg(msg.msg,'w');
              })
            },function(){});
          });
          //修改
          $('#editBtn_' + _node.tId).bind('click', function() {
            _tree.selectNode(_node);
            _editModal(_node);
            return false;
          })
        }
        //人员管理
        else if(check == 2){
          if(_node.isParent)sObj.after(addStr);
          if(_node.level != 0) sObj.after(remStr);
          //添加
          $('#addBtn_' + _node.tId).bind("click", function() {
            _tree.selectNode(_node);
            _addUser(_node);
            return false;
          });
          //删除
          $('#remBtn_' + _node.tId).bind("click", function() {
            zy.ui.mask('提示','确定要将 '+ _node.de0201039 +' 移出项目?',function(){
              zy.extend.get({
                apinm:'deletepid',
                app:'03229cbe4f4f11e48d6d6f51497a883b',
                mod:'XMGL'
              },function(msg){
                zy.extend.msg('删除成功','s');
                _tree.removeNode(_node);
              },{
                pid:_node.pid,
                roleid:project.roleid
              },function(msg){
                zy.extend.msg('当前用户不可删除自己','w');
              })
            },function(){});
          });
        }
        // if(_node.level != 0 && check==1) sObj.after(editStr);
        
        // if(_node.level != 0) sObj.after(remStr);
        
        // if(_node.isParent)sObj.after(addStr);
        
        // $('#addBtn_' + _node.tId).bind("click", function() {
        //   _tree.selectNode(_node);
        //   if(check == 1)_addModal(_node);
        //   else _addUser(_node);
        //   return false;
        // });
        // $('#remBtn_' + _node.tId).bind("click", function() {
        //   zy.ui.mask('提示','确定要将 '+ _node.de0201039 +' 移出项目?',function(){
        //     zy.extend.get({
        //       apinm:'deletepid',
        //       app:'03229cbe4f4f11e48d6d6f51497a883b',
        //       mod:'XMGL'
        //     },function(msg){
        //       zy.extend.msg('删除成功','s');
        //       _tree.removeNode(_node);
        //     },{
        //       pid:_node.pid,
        //       roleid:project.roleid
        //     },function(msg){
        //       zy.extend.msg('当前用户不可删除自己','w');
        //     })
        //   },function(){});
        // });
        // $('#editBtn_' + _node.tId).bind('click', function() {
        //   _tree.selectNode(_node);
        //   _editModal(_node);
        //   return false;
        // })
      }
  
      function _removeHoverDom(_id, _node) {
        $("#addBtn_" + _node.tId).unbind().remove();
        $("#editBtn_" + _node.tId).unbind().remove();
        $("#remBtn_" + _node.tId).unbind().remove();
      }
       
        return {
          view : {
            showTitle : true,
            selectedMulti : false,
            showIcon : true,
            dblClickExpand : false,
            addHoverDom:_addHoverDom,
            removeHoverDom:_removeHoverDom
          },
          data : {
            key : info,
            simpleData : {
              enable : false
            }
          },
          callback:{
            onExpand:_expand
          }
        };
     }
     
      function _paramObject(_form) {
        var _o = {};
        var _area = _form.find('textarea');
        _form.find('input').each(function(_i, _v) {
          if (!$(_v).attr('role'))
            _o[$(_v).attr('name')] = $(_v).val();
        });
        
        delete _o['createdt'];
        delete _o['updatedt'];
        _o[_area.attr('name')] = _area.val();
        return _o;
      }
     
     function _checkLevel(_node, _flg) {
      if (!_node.appid)
        return 'app';
      if (!_node.moduleid)
        return _flg ? 'app' : 'mod';
      if (_node.apiid && _node.contentid)
        return 'api';
      if (_node.moduleid && !_node.apiid)
        return _flg ? 'mod' : 'api';
      if (_node.apiid && _node.hisid)
        return 'his';
     }
     
      function _initEvent(_form, _node, _flg) {
        
        function _checkContent(_form) {
          var _flg = true;
          _form.children().find('input').each(function(_i, _v) {
            if ($(_v).attr('name') && $(_v).attr('name') !== 'updatedt' && $(_v).attr('name') !== 'createdt' && $(_v).val() === '') {
              zy.ui.msg('提示', $(_v).attr('placeholder') + '不可为空', 'w');
              _flg = false;
              return false;
            }
          })
          return _flg;
        }
  
        var _jq = _form;
        if (_flg){
          if(_node.isParent){
            $.each(_node, function(_i, _v) {
              console.log(_node);
          var _t = _jq.find('[name=' + _i + ']')
          if (_t.length > 0) {
            if (_t.hasClass('select2-offscreen'))
              _t.select2('val', _v);
            else
              _t.val(_v.replace(/\.0/g,''));
          }
        });
            
          }else{
            var _t={
          appid:_node.appid,
          moduleid:_node.moduleid,
          apiid:_node.apiid
        };
        zy.g.am.app='ZYAPP_IDE'
        zy.g.am.mod='ZYMODULE_IDE'
        zy.net.get('api/getapiinfo',function(msg){
          console.log(msg.result[0].help_info)
        $.each(msg.result[0], function(_i, _v) {
          var _t = _jq.find('[name=' + _i + ']')
          if (_t.length > 0) {
            if (_t.hasClass('select2-offscreen'))
              _t.select2('val', _v);
            else
              _t.val(_v.replace(/\.0/g,''));
          }
        });
      },_t,null,function(msg){
        console.log(msg)
      });
          }
           
        }
          
  
        var _btn = _jq.find('[name=ide_submit]');
        _btn.unbind().click(function() {
          if (!_checkContent(_form))
            return;
          var _type = $(this).closest('.modal-content').find('h4').text() === '修改' ? 1 : 0;
          var _t = {
            type : _type,
            roleid:project.roleid
          };
          if (_node.appid)
            _t.appid = _node.appid;
          if (_node.moduleid)
            _t.moduleid = _node.moduleid;
          
          zy.extend.post({
            apinm:_checkLevel(_node, Boolean(_type)),
            mod:'yyxx',
            app:'03229cbe4f4f11e48d6d6f51497a883b'
          }, function(msg) {
            if(Boolean(_type)){
              $.extend(true,_node,msg.result[0]);
              _tree.refresh();
            }else _tree.addNodes(_node,msg.result[0]);
            zy.ui.msg('提示信息', '成功', 's');
            $('.modal').modal('hide');
          },$.extend(true, {}, _t, _paramObject(_form)))
        })
        
       
      }
      
      
      
      function _form(_c, _arr) {
        var _t = $.extend(true, {}, _arr);
        var _result = _list(_t);
  
        function _footer(_form) {
          var _footer = zy.extend.label('footer');
          var _btnC = zy.extend.label('button').addClass('btn btn-default').attr('data-dismiss', 'modal').html('取消');
          var _btnS = zy.extend.label('button').addClass('btn btn-primary').attr('name', 'ide_submit').html('确定');
          _footer.append(_btnC).append(_btnS);
          _form.append(_footer);
        }
  
        function _list(_arr) {
          var _half = [], _full = [], _dt = [];
          $.each(_arr, function(_i, _n) {
            if (_n.width === 12)
              _full.push(_n);
            else {
              if (_n.id === 'createdt' || _n.id === 'updatedt')
                _dt.push(_n);
              else
                _half.push(_n);
            }
          });
          return {
            half : _half,
            full : _full,
            time : _dt
          }
        }
  
        function _section(_obj) {
          if (_obj.width !== 12)
            var _section = zy.extend.label('section').addClass('col col-' + _obj.width);
          else
            var _section = zy.extend.label('section');
          var _labelnm = zy.extend.label('label').addClass('label').html(_obj.name);
          if (_obj.type === 'textarea') {
            var _labelcon = zy.extend.label('label').addClass('textarea has-warning');
            var _input = zy.extend.label('textarea').attr('name', _obj.id).attr('placeholder', _obj.name);
          } else {
            var _labelcon = zy.extend.label('label').addClass('input has-warning');
            var _input = zy.extend.label('input').attr('name', _obj.id).attr('type', _obj.type).attr('placeholder', _obj.name);
          }
          if (_input.attr('type') === 'select2')
            _input.attr('type', 'input');
          if (!_obj.write)
            _input.attr('readonly', 'readonly');
          var _b = zy.extend.label('b').addClass("tooltip tooltip-bottom-right").html(_obj.name + '为必填项');
          _labelcon.append(_input).append(_b);
          _section.append(_labelnm).append(_labelcon);
          return _section;
        }
  
        function _check(_num) {
          var _t = _num / 2;
          return Math.round(_t) === _t;
        }
  
        function _select2(_arr) {
          var _data = [{
            id : 0,
            text : '无效',
            name : '无效'
          }, {
            id : 1,
            text : '有效',
            name : '有效'
          }];
          $.each(_arr, function(_i, _v) {
            if (_v.id === 'status')
              _form.find('[name=' + _v.id + ']').zySelectCustomData('', false, {
                allowClear:false,
                width : '100%'
              }, _data);
              _form.find('[name=' + _v.id + ']').select2('val',1);
            if (_v.id === 'auflag')
              zy.cache.initDicts('ZR.0029', function() {
                _form.find('[name=' + _v.id + ']').zySelect('ZR.0029', false, {
                  allowClear:false,
                  width : '100%'
                });
              });
            if (_v.id === 'optype')
              zy.cache.initDicts('ZR.0010', function() {
                _form.find('[name=' + _v.id + ']').zySelect('ZR.0010', false, {
                  allowClear:false,
                  width : '100%'
                });
              });
          });
        }
  
        var _form = zy.extend.label('form').attr('onsubmit', 'return false;').addClass('smart-form');
        var fieldset=$('<fieldset>');
        _form.append(fieldset);
  
        $.each(_result.half, function(_i, _v) {
          var _n = _i / 2;
          if (_check(_i)) {
            var _row = zy.extend.label('div').addClass('row');
            _form.children().append(_row);
          } else {
            _n -= 0.5;
          }
          _form.find('div').eq(_n).append(_section(_v));
        });
  
        var _row = null;
        $.each(_result.time, function(_i, _v) {
          var _n = _i / 2;
          if (_check(_i)) {
            _row = zy.extend.label('div').addClass('row');
          } else {
            _n -= 0.5;
          }
          _row.append(_section(_v));
          _form.children().append(_row);
           var textatra=$('<textarea>').attr('style','display:none').attr('name','help_info');
      fieldset.append(textatra)
        });
  
        $.each(_result.full, function(_i, _v) {
          _form.children().append(_section(_v));
        });
  
        _footer(_form);
  
        _select2(_t);
        _c.append(_form);
       
        
      }
      
      function _addUser(node){
        zy.net.loadHTML(userModalPath, $('#modal_container'), function() {
          $('#modal_container').find('.modal').modal('show');
          
          var container = $('#modal_container');
          
          container.find('#confirm_btn').btnDisable(true);
          
          var dt = $('#search_user_dt');
          
          zy.cache.initDicts('GBT.2261.1', function(){
            $('#search_user_form input[name=de0201040]').zySelect('GBT.2261.1', true, {
              allowClear:false,
              width: '100%'
            });
          });
          
            DataTable();
            Toolbar();
          
          function DataTable(data) {
            var columns = [{
              "data": "userid"
            }, {
              "data": "de0201039"
            }, {
              "render": function(data, type, row, meta) {
                return zy.cache.cd2name('GBT.2261.1', row.de0201040);
              }
            }, {
              "data": "de0201010"
            }, {
              "data": "de0201012"
            }, ];
            //预设初始化参数
            var options = {
              "data": data,
              "columns": columns
            };
            // 合并初始化参数选项
            $.extend(options, zy.ui.dataTable);
            dt.dataTable(options);
            $('.dataTables_scrollHeadInner').css('width', '100%');
            $('.dataTables_scrollBody table').css('width', '100%');
            $('.dataTables_scrollHeadInner table').css('width', '100%');
          };
        
          function Toolbar() {
            // 单击事件
            dt.on('click', 'tr', function(e) {
              // 当前选择行 index
              if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
                return false;
              // 变换选择行状态颜色
              if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
                $(this).removeClass('active');
                $('#confirm_btn').btnDisable(true);
              } else {
                $(this).addClass('active');
                $('#confirm_btn').btnDisable(false);
              }
            });
        
            //关闭
            $('#close_btn').click(function() {
              $('#search_user').modal('hide');
            });
        
            //查询
            $('#search_btn').click(function() {
              conditions = $('#search_user_form').serialize();
              $('.dataTables_wrapper').removeAttr('style');
              $('#confirm_btn').btnDisable(true);
              $('#search_btn').button('loading');
              Pagination(1);
            });
        
            //确认选择
            $('#confirm_btn').click(function() {
              
              var pid = [];
              
              container.find('tr.active').each(function(i){
                var $this = $(this);
                var data = dt.DataTable().row($this).data();
                pid.push(data.pid);
              });
              
              zy.extend.get({
                app:'03229cbe4f4f11e48d6d6f51497a883b',
                mod:'XMGL',
                apinm:'addpersonItem'
              },function(msg){
                $('#search_user').modal('hide');
                _tree.addNodes(node,msg.result);
                zy.extend.msg('添加成功','s');
              },{
                roleid:project.roleid,
                pid:pid.join(','),
                status:project.status
              });
            });
        
            //手动输入
            $('#cancel_btn').click(function() {
              $('#search_user').modal('hide');
            });
          };
        
          function Pagination(page) {
            $.jqPaginator('#search_user_pagination', {
              totalCounts: 1,
              pageSize: 5,
              currentPage: page,
              onPageChange: function(num) {
                SetDt(num);
              }
            });
          };
        
          function SetDt(page) {
            var cb = function(msg) {
              $('#search_btn').button('reset');
              if (msg) {
                $('#confirm_btn').btnDisable(true);
                DataTable(msg.result);
                if (msg.count > 0 && msg.result.length > 0) {
                  $('#search_user_pagination').jqPaginator('option', {
                    totalCounts: msg.count,
                    pageSize: 5,
                    currentPage: page
                  });
                } else {
                  $('#search_user_pagination').jqPaginator('destroy');
                }
              }
            };
            zy.g.am.pagesize = 5; 
            zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
            zy.g.am.mod = 'personalinfo';
            zy.net.get("api/personalselect2", cb, $('#search_user_form').form2json(), page,function(msg){
              zy.extend.msg('选择的用户已在项目中','i');
            });
          };
        })
      }
  
      function _editModal(_node) {
        zy.net.loadHTML(apiModalPath, $('#modal_container'), function() {
          var _level = _checkLevel(_node, true);
          var _head = $('#ide_edit .modal-title');
          _head.html('修改');
          var _jq = $('#ide_edit .modal-body');
          _jq.empty();
          
          _form($('#ide_edit .modal-body'), _domLabel[_level].edit);
          $('#ide_edit').modal('show');
          _initEvent($('#ide_edit').find('form'), _node, true);
          if(_level=='api')
          api_help.button(_jq.find('fieldset'),$('#modal_container2'),$(_jq.find('textarea')[0]),_node);
        });
      }
  
      function _addModal(_node) {
        zy.net.loadHTML(apiModalPath, $('#modal_container'), function() {
          var _level = _checkLevel(_node, false);
          var _head = $('#ide_edit .modal-title');
          _head.html('新增');
          var _jq = $('#ide_edit .modal-body');
          _jq.empty();
          
          _form($('#ide_edit .modal-body'), _domLabel[_level].add);
          $('#ide_edit').modal('show');
          _initEvent($('#ide_edit').find('form'), _node, false);
          
           var textatra=$('<textarea>').attr('style','display:none').attr('name','help_info');
           _jq.find('fieldset').append(textatra);
         if(_level=='api')
          api_help.button(_jq.find('fieldset'),$('#modal_container2'),_jq.find('textarea'),_node);
        });
      }
     
     if(data){
       _tree = $.fn.zTree.init(c, setting(), [{
         de0201039:project.rolenm,
         isParent:true,
         children:data,
         open:true
       }]);
       return null;
     }else{
       _fromServer('', function(_m) {
        var _result = [{
          isParent:true,
          appnm : project.rolenm,
          children : _m,
          open : true
        }];
        zy.log("c=",c);
        _tree = $.fn.zTree.init(c, setting(), _result);
      });
     }
     
     cb&&cb(c);
   }
   
   function Event(){
       $('#add_project').unbind('click').click(function(event){
         zy.net.loadHTML('projectmanagement/add_project.html',$('#modal_container'),function(){
           var _modal = $('#modal_container').find('.modal');
          
            zy.cache.initDicts('ZR.0001', function(){
              var _in = _modal.find("input[name=status]");
              _in.zySelect('ZR.0001', false, {
                allowClear:false,
                width: '100%'
              });
              _in.select2('val','1');
            });
           
           _modal.find('[name=add]').unbind('click').click(function(e){
             zy.extend.get({
               apinm:'additem',
               app:'03229cbe4f4f11e48d6d6f51497a883b',
               mod:'XMGL'
             },function(msg){
               _modal.modal('hide');
               zy.extend.msg('添加成功','s');
               $('#widget-grid').empty();
               init();
             },_modal.find('form').form2json());
           })
           
           _modal.modal('show');
         })
       })
     }
   
   function init(){
     
     zy.extend.get({
       apinm:'selectitems',
       mod:'XMGL',
       app:'03229cbe4f4f11e48d6d6f51497a883b'
     },function(msg){
       HandleData(msg.result)
     },{});
   }
   
   Event();
   
   init();


 })();