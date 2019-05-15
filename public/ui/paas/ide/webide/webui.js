(function ($, zy) {

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
    }

    var _tools = {
        _api: function (_apinm, _cb, _param, _str) {
            $.ajax({
                url: 'http://' + location.host + '/api/' + _apinm,
                dataType: "jsonp",
                data: _param || {},
                type: _str || 'GET',
                jsonpCallback: 'callback' + zy.tool.random(),
                success: function (data) {
                    _cb(data);
                },
                error: function (xhr, status, error) {
                    zy.log('Error: ' + error.message);
                }
            });
        },
        _formPost: function (url, form, callback, param) {
            form.ajaxSubmit({
                url: url,
                type: "post",
                async: false,
                data: param || {},
                timeout: 10000,
                cache: false,
                dataType: "json",
                success: function (msg) {
                    callback && callback(msg);
                }
            });
        },
        _post: function (_apinm, _cb, _param) {
            $.post('http://' + location.host + '/api/' + _apinm, _param, function (data) {
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

    function _treeClass(_d, _data) {
        var _jq = _d.wid;
        var _ul = _d.tree.ztree;
        var _mod = _d.mod;
        //更新树节点信息
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
                var _type = $('input[name=type]:checked').closest('div').hasClass('has-warning') ? true : false;

                var _lname = $('input[name=type]:checked').val()
                if (_lname === '文件夹') {
                    if (!$(_v).attr('role'))
                        _o[$(_v).attr('name')] = $(_v).val();
                    if ($(_v).attr('name') === 'type')
                        _o['type'] = _type;
                } else {
                    var _filename = [$(_v).val(), _lname].join('.')
                    if (!$(_v).attr('role'))
                        _o[$(_v).attr('name')] = $(_v).val(); //_filename;
                    if ($(_v).attr('name') === 'type')
                        _o['type'] = _type;

                }
            })
            return _o;
        }


        var _tree = null;

        function _initEvent(_form, _node, _flg) {
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
                } else {

                    var _nameexit=[_tname, _lname].join('.');
                    _filename =_nameexit.toLowerCase();
                }
                var _length = _tname.length;
                if (!_checkContent(_form))
                    return;
                var _type = $(this).closest('.modal-content').find('h4').text() === '修改' ? true : false;
                var r_param = $.extend(true, {}, {
                    path: _node.path
                }, _paramObject(_form), zy.g.comm);
                if (!/(^[\u4e00-\u9fa5a-zA-Z0-9_\-\.]+$)/.test(_tname)) {

                    zy.ui.msg('提示信息', '不准输入除中文、字母、数字以外的特殊字符', 'w');
                } else {

                    if (_type) {
                        if (_length > 60) {
                            zy.ui.msg('提示信息', '名称必须在60个字以内', 'w');
                        } else {
                            var parentnode=_node.getParentNode();
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
                                  var renamecb = function(msg){
                                    //待完成
                                      _updateTwoTree(_node, 'e', msg);
                                      zy.ui.msg('提示信息', '修改成功', 's');
                                      $('.modal').modal('hide');
                                  }
                                  if (_node.isParent) {
                                    Put('/webide/folder',{
                                      org: r_param.org,
                                      newname: r_param.filenm,
                                      path: r_param.path
                                    }, renamecb);
                                  }else{
                                    Post('/webide/file',{
                                      org: r_param.org,
                                      name: r_param.filenm,
                                      path: r_param.path
                                    }, renamecb)
                                  }
                

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
                                  var mkcb = function(msg){
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
                                  };
                                  if(r_param.type){
                                    Post('/webide/file',{
                                      name: r_param.filenm,
                                      org: r_param.org,
                                      path: r_param.path
                                    },mkcb);
                                  }else{
                                    Post('/webide/folder',{
                                      name: r_param.filenm,
                                      org: r_param.org,
                                      path: r_param.path
                                    },mkcb);
                                  }
                                 
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
            if (/^(png)$|^(jpg)$|^(jpeg)$|^(gif)$|^(htm)$|^(html)$|^(js)$|^(css)$/.test(_lname)){
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
                _head.html('修改');
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
                _head.html('新增');
                $('.modal').modal('show');
                _initEvent(_mod.find('form'), _node, false);
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
                        title: 'path'
                    },
                    simpleData: {
                        enable: false
                    },
                    keep: {
                        parent: true
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
            Get('/webide/folder',_t, function(msg){
                    if ($.isArray(msg)) {
                        msg = _sort(msg)
                    } else {
                        msg.children = _sort(msg.children)
                    }

                    _cb && _cb(msg);
            })
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

        function _click(_e, _id, _node, _flag) {
            
        }

        function _dbClick(_e, _id, _node) {
          
          if(_node.isParent){
            var _tagert = $('#zy_tabs').closest('.row').children(':last');
                _tagert.find('[type=text]').val(_node.path)
          }
          if (!_node.isParent) {
                var _tgt = {
                    path: _node.path,
                    orgid: zy.g.comm.org
                };
          
          var _a=_e.target;
          if(!$(_a).attr('title')){
            if (!_node)
                return;
            var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
            //var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();
                var _name = _node.name.toLowerCase();
                var _length=_name.split('.').length;
                var filelname=_name.split('.')[_length-1];
                var _nid = _name + _node.path;
                var _id=_nid.replace(/\//g,'').replace(/\./g,'');
                if (/^(png)|(jpg)|(jpeg)|(gif)/.test(filelname)){
                  
                    var param = {};
                    _path = '/web/' + zy.g.comm.org + '/' + _node.path.substring(1);
                    var _pre = _tab.add(_name, _node.path, _id,filelname,_path);
                    _pre.inputc.val('');
                   

                }else{
                  Get('/webide/file',$.extend(true, _tgt, zy.g.comm),function(msg){

                            var _pre = _tab.add(_name, _node.path, _id);
                            _pre.inputc.val('');
                            _initIde(function () {
                                editor.set(msg.content, false);
                                editor.initSize();
                                _savebtn.show();
                            }, _pre.pre, msg.filetype);
                            // if (msg.filetype == 'html') {
                            //     _previewbtn.show();
                            // } else {
                            //     _previewbtn.hide();
                            // }
                  })
                 
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
                        var _t = {}, url;
                        _t.path = _node.path
                        
                        if(_node.isParent){
                          url = '/webide/folder';
                        }else{
                           url = '/webide/file';
                        }
                        
                        Delete(url,$.extend(true, _t, zy.g.comm),function(msg){
                               _updateTwoTree(_node, 'r');
                                return zy.ui.msg('提示信息', '删除成功', 's');
                        })

                 
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
            //   onClick : _click, //双击是两次单击.. 两个事件不可同时使用
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
                _tree = $.fn.zTree.init(_ul, _setting, _m);
            });
    }
    
    //初始化IDE
    function _initIde(_cb, _pre, _filetype) {
        zy.net.loadScript.call(this,"lib/js/ace/1.1.3/ace.js", function () {
            // loadScript方法改变了上下文..
            editor = _ide(_pre, _filetype);
            _cb && _cb();
        })
    }
    
    //IDE类
    function _ide(_pre, _filetype) {
        var _savebtn = $('#widget-grid').find('header .glyphicon-saved');
        function _setValue(_str, _flg) {
            editor.setValue(_str);
            editor.navigateFileStart();
            editor.setReadOnly(_flg);
        }

        function _getValue() {
            return editor.getValue();
        }

        var _nid = _pre.attr('id');
        var editor = ace.edit(_nid);
        $('#left-panel nav').bind('click', function() {
          editor.destroy();
          editor.container.remove();
        });
        editor.setTheme("ace/theme/ambiance");

        if (!_filetype || _filetype == 'htm') {
            editor.getSession().setMode("ace/mode/html");
        } else {
            editor.getSession().setMode("ace/mode/" + _filetype);
        }

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
            initSize: _initSize
        };
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
                var name=$('#zy_tabs').children('div:visible').find('pre').attr('name').toLowerCase();
                var _length=name.split('.').length;
                var filetype=name.split('.')[_length-1]
            }
            //if(!$('pre')){console.log('krys')}
            if ($('#jarviswidget-fullscreen-mode').length > 0) {
                $('.row').css('height','552px')
                    if (/^(png)|(jpg)|(jpeg)|(gif)/.test(filetype)){
                        $('img').each(function(i,v){
                            v.setAttribute('height','400px');
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
                        _ide(_pre,filetype);
                      }
                    }
              
                var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
                s = s.replace(/552/,'435');
                $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);


                _preContainer.css({
                    'height': '400px'
                });
                _treeContainer.css({
                    'height': '460px'
                });
                _ideTrueC.css({
                    'height': '400px'
                });
                _resultContainer.css({
                    'height': '400px'
                });
            } else {
              
              $('.row').css('height','552px')
                    if (/^(png)|(jpg)|(jpeg)|(gif)/.test(filetype)){
                        $('img').each(function(i,v){
                            v.setAttribute('height','500px');
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
                        _ide(_pre,filetype);
                      }
                    }
               
                var s = $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style');
                s = s.replace(/435/,'552');
                $($('.col-xs-12.col-sm-3')[0]).children(':last').attr('style',s);


                _preContainer.css({
                    'height': '500px'
                });
                _treeContainer.css({
                    'height': '570px'
                });
                _ideTrueC.css({
                    'height': '500px'
                });
                _resultContainer.css({
                    'height': '500px'
                });
            }
        })
    }
    
    function _onLeave(_flg) {
        if (_flg)
            window.onbeforeunload = function () {
                parent.$('body').removeClass('animated fadeOutUp');
                return '请确认代码已提交'
            };
        else
            window.onbeforeunload = null;
            $(window).unbind('resize');
    }
    
    function _tabs(_d) {

        function _delBtnEvent(_btn) {
            _btn.click(function () {
                //var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
                var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
                //var _previewbtn = _d.wid.children('header').find('.glyphicon-play').parent();
                var _releasebtn = _d.wid.children('header').find('.glyphicon-sort').parent();
                if (_count(_tab) == 1) {
                    _onLeave(false);
                    //_apistatusbtn.hide();
                    _savebtn.hide();
                    //_previewbtn.hide();
                    _releasebtn.hide();
                }
            })
        }

        function _tabEvent() {
            // var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();
            // _previewbtn.unbind('visible');
            // _previewbtn.bind('visible', function (e, _filetype) {
            //     if (_filetype == 'html') {
            //         _previewbtn.show();
            //     } else {
            //         _previewbtn.hide();
            //     }
            // });
            _tab.el.on("tabsbeforeactivate", function (event, ui) {
                var _tagert = ui.newPanel.children().children();
                //var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
                var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
                var filetype = _tagert.attr('name').split('.')[1];
                // var _previewbtn = $('#widget-grid').find('header .glyphicon-play').parent();
                // _previewbtn.trigger('visible', [filetype]);

                if (_tagert.attr('name')) {
                    //_apistatusbtn.trigger('show', [_tagert.attr('stability')]);
                } else {
                    _savebtn.hide();
                    //_apistatusbtn.hide();
                }
            });
        }

        function _count(_tab) {
            return _tab.getCount();
        }

        function _add(_name, _contentid, _id,filelname,_path) {

            _onLeave(true);
            
            var _height = $('#jarviswidget-fullscreen-mode').length > 0 ? '500px' : '400px';
            
            var _input = _tools._label('input').addClass('form-control').attr('readonly', 'readonly');
            if (/^(png)|(PNG)|(jpg)|(JPG)|(jpeg)|(JPEG)|(gif)|(GIF)/.test(filelname)) {
                var _img=_tools._image('img')
                _img.attr('src',_path).attr('height',_height).css('z-index',9999);
                var _pre1=_tools._label('pre');
            _pre1.attr('style','background-color:white;border:0').attr('id', _id).attr('name', _name);
                var _div =_tools._label('div').addClass('row').css('height', _height).append(_pre1.append(_img));
            }else{
              var _pre = _tools._label('pre');
            _pre.attr('style', 'font-family:Consolas,PingFang SC,Source Han Sans SC Light,Microsoft YaHei,Arial,Sans-Serif;top:-14;height:100%; width:100%;').attr('id', _id).attr('name', _name);
            var _div =_tools._label('div').addClass('row').css('height', _height).append(_pre);
                
            }
            if (_contentid)
                _div.attr('name', _contentid);
            var _num = _tab.AddTab(_id, _name, true, _div);

            if (_num) {
                _tab.active(_num);
                return {
                    pre: _tab.el.find('[aria-hidden=false]').find('pre'),
                    inputc: _input
                }
            } else {
                _delBtnEvent(_tab.el.find('li[aria-selected=true]').find('.hover-transparent:has(i)'));
                return {
                    pre: _pre,
                    inputc: _input
                }
            }
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
                var _sbtn = _tools._label('button').addClass('btn btn-default').html('确定');
                var _cbtn = _tools._label('button').addClass('btn btn-default').attr('data-dismiss', "modal").html('取消');
                var _section = _tools._label('_section').append(_tools._label('label').addClass('label').html('注解'));
                var _label = _tools._label('label').addClass('textarea has-warning').append(_tools._label('textarea').attr('name', 'reason').attr('placeholder', '修改原因')).append(_tools._label('b').addClass('tooltip tooltip-bottom-right').html('修改原因为必填项'));
                _section.append(_label);

                _form.append($('<fieldset></fieldset>').append(_section));
                _form.append($('<footer></footer>').append(_cbtn).append(_sbtn));
                _c.append(_form);

                _sbtn.unbind();
                _sbtn.click(function () {
                    var _reason = $('textarea[name=reason]').val();

                    var _updatecmt = $(this).closest('form').find('textarea').val().trim();
                
                    var _id = $('#zy_tabs').children('div:visible').find('pre').attr('id');
                    var _path = $('#zy_tabs').children('div:visible').find('div').attr('name');
                    var _editor = ace.edit(_id);
                    $('#left-panel nav').bind('click', function() {
                      _editor.destroy();
                      _editor.container.remove();
                    });
                    if (_editor && _path) {
                        $(this).btnDisable(true);
                        var _t = {
                            path: _path,
                            content: _editor.getValue(),
                            reason: _reason
                        }
                        
                        function saveFile(){
                          Put('/webide/file',$.extend(true, _t, zy.g.comm),function(msg){
                                  $(this).btnDisable(false);
                                  zy.ui.msg('提示信息', '文件保存成功', 's');
                                  $('.modal').modal('hide');
                          })
                          
                        }
                        
                        zy.net.get('user/seislogin',function(msg){
                          saveFile();
                        },{},null,function(msg){
                          saveFile();
                        })
                        
                    }
                })
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
                });
                return _div;
            }
            // function _apistatusbtn() {

            //     function _onlineCheck(_c, _code) {
            //         _c.empty();
            //         if (_code === '50') {
            //             var _li = _tools._label('li').append(_tools._label('a').html('Api已发布')).css({
            //                 'text-align': 'center',
            //                 'vertical-align': 'middle'
            //             });
            //             _c.append(_li);
            //             return false;
            //         }
            //         if (_code === '60') {
            //             var _li = _tools._label('li').append(_tools._label('a').html('Api已下线')).css({
            //                 'text-align': 'center',
            //                 'vertical-align': 'middle'
            //             });
            //             _c.append(_li);
            //             return false;
            //         }
            //         return true;
            //     }

            //     function _eachResult(_arr, _c, _code) {
            //         _c.empty();
            //         $.each(_arr, function (_i, _v) {
            //             var _li = _tools._label('li').append(_tools._label('a').attr('href', 'javascript:void(0);').html(_v.name).attr('status', _v.id));
            //             if (_v.id == _code) {
            //                 _li.children().addClass('editable-disabled');
            //                 var _i = _tools._label('i').addClass('fa fa-gear fa-1x fa-spin');
            //                 _li.children().append(_i);
            //             }
            //             _c.append(_li);

            //             _li.click(function () {
            //                 var _this = this;
            //                 if ($(this).find('i').length > 0)
            //                     return;
            //                 var _i = $(this).parent().find('i');
            //                 var _contend = $('#zy_tabs').children('div:visible').find('div');
            //                 var _stability = $(this).children().attr('status');
            //                 _tools._api({
            //                     apiid: 'updatestability',
            //                     r_param: {
            //                         contentid: _contend.attr('id'),
            //                         stability: _stability
            //                     }
            //                 }, function (msg) {

            //                     _contend.attr('stability', _stability);
            //                     zy.ui.msg('提示', '修改成功', 's');
            //                     if (_i.length > 0)
            //                         $(_this).children().append(_i);
            //                     else
            //                         $(_this).children().append(_tools._label('i').addClass('fa fa-gear fa-1x fa-spin'));
            //                 })
            //             })
            //         });
            //     }

            //     var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '更改状态');
            //     _div.append(_tools._label('div').addClass('btn-group'));
            //     var _btn = _tools._label('i').addClass('glyphicon glyphicon-cloud-upload dropdown-toggle').attr('data-toggle', 'dropdown');
            //     var _ul = _tools._label('ul').addClass('dropdown-menu pull-right');
            //     _div.unbind('show');
            //     _div.bind('show', function (e, _stability) {
                    
            //     })
            //     return _div.children().append(_btn).append(_ul).parent();
            // }
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
            // function _previewbtn() {
            //     var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('style', 'display:none;').attr('title', '预览');
            //     var _btn = _tools._label('i').addClass('glyphicon glyphicon-play');
            //     _btn.unbind();
            //     _btn.click(function () {
            //         var src = $('#zy_tabs').children('div:visible').find('div').attr('name').replace(/^\//, '');
            //         Get('/webide/preview', 
            //         $.extend(true, {path: src}, zy.g.comm), 
            //         function(msg){
            //           window.open(msg, '');
            //         })
     
            //     });
            //     return _div.append(_btn);
            // }
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
                    $('#left-panel nav').bind('click', function() {
                      _editor.destroy();
                      _editor.container.remove();
                    });
                    if (_editor && _path) {
                        $(this).btnDisable(true);
                        var _t = {
                            path: _path,
                            content: _editor.getValue(),
                            reason: ''
                        }
                        
                        function saveFile(){
                          Put('/webide/file',$.extend(true, _t, zy.g.comm),function(msg){
                                  $(this).btnDisable(false);
                                  zy.ui.msg('提示信息', '文件保存成功', 's');
                                  $('.modal').modal('hide');
                          })
                      
                        }

                        zy.net.get('user/seislogin',function(msg){
                          saveFile();
                        },{},null,function(msg){
                          saveFile();
                        });
                    }
                    // 972 追加

                });
                return _div.append(_btn);
            }
            _c.append(_searchbtn());
            _c.append(_savebtn());
            //_c.append(_apistatusbtn());
            _c.append(_leftbtn());
            //_c.append(_previewbtn());
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
            _tree.append(_tools._label('div').attr('style','overflow: auto; height: 435px;').addClass('row').css('margin-top', '-15px').append(_ul));

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
                    
                    Get('/webide/search',$.extend(true, _t, zy.g.comm),function(msg){
                            _ulSearch.siblings().remove();
                            _ulSearch.empty();
                            if (msg.children.length === 0)
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
                                }, msg);
                            _ulSearch.parent().siblings(':hidden').show();
                            _ulSearch.parent().show();
                    })

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
            _check.append(_tools._label('input').attr('type', 'checkbox')).append(_tools._label('i').attr({
                'data-swchoff-text': 'off',
                'data-swchon-text': 'on',
                'title': '区分大小写'
            }));
            _container.append(_tools._label('div').addClass('row').attr('style', 'margin-top:-10px;display:none').append(_tools._label('h').attr('style', 'margin-left:20px').html('查询结果')).append(_i));
            var _style = 'overflow:auto;display:none;height:270px';
            if (_flg)
                _style = 'overflow:auto;display:none;height:360px';
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
                    Get('/webide/search',$.extend(true, _t, zy.g.comm),function(msg){
                            _ulSearch.siblings().remove();
                            _ulSearch.empty();
                            if (msg.children.length === 0)
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
                                }, msg);
                            _ulSearch.parent().siblings(':hidden').show();
                            _ulSearch.parent().show();
                    })
                    
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
            var _style = 'overflow:auto;display:none;height:355px';
            if (_flg)
                _style = 'overflow:auto;display:none;height:460px';
            _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
            _search.append(_tools._label('div').addClass('icon-addon addon-sm').append(_input).append(_label));
            _search.append(_tools._label('span').addClass('input-group-btn').append(_btn));

            _closeSearch(_i);
            _searchApi(_btn);
        }

        function _fromServer(_path, _cb, _flag) {
            // var _f = true;
            // if (typeof _flag !== 'undefined')
            //     _f = _flag;
            var _t = {};
            $.extend(true, _t, zy.g.comm);
            _t.path = _path;
            Get('/webide/folder',_t, function(msg){
                    if ($.isArray(msg)) {
                        msg = _sort(msg);
                    } else {
                        msg.children = _sort(msg.children);
                    }
                    _cb && _cb(msg);
            });
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

        function _fileupload(_container, _flg) {
            _container.empty();
            function _innerHeader() {

                var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'width:100%;margin-bottom:-15px');
                var _title = _tools._label('header');
                _title.append(_tools._label('label').html('文件上传')).append(_tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
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

            function _fileinput(_btn, _form) {
                if (!_btn)
                    return;
                _btn.unbind();
                var _tagert = $('#zy_tabs').closest('.row').children(':last');

                _btn.click(function () {
                    var _path = _tagert.find('[type=text]').val();
                    if (!_path || !$('input[type=file]').val()) {
                        zy.ui.msg('提示信息', '文件路径及文件不可为空', 'w');
                    } else {
                        var _filename = $('input[type=file]').val().toLowerCase();
                        var _length = _filename.split('.').length;
                        var _lastname = _filename.split('.')[_length-1];
                        if (/^(png)|(jpg)|(jpeg)|(gif)|(htm)|(html)|(js)|(css)/.test(_lastname)) {
alert(_lastname);
                            _fromServer(_path, function (_mm) {
                              var msg;
                              var _result = _mm;
                              if ($.isArray(_result)) {
                                  msg = _result;
                                  } else {
                                 msg = _result.children;
                              }
                              var _flg = false;
                              $.each(msg, function (_i, _v) {
                                  var _exitname = _v.name.toLowerCase();
                                  if (_filename == _exitname) {
                                      _flg = true;
                                      return false
                                  }
                              });
                              if (!_flg) {
                                  _tools._formPost('/webide/file', _form, function (_m) {
                                      //添加成功刷新数据
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
                                          zy.ui.msg('提示信息', '成功', 's')
                                      }, false);
                                  },{
                                    path: _form.find('[name=path]').val(),
                                    org: zy.g.comm.org
                                  });
                              } else {
                                  zy.ui.msg('提示信息', '存在', 'e');
                              }
                            }, false);

                        } else {
                            zy.ui.msg('提示信息', 'sorry，您选择的文件不符合规格', 'w')
                        }
                    }

                })

            }

            _innerHeader();
            var _form = _tools._label('form').attr('id', 'uploadform').attr('onsubmit', 'return false;');
            var _ulSearch = _tools._label('ul').addClass('ztree').attr('id', 'resulttree');

            var _search = _tools._label('div').addClass('input-group input-group-sm').attr('style', 'margin:-10px 0-5px');
            _container.append(_form);
            
            var treeObj = $.fn.zTree.getZTreeObj("maintree");
            var node = treeObj.getSelectedNodes();
            var defaultpath = '/';
            if(node[0]){
              if(node[0].isParent){
                defaultpath = node[0].path;
              }else{
                defaultpath = node[0].getParentNode().path;
              }
            }

            var _input1 = _tools._label('input').addClass('form-control').attr('type', 'text').attr('readonly', true).attr('name', 'path').val(defaultpath);
            var _btn = _tools._label('button').addClass('btn btn-default').html('上传');

            _container.append(_tools._label('legend'));
            var _input = _tools._label('input').attr('type', 'file').addClass('input-group input-group-sm').attr('style', 'margin:-10px 0-5px').attr('name', 'file');

            var _i = _tools._label('a').attr('href', 'javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')).attr('style', 'margin-right:13px');
            var _style = 'overflow:auto;display:none;height:355px';
            if (_flg)
                _style = 'overflow:auto;display:none;height:460px';
            _container.append(_tools._label('div').addClass('row').attr('style', _style).append(_ulSearch));
            _search.append(_input1);
            _search.append(_tools._label('span').addClass('input-group-btn').append(_btn));

            _form.append(_search).append(_tools._label('legend')).append(_input);

            _closeSearch(_i);
            _fileinput(_btn, _form);
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
                var _btnS = _tools._label('button').addClass('btn btn-default').attr('name', 'ide_submit').html('确定');
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
                var _data = [
                    {
                        id: 0,
                        text: '无效',
                        name: '无效'
                    },
                    {
                        id: 1,
                        text: '有效',
                        name: '有效'
                    },
                    {
                        id: 2,
                        text: '暂停',
                        name: '暂停'
                    }
                ];
                $.each(_arr, function (_i, _v) {
                    if (_v.id === 'status')
                        _form.find('[name=' + _v.id + ']').zySelectCustomData('', false, {
                            width: '100%'
                        }, _data);
                    if (_v.id === 'auflag')
                        zy.cacheZR.initDicts('ZR.0029', function () {
                            _form.find('[name=' + _v.id + ']').zySelect('ZR.0029', false, {
                                width: '100%'
                            });
                        });
                    if (_v.id === 'optype')
                        zy.cache.initDicts('ZR.0011', function () {
                            _form.find('[name=' + _v.id + ']').zySelect('ZR.0011', false, {
                                width: '100%'
                            });
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
            'height': '460px'
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
    var _d = _dom('ide'), editor;
    var _tab = _tabs(_d);
    browserRedirect();
    _treeClass(_d);
    _event(_d);
    
    pageSetUp();
    
})(jQuery, zy);

  function parseParam(param) {
    if (!param) {
      return '';
    }
    var tmps = [];
    for (var key in param) {
      tmps.push(key + '=' + encodeURIComponent(param[key]));
    }
    return tmps.join('&');
  }

  function Get(url, param, scb, ecb) {
    $.ajax({
      type: "GET",
      url: url,
      data: parseParam(param),
      success: function (msg) {
        scb && scb(msg);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        ecb && ecb();
      }
    });
  }

  function Post(url, param, scb, ecb) {
    $.ajax({
      type: "POST",
      url: url,
      data: parseParam(param),
      success: function (msg) {
        scb && scb(msg);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        ecb && ecb();
      }
    });
  }

  function Delete(url, param, scb, ecb) {
    $.ajax({
      type: "DELETE",
      url: url,
      data: parseParam(param),
      success: function (msg) {
        scb && scb(msg);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        ecb && ecb();
      }
    });
  }

  function Put(url, param, scb, ecb) {
    $.ajax({
      type: "PUT",
      url: url,
      data: parseParam(param),
      success: function (msg) {
        scb && scb(msg);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        ecb && ecb();
      }
    });
  }