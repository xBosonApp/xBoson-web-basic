/* Create By xBoson System */
   (function(){
   
  var container = $('#std_index');
  var bm_modal = $('#std_modal');
  var innercontent = $('#innercontent');
  var left_ztree = $('#_ztree');
   
	 function init(){
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
      
      container.find('[name=std_menu_header]').find('h2').html(head.join('->'));
   }
   
    function tree() {
      
      var _tree = null;
      
      var treeContariner = container.find('.ztree');
      
      var option = {
          view: {
            showTitle: showTitle,
            dblClickExpand: false,
            addHoverDom: _addHoverDom,
            removeHoverDom: _removeHoverDom
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
        return true;
      }
      
      function expand(_e,_id,_node){
        if(!_node.children || _node.children.length == 0) From_server(_node);
        
        bread(_node);
      }
      
      function click(event, treeId, treeNode){
        zy.log(treeNode);
        Right(treeNode);
        
        bread(treeNode);
      }
      
      function _addHoverDom(_id, _node) {
          var sObj = $("#" + _node.tId + "_span");
          if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
            return;
          var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
          var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
           var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
           
           if(_node.level!=0){
            sObj.after(remStr);
            sObj.after(editStr);
           }
           sObj.after(addStr);
           
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
                  app:'faac7c3dc3844e61a8ca4bd7ab2ff096',
                  mod:'tree',
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
        }
  
      function _removeHoverDom(_id, _node) {
          $("#addBtn_" + _node.tId).unbind().remove();
          $("#editBtn_" + _node.tId).unbind().remove();
          $("#remBtn_" + _node.tId).unbind().remove();
        }
        
      //flag i:添加，u:修改
      function Modal(flag,node){
        zy.net.loadHTML("ws/srds/m/tree_node_modal.html",bm_modal,function(){
          std_tree_node_modal(flag,node,_tree);
        });
      }
      
      _tree = $.fn.zTree.init(treeContariner, option, []);
      
      From_server(null);
      
      function From_server(node){
        var typecd = (node&&node.typecd)?node.typecd:'';
        zy.extend.get({
          app:'faac7c3dc3844e61a8ca4bd7ab2ff096',
          mod:'tree',
          apinm:'getnodes'
        },function(msg){
          _tree.addNodes(node,msg.result,false);
        },{typecd:typecd});
      }
    }
    
    function Right(node){
      if(!node.standard){
        return;
      }
      var target = container.find('#innercontent');
      zy.net.loadHTML("ws/srds/m/dict_view.html",target,function(){
        main(node);
      });
    }
    
    tree();

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
  $("[name=std_menu_header]").find('[name=std_menu_tree]').click(function(){
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
 })();