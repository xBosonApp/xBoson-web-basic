/**
 *  ETL ESB一览
 *  eeb_overview_index
 * */
var eeb_overview_index = (function(){
  
  var pt = eeb_overview_index.prototype;
  var thiz;
  
  pt._g={};
  
  function eeb_overview_index(){
    thiz = this;
    thiz.Init();
  }
  
  pt.Init = function(){
    thiz.Tree();
    thiz.noUiSlider();
  }
  
  var widget = $('#eeb_overview_index');
  var ztreeDiv = $('#eeb_overview_ztree');
  var innercontent = $('#innercontent');
  
  var ztreeObj = null;  //ztree对象
  
  //初始化ztree
  pt.Tree = function() {
    
    var treeContariner = ztreeDiv.find('.ztree');
    
    var option = {
      view: {
        showTitle: false,
        dblClickExpand: false
      },
      data: {
        key: {
          name: "treename",
        },
        simpleData: {
          enable: true,
          idKey: "treeid",
          pIdKey: "treepid"
        }
      },
      callback: {
        onClick: click
      }
    }
    
    function click(event, treeId, treeNode){
      zy.log(treeNode);
      Right(treeNode);
    }
    zy.g.am.app = 'bf1d70edb9d6463d968a175ce7a6fd3a';
    zy.g.am.mod = 'eeb_overview';
    zy.net.get('api/overview_tree',function(msg){
      if(msg){
        ztreeObj = $.fn.zTree.init(treeContariner, option, msg.result);
        ztreeObj.expandNode(ztreeObj.getNodeByParam('treeid','ETL'));
        ztreeObj.expandNode(ztreeObj.getNodeByParam('treeid','ESB'));
      }  
    });
  }
  
  function Right(node){
    zy.net.loadHTML("eeb/eeb_overview/table.html",innercontent,function(){
      new eeb_overview_table(node);
    });
  }

  //初始化noUiSlider
  pt.noUiSlider = function(){
    innercontent.css({'border-width':"0px 0px 0px 1px",'border-style':"solid",'border-left-color':"#CCC!important",'background':"#F0F0F6"});
    //noUi Sliders 区域范围滑块插件处理
    $("#eeb_overview_nouislider").noUiSlider({
      range: [0, 100],
      start: 25,
      handles: 1,
      connect: true,
      slide: function(){
        zy.log('noUiSliderEvent');
        var values = $(this).val();
        if(10>values){
          ztreeDiv.css({'display':'none','width':'0%'});
          innercontent.css({'display':"block",'width':"100%"});
          $(this).val(0);
          return false;
        } else {
          ztreeDiv.css({'display':'block','width': + values + '%'});
        }
        if(33>(100-values)){
          innercontent.css({'display':'none'});
        } else {
          innercontent.css({'display':'block','width':(100-values) + '%'});
        }
      }
    });
  }
  
  return eeb_overview_index;
 })();