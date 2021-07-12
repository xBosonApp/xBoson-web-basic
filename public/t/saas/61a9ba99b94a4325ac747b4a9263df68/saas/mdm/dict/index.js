/* Create By xBoson System */
/**
 * 值域代码管理
 * datadicdD_index
* var datadicdD_indexObj = new datadicdD_index();
* */
var datadicdD_index = (function (zy, $) {

  var PT = datadicdD_index.prototype;
  var thiz;

  function datadicdD_index() {
    thiz = this;
    Init();
    return this;
  }

  function init_t1() {

    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r1");
    //获取时间
    function getDates(num) {
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + num;
      var d = dd.getDate();
      if (m == -1) {
        return (y - 1) + "-12" + "-" + d;
      } else {
        return y + "-" + m + "-" + d;
      }
    }

    $.jqPaginator("#logtable_pagination", {
      totalCounts: 1,
      pageSize: 10,
      currentPage: 1,
      onPageChange: function (num) {
        zy.g.am.app = "d2c8511b47714faba5c71506a5029d94";
        zy.g.am.mod = "operation_log";
        zy.g.am.pagesize = 10;
        zy.net.get("api/query", function (msg) {
          if (msg) {
            //预设初始化参数
            var options = {
              "data": msg.data,
              "columns": [
                { "title": "类别编码", "data": "typecd" },
                { "title": "类别名称", "data": "typenm" },
                {
                  "title": "操作类型", "render":
                    function (data, type, row, meta) {
                      return zy.cache.cd2name("mdm001", row.operation_type);
                    }
                },
                { "title": "操作详细", "data": "operation_detail" },
                { "title": "平台用户ID", "data": "userid" },
                { "title": "创建时间", "data": "createdt" },
              ]
            };
            // 合并初始化参数选项
            $.extend(options, zy.ui.dataTable);
            //初始化 DataTable
            mdms_datadictD_index_tab.find("[name=logtable_dt]").dataTable(options);
            mdms_datadictD_index_tab.find(".dataTables_scroll").css("clear", "none");
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
        }, { dt_from: getDates(0), dt_to: getDates(1), time_from: "0:00:00", time_to: "23:59:59", filter: 1 }, num);
      }
    });
  }
  //
  function init_t2() {
    var index_mod = $("#mdms_datadictD_index_mod");
    var isManager = true;
    //isManager = index_mod.attr("data")=="available";
    if (!isManager) {
      $("#mdms_datadictD_zydm_container .btn-group").html("");
    }
    var tools = {
      api: function (param, cb) {
        var _cb = function (msg) {
          cb && cb(msg);
        };
        zy.g.am.app = param.app || 'd2c8511b47714faba5c71506a5029d94';
        // zy.g.am.app = param.app || '78cf8922c5ea4afa9dae8970215ea796';

        zy.g.am.mod = param.mod;
        zy.net.get("api/" + param.api, _cb, param.r_param, param.page);
      }
    };

    // var _datatable_init = null; //用来存放表格init后返回的对象
    var nodeClick = null; //用来存放tree点击的node节点对象
    var zTreeObj = null;  //初始化后的ztree对象
    var _tree = tree();


    var verSelect = $("#ver-select"); //版本下拉select2
    var verSelectDataArr = []; //版本下拉select2数据
    
    var tableGridObj = tableGrid("mdm_dict_table", function (selected) {
      if (selected) {
        mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(false);
        mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(false);
      } else {
        mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_edit").btnDisable(true);
        mdms_datadictD_index_tab.find("#mdms_datadictD_zydm_delete").btnDisable(true);
      }
    }); //字典表格操作对象

    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r2");
    var container = $("#mdms_datadictD_zydm_container");
    var mdms_datadictD_zydm_container = container.html(); //_container初始状态

    var query_form = mdms_datadictD_index_tab.find("[name=mdms_datadictD_zydm_form]");

    mdms_datadictD_index_tab.find("#nouislider").noUiSlider({
      range: [0, 100],
      start: 34,
      handles: 1,
      connect: true,
      slide: function () {
        var values = $(this).val();
        if (10 > values) {
          mdms_datadictD_index_tab.find("#mdms_dataductD_zydm_ztree").css({ "display": "none", "width": "0%" });
          container.css({ "display": "block", "width": "100%" });
          $(this).val(0);
          return false;
        } else {
          mdms_datadictD_index_tab.find("#mdms_dataductD_zydm_ztree").css({ "display": "block", "width": + values + "%" });
        }
        if (33 > (100 - values)) {
          container.css({ "display": "none" });
        } else {
          container.css({ "display": "block", "width": (100 - values) + "%" });
        }
      }
    });

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
            zy.net.loadHTMLs(treeNode.uri, container, function () { });
          } else {
            //如果uri为空，则恢复原页面初始状态
            container.html(mdms_datadictD_zydm_container);
            //权限
            // if(treeNode.optype!="1"){
            //   readOnlyBtn();
            // }else{
            
            // }


            // _tools_rowEvent();  //datatable点击事件
            _dbfunc && _dbfunc(treeNode);
          }
        }

        function _addHoverDom(_id, _node) {
          //权限：只读，编辑
          if (_node.optype != "1") {
            return;
          }
          var sObj = $("#" + _node.tId + "_span");
          if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
            return;
          var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
          var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
          var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
          var importStr = "<span class='fa fa-lg fa-fw fa-upload' data='index' id='importBtn_" + _node.tId + "' title='索引导入' onfocus='this.blur();' style='font-size:16px;margin-left:2px;color:cadetblue'></span>";
          var exportStr = "<span class='fa fa-lg fa-fw fa-download' data='index' id='exportBtn_" + _node.tId + "' title='索引导出' onfocus='this.blur();' style='font-size:16px;margin-left:4px;color:cadetblue'></span>";

          if (_node.level == 0) {
            sObj.after(importStr);
            sObj.after(exportStr);
            sObj.after(addStr);
          } else {
            if (!_node.isParent) {
              sObj.after(remStr);
            }
            sObj.after(editStr);
            sObj.after(addStr);
          }

          $("#addBtn_" + _node.tId).bind("click", function () {
            zTreeObj.selectNode(_node);
            _addModal(_node);
          });
          $("#editBtn_" + _node.tId).bind("click", function () {
            zTreeObj.selectNode(_node);
            _editModal(_node);
            zTreeObj.updateNode(_node);
            return false;
          });
          $("#remBtn_" + _node.tId).bind("click", function () {
            zTreeObj.selectNode(_node);
            _removeModal(_node);
            return false;
          });

          $("#importBtn_" + _node.tId).bind("click", imports);
          $("#exportBtn_" + _node.tId).bind("click", function () {
            //字典
            var param = {
              typecd: "ROOT",
              isindex: "1"
            };
            var options = {
              app: "d2c8511b47714faba5c71506a5029d94",
              mod: "DataDict",
              api: "getIndexOrCode"
            }
            data_export.event(options, index_mod, param)
            return false;
          });

        }

        function _removeHoverDom(_id, _node) {
          $("#addBtn_" + _node.tId).unbind().remove();
          $("#editBtn_" + _node.tId).unbind().remove();
          $("#remBtn_" + _node.tId).unbind().remove();
          $("#importBtn_" + _node.tId).unbind().remove();
          $("#exportBtn_" + _node.tId).unbind().remove();
        }

        return {
          view: {
            dblClickExpand: false,
            addHoverDom: isManager ? _addHoverDom : null,
            removeHoverDom: isManager ? _removeHoverDom : null
          },
          data: {
            key: {
              name: "nm",
              title: "nm",
              url: "xUrl" //节点链接的目标 URL 的属性名称
            },
            simpleData: {
              enable: true,
              idKey: "cd",
              pIdKey: "parentcd"
            }
          },
          callback: {
            onClick: Click,
            // onExpand: _expand
          }
        }
      }

      function init(treeContariner, dbclick) {
        var option = opt(dbclick);
        var param = { api: "gettree", mod: "dict", app: "78cf8922c5ea4afa9dae8970215ea796" };
        var keywords = query_form.find("[name=keywords]").val();

        if (keywords.length > 0) {

          searchTree(keywords, function () {
            mdms_datadictD_index_tab.find("#filter_sx").button("reset");
          });
          return;

        }
        tools.api(param, function (msg) {
          mdms_datadictD_index_tab.find("#filter_sx").button("reset");
          zTreeObj = $.fn.zTree.init(treeContariner, option, msg.result);
        })
      }

      function searchTree(keyword, callback) {

        var cb = function (msg) {

          zy.log("msg=", msg);

          if (!msg.result) return;
          // 隐藏所有节点
          var nodes = zTreeObj.transformToArray(zTreeObj.getNodes());

          // zy.log("searchTree",nodes);

          nodes.forEach(function (v) {
            zTreeObj.hideNode(zTreeObj.getNodeByTId(v.tId));
          });

          // 显示匹配的节点
          msg.result.forEach(function (v) {
            var treeNode = zTreeObj.getNodeByParam("cd", v._id.cd);


            var pathNodes = treeNode.getPath();
            pathNodes.forEach(function (v) {
              zTreeObj.showNode(v);
            })
            // zy.log("treeNode = ",treeNode);
            // zy.log("pathNodes = ",pathNodes);
          });

          callback && callback();
        }


        zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
        zy.g.am.mod = 'dict';
        zy.net.get("api/dicts_search", cb, {
          keyword: keyword
        });

      }

      return {
        init: init
      }
    }

    //zTree-添加按钮
    function _addModal(_node) {
      zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function () {
        mdms_h2h3(zTreeObj, _node, "i");
      });
    }
    //zTree-修改按钮
    function _editModal(_node) {
      zy.net.loadHTML("mdms/datadict/h2h3.html", index_mod, function () {
        mdms_h2h3(zTreeObj, _node, "u");
      });
    }
    //zTree-删除按钮
    function _removeModal(_node) {
      zy.ui.mask("删除确认", "是否确认删除此条数据", function sure() {
        zy.g.am.app = "78cf8922c5ea4afa9dae8970215ea796";
        zy.g.am.mod = "dict";
        zy.net.get("api/dicts", function (msg) {
          if (msg) {
            zy.ui.msg("提示", "删除成功", "s");
            var treeObj = $.fn.zTree.getZTreeObj("mdms_datadictD_zydm_tree");
            treeObj.removeNode(_node);
          }
        }, { cd: _node.cd, parentcd: _node.parentcd, op_type: "delete" });
      });
    }

    //zTree toolbar显示隐藏
    function _tree_toolbar_show(flag) {
      var $toolbar = $("#mdm-dict-tree-toolbar");
      if (flag) {
        $toolbar.show();
      } else {
        $toolbar.hide();
      }

    }

    // 表格工具栏事件
    function _tools() {
      //注册添加按钮点击事件
      $("#mdms_datadictD_zydm_add").click(function () {

        zy.net.loadHTMLs("saas/mdm/dict/dict_data.html", index_mod, function () {
          var param = {
            typecd: nodeClick.cd,
            parentcd: nodeClick.parentcd,
            ver: verSelect.val()
          };
          mdms_dict_data(param, "i", function (formData) {
            // 表格添加行
            tableGridObj.addRow(formData);
          });
        });


      });
      //注册编辑按钮点击事件
      $("#mdms_datadictD_zydm_edit").click(function () {


        zy.net.loadHTMLs("saas/mdm/dict/dict_data.html", index_mod, function () {
          // 选择行数据
          var rowSelectData = tableGridObj.getSelectedRowData();
          var param = {
            typecd: nodeClick.cd,
            parentcd: nodeClick.parentcd,
            ver: verSelect.val()
          };
          $.extend(param, rowSelectData);

          mdms_dict_data(param, "u", function (formData) {
            // 表格修改行
            tableGridObj.editSelectedRow(formData);
          });
        });

      });
      //导出
      $("#mdms_datadictD_zydm_export").click(function () {
        mdms_datadictD_index_tab.find("#tree_download").click();
      });
      //注册删除按钮点击事件
      $("#mdms_datadictD_zydm_delete").click(function () {
        //确认删除
        zy.ui.mask("删除确认", "是否确认删除此条数据", function () {

          // 选择行数据
          var rowSelectData = tableGridObj.getSelectedRowData();

          zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
          zy.g.am.mod = 'dict';

          zy.net.get("api/dict_data", function (msg) {
            if (msg) {
              zy.ui.msg("提示", "删除成功", "s");

              // 表格删除行
              tableGridObj.deleteSelectedRow();
              //编辑按钮、删除按钮变为不可点击
              $("#mdms_datadictD_zydm_edit").btnDisable(true);
              $("#mdms_datadictD_zydm_delete").btnDisable(true);
            }
          },
            {
              op_type: "delete",
              typecd: nodeClick.cd,
              parentcd: nodeClick.parentcd,
              ver: verSelect.val(),
              cd: rowSelectData.cd
            });

        });
      });

    }






    //widget标题
    function widgetTitle(treenode) {
      /**标题****************/
      var _name = treenode.nm;
      var flg_ = true;
      var _tnode = treenode;
      while (flg_) {
        if (_tnode.getParentNode()) {
          _name = _tnode.getParentNode().nm + ">" + _name;
          _tnode = _tnode.getParentNode();
        }
        else {
          flg_ = false;
          break;
        }
      }
      mdms_datadictD_index_tab.find(".title_strong").text(_name + "(" + treenode.cd + ")");
    }

    //筛选查询
    mdms_datadictD_index_tab.find("#filter_sx").on("click", function () {
      $(this).button("loading");
      mdms_datadictD_index_tab.find("#tree_refresh").click();
    });
    //筛选取消
    mdms_datadictD_index_tab.find("#filter_qx").on("click", function () {
      query_form.find("[name=status]").select2("data", null);
      query_form.resetForm();
      query_form.hide();
    });
    //筛选表单
    mdms_datadictD_index_tab.find("#tree_filter").on("click", function () {
      query_form.toggle();
    });
    //树刷新
    mdms_datadictD_index_tab.find("#tree_refresh").on("click", function () {
      mdms_datadictD_index_tab.find(".title_strong").text("");
      //Tree初始化
      _tree.init($("#mdms_datadictD_zydm_tree"), function (treenode) {
        // container.find("div.btn-group").css("display", "none");
        //更新标题
        widgetTitle(treenode);

        // tree  工具栏显示
        _tree_toolbar_show(true);
        
        ver_form_init(treenode);

      });
    });
    
    if (isManager) {
      //值域代码导出
      mdms_datadictD_index_tab.find("#tree_download").on("click", function () {
        if (nodeClick) {

          if (!verSelect.val()) {
            zy.ui.msg("提示", "请选择一个字典版本", "i");
            return;
          }

          zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
          zy.g.am.mod = 'dict';
          var api = "api/dict_ver_find";
          var param = {
            op_type: "find_data",
            cd: nodeClick.cd,
            parentcd: nodeClick.parentcd,
            ver: verSelect.val(),

            download: "1"
          }

          var link = getLink();  // 下载接口URL

          function getLink() {

            var prm = zy.tool.initParams(zy.g.comm, zy.g.am);
            zy.g.am = {};
            //设置Url及参数
            var uri = zy.fix_api_call(api, prm);
            var link = zy.g.host.api + uri + "?" + zy.net.parseParam(prm) + "&" + zy.net.parseParam(param);
            return link;
          }

          zy.log("link=", link)

          window.open(link, "ddd");

        } else {
          zy.ui.msg("提示", "请选择值域代码节点", "i");
        }
      });
      //值域代码导入
      // mdms_datadictD_index_tab.find("#tree_upload").on("click",imports);
      //值域代码导入
      mdms_datadictD_index_tab.find("#tree_upload").on("click", function (e) {

        if (!nodeClick) {
          zy.ui.msg("提示", "请选择值域代码节点", "i");
          return;
        }
        if (!verSelect.val()) {
          zy.ui.msg("提示", "请选择一个字典版本", "i");
          return;
        }


        zy.net.loadHTMLs("saas/mdm/dict/dict_data_import.html", index_mod, function () {
          var param = {
            cd: nodeClick.cd,
            parentcd: nodeClick.parentcd,
            ver: verSelect.val()
          };
          datadict_data_import(param, function () {
            tableGridObj.init(nodeClick, verSelect.val());
          });
        });
      });


    } else {
      mdms_datadictD_index_tab.find("#tree_download").remove();
      mdms_datadictD_index_tab.find("#tree_upload").remove();
    }
    mdms_datadictD_index_tab.find("#tree_refresh").click();
    
    _tools(); //表格Toolbar按钮事件
    
    Tree_ToolBar_Event(); // Tree 工具栏事件

    // Tree 工具栏事件
    function Tree_ToolBar_Event() {
      //添加分类
      mdms_datadictD_index_tab.find("#node-add").on("click", function () {
        zy.net.loadHTMLs("saas/mdm/dict/h2h3.html", index_mod, function () {
          mdms_h2h3(zTreeObj, nodeClick, "i");
        });
      });
      //修改分类
      mdms_datadictD_index_tab.find("#node-edit").on("click", function () {
        zy.net.loadHTMLs("saas/mdm/dict/h2h3.html", index_mod, function () {
          mdms_h2h3(zTreeObj, nodeClick, "u");
        });
      });
      //删除分类
      mdms_datadictD_index_tab.find("#node-delete").on("click", function () {
        
        //确认删除
        zy.ui.mask("删除确认", "是否确认删除此字典分类", function () {


          zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
          zy.g.am.mod = 'dict';

          zy.net.get("api/dicts", function (msg) {
            if (msg) {
              zy.ui.msg("提示", "删除成功", "s");
              
              zTreeObj.removeNode(nodeClick);
              
              nodeClick = null;
              
              //更新版本selec2
              ver_form_init(nodeClick);
            
            }
          },
            {
              op_type: "delete",
              cd: nodeClick.cd,
              parentcd: nodeClick.parentcd
            });

          
        });
        
      });

      //添加版本
      mdms_datadictD_index_tab.find("#ver-add").on("click", function () {
        zy.net.loadHTMLs("saas/mdm/dict/dict_ver.html", index_mod, function () {
          mdms_ver(zTreeObj, nodeClick, "i", function (formData) {

            //更新tree节点数据
            nodeClick.dict.push(formData);

            //更新版本selec2
            ver_form_init(nodeClick, formData.ver);

          });
        });
      });

      //修改版本
      mdms_datadictD_index_tab.find("#ver-edit").on("click", function () {

        var verSelect = $("#ver-select");

        if (!verSelect || !verSelect.val()) return;

        zy.net.loadHTMLs("saas/mdm/dict/dict_ver.html", index_mod, function () {
          mdms_ver(zTreeObj, nodeClick, "u", function (formData) {
            //更新tree节点数据
            nodeClick.dict.forEach(function (v) {
              if (v.ver == formData.ver)
                Object.assign(v, formData);
            });

            //更新版本selec2
            ver_form_init(nodeClick, formData.ver);
          }, verSelect.val());
        });
      });
      
      //删除版本
      mdms_datadictD_index_tab.find("#ver-delete").on("click", function () {

        if (!verSelect || !verSelect.val()) return;

        
        //确认删除
        zy.ui.mask("删除确认", "是否确认删除此明细版本", function () {


          zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
          zy.g.am.mod = 'dict';

          zy.net.get("api/dict_ver", function (msg) {
            if (msg) {
              zy.ui.msg("提示", "删除成功", "s");

              //更新tree节点数据
              
              
              var findI = nodeClick.dict.findIndex(function(v){
                return v.ver == verSelect.val();
              });
              nodeClick.dict.splice(findI,1);
              
  
              //更新版本selec2
              ver_form_init(nodeClick,null,true);
            
            }
          },
            {
              op_type: "delete",
              cd: nodeClick.cd,
              parentcd: nodeClick.parentcd,
              ver: verSelect.val()
            });

          
        });
      });

      
      // 字典版本下拉select2 初始化
      verSelect.select2({
        data: verSelectDataArr,
        placeholder: "请添加版本"
      });
      
      
    }

    
    // 版本change事件
    $("#ver-select").on("change", function (e) {
      zy.log("ver-select change：", e);



      var selectedVer = e.currentTarget.value;
      
      

      tableGridObj.init(nodeClick, selectedVer);


    });


    // 字典版本select2
    function ver_form_init(treeNode, ver, flag) {

      zy.log(treeNode);

      var verSelect = $("#ver-select");
      var $datadicGrid = $("#datadict-grid");
      
      
      var dataArr = verSelectDataArr;
      // 清空select2 下拉数据源 dataArr 
      dataArr.splice(0,dataArr.length);

      // var $index_no_version_msg = $("#index_no_version_msg");

      if (!treeNode || !treeNode.dict || !treeNode.dict.length) {
        // verSelect.select2("destroy");

        verSelect.select2("val",null);
        // 表格工具栏隐藏
        // _tools_show(false);
        // 表格隐藏
        $datadicGrid.hide();
        
        // 显示删除版本按钮
        mdms_datadictD_index_tab.find("#ver-delete").hide();

        // 显示消息
        // $index_no_version_msg.show();
        return;
      }
      // $index_no_version_msg.hide();

      $datadicGrid.show();
      
      // 显示删除版本按钮
      mdms_datadictD_index_tab.find("#ver-delete").show();

      // var val = verSelect.val();

      // 字典版本下拉数据
      var data = $.map(treeNode.dict, function (obj) {
        obj.id = obj.ver;
        obj.text = obj.ver;
        return obj;
      })
      
      

      // 往dataArr添加数据
      Array.prototype.push.apply(dataArr, data);
        
      // verSelect.select2("data",data);


      if(ver){
        verSelect.select2("val",ver);
      }else{
        
        if(treeNode.ver && !flag)
          verSelect.select2("val", treeNode.ver);
        else
          verSelect.select2("val", treeNode.dict[0].ver);
      // verSelect.val(treeNode.dict[0].ver);
      }
      verSelect.trigger("change");

    }

    // 字典明细表格
    function tableGrid(tableId, rowSelectedCB) {

      var dict_dataTable = $("#" + tableId);

      var dictDataTableApi;

      //注册DataTable行点击事件
      dict_dataTable.on('click', 'tr', function () {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          rowSelectedCB && rowSelectedCB(false);
        }
        else {
          dictDataTableApi.$('tr.active').removeClass('active');
          $(this).addClass('active');
          rowSelectedCB && rowSelectedCB(true);
        }
      });


      /**
       * 初始化
       * nodeClick zTree选择的节点
       * selectedVer 版本下拉选择的明细版本
       * rowSelectedCB 表格行选择事件
       */
      function init(nodeClick, selectedVer) {
        if (dictDataTableApi) dictDataTableApi.destroy();

        var cb = function (msg) {
          zy.log("msg=", msg);

          var options = {
            data: msg.result[0].dict[0].data,
            columns: [
              {
                title: "字典编码",
                data: "cd"
              },
              {
                title: "字典中文名",
                data: "nm",
                defaultContent: ""
              },
              {
                title: "快捷拼音码",
                data: "shortkey",
                defaultContent: ""
              },
              {
                title: "说明",
                data: "mark",
                defaultContent: ""
              },
            ],
            "language": zy.ui.dataTable.language,
            select: true
          };
          // 合并初始化参数选项
          // $.extend(options, zy.ui.dataTable);
          // 字典表格初始化
          dictDataTableApi = dict_dataTable.DataTable(options);
        }
        zy.g.am.app = '78cf8922c5ea4afa9dae8970215ea796';
        zy.g.am.mod = 'dict';
        zy.net.get("api/dict_ver_find", cb, {
          op_type: "find_data",
          cd: nodeClick.cd,
          parentcd: nodeClick.parentcd,
          ver: selectedVer
        });
      }



      // destroy表格
      function destroy() {
        if (dictDataTableApi) dictDataTableApi.destroy();
      }



      // 获取选择行数据
      function getSelectedRowData() {
        // 选择行数据
        var rowSelect = dictDataTableApi.row('tr.active');
        if (!rowSelect) {
          return;
        }
        var rowSelectData = rowSelect.data();
        return rowSelectData;
      }

      // 添加行数据
      function addRow(rowData) {
        dictDataTableApi.row.add(rowData).draw();
      }

      // 修改选中的行
      function editSelectedRow(rowData) {
        // 选择行
        var rowSelect = dictDataTableApi.row('tr.active');
        rowSelect.data(rowData).draw();
        dictDataTableApi.$('tr.active').removeClass('active');
      }

      // 删除选中的行
      function deleteSelectedRow() {
        // 选择行
        var rowSelect = dictDataTableApi.row('tr.active');
        rowSelect.remove().draw();
      }


      return {
        dictDataTableApi: dictDataTableApi,  //DataTable API对象

        init: init, //表格初始化
        getSelectedRowData: getSelectedRowData, // 获取选择行数据
        destroy: destroy, //destroy表格

        addRow: addRow, // 添加行数据
        editSelectedRow: editSelectedRow,// 修改选中的行
        deleteSelectedRow: deleteSelectedRow // 删除选中的行
      }

    }


  }

  function init_t3() {
    var mdms_datadictD_index_tab = $("#mdms_datadictD_index").find("#tab-r3");
    var query_form = mdms_datadictD_index_tab.find("[name=mdms_datadictD_czjl_form]");

    //开始时间
    query_form.find("[name=dt_from]").datetimepicker({
      language: "zh-CN",
      format: "yyyy-mm-dd hh:ii:ss",
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight:
        1, startView: 2,
      forceParse: 0,
      showMeridian: 1,
    });
    query_form.find("[name=dt_from]").datetimepicker("setDate", new Date());
    //结束时间
    query_form.find("[name=dt_to]").datetimepicker({
      language: "zh-CN",
      format: "yyyy-mm-dd hh:ii:ss",
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      forceParse: 0,
      showMeridian: 1
    });
    query_form.find("[name=dt_to]").datetimepicker("setDate", new Date());

    //
    query_form.find("[name=modalsearch]").unbind().bind("click", function () {
      czjlPagination(1);
    });

    //操作类型列表
    zy.cache.initDicts("mdm001", function () {
      var obj = {};
      var data = [];
      var ls = zy.cache.get("_mdm_dict", "ls");
      var arr = ls.get().mdm001;
      $.each(arr, function (i, v) {
        if (v.id.length == 5) {
          var str = v.id.substr(0, 3)
          if (typeof obj[str] == "undefined") { obj[str] = [v]; }
          else { obj[str].push(v); }
        }
      });
      $.each(arr, function (index, col) {
        if (obj[col.id]) col.children = (obj[col.id]);
        if (col.id.length != 5) data.push(col);
      });
      query_form.find("[name=operation_type]").zySelectCustomData("", false, { width: "100%" }, data);
    });
    //数据字典
    zy.cache.initDicts("ZR.0001", function () {
      $("[name=mdms_datadictD_zydm_form] input[name=status]").zySelect("ZR.0001", false, {
        width: "100%"
      });
    });
    function czjlPagination(page) {
      $.jqPaginator("#mdms_datadict_czjl_pagination", {
        totalCounts: 1,
        pageSize: 10,
        currentPage: page,
        onPageChange: function (num) {
          zy.g.am.app = "d2c8511b47714faba5c71506a5029d94";
          zy.g.am.mod = "operation_log";
          zy.g.am.pagesize = 10;
          zy.net.get("api/query", function (msg) {
            if (msg) {
              //预设初始化参数
              var options = {
                "data": msg.data,
                "columns": [
                  { "title": "类别编码", "data": "typecd" },
                  { "title": "类别名称", "data": "typenm" },
                  {
                    "title": "操作类型",
                    "render": function (data, type, row, meta) {
                      return zy.cache.cd2name("mdm001", row.operation_type);
                    }
                  },
                  { "title": "操作详细", "data": "operation_detail" },
                  { "title": "平台用户ID", "data": "userid" },
                  { "title": "创建时间", "data": "createdt" }
                ],
              };
              // 合并初始化参数选项
              $.extend(options, zy.ui.dataTable);
              //初始化 DataTable
              mdms_datadictD_index_tab.find("[name=mdms_datadict_czjl_table]").dataTable(options);
              mdms_datadictD_index_tab.find(".dataTables_scroll").css("clear", "none");
              if (msg.count >= 0) {
                mdms_datadictD_index_tab.find("[name=total_count]").html("总数：" + msg.count)
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

  function Init() {
    init_t1();
    init_t2();
    init_t3();
  }

  return datadicdD_index;
})(zy, jQuery);