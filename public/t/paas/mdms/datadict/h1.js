  /**
   * 主数据管理
   * mdms_datadict_h1
   * var mdms_datadict_h1Obj = new mdms_datadict_h1();
   * */
  var mdms_datadict_h1 = (function(zy, $) {
  
  var PT = mdms_datadict_h1.prototype;
  var thiz;
  
  var _mdms_datadict_h1_container = $("#mdms_datadict_h1_container").html(); //container初始状态
  var _datatable_init = null; //用来存放表格init后返回的对象
  var nodeClick = null; //用来存放tree点击的node节点对象
  var zTreeObj = null;  //初始化后的ztree对象
  
  var _tree = tree();
  
  var _datatable = new dyTable({
    app: 'd2c8511b47714faba5c71506a5029d94',
    api: 'getdatatable',
    mod: 'datadict'
  });
  
  var tools = {
    api: function(param, cb) {
      var _cb = function(msg) {
        cb && cb(msg);
      };
      zy.g.am.app = param.app || 'd2c8511b47714faba5c71506a5029d94';
      zy.g.am.mod = param.mod;
      zy.net.get("api/" + param.api, _cb, param.r_param, param.page);
    }
  };

  function mdms_datadict_h1(){
    thiz = this;
    Init();
    return this;
  }
  //zTree
  function tree() {

    function opt(_dbfunc) {
      function Click(event, treeId, treeNode) {
        zy.log(treeNode);
        //为nodeClick赋值
        nodeClick = treeNode;
        //清空模态容器
        $("#mdm_datadict_h1_form").empty();
        
        //如果uri不为空，则load新页面
        if (treeNode.uri && treeNode.uri.trim() !== "") {
          zy.net.loadHTMLs(treeNode.uri, $("#mdms_datadict_h1_container"), function() {});
        } else {
          //如果uri为空，则恢复原页面初始状态
          $("#mdms_datadict_h1_container").html(_mdms_datadict_h1_container);
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
        $('#mdms_datadict_h1_add').hide();
        $('#mdms_datadict_h1_edit').hide();
        $('#mdms_datadict_h1_delete').hide();
      }
      /**/
      function _addHoverDom(_id, _node) {
        //权限：只读，编辑
        if(_node.optype!='1'){
          return;
        }
        var sObj = $("#" + _node.tId + "_span");
        if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
          return;
        var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
        var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
         var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";
         
        if (_node.level == 0) {
          sObj.after(addStr);
        } else {
          if(!_node.isParent) {
            sObj.after(remStr);
          }
          sObj.after(editStr);
          sObj.after(addStr);
        }
        
        $('#addBtn_' + _node.tId).bind("click", function() {
          zTreeObj.selectNode(_node);
          _addModal(_node);
          zy.log(123123);
          // return false;
        })
        $('#editBtn_' + _node.tId).bind('click', function() {
          zTreeObj.selectNode(_node);
          _editModal(_node);
          zTreeObj.updateNode(_node);
          return false;
        })
         $("#remBtn_" + _node.tId).bind('click', function () {
           zTreeObj.selectNode(_node);
           _removeModal(_node);
           return false;
         })
      }

      function _removeHoverDom(_id, _node) {
        $("#addBtn_" + _node.tId).unbind().remove();
        $("#editBtn_" + _node.tId).unbind().remove();
        $("#remBtn_" + _node.tId).unbind().remove();
      }
      function _expand(_e,_id,_node){
        if (!_node.children || _node.children.length === 0){
          tools.api({
              api: "gettree",
              mod: "datadict",
              r_param:{typecd:_node.typecd}
            }, function(msg) {
              console.log(123,_node.typecd);
            zTreeObj.addNodes(_node,msg.result);
            });
        }
       
      }
      return {
        view: {
          dblClickExpand: false,
          addHoverDom: _addHoverDom,
          removeHoverDom: _removeHoverDom
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
      tools.api({
        api: "gettree",
        mod: "datadict"
      }, function(msg) {
        zTreeObj = $.fn.zTree.init(treeContariner, option, msg.result);
      })
    }
    return {
      init: init
    }
  }
  //zTree-添加按钮
  function _addModal(_node) {
    zy.net.loadHTML("mdms/datadict/h2h3.html", $("#mdm_datadict_h1_form"), function() {
      mdms_h2h3(zTreeObj,_node,'i');
    });
  }
  //zTree-修改按钮
  function _editModal(_node) {
    zy.net.loadHTML("mdms/datadict/h2h3.html", $("#mdm_datadict_h1_form"), function() {
      mdms_h2h3(zTreeObj,_node,'u');
    });
  }
  //zTree-删除按钮
  function _removeModal(_node) {
      zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
        zy.g.am.app="d2c8511b47714faba5c71506a5029d94";
        zy.g.am.mod="datadict";
        zy.net.get('api/deletetree',function(msg){
          if(msg){
            zy.ui.msg('提示', '删除成功', 's');
            var treeObj = $.fn.zTree.getZTreeObj("mdms_datadict_h1_tree");
            treeObj.removeNode(_node);
          }
        },{typecd: _node.typecd});
      });
   
  }
  //用来注册工具栏上添加按钮，编辑按钮点击事件
  function _tools() {
    //注册添加按钮点击事件
    $('#mdms_datadict_h1_add').click(function() {
      //tree
      if(!nodeClick.datatable){
        zy.net.loadHTML("mdms/datadict/h2h3.html", $("#mdm_datadict_h1_form"), function() {
          mdms_h2h3(zTreeObj,nodeClick,'i',updateGrid);
        });
        return;
      }
      //字典
      if(nodeClick.datatable=='sys_mdm002'){
        zy.net.loadHTML("mdms/datadict/datadict.html", $("#mdm_datadict_h1_form"), function() {
          mdm_datadict_modal(nodeClick,'i',updateGrid);
        });
        return;
      }
      //else
      function cb(msg) {
        zy.net.loadHTML("mdms/datadict/h5h6.html", $("#mdm_datadict_h1_form"), function() {
          //如果点击的是父节点
          // if (nodeClick.datatable == null||nodeClick.datatable.trim()=="") {
          //   _form.find('[name=parentcd]').val(nodeClick.typecd);
          //   _form.find('[name=parentcd]').attr('readonly', true);
          // } else {
            _form.find('[name=typecd]').val(nodeClick.typecd);
            _form.find('[name=typecd]').attr('readonly', true);
          // }
          $("#datadict_h5h6_title").text('添加');
          _form.find('[name=status]').select2("val", '1'); //默认值
          $('#datadict_h5h6').modal('show');
        });
        var _dyForm = new dyForm();
        var _form = _dyForm.modalform(msg.type, function() {
            zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
            zy.g.am.mod = 'datadict';
            var api = "adddata";
            //参数中添加一个typecd
            var _params=_form.serialize();
            if(_form.find('[name=typecd]').length===0){
              _params=_params+'&typecd='+encodeURI(nodeClick.typecd);
            }
            zy.net.post("api/" + api, function(msg) {
              if (msg) {
                $('#datadict_h5h6').modal('hide');
                zy.ui.msg('提示', '保存成功', 's');
                _datatable_init = _datatable.init($("#mdms_datadict_h1_table"), {
                  typecd: nodeClick.typecd
                });
                //编辑按钮、删除按钮变为不可点击
                $('#mdms_datadict_h1_edit').btnDisable(true);
                $('#mdms_datadict_h1_delete').btnDisable(true);
              }
            },_params);
            $('#datadict_h5h6_form').formDisable(true);
          },
          function() {
            $('#datadict_h5h6').modal('hide');
          });
        $('div.modal-body.no-padding').append(_form);

      }
      zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
      zy.g.am.mod = 'datadict';
      zy.net.get('api/getcolumninfo', cb, {
        typecd: nodeClick.typecd,
        usetype: 1
      });
    });
    //注册编辑按钮点击事件
    $('#mdms_datadict_h1_edit').click(function() {
      //选择行数据
      var _data = _datatable_init.getrow();
      //tree
      if(!nodeClick.datatable){
        zy.net.loadHTML("mdms/datadict/h2h3.html", $("#mdm_datadict_h1_form"), function() {
          mdms_h2h3(zTreeObj,_data,'u',updateGrid);
        });
        return;
      }
      //字典
      if(nodeClick.datatable=='sys_mdm002'){
        zy.net.loadHTML("mdms/datadict/datadict.html", $("#mdm_datadict_h1_form"), function() {
          mdm_datadict_modal(_data,'u',updateGrid);
        });
        return;
      }
      //获取列信息回调函数
      function cb(msg) {
        var oldValue = ""; //用来存放旧的表单值 &key1=&key2=
        zy.net.loadHTML("mdms/datadict/h5h6.html", $("#mdm_datadict_h1_form"), function() {
          $('#datadict_h5h6').modal('show');
          $("#datadict_h5h6_title").text('修改');
          // _form.find('[name=typecd]').val(_typecd);
          _form.find('[name=typecd]').attr('readonly', true);
          _form.find('[name=status]').select2("val", '1'); //默认值
          for (i in _data) {
            //修改前的表单值
            oldValue = oldValue + "&_" + i + "=" + encodeURI(_data[i]);
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
          if(_form.find('[name=typecd]').length===0){
            _params=_params+'&typecd='+encodeURI(nodeClick.typecd);
          }
          zy.net.post("api/" + api, function(msg) {
            if (msg) {
              zy.ui.msg('提示', '保存成功', 's');
              _datatable_init.setrow(_form.form2json());
              // if (nodeClick.datatable == null || nodeClick.datatable.trim()=="") {
              //   var treeObj = $.fn.zTree.getZTreeObj("mdms_datadict_h1_tree");
              //   //更新节点
              //   var name=treeObj.getNodeByParam("typecd", _data.typecd, nodeClick);
              //   name.typenm=msg.data.typenm;
              //   name.shownm=msg.data.shownm;
              //   name.datatable=msg.data.datatable;
              //   treeObj.updateNode(name);
              // }
              $('#datadict_h5h6').modal('hide');
            }
          }, _params + oldValue);
          $('#datadict_h5h6_form').formDisable(true);
          //zy.cache.refreshData(msg.type);
        }, function() {
          $('#datadict_h5h6').modal('hide');
        });
        $('div.modal-body.no-padding').append(_form);
      }
        //调接口，获取列信息
      zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
      zy.g.am.mod = 'datadict';
      zy.net.get('api/getcolumninfo', cb, {
        typecd: nodeClick.typecd,
        usetype: 2
      });
    });
    $('#mdms_datadict_h1_export').click(function() {
      //字典
      var param={
        'typecd': nodeClick.typecd,
        '_is_download':1
      };
      var arr=$('.smart-form').serializeArray();
      $.each(arr,function(i,v){
        param[v.name]=v.value
      })
      var options={
            app:'d2c8511b47714faba5c71506a5029d94',
            mod:'DataDict',
            api:'getdatatable'
          }
          data_export.event(options,$("#mdm_datadict_h1_form"),param)

    });
    //注册删除按钮点击事件
    $('#mdms_datadict_h1_delete').click(function() {
      //确认删除
      zy.ui.mask('删除确认', '是否确认删除此条数据', function() {
        var _data = _datatable_init.getrow();
        //选择行数据
        zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
        zy.g.am.mod = 'datadict';
        //参数中添加一个typecd
        if(!_data.typecd){
          _data.typecd=nodeClick.typecd;
        }
        zy.net.get('api/deletedata', function(msg) {
          if (msg) {
            zy.ui.msg('提示', '删除成功', 's');
            _datatable_init = _datatable.init($("#mdms_datadict_h1_table"), {
              typecd: nodeClick.typecd
            });
            //编辑按钮、删除按钮变为不可点击
            $('#mdms_datadict_h1_edit').btnDisable(true);
            $('#mdms_datadict_h1_delete').btnDisable(true);
          }
        }, _data);
      });
    });
    //刷新grid
    function updateGrid(){
      var conditions = $('#row_form').find(".smart-form").serialize();
      _datatable_init = _datatable.init($("#mdms_datadict_h1_table"),conditions+"&typecd="+nodeClick.typecd);
      //编辑按钮、删除按钮变为不可点击
      $('#mdms_datadict_h1_edit').btnDisable(true);
      $('#mdms_datadict_h1_delete').btnDisable(true);
    }
  }
  //注册DataTable行点击事件
  function _tools_rowEvent() {
    $('#mdms_datadict_h1_table').on('click', 'tr', function(e) {
      if (_datatable_init.getrow()) {
        $('#mdms_datadict_h1_edit').btnDisable(false);
        $('#mdms_datadict_h1_delete').btnDisable(false);
      } else {
        $('#mdms_datadict_h1_edit').btnDisable(true);
        $('#mdms_datadict_h1_delete').btnDisable(true);
      }
    });
  }
  //打开关闭右边Tree
  function tools_opFile(){
    $('#mdms_datatict_h1').find('[name=toolbar_folder]').parent().unbind('click').click(function (e) {
        
        if($('#mdms_datadict_h1_tree').is(':visible')){
           $('#mdms_datadict_h1_container').removeClass().addClass('col col-xs-12 col-sm-12 ');
          $('#mdms_datatict_h1').find('.col-sm-3').hide();
          console.log('有效');
        }
        else{
           $('#mdms_datadict_h1_container').removeClass().addClass('col col-xs-12 col-sm-9');
          $('#mdms_datatict_h1').find('.col-sm-3').show();
          console.log("无效");
        }
      });
    $('#mdms_datatict_h1').find('header').children('a').unbind('click').click(function(){
      $('#mdms_datatict_h1').find('[name=toolbar_folder]').parent().click();
    });
    //操作日志
    $('#mdms_datatict_h1').find('.fa-book').parent().unbind('click').click(function () {
      zy.net.loadHTML("mdms/log/operation_log.html", $("#mdm_datadict_h1_log"), function () {
          
      });
    });
    //API
    $('#mdms_datatict_h1').find('.fa-list').parent().unbind('click').click(function () {
      zy.net.loadHTML("mdms/usage/api.html", $("#mdm_datadict_h1_log"), function(){});
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
        _name = _tnode.getParentNode().typenm +" >"+ _name;
        _tnode=_tnode.getParentNode();
      }
      else{
        flg_ = false;
        break;
      }
    }
    $('#mdms_datatict_h1').find('strong').text(_name+"("+ treenode.typecd+")");
  }
  
  function Init(){
    //数据字典
    zy.cache.initDicts('ZR.0001', function() {});
    zy.net.loadHTML('mdms/datadict/logtable.html', $("#mdms_datadict_h1_table"),null);
    //Tree初始化
    _tree.init($("#mdms_datadict_h1_tree"), function(treenode) {
      //更新标题
      widgetTitle(treenode);
      //DataTable初始化
      _datatable_init = _datatable.init($("#mdms_datadict_h1_table"), {typecd: treenode.typecd
      }, function(_msg) {
        if (_msg.type.length > 0) {
          $('#mdms_datatict_h1').find('div.btn-group').css('display', 'inline-block');
          $('#mdms_datatict_h1').find('[name=total_count]').html('总数:' + _msg.count);
          $('#mdms_datadict_h1_edit').btnDisable(true);
          $('#mdms_datadict_h1_delete').btnDisable(true);
        } else {
          $('#mdms_datatict_h1').find('div.btn-group').css('display', 'none');
        }
      });
      //数据表不为空时，显示删除按钮
      if (nodeClick.datatable == null||nodeClick.datatable.trim()=="") {
        $('#mdms_datadict_h1_delete').hide();
      }
      //查询Form
      var cb = function(msg) {
        $('#row_form').empty();
        if (msg.type.length > 0) {
          var _dy = new dyForm();
          var isplatDict = false; //查询Form中的数据字典是否平台
          if((!nodeClick.datatable) || nodeClick.datatable=='sys_mdm002'){
            isplatDict = true;
          }
          $('#row_form').append(_dy.searchform(msg.type, function() {
            var conditions = $('#row_form').find(".smart-form").serialize();
            _datatable_init = _datatable.init($("#mdms_datadict_h1_table"), conditions + "&typecd=" + treenode.typecd, function(_msg) {
              if (_msg.type.length > 0) {
                $('#mdms_datatict_h1').find('[class=btn-group]').css('display', 'inline-block');
                $('#mdms_datadict_h1_edit').btnDisable(true);
                $('#mdms_datadict_h1_delete').btnDisable(true);
              } else {
                $('#mdms_datatict_h1').find('[class=btn-group]').css('display', 'none');
              }
            });
          },isplatDict));
        }
      }
      zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
      zy.g.am.mod = 'datadict';
      zy.net.get('api/getsearchformtype', cb, {
        typecd: nodeClick.typecd
      });
    });
    //左侧tree关闭打开事件
    tools_opFile(); 
  }
  
  return mdms_datadict_h1;
})(zy, jQuery);
