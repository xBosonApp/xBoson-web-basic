/* Create By xBoson System */
/* Create By xBoson System */
/**
 * API服务目录信息 
 * @class ws.api.v.index
 */
(function(){
  var v_index = $('#ws_api_v_index');
  var v_header = v_index.children("header");
  var v_modal = $('#ws_api_v_modal');
  var v_ztree = $('#ws_api_v_ztree');
  var v_content = $('#ws_api_v_innercontent');
  var v_nouislider= $("#ws_api_v_nouislider");
  function init(){
    zy.extend.get({
      app: 'apils',
      mod: 'apihelp',
      apinm: 'getprj'
    }, function (msg) {
      if (msg && msg.result)
        tree(msg.result);
    }, {flg:'0'});
  }

  // zTree初始化处理
  function tree(res) {

    var _tree = null;
    var treeContariner = v_ztree.find('.ztree');
    var option = {
      view: {
        showTitle: false,
        //dblClickExpand: false
      },
      data: {
        keep:{parent: false},
        key: {
          name: "name",
          isParent: "parent",
          title: "id"
        },
        simpleData: {
          enable: true, //是否用简单数据
          idKey: 'nid', //对应json数据中的ID
          pIdKey: 'pid', //对应json数据中的父ID
          rootPId: 0 // 用于修正根节点父节点数据，即 pIdKey 指定的属性值
        }
      },
      callback: {
        onClick: click,
        dblClickExpand: dblClickExpand,
        onExpand: expand
      }
    };
    // 节点被展开的事件回调函数
    function expand(_e,_id,_node){
      var treeObj = $.fn.zTree.getZTreeObj(_id);
      var node = treeObj.getNodeByTId(_node.tId);
      if (_node.flg==='0'){return;}
      if (!_node.children) {//判断是否有二级树
        zy.extend.get({
          app: 'apils',
          mod: 'apihelp',
          apinm: 'getapi'
        }, function (msg) {
          if (msg && msg.value) {
            newNode = treeObj.addNodes(node, msg.value);
            // var nodeName = _node.name;//记录节点名称
            // var str = nodeName.split("{");//去掉括号
            // var newname = str[0]+"{"+msg.value.length+'}';//添加子节点数并加上括号
            // _node.name = newname;//重新命名
            // treeObj.updateNode(_node);//并更新节点信息
            $("#"+_node.tId+'_span').append('<sup class="badge bg-color-magenta ws-api-ztree-node-n bounceIn animated">'+msg.value.length+'</sup>');
          }
        }, {prjid:_node.prjid,id:_node.id,pid:_node.pid,flg:_node.flg});
        zy.log("_node: flg="+_node.flg +' > id='+_node.id +' > pid='+ _node.pid +' > name='+ _node.name);
      }
    }
    // 节点被点击的事件回调函数
    function click(event, treeId, treeNode){
      zy.log('treeNode=',treeNode);
      //expand(event, treeId, treeNode);
      Right(treeNode);
    }
    function dblClickExpand(treeId, treeNode) {
    	return treeNode.level > 0;
    }
    _tree = $.fn.zTree.init(treeContariner, option, res);
    // _tree.expandAll(true);
  } // tree end

  // API服务信息加载处理
  function Right(node){
    if(node.flg!=='0'){return;} // zy.net.loadHTML：app、mod、api管理画面（如：添加、修改等）
    zy.net.loadHTMLs("saas/om/tenant/view.html",v_content,function(){
      main(node);
    });
  }

  //* noUi Sliders 区域范围滑块插件处理
  v_nouislider.noUiSlider({
    range: [0, 100],
    start: 25,
    handles: 1,
    connect: true,
    slide: function(){
      zy.log('noUiSliderEvent');
      var values = $(this).val();
      if(10>values){
        v_ztree.css({'display':'none','width':'0%'});
        v_content.css({'display':"block",'width':"100%"});
        $(this).val(0);
        return false;
      } else {
        v_ztree.css({'display':'block','width': + values + '%'});
      }
      if(33>(100-values)){
        v_content.css({'display':'none'});
      } else {
        v_content.css({'display':'block','width':(100-values) + '%'});
      }
    }
  });
  
  //树形列表显示隐藏
  v_header.children('[name=ws_api_v_tree]').click(function(){
    if(v_ztree.is(':visible')){
      v_nouislider.val(0);
      v_ztree.css({'display':'none','width':'0%'});
      v_content.css({'display':"block",'width':"100%"});
    }else{
     v_nouislider.val(25);
      v_ztree.css({'display':'block','width': '25%'});
      v_content.css({'display':"block",'width':"75%"});
    }
  });
  // 状态选择
  v_header.find(".js-status-update a").click(function () {
    var selText = $(this).text();
    var $this = $(this);
    $this.parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    $this.parents('.dropdown-menu').find('li').removeClass('active');
    $this.parent().addClass('active');
	});

  v_content.css({'border-width':"0px 0px 1px 1px",'border-style':"solid",
      'border-color':"#ccc",'background':"#f0f6f1"});
	v_ztree.animate({scrollTop: v_ztree[0].scrollHeight},500);

  init();

 })();