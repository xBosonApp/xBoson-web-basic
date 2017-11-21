/**
 * 模型设置页面
 * */
 
  bm_mddm03 = (function(){
    var PT = bm_mddm03.prototype;
    var thiz;
    
    var modal = $("#bm_mddm03_modal");
    var tabnav = $('#bm_mddm03_tabs');
    //tab1
    var tab1= $('#bm_mddm03_tabs a[href="#bm_mddm03_tabs-a"]');
    var tab1C = {
      formUpd: $('#bm_mddm03_upd_form'),
      exportType: $('#bm_mddm03_upd_form').find('[name=export-type]'),
      fileName: $('#bm_mddm03_upd_form').find('[name=fileName]'),
      upSection: $('#bm_mddm03_upd_form').find('[name=upload-file]'),
      upFile: $('#bm_mddm03_upd_form').find('[name=file]'),
      upBtn: modal.find('[name=upfile]'),
      
      form: $('#bm_mddm03_tab1_form'),
      dataway: $('#bm_mddm03_tab1_form').find('[name="dataway"]'),
      sqlinfo: $("#bm_mddm03_tab1_form").find('[name="sqlinfo"]'),
      sqltext: $("#bm_mddm03_tab1_form").find('[name="sqltext"]'),
      sqlparam: $("#bm_mddm03_sqlparams"),
      spanTbl: $("#bm_mddm03_tbl"),
      submitBtn: $('#bm_mddm03_dataBtn'),
      table: $('#bm_mddm03_tab1_table'),  //数据表格
      pageDiv: $('#bm_mddm03_tab1_pagination'),  //数据表格分页
      tbl_type: $('#bm_mddm03_tab1_tbl_type'),  //显示返回的type
      tbl_search: $('#bm_mddm03_tab1_tbl_search')  //显示返回的search
    };
    
    //tab2
    var tab2 = $('#bm_mddm03_tabs a[href="#bm_mddm03_tabs-b"]');
    var Tab2form = $("#bm_mddm03_tab2_form");
    var dedir = $("#bm_mddm03_tab2_form").find("[name=dedir]");
    var dsdir = $("#bm_mddm03_tab2_form").find("[name=dsdir]");
    
    var dt = $("#bm_mddm03_table");
    var deTree = $("#bm_mddm03_deTree");
    var dsTree = $("#bm_mddm03_dsTree");
    
    var submitBtn = $("#bm_mddm03_submit");
    /**
     * 默认参数
     * @attribute defaults
     * @private
   */
    PT.defaults = {};
    
    PT.opts={
      node:null,  //tree节点
      ztreeObj:null,  //ztree对象
      tab2Init:false  //Tab2是否初始化
    };
    
    /**
   * @class bm_mddm03 构造方法
   * @constructor
   * @param {Object} options 参数{_node:{},ztreeObj:{}}
   */
    function bm_mddm03(_node,ztreeObj){
      thiz = this;
      // thiz.opts=$.extend({},thiz.defaults,{});
      thiz.opts.node=_node; //tree节点
      thiz.opts.ztreeObj=ztreeObj;  //ztree对象
      thiz.opts.tab2Init=false;
      
      $('#bm_mddm03_modal').modal('show');
      $('#bm_mddm03_tabs').tabs();
      thiz.Init();
    }
    
  /**
   * 初始化
   * @method Init
   * */
  PT.Init = function(){
    //为隐藏的input name=typecd赋值
    tab1C.formUpd.find("[name=typecd]").val(thiz.opts.node.typecd);
    Tab2form.find("[name=typecd]").val(thiz.opts.node.typecd);
    
    InitTab1();
    // thiz.InitTab2();
    // thiz.opts.tab2Init=true;
  }
    
  /**
   * 初始化tab1（导出数据）
   * @method InitTab1
   * private
   * */
  function InitTab1(){
    Tab1Event.submitBtn();  //模态确认按钮
    Tab1Event.tab1();       //点击导出数据tab页时
    Tab1Event.tab2();       //点击创建表tab页时
    Tab1Event.formSubmit();   //点击查看数据按钮时
    Tab1Event.upFileEvent();  //上传按钮
    Tab1Event.export_type();  //导出类型select2
    Tab1Event.dataway();    //单选按钮change事件
    
    zy.g.am.app="c770045becc04c7583f626faacd3b456";
    zy.g.am.mod="getmodelinfo";
    zy.net.get("api/type2tabledata",function(msg){
      if(msg && msg.type && msg.search && msg.result){
        //为变量赋值
        thiz.opts.msgType=msg.type;
        thiz.opts.msgSearch=msg.search;
        thiz.opts.msgTableJson=msg.table_json;
        //sqltext
        tab1C.sqltext.text(msg.result[0].sqltext);
        //filenm
        tab1C.fileName.val(msg.result[0].filenm);
        //sqlparams
        if(msg.search.length===0){
          tab1C.sqlparam.text('无');
        }else{
          zy.log('111111');
          //动态生成where条件输入框
          var _result=thiz.generate_search(msg.search);
          tab1C.sqlparam.append(_result);
        }
        //查询物理表span
        if(msg.table_json){
          tab1C.spanTbl.text(msg.table_json.cn+'（'+msg.table_json.en+'）');
        }else{
          tab1C.spanTbl.text('（无）');
          tab1C.spanTbl.prev().attr("disabled",true);
        }
      }
    },{"typecd":thiz.opts.node.typecd});
  }
    
    /**
     * 初始化Tab2
     * @method InitTab2
     * */
    PT.InitTab2 = function(){
      //数据源select2
      zy.g.am.app="c879dcc94d204d96a98a34e0b7d75676";
      zy.g.am.mod="tableandindex";
      zy.net.get("api/datasource",function(msg){
        $('#bm_mddm03_modal [name=did]').zySelectCustomData('', false, {
          width:"100%",
          allowClear:false
        }, msg.data);
      },{});
      
      //初始化tree
      zy.g.am.app="c879dcc94d204d96a98a34e0b7d75676";
      zy.g.am.mod="outdatasource";
      zy.net.get("api/getdedstree",function(msg){
        if(msg && msg.result0 && msg.result1){
          thiz.InitTree(msg.result0,msg.result1);
        }
      },{});
      
      //表信息Grid
      thiz.InitGrid(thiz.opts.msgType);
      //有表时，只读显示
      if(thiz.opts.msgTableJson){
        thiz.Data2Form(thiz.opts.msgTableJson);
      }
      //没有创建表时，注册一系列事件
      else{
        //注册事件
        thiz.Tab2Event();
        //form 验证validate
        thiz.FormValidate();
      }
      
      thiz.opts.tab2Init=true;
    };
    
  /**
   * Tab2初始化表信息Grid
   * @method InitGrid
   * */
  PT.InitGrid = function(data){
    var columns = [{
        "title": '列英文名',
        "data": "en"
      }, {
        "title": '列中文名',
        "data": "cn"
      }, {
        "title": '是否必填',
        "data": "must"
      }, {
        "title": '元素标签类型',
        "data": "elemtype"
      }, {
        "title": '数据类型',
        "data": "datatype"
      }, {
        "title": '数据长度',
        "data": "numrange"
      }, {
        "title": '显示格式',
        "data": "format"
      }, {
        "title": '单位',
        "data": "unit"
      }, {
        "title": '数据字典',
        "data": "dict"
    }];
    //初始化Grid
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
  };

  /**
   * Tab2初始化tree
   * @method InitTree
   * @params data0 数据元，data1 数据集
   * */
  PT.InitTree = function(data0,data1){
    var treeSetting = {
      view: {
        dblClickExpand: false,
        addHoverDom: _addHoverDom,
        removeHoverDom: _removeHoverDom
      },
      data: {
        key: {
          name: "typenm",
          title: "shownm"
        },
        simpleData: {
          enable: true,
          idKey: "typecd",
          pIdKey: "parentcd"
        }
      },
      callback: {
        beforeClick:beforeClick,
        onClick: Click
      // onExpand : Expand
      }
    };
    
    function _addHoverDom(_id, _node) {
      var sObj = $("#" + _node.tId + "_span");
      if ($("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0)
        return;
      var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
      var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
      if (_node.level === 0) {
        sObj.after(addStr);
      } else {
        sObj.after(addStr);
        sObj.after(editStr);
      }
      $('#addBtn_' + _node.tId).bind("click", function() {
        zy.log("添加");
        var _treeObj=$.fn.zTree.getZTreeObj(_id);
        // tree.selectNode(_node);
        modal.modal('hide');
        zy.net.loadHTML("md/mm/h2h3.html", $("#bm_modal_modal"), function() {
          var _h2h3Obj=new md_mm_h2h3(_treeObj,_node,"i",function(){
            modal.modal('show');
          },function(){
            zy.log("ddddddddddd",modal);
            modal.modal('show');
          });
        });
        return false;
      });
      $('#editBtn_' + _node.tId).bind('click', function() {
        zy.log("修改");
        var _treeObj=$.fn.zTree.getZTreeObj(_id);
        // tree.selectNode(_node);
        modal.modal('hide');
        zy.net.loadHTML("md/mm/h2h3.html", $("#bm_modal_modal"), function() {
          var _h2h3Obj=new md_mm_h2h3(_treeObj,_node,"u",function(){
            modal.modal('show');
          },function(){
            modal.modal('show');
          });
        });
        return false;
      });
    }

    function _removeHoverDom(_id, _node) {
      $("#addBtn_" + _node.tId).unbind().remove();
      $("#editBtn_" + _node.tId).unbind().remove();
    }
    
    function beforeClick(treeId, treeNode, clickFlag){
      if(treeNode.isParent)
        return false;
      return true;
    }
    
    function Click(event, treeId, treeNode) {
      if(!treeNode)
        return;
      if(treeId == 'bm_mddm03_deTree'){
        dedir.val(treeNode.typecd);
      }else if(treeId == 'bm_mddm03_dsTree'){
        dsdir.val(treeNode.typecd);
      }
    }
    
    var deTreeObj = $.fn.zTree.init(deTree, treeSetting, data0);
    var dsTreeObj = $.fn.zTree.init(dsTree, treeSetting, data1);
  };
  
  /**
   * Tab1画面元素事件注册
   * @method Tab1Event
   * */
  var Tab1Event={
    //导出类型select2
    export_type: function(){
      tab1C.exportType.zySelectCustomData('',false,{
        width:"100%",
        allowClear:false
      },[{'id':'01','name':'报表','text':'报表'},{'id':'02','name':'CSV','text':'CSV'}]);
      tab1C.exportType.select2('val','01');
      tab1C.exportType.change(function(){
        if($(this).val()!='01'){
          tab1C.upSection.hide();
          tab1C.upBtn.hide();
        }else{
          tab1C.upSection.show();
          tab1C.upBtn.show();
        }
      });
    },
    //模态确认按钮
    submitBtn: function(){
      submitBtn.unbind("click").click(function(){
        var whichTab=tabnav.tabs('option','active');
        //导出数据tab
        if(whichTab==0){
          //导出数据按钮事件
          zy.g.am.app="c770045becc04c7583f626faacd3b456";
          zy.g.am.mod="getmodelinfo";
          var _params=tab1C.form.form2json();
          // 获取导出类型
          if(tab1C.exportType.val() == '01'){
            // 报表
            _params.flag='2';
            // 是否上传EXCEL模板
            if(!tab1C.fileName.val()){
              zy.ui.msg('提示信息','无Excel模板信息！','i');
              return;
            }
          }else if(tab1C.exportType.val() == '02'){
            // CSV
            _params.flag='3';
          }
          _params.typecd=thiz.opts.node.typecd;
          zy.net.postDownload("download/exc_data",_params);
        }
        //创建表tab
        else if(whichTab==1){
          Tab2form.submit();
        }
      });
    },
    
    tab1: function(){
      tab1.click(function(){
        submitBtn.text("导出数据");
      });
    },
    
    tab2: function(){
      tab2.click(function(){
        if(thiz.opts.tab2Init===false){
          thiz.InitTab2();
        }
        
        zy.log('thiz.opts.msgTableJson=',thiz.opts.msgTableJson);
        if(thiz.opts.msgTableJson &&thiz.opts.msgTableJson!=''){
          submitBtn.text("删除表");
        }else{
          submitBtn.text("创建表");
        }
        
      });
    },
    
    //tab1 form提交事件
    formSubmit: function(){
      function Pagination(page){
        $.jqPaginator(tab1C.pageDiv,{
          totalCounts: 1,
          pageSize: 10,
          currentPage: page,
          onPageChange: function(num) {
            Console.log('onPageChange num = ' + num);
            zy.g.am.app="c770045becc04c7583f626faacd3b456";
            zy.g.am.mod="commapi";
            var _api,_params;
            if(thiz.opts.node.bm003=='1'){
              _api='exc_select';
            }else if(thiz.opts.node.bm004=='1'){
              _api='exc_chart_select';
            }else{
              return;
            }
            //select数据来源
            _params=tab1C.form.serialize()+'&modolcd='+encodeURI(thiz.opts.node.typecd);
            if(tab1C.dataway.filter(':checked').val()=='1'){
              _params=_params+'&_source=0';
            }else if(tab1C.dataway.filter(':checked').val()=='2'){
              _params=_params+'&_source=1';
            }else{
              _params=_params+'&_source=0';
            }
            zy.g.am.pagesize=10;
            zy.net.get("api/"+_api,function(msg){
              //动态生成grid
              thiz.generate_grid(tab1C.table,msg.type,msg.data);
              modal.find('[name=total_count1]').text('总数：'+msg.count);
              //type
              thiz.type_grid(tab1C.tbl_type,msg.type);
              //search
              thiz.search_grid(tab1C.tbl_search,msg.search);
              //分页
              if(msg.count>0){
                tab1C.pageDiv.jqPaginator('option',{
                  totalCounts: msg.count,
                  pageSize: 10,
                  currentPage: num,
                });
              }else{
                tab1C.pageDiv.jqPaginator('destroy');
              }
            },_params,num);
          }
        });
      }
      tab1C.submitBtn.unbind('click').click(function(){
        Pagination(1);
      });
    },
    
    //上传模板事件
    upFileEvent: function(){
      tab1C.upBtn.click(function(){
        if(!tab1C.fileName.val()){
          zy.ui.msg('提示信息：','请选择模板文件！','w');
          return;
        }
        // console.log('fffff',tab1C.formUpd.find('[name=file_name]').val());
        zy.g.am.app="c770045becc04c7583f626faacd3b456";
        zy.g.am.mod="getmodelinfo";
        // zy.log("upform=",tab1C.formUpd);
        zy.net.postForm("upload/uploadmodaltemp",tab1C.formUpd,function(msg){
          if(msg&&msg.result&&msg.result[0]&&msg.result[0].file_name){
            zy.ui.msg('提示信息：','上传成功！','s');
          }else{
            zy.ui.msg('提示信息：','上传模板异常！','w');
          }
        });
      })
    },
    dataway: function(){
      tab1C.dataway.change(function(){
        //如果选择了SQL语句方式，则显示sql语句和参数
        if($(this).val()=="1"){
          tab1C.sqlinfo.show();
        }else if($(this).val()=="2"){
          tab1C.sqlinfo.hide();
        }
      });
    }
  };
  /**
   * Tab2画面元素事件注册
   * @method Tab2Event
   * @
   * */
  PT.Tab2Event = function(){
    //提交按钮事件
    // submitBtn.unbind("click").click(function(){
    //   Tab2form.submit();
    // });
    //数据元目录text框
    dedir.click(function(){
      if(deTree.is(":hidden")){
        showMenu("de");
      }else{
        hideMenu("de");
        //重新设置数据集tree的高度
        zy.log(dsTree.offset());
        dsTree.offset({
          top: dsdir.offset().top + dsdir.outerHeight()
        });
        zy.log(dsTree.offset());
      }
    });
    //数据集目录text框
    dsdir.click(function(){
      if(dsTree.is(":hidden")){
        showMenu("ds");
      }else{
        hideMenu("ds");
      }
    });
    //Tree显示
    function showMenu(deds) {
      var dirObj = null;
      var treeObj = null;
      if(deds=="de"){
        dirObj = dedir;
        treeObj = deTree;
      }else if(deds=="ds"){
        dirObj = dsdir;
        treeObj = dsTree;
      }
      var diroffset = dirObj.offset();
      treeObj.slideDown("fast");
      treeObj.offset({
        left: diroffset.left,
        top: diroffset.top + dirObj.outerHeight()
      });
      treeObj.css('width', dirObj.outerWidth());
    }
    
    //Tree隐藏
    function hideMenu(deds) {
      var treeobj = null;
      if(deds=="de"){
        treeobj = deTree;
      }else if(deds=="ds"){
        treeobj = dsTree;
      }
      treeobj.fadeOut("fast");
    }

    //onBodyDown
    // function onBodyDown(event) {
    //   if (!(event.target.id == "treeDict" || $(event.target).parents("#treeDict").length > 0)) {
    //     hideMenu();
    //   }
    // }
    
  };
  
  /**
   * Tab2表单验证
   * @method FormValidate
   * */
  PT.FormValidate = function (){
    zy.log("validate");
    Tab2form.validate({
      rules: {
        did: {
          required: true,
          maxlength: 32
        },
        en: {
          required: true,
          maxlength: 100
        },
        cn: {
          required: true,
          maxlength: 100
        },
        dedir: {
          required: true,
          maxlength: 100
        },
        dsdir: {
          required: true,
          maxlength: 100
        },
      },
      submitHandler: function(f){
        zy.g.am.app="c770045becc04c7583f626faacd3b456";
        zy.g.am.mod="commapi";
        zy.net.get("api/createtable",function(msg){
          if(msg){
            modal.modal("hide");
            zy.ui.msg("提示信息：", "创建成功！", "s");
          }
        },Tab2form.serialize());
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element.parent());
      }
    });
  };
  
  
  /**
   * Tab2
   * 修改时铺数据及控件变成只读等
   * @method Data2Form
   * */
  PT.Data2Form = function(table_json){
    zy.log("data2form111");
    Tab2form.json2form(table_json);
    //form变为只读
    Tab2form.find(":input").prop("readonly",true);
    //提交按钮
    // submitBtn.text("删除表");
    submitBtn.unbind("click").click(function(){
      zy.g.am.app="c770045becc04c7583f626faacd3b456";
      zy.g.am.mod="commapi";
      zy.net.get("api/deletetable",function(msg){
        if(msg){
          modal.modal("hide");
          zy.ui.msg("提示信息：", "删除成功！", "s");
        }
      },Tab2form.serialize());
    });
  };
  
  /**
   * 生成where条件输入框
   * @method generate_search
   * @params search
   * */
  PT.generate_search = function (search){
    var _result='';
    zy.log('search=',search);
    if(search.length===0){
      return _result;
    }
    
    var _tmpDiv = '<div class="row">';
    var _n = 0;
    $.each(search,function(i,v){
      _tmpDiv=_tmpDiv+'<div class="form-group col col-md-6"><label>'+v.cn+'（'+v.en+'）'+'</label>'+'<input class="form-control" type="text" name="'+v.en+'"></div>';
      _n=_n+1;
      //两个section为一个div
      if(_n==2){
        _result=_result+_tmpDiv+'</div>';
        //重置_tmpSection,_n
        _tmpDiv = '<div class="row">';
        _n=0;
      }else if(i==(search.length-1)){
        _result=_result+_tmpDiv+'</div>';
      }
    });
    return _result;
  }
  
  /**
   * 生成数据表格
   * @method generate_grid
   * @params type,data
   * */
  PT.generate_grid = function(dt,type,data){
    //列信息
    var _columns=[];
    $.each(type,function(i,v){
      _columns.push({
        'title':v.cn+'('+v.en+')',
        'data':v.en
      });
    });
    //预设初始化参数
    var _options = {
      'data': data,
      'columns': _columns
    };
    zy.log(data);
    zy.log(_columns);
    // 合并初始化参数选项
    $.extend(_options, zy.ui.dataTable);
    // _options.paging=true;
    // _options.ordering=true;
    // _options.info=true;
    //初始化 DataTable
    zy.log(dt,_options);
    dt.dataTable(_options);
  }
  
  /**
   * 生成Type表格
   *  @method 
   * */
  PT.type_grid = function(dt,type){
    if(type.length===0){
      return;
    }
    var columns=[
      {
        'title':'英文名(en)',
        'data':'en'
      },
      {
        'title':'中文名(cn)',
        'data':'cn'
      },
      {
        'title':'是否显示(view)',
        'data':'view'
      },
      {
        'title':'是否只读(ro)',
        'data':'ro'
      },
      {
        'title':'是否必填(must)',
        'data':'must'
      },
      {
        'title':'元素标签类型(elemtype)',
        'data':'elemtype'
      },
      {
        'title':'数据类型(datatype)',
        'data':'datatype'
      },
      {
        'title':'数据长度(numrange)',
        'data':'numrange'
      },
      {
        'title':'显示格式(format)',
        'data':'format'
      },
      {
        'title':'单位(unit)',
        'data':'unit'
      },
      {
        'title':'数据字典(dict)',
        'data':'dict'
      },
      {
        'title':'图表类型(chart)',
        'data':'chart'
      }
    ];
    //过滤columns
    columns = $.grep(columns,function(a,i){
      for(var key in type[0]){
        if(key==a.data){
          return true;
        }
      }
      return false;
    });
    //预设初始化参数
    var _options = {
      'data': type,
      'columns': columns
    };
    zy.log(type);
    zy.log(columns);
    // 合并初始化参数选项
    $.extend(_options, zy.ui.dataTable);
    _options.ordering=true;
    // _options.autoWidth=true;
    //初始化 DataTable
    zy.log(dt,_options);
    dt.dataTable(_options);
    //总数
    modal.find('[name=total_count2]').text('总数：'+type.length);
  }
  
  /**
   * 生成Search表格
   *  @method 
   * */
  PT.search_grid = function(dt,search){
    if(!search || search.length===0){
      return;
    }
    var columns=[
      {
        'title':'英文名(en)',
        'data':'en'
      },
      {
        'title':'中文名(cn)',
        'data':'cn'
      },
      {
        'title':'元素标签类型(elemtype)',
        'data':'elemtype'
      },
      {
        'title':'数据类型(datatype)',
        'data':'datatype'
      },
      {
        'title':'数据长度(numrange)',
        'data':'numrange'
      },
      {
        'title':'显示格式(format)',
        'data':'format'
      },
      {
        'title':'单位(unit)',
        'data':'unit'
      },
      {
        'title':'数据字典(dict)',
        'data':'dict'
      },
      {
        'title':'SQL条件(condition)',
        'data':'condition'
      }
    ];
    //过滤columns
    columns = $.grep(columns,function(a,i){
      for(var key in search[0]){
        if(key==a.data){
          return true;
        }
      }
      return false;
    });
    //预设初始化参数
    var _options = {
      'data': search,
      'columns': columns
    };
    zy.log(search);
    zy.log(columns);
    // 合并初始化参数选项
    $.extend(_options, zy.ui.dataTable);
    _options.ordering=true;
    //初始化 DataTable
    zy.log(dt,_options);
    dt.dataTable(_options);
    //总数
    modal.find('[name=total_count3]').text('总数：'+search.length);
  }
  
  /**
   * 业务功能方法
   * */
  // var Func = {
  //   disable
  // };
    return bm_mddm03;
  })();