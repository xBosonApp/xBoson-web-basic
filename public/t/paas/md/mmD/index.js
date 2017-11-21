 md_mmD_index = (function(zy, $) {
  
  var PT = md_mmD_index.prototype;
  var thiz;
  
  var mmd_index = $("#md_mmD_index");
  var index_mod = $("#md_mmD_index_modal");
  var tools = {
    api: function(param, cb) {
      var _cb = function(msg) {
        cb && cb(msg);
      };
      zy.g.am.app = param.app;
      zy.g.am.mod = param.mod;
      zy.net.get("api/" + param.api, _cb, param.r_param, param.page);
    }
  };
    
  PT._g = {
    // decd_select2:[] //数据元select2
  }

  function md_mmD_index() {
    thiz = this;
    Init();
    return this;
  }

  function r1_init(){
    var dt_r1 = mmd_index.find("[name=logtable_dt]");
    //加载操作记录
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
    function Datatable(data){
      var columns = [
      {
        'title':'类别编码',
        "data": "typecd"
      },
      {
        'title':'类别名称',
        "data": "typenm"
      },
      {'title':'操作类型',
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('metadata001', row.operation_type);
        }
      },
      {
        'title':'操作详细',
        "data": "operation_detail"
      },
      {
        'title':'平台用户ID',
        "data": "userid"
      },
      {
        'title':'创建时间',
        "data": "createdt"
      },
    ];
      //预设初始化参数
      var options = {
        "data": data,
        "columns": columns
      };
      // 合并初始化参数选项
      $.extend(options, zy.ui.dataTable);
      //初始化 DataTable
      dt_r1.dataTable(options);
    }
    zy.cache.initDicts('metadata001',function(){
      $.jqPaginator('#logtable_pagination', {
        totalCounts: 1,
        pageSize: 10,
        currentPage: 1,
        onPageChange: function(num) {
          zy.g.am.app = "c879dcc94d204d96a98a34e0b7d75676";
          zy.g.am.mod = "operation_log";
          zy.g.am.pagesize = 10;
          zy.net.get("api/query", function(msg){
            if(msg){
              Datatable(msg.data);
              if (msg.count > 0) {
              $('#logtable_pagination').jqPaginator('option', {
                totalCounts: msg.count,
                pageSize: 10,
                currentPage: num
              });
            } else {
    
              $('#logtable_pagination').jqPaginator('destroy');
            }
            }
            mmd_index.find("#tab-r1 .dataTables_scroll").css("clear","none");
          }, {dt_from:getDates(0),dt_to:getDates(1),time_from:'0:00:00',time_to:'23:59:59',filter:1}, num);
        }
      });
    });
  }
  
  function r2_init(){
    var isManager = true ;
    var index_t2_table = $("#md_mmD_index_t2_table");
    var md_mmd_index_tab = mmd_index.find("#tab-r2");
    var md_mmD_index_t2_container_de = $('#md_mmD_index_t2_container_de');
    var md_mmD_index_t2_container_ds = $('#md_mmD_index_t2_container_ds');
    var query_form = md_mmd_index_tab.find('[name=md_mmD_index_t2_form]');
   
    var value = {
          typecd: {
            required: true,
            maxlength: 100
          },
          typenm: {
            required: true,
            maxlength: 150
          },
          parentcd: {
            required: true,
            maxlength: 100
          },
          datatable: {
            maxlength: 100
          },
          shortkey: {
            maxlength: 100
          },
          standard: {
            maxlength: 2
          },
          version: {
            maxlength: 100
          },
          mark: {
            maxlength: 200
          }
        };
        
    var _typecd = null; //用来存放tree节点的typecd（包含父节点）
    var nodeClick = null; //用来存放tree点击的node节点对象
    var _datatable_init = null; //用来存放init后返回的对象
    var _data = null; //用来获取行数据
  
    var _tree = tree({
      app: "c879dcc94d204d96a98a34e0b7d75676",
      api: "get_filter_tree",//gettree
      mod: "mm"
    });
    var _datatable = new dyTable({
      app: 'c879dcc94d204d96a98a34e0b7d75676',
      api: 'getdatatable',
      mod: 'mm'
    });
    
    var imports = function (e) {
      if(nodeClick){
        
        var optdate = nodeClick.typecd.substr(0,2);
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
              zy.net.postDownload("download/export_template",{typecd:optdate==="DE"?"sys_mdm003":"sys_md_mm002"});
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
                $.each(v, function (ii, vv) {
                  var td = _td.clone();
                  td.html(vv);
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
                  md_mmd_index_tab.find("#tree_refresh").click();
                }
              }
    
              var _file_name = msg[0].file_name;
              exitfile_name = msg[0].file_name;
    
              var param = {
                header:InportModal.find("[name=header]").val(),
                operation:InportModal.find("[name=operation]:checked").val(),
                type:InportModal.find("[name=radio]").val(),
                did: "00000000000000000000000000000000",
                en: optdate==="DE"?"sys_mdm003":"sys_md_mm002",
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
                en: optdate==="DE"?"sys_mdm003":"sys_md_mm002",
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
                  md_mmd_index_tab.find("#tree_refresh").click();
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
                  zy.net.postForm("upload/upload_file", InportModal.find("#filemsg"), cb,null,function(mm){
                    zy.ui.msg("提示信息",mm.msg,"w")
                  })
    
                }
              }
            });
          }
        });
    
      } else {
        zy.ui.msg("提示","请选择有效节点","i");
        return false;
      }
    };
    
    function _async(num){
      var padding = (function(num){
        return function(callback){
          var i = 0;
          var result = {};
          return function(key,value){
            result[key] = value;
            i++;
            if(i == num)
              callback&&callback(result);
          }
        }
      })(num);
      return padding;
    }

    function tree(_params) {
      var ztree = null;
  
      function opt(_dbfunc) {
        function Click(event, treeId, treeNode) {
          _typecd = treeNode.typecd;
          _dbfunc && _dbfunc(treeNode);
        }
  
        function _addHoverDom(_id, _node) {
          var sObj = $("#" + _node.tId + "_span");
          if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0)
            return;
          var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
          var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
          var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
          if (_node.level == 0 && (_node.typecd=='DE'||_node.typecd=='DS')) {
            sObj.after(addStr);
          } else {
            sObj.after(addStr);
            sObj.after(editStr);
            if (!_node.isParent) {
              sObj.after(remStr);
            }
          }
          $('#addBtn_' + _node.tId).bind("click", function() {
            ztree.selectNode(_node);
            _addModal(_node);
            return false;
          })
          $('#editBtn_' + _node.tId).bind('click', function() {
            ztree.selectNode(_node);
            _editModal(_node);
            ztree.updateNode(_node);
            return false;
          })
          $("#remBtn_" + _node.tId).bind('click', function() {
            ztree.selectNode(_node);
            _removeModal(_node);
            return false;
          })
        }
  
        function _removeHoverDom(_id, _node) {
          $("#addBtn_" + _node.tId).unbind().remove();
          $("#editBtn_" + _node.tId).unbind().remove();
          $("#remBtn_" + _node.tId).unbind().remove();
        }
  
        function getFont(treeId, node) {
          if(node.status && node.status == '0'){
            return  {'color':'red'};
          }
          if(node.tables && node.tables !="") {
            return  {'color':'blue'};
          }
        }
        return {
          view: {
            dblClickExpand: false,
            addHoverDom: _addHoverDom,
            removeHoverDom: _removeHoverDom,
            fontCss: getFont,
            nameIsHTML: true
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
            onClick: Click
          }
        }
      }
  
      function init(treeContariner, dbclick) {
        var option = opt(dbclick);
        _params.r_param = {
          keywords : query_form.find("[name=keywords]").val(),
          versions : query_form.find("[name=versions]").val(),
          status : query_form.find("[name=status]").val()
        };
        tools.api(_params, function(msg) {
          ztree = $.fn.zTree.init(treeContariner, option, msg.result);
        });
      }
      
      return {
        init: init
      };
    }
    
    function _addModal(_node,submit,cancle) {
      zy.net.loadHTML("md/mm/h2h3.html", index_mod, function() {
        $("#md_mm_h2h3_form input[name=status]").zySelect('ZR.0001', false, {
          width: '100%'
        });
        $("#md_mm_h2h3_title").text('添加');
        $('#md_mm_h2h3_form [name=typecd]').val(_node.typecd);
        // $('#md_mm_h2h3_form [name=typecd]').attr('readonly', true);
        //类别添加默认值
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/modalsel2",function(msg){
          $('#md_mm_h2h3_form [name=datatable]').zySelectCustomData('', false, {
            width: '100%'
          }, msg.result);
          $('#md_mm_h2h3_form [name=datatable]').select2("val",msg.def_value);
        },{typecd:_node.typecd});
        $('#md_mm_h2h3_form input[name=parentcd]').attr('readonly', true);
        $("#md_mm_h2h3_form input[name=status]").select2("val", '1');
        $("#md_mm_h2h3_form input[name=parentcd]").val(_node.typecd);
        // $("#md_mm_h2h3_form input[name=version]").val('1.0');
        $("#md_mm_h2h3_form input[name=standard]").select2("val", '02');
        $('#md_mm_h2h3').find('footer').find('.btn-default').unbind('click')
          .click(function(){
            cancle&&cancle();
        })
        $('#md_mm_h2h3').find('.close').click(function(){
          $('#md_mm_h2h3').find('footer').find('.btn-default').click();
        });
  
        $('#md_mm_h2h3').modal('show');
        // Registration validation script
        $("#md_mm_h2h3_form").validate({
          // Rules for form validation
          rules: value,
          // 验证成功后保存
          submitHandler: function(form) {
            var typecdNm = $('#md_mm_h2h3_form').find('[name=typecd]').val();
            if(/[@#\$%\^&\*]+/g.test(typecdNm)){
              zy.ui.msg("提示信息：", "类别不能为特殊字符！", "i");
              $('#md_mm_h2h3_form').formDisable(false);
            }
            else{
              var callback = function(msg) {
  
                $('#md_mm_h2h3_form').formDisable(false);
                if (msg) {
                  //zy.log("保存成功 = " + JSON.stringify(msg));
                  $('#md_mm_h2h3').modal('hide');
                  zy.ui.msg("提示信息：", "保存成功！", "s");
                  //更新树节点
                  var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree");
                  var newNode = {
                    typecd: msg.data.typecd,
                    typenm: msg.data.typenm,
                    shownm: msg.data.shownm,
                    datatable: msg.data.datatable
                  };
                  var t = treeObj.getNodeByParam('typecd',_node.typecd,null);
                  treeObj.addNodes(t, newNode);
                  submit&&submit(newNode);
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.post("api/addtreedata", callback, $('#md_mm_h2h3_form').serialize());
              $('#md_mm_h2h3_form').formDisable(true);
            }
  
          },
          // Do not change code below
          errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
          }
        });
      });
    }
  
    function _editModal(_node,submit,cancle) {
      zy.net.loadHTML("md/mm/h2h3.html", index_mod, function() {
        // 字典数据绑定
        $("#md_mm_h2h3_form input[name=status]").zySelect('ZR.0001', false, {
          width: '100%'
        });
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/modalsel2",function(msg){
          $('#md_mm_h2h3_form [name=datatable]').zySelectCustomData('', false, {
            width: '100%'
          }, msg.result);
        },{typecd:_node.typecd});
        $('#md_mm_h2h3_form').formDisable(true);
        var _typecd = "";
        var _datatable = "";
        var callback = function(msg) {
          $('#md_mm_h2h3_form').formDisable(false);
          if (msg) {
            //zy.log("获取字典类型信息数据 = " + JSON.stringify(msg));
            $('#md_mm_h2h3_form').json2form(msg.result[0]);
            _typecd = msg.result[0].typecd;
            _datatable = msg.result[0].datatable;
            if (msg.result[0].datatable === null || msg.result[0].datatable === '') {
              $('#md_mm_h2h3_form [name=datatable]').select2('val', 'e');
            }
          }
        };
        //设置参数
        var h2h3 = {
          typecd: _node.typecd
        };
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/settreeupd", callback, h2h3);
        $('#md_mm_h2h3_title').text('修改');
        $('#md_mm_h2h3_form input[name=typecd]').attr('readonly', true);
        // $('#md_mm_h2h3_form input[name=parentcd]').attr('readonly', true);
        $('#md_mm_h2h3_typecd').remove();
        $('#md_mm_h2h3').modal('show');
  
        $('#md_mm_h2h3').find('footer').find('.btn-default').unbind('click')
          .click(function(){
            cancle&&cancle();
        })
        $('#md_mm_h2h3').find('.close').click(function(){
          $('#md_mm_h2h3').find('footer').find('.btn-default').click();
        });
        // Registration validation script
        $("#md_mm_h2h3_form").validate({
          // Rules for form validation
          rules: value,
          // 验证成功后保存
          submitHandler: function(form) {
            var typecdNm = $('#md_mm_h2h3_form').find('[name=typecd]').val();
            if(/[@#\$%\^&\*]+/g.test(typecdNm)){
              zy.ui.msg("提示信息：", "类别不能为特殊字符！", "i");
            }
            else{
              var callback = function(msg) {
                $('#md_mm_h2h3_form').formDisable(false);
                if (msg) {
                  //zy.log("保存成功 = " + JSON.stringify(msg));
                  $('#md_mm_h2h3').modal('hide');
                  //更新节点
                  var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree");
                  var t = treeObj.getNodeByParam('typecd',_node.typecd,null);
                  t.typecd = msg.data.typecd;
                  t.typenm = msg.data.typenm;
                  t.shownm = msg.data.shownm;
                  t.datatable = msg.data.datatable;
                  t.parentcd = msg.data.parentcd;
                  treeObj.updateNode(t);    //更新节点
                  submit&&submit(t);
                  zy.ui.msg("提示信息：", "保存成功！", "s");
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.post("api/settreedata", callback, $('#md_mm_h2h3_form').serialize() + "&_typecd=" + _typecd + "&_datatable=" + _datatable);
            }
  
          },
          errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
          }
        });
      });
    }

    function _removeModal(_node) {
      zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
        zy.g.am.app = "c879dcc94d204d96a98a34e0b7d75676";
        zy.g.am.mod = "mm";
        zy.net.get('api/deletetree', function(msg){
          if(msg && msg.ret=="0"){
            zy.ui.msg('提示', '删除成功', 's');
            var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree");
            treeObj.removeNode(_node);
          }
        }, {
          typecd: _node.typecd
        });
      });
    }
    //用来注册添加按钮，编辑按钮点击事件
    function _tools() {
      //注册添加按钮点击事件
      $('#md_mmD_index_t2_add').click(function() {
        //tree
        if(!nodeClick.datatable){
          zy.net.loadHTML('md/mm/h2h3.html', index_mod, function(){
            var _h2h3Obj=new md_mm_h2h3($.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree"),nodeClick,"i",updateGrid);
          });
          return false;
        }
        //数据元
        if(nodeClick.datatable == "sys_mdm003"){
          zy.net.loadHTML("md/mm/sys_mdm003.html", index_mod,function(){
            mm_sys_mdm003('i',nodeClick.typecd,'',updateGrid);
          });
          return false;
        }
        function cb(msg) {
          var _dyForm = new dyForm();
          var _form = _dyForm.modalform(msg.type, function() {
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              var api = "adddata";
              //根据isparent调不同的接口
              zy.net.post("api/" + api, function(msg) {
                if (msg) {
                  $('#md_mm_h5h6').modal('hide');
                  zy.ui.msg('提示', '保存成功', 's');
                  _datatable_init = _datatable.init(index_t2_table, {
                    typecd: _typecd
                  });
                  //编辑按钮变为不可点击
                  $('#md_mmD_index_t2_edit').btnDisable(true);
                  $('#md_mmD_index_t2_delete').btnDisable(true);
                  //如果grid数据是tree数据，则更新树节点
                  if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
                    var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree");
                    treeObj.addNodes(nodeClick, {
                      typecd: msg.data.typecd,
                      typenm: msg.data.typenm,
                      shownm: msg.data.shownm,
                      datatable: msg.data.datatable
                    });
                  }
                }
              }, _form.serialize());
              $('#md_mm_h5h6_form').formDisable(true);
            },
            function() {
              $('#md_mm_h5h6').modal('hide');
            });
          zy.net.loadHTML("md/mm/h5h6.html", index_mod, function() {
            $("#md_mm_h5h6_title").text('添加');
            _form.find('[name=status]').select2("val", '1'); //默认值
            $("#md_mm_h5h6").find('div.modal-body.no-padding').append(_form);
            $('#md_mm_h5h6').modal('show');
            //如果点击的是父节点
            if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
              _form.find('[name=parentcd]').val(_typecd);
            } else {
              if(nodeClick.datatable == "sys_mdm003"){
                dict();
              }
              _form.find('[name=typecd]').val(_typecd);
            }
          });
        }
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get('api/getcolumninfo', cb, {
          typecd: _typecd,
          usetype: 1
        });
      });
  
      //注册编辑按钮点击事件
      $('#md_mmD_index_t2_edit').click(function() {
        //选择行数据
        var _data = _datatable_init.getrow();
        //tree
        if(!nodeClick.datatable){
          zy.net.loadHTML('md/mm/h2h3.html', index_mod, function(){
            var _h2h3Obj=new md_mm_h2h3($.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree"),_data,"u",updateGrid);
          });
          return false;
        }
        //数据元
        if(nodeClick.datatable == "sys_mdm003"){
          zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
          zy.g.am.mod = 'mm';
          zy.net.get('api/elemusedinfo', function(msg){
            var sure = function() {
              zy.net.loadHTML("md/mm/sys_mdm003.html", index_mod,function(){
                mm_sys_mdm003('u',nodeClick.typecd,_data.decd,updateGrid);
              });
            }
            if(msg.ret==0&&msg.log!=""){
                zy.ui.mask('修改确认', '是否确认修改此条数据:'+msg.log,sure);
            }
            else if(msg.ret==0&&msg.log==""){
              sure();
            } else{
              return false;
            }
          },{
            typecd: _typecd,
            decd: _data.decd
          });
          return false;
        }
        //获取列信息回调函数
        function cb(msg) {
          var oldParam = "";
          for(var _k in _data){
            oldParam=oldParam+'&_'+_k+'='+_data[_k];
          }
          //动态表单
          var _dyForm = new dyForm();
          var _form = _dyForm.modalform(msg.type, function() {
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'mm';
            var api = "updatedata";
            if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
              api = "settreedata";
            }
            zy.net.post("api/" + api, function(msg) {
              if (msg) {
                zy.ui.msg('提示', '保存成功', 's');
                _datatable_init.setrow(_form.form2json());
                if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
                  //更新节点
                  var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree");
                  var name = treeObj.getNodeByParam("typecd", _data.typecd, nodeClick);
                  name.typenm = msg.data.typenm;
                  name.shownm = msg.data.shownm;
                  name.datatable = msg.data.datatable;
                  treeObj.updateNode(name);
                }
                $('#md_mm_h5h6').modal('hide');
              }
            }, _form.serialize() + encodeURI(oldParam));
            $('#md_mm_h5h6_form').formDisable(true);
          }, function() {
            $('#md_mm_h5h6').modal('hide');
          });
          zy.net.loadHTML("md/mm/h5h6.html", index_mod, function() {
            $("#md_mm_h5h6").find('div.modal-body.no-padding').append(_form);
            $('#md_mm_h5h6').modal('show');
            $("#md_mm_h5h6_title").text('修改');
            if(nodeClick.datatable == "sys_mdm003"){
              dict();
            }
            //调接口，往模态铺数据
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'mm';
            zy.net.get("api/getdataupt", function(msg) {
              if (msg) {
                _form.json2form(msg.data[0]);
              }
            }, _data);
          });
        }
        //调接口，获取列信息
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get('api/getcolumninfo', cb, {
          typecd: _typecd,
          usetype: 2
        });
      });
      
      $('#md_mmD_index_t2_export').click(function() {
        //字典
        var param={
          'typecd': nodeClick.typecd,
          '_is_download':1
        };
        var arr=$('#md_mmD_index_t2_container_de .smart-form').serializeArray();
        $.each(arr,function(i,v){
          param[v.name]=v.value
        })
        var options={
              app:'c879dcc94d204d96a98a34e0b7d75676',
              mod:'mm',
              api:'getdatatable'
            }
        data_export.event(options,index_mod,param)
  
      });
      //注册删除按钮点击事件
      $('#md_mmD_index_t2_delete').click(function() {
        zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
          //选择行数据
          _data = _datatable_init.getrow();
          zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
          zy.g.am.mod = 'mm';
          zy.net.get('api/deletedata', function(msg) {
            if (msg && msg.ret=="0") {
              zy.ui.msg('提示', '删除成功', 's');
              _datatable_init = _datatable.init(index_t2_table, {
                typecd: _typecd
              });
              _tools_rowEvent(); //添加点击事件
              //编辑按钮、删除按钮变为不可点击
              $('#md_mmD_index_t2_edit').btnDisable(true);
              $('#md_mmD_index_t2_delete').btnDisable(true);
            }
          }, _data);
        });
      });
      //更新grid
      function updateGrid(){
        var conditions = $('#row_form').find(".smart-form").serialize();
        _datatable_init = _datatable.init(index_t2_table,conditions+"&typecd="+nodeClick.typecd);
        //编辑按钮变为不可点击
        $('#md_mmD_index_t2_edit').btnDisable(true);
        $('#md_mmD_index_t2_delete').btnDisable(true);
      }
    }
    //注册行点击事件
    function _tools_rowEvent() {
      index_t2_table.unbind().on('click', 'tr', function(e) {
        if (_datatable_init.getrow()) {
          $('#md_mmD_index_t2_edit').btnDisable(false);
          $('#md_mmD_index_t2_delete').btnDisable(false);
        } else {
          $('#md_mmD_index_t2_edit').btnDisable(true);
          $('#md_mmD_index_t2_delete').btnDisable(true);
        }
      })
      .on('dblclick', 'tr', function(e) {
        index_t2_table.find('tr').each(function(index,el){
          if ($(el).hasClass('active')) {
            $(el).removeClass('active');
          }
        })
        $(this).click();
        $('#md_mmD_index_t2_edit').click();
      });
    }
    //widget标题
    function widgetTitle(_node) {
  
      //添加tree的标题
      var _name = _node.typenm;
      var flg_ = true;
      var _tnode = _node;
      while (flg_) {
        if (_tnode.getParentNode()) {
          _name = _tnode.getParentNode().typenm + ">" + _name;
          _tnode = _tnode.getParentNode();
        } else {
          flg_ = false;
          break;
        }
      }
      var _title = mmd_index.find('.title_strong');
      _title.text("元数据管理>" + _name + "(" + _node.typecd + ")");
  
    }
   
    md_mmd_index_tab.find("#nouislider").noUiSlider({
      range: [0, 100],
      start: 34,
      handles: 1,
      connect: true,
      slide: function(){
        var values = $(this).val();
        if(10>values){
          $("#md_mmD_index_t2_ztree").css({'display':'none','width':'0%'});
          if(md_mmD_index_t2_container_ds.html()===""){
            md_mmD_index_t2_container_de.css({'display':"block",'width':"100%"});
          } else {
            md_mmD_index_t2_container_ds.css({'display':"block",'width':"100%"});
          }
          $(this).val(0);
          return false;
        } else if(33>(100-values)){
          md_mmD_index_t2_container_de.css({'display':'none'});
          md_mmD_index_t2_container_ds.css({'display':'none'});
          $("#md_mmD_index_t2_ztree").css({'display':'block','width':'100%'});
        } else {
          $("#md_mmD_index_t2_ztree").css({'display':'block','width':values+'%'});
          if(md_mmD_index_t2_container_ds.html()===""){
            md_mmD_index_t2_container_de.css({'display':'block','width':(100-values) + '%'});
            md_mmD_index_t2_container_ds.css({'display':'none','width':(100-values) + '%'});
          } else {
            md_mmD_index_t2_container_de.css({'display':'none','width':(100-values) + '%'});
            md_mmD_index_t2_container_ds.css({'display':'block','width':(100-values) + '%'});
          }
        }
      }
    });
    md_mmd_index_tab.find('.btn-group').css('display', 'none');
    
    //添加修改按钮事件
    _tools(); 
   
   //数据字典
    zy.cache.initDicts("ZR.0001", function() {
      query_form.find("input[name=status]").zySelect("ZR.0001", false, {
        width: "100%"
      });
      query_form.find("input[name=status]").select2('val','1');
    });
    
    //筛选查询
    md_mmd_index_tab.find("#filter_sx").on("click",function(){
      $(this).button("loading");
      md_mmd_index_tab.find("#tree_refresh").click();
    });
    //筛选取消
    md_mmd_index_tab.find("#filter_qx").on("click",function(){
      query_form.find("[name=status]").select2("data",null);
      query_form.resetForm();
      query_form.hide();
    });
    //筛选表单
    md_mmd_index_tab.find("#tree_filter").on("click",function(){
      query_form.toggle();
    });
    //树刷新
    md_mmd_index_tab.find("#tree_refresh").on("click",function(){
      md_mmd_index_tab.find(".title_strong").text("");
      // 初始化ztree
      _tree.init($("#md_mmD_index_t2_ztree_tree"), function(treenode) {
        $('#row_form').show();
        
        widgetTitle(treenode);
        //为nodeClick赋值
        nodeClick = treenode;
        
        // 节点的datatable属性值为sys_md_mm002时
        if (treenode.datatable === 'sys_md_mm002') {
          md_mmD_index_t2_container_de.hide();
          md_mmD_index_t2_container_ds.show();
          zy.net.loadHTML('md/mm/sys_md_mm.html', md_mmD_index_t2_container_ds, function() {
            var o = new sys_md_mm();
            o.init(treenode);
            $('[name=tab_first]').find('[name=edit]').btnDisable(true);
            $('[name=tab_first]').find('[name=delete]').btnDisable(true);
          });
          return;
        }
        // // 节点的datatable属性值不为sys_md_mm002时
        else {
          md_mmD_index_t2_container_de.show();
          md_mmD_index_t2_container_ds.empty();
          
          //调用datatable
          _datatable_init = _datatable.init(index_t2_table, {
            typecd: treenode.typecd
          }, function(_msg) {
            if (_msg.type.length > 0) {
              md_mmD_index_t2_container_de.find('.btn-group').css('display', 'inline-block');
              md_mmD_index_t2_container_de.find('[name=total_count]').html('总数:' + _msg.count);
              $('#md_mmD_index_t2_edit').btnDisable(true);
              if (treenode.datatable == null || treenode.datatable.trim() == "") {
                md_mmD_index_t2_container_de.find('#md_mmD_index_t2_delete').css('display', 'none');
              } else {
                md_mmD_index_t2_container_de.find('#md_mmD_index_t2_delete').css('display', 'block');
                $('#md_mmD_index_t2_delete').btnDisable(true);
              }
            } else {
              md_mmD_index_t2_container_de.find('[class=btn-group]').css('display', 'none');
            }
          });
          var cb = function(msg) {
            $('#row_form').empty();
            if (msg.type.length > 0) {
              var _dy = new dyForm();
              $('#row_form').append(_dy.searchform(msg.type, function() {
                var conditions = $('#row_form').find(".smart-form").serialize();
                _datatable_init = _datatable.init(index_t2_table, conditions + "&typecd=" + treenode.typecd, function(_msg) {
                  if (_msg.type.length > 0) {
                    mmd_index.find('[class=btn-group]').css('display', 'inline-block');
                    $('#md_mmD_index_t2_edit').btnDisable(true);
                    if (treenode.datatable.trim() == "") {
                      mmd_index.find('[id=md_mmD_index_t2_delete]').css('display', 'none');
                    } else {
                      mmd_index.find('[id=md_mmD_index_t2_delete]').css('display', 'block');
                      $('#md_mmD_index_t2_delete').btnDisable(true);
                    }
                  } else {
                    mmd_index.find('[class=btn-group]').css('display', 'none');
                  }
                });
              },true));
              _tools_rowEvent();
            }
          }
          zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
          zy.g.am.mod = 'mm';
          zy.net.get('api/getsearchformtype', cb, {
            typecd: _typecd
          });
        }
      });
      md_mmd_index_tab.find("#filter_sx").button("reset");
    });
    
    if(isManager){
      //导出
      md_mmd_index_tab.find("#tree_download").on("click",function(){
        if(nodeClick){
            //数据元 sys_mdm003
            //数据集 sys_md_mm002
            var param={
              typecd: nodeClick.typecd,
              isindex:"0",
              charset:"GBK",
              type:1
            };
            var options={
              app:"c879dcc94d204d96a98a34e0b7d75676",
              mod:"mm",
              api:"export"
            }
            data_export.event(options,index_mod,param);
        } else {
          zy.ui.msg("提示","请选择有效节点","i");
        }
      });
      //导入
      md_mmd_index_tab.find("#tree_upload").on("click",imports);
    } else{
      md_mmd_index_tab.find("#tree_download").remove();
      md_mmd_index_tab.find("#tree_upload").remove();
    }
    md_mmd_index_tab.find("#tree_refresh").click();
  }
  
  function r3_init(){
    var md_mmd_index_tab = mmd_index.find("#tab-r3");
    var md_mmD_index_t3_container = $("#md_mmD_index_t3_container");
    var md_mmD_index_t3_ztree = $("#md_mmD_index_t3_ztree");
    md_mmd_index_tab.find("#nouislider").noUiSlider({
      range: [0, 100],
      start: 34,
      handles: 1,
      connect: true,
      slide: function(){
        var values = $(this).val();
        if(10>values){
          md_mmD_index_t3_ztree.css({'display':'none','width':'0%'});
          md_mmD_index_t3_container.css({'display':"block",'width':'100%'});
          $(this).val(0);
          return false;
        } else if(33>(100-values)){
          md_mmD_index_t3_ztree.css({'display':'block','width':'100%'});
          md_mmD_index_t3_container.css({'display':'none','width':'0%'});
          $(this).val(100);
          return false;
        } else {
          md_mmD_index_t3_ztree.css({'display':'block','width':(values) + '%'});
          md_mmD_index_t3_container.css({'display':'block','width':(100-values) + '%'});
        }
      }
    });
    //外部数据源Tree
    function outerTree(_dbfunc,_Expand){
      var tree = null;
      var option = opt();
      function opt() {
  
        function Expand(event, treeId, treeNode){
          _Expand && _Expand(treeNode,tree)
        }
  
        function Click(event, treeId, treeNode) {
          _dbfunc && _dbfunc(treeNode,tree);
        }
        
        function getFont(treeId, node) {
          if(node.tbl_typecd){
            return  {'color':'blue'};
          }
        }
        
        return {
          view: {
            dblClickExpand: false,
            nameIsHTML: true,
            fontCss: getFont
          },
          data: {
            key: {
              name: "shownm",
              title: "shownm"
            }
          },
          callback: {
            onClick: Click,
            onExpand : Expand
          }
        }
      }

      tools.api({
        app:'c879dcc94d204d96a98a34e0b7d75676',
        mod:'outdatasource',
        api:'datasourcetree'
      }, function(msg) {
        _tree = $.fn.zTree.init($('#md_mmD_index_t3_ztree_tree'), option, msg.result);
      });
    }
     // 初始化外部数据源Tree
    outerTree(function(node){
      if(!node)
        return;
      if(!node.isParent){
        zy.net.loadHTML('md/mmD/outer_data_sourse.htm', $('#md_mmD_index_t3_container'), function(){
          new outer_data_sourse(node);
        });
      }
    },function(node){
    
        if(!node)
          return;
        tools.api({
          app:'c879dcc94d204d96a98a34e0b7d75676',
          api:'getouttables',
          mod:'outdatasource',
          r_param : {
            did : node.did || '',
            schema_name : node["schema_name"] || ''
          }
        },function(msg){
          if(msg&&msg.result){
            node.children = msg.result;
            var tree = $.fn.zTree.getZTreeObj("md_mmD_index_t3_ztree_tree");
            tree.refresh();
          }
        })
      });
  }
  
  function r4_init(){
    var query_form = mmd_index.find('#tab-r4 [name=md_mmD_czjl_form]');
    var querysearch = query_form.find('[name=modalsearch]');
    var dt_r4 = mmd_index.find('[name=md_mmD_index_czjl_table]');
     //开始时间
    query_form.find('[name=dt_from]').datetimepicker({
        language:'zh-CN',
        format:'yyyy-mm-dd hh:ii:ss',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 
        1,startView: 2,
        forceParse: 0,
        showMeridian: 1,
      });
    query_form.find('[name=dt_from]').datetimepicker('setDate',new Date());
    //结束时间
    query_form.find('[name=dt_to]').datetimepicker({
        language:'zh-CN',
        format:'yyyy-mm-dd hh:ii:ss',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
    query_form.find('[name=dt_to]').datetimepicker('setDate',new Date());
    //操作类型列表
    // zy.cache.initDicts('mdm001',function(){
    //   var obj={};
    //   var data=[];
    //   var ls=zy.cache.get('_mdm_dict', 'ls');
    //   var arr=ls.get().mdm001;
    //   $.each(arr,function(i,v){
    //     if(v.id.length==5){
    //       var str=v.id.substr(0,3)
    //       if(typeof obj[str] == 'undefined'){obj[str]=[v];} 
    //       else {obj[str].push(v);}
    //     } 
    //   });
    //   $.each(arr,function(index,col){
    //     if(obj[col.id]) col.children=(obj[col.id]);
    //     if(col.id.length!=5) data.push(col);
    //   });
    //   query_form.find('[name=operation_type]').zySelectCustomData('',false ,{width:'100%'},data);
    // });
    //数据字典
    zy.cache.initDicts('ZR.0001,metadata001', function() {
      query_form.find('input[name=status]').zySelect('ZR.0001', false, {width: '100%'});
      query_form.find('[name=operation_type]').zySelect('metadata001',false ,{width:'100%'});
    });
    //
    querysearch.unbind().bind('click',function(){
      czjlPagination(1);
    });
    
    function czjlPagination(page){
      $.jqPaginator('#md_mmD_index_czjl_pagination', {
          totalCounts: 1,
          pageSize: 10,
          currentPage: page,
          onPageChange: function(num) {
            zy.g.am.app = "c879dcc94d204d96a98a34e0b7d75676";
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
                        return zy.cache.cd2name("metadata001", row.operation_type);
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
                dt_r4.dataTable(options);
                 
                mmd_index.find("#tab-r4 .dataTables_scroll").css("clear","none");
                if (msg.count >= 0) {
                  mmd_index.find('#tab-r4 [name=total_count]').html('总数：'+msg.count)
                  mmd_index.find('#tab-r4 #md_mmD_index_czjl_pagination').jqPaginator('option', {
                    totalCounts: msg.count,
                    pageSize: 10,
                    currentPage: num
                  });
                } else {
                  mmd_index.find('#tab-r4 #md_mmD_index_czjl_pagination').jqPaginator('destroy');
                }
                
              }
            }, query_form.serialize(), num);
          }
        });
    }
  }
  
  //初始化
  function Init(){
    r1_init();
    r2_init();
    r3_init();
    r4_init();
  }
  
  return md_mmD_index;
})(zy, jQuery);