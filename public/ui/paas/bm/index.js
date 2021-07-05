bm_Index = (function(){
   
  var pt = bm_index.prototype;
  var thiz;
  
  var container = $('#bm_index');
  var bm_modal = $('#bm_modal');
  var innercontent = $('#innercontent');
  var left_ztree = $('#_ztree');
  
  var nodeClick = null;
  
  function bm_Index(){
    thiz = this;
    init();
    return this;
  }
  
  function init(){
    tree();
  }
   
  function bread(n){
    function Head(node,arr){
      if(node==n){
        arr[node.level] = node.typenm+"("+node.typecd+")";
      }else{
        arr[node.level] = node.typenm;
      }
      
      if(node.getParentNode()) Head(node.getParentNode(),arr);
    }
    
    var head = [];
    Head(n,head);
    
    zy.log(head.join('->'));
    
    container.find('[name=bm_menu_header]').find('h2').html(head.join('->'));
  }
   
  function tree() {
    
    var _tree = null;
    
    var treeContariner = container.find('.ztree');
    
    var option = {
        view: {
          showTitle: showTitle,
          dblClickExpand: false,
          addHoverDom: _addHoverDom,
          removeHoverDom: _removeHoverDom,
          fontCss:getFont
        },
        data: {
          key: {
            name: "typenm",
            title: "typecd"
          },
          simpleData: {
            enable: true,
            idKey: "typecd",
            pIdKey: "parentcd"
          }
        },
        callback: {
          onClick: click,
          onExpand: expand
        }
      }
      
    function showTitle(treeId,treeNode){
      return !treeNode.flag;
    }
    
    function getFont(treeId, treeNode) {
      if(treeNode.uri && treeNode.uri !== '') {
        return  {'color':'blue'};
      }
    }
    
    function expand(_e,_id,_node){
      if(!_node.children || _node.children.length === 0) From_server(_node);
      
      bread(_node);
    }
    
    function click(event, treeId, treeNode){
      zy.log(treeNode);
      nodeClick = treeNode;
      if(treeNode.uri && treeNode.uri !== '') Right(treeNode);
      
      bread(treeNode);
    }
    
    function _addHoverDom(_id, _node) {
        var sObj = $("#" + _node.tId + "_span");
        if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0 || $("#setBtn_" + _node.tId).length > 0)
          return;
        var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
        var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
         var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
         var setStr = "<span class='button sort' id='setBtn_" + _node.tId + "' title='设置' onfocus='this.blur();'></span>";
         
         //只有多维模型下的节点显示这些按钮
        if(!_node.flag){
          if(!_node.isParent && _node.typecd!='MDDM.MDM.AUTH') {
            sObj.after(remStr);
          }
          if(_node.new_node===false) sObj.after(setStr);
          if(_node.level>0) sObj.after(editStr);
          if(_node.bm004!==undefined&&_node.bm004!='0'){
          }else{
            sObj.after(addStr);
          }
        }
  
        $('#addBtn_' + _node.tId).bind("click", function() {
          _tree.selectNode(_node);
          Modal("i",_node);
          zy.log('添加',_node);
          return false;
        })
        $('#editBtn_' + _node.tId).bind('click', function() {
          _tree.selectNode(_node);
          Modal("u",_node);
          zy.log('修改',_node);
          return false;
        })
        $("#remBtn_" + _node.tId).bind('click', function () {
          _tree.selectNode(_node);
          zy.ui.mask('确认删除','请确认删除！',function(){
            zy.extend.get({
                app:'c770045becc04c7583f626faacd3b456',
                mod:'bmtree',
                apinm:'delnode'
              },function(msg){
              if(msg.ret=='0'){
                _tree.removeNode(_node);
                zy.ui.msg('提示信息：','删除成功！','s');
              }
            },{typecd:_node.typecd});
          });
          zy.log('删除',_node);
          return false;
        })
        $("#setBtn_" + _node.tId).bind('click', function () {
          _tree.selectNode(_node);
          Modal("s",_node);
          zy.log('设置',_node);
          return false;
        })
      }
  
    function _removeHoverDom(_id, _node) {
      $("#addBtn_" + _node.tId).unbind().remove();
      $("#editBtn_" + _node.tId).unbind().remove();
      $("#remBtn_" + _node.tId).unbind().remove();
      $("#setBtn_" + _node.tId).unbind().remove();
    }
      
    //flag i:添加，u:修改，s:设置
    function Modal(flag,node){
      if(flag=="s"){
        zy.net.loadHTML("bm/bm_mddm03.html",bm_modal,function(){
          var bm_mddm03Obj=new bm_mddm03(node,_tree);
        });
      }else{
        zy.net.loadHTML("bm/Tree_Node_Modal.html",bm_modal,function(){
          bm_tree_node_modal(flag,node,_tree);
        });
      }
    }
    
    _tree = $.fn.zTree.init(treeContariner, option, []);
    
    From_server(null);
    
    function From_server(node){
      var typecd = '';
      if(node) typecd = node.typecd;
      
      var typecd = node?node.typecd:'';
      zy.extend.get({
        app:'c770045becc04c7583f626faacd3b456',
        mod:'bmtree',
        apinm:'gettree'
      },function(msg){
        _tree.addNodes(node,msg.result);
      },{typecd:typecd});
    }
  }
    
  function Right(node){
    var url = node.uri;
    var target = container.find('#innercontent');
    
    zy.net.loadHTML(url,target,function(){
      main(node);
    });
  }

  $("#innercontent").css({'border-width':"0px 0px 0px 1px",'border-style':"solid",'border-left-color':"#CCC!important",'background':"#F0F0F6"});
  //* noUi Sliders 区域范围滑块插件处理
  $("#nouislider").noUiSlider({
    range: [0, 100],
    start: 25,
    handles: 1,
    connect: true,
    slide: function(){
      zy.log('noUiSliderEvent');
      var values = $(this).val();
      if(10>values){
        $("#_ztree").css({'display':'none','width':'0%'});
        $("#innercontent").css({'display':"block",'width':"100%"});
        $(this).val(0);
        return false;
      } else {
        $("#_ztree").css({'display':'block','width': + values + '%'});
      }
      if(33>(100-values)){
        $("#innercontent").css({'display':'none'});
      } else {
        $("#innercontent").css({'display':'block','width':(100-values) + '%'});
      }
    }
  });
  
  //树形列表显示隐藏
  $("[name=bm_menu_header]").find('[name=bm_menu_tree]').click(function(){
    if(left_ztree.is(':visible')){
      $("#nouislider").val(0);
      $("#_ztree").css({'display':'none','width':'0%'});
      $("#innercontent").css({'display':"block",'width':"100%"});
    }else{
      $("#nouislider").val(25);
      $("#_ztree").css({'display':'block','width': '25%'});
      $("#innercontent").css({'display':"block",'width':"75%"});
    }
  });
  
  //帮助按钮
  $("[name=bm_menu_header]").find('[name=bm_menu_help]').click(function(){
    zy.net.loadHTML('bm/help/usage.htm',bm_modal);
  });
  
  //测试按钮
  $("[name=bm_menu_header]").find('[name=bm_menu_run]').click(function(){
    if(!(nodeClick&&(nodeClick.bm003=='1'||nodeClick.bm004=='1'))){
      zy.ui.msg('提示信息：','请选中有效的Tree节点','i');
      return true;
    }
    var api = {};
    if(nodeClick.bm003=='1'){
      api = {
        'appid':'c770045becc04c7583f626faacd3b456',
        'moduleid':'commapi',
        'apiid':'exc_select'
      };
    }else if(nodeClick.bm004=='1'){
      api = {
        'appid':'c770045becc04c7583f626faacd3b456',
        'moduleid':'commapi',
        'apiid':'exc_chart_select'
      };
    }else{
      return;
    }
    zy.net.loadHTML('ide/htmlide/ide_run.html',bm_modal,function(){
      //  调接口获取typecontent
      zy.g.am.app="c770045becc04c7583f626faacd3b456";
      zy.g.am.mod="getmodelinfo";
      zy.net.get('api/type2tabledata',function(msg){
        if(msg){
          var help_info = {param:[]};
          //添加固定参数
          help_info.param.push({
            'key':'modolcd',
            'value':nodeClick.typecd,
            'desc':''
          });
          // help_info.param.push({
          //   'key':'_source',
          //   'value':'0',
          //   'desc':''
          // });
          // help_info.param.push({
          //   'key':'pagenum',
          //   'value':'1',
          //   'desc':''
          // });
          // help_info.param.push({
          //   'key':'pagesize',
          //   'value':'10',
          //   'desc':''
          // });
          for(var r in msg.search){
            help_info.param.push({
              'key':msg.search[r].en,
              'value':'',
              'desc':''
            });
          }
          help_info = JSON.stringify(help_info);
          RunApi(api,help_info);
        }
      },{'typecd':nodeClick.typecd});
    });
  });
  
  //配置数据按钮
  $("[name=bm_menu_header]").find('[name=bm_menu_config]').click(function(){
    if(!(nodeClick&&(nodeClick.bm003=='1'||nodeClick.bm004=='1'))){
      zy.ui.msg('提示信息：','请选中有效的Tree节点','i');
      return true;
    }
    zy.net.loadHTML('bm/bm_mddm05.html',bm_modal,function(){
      bm_mddm05(nodeClick.typecd);
    });
  });
  return bm_Index;
 })();