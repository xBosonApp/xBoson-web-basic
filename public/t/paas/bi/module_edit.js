(function () {
  
  var ModTreeCon = $('#module_tree');
  var ApiTreeCon = $('#model_tree');
  var ModuleCon = $('#module_con');
  var ModInfo = $('#module_info');
  
  var chart_form_editor;
  var selectModule;
  console.log(selectModule);
  
  chart_form_editor = chart_search_form();
  init();
  

  function init() {
    pageSetUp();
    var tabs = $('#tabs');
    tabs.tabs();
    ToolBar(tabs);
    InitModTree();
    GetApiList(null, function(result){
      buildApiTree(result);
    })
  }
  
  function InitModTree(){
    GetModuleList(function(tree_json){
      buildModTree(tree_json);
    });
  }
  
  function CheckParam(param){
    if(!param.modnm) return zy.extend.msg('请输入模块名','w');
    if(!param.modtype) return zy.extend.msg('请输入模块分类','w');
    return true;
  }
  
  function ToolBar(tabs){
    var con = $('.jarviswidget > header');
    var upBtn = ModInfo.find('[index=upfile]');
    var fileInput = ModInfo.find('[name=file]');
    var fileShow = ModInfo.find('[index=fileName]');
    
    function BuildForm(){
      var form, up_type, modid;
      form = fileInput.closest('form');
      form.children('input').remove();
      up_type = $('<input type="hidden" name="up_type">').val('chart');
      modid = $('<input type="hidden" name="modid">').val(selectModule.fn.GetSelf().modid);
      
      form.append(up_type).append(modid);
      return form;
    }
    
    upBtn.click(function(){
      if(!selectModule){
        zy.extend.msg('请选择模块！','w');
        return true;
      }
      
      var mod = selectModule.fn.GetSelf();
      
      console.log(mod);
      
			zy.g.am.app = 'a6929eedff5c49e5a1a0f5b490873b39';
			zy.g.am.mod = 'echart';
      zy.net.postForm("upload/uploadchart", BuildForm(), function(msg){
        if(!msg) return console.log('上传异常');
        var filenm = msg.result[0].file_name;
        zy.extend.get({
          apinm:'mod_fileid_add',
          app:'a6929eedff5c49e5a1a0f5b490873b39',
          mod:'echart'
        },function(msg){
          fileShow.val(filenm);
          selectModule.fn.SetSelf({fileid:filenm});
          zy.extend.msg('上传成功','s');
        },{
          modid: mod.modid,
          fileid:filenm
        })
      })
    });
    
    function NewBtn(title,icon){
      var div, i;
      div = $('<div>').attr({
        title: title,
        class:'widget-toolbar',
        role:'menu'
      });
      i = $('<i>').addClass('glyphicon ' + icon);
      
      return div.append(i);
    }
    
    function NewModuleBtn(){
      var div, i;
      div = NewBtn('新建模块','glyphicon-plus');
      i = div.children('i');
      
      i.unbind('click').click(function(){
        ModuleCon.empty();
        reset();
        tabs.tabs("option", "active", 1);
        chart_form_editor.empty();
      });
      
      return div.append(i);
    }
    
    function SaveModuleBtn(){
      var div, i;
      div = NewBtn('保存模块','glyphicon-floppy-saved');
      i = div.children('i');
      
      i.unbind('click').click(function(){
        if(!selectModule) zy.extend.msg('保存异常','e');
        var module, param, domparam;
        
        module = selectModule.fn.GetSelf();
        domparam = selectModule.fn.GetDom();
        
        if(!CheckParam(domparam)) return false;
        
        var innerJson = module.chart.chartdata.type;
        
        param = {
          modid: module.modid,
          modtype: domparam.modtype,
          modnm : domparam.modnm,
          modolcd: module.modolcd,
          apiid: module.apiid,
          jsondata : {
            type: innerJson,
            searchparam: {}
          },
          shareable: Number(domparam.modshare),
          systag: module.systag,
          formhtml: chart_form_editor.getCode(),
        };
        
        selectModule.fn.ParamHander(param.jsondata.searchparam);
        param.jsondata = JSON.stringify(param.jsondata);
        
        zy.extend.post({
          apinm:'mod_json_add',
          mod:'echart',
          app:'a6929eedff5c49e5a1a0f5b490873b39'
        },function(msg){
          zy.extend.msg('保存成功','s');
          InitModTree();
          selectModule.fn.SetSelf({
            modid: msg.res[0].data,
            modtype: domparam.modtype,
            modnm: domparam.modnm,
            shareable: String(Number(domparam.modshare))
          })
        },param);
        
      });
      
      return div.append(i);
    }
    
    $('.jarviswidget > .chart_edit').append(SaveModuleBtn()).append(NewModuleBtn());
    $('.jarviswidget > .chart_form').append(SaveModuleBtn());
    
  }
  
  function GetModuleList(cb){
    zy.extend.get({
      apinm:'mod_json_sel',
      mod:'echart',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
      cb && cb(msg.pids);
      console.log(msg);
    },{});
  }
  
  function GetApiList(param,cb){
    var p = param || {typecd:'BM.MDDM'};
    zy.extend.get({
      apinm:'gettree',
      mod:'bmtree',
      app:'c770045becc04c7583f626faacd3b456'
    },function(msg){
      cb && cb(msg.result);
      console.log(msg);
    }, p);
  }

  function buildModTree(json) {

    var setting = {
      view: {
        showTitle: false,
        selectedMulti: false,
        showIcon: false,
        dblClickExpand: false,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom
      },
      data: {
        key: {
          name: 'name'
        },
        simpleData: {
          enable: false
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
      },
      callback: {
        onClick: onClick
      }
    };
    
    function addHoverDom(_id, _node) {
      var sObj = $("#" + _node.tId + "_span");
      if (_node.editNameFlag || $("#cpBtn_" + _node.tId).length > 0) return false;
      var copyStr = "<span class='button add' id='cpBtn_" + _node.tId + "' title='复制' onfocus='this.blur();'></span>";
      var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
      if (_node.level == 0 && (_node.typecd=='DE'||_node.typecd=='DS')) {
          sObj.after(copyStr);
        } else {
          sObj.after(copyStr);
          if (!_node.isParent) {
            sObj.after(remStr);
          }
        }
      $("#remBtn_" + _node.tId).bind('click', function() {
        
        // zy.net.loadHTML('bi/module_rem.html',$('#module_rem_modal_container'),function(){
        //   Module_rem(_node, InitModTree);
        // })
        _removeModal(_node);
        return false;
        
        
      })
      $('#cpBtn_' + _node.tId).bind("click", function() {
        // tree.selectNode(_node);
        zy.net.loadHTML('bi/module_copy.html',$('#module_copy_modal_container'),function(){
          Module_copy(_node, InitModTree);
        })
      })
      
      function _removeModal(_node) {
        console.log(_node)
        zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
          zy.g.am.modid = _node.modid;
          zy.g.am.app = "a6929eedff5c49e5a1a0f5b490873b39";
          zy.g.am.mod = "echart";
          zy.net.get('api/mod_json_del', function(msg){
            if(msg && msg.ret=="0"){
              zy.ui.msg('提示', '删除成功', 's');
              var treeObj = $.fn.zTree.getZTreeObj("module_tree");
              
              if(treeObj.length == 1){
                treeObj.removeNode(_node);
              }else{
                treeObj.parent.removeNode(treeObj)
              }
              
            }
          });
        });
      }
    }

    function removeHoverDom(_id, _node) {
      $("#cpBtn_" + _node.tId).unbind().remove();
      $("#remBtn_" + _node.tId).unbind().remove();
    }

    function onClick(event, treeId, treeNode, clickFlag) {
      zy.log('treeNode=',treeNode);
      if(treeNode.isParent) return false;
      buildModule(treeNode);
    }
    
    var tree = $.fn.zTree.init(ModTreeCon, setting, json);
  }
  
  function buildModule(treeNode,cb){
    ModuleCon.empty();
    console.log('treenode');
    console.log(treeNode);
    /* 新版 */
    new Module(ModuleCon, treeNode, function(con,thiz){
      window.ee = thiz;
      selectModule = thiz;
      console.log('thiz')
      console.log(selectModule);
      cb && cb();
      chart_form_editor.update();
    });
  }
  
  function buildApiTree(json){
    
    var tree = null;
    
    var setting = {
      view: {
        showTitle: false,
        selectedMulti: false,
        showIcon: false,
        dblClickExpand: false
      },
      data: {
        key: {
          name: 'typenm'
        },
        simpleData: {
          enable: true,
          idKey: 'typecd',
          pIdKey: 'parentcd',
          rootPId: 'BM.MDDM'
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
      },
      callback: {
        onClick: onClick,
        onExpand: onExpand
      }
    };
    
    function onExpand(event, treeId, treeNode){
      if(!treeNode.children || treeNode.children.length == 0){
        GetApiList({
          typecd: treeNode.typecd
        }, function(result){
          tree.addNodes(treeNode,result);
        })
      }
    }
    
    function RouteApi(node,callback){
      var apiinfo, bm003, bm004;
      apiinfo = {
        apinm:'',
        app:'c770045becc04c7583f626faacd3b456',
        mod:'commapi'
      };
      bm003 = node['bm003'];
      bm004 = node['bm004'];
      
      if(!bm003 || !bm004) return zy.extend.msg('bm003/bm004异常','w');
      
      if(bm003 == '0' && bm004 == '0') return false;
      
      if(bm003 != '0' && bm004 != '0') return zy.extend.msg('bm003/bm004异常','w');
      
      if(bm003 != '0') apiinfo.apinm = 'exc_select';
      if(bm004 != '0') apiinfo.apinm = 'exc_chart_select';
      zy.extend.get(apiinfo,function(msg){
        callback && callback(msg, apiinfo.apinm);
      },{
        modolcd: node.typecd
      })
    }

    function onClick(event, treeId, treeNode, clickFlag) {
      console.log('buildApiTree-onclick-treeNode=',treeNode);

      RouteApi(treeNode,function(msg, apinm){
        console.log('msg', msg);
        zy.log('selectModule=',selectModule);
        
        if(selectModule){
          selectModule.fn.SetSelf({
            modolcd: treeNode.typecd,
            apiid: apinm,
            formhtml: null
          });
          selectModule.fn.BuildSearch(msg.search, []);
          selectModule.fn.BuildChart(msg, msg, msg);
          chart_form_editor.update();
          return false;
        }
        buildModule(treeNode,function(thiz){
          selectModule.fn.SetSelf({
            modolcd: treeNode.typecd,
            apiid: apinm,
            formhtml: null
          });
          selectModule.fn.BuildSearch(msg.search, []);
          selectModule.fn.BuildChart(msg, msg, msg);
          chart_form_editor.update();
        })
      });
    }

    tree = $.fn.zTree.init(ApiTreeCon, setting, json);
  }
  
  function GetModel(){
    
  }
  
  function reset(){
    var name, type, share, fileName;
    name = ModInfo.find('[index=modTitle]');
    type = ModInfo.find('[index=modClass]');
    share = ModInfo.find('[index=share]');
    fileName = ModInfo.find('[index=fileName]');
    selectModule = null;
    name.val('');
    type.val('');
    share.prop('checked',false);
    fileName.val('');
    ModInfo.find('[name=file]').val('');
  }
  
  
  //
  // 构建查询表单
  //
  function chart_search_form() {
    var _id = 'form_html_code';
    var _dom = document.querySelector('#' + _id);  
    var _section_width = 4;
    var _editor;
    
    var jroot         = $('.chart_form_editor');
    var jform_param   = jroot.find('.form_param');
    var jform_preview = jroot.find('.form_preview');
    var jmust_preview = jroot.find('.must_preview').click(_preview);
    var juse_template = jroot.find('.use_template').click(_insert_template);
    var jshow_help    = jroot.find('.show_help').click(_help);
    
    if (!window.ace) {
      zy.net.loadScript('lib/js/ace/1.1.3/ace.js', function() {
        zy.net.loadScript('lib/js/ace/1.1.3/mode-html.js', _init_editor);
      });
    } else {
      _init_editor();
    }
    
    
    function _init_editor() {
      _editor = ace.edit(_dom);
      $('#left-panel nav').bind('click', function() {
        _editor.destroy();
        _editor.container.remove();
      });
      var _mode = ace.require('ace/mode/html').Mode;
      _editor.getSession().setMode(new _mode());
      _editor.setOption("minLines", 15);
      _editor.setAutoScrollEditorIntoView(true);
      _editor.setOption("maxLines", 3000);
      _editor.setOption('wrap', 110);
      _editor.setOption('tabSize',2);
      _preview();
      // window.xx = _editor;
    }
    
    
    function _help() {
      zy.extend.msg('未完成...', 's');
    }
    
    
    function _empty() {
      jform_param.html('[ 无可用参数 ]');
      _editor.setValue(''); 
      _preview();
    }
    
    
    function update() {
      if (!selectModule) return;
      var module = selectModule.fn.GetSelf();
      var search = module.chart.modoldata.search;
      
      if (search.length < 1) {
        jform_param.html('[ 无可用参数 ]');
      } else {
        jform_param.html(''); 
        
        search.forEach(function(s, i) {
          var item = $('<a href="#" style="display: inline-block; width: 20%;">' 
                   + s.cn + '</a>');
          jform_param.append(item);
          item.click(function() {
            _insert_item(s);
            zy.extend.msg(s.cn + ' 参数已插入', 's');
            return false;
          });
        });
      }

      _editor.setValue(module.formhtml || ''); 
      _editor.clearSelection();  
      _preview();
    }
    
    
    function _insert_item(s) {
      var _w = s.elemtype == 'textarea' ? _section_width*2 : _section_width;
      _insert_input(s.cn, function(i) {
        if (s.elemtype == 'textarea') {
          i("<textarea style='width:100%; height:8em'></textarea>");
        } else {
          i('<input name="'+s.en+'" dict="'+s.dict+'" type="'+s.elemtype+'"/>');
        }
      }, _w);
    }
    
    
    function _insert_input(label, fn, _w) {
      if (!_w) _w = _section_width;
      var i = function (t) { t&&_editor.insert(t);_editor.insert("\n"); return i };
      i('<section class="col col-md-' + _w + ' col-lg-' + _w + '">');
      _editor.blockIndent();
        i('<label class="label">'+label+'</label>');
        i('<label class="input">');
        fn(i);
        i('</label>');
      _editor.blockOutdent();
      i('</section>');
    }
    
    
    function _insert_title(i) {
      var title  = selectModule.fn.GetDom().modnm || '[title]';
      i('<center><h4>' + title + '</h4></center>');
      i();
    }
    
    
    function _insert_template() {
      var i = function (t) { t&&_editor.insert(t);_editor.insert("\n"); };
      var module = selectModule.fn.GetSelf();
      var search = module.chart.modoldata.search;
      
      _editor.setValue('');
      _insert_title(i);
      if (search.length < 1) return;
      
      i('<form class="smart-form chart-search-form" onsubmit="return false;">');
      _editor.blockIndent();
      
      search.forEach(function(s) {
        _insert_item(s);
        i();
      });
      
      _insert_input('&nbsp;', function() {
        i('<button id="bubble_search" class="btn btn-info btn-sm" type="submit">');
        i('<i class="fa fa-search fa-1"></i> 查 询  </button>');
      });
      
      i();
      i('<script>');
      i( $('.chart-form-script-template').html().trim() );
      i('</script>');
      
      _editor.blockOutdent();
      i('</form>');
      // _preview();
    }
    
    
    function _preview() {
      var code = getCode();
      if (!code) {
        code = "<div style='color:#ddd; font-size: 30px'>[ 预览区 ]</div>"
             + "<hr style='clear: both'/>";
        jform_preview.html(code);
        return;
      }
      // 把 form 与图表绑定
      if (selectModule) {
        selectModule.fn.SetSelf({ formhtml : code });
        selectModule.fn.BuildSearch([], {}, jform_preview);
      }
    }
    
    
    function getCode() {
      return _editor.getValue() || null;
    }
    
    
    return {
      update  : update,
      getCode : getCode,
      empty   : _empty,
    };
  }
  
})();