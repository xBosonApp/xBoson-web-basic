 moduleD_edit = (function(zy, $) {
  
  var PT = moduleD_edit.prototype;
  var thiz;
  
  PT._g = {
    
  }
  
  var tabs = $('#moduleD_edit_tabs');
  var ModTreeCon = $('#moduleD_edit_module_tree');
  var ApiTreeCon = $('#moduleD_edit_model_tree');
  var ModuleCon = $('#moduleD_edit_module_con');
  var ModInfo = $('#moduleD_edit_module_info');
  
  var chart_form_editor;
  var selectModule;

  chart_form_editor = chart_search_form();
  
  function moduleD_edit() {
    thiz = this;
    Init();
    return this;
  }
  
  //初始化
  function Init(){
    tabs.tabs();
    ToolBar(tabs);
    InitModTree();
    GetApiList(null, function(result){
      buildApiTree(result);
    });
    $("#moduleD_edit #nouislider").noUiSlider({
      range: [0, 100],
      start: 25,
      handles: 1,
      connect: true,
      slide: function(){
        var values = $(this).val();
        if(10>values){
          $("#moduleD_edit_tree").css({"display":"none","width":"0%"});
          $("#moduleD_edit_chart").css({"display":"block","width":"100%"});
          $(this).val(0);
          return false;
        } else {
          $("#moduleD_edit_tree").css({"display":"block","width": + values + "%"});
        }
        if(40>(100-values)){
          $("#moduleD_edit_chart").css({"display":"none"});
        } else {
          $("#moduleD_edit_chart").css({"display":"block","width":(100-values) + "%"});
        }
      }
    });
  }
  
  function buildModule(treeNode,cb){
    reset();
    /* 新版 */
    new Module(ModuleCon, treeNode, function(con,thiz){
      selectModule = thiz;
      cb && cb();
      chart_form_editor.update();
    });
  }
  
  function refreshTheme(){
    //类别添加默认值
    zy.g.am.app = 'a6929eedff5c49e5a1a0f5b490873b39';
    zy.g.am.mod = 'config';
    zy.net.get("api/select2_chart_theme",function(msg){
      $('#moduleD_edit_module_info [index=modClass]').zySelectCustomData('', false, {
        width: '100%'
      }, msg.result,true);
    },{treetype:'0'});
  }
  
  function ToolBar(tabs){
    var upBtn = ModInfo.find('[index=upfile]');
    var saveBtn = ModInfo.find('[index=savechart]');
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
    
    upBtn.unbind().click(function(){
      if(!selectModule){
        zy.extend.msg('请选择图表！','w');
        return true;
      }
      
      var mod = selectModule.fn.GetSelf();
      
			zy.g.am.app = 'a6929eedff5c49e5a1a0f5b490873b39';
			zy.g.am.mod = 'echart';
      zy.net.postForm("upload/uploadchart", BuildForm(), function(msg){
        if(!msg) return;
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
    
    saveBtn.unbind().click(function(){
      save();
    });
  }
  
  function buildModTree(json) {

    var setting = {
      view: {
        showTitle: false,
        selectedMulti: false,
        showIcon: false,
        dblClickExpand: false,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        fontCss:setFontCss
      },
      data: {
        key: {
          name: 'name'
        },
        simpleData: {
          enable: true,//false
          idKey: 'id',
          pIdKey: 'parentcd',
          rootPId: '0'
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
    
    function setFontCss(treeId, treeNode){
      var color = {};
      if(treeNode.ischart=='1'){
        if(treeNode.status=='0'){
          //无效
          color = {'color':'red'};
        } else {
          //有效
          color = {'color':'blue'};
        }
      }
      return color;
    }
    
    function addHoverDom(_id, _node) {
      var sObj = $("#" + _node.tId + "_span");
      var flag = _node.editNameFlag 
        || $("#cpBtn_" + _node.tId).length > 0 
        || $("#addBtn_" + _node.tId).length > 0
        || $("#themeBtn_" + _node.tId).length > 0  ;
      if (flag) return false;
      var style = " style='font-size:16px;margin-left:2px;color:cadetblue;line-height: 5px' ";
      var addStr = "<span class='fa fa-lg fa-fw fa-bar-chart-o' id='addBtn_" + _node.tId + "' title='添加图表' onfocus='this.blur();'"+style+"></span>";
      var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除图表' onfocus='this.blur();'></span>";
      var copyStr = "<span class='fa fa-lg fa-fw fa-copy' id='cpBtn_" + _node.tId + "' title='复制图表' onfocus='this.blur();'"+style+"></span>";
      var addTheme = "<span class='button add' id='themeBtn_" + _node.tId + "' title='新建目录' onfocus='this.blur();'></span>";
      var editTheme = "<span class='fa fa-lg fa-fw fa-edit' id='editThemeBtn_" + _node.tId + "' title='修改目录' onfocus='this.blur();'"+style+"></span>";
      var delTheme = "<span class='fa fa-lg fa-fw fa-ban' id='delThemeBtn_" + _node.tId + "' title='删除目录' onfocus='this.blur();'"+style+"></span>";
      if(_node.ischart=="0"){
        sObj.after(addTheme);
        sObj.after(editTheme);
        if(!_node.isParent){
          sObj.after(delTheme);
        }
        sObj.after(addStr);
      } else{
        sObj.after(copyStr);
        sObj.after(remStr);
      }

      //删除按钮
      $("#remBtn_" + _node.tId).bind('click', function() {
        _removeModal(_node);
        return false;
      });
      //复制按钮
      $('#cpBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_modal.htm',$('#moduleD_edit_mode'),function(){
          Module_modal(_node, InitModTree,"copy");
        });
      })
      //添加按钮
      $('#addBtn_' + _node.tId).bind("click", function() {
        tabs.tabs("option", "active", 1);
        reset();
      });
      
      //创建目录按钮
      $('#themeBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_modal.htm',$('#moduleD_edit_mode'),function(){
          Module_modal(_node, InitModTree,"theme");
        });
      });
      
       //修改目录按钮
      $('#editThemeBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_modal.htm',$('#moduleD_edit_mode'),function(){
          Module_modal(_node, InitModTree,"themeEdit");
        });
      });
      
       //删除目录按钮
      $('#delThemeBtn_' + _node.tId).bind("click", function() {
         zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
          zy.g.am.typecd = _node.id;
          zy.g.am.app = "a6929eedff5c49e5a1a0f5b490873b39";
          zy.g.am.mod = "config";
          zy.net.get('api/chart_theme_delete', function(msg){
            if(msg && msg.ret=="0"){
              zy.ui.msg('提示', '删除成功', 's');
              InitModTree();
            }
          });
        });
        return false;
      });
      
      function _removeModal(_node) {
        zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
          zy.g.am.modid = _node.modid;
          zy.g.am.app = "a6929eedff5c49e5a1a0f5b490873b39";
          zy.g.am.mod = "config";
          zy.net.get('api/chart_del', function(msg){
            if(msg && msg.ret=="0"){
              zy.ui.msg('提示', '删除成功', 's');
              var treeObj = $.fn.zTree.getZTreeObj("moduleD_edit_module_tree");
              
              if(treeObj.getNodes().length == 1){
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
      $("#addBtn_" + _node.tId).unbind().remove();
      $("#cpBtn_" + _node.tId).unbind().remove();
      $("#remBtn_" + _node.tId).unbind().remove();
      $("#themeBtn_" + _node.tId).unbind().remove();
      $("#editThemeBtn_" + _node.tId).unbind().remove();
      $("#delThemeBtn_" + _node.tId).unbind().remove();
    }

    function onClick(event, treeId, treeNode, clickFlag) {
      if(treeNode.ischart=="0") return false;
      buildModule(treeNode);
    }
    
    var tree = $.fn.zTree.init(ModTreeCon, setting, json);
  }

  function InitModTree(){
    GetModuleList(function(tree_json){
      buildModTree(tree_json);
    });
     refreshTheme();
  }
  
  function CheckParam(param){
    if(!param.modnm) return zy.extend.msg('请输入图表名','w');
    if(!param.modtype) return zy.extend.msg('请输入图表分类','w');
    return true;
  }
  
  function GetModuleList(cb){
    zy.extend.get({
      apinm:'ztree_chart',
      mod:'config',
      //apinm:'mod_json_sel',
      //mod:'echart',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
      cb && cb(msg.data);
    },{});
  }
  
  function GetApiList(param,cb){
    var p = param || {typecd:'BM.MDDM'};
    zy.extend.get({
      apinm:'ztree_modal',
      mod:'config',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
      //apinm:'gettree',
      //mod:'bmtree',
      //app:'c770045becc04c7583f626faacd3b456'
    },function(msg){
      cb && cb(msg.result);
    }, p);
  }

  function buildApiTree(json){
    
    var tree = null;
    
    var setting = {
      view: {
        showTitle: false,
        selectedMulti: false,
        showIcon: false,
        dblClickExpand: false,
        fontCss: setFontCss
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
        // onExpand: onExpand
      }
    };
    
    function setFontCss(treeId, treeNode){
      var color = {};
      if(treeNode.isparent=='0'){
        if(treeNode.status=='0'){
          //无效
          color = {'color':'red'};
        } else {
          //有效
          color = {'color':'blue'};
        }
      }
      return color;
    }
    // function onExpand(event, treeId, treeNode){
    //   if(!treeNode.children || treeNode.children.length == 0){
    //     GetApiList({
    //       typecd: treeNode.typecd
    //     }, function(result){
    //       tree.addNodes(treeNode,result);
    //     })
    //   }
    // }
    
    function RouteApi(node,callback){
      var apiinfo = {
        apinm:'',
        app:'c770045becc04c7583f626faacd3b456',
        mod:'commapi'
      };
      var bm003 = node['bm003'];
      var bm004 = node['bm004'];
      
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
      RouteApi(treeNode,function(msg, apinm){
        if(selectModule){
          selectModule.fn.SetSelf({
            // modolcd: treeNode.typecd,
            // apiid: apinm,
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
  
  //重置管理画面
  function reset(){
    selectModule = null;
    ModInfo.find('[index=modTitle]').val('');
    ModInfo.find('[index=modClass]').val('');
    //ModInfo.find('[index=share]').prop('checked',false);
    ModInfo.find('[index=fileName]').val('');
    ModInfo.find('[name=file]').val('');
    ModuleCon.empty();
    chart_form_editor.empty();
  }
  
  //
  function save(){
    if(!selectModule){
      zy.extend.msg('保存异常','e');
      return false;
    } 
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
      apinm:'chart_save',
      mod:'config',
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
    
  }
  // 构建查询表单
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
      //
      // 若这里抛出异常可能是 ACE 版本冲突
      //
      //var _mode = ace.require('ace/mode/html').Mode;
      _editor.getSession().setMode("ace/mode/html");
      //_editor.getSession().setMode(new _mode());
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
      _editor&&_editor.setValue(''); 
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
          i('<input name="'+s.en+'" dict="'+s.dict+'" type="'+s.elemtype+'" modolcd="'+s.modolcd+'" />');
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
  
  return moduleD_edit;
})(zy, jQuery);