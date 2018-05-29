 (function () {
  var container;

  var cache = {
    modsTreeList:null,
    moduleCache:{}
  };

  /* 根据pageid 获取 page信息 */
  function GetPage(pageid,cb){
    zy.extend.get({
      apinm:'html_mod_sel',
      mod:'echart',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
      cb && cb(msg.mods);
    },{
      pageid: pageid
    });
  }

  /* 生成随机ID */
  function RandomID(){
    return (new Date()).getTime() + Math.round(Math.random() * 100000);
  }
  
  /* 全局事件 */
  function Event(size){
    if(size == ''){
      console.log('---------5' + pageid)
      var list = $('#size a');
      list.bind('click',function(){
        var $this = $(this);
        var size = Number($this.attr('id'));
        BuildDom(size);
      });
    }else{
      BuildDom(size);
    }
  }
  
  /* 缓存 暂时未用 */
  function Cache(len,cb){
    // if(len){
      zy.log('Cache.......function');
      zy.extend.get({
        apinm:'mod_json_sel',
        mod:'echart',
        app:'a6929eedff5c49e5a1a0f5b490873b39'
      },function(msg){
        cache.modsTreeList = msg.pids;
        cb && cb();
      },{});
    // }else{
    //   cb && cb();
    // }
  }
  
  /* 主入口 */
  function Init(pageid,size) {
    container = $('#widget-grid');
    PageSetUp();
    if(size){
      GetPage(pageid,function(mods){
        Cache(mods.length,function(){
          DataToDom(mods);
          Event(size);
          console.log('--------------2' + pageid)
        });
      });
    }else{
      GetPage(pageid,function(mods){
        Cache(mods.length,function(){
          DataToDom(mods);
          Event(size);
        });
      });
    }
    
  }
  
  /* 铺数据 */
  function DataToDom(mods){
    mods.forEach(function(mod,index){
      var param, domid, size;
      param = JSON.parse(mod.optdata);
      domid = mod.domid;
      size = Number(param.size);
      BuildDom(size, domid, param);
    });
  }
  
  /* 取数据 */
  function DomToServer(dom, callback){
    console.log('--------------4' + pageid)
    var domid, modid, row, size, param;
    domid = dom.attr('id');
    modid = dom.attr('_modid');
    row = dom.parent().attr('_index');
    size = dom.attr('_size');
    
    param = {
      pageid:pageid,
      domid:domid,
      modid:modid,
      optdata:JSON.stringify({
        size:size,
        row:row,
        modid:modid
      })
    };
    
    zy.extend.post({
      apinm:'html_mod_add',
      mod:'echart',
      app:'a6929eedff5c49e5a1a0f5b490873b39'
    },function(msg){
      zy.extend.msg('保存成功','s');
      callback && callback(param);
    },param);
  }
  
  /* 构建DOM */
  function BuildDom(num, id, param, oldarticle) {
    var widgetbody, article, flg, rowSize, div, close, header;
    
    div = $('<div>').addClass('row');
    rowSize = 0;

      function _article() {
        var article = $('#template').clone(true);
        article
          .addClass('col-xs-12 col-sm-' + num)
          .addClass('col-md-' + num)
          .addClass('col-lg-' + num)
          .attr('_size', num);
        var ID = id || RandomID();
        article.attr('id',ID);
        article.show();
        
        article.children('.jarviswidget').attr('id',ID + '_jar');
        
        article.find('.ztree').attr('id',ID + '_tree');
  
        return article;
      }

    article = oldarticle || _article(num);
    widgetbody = article.find('.widget-body');
    close = article.find('.fa-times');
    header = article.find('.jarviswidget > header');
    flg = false;
    
    if(!param){
      container.children().each(function (i, v) {
        rowSize++;
        var total = 0;
        $(v).children().each(function (ii, vv) {
          total += Number($(vv).attr('_size'));
        });
  
        if (total + num < 13) {
          $(v).append(article);
          flg = true;
          return false;
        }
      });
      if (!flg) {
        div.attr('_index',rowSize);
        div.append(article).appendTo(container);
      }
    }else{
      var rowIndex = param.row;
      var newRow = null;
      if(container.find('[_index=' + rowIndex + ']').length > 0){
        newRow = container.find('[_index=' + rowIndex + ']');
        newRow.append(article);
      }else{
        newRow = $('<div>').addClass('row').attr('_index',rowIndex);
        newRow.append(article).appendTo(container);
      }
      article.attr('_modid',param.modid);
      LoadModule(article,{modid:param.modid});
    }
    
    function ToolBar(){
      
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
      
      function ModuleListBtn(){
        var div, i;
        div = NewBtn('模块列表','glyphicon-list');
        i = div.children('i');
        
        i.unbind('click').click(function(){
          var target = close.closest('.col-md-6');
          if(target.is(':visible')){
            close.closest('.col-md-6').hide();
          }else{
            close.closest('.col-md-6').show();
          }
          widgetbody.trigger('_changesize');
        });
        
        return div.append(i);
      }

      function SearchBtn(){
        var div, i;
        div = NewBtn('查询','glyphicon-search');
        i = div.children('i');
    
        i.unbind('click').bind('click',function(){
          var target = article.find('.chart_form_div');
          if(target.is(':visible')) target.hide();
          else target.show();
        });
        return div;
      }
      
      function SaveModuleBtn(){
        var div, i;
        div = NewBtn('保存','glyphicon-floppy-saved');
        i = div.children('i');
        
        i.unbind('click').click(function(){
          var art = $(this).closest('article');
          DomToServer(art, function(newparam){
            param = newparam;
          });
        });
        
        return div.append(i);
      }
      
      function ResetBtn(){
        var div, i;
        div = NewBtn('重置','glyphicon-repeat');
        i = div.children('i');
        
        i.unbind('click').click(function(){
          var art = $(this).closest('article');
          header.find('h2').html('');
          if(param){
            LoadModule(art,{modid:param.modid});
          }
          buildModTree(art);
          AllDone();
        });
        
        return div.append(i);
      }
      
      header.append(ResetBtn());
      header.append(SaveModuleBtn());
      header.append(SearchBtn());
      header.append(ModuleListBtn());
    }
    
    function JwInit(){
      var o = Jw(DelDom);
      PageSetUp();
      article.jarvisWidgets(o);
    }
    
    function DelDom(){
      zy.extend.get({
        apinm:'html_mod_del',
        mod:'echart',
        app:'a6929eedff5c49e5a1a0f5b490873b39'
      },function(msg){
        article.remove();
        zy.extend.msg('删除成功','s'); 
      },{
        domid:article.attr('id'),
        pageid:pageid
      });
      if(!$('#widget-grid').children){
        $('#newlay').show();
      }
    }
    
    function Event(){
      widgetbody.bind('_changesize',function(e){
        var $this = $(this);
        window.ee = $this;
        if($this.children(':visible').length == 1){
          $this.children(':first').removeClass().addClass('col-md-12');
        }else{
          $this.children(':first').removeClass().addClass('col-md-6');
        }
      });

      close.bind('click',function(){
        var target = $(this).closest('.col-md-6');
        target.hide();
        widgetbody.trigger('_changesize');
      });
    }
    
    function AllDone(){
      if(param){
        close.closest('.col-md-6').hide();
      }else{
        article.find('#module_con').empty();
        close.closest('.col-md-6').show();
      }
      widgetbody.trigger('_changesize');
    }
    
    Event(num);
    JwInit();
    ToolBar();
    buildModTree(article);
    AllDone();
  }
  
  /* 为每个模块构建模块列表 */
  function buildModTree(con) {
    var treecon = con.find('.ztree');
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

    function onClick(event, treeId, treeNode, clickFlag) {
      if(treeNode.isParent) return false;
      LoadModule(con,treeNode);
      con.attr('_modid',treeNode.modid);
      // treecon.closest('.col-md-6').hide();
      // treecon.closest('.col-md-6').parent().trigger('_changesize');
    }
    tree = $.fn.zTree.init(treecon, setting, cache.modsTreeList);
  }
  
  /* 与模块对接处 */
  function LoadModule(con,param){
    var modulecon = con.find('#module_con');
    var header = con.children('.jarviswidget').children('header').find('h2');
    
    modulecon.empty();
  
    new Module(modulecon, param, function(conn,thiz){
      var mod = thiz.fn.GetSelf();
      modulecon.children('form').hide();
      header.html(mod.modnm);
    });
  }
  
  /* 对App.js中的pagesetup 再封装 */
  function PageSetUp(){
		$.enableJarvisWidgets = false;
		window.pageSetUp();
		$.enableJarvisWidgets = true;
  }
  
  /* jw框架的配置 */
  function Jw(on_delete){
    return {
			grid: 'article',
			widgets: '.jarviswidget',
			localStorage: true,
			deleteSettingsKey: '.deletesettingskey-options',
			settingsKeyLabel: '重置设置?',
			deletePositionKey: '.deletepositionkey-options',
			positionKeyLabel: '重置位置?',
			sortable: true,
			buttonsHidden: false,
			// toggle button
			toggleButton: true,
			toggleClass: 'fa fa-minus | fa fa-plus',
			toggleSpeed: 200,
			onToggle: function () {},
			// delete btn
			deleteButton: true,
			deleteClass: 'fa fa-times',
			deleteSpeed: 200,
			onDelete: function () {
				on_delete && on_delete();
			},
			// edit btn
			editButton: true,
			editPlaceholder: '.jarviswidget-editbox',
			editClass: 'fa fa-cog | fa fa-save',
			editSpeed: 200,
			onEdit: function () {},
			// color button
			colorButton: true,
			// full screen
			fullscreenButton: true,
			fullscreenClass: 'fa fa-expand | fa fa-compress',
			fullscreenDiff: 3,
			onFullscreen: function () {},
			// custom btn
			customButton: false,
			customClass: 'folder-10 | next-10',
			customStart: function () {
				alert('你好, 这是一个自定义按钮...');
			},
			customEnd: function () {
				alert('下次再会...');
			},
			// order
			buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
			opacity: 1.0,
			dragHandle: '',
			placeholderClass: 'jarviswidget-placeholder',
			indicator: true,
			indicatorTime: 600,
			ajax: true,
			timestampPlaceholder: '.jarviswidget-timestamp',
			timestampFormat: '更新时间: %y%/%m%/%d% %h%:%i%:%s%',
			refreshButton: true,
			refreshButtonClass: 'fa fa-refresh',
			labelError: '对不起有一个错误:',
			labelUpdated: '最新更新:',
			labelRefresh: '刷新',
			labelDelete: '删除 widget:',
			afterLoad: function () {},
			rtl: false, // 暂时不能切换!
			onChange: function () {},
			onSave: function () {},
			ajaxnav: $.navAsAjax // 应当保存在本地存储里 localstorage
		};
  }
  
  if(!window.zy.chart){
    window.zy.chart = {
      pagecontrol: Init,
      BuildDom: BuildDom,
    };
  }

})();