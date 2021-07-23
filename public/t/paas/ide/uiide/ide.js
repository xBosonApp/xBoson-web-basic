(function ($, zy) {

    // 如果历史记录功能不正确, 则修改这个配置
    var splitBasePath = 'web4node'
    var basePathOnServer = '$';
    var enableFileType = { '':1, 'html':1, 'htm':1, 'md':1, 'pug':1 };
    var ACE_PATH = "lib/js/ace/1.4.2/ace.js";
    var upload_html = $("#uploadfile_html_template").html();
    var allow_file_ext;
    var max_post_body = 0;
    var last_select_filetype;
      
    // 文件扩展名对应的 ace 语言解释器
    // 扩展名与解释器名称相同时自动映射(不用写)
    // 没有扩展名使用 'html'
    var aceFileTypeMapping = {
      'htm' : 'html',
      'md'  : 'markdown',
      'ts'  : 'typescript',
      'vue' : 'html',
      'styl': 'stylus',
      'pug' : 'jade',
      'js'  : 'javascript',
    };
    
    var _domLabel = {
        edit: [
            {
                name: '名称',
                id: 'filenm',
                type: 'input',
                write: true,
                width: 6
            },
            {
                name: '类型',
                id: 'type',
                type: 'input',
                write: true,
                width: 6
            }
        ]
    };
    
    //
    // ADD by J.ym 17.12.16
    //
    var get_api_url;
    if (zy.isXBosonSystem) {
        get_api_url = function(_api_name) {
            return zy.g.host.api +'app/'+ zy.g.comm.org 
                +"/ZYAPP_IDE/ZYMODULE_UI_IDE/"+ _api_name;
        };
    } else {
        get_api_url = function(_api_name) {
            return  'http://' + location.host + '/api/' + _apinm;
        };
    }
    
    function setEditorOptions(editor) {
      zy.setEditorExOptions(editor);
    }
    
    zy.net.get('app/a297dfacd7a84eab9656675f61750078/ZYAPP_IDE/ZYMODULE_UI_IDE/file_ext_allow', function(m) {
      allow_file_ext = m.data || {};
      max_post_body = m.max_post_body || 0;
    });
    

    //
    // Add by J.ym 17.12.19
    // ide 窗口固定与浏览器窗口同步大小
    //
    var _top_height = 220;
    var _top_height_fullscreen = 100;
    var _height;
    function bind_fix_size_event() {
        var ide = $('#ide');
        var win = $(window).resize(fixsize).scroll(on_scroll);
        var _tree_code_height;
        var current_scroll = 0;
        
        ide.find('.jarviswidget-fullscreen-btn').click(function() {
          setTimeout(fixsize, 1);
        });
        $.ready(fixsize);
        fixsize();
        
        function fixsize() {
            var isfullscreen = $('#jarviswidget-fullscreen-mode').length > 0;
            _height = win.height();
            if (isfullscreen) {
              _tree_code_height = _height - _top_height_fullscreen;
            } else {
              _tree_code_height = _height - _top_height;
            }
            $('#maintree').css('height', _tree_code_height);
            $('.fix_size').css('height', _tree_code_height);
        }

        function on_scroll() {
            current_scroll = win.scrollTop();
            ide.css('margin-top', current_scroll);
        }
        return fixsize;
    }
    var $fixsize = bind_fix_size_event();


    var _tools = {
        _api: function (_apinm, _cb, _param, _str) {
            if (!_param) _param = {};
            var cb_name = _param.cb = 'callback' + zy.tool.random();
            $.ajax({
                url: get_api_url(_apinm), 
                dataType: "jsonp",
                data: zy.fix_jsonp_parm(_param),
                type: _str || 'GET',
                jsonpCallback: cb_name,
                success: function (data) {
                    zy.fix_xboson_data(data);
                    data.ret = data.code;
                    _cb(data);
                },
                error: function (xhr, status, error) {
                    zy.log('Error: ' + error.message);
                }
            });
        },
        _apis:function(_apinm, _cb, _param, _str){
          $.ajax({
                url: get_api_url(_apinm), 
                data: _param || {},
                type: _str || 'GET',
                success: function (data) {
                    zy.fix_xboson_data(data);
                    _cb(data);
                },
                error: function (xhr, status, error) {
                    zy.log('Error: ' + error.message);
                }
            });
        },
        _formPost: function (_apinm, form, callback, _progress, _path) {
            var link = get_api_url(_apinm)+ '?onweb=1&path='+ 
                encodeURIComponent(_path) +'&'+ zy.net.parseParam(zy.g.comm);
            form.ajaxSubmit({
                url: link,
                type: "post",
                async: true,
                timeout: 3*60*60*1e3,
                cache: false,
                dataType: "json",
                success: function (msg) {
                  zy.fix_xboson_data(msg);
                  callback && callback(msg);
                },
                error: function(x, t, e) {
                  var msg = e.message || t;
                  if (msg == 'error' || msg == '') msg = "服务器关闭了连接";
                  callback && callback({code:1, msg: msg});
                },
                xhr : function() {
                  var x = $.ajaxSettings.xhr();
                  if (_progress && x.upload) {
                    x.upload.addEventListener('progress', _progress);
                  }
                  return x;
                },
            });
        },
        _post: function (_apinm, _cb, _param) {
             $.post(get_api_url(_apinm), _param, function (data) {
                zy.fix_xboson_data(data);
                data.ret = data.code;
                 _cb && _cb(data);
             });
        },
        _label: function (_str) {
            var _q = '<' + _str + '></' + _str + '>';
            return $(_q);
        },
        _image:function(_str){
            var _p='<'+_str+'/>';
            return $(_p);
        },
        _arrToObj: function (_arr, _flg) {
            if (_flg) {
                var _t = {};
                $.each(_arr, function (_i, _v) {
                    _t[_v] = true;
                });
            } else {
                var _t = [];
                $.each(_arr, function (_i, _v) {
                    _t.push(_v);
                });
            }
            return _t;
        }
    }

    function _onLeave(_flg) {
        if (_flg)
            // 离开页面时提示
            window.onbeforeunload = function () {
                parent.$('body').removeClass('animated fadeOutUp');
                return '请确认代码已提交';
            };
        else
            window.onbeforeunload = null;
            $(window).unbind('resize');
            bind_fix_size_event();
    }
    
    function saveLastSelectedCreateFileType(_mod) {
      var types = _mod.find('[name=type]');
      if (last_select_filetype) {
        types.filter('[value="'+last_select_filetype+'"]').prop('checked', true);
      }
      types.on('click', function() {
        last_select_filetype = $(this).val();
      });
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
            });
            
        }
    }

    function _dom(_id) {

        function _saveform() {

            function _formDom(_c) {
                var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
                var _sbtn = _tools._label('button').addClass('btn btn-primary').html('确定');
                var _cbtn = _tools._label('button').addClass('btn btn-default').attr('data-dismiss', "modal").html('取消');
                var _section = _tools._label('_section').append(_tools._label('label').addClass('label').html('注解'));
                var _label = _tools._label('label').addClass('textarea has-warning').append(_tools._label('textarea').attr('name', 'reason').attr('placeholder', '修改原因')).append(_tools._label('b').addClass('tooltip tooltip-bottom-right').html('修改原因为必填项'));
                _section.append(_label);


                _form.append($('<fieldset></fieldset>').append(_section));
                _form.append($('<footer></footer>').append(_cbtn).append(_sbtn));
                _c.append(_form);

                _sbtn.unbind();
                // _sbtn.click(function () {
                //     var _reason = $('textarea[name=reason]').val();

                //     var _updatecmt = $(this).closest('form').find('textarea').val().trim();
                //     // if (_updatecmt === '') //972 取消注解必须输入
                //     //     return zy.ui.msg('提示', '修改原因为必填项', 'w');
                //     var _id = $('#zy_tabs').children('div:visible').find('pre').attr('id');
                //     var _path = $('#zy_tabs').children('div:visible').find('div').attr('name');
                //     var _editor = ace.edit(_id);
                //     if (_editor && _path) {
                //         $(this).btnDisable(true);
                //         var _t = {
                //             path: _path,
                //             content: _editor.getValue(),
                //             reason: _reason
                //         }
                        
                //         function saveFile(){
                //           _tools._post('savefile', function (msg) {
                //               if (msg) {
                //                   $(this).btnDisable(false);
                //                   zy.ui.msg('提示信息', '文件保存成功', 's');
                //                   $('.modal').modal('hide');
                //               }
                //           }, $.extend(true, _t, zy.g.comm))

                //         }
                        
                //         // function save_remove(){
                //           zy.g.am.app = 'ZYAPP_IDE';
                //           zy.g.am.mod = 'uiidemod';
                //           zy.net.get('api/save_remove', function (_m) {
                //               saveFile()
                //           },null);
                //         // }
                        
                       
                //         // zy.net.get('user/seislogin',function(msg){
                //         //   alert()
                //         //   save_remove()
                //         // },{},null,function(msg){
                //         //   save_remove()
                //         // })
                        
                //     }
                // })
            }


            zy.net.loadHTML("ide/uiide/ide_edit.html", _mod, function () {
                var _head = $('.modal-title');
                var _jq = $('.modal-body');
                _jq.empty();
                _formDom(_jq);
                $('.modal').modal('show');
            });
        }

        function _header(_c) {

            function _searchbtn() {

                function _funlist(_arr, _c) {
                    $.each(_arr, function (_i, _v) {
                        var _li = _tools._label('li').append(_tools._label('a').html(_v.name)).attr('id', _v.id);
                        _c.append(_li);
                    });
                }

                function _upload() {
                    var _tagert = $('#zy_tabs').closest('.row').children(':last');
                    var _flg = false;
                    if ($('#jarviswidget-fullscreen-mode').length > 0)
                        _flg = true;
                    _fileupload(_tagert, _flg);
                    _tagert.show()
                    $('#zy_tabs').parent().trigger('size');
                }
                
                function _History() {
                    var _tagert = $('#zy_tabs').closest('.row').children(':last');
                    var _flg = false;
                    if ($('#jarviswidget-fullscreen-mode').length > 0)
                        _flg = true;
                        _tagert.attr('style','right:10px');
                    _filehistory(_tagert, _flg);
                    _tagert.show()
                    $('#zy_tabs').parent().trigger('size');
                }

                function _content() {
                    var _tagert = $('#zy_tabs').closest('.row').children(':last');
                    var _flg = false;
                    if ($('#jarviswidget-fullscreen-mode').length > 0)
                        _flg = true;
                    _searchByContentResult(_tagert, _flg);
                    _tagert.show()
                    $('#zy_tabs').parent().trigger('size');
                }

                function _nameorid() {
                    var _tagert = $('#zy_tabs').closest('.row').children(':last');
                    var _flg = false;
                    if ($('#jarviswidget-fullscreen-mode').length > 0)
                        _flg = true;
                    _searchByidResult(_tagert, _flg);
                    _tagert.show();
                    $('#zy_tabs').parent().trigger('size');
                }


                var _func = [
                    {
                        id: 'byid',
                        name: '按文件名称查找'
                    },
                    {
                        id: 'bycontent',
                        name: '按文件内容查找'
                    },
                    {
                        id: 'fileinput',
                        name: '上传文件'
                    }
                    ,
                    {
                        id: 'history',
                        name: '查看历史'
                    }
                ];
                var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', '功能表');
                var _btn = _tools._label('i').addClass('fa fa-align-justify dropdown-toggle').attr('data-toggle', 'dropdown');
                var _ul = _tools._label('ul').addClass('dropdown-menu pull-right');
                _div.append(_tools._label('div').addClass('btn-group').append(_btn).append(_ul));
                _funlist(_func, _ul);
                _ul.children().unbind();
                _ul.children().click(function () {
                    if ($(this).attr('id') === 'byid')
                        _nameorid();
                    if ($(this).attr('id') === 'bycontent')
                        _content();
                    if ($(this).attr('id') === 'fileinput')
                        _upload();
                    if ($(this).attr('id') === 'history')
                        _History();
                });
                return _div;
            }

            function _apistatusbtn() {

                function _onlineCheck(_c, _code) {
                    _c.empty();
                    if (_code === '50') {
                        var _li = _tools._label('li').append(_tools._label('a').html('Api已发布')).css({
                            'text-align': 'center',
                            'vertical-align': 'middle'
                        });
                        _c.append(_li);
                        return false;
                    }
                    if (_code === '60') {
                        var _li = _tools._label('li').append(_tools._label('a').html('Api已下线')).css({
                            'text-align': 'center',
                            'vertical-align': 'middle'
                        });
                        _c.append(_li);
                        return false;
                    }
                    return true;
                }

                function _eachResult(_arr, _c, _code) {
                    _c.empty();
                    $.each(_arr, function (_i, _v) {
                        var _li = _tools._label('li').append(_tools._label('a').attr('href', 'javascript:void(0);').html(_v.name).attr('status', _v.id));
                        if (_v.id == _code) {
                            _li.children().addClass('editable-disabled');
                            var _i = _tools._label('i').addClass('fa fa-gear fa-1x fa-spin');
                            _li.children().append(_i);
                        }
                        _c.append(_li);

                        _li.click(function () {
                            var _this = this;
                            if ($(this).find('i').length > 0)
                                return;
                            var _i = $(this).parent().find('i');
                            var _contend = $('#zy_tabs').children('div:visible').find('div');
                            var _stability = $(this).children().attr('status');
                            _tools._api({
                                apiid: 'updatestability',
                                r_param: {
                                    contentid: _contend.attr('id'),
                                    stability: _stability
                                }
                            }, function (msg) {

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
                _div.unbind('show');
                _div.bind('show', function (e, _stability) {
                    //        _tools._api({
                    //          apitype : 'api/',
                    //          apiid : 'getdict',
                    //          appid : 'ZYAPP_LOGIN',
                    //          modid : 'ZYMODULE_LOGIN',
                    //          r_param : {
                    //            typecd : 'ZR.0031'
                    //          }
                    //        }, function(msg) {
                    //          var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
                    //          if (_onlineCheck(_apistatusbtn.find('ul'), _stability))
                    //            _eachResult(msg.result[0]['ZR.0031'], _apistatusbtn.find('ul'), _stability);
                    //          _apistatusbtn.show();
                    //        })
                })
                return _div.children().append(_btn).append(_ul).parent();
            }

            function _leftbtn() {
                var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', '文件目录');
                var _btn = _tools._label('i').addClass('glyphicon glyphicon-folder-open');
                _btn.unbind();
                _btn.click(function () {
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

            function _previewbtn() {
                var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '预览');
                var _btn = _tools._label('i').addClass('glyphicon glyphicon-play');
                _btn.unbind();
                _btn.click(function () {
                    var src = $('#zy_tabs').children('div:visible').find('div').attr('name').replace(/^\//, '');
                    //本地缓存
                    var ls_zy_user_info = zy.cache.get('_zy_user_info', 'ls');
                    //orgpath
                    var orgpath = ls_zy_user_info.get('user_selected_org_path');

                    // edit by J.ym 17.12.20
                    var _u;
                    if (zy.isXBosonSystem) {
                      if (! src.startsWith('web/')) {
                        _u = zy.g.host.ui + '/t/' 
                           + ( isplatorg() ? 'paas' : 'saas/'+zy.g.comm.org )
                           + '/emptymain.html#' + src;
                      } else {
                        _u = zy.g.host.ui + '/' + src;
                      }
                    } else {
                        _u = 'http://'+location.host+'/t/'; // 设置或返回主机名和当前 URL 的端口号 + '/t'
                        // _u += orgpath + '/emptymain.html#' + src;
                        _u += isplatorg()?'paas':'saas/'+zy.g.comm.org;
                        _u += '/emptymain.html#' + src;
                    }

                    zy.log('window.open  _u == '+_u);
                    window.open(_u, '');

                    // _tools._api('preview', function (_m) {
                    //     if (!Boolean(_m.ret)) {
                    //         window.open(_m.result.path, '');
                    //     } else {
                    //         zy.ui.msg('提示', '接口执行失败:' + _m.msg, 'e');
                    //     }
                    // }, $.extend(true, {path: src}, zy.g.comm));
                });
                return _div.append(_btn);
            }

            function _savebtn() {
                var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '保存');
                var _btn = _tools._label('i').addClass('glyphicon glyphicon-saved');
                _btn.unbind();
                _btn.click(function () {
                    _mod.empty();
                    //_saveform(); // 972 直接保存不弹出对话框
                    // 972 追加
                    var _id = $('#zy_tabs').children('div:visible').find('pre').attr('id');
                    var _path = $('#zy_tabs').children('div:visible').find('div').attr('name');
                    var _editor = ace.edit(_id);
                    setEditorOptions(_editor);
                    $('#left-panel nav').bind('click', function() {
                      _editor.destroy();
                      _editor.container.remove();
                    });
                    if (_editor && _path) {
                        $(this).btnDisable(true);
                        var _t = {
                            path: _path,
                            content: _editor.getValue().trim(),
                            reason: ''
                        }
                        
                        function saveFile(){
                          _tools._post('savefile', function (msg) {
                            $(this).btnDisable(false);
                            zy.ui.msg('保存文件', msg.msg, parseInt(msg.ret)!=0 ? 'e': 's');
                            $('.modal').modal('hide');
                            _editor.saved();
                          }, $.extend(true, _t, zy.g.comm));
                        }
                        

                        // function save_remove(){
                          zy.g.am.app = 'ZYAPP_IDE';
                          zy.g.am.mod = 'uiidemod';
                          zy.net.get('api/save_remove', function (_m) {
                            if(_m.ret=='0'){
                              saveFile()
                            }
                              
                          },null);
                        // }


                        // zy.net.get('user/seislogin',function(msg){
                        //   saveFile();
                        // },{},null,function(msg){
                        //   saveFile();
                        // });
                    }
                    // 972 追加
                });
                return _div.append(_btn);
            }

            _c.append(_searchbtn());
            _c.append(_savebtn());
            _c.append(_apistatusbtn());
            _c.append(_leftbtn());
            _c.append(_previewbtn());
        }

        function _treeDom() {
            function _innerHeader(_container) {
                var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'width:100%;margin-bottom:-15px');
                var _title = _tools._label('header');
                _title.append(_tools._label('label').html('文件目录')).append(_tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
                _container.append(_div.append(_title));
                _container.append(_tools._label('legend'));
                _title.children('a').unbind();
                _title.children('a').click(function () {
                    var _target = $(this).closest('.col-sm-3');
                    _target.hide();
                    _target.parent().children(':eq(1)').trigger('size');
                })
            }

            var _tree = _tools._label('div').addClass('col-xs-12 col-sm-3');
            _innerHeader(_tree);
            var _ul = _tools._label('ul').addClass('ztree').attr('id', 'maintree');
            _tree.append(_tools._label('div').attr('style','overflow: auto; height: 100%;').addClass('row').css('margin-top', '-15px').append(_ul));

            return {
                container: _tree,
                ul: _ul
            };
        }

        function _searchByContentResult(_container, _flg) {

            _container.empty();

            function _innerHeader() {
                var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'width:100%;margin-bottom:-15px');
                var _title = _tools._label('header');
                _title.append(_tools._label('label').html('按文件内容查询')).append(_tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
                _container.append(_div.append(_title));
                _container.append(_tools._label('legend'));
                _title.children('a').unbind();
                _title.children('a').click(function () {
                    var _target = $(this).closest('.col-sm-3');
                    _target.hide();
                    _target.parent().children(':eq(1)').trigger('size');
                })
            }

            function _closeSearch(_btn) {
                _btn.unbind();
                _btn.click(function () {
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
                _btn.click(function () {

                    var _flg = _in.prop('checked');
                    var _t = {
                        content: _input.val(),
                        casesensitive: _flg
                    }
                    _tools._api('search', function (msg) {

                        if (!Boolean(msg.ret)) {
                            _ulSearch.siblings().remove();
                            _ulSearch.empty();
                            if (msg.result.children.length === 0)
                                _ulSearch.parent().append(_tools._label('div').css({
                                    'text-align': 'center',
                                    'vertical-align': 'middle'
                                }).html('空'));
                            else
                                _treeClass({
                                    tree: {
                                        ztree: _ulSearch
                                    },
                                    mod: _mod
                                }, msg.result);
                            _ulSearch.parent().siblings(':hidden').show();
                            _ulSearch.parent().show();
                        } else
                            zy.ui.msg('提示', '接口执行失败:' + msg.msg, 'e');
                    }, $.extend(true, _t, zy.g.comm))

                })
            }

            _innerHeader();
            var _ulSearch = _tools._label('ul').addClass('ztree').attr('id', 'resulttree').attr('name','resulttree');
            var _search = _tools._label('div').addClass('smart-form').attr('style', 'margin-top:-10px');
            _container.append(_search);
            _container.append(_tools._label('legend'));
            var _input = _tools._label('textarea ').attr('placeholder', '内容').attr('rows', '3');
            var _label = _tools._label('_label').addClass('glyphicon glyphicon-search').attr('rel', 'tooltip').attr('title', '查询');
            var _btn = _tools._label('button').addClass('btn btn-default btn-xs pull-right').attr('style', 'margin-top:5px;margin-right:14px').html('查询');
            var _i = _tools._label('i').addClass('fa fa-times pull-right').attr('style', 'margin-right:13px');
            var _check = _tools._label('label').addClass('toggle state-error pull-left').attr('style', 'margin:4px 0 0 5px');
            _check.append(_tools._label('input').attr('type', 'checkbox').attr('checked', 1))
              .append(_tools._label('i').attr({
                'data-swchoff-text': 'off',
                'data-swchon-text': 'on',
                'title': '区分大小写'
              }));
            _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;display:none').append(_tools._label('h').attr('style', 'margin-left:20px').html('查询结果')).append(_i));
            var _style = 'overflow:auto;display:none;height:';
            if (_flg) _style = 'overflow:auto;display:none;height:';
            _style += (_height-400) + 'px';

            _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
            _search.append(_tools._label('label').addClass('textarea').append(_input));
            _search.append(_tools._label('div').addClass('row').attr('style', 'margin-bottom:-10px').append(_check).append(_btn));

            _closeSearch(_i);
            _searchApi(_btn, _check.children('input'));
        }

        function _searchByidResult(_container, _flg) {
            function _innerHeader() {
                var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'width:100%;margin-bottom:-15px');
                var _title = _tools._label('header');
                _title.append(_tools._label('label').html('按文件名查询')).append(_tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
                _container.append(_div.append(_title));
                _container.append(_tools._label('legend'));
                _title.children('a').unbind();
                _title.children('a').click(function () {
                    var _target = $(this).closest('.col-sm-3');
                    _target.hide();
                    _target.parent().children(':eq(1)').trigger('size');
                })
            }


            _container.empty();

            function _closeSearch(_btn) {
                _btn.unbind();
                _btn.click(function () {
                    var _mid = $(this).closest('div');
                    _mid.hide();
                    _mid.next().hide();
                    _mid.prev().hide();
                })
            }

            function _searchApi(_btn) {
                if (!_btn)
                    return;
                _btn.unbind();
                _btn.click(function () {
                    var _t = {};
                    _t.content = _input.val();
                    _tools._api('search', function (msg) {
                        if (!Boolean(msg.ret)) {
                            _ulSearch.siblings().remove();
                            _ulSearch.empty();
                            if (msg.result.children.length === 0)
                                _ulSearch.parent().append(_tools._label('div').css({
                                    'text-align': 'center',
                                    'vertical-align': 'middle'
                                }).html('空'));
                            else
                                _treeClass({
                                    tree: {
                                        ztree: _ulSearch
                                    },
                                    mod: _mod
                                }, msg.result);
                            _ulSearch.parent().siblings(':hidden').show();
                            _ulSearch.parent().show();
                        } else
                            zy.ui.msg('提示', '接口执行失败:' + msg.msg, 'e');
                    }, $.extend(true, _t, zy.g.comm))
                })
            }

            _innerHeader();
            var _ulSearch = _tools._label('ul').addClass('ztree').attr('id', 'resulttree').attr('name','resulttree');
            var _search = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'margin:-10px 0-5px');
            _container.append(_search);
            _container.append(_tools._label('legend'));
            _search.append(_tools._label('span').addClass('input-group-addon'));
            var _input = _tools._label('input').addClass('form-control').attr('placeholder', '查询').attr('type', 'text');
            var _label = _tools._label('_label').addClass('glyphicon glyphicon-search').attr('rel', 'tooltip').attr('title', '查询');
            var _btn = _tools._label('button').addClass('btn btn-default').html('查询');
            var _i = _tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')).attr('style', 'margin-right:13px');
            _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;display:none').append(_tools._label('h').attr('style', 'margin-left:20px').html('查询结果')).append(_i));
            var _style = 'overflow:auto;display:none; height:';
            if (_flg)
                _style = 'overflow:auto;display:none; height:';
            _style += (_height-300) + "px";

            _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
            _search.append(_tools._label('div').addClass('icon-addon addon-sm').append(_input).append(_label));
            _search.append(_tools._label('span').addClass('input-group-btn').append(_btn));

            _closeSearch(_i);
            _searchApi(_btn);
        }

        function _fromServer(_path, _cb, _flag) {
            var _f = true;
            if (typeof _flag !== 'undefined')
                _f = _flag;

            var _t = {};
            $.extend(true, _t, zy.g.comm);
            _t.path = _path;
            _tools._api('getfilelist', function (_m) {
                if (!Boolean(_m.ret)) {
                    var _mm = _m.result;
                    if ($.isArray(_mm)) {
                        _mm = _sort(_mm)
                    } else {
                        _mm.children = _sort(_mm.children)
                    }

                    _cb && _cb(_mm);
                } else
                    zy.ui.msg('提示', '接口执行失败:' + _m.msg, 'e');
            }, _t);
        }

        function _sort(_arr) {
            var _fileArray = [], _dirArray = [];
            $.each(_arr, function (_i, _v) {
                if (_v.isParent)
                    _dirArray.push(_v);
                else
                    _fileArray.push(_v);
            });

            return [].concat(_dirArray, _fileArray);
        }

        // Jym. 重构
        function _fileupload(_container, _flg /*fullscreen mode*/) {
            _container.html(upload_html);
            var _close      = _container.find(".close_uploadfile_dialog");
            var _form       = _container.find('form');
            var _ulSearch   = _container.find('#resulttree');
            var filesInput  = _container.find('.file_list');
            var start       = _container.find('.start_update');
            var target_path = _container.find('.upload_target_path');
            var logdom      = _container.find('.log');
            var progresst   = _container.find('.progress-txt');
            var progresshtml= _container.find('.progress').html();
            var progressc   = _container.find('.progressc');
            
            var node =$.fn.zTree.getZTreeObj("maintree").getSelectedNodes();
            if (node[0]) {
              if (node[0].isParent) {
                target_path.val(node[0].path);
              } else {
                target_path.val(node[0].getParentNode().path);
              }
            }
            
            start.click(begin_upload);
            
            _close.click(function() {
              _container.hide();
              _container.parent().children(':eq(1)').trigger('size');
            });
            
            _container.find('.add_file').click(function() {
              appendUpFile().click();
            });
            
            _container.find('.reset_file_list').click(function() {
              filesInput.empty();
              appendUpFile();
            });
            
            
            function appendUpFile() {
              var _input = _tools._label('input').attr('type', 'file')
                .attr('name', 'file').attr('multiple', 'true');
              filesInput.append(_input);
              return _input;
            }
            
            function log(m) {
              // zy.ui.msg("失败", _m.msg, 'e');
              // zy.ui.msg('提示信息', _m.msg || '成功', 's');
              logdom.removeClass('hide')
                .addClass(m.code ? 'alert-warning' : 'alert-info');
              logdom.find('.content')
                .prepend(['<p><small style="color:#aaa;">[', 
                  new Date().toLocaleString(), 
                  ']</small><br/>', m.msg, "</p>"].join(''));
            }

            function begin_upload() {
              var _path = target_path.val();
              if (!_path || !$('input[type=file]').val()) {
                  zy.ui.msg('提示信息', '文件路径及文件不可为空', 'w');
                  return;
              }
              
              var _filename = $('input[type=file]').val().toLowerCase();
              var _length = _filename.split('.').length;
              var _lastname = _filename.split('.')[_length-1];

              _fromServer(_path, function (_mm) {
                var _result = _mm;
                var msg = $.isArray(_result) ? _result : _result.children;
                var exists = false;
                $.each(msg, function (_i, _v) {
                    var _exitname = _v.name.toLowerCase();
                    if (_filename == _exitname) {
                        exists = true;
                        return false
                    }
                });
                if (exists) {
                  zy.ui.msg('提示信息', '存在', 'e');
                  return;
                }
                
                progresst.html("&nbsp;");
                var state = _container.find('.file-state').empty();
                var total = 0;
                try {
                  filesInput.find('input').each(function() {
                    for (var i=0; i<this.files.length; ++i) {
                      var f = this.files[i];
                      total += f.size;
                      state.append(["<div style='display:flex'>", 
                        '<div style="flex:1">', f.name, '</div><div>', 
                        sunit(f.size), "</div>"].join(''));
                        
                      var ext = f.name.substr(f.name.lastIndexOf('.'));
                      if (!allow_file_ext[ext]) {
                        throw new Error("该文件的类型("+ ext +")不被服务器接受: "+ f.name);
                      }
                    }
                  });
                } catch(e) {
                  return zy.ui.msg("错误", e, 'e');
                }
                if (max_post_body > 0 && total > max_post_body) {
                  return zy.ui.msg("错误", "超过服务器上传文件尺寸上限 "+ sunit(max_post_body), 'e');
                }
                
                start.attr('disabled', true).text('正在上传...');
                var progress = $(progresshtml);
                progressc.removeClass('hide').find('.progress').empty().append(progress);
                
                zy.g.comm.unzip = $("#unzip").prop("checked");
                _tools._formPost('uploadfile', _form, function (_m) {
                  start.removeAttr('disabled').text('开始上传');
                  log(_m);
                  if (_m.code !== 0) return;
                      
                  _fromServer(_path, function (_mm) {
                      var _tree = $.fn.zTree.getZTreeObj("maintree");
                      var node = _tree.getNodesByParam('path', _path)[0];
                      var _result = _mm;
                      if ($.isArray(_result)) {
                          node.children = _result;
                      } else {
                          node.children = _result.children;
                      }
                      node.open = true;
                      _tree.refresh();
                  }, false);
                }, progress_listener, _path);
                
                function progress_listener(e) {
                  var percent = Math.floor(e.loaded/ e.total* 100) +'%';
                  progress.css('width', percent);
                  progresst.empty().append("<div style='flex:1'>"+ percent +"<div>")
                    .append("<div>"+ sunit(e.loaded) +' / '+ sunit(e.total) +"<div>");
                }
              }, false);
            }
            
            function sunit(x) {
              if (x<1024) {
                return (x).toFixed(2) +'B';
              } else if (x<1024*1024) {
                return (x/(1024)).toFixed(2) +'K';
              } if (x<1024*1024*1024) {
                return (x/(1024*1024)).toFixed(2) +'M';
              } else {
                return (x/(1024*1024*1024)).toFixed(2) +'G';
              }
            }
        }
        
        function isplatorg(){
          var isplatorg=true;
          var ls = zy.cache.get('_zy_user_info', 'ls');
          // var org=ls.get('user_selected_org');
          var org=zy.g.comm.org;
          var arr=ls.get('user_org_list');
          $.each(arr,function(i,v){
            if(v.orgid==org) isplatorg=v.isplatorg
          })
          return isplatorg;
        }
        
        function _filehistory(_container, _flg){
          _container.empty();
          function _innerHeader() {
            var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'width:100%;margin-bottom:-15px');
            var _title = _tools._label('header');
            _title.append(_tools._label('label').html('查看历史')).append(_tools._label('label').attr('name','historyname')).append(_tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
            _container.append(_div.append(_title));
            _container.append(_tools._label('legend'));
            _title.children('a').unbind();
            _title.children('a').click(function () {
                var _target = $(this).closest('.col-sm-3');
                _target.hide();
                _target.parent().children(':eq(1)').trigger('size');
            })
          }

          function _closeSearch(_btn) {
            _btn.unbind();
            _btn.click(function () {
                var _mid = $(this).closest('div');
                _mid.hide();
                _mid.next().hide();
                _mid.prev().hide();
            })
          }
          _innerHeader()
          
          function searchhistory(){
            var filepath=$('pre:visible').parent().attr('name');
            if(isplatorg()){
              var path=basePathOnServer+'/t/paas'+filepath;
            }else{
              var path=basePathOnServer+'/t/saas/'+zy.g.comm.org
+filepath;
            }
            
            var _name=$('pre:visible').attr('name');
            var _id=$('pre:visible').attr('id');
            if(filepath==undefined){
              _container.find('[name=result]').append($('<center>').append('没有目标文件'));
            }else{
              _tools._apis('hist', function (_m) {
                if(_m){
                _container.find('[name=historyname]').html('('+_name+')');
                _container.find('[name=result]').append(_m);
                _container.find('[name=result]').find('h3').empty();
                _container.find('[name=result]').find('a').each(function(i,v){
                  $(v).attr('href','javascript:void(0);');
                  $(v).unbind().bind('click',function(){
                    $a=$(this);
                    var b=$a.siblings('b').text();
                    historyclick(path,$a,b,_name,_id);
                  });
                });
                }
                
                if(_container.find('ul').children().length==0){
                  _container.find('[name=result]').append($('<center>').append('空'));
                }
            }, {f:path});
            }
            
          
          }
          
          function historyclick(path,a,b,_name,_id){
            _tools._apis('cont', function (_mm) {
              var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
              var name=_name+' '+a.html();
              var __id=_id+a.html();
              var _pre = _tab.add(name,path, __id);
              _pre.inputc.val('');
              var filetype=_name.split('.')[1];
              _initIde(function () {
                  _savebtn.hide();
                  editor.set(_mm.data, false);
                  editor.initSize();
              }, _pre.pre, filetype);
            }, {f:path,d:a.html(),i:b,js:1});
          }

          _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;overflow:auto;height:100%').attr('name','result'));
           searchhistory()
        }

        function _toolbar() {

            function _button(_str, _click) {
                var _a = _tools._label('a').addClass('btn btn-labeled btn-success pull-right').attr('href', 'javascript:void(0);').css('margin-right', '17px');
                var _span = _tools._label('span').addClass('btn-label');
                var _i = _tools._label('i').addClass('glyphicon glyphicon-ok');
                _a.append(_span.append(_i)).append('提交');
                _a.click(function () {
                    _click && _click($(this));
                })
                return _a;
            }

            function _saveBtn(_btn) {
                if (editor && editor.contentid) {
                    _btn.btnDisable(true);
                    _tools._api({
                        apiid: 'ucode',
                        r_param: {
                            contentid: editor.contentid,
                            content: editor.get(),
                            updatecmt: ''//api更改说明
                        }
                    }, function (msg) {
                        if (!Boolean(msg.ret)) {
                            _btn.btnDisable(false);
                            zy.ui.msg('提示信息', '文件保存成功', 's');
                        } else {
                            zy.ui.msg('提示', '接口执行失败:' + msg.msg, 'e');
                        }
                        editor.root.saved();
                    })
                }
            }

            var _toolbar = _jq.find('.jarviswidget-editbox');
            var _div = _tools._label('div').addClass('row');
            _div.append(_button('提交', _saveBtn));
            _toolbar.append(_div);

        }

        function _form(_c, _arr,_object) {
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
                $.each(_arr, function (_i, _n) {
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
                    half: _half,
                    full: _full,
                    time: _dt
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
                $.each(_arr, function (_i, _v) {
                  if (_v.id === 'status')
                    zy.cache.initDicts('ZR.0001', function () {
                      _form.find('[name=' + _v.id + ']').zySelect('ZR.0001', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '1');
                    });
                  if (_v.id === 'auflag')
                    zy.cache.initDicts('ZR.0029', function () {
                      _form.find('[name=' + _v.id + ']').zySelect('ZR.0029', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '0');
                    });
                  if (_v.id === 'optype')
                    zy.cache.initDicts('ZR.0010', function () {
                      _form.find('[name=' + _v.id + ']').zySelect('ZR.0010', false, { allowClear: false, width: '100%' });
                      _form.find('[name=' + _v.id + ']').select2('val', '0');
                    });
                });
            }

            var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
            _form.append($('<fieldset></fieldset>'));

            $.each(_result.half, function (_i, _v) {
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
            $.each(_result.time, function (_i, _v) {
                var _n = _i / 2;
                if (_check(_i)) {
                    _row = _tools._label('div').addClass('row');
                } else {
                    _n -= 0.5;
                }
                _row.append(_section(_v));
                _form.children().append(_row);
            });

            $.each(_result.full, function (_i, _v) {
                _form.children().append(_section(_v));
            });

            _footer(_form);

            _select2(_t);
            _c.append(_form);
            if (_object) {
                $.each(_object, function (_i, _v) {
                    _form.find('[name=' + _i + ']').val(_v);
                })
            }


        }

        function _toolbarDom() {
        }

        var _jq = $('#' + _id);
        var _mod = _tools._label('div');
        _mod._form = _form;
        var _row = _tools._label('div').addClass('row');
        var _ideC = _tools._label('div').addClass('col-xs-12 col-sm-9').css({
            // 'height': '560px'
        });
        _ideC.unbind();
        _ideC.bind('size', function (e) {
            $(this).removeClass();
            var _t = $(this).siblings(':visible');
            if (_t.length > 0) {
                var _total = 0;
                $.each(_t, function (_i, _v) {
                    _total += Number($(_v).attr('class').replace(/col-xs-12 col-sm-/g, ''));
                });
                $(this).addClass('col-xs-12 col-sm-' + (12 - _total));
            } else {
                $(this).addClass('col-xs-12 col-sm-12');
            }
        });
        var _pre = _tools._label('pre').attr('id', 'zy_ide_editor');
        var _toolbar = _tools._label('div').addClass('col-xs-12 col-sm-3').css({
            'display': 'none'
        });
        var _tree = _treeDom();
        _jq.closest('#widget-grid').after(_mod);
        _pre.attr('style', 'font-family:Consolas,PingFang SC,Source Han Sans SC Light,Microsoft YaHei,Arial,Sans-Serif;top:-14;height:100%; width:100%;');
        _row.append(_tree.container).append(_ideC).append(_toolbar);
        _jq.find('.widget-body').empty().append(_row);
        _header(_jq.children('header'));
        return {
            wid: _jq,
            tree: {
                ztree: _tree.ul,
                container: _tree.container,
                sResultCon: _tree.sResult
            },
            pre: _ideC,
            mod: _mod,
            result: _toolbar
        }
    }

    function _ide(_pre, _filetype) {
        var _savebtn = $('#widget-grid').find('header .glyphicon-saved');
        
        function _setValue(_str, _flg, filename) {
          // J.ym 修正 undo 操作将代码清除.
          if (editor.getValue().trim() == '') {
            setTimeout(function() {
              editor.getSession().getUndoManager().reset();
            }, 1);
          } else {
            zy.ui.msg(filename || '', '文件已经在IDE中打开', 'i');
            return;
          }
          
          editor.setValue(_str + "\n\n\n\n\n");
          editor.navigateFileStart();
          editor.setReadOnly(_flg);
        }

        function _getValue() {
            return editor.getValue().trim();
        }

        var _nid = _pre.attr('id');
        var editor = ace.edit(_nid);
        $('#left-panel nav').bind('click', function() {
          //editor.destroy();
          editor.container.remove();
        });
        
        if (!_filetype) {
          _filetype = 'html';
        } else if (aceFileTypeMapping[_filetype]) {
          _filetype = aceFileTypeMapping[_filetype];
        }
        
        editor.setTheme("ace/theme/ambiance");
        editor.getSession().setMode("ace/mode/" + _filetype);
        editor.$blockScrolling = Infinity;
        setEditorOptions(editor);
        // editor.setOptions({
        //     enableBasicAutocompletion: true,
        //     enableSnippets: true,
        //     enableLiveAutocompletion: true,
        //   });
        $(window).resize(function() {
          editor.resize();
        });

        function _initSize() {
            editor.setShowPrintMargin(false);
            editor.setFontSize(13.5);
            editor.setHighlightSelectedWord(true);
            editor.setOption("wrap", 120);
            editor.setOption("tabSize", 2);
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
            get: _getValue,
            set: _setValue,
            initSize: _initSize,
            root: editor,
        };
    }

    function _treeClass(_d, _data) {
        var _jq = _d.wid;
        var _ul = _d.tree.ztree;
        var _mod = _d.mod;

        function _updateTwoTree(_node, _flg, msg) {
            var _main = $.fn.zTree.getZTreeObj("maintree");
            var _result = $.fn.zTree.getZTreeObj("resulttree");
            var _mainNode = _main && _main.getNodeByParam("path", _node.path, null);

            var _resultNode = _result && _result.getNodeByParam("path", _node.path, null);
            if (_flg === 'e') {
                if (_mainNode) {
                    $.extend(true, _mainNode, msg);
                    _main.updateNode(_mainNode);
                    _main.refresh();
                }
                if (_resultNode) {
                    $.extend(true, _resultNode, msg);
                    _result.updateNode(_resultNode);
                }
            }
            if (_flg === 'a') {
                if (_mainNode)
                    _main.addNodes(_mainNode, msg);
                if (_resultNode)
                    _result.addNodes(_resultNode, msg);
            }
            if (_flg === 'r') {
                if (_mainNode) {
                    var _pm = _mainNode.getParentNode();
                    _main.removeNode(_mainNode);
                    _pm.isParent = true;
                    _main.updateNode(_pm);
                }
                if (_resultNode) {
                    var _rm = _resultNode.getParentNode();
                    _result.removeNode(_resultNode);
                    if (_rm.level === 0 && _rm.children.length === 0) {
                        _result.destroy();
                        $('#resulttree').parent().append(_tools._label('div').css({
                            'text-align': 'center',
                            'vertical-align': 'middle'
                        }).html('空'));
                    }
                    _rm.isParent = true;
                    _result.updateNode(_rm);
                }
            }
        }

        function _paramObject(_form) {
            var _o = {};
            _form.find('input').each(function (_i, _v) {
                //var _type = $('input[name=type]:checked').closest('div').hasClass('has-warning') ? true : false;

                var _lname = $('input[name=type]:checked').val()
                if (_lname === '文件夹') {
                    if (!$(_v).attr('role'))
                        _o[$(_v).attr('name')] = $(_v).val();
                    if ($(_v).attr('name') === 'type')
                        _o['type'] = false;
                } else {
                    var _filename = [$(_v).val(), _lname].join('.')
                    if (!$(_v).attr('role'))
                        _o[$(_v).attr('name')] = $(_v).val(); //_filename;
                    if ($(_v).attr('name') === 'type')
                        _o['type'] = true;

                }
            });
            return _o;
        }

        var _tree = null;

        function _initEvent(_form, _node, _flg) {
          // console.log(_node);
            function _checkContent(_form) {
                var _flg = true;
                _form.children().find('input').each(function (_i, _v) {

                    if ($(_v).attr('name') && $(_v).attr('name') !== 'updatedt' && $(_v).attr('name') !== 'createdt' && ($(_v).val() === '' && $(_v).attr('name') != "type")) {
                        zy.ui.msg('提示', $(_v).attr('placeholder') + '不可为空', 'w');
                        _flg = false;
                        return false;
                    }
                })
                return _flg;
            }

            var _jq = _form;
            if (_flg)
                $.each(_node, function (_i, _v) {

                    var _t = _jq.find('[name=' + _i + ']')
                    if (_t.length > 0) {
                        if (_t.hasClass('select2-offscreen'))
                            _t.select2('val', _v.replace(/(.0)$/g, ''));
                        else
                            _t.val(_v.replace(/(.0)$/g, ''));
                    }
                });

            var _btn = _jq.find('[name=ide_submit]');
            _btn.unbind();
            
            _btn.click(function () {
                var _tname = $('.modal-body').find('[type=input]').val();
                var _lname = $('input[name=type]:checked').val();
                var _filename;
                if (_lname === '文件夹') {
                    _filename=_tname.toLowerCase();
                    _lname = null;
                } else {
                    var _nameexit=[_tname, _lname].join('.');
                    _filename =_nameexit.toLowerCase();
                }

                var _length = _tname.length;
                if (!_checkContent(_form))
                    return;
                var _type = $(this).closest('.modal-content').find('h4').text() === '修改文件名' ? true : false;
                var r_param = $.extend(true, {}, {
                    path: _node.path,
                }, _paramObject(_form), zy.g.comm);
                //
                // edit by J.ym 新建文件扩展名
                //
                r_param.ext_name = _lname;
                // console.debug("mk", _filename, _tname);

                if (!/(^[\u4e00-\u9fa5a-zA-Z0-9_\-\.]+$)/.test(_tname)) {
                    zy.ui.msg('提示信息', '不准输入除中文、字母、数字以外的特殊字符', 'w');
                } else {
                    if (_type) {
                        if (_length > 60) {
                            zy.ui.msg('提示信息', '名称必须在60个字以内', 'w');
                        } else {
                            var parentnode=_node.getParentNode();
                            // console.log(parentnode, '---------------------------');
                            _fromServer(parentnode.path, function (_nn) {
                              var _result = _nn;
                              if ($.isArray(_result)) {
                                  parentnode.children = _result;
                              } else {
                                  parentnode.children = _result.children;
                              }
                              var _flg = false;
                              $.each(parentnode.children, function (_i, _v) {

                                  var _exitname=_v.name.toLowerCase();
                                  if(_filename==_exitname){
                                      _flg = true;
                                      return false
                                  }
                              })
                              if(!_flg){
                                _tools._api('rename', function (_m) {
                                    if (!Boolean(_m.ret)) {
                                        _updateTwoTree(_node, 'e', _m.result);
                                        zy.ui.msg('提示信息', '修改成功' + _m.msg, 's');
                                        $('.modal').modal('hide');

                                        //
                                        // 刷新目录 by J.ym
                                        // 新的 rename 接口不返回 result 修改后的目录结构
                                        //
                                        if (!_m.result) {
                                            _fromServer(parentnode.path, function (_mm) {
                                                var _result = _mm;
                                                if ($.isArray(_result)) {
                                                    parentnode.children = _result;
                                                } else {
                                                    parentnode.children = _result.children;
                                                }
                                                parentnode.open = true;
                                                _tree.updateNode(parentnode);
                                                _tree.refresh();
                                            }, false);
                                        }

                                    } else {
                                        zy.ui.msg('提示信息', '接口执行失败:' + _m.msg, 'e');
                                    }
                                }, r_param);
                                
                              }else{
                                  zy.ui.msg('提示信息','存在','e')
                              }
                          },false)
                        }
                    } else {
                        if (_length > 60) {
                            zy.ui.msg('提示信息', '名称必须在60个字以内', 'w')
                        } else {
                            _fromServer(_node.path, function (_nn) {
                                var _result = _nn;
                                if ($.isArray(_result)) {
                                    _node.children = _result;
                                } else {
                                    _node.children = _result.children;
                                }
                                var _flg = false;
                                $.each(_node.children, function (_i, _v) {
                                    var _exitname=_v.name.toLowerCase();
                                    if(_filename==_exitname){
                                        _flg = true;
                                        return false
                                    }
                                })
                                if (!_flg) {
                                  _tools._api('mkfile', function (_m) {
                                      if (!Boolean(_m.ret)) {
                                          _fromServer(_node.path, function (_mm) {
                                              var _result = _mm;
                                              if ($.isArray(_result)) {
                                                  _node.children = _result;
                                              } else {
                                                  _node.children = _result.children;
                                              }
                                              _node.open = true;
                                              _tree.updateNode(_node);
                                              _tree.refresh();
                                              zy.ui.msg('提示信息', '新增成功', 's');
                                              $('.modal').modal('hide');
                                          }, false);
                                      } else {
                                          zy.ui.msg('提示信息', '接口执行失败:' + _m.msg, 'e');
                                      }
                                  }, r_param);
                                  
                                } else {
                                    zy.ui.msg('提示信息', '存在', 'e');
                                }
                            },false)
                        }
                    }
                }
            })
        }

        function _editModal(_node) {
            var filename=_node.name;
            var _length=filename.split('.').length;
            var _lname = _node.name.split('.')[_length-1];
            if (/^(png)$|^(jpg)$|^(jpeg)$|^(gif)$|^(ico)$|^(htm)$|^(html)$|^(js)$|^(css)$|^(woff2)$|^(woff)$|^(ttf)$|^(svg)$|^(eot)$|^(zip)$|^(rar)$|^(psd)$|^(ai)$|^(mp4)$|^(m4v)$|^(pdf)$|^(txt)$|^(md)$|^(swf)$|^(doc)$|^(ppt)$|^(xls)$/.test(_lname)){
              _lastname=_lname
            }else{
              _lastname='文件夹'
            }
            
            
            function _radioBox(_con) {
                
                    function _labelinner(_str) {
                        var _label = _tools._label('label').addClass('radio');
                        _label.html(_str).append(_tools._label('input').attr({
                            type: 'radio',
                            name: 'type',
                            'checked': true,
                            value: _lastname
                        })).append(_tools._label('i'));
                        return _label;
                    }

                    _con.empty();
                    var _div = _tools._label('div').addClass('inline-group');
                    _div.append(_labelinner(_lastname));
                    _con.append(_div);
            }

            zy.net.loadHTML("ide/uiide/ide_edit.html", _mod, function () {
                if(_node.isParent){
                    var _tname=_node.name;
                }else{
                    var _l=_lname.length;
                    var fileLength=filename.length;
                    var _len=fileLength-(_l+1);
                    var _tname=_node.name.substr(0,_len);
                }
                var _object = {
                    filenm: _node.name //_tname
                }
                var _head = $('.modal-title');
                _head.html('修改文件名');
                var _jq = $('.modal-body');
                _jq.empty();
                _mod._form($('.modal-body'), _domLabel.edit, _object);
                $('.modal').modal('show');
                _radioBox($('.modal-body').find('[name=type]').parent());

                _initEvent(_mod.find('form'), _node, true);
            });
        }

        function _addModal(_node) {
            zy.net.loadHTML.call(this, "ide/uiide/ide_edit.html", _mod, function () {
                var _head = $('.modal-title');
                _head.html('创建新文件');
                $('.modal').modal('show');
                _initEvent(_mod.find('form'), _node, false);
                saveLastSelectedCreateFileType(_mod);
                _mod.find('[name=filenm]').focus();
            });
        }

        function _treeOption() {
            return {
                view: {
                    showTitle: true,
                    selectedMulti: false,
                    showIcon: true,
                    dblClickExpand: false
                },
                data: {
                    key: {
                        name: 'name',
                        isParent: 'isParent',
                        title: 'path'
                    },
                    simpleData: {
                        enable: false
                    },
                    keep: {
                        parent: false
                    }
                },
                edit: {
                    drag: {
                        isCopy: false,
                        isMove: false
                    },
                    showRenameBtn: false,
                    showRemoveBtn: false,
                    enable: true,
                }
            };
        }

        function _clear(_parent) {
            _parent.empty();
        }

        function _fromServer(_path, _cb, _flag) {
            var _f = true;
            if (typeof _flag !== 'undefined')
                _f = _flag;

            function _children(_arr) {
                $.each(_arr, function (_i, _v) {
                    _v.isParent = true;
                });
            }

            var _t = {};
            $.extend(true, _t, zy.g.comm);
            _t.path = _path;
            _tools._api('getfilelist', function (_m) {
                // console.log(_m, !Boolean(_m.ret))
                if (!Boolean(_m.ret)) {
                    var _mm = _m.result;
                    if ($.isArray(_mm)) {
                        _mm = _sort(_mm)
                    } else {
                        _mm.children = _sort(_mm.children)
                    }
                    _cb && _cb(_mm);
                } else
                    zy.ui.msg('提示', '接口执行失败:' + _m.msg, 'e');
            }, _t);
        }

        function _sort(_arr) {

            var _fileArray = [], _dirArray = [];
            $.each(_arr, function (_i, _v) {
                if (0===Object.keys(_v.children).length) {
                  _v.children = undefined;
                }
                if (_v.isParent)
                    _dirArray.push(_v);
                else
                    _fileArray.push(_v);
            });

            return [].concat(_dirArray, _fileArray);
        }

        function _click(_e, _id, _node, _flag) {
            // console.log('单击');

        }

        function _dbClick(_e, _id, _node) {
          // console.log("_node.isParent=="+_node.isParent);//*********
          if(_node.isParent){
            var _tagert = $('#zy_tabs').closest('.row').children(':last');
                _tagert.find('[type=text]').val(_node.path)
          }
          if (!_node.isParent) {
                var _tgt = {
                    path: _node.path,
                    orgid: zy.g.comm.org
                };
          // console.log("_node.path=="+_node.path)//*********
          var _a=_e.target;
        if(!$(_a).attr('title')){
            if (!_node)
                return;
            var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
            var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();

                var _name = _node.name;
                var _length=_name.split('.').length;
                var filelname=_name.split('.')[_length-1];
                var _nid = _name + _node.path;
                var _id=_nid.replace(/\//g,'').replace(/\./g,'');
                if (/^(png)|(jpg)|(jpeg)|(svg)|(gif)|(ico)/.test(filelname)){
                    var param = {};
                    // var cb = function(msg) {
                    //     $.each(msg.result,function(i,v){
                    //         var _flg= v.isplatorg;
                    //         if(_flg){
                    //             _path='http://'+location.host+/t/+'paas/'+_node.path.substring(1);
                    //         }else{
                    //             _path='http://'+location.host+/t/+'saas/'+zy.g.comm.org+'/'+_node.path.substring(1);
                    //         }
                    //         var _pre = _tab.add(_name, _node.path, _id,filelname,_path);
                    //         _pre.inputc.val('');

                    //     })
                    // };
                    // zy.g.am.app = 'zyapp_login';
                    // zy.g.am.mod = 'zymodule_login';
                    // zy.net.get('api/getuserorgtype', cb, param);
                    var __base,__path;
                    if (zy.isXBosonSystem){
                      __base = zy.g.host.ui;
                      // W972:修正图像加载 PaaS 路径
                      if (_node.path.indexOf('/paas') >= 0){
                        __path = "/t" +_node.path;
                      }else{
                        __path = _node.path;
                      }
                    }
                    else __base = '/web/zr';
                    _path = __base + __path;
                    var _pre = _tab.add(_name, _node.path, _id,filelname,_path);
                    _pre.inputc.val('');
    
                }else{
                    _tools._api('getcontent', function (_m) {
                        if (!Boolean(_m.ret)) {
                            var _pre = _tab.add(_name, _node.path, _id);
                            _pre.inputc.val('');
                            _initIde(function () {
                                editor.set(_m.result.content, false, _node.path);
                                editor.initSize();
                                _savebtn.show();
                                $fixsize();
                                editor.root.resize();
                            }, _pre.pre, _m.result.filetype);
                            
                            if (enableFileType[_m.result.filetype]) {
                                _previewbtn.show();
                            } else {
                                _previewbtn.hide();
                            }
                            
                            editor.root.on('change', function() {
                              _pre.setModify(true);
                            });
                            editor.root.saved = function() {
                              _pre.setModify(false);
                            };
                        } else
                            zy.ui.msg('提示', '接口执行失败:' + _m.msg, 'e');
                    }, $.extend(true, _tgt, zy.g.comm));
                }
            }
        }
        
        }

        function _expand(_e, _id, _node) {
            if (!_node.children || _node.children.length === 0)
                _fromServer(_node.path, function (_m) {
                    var _result = _m
                    _node.children = _result;
                    _tree.refresh();
                }, false);
        }

        function _addHoverDom(_id, _node) {
          
            var sObj = $("#" + _node.tId + "_span");
            if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
                return;
            var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
            var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
            var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
            var _treeId=_node.tId;
            if(/maintree/.test(_treeId)){
              if (_node.level !== 0) {
                  sObj.after(remStr).after(editStr);
              }
            }
            
            if (_node.isParent)
                sObj.after(addStr);
            
            
            
            if (_node.level === 0 && _node.tId.indexOf('resulttree') > -1)
                $("#addBtn_" + _node.tId).unbind().remove();
            $("#remBtn_" + _node.tId).bind('click', function () {
              var _msg;
                if(_node.isParent){
                    _msg='删除文件夹会删除其中包含的文件，确认要删除';
                } else{
                      _msg='确认要删除';
                    }
                    zy.ui.mask('请确认', _msg + _node.name + '?', function () {
                        var _t = {};
                        _t.path = _node.path
                        function remove_file(){
                            _tools._api('remove', function (_m) {
                                if (!Boolean(_m.ret)) {
                                    _updateTwoTree(_node, 'r');
                                    return zy.ui.msg('提示信息', _m.msg, 's');
                                }
                                return zy.ui.msg('提示信息', '接口执行失败,'+_m.msg, 'e');
                            }, $.extend(true, _t, zy.g.comm))
                        }
                   
                          zy.g.am.app = 'ZYAPP_IDE';
                          zy.g.am.mod = 'uiidemod';
                          zy.net.get('api/save_remove', function (_m) {
                            if(_m.ret=='0'){
                              remove_file()
                            }
                              
                          },null);
                        
                    })
                

            });
            $('#addBtn_' + _node.tId).bind("click", function () {
                _tree.selectNode(_node);
                _addModal(_node);
                return false;
            })
            $('#editBtn_' + _node.tId).bind('click', function () {
                _tree.selectNode(_node);
                _editModal(_node);
                return false;
            })
        }

        function _removeHoverDom(_id, _node) {
            $("#addBtn_" + _node.tId).unbind().remove();
            $("#editBtn_" + _node.tId).unbind().remove();
            $("#remBtn_" + _node.tId).unbind().remove();
        }

        var _setting = _treeOption();
        _setting.callback = {
            // dblClickExpand : _click, //双击是两次单击.. 两个事件不可同时使用
            onExpand: _expand,
            onClick: _dbClick
        }
        _setting.view.addHoverDom = _addHoverDom;
        _setting.view.removeHoverDom = _removeHoverDom;

        _clear(_ul);

        if (_data) {
            _tree = $.fn.zTree.init(_ul, _setting, _data);
        } else
            _fromServer('/', function (_m) {
// console.log("_m tree Data=="+JSON.stringify(_m));//*********
                _tree = $.fn.zTree.init(_ul, _setting, _m);
            });
    }

    function _event(_c) {
        $('#left-panel a[href]').one('click', function () {
            window.onbeforeunload = null;
            $(window).unbind('resize');

        });
        var _treeContainer = _c.tree.container;
        var _ideContainer = $('#zy_tabs').parent();
        var _fullBtn = _c.wid.find('.jarviswidget-fullscreen-btn');

        _fullBtn.click(function () {
            var _resultContainer = _c.result.find('div:has(ul)');
            var _preContainer = $('#zy_tabs').find('div.row:has(pre)');
            var _ideTrueC = $('#zy_tabs').find('p').children();
            if($('pre').length != 0){
               var _pre=$('#zy_tabs').children('div:visible').find('pre');
                var id=$('#zy_tabs').children('div:visible').find('pre').attr('id');
                var name=$('#zy_tabs').children('div:visible').find('pre').attr('name');
                var _length=name.split('.').length;
                var filetype=name.split('.')[_length-1]
            }
            if(!$('pre')){
              // console.log('krys')
            }
            if ($('#jarviswidget-fullscreen-mode').length > 0) {
                // $('.row').css('height','552px')
                if (/^(png)|(jpg)|(jpeg)|(svg)|(gif)|(ico)/.test(filetype)){
                    $('img').each(function(i,v){
                        // v.setAttribute('height','400px');
                    })
                }
                else{
                    if($('pre').length != 0){
                    editor=ace.edit(id);
                    $('#left-panel nav').bind('click', function() {
                        editor.destroy();
                        editor.container.remove();
                    });
                    editor.setOption('wrap',120);
                    editor.setOption('tabSize',2);
                    setEditorOptions(editor);
                    _ide(_pre,filetype);
                    }
                }
            
                var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
                s = s.replace(/552/,'440');
                $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);


                // _preContainer.css({
                //     'height': '640px'
                // });
                // _treeContainer.css({
                //     'height': '100%'
                // });
                // _ideTrueC.css({
                //     'height': '640px'
                // });
                // _resultContainer.css({
                //     'height': '640px'
                // });
            } else {
              
            //   $('.row').css('height','552px')
                    if (/^(png)|(jpg)|(jpeg)|(svg)|(gif)|(ico)/.test(filetype)){
                        $('img').each(function(i,v){
                            // v.setAttribute('height','500px');
                        })
                    }
                    else{
                      if($('pre').length != 0){
                        editor=ace.edit(id);
                        $('#left-panel nav').bind('click', function() {
                          editor.destroy();
                          editor.container.remove();
                        });
                        editor.setOption('wrap',120);
                        editor.setOption('tabSize',2);
                        setEditorOptions(editor);
                        _ide(_pre,filetype);
                      }
                    }
               
                var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
                s = s.replace(/440/,'552');
                $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);


                // _preContainer.css({
                //     'height': '600px'
                // });
                // _treeContainer.css({
                //     'height': '100%'
                // });
                // _ideTrueC.css({
                //     'height': '600px'
                // });
                // _resultContainer.css({
                //     'height': '600px'
                // });
            }
            _c.wid.trigger('fixsize');
        })
    }

    function _initIde(_cb, _pre, _filetype) {
        zy.net.loadScript.call(this, ACE_PATH, function () {
            // loadScript方法改变了上下文..
            editor = _ide(_pre, _filetype);
            _cb && _cb();
        })
    }

    function _tabs(_d) {

        function _delBtnEvent(_btn) {
            _btn.click(function () {
                var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
                var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
                var _previewbtn = _d.wid.children('header').find('.glyphicon-play').parent();
                var _releasebtn = _d.wid.children('header').find('.glyphicon-sort').parent();
                if (_count(_tab) == 1) {
                    _onLeave(false);
                    _apistatusbtn.hide();
                    _savebtn.hide();
                    _previewbtn.hide();
                    _releasebtn.hide();
                }
            })
        }
        
        function _add(_name, _contentid, _id,filelname,_path) {
            _onLeave(true);
            // var _height = $('#jarviswidget-fullscreen-mode').length > 0 ? '700px' : '640px';
            
            var _input = _tools._label('input').addClass('form-control').attr('readonly', 'readonly');
            if (/^(png)|(jpg)|(jpeg)|(svg)|(gif)|(ico)/.test(filelname)) {
                var _img=_tools._image('img')
                _img.attr('src',_path).css('z-index',9999).css('max-height','380px').css('max-width','380px');
                var _pre1=_tools._label('pre');
                _pre1.attr('style','background-color:white;border:0')
                .attr('id', _id).attr('name', _name).addClass('fix_size');
                var _div =_tools._label('div').addClass('row').css('height', _height-_top_height)
                    .append(_pre1.append(_img)).addClass('fix_size');
            }else{
                var _pre = _tools._label('pre');
                _pre.attr('style', 'font-family:Consolas,PingFang SC,Source Han Sans SC Light,Microsoft YaHei,Arial,Sans-Serif;top:-14;height:100%; width:100%;')
                    .attr('id', _id).attr('name', _name).addClass('fix_size');
                var _div =_tools._label('div').addClass('row').css('height', _height-_top_height)
                    .append(_pre).addClass('fix_size');
            }

            if (_contentid)
                _div.attr('name', _contentid);
            var _num = _tab.AddTab(_id, _name, true, _div);
            
            var label = $('#'+ _div.parents('.ui-tabs-panel').attr('aria-labelledby'));
            function setModify(b) {
              if (b) {
                label.addClass('modify');
              } else {
                label.removeClass('modify');
              }
            }

            if (_num) {
                _tab.active(_num);
                return {
                    pre: _tab.el.find('[aria-hidden=false]').find('pre'),
                    inputc: _input,
                    setModify : setModify,
                }
            } else {
                _delBtnEvent(_tab.el.find('li[aria-selected=true]').find('.hover-transparent:has(i)'));
                return {
                    pre: _pre,
                    inputc: _input,
                    setModify : setModify,
                }
            }
        }

        function _tabEvent() {
            var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();
            _previewbtn.unbind('visible');
            _previewbtn.bind('visible', function (e, _filetype) {
                if (enableFileType[_filetype]) {
                    _previewbtn.show();
                } else {
                    _previewbtn.hide();
                }
            });
            var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
            _savebtn.unbind('historyvisible');
            _savebtn.bind('historyvisible',function(e,arr){
              if (arr.length==1) {
                    _savebtn.show();
                } else {
                    _savebtn.hide();
                }
            })
            
            _tab.el.on("tabsbeforeactivate", function (event, ui) {
                var _tagert = ui.newPanel.children().children();
                var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
                var _savebtn =$('#widget-grid').find('header .glyphicon-saved').parent();
                var filetype = _tagert.attr('name').split('.')[1];
               
                

                var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();
                _previewbtn.trigger('visible', [filetype]);
                var array=_tagert.children().attr('name').split(' ');
                _savebtn.trigger('historyvisible', [array]);
                

                if (_tagert.attr('name')) {
                    _apistatusbtn.trigger('show', [_tagert.attr('stability')]);
                } else {
                    _savebtn.hide();
                    _apistatusbtn.hide();
                }
                
            });
        }

        function _count(_tab) {
            return _tab.getCount();
        }

        var _c = _d.pre;
        var _tab = new zyTabs(_c);
        _tabEvent();

        return {
            add: _add,
            eventOn: _tabEvent,
            delbtn: _delBtnEvent
        }
    }

    var _d = _dom('ide'), editor;
    var _tab = _tabs(_d);
    browserRedirect();
    _treeClass(_d);
    pageSetUp();
    _event(_d);
    
    //CTRL+S保存，弃
    // ctrl_s_save($('#widget-grid').find('header .glyphicon-saved'));
    
    // // edit. jym
    // function ctrl_s_save(jsave_button) {
    //   var ctrl_code = 17;
    //   var s_code = 83;
    //   var ctrl_pressed;
      
    //   $('#ide').on('keydown', function(e) { 
    //     if (e.keyCode == ctrl_code) {
    //       ctrl_pressed = true;
    //     } else if (ctrl_pressed && e.keyCode == s_code) {
    //       // alert('save');
    //       e.preventDefault();
    //       e.stopPropagation();
    //       jsave_button && jsave_button.trigger('click');
    //       return true;
    //     }
    //   });
    //   $('#ide').on('keyup', function(e) {
    //     if (e.keyCode == ctrl_code) {
    //       ctrl_pressed = null;
    //     }
    //   });
    // }

})(jQuery, zy)