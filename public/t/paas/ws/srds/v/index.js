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
            dblClickExpand: false
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
      
      _tree = $.fn.zTree.init(treeContariner, option, []);
      
      From_server(null);
      
      function From_server(node){
        var typecd = (node&&node.typecd)?node.typecd:'';
        zy.extend.get({
          app:'faac7c3dc3844e61a8ca4bd7ab2ff096',
          mod:'tree',
          apinm:'getnodes'
        },function(msg){
          _tree.addNodes(node,msg.result2,false);
        },{typecd:typecd});
      }
    }
    
    function Right(node){
      if(!node.standard){
        return;
      }
      var target = container.find('#innercontent');
      
      zy.net.loadHTML("ws/srds/v/dict_view.html",target,function(){
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