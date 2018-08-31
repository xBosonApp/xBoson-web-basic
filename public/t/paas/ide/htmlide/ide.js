function NewIDE(roleid) {
  //
  // Add by J.ym 17.12.19
  // ide 窗口固定与浏览器窗口同步大小
  //
  var COMMENT_HEIGHT = 105;
  var CUT_HEIGHT = 220 + COMMENT_HEIGHT;
  var EDITOR_WRAP_SIZE= 80;
  
  var _domLabel = {
    app : {
      add : [{
        name : '应用ID',
        id : 'appid',
        type : 'input',
        write : true,
        width : 6
      }, {
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
        name : 'API ID',
        id : 'apiid',
        type : 'input',
        write : true,
        width : 6
      }, {
        name : 'API 名称',
        id : 'apinm',
        type : 'input',
        write : true,
        width : 6
      }, {
        name : 'API 状态',
        type : 'select2',
        id : 'status',
        write : true,
        width : 6
      }
      // , {
      //   name : '操作类型',
      //   type : 'select2',
      //   id : 'optype',
      //   write : true,
      //   width : 6
      // }
      ],
      edit : [{
        name : 'API ID',
        type : 'input',
        id : 'apiid',
        write : false,
        width : 6
      }, {
        name : 'API 名称',
        type : 'input',
        id : 'apinm',
        write : true,
        width : 6
      }
      // , {
      //   name : '操作类型',
      //   type : 'select2',
      //   id : 'optype',
      //   write : true,
      //   width : 6
      // }
      , {
        name : 'API 状态',
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
  };


  var _height;
  var _fix_height_now;
  function bind_fix_size_event() {
    var api_content = $('#api_ide_content');
    var win = $(window).resize(fixsize).scroll(on_scroll);
    var _tree_code_height;
    var current_scroll = 0;

    $.ready(fixsize);
    fixsize();
    
    _fix_height_now = fixsize;
    
    function fixsize() {
      _height = win.height();
      _tree_code_height = _height - CUT_HEIGHT;
      $('#maintree').css('height', _tree_code_height);
      $('.fix_size').css('height', _tree_code_height + COMMENT_HEIGHT);
    }

    function on_scroll() {
      current_scroll = win.scrollTop();
      api_content.css('margin-top', current_scroll);
    }
  }
  bind_fix_size_event();


  /**工具方法*/
  var _tools = {
    // 调api
    _api : function(_param, _success, _nodata_cb) {
      if (!_param.apiid)
        return;
      var _p = $.extend(true, {}, _param.r_param);
      var _cb = function(msg) {
        if (msg) {
          _success && _success(msg);
        } else {
          _nodata_cb && _nodata_cb(msg);
        }
      };

      zy.g.am.mod = _param.modid || 'zymodule_ide';
      zy.g.am.app = _param.appid || 'zyapp_ide';
      var _apitype = _param.apitype || 'ide/';
      zy.net.post(_apitype + _param.apiid, _cb, _p);
    },
    // 生成jquery标签
    _label : function(_str) {
      var _q = '<' + _str + '></' + _str + '>';
      return $(_q);
    },
    //数组对象转换
    _arrToObj : function(_arr, _flg) {
      if (_flg) {
        var _t = {};
        $.each(_arr, function(_i, _v) {
          _t[_v] = true;
        });
      } else {
        var _t = [];
        $.each(_arr, function(_i, _v) {
          _t.push(_v);
        });
      }
      return _t;
    }
  };
  
  //JYM: 注解组件
  var DEFAULT_COMMENT_TEXT = '\n[递交到 '+ location.origin +']';
  var jComment = _tools._label('textarea').attr('placeholder', '修改原因').val(DEFAULT_COMMENT_TEXT);
  // 调用该方法将 jComment 与页面关联.
  function buildComment(appendToDom) {
    var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
    var _section = _tools._label('_section')
        .append(_tools._label('label').addClass('label').html('递交时的注解 (修改原因)'));
    var _label = _tools._label('label').addClass('textarea has-warning')
        .append(jComment)
        .append(_tools._label('b')
        .addClass('tooltip tooltip-bottom-right')
        .html('修改原因为必填项'));
    _section.append(_label);
    _form.append($('<fieldset></fieldset>').append(_section));
    appendToDom.append(_form);
    
    var tid = setInterval(function() {
      if (_form.height() <= 0) return;
      clearInterval(tid);
      COMMENT_HEIGHT = _form.height() || 105;
      // console.log("COMMENT_HEIGHT", COMMENT_HEIGHT, _form.height());
    }, 100);
  }
  
  //JYM: 字典缓存
  var __cache = {};
  function getDict(dictid, cb) {
    var ret = __cache[dictid];
    if (ret) return cb(ret);
    
    _tools._api({
      apitype : 'api/',
      apiid : 'getdict',
      appid : 'ZYAPP_LOGIN',
      modid : 'ZYMODULE_LOGIN',
      r_param : {
        typecd : dictid,
        // ADD: Jym. ZR.0031 一定在平台机构上
        orgid  : 'a297dfacd7a84eab9656675f61750078',
      }
    }, function(msg) {
      __cache[dictid] = msg;
      cb(msg);
    });
  }
  

  function _onLeave(_flg) {
    if (_flg) {
      // 关闭页面时提示
      window.onbeforeunload = function() {
        parent.$('body').removeClass('animated fadeOutUp');
        return '请确认代码已提交';
      };
    } else {
      window.onbeforeunload = null;
      $(window).unbind('resize');
      bind_fix_size_event();
    }
  }

  function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          var _heigth=window.screen.height;
          $('article').attr('style','overflow: auto;height:'+_heigth+'px;');
            $(window).resize(function(){
                $('article').attr('style','overflow: auto;height:'+_heigth+'px;');
            })
        }
    }

  function _dom(_id) {
    //
    //JYM: 修改, 不再弹出对话框, 而是将对话框显示于左下角.
    //
    function _saveform() {
      // function _formDom(_c) {
        
        // var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
        // var _sbtn = _tools._label('button').addClass('btn btn-primary').html('确定');
        // var _cbtn = _tools._label('button').addClass('btn btn-default').attr('data-dismiss', "modal").html('取消');
        // var _section = _tools._label('_section').append(_tools._label('label').addClass('label').html('注解'));
        // var _label = _tools._label('label').addClass('textarea has-warning').append(_tools._label('textarea').attr('placeholder', '修改原因').val('测试')).append(_tools._label('b').addClass('tooltip tooltip-bottom-right').html('修改原因为必填项'));
        // _section.append(_label);
        // _form.append($('<fieldset></fieldset>').append(_section));
        // _form.append($('<footer></footer>').append(_cbtn).append(_sbtn));
        // _c.append(_form);

        // _sbtn.unbind();
        // _sbtn.click(function() {
          // var _updatecmt = $(this).closest('form').find('textarea').val().trim();
          var _updatecmt = jComment.val().trim();
          if (_updatecmt === '')
            return zy.ui.msg('提示', '修改原因为必填项', 'w');
            
          var _id = $('#zy_tabs').children('div:visible').find('pre').attr('id');
          // $('#zy_tabs').children('div:visible').find('pre').attr("style","position: absolute;width: 500px;height: 400px;");
          var _contendid = $('#zy_tabs').children('div:visible').find('div').attr('id');
          var _editor = ace.edit(_id);
          zy.setEditorExOptions(_editor);
          
          $('#left-panel nav').bind('click', function() {
            _editor.destroy();
            _editor.container.remove();
          });
          var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
          
          if (_editor && _contendid) {
            $(this).btnDisable(true);
            _tools._api({
              apiid : zy.fix_api_name('ucode'),
              r_param : {
                contentid : _contendid,
                content : _editor.getValue().trim(),
                updatecmt : _updatecmt
              }
            }, function(msg) {
              if (msg) {
                $(this).btnDisable(false);
                zy.ui.msg('提示信息', msg.msg || 'API保存成功', 's');
                $('.modal').modal('hide');
                _apistatusbtn.trigger('show', '00');
              }
            })
          }
        // })
      // }

      // zy.net.loadHTML("ide/htmlide/ide_edit.html", _mod, function() {
      //   var _head = $('#ide_edit .modal-title');
      //   var _jq = $('#ide_edit .modal-body');
      //   _jq.empty();
      //   _formDom(_jq);
      //   $('#ide_edit').modal('show');
      // });
    }

    function _header(_c) {

      function _searchbtn() {

        function _funlist(_arr, _c) {
          $.each(_arr, function(_i, _v) {
            var _li = _tools._label('li').append(_tools._label('a').html(_v.name)).attr('id', _v.id);
            _c.append(_li);
          });
        }

        function _content() {
          var _tagert = $('#zy_tabs').closest('.row').children(':last');
          var _flg = false;
          if ($('#jarviswidget-fullscreen-mode').length > 0)
            _flg = true;
          _searchByContentResult(_tagert,_flg);
          _tagert.show()
          $('#zy_tabs').parent().trigger('size');
        }

        function _nameorid() {
          var _tagert = $('#zy_tabs').closest('.row').children(':last');
          var _flg = false;
          if ($('#jarviswidget-fullscreen-mode').length > 0)
            _flg = true;
          _searchByidResult(_tagert,_flg);
          _tagert.show();
          $('#zy_tabs').parent().trigger('size');
        }

        var _func = [{
          id : 'byid',
          name : '按 ID/名称 查找'
        }, {
          id : 'bycontent',
          name : '按 API 内容查找'
        }];
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', '功能表');
        var _btn = _tools._label('i').addClass('fa fa-align-justify dropdown-toggle').attr('data-toggle', 'dropdown');
        var _ul = _tools._label('ul').addClass('dropdown-menu pull-right');
        _div.append(_tools._label('div').addClass('btn-group').append(_btn).append(_ul));
        _funlist(_func, _ul);
        _ul.children().unbind();
        _ul.children().click(function() {
          if ($(this).attr('id') === 'byid')
            _nameorid();
          if ($(this).attr('id') === 'bycontent')
            _content();
        });
        return _div;
      }

      function _apistatusbtn() {

        function _onlineCheck(_c, _code) {
          _c.empty();
          if (_code === '50') {
            var _li = _tools._label('li').append(_tools._label('a').html('API已发布')).css({
              'text-align' : 'center',
              'vertical-align' : 'middle'
            });
            _c.append(_li);
            return false;
          }
          if (_code === '60') {
            var _li = _tools._label('li').append(_tools._label('a').html('API已下线')).css({
              'text-align' : 'center',
              'vertical-align' : 'middle'
            });
            _c.append(_li);
            return false;
          }
          return true;
        }

        function _eachResult(_arr, _c, _code) {
          _c.empty();
          $.each(_arr, function(_i, _v) {
            var _li = _tools._label('li').append(_tools._label('a').attr('href', 'javascript:void(0);').html(_v.name).attr('status', _v.id));
            if (_v.id == _code) {
              _li.children().addClass('editable-disabled');
              var _i = _tools._label('i').addClass('fa fa-gear fa-1x fa-spin');
              _li.children().append(_i);
            }
            _c.append(_li);

            _li.click(function() {
              var _this = this;
              if ($(this).find('i').length > 0)
                return;
              var _i = $(this).parent().find('i');
              var _contend = $('#zy_tabs').children('div:visible').find('div');
              var _stability = $(this).children().attr('status');
              _tools._api({
                apiid : 'updatestability',
                r_param : {
                  contentid : _contend.attr('id'),
                  stability : _stability
                }
              }, function(msg) {
                _contend.attr('stability', _stability);
                zy.ui.msg('提示', '修改成功', 's');
                if (_i.length > 0)
                  $(_this).children().append(_i);
                else
                  $(_this).children().append(_tools._label('i').addClass('fa fa-gear fa-1x fa-spin'));
              })
            })
          });
        }

        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '更改状态');
        _div.append(_tools._label('div').addClass('btn-group'));
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-cloud-upload dropdown-toggle').attr('data-toggle', 'dropdown');
        var _ul = _tools._label('ul').addClass('dropdown-menu pull-right');
        
        // JYM: 修正读取两次字典
        var _loading_dict;
        _div.unbind('show');
        _div.bind('show', function(e, _stability) {
          if (_loading_dict) return;
          _loading_dict = true;
          
          getDict('ZR.0031', function(msg) {
            try {
              var _apistatusbtn = $('#widget-grid')
                  .find('header .glyphicon-cloud-upload')
                  .closest('.widget-toolbar');
                  
              if (_onlineCheck(_apistatusbtn.find('ul'), _stability)) {
                _eachResult(msg.result[0]['ZR.0031'], _apistatusbtn.find('ul'), _stability);
              }
              
              _apistatusbtn.show();
            } catch(e) {
              console.error("ide/htmlide/ide.js", e);
            } finally {
              _loading_dict = false;
            }
          });
        })
        return _div.children().append(_btn).append(_ul).parent();
      }

      function _leftbtn() {
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', 'API 列表');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-folder-open');
        _btn.unbind();
        _btn.click(function() {
          if (_tree.container.is(':visible')) {
            $(this).children().removeClass().addClass('glyphicon glyphicon-chevron-right');
            _tree.container.hide();
          } else {
            $(this).children().removeClass().addClass('glyphicon glyphicon-chevron-left');
            _tree.container.show();
          }
          $('#zy_tabs').parent().trigger('size');
        });
        return _div.append(_btn);
      }

      function _savebtn() {
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '保存');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-saved');
        _btn.unbind();
        _btn.click(function() {
          _mod.empty();
          _saveform();
        })
        return _div.append(_btn);
      }
      
      function _hisbtn(){
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '历史');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-calendar');
        _btn.unbind();
        _btn.click(function() {
          var _id = $('#zy_tabs').children('div:visible').find('pre').attr('id');
          
          
          zy.net.loadHTML('ide/htmlide/ide_his.html',_mod,function(){
            his(_id);
          })
          // alert('历史模态预留');
        })
        return _div.append(_btn);
      }
      
      function _testbtn(){
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '测试');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-play');
        _btn.unbind();
        
        _btn.bind('_init',function(e,node,help_info){
          
          _btn.unbind('click');

          if(node){
            _btn.click(function() {
              var _t={
                appid:node.appid,
                moduleid:node.moduleid,
                apiid:node.apiid
              };
              zy.g.am.app='ZYAPP_IDE'
              zy.g.am.mod='ZYMODULE_IDE'
              zy.net.get('api/getapiinfo',function(msg){
                help_info = msg.result[0].help_info;
              },_t,null,function(msg){
                // zy.log(msg);
              });
              runApiTest(node, help_info);
            })
          }
        })

        return _div.append(_btn);
      }
      
      // 公告信息按钮
      function _messagebtn(){
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', 'API返回通用数据结构');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-list-alt');
        _btn.unbind();
        _btn.click(function() {
          zy.net.loadHTML('ide/htmlide/ide_message.html',_mod,function(){
          })
        })
        return _div.append(_btn);
      }

      _c.append(_searchbtn());
      _c.append(_savebtn());
      _c.append(_testbtn());
      _c.append(_hisbtn());
      _c.append(_apistatusbtn());
      _c.append(_leftbtn());
      _c.append(_messagebtn());
    }

    function _treeDom() {
      function _innerHeader(_container){
        var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style','width:100%;margin-bottom:-15px');
        var _title = _tools._label('header');
        _title.append(_tools._label('label').html('API 列表'))
          .append(_tools._label('a').attr('href','javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
        _container.append(_div.append(_title));
        _container.append(_tools._label('legend'));
        _title.children('a').unbind();
        _title.children('a').click(function(){
          var _target = $(this).closest('.col-sm-3');
          _target.hide();
          _target.parent().children(':eq(1)').trigger('size');
        })
      }

      var _tree = _tools._label('div').addClass('col-xs-12 col-sm-3');
      _innerHeader(_tree);
      var _ul = _tools._label('ul').addClass('ztree').attr('id', 'maintree');
      _tree.append(_tools._label('div').attr('style','overflow: auto;').addClass('row').css('margin-top', '-15px').append(_ul));
      buildComment(_tree);//JYM
      
      return {
        container : _tree,
        ul : _ul
      };
    }

    function _searchByContentResult(_container,_flg){

      _container.empty();

      function _innerHeader(){
        var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style','width:100%;margin-bottom:-15px');
        var _title = _tools._label('header');
        _title.append(_tools._label('label').html('按内容查询'))
          .append(_tools._label('a').attr('href','javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
        _container.append(_div.append(_title));
        _container.append(_tools._label('legend'));
        _title.children('a').unbind();
        _title.children('a').click(function(){
          var _target = $(this).closest('.col-sm-3');
          _target.hide();
          _target.parent().children(':eq(1)').trigger('size');
        })
      }

      function _closeSearch(_btn) {
        _btn.unbind();
        _btn.click(function() {
          var _mid = $(this).closest('div');
          _mid.hide();
          _mid.next().hide();
          _mid.prev().hide();
        })
      }

      function _searchApi(_btn, _in) {
        if (!_btn && !_in)
          return;
        _btn.unbind();
        _btn.click(function() {
          var _flg = _in.prop('checked');
          var _api = {};
          _api.apiid = 'querycontent';
          _api.r_param = {
            roleid:roleid,
            content : _input.val(),
            casesensitive : _flg
          };
          _tools._api(_api, function(msg) {
            _ulSearch.siblings().remove();
            _ulSearch.empty();
            if (msg.result.length === 0)
              _ulSearch.parent().append(_tools._label('div').css({
                'text-align' : 'center',
                'vertical-align' : 'middle'
              }).html('空'));
            else
              _treeClass({
                tree : {
                  ztree : _ulSearch
                },
                mod : _mod
              }, msg.result);
            _ulSearch.parent().siblings(':hidden').show();
            _ulSearch.parent().show();
          })
        })
      }

      _innerHeader();
      var _ulSearch = _tools._label('ul').addClass('ztree').attr('id', 'resulttree');
      var _search = _tools._label('div').addClass('smart-form').attr('style','margin-top:-10px');
      _container.append(_search);
      _container.append(_tools._label('legend'));
      var _input = _tools._label('textarea ').attr('placeholder', '内容').attr('rows', '3');
      var _label = _tools._label('_label').addClass('glyphicon glyphicon-search').attr('rel', 'tooltip').attr('title', '查询');
      var _btn = _tools._label('button').addClass('btn btn-default btn-xs pull-right').attr('style','margin-top:5px;margin-right:14px').html('查询');
      var _i = _tools._label('i').addClass('fa fa-times pull-right').attr('style', 'margin-right:13px');
      var _check = _tools._label('label').addClass('toggle state-error pull-left').attr('style','margin:4px 0 0 5px');
      _check.append(_tools._label('input').attr('type','checkbox')).append(_tools._label('i').attr({'data-swchoff-text':'off','data-swchon-text':'on','title':'区分大小写'}));
      _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;display:none').append(_tools._label('h').attr('style', 'margin-left:20px').html('查询结果')).append(_i));
      
      var _style;
      if(_flg) _style = 'overflow:auto;display:none;height:';
      else     _style = 'overflow:auto;display:none;height:';
      _style += (_height-400) + 'px';

      _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
      _search.append(_tools._label('label').addClass('textarea').append(_input));
      _search.append(_tools._label('div').addClass('row').attr('style','margin-bottom:-10px').append(_check).append(_btn));

      _closeSearch(_i);
      _searchApi(_btn,_check.children('input'));
    }

    function _searchByidResult(_container,_flg) {

      function _innerHeader(){
        var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style','width:100%;margin-bottom:-15px');
        var _title = _tools._label('header');
        _title.append(_tools._label('label').html('按name/id查询'))
          .append(_tools._label('a').attr('href','javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
        _container.append(_div.append(_title));
        _container.append(_tools._label('legend'));
        _title.children('a').unbind();
        _title.children('a').click(function(){
          var _target = $(this).closest('.col-sm-3');
          _target.hide();
          _target.parent().children(':eq(1)').trigger('size');
        })
      }

      _container.empty();

      function _closeSearch(_btn) {
        _btn.unbind();
        _btn.click(function() {
          var _mid = $(this).closest('div');
          _mid.hide();
          _mid.next().hide();
          _mid.prev().hide();
        })
      }

      function _searchApi(_btn, _in) {
        if (!_btn && !_in)
          return;
        _btn.unbind();
        _btn.click(function() {
          var _flg = _in.prop('checked');
          var _api = {};
          _api.apiid = 'queryidorname';
          _api.r_param = {
            roleid:roleid,
            type : _flg ? 'mod' : 'api',
            content : _input.val()
          };
          _tools._api(_api, function(msg) {
            _ulSearch.siblings().remove();
            _ulSearch.empty();
            if (msg.result.length === 0)
              _ulSearch.parent().append(_tools._label('div').css({
                'text-align' : 'center',
                'vertical-align' : 'middle'
              }).html('空'));
            else
              _treeClass({
                tree : {
                  ztree : _ulSearch
                },
                mod : _mod
              }, msg.result);
            _ulSearch.parent().siblings(':hidden').show();
            _ulSearch.parent().show();
          })
        })
      }

      function _onoffswitch() {
        var _span = _tools._label('span').addClass('onoffswitch');
        var _input = _tools._label('input').addClass('onoffswitch-checkbox').attr('type', 'checkbox').attr('name', 'start_interval').attr('id', 'start_interval');
        var _label = _tools._label('label').addClass('onoffswitch-label').attr('for', 'start_interval');
        _label.append(_tools._label('span').addClass('onoffswitch-inner').attr('data-swchoff-text', 'Api').attr('data-swchon-text', 'Mod')).append(_tools._label('span').addClass('onoffswitch-switch'));
        _span.append(_input).append(_label);
        return {
          container : _span,
          input : _input
        };
      }

      _innerHeader();
      var _ulSearch = _tools._label('ul').addClass('ztree').attr('id', 'resulttree');
      var _search = _tools._label('div').addClass('input-group input-group-sm').attr('style','margin:-10px 0-5px');
      var _onoffswitch = _onoffswitch();
      _container.append(_search);
      _container.append(_tools._label('legend'));
      _search.append(_tools._label('span').addClass('input-group-addon').append(_onoffswitch.container));
      var _input = _tools._label('input').addClass('form-control').attr('placeholder', '查询').attr('type', 'text');
      var _label = _tools._label('_label').addClass('glyphicon glyphicon-search').attr('rel', 'tooltip').attr('title', '查询');
      var _btn = _tools._label('button').addClass('btn btn-default').html('查询');
      var _i = _tools._label('a').attr('href','javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')).attr('style', 'margin-right:13px');
      _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;display:none').append(_tools._label('h').attr('style', 'margin-left:20px').html('查询结果')).append(_i));
      var _style = 'overflow:auto;display:none;height:';
      if(_flg)
        _style = 'overflow:auto;display:none;height:';
      _style += (_height-300) + "px";
      _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
      _search.append(_tools._label('div').addClass('icon-addon addon-sm').append(_input).append(_label));
      _search.append(_tools._label('span').addClass('input-group-btn').append(_btn));

      _closeSearch(_i);
      _searchApi(_btn, _onoffswitch.input);
    }

    function _toolbar() {

      function _button(_str, _click) {
        var _a = _tools._label('a').addClass('btn btn-labeled btn-success pull-right').attr('href', 'javascript:void(0);').css('margin-right', '17px');
        var _span = _tools._label('span').addClass('btn-label');
        var _i = _tools._label('i').addClass('glyphicon glyphicon-ok');
        _a.append(_span.append(_i)).append('提交');
        _a.click(function() {
          _click && _click($(this));
        })
        return _a;
      }

      function _saveBtn(_btn) {
        if (editor && editor.contentid) {
          _btn.btnDisable(true);
          _tools._api({
            apiid : zy.fix_api_name('ucode'),
            r_param : {
              contentid : editor.contentid,
              content : editor.get(),
              updatecmt : ''//api更改说明
            }
          }, function(msg) {
            if (msg) {
              _btn.btnDisable(false);
              zy.ui.msg('提示信息', msg.msg || 'API保存成功', 's');
            }
          })
        }
      }

      var _toolbar = _jq.find('.jarviswidget-editbox');
      var _div = _tools._label('div').addClass('row');
      _div.append(_button('提交', _saveBtn));
      _toolbar.append(_div);

    }

    function _form(_c, _arr) {
      var _t = $.extend(true, {}, _arr);
      var _result = _list(_t);

      function _footer(_form) {
        var _footer = _tools._label('footer');
        var _btnC = _tools._label('button').addClass('btn btn-default').attr('data-dismiss', 'modal').html('取消');
        var _btnS = _tools._label('button').addClass('btn btn-primary').attr('name', 'ide_submit').html('确定');
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
          var _section = _tools._label('section').addClass('col col-' + _obj.width);
        else
          var _section = _tools._label('section');
        var _labelnm = _tools._label('label').addClass('label').html(_obj.name);
        if (_obj.type === 'textarea') {
          var _labelcon = _tools._label('label').addClass('textarea has-warning');
          var _input = _tools._label('textarea').attr('name', _obj.id).attr('placeholder', _obj.name);
        } else {
          var _labelcon = _tools._label('label').addClass('input has-warning');
          var _input = _tools._label('input').attr('name', _obj.id).attr('type', _obj.type).attr('placeholder', _obj.name);
        }
        if (_input.attr('type') === 'select2')
          _input.attr('type', 'input');
        if (!_obj.write)
          _input.attr('readonly', 'readonly');
        var _b = _tools._label('b').addClass("tooltip tooltip-bottom-right").html(_obj.name + '为必填项');
        _labelcon.append(_input).append(_b);
        _section.append(_labelnm).append(_labelcon);
        return _section;
      }

      function _check(_num) {
        var _t = _num / 2;
        return Math.round(_t) === _t;
      }

      function _select2(_arr) {
        $.each(_arr, function(_i, _v) {
          if (_v.id === 'status')
            zy.cache.initDicts('ZR.0001', function () {
              _form.find('[name=' + _v.id + ']').zySelect('ZR.0001', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '1');
            });
          if (_v.id === 'auflag')
            zy.cache.initDicts('ZR.0029', function () {
              _form.find('[name=' + _v.id + ']').zySelect('ZR.0029', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '0');
            });
          // if (_v.id === 'optype')
          //   zy.cache.initDicts('ZR.0010', function () {
          //     _form.find('[name=' + _v.id + ']').zySelect('ZR.0010', false, { allowClear: false, width: '100%' });
          //     _form.find('[name=' + _v.id + ']').select2('val', '0');
          //   });
        });
      }

      var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
      var fieldset=$('<fieldset></fieldset>')
      _form.append(fieldset);

      $.each(_result.half, function(_i, _v) {
        var _n = _i / 2;
        if (_check(_i)) {
          var _row = _tools._label('div').addClass('row');
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
          _row = _tools._label('div').addClass('row');
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

    function _toolbarDom() {
    }

    var _jq = $('#' + _id);
    var _mod = _tools._label('div');
    _mod._form = _form;
    
    //
    // JYM: 缓存api测试页, 使之打开更快
    //
    var ide_run_html_cache;
    zy.net.loadHTML('ide/htmlide/ide_run.html',_mod,function(r){
      ide_run_html_cache = r;
    });
    // 打开测试页
    function runApiTest(node, help_info) {
      _mod.html(ide_run_html_cache);
      RunApi(node, help_info);
    }
    
    var _row = _tools._label('div').addClass('row');
    var _ideC = _tools._label('div').addClass('col-xs-12 col-sm-9').css({
      // 'height' : '460px'
    });
    _ideC.unbind();
    _ideC.bind('size', function(e) {
      $(this).removeClass();
      var _t = $(this).siblings(':visible');
      if (_t.length > 0) {
        var _total = 0;
        $.each(_t, function(_i, _v) {
          _total += Number($(_v).attr('class').replace(/col-xs-12 col-sm-/g, ''));
        });
        $(this).addClass('col-xs-12 col-sm-' + (12 - _total));
      } else {
        $(this).addClass('col-xs-12 col-sm-12');
      }
    });
    var _pre = _tools._label('pre').attr('id', 'zy_ide_editor');
    var _toolbar = _tools._label('div').addClass('col-xs-12 col-sm-3').css({
      'display' : 'none'
    });
    var _tree = _treeDom();
    _jq.closest('#widget-grid').after(_mod);
    _pre.attr('style', 'font-family:Consolas,Microsoft YaHei,微软雅黑,sans-serif,宋体;top:-14;height:100%; width:100%;');
    _row.append(_tree.container).append(_ideC).append(_toolbar);
    _jq.find('.widget-body').empty().append(_row);
    _header(_jq.children('header'));
    return {
      wid : _jq,
      tree : {
        ztree : _tree.ul,
        container : _tree.container,
        sResultCon : _tree.sResult
      },
      pre : _ideC,
      mod : _mod,
      result : _toolbar
    }
  }

  function _ide(_pre) {
    var _savebtn = $('#widget-grid').find('header .glyphicon-saved');
    function _setValue(_str, _flg) {
      editor.setValue(_str + "\n\n\n\n\n");
      editor.navigateFileStart();
      editor.setReadOnly(_flg);
      // J.ym 修正 undo 操作将代码清除.
      setTimeout(function() {
        editor.getSession().getUndoManager().reset();
      }, 1);
    }

    function _getValue() {
      return editor.getValue().trim();
    }

    var _nid = _pre.attr('id');
    var editor = ace.edit(_nid);
    $('#left-panel nav').bind('click', function() {
      editor.destroy();
      editor.container.remove();
    });
    editor.setTheme("ace/theme/ambiance");
    editor.getSession().setMode("ace/mode/sjs");
    editor.$blockScrolling = Infinity;
    zy.setEditorExOptions(editor, 'api');
    // editor.setOptions({
    //   enableBasicAutocompletion: true,
    //   enableSnippets: true,
    //   enableLiveAutocompletion: true,
    // });
   
   function _initsize(){
    editor.setShowPrintMargin(false);
    editor.setFontSize(13.5);
    editor.setHighlightSelectedWord(true);
    editor.setOption("wrap", EDITOR_WRAP_SIZE);
    editor.setOption("tabSize", 2);
    editor.resize();
   }

    editor.commands.addCommand({
      name: 'myCommand',
      bindKey: {
        win: 'Ctrl+S',
        mac: 'Command+S'
      },
      exec: function (editor) {
        _savebtn&&_savebtn.trigger('click');
      }
    });

    return {
      initSize:_initsize,
      get : _getValue,
      set : _setValue
    };
  }

  function _treeClass(_d, _data) {
    var _jq = _d.wid;
    var _ul = _d.tree.ztree;
    var _mod = _d.mod;

    function _updateTwoTree(_node, _flg, msg) {
      var _main = $.fn.zTree.getZTreeObj("maintree");
      var _result = $.fn.zTree.getZTreeObj("resulttree");
      var _mainNode = _main && _main.getNodeByParam("someid", _node.someid, null);
      var _resultNode = _result && _result.getNodeByParam("someid", _node.someid, null);
      if (_flg) {
        if (_mainNode) {
          $.extend(true, _mainNode, msg);
          _main.updateNode(_mainNode);
        }
        if (_resultNode) {
          $.extend(true, _resultNode, msg);
          _result.updateNode(_resultNode);
        }
      } else {
        if (_mainNode)
          _main.addNodes(_mainNode, msg);
        // if (_resultNode)
        //   _result.addNodes(_resultNode, msg);
      }
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

    var _tree = null;

    function _initEvent(_form, _node, _flg) {
      function _checkContent(_form) {
        var _flg = true;
        _form.children().find('input').each(function(_i, _v) {
          var _name = $(_v).attr('name');
          if (_name && _name !== 'updatedt' && _name !== 'createdt' && _name === '') {
            zy.ui.msg('提示', $(_v).attr('placeholder') + '不可为空', 'w');
            _flg = false;
          } else if(_name && _name === 'apiid'){
            var reg = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
            if(!$(_v).val().match(reg)){
              zy.ui.msg('提示', 'apiid请以字母或下划线"_"开始！', 'w');
              _flg = false;
            }
          }
        })
       
        return _flg;
      }

      var _jq = _form;
      if (_flg){
        
        var _t={
          appid:_node.appid,
          moduleid:_node.moduleid,
          apiid:_node.apiid
        };
        zy.g.am.app='ZYAPP_IDE'
        zy.g.am.mod='ZYMODULE_IDE'
        zy.net.get('api/getapiinfo',function(msg){
          // zy.log(msg.result[0].help_info)
        $.each(msg.result[0], function(_i, _v) {
          // zy.log(_node)
          var _t = _jq.find('[name=' + _i + ']')
          if (_t.length > 0) {
            if (_t.hasClass('select2-offscreen'))
              _t.select2('val', _v);
            else
              _t.val(_v.replace(/\.0/g,''));
          }
        });
        },_t,null,function(msg){
          // zy.log(msg)
        });
      }
      var _btn = _jq.find('[name=ide_submit]');
      _btn.unbind();
      _btn.click(function() {
        
        if (!_checkContent(_form)){
          return;
        }
        
        var _type = $(this).closest('.modal-content').find('h4').text() === '修改' ? 1 : 0;
        var _o = {};
        var _t = {
          type : _type
        };
        if (_node.appid)
          _t.appid = _node.appid;
        if (_node.moduleid)
          _t.moduleid = _node.moduleid;
          
        _o.apiid = _checkLevel(_node, Boolean(_type));
        _o.r_param = $.extend(true, {}, _t, _paramObject(_form));
        _o.r_param.roleid = roleid;
        // zy.log(_paramObject(_form));
        _tools._api(_o, function(msg) {
          _updateTwoTree(_node, Boolean(_type), msg.result[0]);
          zy.ui.msg('提示信息', '成功', 's');
          $('.modal').modal('hide');
        })
      })
    }

    function _editModal(_node) {
      zy.net.loadHTML("ide/htmlide/ide_edit.html", _mod, function() {
        var _level = _checkLevel(_node, true);
        var _head = $('.modal-title');
        _head.html('修改');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();
        _mod._form($('#ide_edit .modal-body'), _domLabel[_level].edit);
        $('#ide_edit').modal('show');
        _initEvent(_mod.find('form'), _node, true);
        if(_level=='api')
          api_help.button(_mod.find('fieldset'),$('#modal_container3'),$(_mod.find('textarea')[0]),_node);
      });
    }

    function _addModal(_node) {
      zy.net.loadHTML("ide/htmlide/ide_edit.html", _mod, function() {
        
        var _level = _checkLevel(_node, false);
        var _head = $('.modal-title');
        _head.html('新增');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();
        _mod._form($('#ide_edit .modal-body'), _domLabel[_level].add);
        $('#ide_edit').modal('show');
        _initEvent(_mod.find('form'), _node, false);
        var textatra=$('<textarea>').attr('style','display:none').attr('name','help_info');
        
        
        _mod.find('fieldset').append(textatra)
        // if(_level=='api')
        //   api_help.button(_mod.find('fieldset'),$('#modal_container3'),_mod.find('textarea'),_node);
      });
    }

    function _treeOption() {
      return {
        view : {
          showTitle : true,
          selectedMulti : false,
          showIcon : true,
          dblClickExpand : false
        },
        data : {
          key : {
            name : 'appnm',
            title : 'showid'
          },
          simpleData : {
            enable : false
          }
        },
        edit : {
          drag : {
            isCopy : false,
            isMove : false
          },
          showRenameBtn : false,
          showRemoveBtn : false,
          enable : true,
        }
      };
    }

    function _clear(_parent) {
      _parent.empty();
    }

    function _fromServer(_id, _cb, _flag) {
      var _f = true;
      if ( typeof _flag !== 'undefined')
        _f = _flag;

      function _children(_arr) {
        $.each(_arr, function(_i, _v) {
          _v.isParent = true;
        });
      }


      _tools._api({
        apiid : 'apis',
        r_param : {
          roleid:roleid,
          id : _id
        }
      }, function(msg) {
        var _result = msg;
        if (!_result.value)
          return;
        if (_f)
          _children(_result.value)

        _cb && _cb(_result.value);
        _fix_height_now();
      })
    }

    function _code(_obj, _cb) {
      var _info = {
        apiid : zy.fix_api_name('scode')
      }
      _info.r_param = _obj;
      _tools._api(_info, function(msg) {
        // zy.log(msg);
        var _result = msg;
        _cb && _cb(_result.content[0]);
      })
    }

    function _click(_e, _id, _node, _flag) {
      return;
    }

    function _dbClick(_e, _id, _node) {
      if (!_node)
        return;
      var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
      var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
      var _hisbtn = $('#widget-grid').find('header .glyphicon-calendar').parent();
      var _runbtn = $('#widget-grid').find('header .glyphicon-play');
      if (_node.hisid)
        _code({
          hisid : _node.hisid
        }, function(_m) {
           var _id=_node.hisid+_node.apiid+_node.moduleid+_node.appid;
          var _pre = _tab.add(_node.apiid + '-'+ _node.appnm.replace(/[\(（][^\)）]+[\)）]/g,''),_node.hisid, _m.stability,_id);
          _pre.inputc.val(_m.updatecmt);
          _initIde(function() {
            editor.set(_m.content, true);
            editor.initSize();
            _savebtn.hide();
            _hisbtn.hide();
            _runbtn.parent().hide();
            _apistatusbtn.hide();
          }, _pre.pre);
        });
      if (_node.contentid)
        _code({
          contentid : _node.contentid
        }, function(_m) {
          try {
            var _id=_node.apiid + '--' +_node.moduleid + '--'+_node.appid;
            var _pre = _tab.add(_node.apiid, _node.contentid, _m.stability, _id);
            _pre.inputc.val(_m.updatecmt);
            _pre.pre.attr('help_info',_m['help_info']);
            
            _initIde(function() {
              _apistatusbtn.trigger('show', [_m.stability]);
              editor.initSize();
              editor.set(_m.content, false);
              _savebtn.show();
              _hisbtn.show();
              _runbtn.parent().show();
              _runbtn.trigger('_init',[_node,_m['help_info']]);
            }, _pre.pre);
          } catch(e) {
            console.log("ide/htmlide/ide.js", e);
            zy.ui.msg('IDE 打开错误', 'ID 使用了中文可能出错, 检查 app/module/api 的 id 是否正确.', 'e');
            throw e;
          }
        });
    }

    function _expand(_e, _id, _node) {
      // zy.log(_node);
      var _flg = _node.contentid ? false : true;
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
      var sObj = $("#" + _node.tId + "_span");
      if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0)
        return;
      var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
      var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
      if (_node.moduleid && !_node.apiid)
      sObj.after(addStr);
      if(_node.contentid)
      sObj.after(editStr);



      $('#addBtn_' + _node.tId).bind("click", function() {
        _tree.selectNode(_node);
        _addModal(_node);
        return false;
      })
      $('#editBtn_' + _node.tId).bind('click', function() {
        _tree.selectNode(_node);
        _editModal(_node);
        return false;
      })
    }

    function _removeHoverDom(_id, _node) {
      $("#addBtn_" + _node.tId).unbind().remove();
      $("#editBtn_" + _node.tId).unbind().remove();
    }

    var _setting = _treeOption();
    _setting.callback = {
      //    onClick : _click, //双击是两次单击.. 两个事件不可同时使用
      onExpand : _expand,
      onClick : _dbClick,
      onDblClick : _click
    }
    _setting.view.addHoverDom = _addHoverDom;
    _setting.view.removeHoverDom = _removeHoverDom;

    _clear(_ul);

    if (_data) {
      _tree = $.fn.zTree.init(_ul, _setting, _data);
    } else
      _fromServer('', function(_m) {
        if(_m.length != 0){
          var _result = [];
          _result[0] = {
            appnm : '智云',
            children : _m,
            open : true,
            showid: '智云'
          }
          _tree = $.fn.zTree.init(_ul, _setting, _result); 
        }
        
        if(_m.length == 0) 
          _ul.after($('<div style="text-align: center; vertical-align: middle;">空</div>'));
      });
  }

  function _event(_c) {

    $('#left-panel a[href]').one('click', function() {
      window.onbeforeunload = null;
      $(window).unbind('resize');
      bind_fix_size_event();
    });

    var _treeContainer = _c.tree.container;
    var _ideContainer = $('#zy_tabs').parent();
    var _fullBtn = _c.wid.find('.jarviswidget-fullscreen-btn');

    _fullBtn.click(function() {
      var _resultContainer = _c.result.find('div:has(ul)');
      window.ee = _resultContainer;
      var _preContainer = $('#zy_tabs').find('div.row:has(pre)');
      var _ideTrueC = $('#zy_tabs').find('p').children();

      if($('pre').length != 0){
        var _pre=$('#zy_tabs').children('div:visible').find('pre');
        var id=$('#zy_tabs').children('div:visible').find('pre').attr('id');
      }

      if ($('#jarviswidget-fullscreen-mode').length > 0) {
        if($('pre').length != 0){
          editor=ace.edit(id);
          $('#left-panel nav').bind('click', function() {
            editor.destroy();
            editor.container.remove();
          });
          editor.setOption('wrap', EDITOR_WRAP_SIZE);
          editor.setOption('tabSize',2);
          _ide(_pre);
          zy.setEditorExOptions(editor);
        }

        var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
        s = s.replace(/530/,'435');
        $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);

        bind_fix_size_event(false);
      } else {
        if($('pre').length != 0){
          editor=ace.edit(id);
          $('#left-panel nav').bind('click', function() {
            editor.destroy();
            editor.container.remove();
          });
          editor.setOption('wrap', EDITOR_WRAP_SIZE);
          editor.setOption('tabSize',2);
          _ide(_pre);
          zy.setEditorExOptions(editor);
        }

        var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
        s = s.replace(/435/,'530');
        $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);

        var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
        s = s.replace(/435/,'525');
        $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);

        bind_fix_size_event(true);
      }
    })
  }

  function _initIde(_cb, _pre) {
    zy.net.loadScript.call(this, "lib/js/ace/1.2.9/ace.js", function() {// loadScript方法改变了上下文..
      editor = _ide(_pre);
      _cb && _cb();
    })
  }

  function _tabs(_d) {

    function _delBtnEvent(_btn) {
      _btn.click(function() {
        var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
        var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
        var _hisbtn = _d.wid.children('header').find('.glyphicon-calendar').parent();
        var _runbtn = _d.wid.children('header').find('.glyphicon-play');
        if (_count(_tab) == 1) {
          _onLeave(false);
          _apistatusbtn.hide();
          _hisbtn.hide();
          _runbtn.parent().hide();
          _savebtn.hide();
        }
      })
    }

    function _tabEvent() {
      _tab.el.on("tabsbeforeactivate", function(event, ui) {
        var _tagert = ui.newPanel.children().children();
        var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
        var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
        var _hisbtn = _d.wid.children('header').find('.glyphicon-calendar').parent();
        var _runbtn = _d.wid.children('header').find('.glyphicon-play');
        if (_tagert.attr('id')) {
          _apistatusbtn.trigger('show', [_tagert.attr('stability')]);
          _runbtn.parent().show();
          // zy.log(ui.newPanel);
          var _id = ui.newPanel.find('pre').attr('id') || '';
          var help_info = ui.newPanel.find('pre').attr('help_info') || '';
          if(_id!=''){
            var app = _id.split('--')[2];
            var mod = _id.split('--')[1];
            var api = _id.split('--')[0];
            _runbtn.trigger('_init',[{appid:app,moduleid:mod,apiid:api},help_info])
          }
          _savebtn.show();
          _hisbtn.show();
          _apistatusbtn.show();
        } else {
          _runbtn.parent().hide();
          _savebtn.hide();
          _hisbtn.hide();
          _apistatusbtn.hide();
        }
      });
    }

    function _count(_tab) {
      return _tab.getCount();
    }

    function _add(_nm, _contentid, _stability,_id) {
      _onLeave(true);
      var _pre = _tools._label('pre');
      _pre.attr('style', 'font-family:Consolas,Microsoft YaHei,微软雅黑,sans-serif,宋体;top:-14;height:100%; width:100%;').attr('id', _id);

      // var _height = $('#jarviswidget-fullscreen-mode').length > 0 ? 'height:500px' : 'height:400px';
      // var _preheight = $('#jarviswidget-fullscreen-mode').length > 0 ? '500px' : '400px';
      // var _height = _height
      var _preheight = _height - 200;

      var _input = _tools._label('input').addClass('form-control').attr('readonly', 'readonly');
      var _in_div = _tools._label('div').addClass('row').css('height', _preheight).append(_pre).addClass('fix_size');
      var _div = _tools._label('div').attr('style', _height).append(_in_div);
      if (_contentid)
        _div.attr('id', _contentid);
      if (_stability)
        _div.attr('stability', _stability);
      var _num = _tab.AddTab(_id, _nm, true, _div);
      // zy.log('a'+_id);
      if (_num) {
        _tab.active(_num);
        return {
          pre : _tab.el.find('[aria-hidden=false]').find('pre'),
          inputc : _input
        }
      } else {
        _delBtnEvent(_tab.el.find('li[aria-selected=true]').find('.hover-transparent:has(i)'));
        return {
          pre : _pre,
          inputc : _input
        }
      }
    }

    var _c = _d.pre;
    var _tab = new zyTabs(_c);
    _tabEvent();

    return {
      add : _add,
      eventOn : _tabEvent,
      delbtn : _delBtnEvent
    }
  }

  var _d = _dom('ide'), editor;
  var _tab = _tabs(_d);
  browserRedirect();
  _treeClass(_d);
  pageSetUp();
  _event(_d);
};