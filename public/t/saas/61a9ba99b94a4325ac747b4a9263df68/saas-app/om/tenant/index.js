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
  
  var v_filter_form = $("[name=tenant-filter-form]"); //ztree 过滤表单
  
  var ztreeObj = null;  // ztree对象
  var nodeClick = null; // 点击的Tree节点对象
  
  function init(){
    
    //Tree 工具栏事件
    Tree_ToolBar_Event();
    
    
    zy.extend.get({
      app: '78cf8922c5ea4afa9dae8970215ea796',
      mod: 'tenant',
      apinm: 'orgGet'
    }, function (msg) {
      if (msg && msg.result)
        tree(msg.result);
    }, {});
  }

  // zTree初始化处理
  function tree(res) {

    // var _tree = null;
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
          title: "name"
        },
        simpleData: {
          enable: true, //是否用简单数据
          idKey: 'name', //对应json数据中的ID
          pIdKey: 'parentId', //对应json数据中的父ID
          // rootPId: 0 // 用于修正根节点父节点数据，即 pIdKey 指定的属性值
        }
      },
      callback: {
        onClick: click,
        // dblClickExpand: dblClickExpand,
        // onExpand: expand
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
      nodeClick = treeNode;
      //expand(event, treeId, treeNode);
      Right(treeNode);
    }
    function dblClickExpand(treeId, treeNode) {
    	return treeNode.level > 0;
    }
    ztreeObj = $.fn.zTree.init(treeContariner, option, res);
    // _tree.expandAll(true);
  } // tree end
  
  // zTree过滤搜索
  function tree_search(keyword, cb){
    zy.extend.get({
      app: '78cf8922c5ea4afa9dae8970215ea796',
      mod: 'tenant',
      apinm: 'orgGet'
    }, function (msg) {
      if (msg && msg.result)
        tree(msg.result);
        cb && cb();
    }, {keyword:keyword});
  }
  
  // API服务信息加载处理
  function Right(node){
    // if(node.flg!=='0'){return;} // zy.net.loadHTML：app、mod、api管理画面（如：添加、修改等）
    // // 非管理员不可查看编辑
    // if(zy.g.user.userid != node.pid) return ;
    window.tenantID = node._id;
    
    zy.net.loadHTMLs("saas/om/tenant/view.html",v_content,function(){
      // main(node);
      // tenant_member_view(node._id);
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
  
  // Tree 工具栏事件
  function Tree_ToolBar_Event() {
    //添加租户
    v_index.find("#node-add").on("click", function () {
      zy.net.loadHTMLs("saas/om/tenant/tenant_add_edit.html", v_modal, function () {
        tenant_add_edit(nodeClick, "i",function(data){
          ztreeObj.addNodes(null,data);
        });
      });
    });
    //修改租户
    v_index.find("#node-edit").on("click", function () {
      zy.net.loadHTMLs("saas/om/tenant/tenant_add_edit.html", v_modal, function () {
        tenant_add_edit(nodeClick, "u", function(data){
          $.extend(nodeClick,data);
          ztreeObj.updateNode(nodeClick);
        });
      });
    });
    //删除租户
    v_index.find("#node-delete").on("click", function () {
      
      //确认删除
      zy.ui.mask("删除确认", "是否确认删除此租户", function () {


        zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
        zy.g.am.mod = 'tenant';

        zy.net.get("api/orgDel", function (msg) {
          if (msg) {
            zy.ui.msg("提示", "删除成功", "s");
            
            ztreeObj.removeNode(nodeClick);
            
            nodeClick = null;
            
            // 右侧内容置空
            v_content.html("");
          
          }
        },
          {
            _id: nodeClick._id
          });

        
      });
      
    });
    
    
    //筛选表单切换按钮
    v_index.find("#tree_filter").on("click", function () {
      v_filter_form.toggle();
    });
    
    //筛选查询
    v_index.find("#filter_sx").on("click", function () {
      var $this = $(this);
      $this.button("loading");
      var keyword = v_filter_form.find("[name=keywords]").val();
      
      tree_search(keyword,function(){
        $this.button("reset");
      });
      // mdms_datadictD_index_tab.find("#tree_refresh").click();
    });
    //筛选取消
    v_index.find("#filter_qx").on("click", function () {
      // v_filter_form.find("[name=status]").select2("data", null);
      v_filter_form.resetForm();
      v_filter_form.hide();
    });
    
    // // tree刷新按钮
    // v_index.find("#tree_refresh").on("click",function(){
      
    // });
    
  }

 })();