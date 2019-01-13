(function($, zy) {
  
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
      }, {
        name : '操作类型',
        type : 'select2',
        id : 'optype',
        write : true,
        width : 6
      }],
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
      }, {
        name : '操作类型',
        type : 'select2',
        id : 'optype',
        write : true,
        width : 6
      }, {
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

  var _tools = {
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

      zy.g.am.mod = _param.modid || 'yyxx';
      zy.g.am.app = _param.appid || '03229cbe4f4f11e48d6d6f51497a883b';
      var _apitype = _param.apitype || 'api/';
      zy.net.post(_apitype + _param.apiid, _cb, _p);
    },
    _label : function(_str) {
      var _q = '<' + _str + '></' + _str + '>';
      return $(_q);
    },
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
  }

  function _dom(_id) {

    function _header(c) {

      function leftbtn() {
        var _div = _tools._label('div').attr('role', 'menu').addClass('widget-toolbar').attr('title', 'API 列表');
        var _btn = _tools._label('i').addClass('glyphicon glyphicon-file');
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
      c.empty();
      c.append(leftbtn());
    }

    function initStatusBtn(c){
      var _mod = $('#ide_mod');
      $(c).delegate('.api_up', 'click', function() { 
        zy.net.loadHTML("yingyong_ptgl/yyxx/api_up.html", _mod );
      }); 
      $(c).delegate('.api_down', 'click', function() { 
        zy.net.loadHTML("yingyong_ptgl/yyxx/api_down.html", _mod );
      }); 
      $(c).delegate('.api_dev', 'click', function() {
        zy.net.loadHTML("yingyong_ptgl/yyxx/api_dev.html", _mod );
      });   
    }
  
    function _treeDom() {
      function _innerHeader(_container){
        var _div = _tools._label('div').addClass('input-group input-group-sm').attr('style','width:100%;margin-bottom:-15px');
        var _title = _tools._label('header');
        //_title.append(_tools._label('label').html('Api目录')).append(_tools._label('a').attr('href','javascript:void(0);').addClass('pull-right').append(_tools._label('i').addClass('fa fa-times')));
        var str_up=_tools._label('div').attr('title', '上线').addClass('api_up widget-toolbar').append(_tools._label('i').addClass('fa fa-hand-o-up '));
         var str_down=_tools._label('div').attr('title', '下线').addClass('api_down widget-toolbar').append(_tools._label('i').addClass('fa fa-hand-o-down'));
        var str_dev=_tools._label('div').attr('title', '转开发').addClass('api_dev widget-toolbar').append(_tools._label('i').addClass('fa fa-hand-o-left'));
        
        _title.append(_tools._label('label').html('API 列表')).append(str_up).append(str_down).append(str_dev);
        _container.append(_div.append(_title));
        _container.append(_tools._label('legend'));
        // _title.children('a').unbind();
        // _title.children('a').click(function(){
        //   var _target = $(this).closest('.col-lg-3');
        //   _target.hide();
        //   _target.parent().children(':eq(1)').trigger('size');
        // });
        
        initStatusBtn(_container);
      }

      var _tree = _tools._label('div').addClass('col-lg-3').css({
        'overflow' : 'auto',
        'height' : '460px'
      });

      _innerHeader(_tree);

      var _ul = _tools._label('ul').addClass('ztree').attr('id', 'maintree');
      _tree.append(_tools._label('div').addClass('row').css('margin-top', '-15px').append(_ul));

      return {
        container : _tree,
        ul : _ul
      };
      
    }
   
    function _toolbar() {

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
            zy.cache.initDicts('ZR.0029', function() {
              _form.find('[name=' + _v.id + ']').zySelect('ZR.0029', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '0');
            });
          if (_v.id === 'optype')
            zy.cache.initDicts('ZR.0010', function() {
              _form.find('[name=' + _v.id + ']').zySelect('ZR.0010', false, { allowClear: false, width: '100%' });
              _form.find('[name=' + _v.id + ']').select2('val', '0');
            });
        });
      }

      var _form = _tools._label('form').attr('onsubmit', 'return false;').addClass('smart-form');
      _form.append($('<fieldset></fieldset>'));

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
      });

      $.each(_result.full, function(_i, _v) {
        _form.children().append(_section(_v));
      });

      _footer(_form);

      _select2(_t);
      _c.append(_form);
    }
    
    var _jq = $('#' + _id);
    var _mod = _tools._label('div');
    _mod._form = _form;
    var _row = _tools._label('div').addClass('row');
    var _ideC = _tools._label('div').addClass('col-lg-9').css({
      'height' : '460px'
    });
    _ideC.unbind();
    _ideC.bind('size', function(e) {
      $(this).removeClass();
      var _t = $(this).siblings(':visible');
      if (_t.length > 0) {
        var _total = 0;
        $.each(_t, function(_i, _v) {
          _total += Number($(_v).attr('class').replace(/col-lg-/g, ''));
        });
        $(this).addClass('col-lg-' + (12 - _total));
      } else {
        $(this).addClass('col-lg-12');
      }
    });
    var _pre = _tools._label('pre').attr('id', 'zy_ide_editor');
    var _toolbar = _tools._label('div').addClass('col-lg-3').css({
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
    var _width = $('.ace_content').css('width').replace(/px/g, '');
    var _size = Math.round(Number(_width) / 9);
    editor.setTheme("ace/theme/ambiance");
    editor.getSession().setMode("ace/mode/sjs");
    editor.setShowPrintMargin(false);
    editor.setFontSize(14);
    editor.setHighlightSelectedWord(true);
    editor.setOption("wrap", 90);
    editor.resize();
    return {
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
        if (_resultNode)
          _result.addNodes(_resultNode, msg);
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
          if ($(_v).attr('name') && $(_v).attr('name') !== 'updatedt' && $(_v).attr('name') !== 'createdt' && $(_v).val() === '') {
            zy.ui.msg('提示', $(_v).attr('placeholder') + '不可为空', 'w');
            _flg = false;
            return false;
          }
        })
        return _flg;
      }

      var _jq = _form;
      if (_flg)
        $.each(_node, function(_i, _v) {
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
      _btn.click(function() {
        zy.log(_node);
        if (!_checkContent(_form))
          return;
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
        _tools._api(_o, function(msg) {
          _updateTwoTree(_node, Boolean(_type), msg.result[0]);
          zy.ui.msg('提示信息', '成功', 's');
          $('.modal').modal('hide');
        })
      })
    }

    function _editModal(_node) {
      zy.net.loadHTML("yingyong_ptgl/yyxx/ide_edit.html", _mod, function() {
        var _level = _checkLevel(_node, true);
        var _head = $('#ide_edit .modal-title');
        _head.html('修改');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();
        _mod._form($('#ide_edit .modal-body'), _domLabel[_level].edit);
        $('#ide_edit').modal('show');
        _initEvent(_mod.find('form'), _node, true);
      });
    }

    function _addModal(_node) {
      zy.net.loadHTML("yingyong_ptgl/yyxx/ide_edit.html", _mod, function() {
        var _level = _checkLevel(_node, false);
        var _head = $('#ide_edit .modal-title');
        _head.html('新增');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();
        _mod._form($('#ide_edit .modal-body'), _domLabel[_level].add);
        $('#ide_edit').modal('show');
        _initEvent(_mod.find('form'), _node, false);
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
        apiid : 'treeapis',
        r_param : {
          id : _id
        }
      }, function(msg) {
        var _result = msg;
        if (!_result.value)
          return;
        if (_f)
          _children(_result.value)
        _cb && _cb(_result.value);
      })
    }

    function _code(_obj, _cb) {
      var _info = {
        apiid : 'scode'
      }
      _info.r_param = _obj;
      _tools._api(_info, function(msg) {
        zy.log(msg);
        var _result = msg;
        _cb && _cb(_result.content[0]);
      })
    }

    function _expand(_e, _id, _node) {
      zy.log(_node);
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
    
      
    function _dbClick(_e, _id, _node, _flag) {
      return;
    }
  
    function _click(_e, _id, _node) {
      switch( _node.level ){
         case 1:zy.log(1); break;
         case 2:zy.log(2); break;
         case 3:zy.log(3); break;
         default : break;
      }
    }
  
    function _addHoverDom(_id, _node) {
      var sObj = $("#" + _node.tId + "_span");
      if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0)
        return;
      var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
      var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
      if (_node.appid && !_node.contentid && !_node.hisid) {
        sObj.after(editStr).after(addStr);
      }
      if (!_node.appid)
        sObj.after(addStr);
      if (_node.contentid)
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
      onExpand : _expand,
      onClick : _click,
      onDblClick : _dbClick
    }
    _setting.view.addHoverDom = _addHoverDom;
    _setting.view.removeHoverDom = _removeHoverDom;

    _clear(_ul);

    if (_data) {
      _tree = $.fn.zTree.init(_ul, _setting, _data);
    } else
      _fromServer('', function(_m) {
        var _result = [];
        _result[0] = {
          appnm : 'IDE',
          children : _m,
          open : true
        }
        _tree = $.fn.zTree.init(_ul, _setting, _result);
      });
  }

  function _event(_c) {

    $('#left-panel a[href]').one('click', function() {
      window.onbeforeunload = null;
    });

    var _treeContainer = _c.tree.container;
    //var _ideContainer = $('#zy_tabs').parent();
    var _fullBtn = _c.wid.find('.jarviswidget-fullscreen-btn');
    _fullBtn.click(function() {
      var _resultContainer = _c.result.find('div:has(ul)');
      window.ee = _resultContainer;
      var _preContainer = $('#zy_tabs').find('div.row:has(pre)');
      var _ideTrueC = $('#zy_tabs').find('p').children();
      if ($('#jarviswidget-fullscreen-mode').length > 0) {
        _preContainer.css({
          'height' : '370px'
        });
        _treeContainer.css({
          'height' : '460px'
        });
        _ideTrueC.css({
          'height' : '400px'
        });
        _resultContainer.css({
          'height' : '370px'
        });
      } else {
        _preContainer.css({
          'height' : '470px'
        });
        _treeContainer.css({
          'height' : '570px'
        });
        _ideTrueC.css({
          'height' : '500px'
        });
        _resultContainer.css({
          'height' : '470px'
        });
      }
    });
    
    var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
    //var _savebtn = $('#widget-grid').find('header .glyphicon-saved').parent();
    
    //_tab.add("应用信息管理", "yyxxgl_manage", "s",false);
  }

  function _initIde(_cb, _pre) {
    zy.net.loadScript.call(this, "lib/js/ace/1.1.3/ace.js", function() {// loadScript方法改变了上下文..
      editor = _ide(_pre);
      _cb && _cb();
    })
  }

  function _tabs(_d) {
    
    function _delBtnEvent(_btn) {
      _btn.click(function() {
        var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
        var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
        if (_count(_tab) == 1) {

          _apistatusbtn.hide();
          _savebtn.hide();
        }
      })
    }

    function _tabEvent() {
      _tab.el.on("tabsbeforeactivate", function(event, ui) {
        var _tagert = ui.newPanel.children().children();
        var _apistatusbtn = $('#widget-grid').find('header .glyphicon-cloud-upload').closest('.widget-toolbar');
        var _savebtn = _d.wid.children('header').find('.glyphicon-saved').parent();
        if (_tagert.attr('id')) {
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

    function _add(_id, _contentid, _stability,_close) {

      var _pre = _tools._label('pre');
      _pre.attr('style', 'font-family:Consolas,Microsoft YaHei,微软雅黑,sans-serif,宋体;top:-14;height:100%; width:100%;').attr('id', _id);
      var _height = $('#jarviswidget-fullscreen-mode').length > 0 ? 'height:500px' : 'height:400px';
      var _preheight = $('#jarviswidget-fullscreen-mode').length > 0 ? '490px' : '390px';
      //var _input = _tools._label('input').addClass('form-control').attr('readonly', 'readonly');
      //var _div = _tools._label('div').attr('style', _height).append(_tools._label('div').addClass('row').append(_tools._label('div').addClass('col-lg-12').css('margin-bottom', '10px'))).append(_tools._label('div').addClass('row').css('height', _preheight).append(_pre));
      var _div = _tools._label('div').attr('style', _height).append(_tools._label('div').addClass('row').append(_tools._label('div').addClass('col-lg-12').css('margin-bottom', '10px'))).append(_tools._label('div').addClass('row').css('height', _preheight).append(_pre));
      if (_contentid)
        _div.attr('id', _contentid);
      if (_stability)
        _div.attr('stability', _stability);
      var _num = _tab.AddTab(_id, _id, _close, _div);
      if (_num) {
        _tab.active(_num);
        return {
          pre : _tab.el.find('[aria-hidden=false]').find('pre'),
          //inputc : _input
        }
      } else {
        _delBtnEvent(_tab.el.find('li[aria-selected=true]').find('.hover-transparent:has(i)'));
        return {
          pre : _pre,
          //inputc : _input
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
  _treeClass(_d);
  pageSetUp();
  _event(_d);

  htmlide_ref = function(){
    $('#ide').find('.widget-body').empty();
    var _d = _dom('ide'), editor;
    var _tab = _tabs(_d);
    _treeClass(_d);
    pageSetUp();
    _event(_d);
  };

})(jQuery, zy)