moduleD_show = (function(zy, $) {
  
  var PT = moduleD_show.prototype;
  var thiz;
  
  PT._g = {
    
  }
  
  var ModTreeCon = $('#moduleD_show_widget_tree');
  
  function moduleD_show() {
    thiz = this;
    Init();
    return this;
  }
  
  //初始化
  function Init(){
    InitModTree();
    $("#moduleD_show #nouislider").noUiSlider({
      range: [0, 100],
      start: 25,
      handles: 1,
      connect: true,
      slide: function(){
        var values = $(this).val();
        if(10>values){
          $("#moduleD_show_tree").css({"display":"none","width":"0%"});
          $("#moduleD_show_chart").css({"display":"block","width":"100%"});
          $(this).val(0);
          return false;
        } else {
          $("#moduleD_show_tree").css({"display":"block","width": + values + "%"});
        }
        if(40>(100-values)){
          $("#moduleD_show_chart").css({"display":"none"});
        } else {
          $("#moduleD_show_chart").css({"display":"block","width":(100-values) + "%"});
        }
      }
    });
  }
  
  function InitModTree(){
    $("#add_project").attr("disabled","disabled");
     zy.extend.get({
        apinm:'getChartInfoTree',
        mod:'view',
        app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
        buildPageTree(msg.data);
    },{});
    
  }
  
  
  function buildPageTree(json) {
    
    var setting = {
      view: {
        showTitle: false,
        selectedMulti: false,
        showIcon: false,
        dblClickExpand: false,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        fontCss: setFontCss
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
      if(treeNode.ispage=='1'){
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
        || $("#addBtn_" + _node.tId).length > 0 
        || $("#editBtn_" + _node.tId).length > 0
        || $("#deleteBtn_" + _node.tId).length > 0
        || $("#addPageBtn_" + _node.tId).length > 0
        || $("#editPageBtn_" + _node.tId).length > 0 
        || $("#deletePageBtn_" + _node.tId).length > 0 
        ;
      if (flag) return false;
      var style = " style='font-size:16px;margin-left:2px;color:cadetblue;line-height: 5px' ";
      var addStr = "<span class='fa fa-lg fa-fw fa-html5' id='addBtn_" + _node.tId + "' title='新建页面' onfocus='this.blur();'"+style+"></span>";
      var remStr = "<span class='fa fa-lg fa-fw fa-times ' id='deleteBtn_" + _node.tId + "' title='删除页面' onfocus='this.blur();'"+style+"></span>";
      var editStr = "<span class='fa fa-lg fa-fw fa-cogs' id='editBtn_" + _node.tId + "' title='修改页面' onfocus='this.blur();'"+style+"></span>";
      var addTheme = "<span class='fa fa-lg fa-fw fa-plus' id='addThemeBtn_" + _node.tId + "' title='新建目录' onfocus='this.blur();'"+style+"></span>";
      var editTheme = "<span class='fa fa-lg fa-fw fa-edit' id='editThemeBtn_" + _node.tId + "' title='修改目录' onfocus='this.blur();'"+style+"></span>";
      var delTheme = "<span class='fa fa-lg fa-fw fa-ban' id='deleteThemeBtn_" + _node.tId + "' title='删除目录' onfocus='this.blur();'"+style+"></span>";
      if(_node.ispage=="0"){
        sObj.after(addStr);
        if(!_node.isParent && _node.id!="页面目录"){
          sObj.after(delTheme);
        }
        sObj.after(editTheme);
        sObj.after(addTheme);
      } else{
        sObj.after(editStr);
        sObj.after(remStr);
      }
  
      //删除按钮
      $("#deleteBtn_" + _node.tId).bind('click', function() {
        _removeModal(_node);
        return false;
      });
      //修改按钮
      $('#editBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_show_modal.htm',$('#module_show_modal'),function(){
          moduleD_show_modal(_node, InitModTree,"pageEdit");
        });
      })
      //添加按钮
      $('#addBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_show_modal.htm',$('#module_show_modal'),function(){
          moduleD_show_modal(_node, InitModTree,"pageAdd");
        });
      });
      
      //创建目录按钮
      $('#addThemeBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_show_modal.htm',$('#module_show_modal'),function(){
          moduleD_show_modal(_node, InitModTree,"theme");
        });
      });
      
       //修改目录按钮
      $('#editThemeBtn_' + _node.tId).bind("click", function() {
        zy.net.loadHTML('bi/moduleD/moduleD_show_modal.htm',$('#module_show_modal'),function(){
          moduleD_show_modal(_node, InitModTree,"themeEdit");
        });
      });
      
       //删除目录按钮
      $('#deleteThemeBtn_' + _node.tId).bind("click", function() {
         zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
          zy.g.am.typecd = _node.id;
          zy.g.am.app = "a6929eedff5c49e5a1a0f5b490873b39";
          zy.g.am.mod = "view";
          zy.net.get('api/page_theme_delete', function(msg){
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
          zy.g.am.pageid = _node.id;
          zy.g.am.app = "a6929eedff5c49e5a1a0f5b490873b39";
          zy.g.am.mod = "view";
          zy.net.get('api/deletePageInfo', function(msg){
            if(msg && msg.ret=="0"){
              zy.ui.msg('提示', '删除成功', 's');
              var treeObj = $.fn.zTree.getZTreeObj("moduleD_show_widget_tree");
              
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
      $("#editBtn_" + _node.tId).unbind().remove();
      $("#deleteBtn_" + _node.tId).unbind().remove();
      $("#addThemeBtn_" + _node.tId).unbind().remove();
      $("#editThemeBtn_" + _node.tId).unbind().remove();
      $("#deleteThemeBtn_" + _node.tId).unbind().remove();
    }
  
    function onClick(event, treeId, treeNode, clickFlag) {
       if(treeNode.ispage=="0") return false;
       pageConfig(treeNode);
    }
    
    var tree = $.fn.zTree.init(ModTreeCon, setting, json);
  }
  
  function pageConfig(node){
    var cb = function(){
      $("#add_project").attr("disabled",null);
    };
    if(node.url==""){
      zy.net.loadHTML("bi/moduleD/moduleD_chart_show.htm?id="+node.id,$("#moduleD_show_widget_grid"),cb);
    } else {
      zy.net.loadHTML(node.url,$("#moduleD_show_widget_grid"),cb);
    }
  }

  
  return moduleD_show;
})(zy, jQuery);