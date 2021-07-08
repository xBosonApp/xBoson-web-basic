/* Create By xBoson System */
/**
 * 值域代码管理
 * datadicdD_index
* var datadicdD_indexObj = new datadicdD_index();
* */
var datadicdD_index = (function(zy, $) {
  
  var PT = datadicdD_index.prototype;
  var thiz;
  
  function datadicdD_index(){
    thiz = this;
    Init();
    return this;
  }
  
  function init_t1(){
    
    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r1");
    //获取时间
    function getDates(num){
      var dd=new Date();
      var y=dd.getFullYear();
      var m=dd.getMonth()+ num;
      var d=dd.getDate();
      if(m==-1){
        return (y-1)+"-12"+"-"+d;
      }else{
        return y+"-"+m+"-"+d;
      }
    }
    
    $.jqPaginator("#logtable_pagination", {
      totalCounts: 1,
      pageSize: 10,
      currentPage: 1,
      onPageChange: function(num) {
        zy.g.am.app = "d2c8511b47714faba5c71506a5029d94";
        zy.g.am.mod = "operation_log";
        zy.g.am.pagesize = 10;
        zy.net.get("api/query", function(msg){
          if(msg){
            //预设初始化参数
            var options = {
              "data": msg.data,
              "columns": [
                {"title":"类别编码","data": "typecd"},
                {"title":"类别名称","data": "typenm"},
                {"title":"操作类型","render": 
                  function(data, type, row, meta) {
                    return zy.cache.cd2name("mdm001", row.operation_type);
                  }
                },
                {"title":"操作详细","data": "operation_detail"},
                {"title":"平台用户ID","data": "userid"},
                {"title":"创建时间","data": "createdt"},
              ]
            };
            // 合并初始化参数选项
            $.extend(options, zy.ui.dataTable);
            //初始化 DataTable
            mdms_datadictD_index_tab.find("[name=logtable_dt]").dataTable(options);
            mdms_datadictD_index_tab.find(".dataTables_scroll").css("clear","none");
            if (msg.count > 0) {
              mdms_datadictD_index_tab.find("#logtable_pagination").jqPaginator("option", {
                totalCounts: msg.count,
                pageSize: 10,
                currentPage: num
              });
            } else {
              mdms_datadictD_index_tab.find("#logtable_pagination").jqPaginator("destroy");
            }
          }
        }, {dt_from:getDates(0),dt_to:getDates(1),time_from:"0:00:00",time_to:"23:59:59",filter:1}, num);
      }
    });
  }
  //
  function init_t2(){
    var index_mod = $("#mdms_datadictD_index_mod");
    var isManager = true;
    //isManager = index_mod.attr("data")=="available";
    if(!isManager){
      $("#mdms_datadictD_zydm_container .btn-group").html("");
    }
    var tools = {
      api: function(param, cb) {
        var _cb = function(msg) {
          cb && cb(msg);
        };
        zy.g.am.app = param.app || 'd2c8511b47714faba5c71506a5029d94';
        // zy.g.am.app = param.app || '78cf8922c5ea4afa9dae8970215ea796';
        
        zy.g.am.mod = param.mod;
        zy.net.get("api/"+ param.api, _cb, param.r_param, param.page);
      }
    };

    var _datatable_init = null; //用来存放表格init后返回的对象
    var nodeClick = null; //用来存放tree点击的node节点对象
    var zTreeObj = null;  //初始化后的ztree对象
    var _tree = tree();
      
    var _datatable = new dyTable({
      app: "d2c8511b47714faba5c71506a5029d94",
      api: "getdatatable",
      mod: "datadict"
    });
  
    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r2");
    var container = $("#mdms_datadictD_zydm_container");
    var mdms_datadictD_zydm_container = container.html(); //_container初始状态
    
    var query_form = mdms_datadictD_index_tab.find("[name=mdms_datadictD_zydm_form]");
   
    mdms_datadictD_index_tab.find("div.btn-group").css("display", "none");

    mdms_datadictD_index_tab.find("#nouislider").noUiSlider({
      range: [0, 100],
      start: 34,
      handles: 1,
      connect: true,
      slide: function(){
        var values = $(this).val();
        if(10>values){
          mdms_datadictD_index_tab.find("#mdms_dataductD_zydm_ztree").css({"display":"none","width":"0%"});
          container.css({"display":"block","width":"100%"});
          $(this).val(0);
          return false;
        } else {
          mdms_datadictD_index_tab.find("#mdms_dataductD_zydm_ztree").css({"display":"block","width": + values + "%"});
        }
        if(33>(100-values)){
          container.css({"display":"none"});
        } else {
          container.css({"display":"block","width":(100-values) + "%"});
        }
      }
    });
    //索引或值域代码导入
    var imports = function (e) {
      var optdate= $(this).attr("data");
      
      zy.net.loadHTML("md/ex_inport/inport.html",index_mod, function () {
        var InportModal = $("#inport");
        InportModal.modal("show");
        var datainfo = $("#datainfo").children().clone();
  
        function inportInit() {
          InportModal.find("#datainfo").children().remove();
          var cb = function () {
            InportModal.find("[name=delimiter]").zySelect("csv01", false, {
              width: "100%",
              allowClear: false
            });
            InportModal.find("[name=quoteChar]").zySelect("csv03", false, {
              width: "100%"
            });
            InportModal.find("[name=charset]").zySelect("charset01", false, {
              width: "100%",
              allowClear: false
            });
            InportModal.find("[name=header]").zySelect("ZR.0045", false, {
              width: "100%",
              allowClear: false
            });
            InportModal.find("[name=header]").select2("val","1");
            InportModal.find("[name=charset]").select2("val","GBK");
            InportModal.find("[name=delimiter]").select2("val","01");
            InportModal.find("[name=quoteChar]").select2("val","01");
          }
  
          zy.cache.initDicts("csv01,csv02,csv03,charset01,ZR.0045", cb);
          
          //下载模板按钮事件
          InportModal.find("[name=download_template]").click(function(){
            zy.g.am.app='c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod='import_data';
            //索引："DS.SYS.01.01"值域代码："DS.SYS.01.02"
            zy.net.postDownload("download/export_template",{typecd:optdate=="index"?"DS.SYS.01.01":"DS.SYS.01.02"});
          });
  
        }
  
        function makelabel(data, array) {
          var k = $("#table_col").children();
          var m = $("#csv_col").children();
          k.remove();
          m.remove();
          var _selectlabel = $("<label>").addClass("select");
          var _select = $("<select>").attr({
            "aria-required": true,
            "aria-invalid": false,
            "name": "select"
          });
          
          $.each(array, function (ii, vv) {
            var option = $("<option>");
              option.html(vv.name);
              option.attr("value", vv.id);
  
            _select.append(option);
          });
          _selectlabel.append(_select).append($("<i>"));
  
          //
          $.each(data, function (i, v) {
            var label = $("<label>").addClass("input");
            var input = $("<input>").attr("readonly","readonly");
            input.attr({"value": v.column_cn, "en": v.column_en,"mk":v.mk});
            label.append(input);
            $("#table_col").append(label).append($("<br>"));
            var selectlabel = _selectlabel.clone();
            $("#csv_col").append(selectlabel).append($("<br>"));
          })
          
          if(InportModal.find("[name=operation]:checked").val()=="insert"){
          insert();
          $("#optionrationtitle").html("insert");
          $("#op_title").html("");
          }
          if(InportModal.find("[name=operation]:checked").val()=="update"){
          update();
          $("#optionrationtitle").html("update");
          $("#op_title").html("-根据主键更新");
          }
          if(InportModal.find("[name=operation]:checked").val()=="delete"){
            deletef()
          $("#optionrationtitle").html("delete");
          $("#op_title").html("-根据主键删除");
          }
  
        }
        
        function insert(){
          var input = $("#table_col").find("input");
          var select = $("#csv_col").find("select");
          var length=input.length;
          
          for(i=0;i<length;i++){
            var en=$(input[i]).attr("en");
            var option=$(select[i]).children();
            $.each(option,function(i,v){
              $(v).removeAttr("selected");
              if(en==$(v).val()){
                $(v).attr("selected","");
              }
             
            })
        }
        }
        
        function update(){
          var input = $("#table_col").find("input");
          var select = $("#csv_col").find("select");
          var option=$("#csv_col").find("select option")
          var ll=option.length;
          var length1=input.length;
          var length=ll/length1;
          for(i=0;i<length;i++){
            var en=$(input[i]).attr("en");
            var option=$(select[i]).children();
            $.each(option,function(i,v){
              $(v).removeAttr("selected");
              if(en==$(v).val()){
                $(v).attr("selected","")
              }else{
                var target= $(select[i]).children()[length-1];
                if($(input[i]).attr("mk")!=1)
                $(target).attr("selected","")
              }
            })
        }
        }
        
        function deletef(){
          var input = $("#table_col").find("input");
          var select = $("#csv_col").find("select");
          var length=input.length;
          
          for(i=0;i<length;i++){
            var en=$(input[i]).attr("en");
            var option=$(select[i]).children();
            $.each(option,function(i,v){
              $(v).removeAttr("selected");
              if(en==$(v).val()){
                $(v).attr("selected","")
              }
            })
        }
        }
  
        function maketable(arr,data) {
          var nport_table = $("#inporttable").children();
          nport_table.remove();
          var table = $("<table>").addClass("table table-striped table-responsive table-bordered smart-form");
          var thead=$("<thead>");
          var _th=$("<th>");
          var _tr=$("<tr>");
          $.each(data,function(ii,vv){
            var th=_th.clone();
            th.html(vv);
            _tr.append(th)
            thead.append(_tr)
            
          })
          table.append(thead)
          $.each(arr, function (i, v) {
            if (i <= 9) {
              var tr = $("<tr>");
              var _td = $("<td>");
              $.each(data,function(ii,vv){
                var td = _td.clone();
                td.html(v[vv]);
                tr.append(td);
              })
              table.append(tr);
            }
          })
          $("#inporttable").append(table);
        }
  
        function checkFile() {
          var container = InportModal.find("#fileinfo");
          var filename = container.find("[type=file]").val();
          var finalname=filename.split(".")[1];
          var escapename=InportModal.find("[name=escape]").val();
          if(escapename.length>1){
            zy.ui.msg("提示信息","转义字符的长度为1","w");
            return true
          }
          if (filename == "") {
            zy.ui.msg("提示信息", "请选择要导入的文件","w");
            return true;
  
          } else {
            if(finalname.toLowerCase()!="csv"){
            zy.ui.msg("提示信息", "请选择csv类型的文件","w");
            return true;
            }else{
              return false;
            }
          }
        }
  
        loadScript("lib/js/plugin/bootstrap-wizard/jquery.bootstrap.wizard.min.js", runBootstrapWizard);
  
        function runBootstrapWizard() {
          inportInit();
          function getresult(msg) {
            var cb = function (_mm) {
              if (_mm.result.length > 0) {
                InportModal.find("#datainfo").append(datainfo);
                $("#rootwizard").bootstrapWizard("next");
                maketable(_mm.result[0].preview_data,_mm.result[0].preview_header);
                makelabel(_mm.result[0].table_col, _mm.result[0].map_col);
                $("#tree_refresh").click();
              }
            }
  
            var _file_name = msg[0].file_name;
            exitfile_name = msg[0].file_name;
  
            var param = {
              header:InportModal.find("[name=header]").val(),
              operation:InportModal.find("[name=operation]:checked").val(),
              type:InportModal.find("[name=radio]").val(),
              // did: _node.did,
              // en: _node.en,
              did: "00000000000000000000000000000000",
              en: optdate=="index"?"sys_mdm001":"sys_mdm002",
              file_name: _file_name,
              delimiter: InportModal.find("[name=delimiter]").val(),
              quoteChar: InportModal.find("[name=quoteChar]").val(),
              escape: InportModal.find("[name=escape]").val(),
              charset: InportModal.find("[name=charset]").val()
            }
            
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'import_data';
            zy.net.get("api/parse_csv", cb, param,null,function(mm){
              zy.ui.msg("提示信息",mm.msg,"w");
            });
          }
  
          $("#rootwizard").bootstrapWizard({
  
            onTabShow: function (tab, navigation, index) {
              navigation.removeClass("nav nav-pills");
              var $total = navigation.find("li").length;
              var $current = index + 1;
              var $percent = ($current / $total) * 100;
              $("#rootwizard").find(".bar").css({width: $percent + "%"});
  
              if ($current >= $total) {
                $("#rootwizard").find(".pager .pull-right").hide();
                $("#rootwizard").find(".pager .finish").show();
                $("#rootwizard").find(".pager .finish").removeClass("disabled");
              } else {
                $("#rootwizard").find(".pager .pull-right").show();
                $("#rootwizard").find(".pager .finish").hide();
              }
  
            },
  
            onTabClick: function (tab, navigation, index) {
              return false;
            }
  
  
          });
  
          $("#rootwizard .finish").click(function () {
            function getmapping() {
              var input = $("#table_col").find("input");
              var select = $("[name=select]");
              var _mapping = {};
              $.each(input, function (i, v) {
                $.each(select, function (ii, vv) {
                  if (i == ii)
                    _mapping[$(v).attr("en")] = $(vv).val()
                })
              })
              return _mapping
            }
  
            var map = getmapping();
            var param = {
              operation:InportModal.find("[name=operation]:checked").val(),
              type: InportModal.find("[name=radio]").val(),
              mapping: JSON.stringify(map),
              did: "00000000000000000000000000000000",
              en: optdate=="index"?"sys_mdm001":"sys_mdm002",
              file_name: exitfile_name,
              delimiter: InportModal.find("[name=delimiter]").val(),
              quoteChar: InportModal.find("[name=quoteChar]").val(),
              escape: InportModal.find("[name=escape]").val(),
              charset: InportModal.find("[name=charset]").val()
            }
            var cb = function (msg) {
              if (msg.ret=="0"){
                zy.ui.msg("提示信息","导入成功","s");
                InportModal.modal("hide");
                $("#tree_refresh").click();
              }
            }
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'import_data';
            zy.net.get("api/main", cb, param,null,function(msg){
              zy.ui.msg("提示信息","导入失败:"+msg.msg, "e");
            })
          });
  
          $("[name=nexttab]").click(function () {
            var index = $("#rootwizard").bootstrapWizard("currentIndex")
            if (index == 0) {
              // var target = $($(".tab-content").find(".active")).find(".panel-body");
              var result = checkFile();
              if (result) {
                return
              } else {
                var filename = InportModal.find("[type=file]").val();
                var cb = function (msg) {
                  if (msg.ret=="0" &&msg.result.length > 0) {
                    getresult(msg.result);
                  }
                }
                
                zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                zy.g.am.mod = 'import_data';
                // upload/upload_file
                zy.net.postForm("files", InportModal.find("#filemsg"), cb,null,function(mm){
                  zy.ui.msg("提示信息",mm.msg,"w")
                })
  
              }
            }
          });
        }
      });
  
      return false;
    };

    //zTree
    function tree() {
  
      function opt(_dbfunc) {
        function Click(event, treeId, treeNode) {
          //为nodeClick赋值
          nodeClick = treeNode;
          //清空模态容器
          index_mod.empty();
          
          //如果uri不为空，则load新页面
          if (treeNode.uri && treeNode.uri.trim() !== "") {
            zy.net.loadHTMLs(treeNode.uri, container, function() {});
          } else {
            //如果uri为空，则恢复原页面初始状态
            container.html(mdms_datadictD_zydm_container);
            //权限
            if(treeNode.optype!="1"){
              readOnlyBtn();
            }else{
              _tools(); //Toolbar按钮事件
            }
            _tools_rowEvent();  //datatable点击事件
            _dbfunc && _dbfunc(treeNode);
          }
        }
        //添加修改删除不可用
        function readOnlyBtn(){
          $("#mdms_datadictD_zydm_add").hide();
          $("#mdms_datadictD_zydm_edit").hide();
          $("#mdms_datadictD_zydm_delete").hide();
        }
        /**/
        function _addHoverDom(_id, _node) {
          //权限：只读，编辑
          if(_node.optype!="1"){
            return;
          }
          var sObj = $("#"+ _node.tId + "_span");
          if (_node.editNameFlag || $("#addBtn_"+ _node.tId).length > 0 || $("#editBtn_"+ _node.tId).length > 0 || $("#remBtn_"+ _node.tId).length > 0)
            return;
          var addStr = "<span class='button add' id='addBtn_"+ _node.tId + "' title='添加' onfocus='this.blur();'></span>";
          var editStr = "<span class='button edit' id='editBtn_"+ _node.tId + "' title='修改' onfocus='this.blur();'></span>";
          var remStr = "<span class='button remove' id='remBtn_"+ _node.tId + "' title='删除' onfocus='this.blur();'></span>";
          var importStr = "<span class='fa fa-lg fa-fw fa-upload' data='index' id='importBtn_"+ _node.tId + "' title='索引导入' onfocus='this.blur();' style='font-size:16px;margin-left:2px;color:cadetblue'></span>";
          var exportStr = "<span class='fa fa-lg fa-fw fa-download' data='index' id='exportBtn_"+ _node.tId + "' title='索引导出' onfocus='this.blur();' style='font-size:16px;margin-left:4px;color:cadetblue'></span>";
          
          if (_node.level == 0) {
            sObj.after(importStr);
            sObj.after(exportStr);
            sObj.after(addStr);
          } else {
            if(!_node.isParent) {
              sObj.after(remStr);
            }
            sObj.after(editStr);
            sObj.after(addStr);
          }
          
          $("#addBtn_" + _node.tId).bind("click", function() {
            zTreeObj.selectNode(_node);
            _addModal(_node);
          });
          $("#editBtn_" + _node.tId).bind("click", function() {
            zTreeObj.selectNode(_node);
            _editModal(_node);
            zTreeObj.updateNode(_node);
            return false;
          });
          $("#remBtn_"+ _node.tId).bind("click", function () {
             zTreeObj.selectNode(_node);
             _removeModal(_node);
             return false;
           });
           
          $("#importBtn_"+ _node.tId).bind("click", imports);
          $("#exportBtn_"+ _node.tId).bind("click", function () {
              //字典
              var param={
                typecd: "ROOT",
                isindex:"1"
              };
              var options={
                app:"d2c8511b47714faba5c71506a5029d94",
                mod:"DataDict",
                api:"getIndexOrCode"
              }
              data_export.event(options,index_mod,param)
              return false;
          });
          
        }
  
        function _removeHoverDom(_id, _node) {
          $("#addBtn_"+ _node.tId).unbind().remove();
          $("#editBtn_"+ _node.tId).unbind().remove();
          $("#remBtn_"+ _node.tId).unbind().remove();
          $("#importBtn_"+ _node.tId).unbind().remove();
          $("#exportBtn_"+ _node.tId).unbind().remove();
        }
        
        function _expand(_e,_id,_node){
          if (!_node.children || _node.children.length === 0){
            tools.api({
                api: "gettree",
                mod: "datadict",
                r_param:{typecd:_node.typecd}
              }, function(msg) {
                zTreeObj.addNodes(_node,msg.result);
              });
          }
         
        }
        return {
          view: {
            dblClickExpand: false,
            addHoverDom: isManager?_addHoverDom:null,
            removeHoverDom: isManager?_removeHoverDom:null
          },
          data: {
            key: {
              name: "nodenm",
              title: "shownm"
            },
            simpleData: {
              enable: true,
              idKey: "typecd",
              pIdKey: "parentcd"
            }
          },
          callback: {
            onClick: Click,
            onExpand: _expand
          }
        }
      }
  
      function init(treeContariner, dbclick) {
          var option = opt(dbclick);
          var param = {api: "gettree",mod: "dict",app:"78cf8922c5ea4afa9dae8970215ea796"};
          var keywords = query_form.find("[name=keywords]").val();
          var versions = query_form.find("[name=versions]").val();
          var status = query_form.find("[name=status]").val();
          if(keywords.length+versions.length+status.length>0){
            param.api = "searchtree";
            param.r_param = {
              keywords:keywords,
              versions:versions,
              status:status,
            };
          }
          tools.api(param, function(msg) {
            mdms_datadictD_index_tab.find("#filter_sx").button("reset");
            zTreeObj = $.fn.zTree.init(treeContariner, option, msg.result);
          })
        }
        return {
          init: init
        }
      }
    
    //zTree-添加按钮
    function _addModal(_node) {
      zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function() {
        mdms_h2h3(zTreeObj,_node,"i");
      });
    }
    //zTree-修改按钮
    function _editModal(_node) {
      zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function() {
        mdms_h2h3(zTreeObj,_node,"u");
      });
    }
    //zTree-删除按钮
    function _removeModal(_node) {
        zy.ui.mask("删除确认","是否确认删除此条数据", function sure() {
          zy.g.am.app="d2c8511b47714faba5c71506a5029d94";
          zy.g.am.mod="datadict";
          zy.net.get("api/deletetree",function(msg){
            if(msg){
              zy.ui.msg("提示","删除成功","s");
              var treeObj = $.fn.zTree.getZTreeObj("mdms_datadictD_zydm_tree");
              treeObj.removeNode(_node);
            }
          },{typecd: _node.typecd});
        });
    }
    
    function _tools(){
      //注册添加按钮点击事件
      $("#mdms_datadictD_zydm_add").click(function() {
        //tree
        if(!nodeClick.datatable){
          zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function() {
            mdms_h2h3(zTreeObj,nodeClick,"i",updateGrid);
          });
          return;
        }
        //字典
        if(nodeClick.datatable=="sys_mdm002"){
          zy.net.loadHTML("saas/mdm/datadict/index.htm", index_mod, function() {
            mdm_datadict_modal(nodeClick,"i",updateGrid);
          });
          return;
        }
        //else
        function cb(msg) {
          zy.net.loadHTML("mdms/datadict/h5h6.html", index_mod, function() {
            _form.find("[name=typecd]").val(nodeClick.typecd);
            _form.find("[name=typecd]").attr("readonly", true);
            index_mod.find("#datadict_h5h6_title").text("添加");
            _form.find("[name=status]").select2("val","1"); //默认值
            index_mod.find("#datadict_h5h6").modal("show");
          });
          var _dyForm = new dyForm();
          var _form = _dyForm.modalform(msg.type, function() {
              zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
              zy.g.am.mod = 'datadict';
              var api = "adddata";
              //参数中添加一个typecd
              var _params=_form.serialize();
              if(_form.find("[name=typecd]").length===0){
                _params=_params+'&typecd='+encodeURI(nodeClick.typecd);
              }
              zy.net.post("api/"+ api, function(msg) {
                if (msg) {
                  $("#datadict_h5h6").modal("hide");
                  zy.ui.msg("提示","保存成功","s");
                  _datatable_init = _datatable.init(mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table"), {
                    typecd: nodeClick.typecd
                  });
                  //编辑按钮、删除按钮变为不可点击
                  $("#mdms_datadictD_zydm_edit").btnDisable(true);
                  $("#mdms_datadictD_zydm_delete").btnDisable(true);
                }
              },_params);
              $("#datadict_h5h6_form").formDisable(true);
            },
            function() {
              index_mod.find("#datadict_h5h6").modal("hide");
            });
          index_mod.find("div.modal-body.no-padding").append(_form);
  
        }
        zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
        zy.g.am.mod = 'datadict';
        zy.net.get("api/getcolumninfo", cb, {
          typecd: nodeClick.typecd,
          usetype: 1
        });
      });
      //注册编辑按钮点击事件
      $("#mdms_datadictD_zydm_edit").click(function() {
        //选择行数据
        var _data = _datatable_init.getrow();
        //tree
        if(!nodeClick.datatable){
          zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function() {
            mdms_h2h3(zTreeObj,_data,"u",updateGrid);
          });
          return;
        }
        //字典
        if(nodeClick.datatable=="sys_mdm002"){
          zy.net.loadHTML("saas/mdm/datadict/index.htm", index_mod, function() {
            mdm_datadict_modal(_data,"u",updateGrid);
          });
          return;
        }
        //获取列信息回调函数
        function cb(msg) {
          var oldValue = ""; //用来存放旧的表单值 &key1=&key2=
          zy.net.loadHTML("mdms/datadict/h5h6.html", index_mod, function() {
            $("#datadict_h5h6").modal("show");
            $("#datadict_h5h6_title").text("修改");
            _form.find("[name=typecd]").attr("readonly", true);
            _form.find("[name=status]").select2("val","1"); //默认值
            for (i in _data) {
              //修改前的表单值
              oldValue = oldValue + "&_"+ i + "="+ encodeURI(_data[i]);
            }
            var callback = function(msg) {
              if (msg) {
                _form.json2form(msg.data[0]);
              }
            };
            //调接口，往模态铺数据
            zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
            zy.g.am.mod = 'datadict';
            _data.typecd = nodeClick.typecd;
            zy.net.get("api/getdataupt", callback, _data);
          });
          var _dyForm = new dyForm();
          var _form = _dyForm.modalform(msg.type, function() {
            zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
            zy.g.am.mod = 'datadict';
            var api = "updatedata";
            //参数中添加一个typecd
            var _params=_form.serialize();
            if(_form.find("[name=typecd]").length===0){
              _params=_params+'&typecd='+encodeURI(nodeClick.typecd);
            }
            zy.net.post("api/"+ api, function(msg) {
              if (msg) {
                zy.ui.msg("提示","保存成功","s");
                _datatable_init.setrow(_form.form2json());
                $("#datadict_h5h6").modal("hide");
              }
            }, _params + oldValue);
            $("#datadict_h5h6_form").formDisable(true);
            //zy.cache.refreshData(msg.type);
          }, function() {
            $("#datadict_h5h6").modal("hide");
          });
          $("div.modal-body.no-padding").append(_form);
        }
          //调接口，获取列信息
        zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
        zy.g.am.mod = 'datadict';
        zy.net.get("api/getcolumninfo", cb, {
          typecd: nodeClick.typecd,
          usetype: 2
        });
      });
      //导出
      $("#mdms_datadictD_zydm_export").click(function() {
        //字典
        var param={
          "typecd": nodeClick.typecd,
          "_is_download":1
        };
        var arr=$("#row_form").find(".smart-form").serializeArray();
        $.each(arr,function(i,v){
          param[v.name]=v.value
        })
        var options={
              app:"d2c8511b47714faba5c71506a5029d94",
              mod:"DataDict",
              api:"getdatatable"
            }
        data_export.event(options,index_mod,param)
      });
      //注册删除按钮点击事件
      $("#mdms_datadictD_zydm_delete").click(function() {
        //确认删除
        zy.ui.mask("删除确认","是否确认删除此条数据", function() {
          var _data = _datatable_init.getrow();
          //选择行数据
          zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
          zy.g.am.mod = 'datadict';
          //参数中添加一个typecd
          if(!_data.typecd){
            _data.typecd=nodeClick.typecd;
          }
          zy.net.get("api/deletedata", function(msg) {
            if (msg) {
              zy.ui.msg("提示","删除成功","s");
              _datatable_init = _datatable.init(mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table"), {
                typecd: nodeClick.typecd
              });
              //编辑按钮、删除按钮变为不可点击
              $("#mdms_datadictD_zydm_edit").btnDisable(true);
              $("#mdms_datadictD_zydm_delete").btnDisable(true);
            }
          }, _data);
        });
      });
      //刷新grid
      function updateGrid(){
          var conditions = $("#row_form").find(".smart-form").serialize();
          _datatable_init = _datatable.init(mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table"), {
                    typecd: nodeClick.typecd
                  });
          //编辑按钮、删除按钮变为不可点击
          $("#mdms_datadictD_zydm_edit").btnDisable(true);
          $("#mdms_datadictD_zydm_delete").btnDisable(true);
        }
      
    }
        
    //注册DataTable行点击事件
    function _tools_rowEvent() {
      mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table").on("click","tr", function(e) {
        if (_datatable_init.getrow()) {
          mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(false);
          mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(false);
        } else {
          mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(true);
          mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(true);
        }
      });
    }
  

    //widget标题
    function widgetTitle(treenode){
      /**标题****************/
      var _name = treenode.typenm;
      var flg_ = true;
      var _tnode=treenode;
      while(flg_){
        if(_tnode.getParentNode()){
          _name = _tnode.getParentNode().typenm +">"+ _name;
          _tnode=_tnode.getParentNode();
        }
        else{
          flg_ = false;
          break;
        }
      }
      mdms_datadictD_index_tab.find(".title_strong").text(_name+"("+ treenode.typecd+")");
    }
    
    //筛选查询
    mdms_datadictD_index_tab.find("#filter_sx").on("click",function(){
      $(this).button("loading");
      mdms_datadictD_index_tab.find("#tree_refresh").click();
    });
    //筛选取消
    mdms_datadictD_index_tab.find("#filter_qx").on("click",function(){
      query_form.find("[name=status]").select2("data",null);
      query_form.resetForm();
      query_form.hide();
    });
    //筛选表单
    mdms_datadictD_index_tab.find("#tree_filter").on("click",function(){
      query_form.toggle();
    });
    //树刷新
    mdms_datadictD_index_tab.find("#tree_refresh").on("click",function(){
      mdms_datadictD_index_tab.find(".title_strong").text("");
      //Tree初始化
      _tree.init($("#mdms_datadictD_zydm_tree"), function(treenode) {
        container.find("div.btn-group").css("display", "none");
        //更新标题
        widgetTitle(treenode);
        //DataTable初始化
        _datatable_init = _datatable.init(mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table"), {typecd: treenode.typecd}, function(_msg) {
          if (_msg.type.length > 0) {
            mdms_datadictD_index_tab.find("div.btn-group").css("display","inline-block");
            mdms_datadictD_index_tab.find("[name=total_count]").html("总数:" + _msg.count);
            mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(true);
            mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(true);
          } else {
            mdms_datadictD_index_tab.find("div.btn-group").css("display","none");
          }
        });
        //数据表不为空时，显示删除按钮
        if (nodeClick.datatable == null||nodeClick.datatable.trim()=="") {
          mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").hide();
        }
        
        //查询Form
        var cb = function(msg) {
          var _rowform = mdms_datadictD_index_tab.find("#row_form");
          _rowform.empty();
          if (msg.type.length > 0) {
            var _dy = new dyForm();
            var isplatDict = false; //查询Form中的数据字典是否平台
            if((!nodeClick.datatable) || nodeClick.datatable=="sys_mdm002"){
              isplatDict = true;
            }
            _rowform.append(_dy.searchform(msg.type, function() {
              var conditions = _rowform.find(".smart-form").serialize();
              _datatable_init = _datatable.init(mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_table"), conditions + "&typecd="+ treenode.typecd, function(_msg) {
                if (_msg.type.length > 0) {
                  mdms_datadictD_index_tab.find("[class=btn-group]").css("display", "inline-block");
                  mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(true);
                  mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(true);
                } else {
                  mdms_datadictD_index_tab.find(".btn-group").css("display", "none");
                }
              });
            },isplatDict));
          }
        }
        zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
        zy.g.am.mod = 'datadict';
        zy.net.get("api/getsearchformtype", cb, {
          typecd: nodeClick.typecd
        });
      });
    });
    if(isManager){
      //值域代码导出
      mdms_datadictD_index_tab.find("#tree_download").on("click",function(){
        if(nodeClick){
          if(nodeClick.datatable==""||nodeClick.datatable=="sys_mdm002"){
            var param={
              typecd: nodeClick.typecd,
              isindex:"0",
              charset:"GBK",
              type:1
            };
            var options={
              app:"d2c8511b47714faba5c71506a5029d94",
              mod:"DataDict",
              api:"getIndexOrCode"
            }
            data_export.event(options,index_mod,param);
            
          } else{
            zy.ui.msg("提示","暂不支持值域代码以外数据导出！","w");
          }
        } else {
          zy.ui.msg("提示","请选择值域代码节点","i");
        }
      });
      //值域代码导入
      mdms_datadictD_index_tab.find("#tree_upload").on("click",imports);
    } else{
      mdms_datadictD_index_tab.find("#tree_download").remove();
      mdms_datadictD_index_tab.find("#tree_upload").remove();
    }
    mdms_datadictD_index_tab.find("#tree_refresh").click();
    
  }
  
  function init_t3(){
    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r3");
    var query_form = mdms_datadictD_index_tab.find("[name=mdms_datadictD_czjl_form]");

     //开始时间
    query_form.find("[name=dt_from]").datetimepicker({
        language:"zh-CN",
        format:"yyyy-mm-dd hh:ii:ss",
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 
        1,startView: 2,
        forceParse: 0,
        showMeridian: 1,
      });
    query_form.find("[name=dt_from]").datetimepicker("setDate",new Date());
    //结束时间
    query_form.find("[name=dt_to]").datetimepicker({
        language:"zh-CN",
        format:"yyyy-mm-dd hh:ii:ss",
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
    query_form.find("[name=dt_to]").datetimepicker("setDate",new Date());
    
    //
    query_form.find("[name=modalsearch]").unbind().bind("click",function(){
      czjlPagination(1);
    });
    
    //操作类型列表
    zy.cache.initDicts("mdm001",function(){
      var obj={};
      var data=[];
      var ls=zy.cache.get("_mdm_dict","ls");
      var arr=ls.get().mdm001;
      $.each(arr,function(i,v){
        if(v.id.length==5){
          var str=v.id.substr(0,3)
          if(typeof obj[str] == "undefined"){obj[str]=[v];} 
          else {obj[str].push(v);}
        } 
      });
      $.each(arr,function(index,col){
        if(obj[col.id]) col.children=(obj[col.id]);
        if(col.id.length!=5) data.push(col);
      });
      query_form.find("[name=operation_type]").zySelectCustomData("",false ,{width:"100%"},data);
    });
    //数据字典
    zy.cache.initDicts("ZR.0001", function() {
      $("[name=mdms_datadictD_zydm_form] input[name=status]").zySelect("ZR.0001", false, {
        width: "100%"
      });
    });
    function czjlPagination(page){
      $.jqPaginator("#mdms_datadict_czjl_pagination", {
        totalCounts: 1,
        pageSize: 10,
        currentPage: page,
        onPageChange: function(num) {
          zy.g.am.app = "d2c8511b47714faba5c71506a5029d94";
          zy.g.am.mod = "operation_log";
          zy.g.am.pagesize = 10;
          zy.net.get("api/query", function(msg){
            if(msg){
              //预设初始化参数
              var options = {
                "data": msg.data,
                "columns": [
                  {"title":"类别编码","data": "typecd"},
                  {"title":"类别名称","data": "typenm"},
                  {
                    "title":"操作类型",
                    "render": function(data, type, row, meta) {
                      return zy.cache.cd2name("mdm001", row.operation_type);
                    }
                  },
                  {"title":"操作详细","data": "operation_detail"},
                  {"title":"平台用户ID","data": "userid"},
                  {"title":"创建时间","data": "createdt"}
                ],
              };
              // 合并初始化参数选项
              $.extend(options, zy.ui.dataTable);
              //初始化 DataTable
              mdms_datadictD_index_tab.find("[name=mdms_datadict_czjl_table]").dataTable(options);
              mdms_datadictD_index_tab.find(".dataTables_scroll").css("clear","none");
              if (msg.count >= 0) {
                mdms_datadictD_index_tab.find("[name=total_count]").html("总数："+msg.count)
                mdms_datadictD_index_tab.find("#mdms_datadict_czjl_pagination").jqPaginator("option", {
                  totalCounts: msg.count,
                  pageSize: 10,
                  currentPage: num
                });
              } else {
                mdms_datadictD_index_tab.find("#mdms_datadict_czjl_pagination").jqPaginator("destroy");
              }
              
            }
          }, query_form.serialize(), num);
        }
      });
    }
  }
  
  function Init(){
    init_t1();
    init_t2();
    init_t3();
  }
  
  return datadicdD_index;
})(zy, jQuery);