md_mm_h1 = (function(zy, $) {
  
  var PT = md_mm_h1.prototype;
  var thiz;
  
  var container = $('#md_mm_h1_container');
  var tab_container = $('#md_mm_h1_tab_container');
  
  var _typecd = null; //用来存放tree节点的typecd（包含父节点）
  var nodeClick = null; //用来存放tree点击的node节点对象
  var _datatable_init = null; //用来存放init后返回的对象
  var _data = null; //用来获取行数据
  
  var _tree = tree({
    app: "c879dcc94d204d96a98a34e0b7d75676",
    api: "gettree",
    mod: "mm"
  });
  
  var _datatable = new dyTable({
    app: 'c879dcc94d204d96a98a34e0b7d75676',
    api: 'getdatatable',
    mod: 'mm'
  });
  
  PT._g = {
    // decd_select2:[] //数据元select2
  }

  function md_mm_h1() {
    thiz = this;
    Init();
    return this;
  }

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
    var _tree = null;

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
          _tree.selectNode(_node);
          thiz._addModal(_node);
          return false;
        })
        $('#editBtn_' + _node.tId).bind('click', function() {
          _tree.selectNode(_node);
          thiz._editModal(_node);
          _tree.updateNode(_node);
          return false;
        })
        $("#remBtn_" + _node.tId).bind('click', function() {
          _tree.selectNode(_node);
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
      tools.api(_params, function(msg) {
        _tree = $.fn.zTree.init(treeContariner, option, msg.result);
      });
    }
    return {
      init: init
    };
  }

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
    // version: {
    //   maxlength: 100
    // },
    mark: {
      maxlength: 200
    }
  };
  PT._addModal=function(_node,submit,cancle) {
    // zy.net.loadHTML("md/mm/h2h3.html", $("#md_mm_h1_modal"), function() {
    //   var _h2h3Obj=new md_mm_h2h3($.fn.zTree.getZTreeObj("tree"),_node,"i", function(newNode){
    //     console.log(newNode);
    //     submit&&submit(newNode);
    //   },function(){
    //     cancle&&cancle();
    //   });
    // });
    zy.net.loadHTML("md/mm/h2h3.html", $("#md_mm_h1_modal"), function() {
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
                Console.log("保存成功 = " + JSON.stringify(msg));
                $('#md_mm_h2h3').modal('hide');
                zy.ui.msg("提示信息：", "保存成功！", "s");
                //更新树节点
                var treeObj = $.fn.zTree.getZTreeObj("tree");
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

  PT._editModal=function(_node,submit,cancle) {
    zy.net.loadHTML("md/mm/h2h3.html", $("#md_mm_h1_modal"), function() {
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
          Console.log("获取字典类型信息数据 = " + JSON.stringify(msg));
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
                Console.log("保存成功 = " + JSON.stringify(msg));
                $('#md_mm_h2h3').modal('hide');
                //更新节点
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                var t = treeObj.getNodeByParam('typecd',_node.typecd,null);
                t.typecd = msg.data.typecd;
                t.typenm = msg.data.typenm;
                t.shownm = msg.data.shownm;
                t.datatable = msg.data.datatable;
                t.parentcd = msg.data.parentcd;
                treeObj.updateNode(t);    //更新节点
                // thiz._g._nodeClick = t;   //更新变量
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
          var treeObj = $.fn.zTree.getZTreeObj("tree");
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
    $('#md_mm_h1_add').click(function() {
      //tree
      if(!nodeClick.datatable){
        zy.net.loadHTML('md/mm/h2h3.html', $("#md_mm_h1_modal"), function(){
          var _h2h3Obj=new md_mm_h2h3($.fn.zTree.getZTreeObj("tree"),nodeClick,"i",updateGrid);
        });
        return false;
      }
      //数据元
      if(nodeClick.datatable == "sys_mdm003"){
        zy.net.loadHTML("md/mm/sys_mdm003.html", $("#md_mm_h1_modal"),function(){
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
            // if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
            //   //跟添加tree节点一个接口
            //   api = "addtype";
            // }
            zy.net.post("api/" + api, function(msg) {
              if (msg) {
                $('#md_mm_h5h6').modal('hide');
                zy.ui.msg('提示', '保存成功', 's');
                _datatable_init = _datatable.init($("#md_mm_h1_table"), {
                  typecd: _typecd
                });
                //编辑按钮变为不可点击
                $('#md_mm_h1_edit').btnDisable(true);
                $('#md_mm_h1_delete').btnDisable(true);
                //如果grid数据是tree数据，则更新树节点
                if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
                  var treeObj = $.fn.zTree.getZTreeObj("tree");
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
        zy.net.loadHTML("md/mm/h5h6.html", $("#md_mm_h1_modal"), function() {
          $("#md_mm_h5h6_title").text('添加');
          _form.find('[name=status]').select2("val", '1'); //默认值
          $("#md_mm_h5h6").find('div.modal-body.no-padding').append(_form);
          $('#md_mm_h5h6').modal('show');
          //如果点击的是父节点
          if (nodeClick.datatable == null || nodeClick.datatable.trim() == "") {
            _form.find('[name=parentcd]').val(_typecd);
            // _form.find('[name=parentcd]').attr('readonly', true);
          } else {
            if(nodeClick.datatable == "sys_mdm003"){
              dict();
            }
            _form.find('[name=typecd]').val(_typecd);
            // _form.find('[name=typecd]').attr('readonly', true);
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
    $('#md_mm_h1_edit').click(function() {
      //选择行数据
      var _data = _datatable_init.getrow();
      //tree
      if(!nodeClick.datatable){
        zy.net.loadHTML('md/mm/h2h3.html', $("#md_mm_h1_modal"), function(){
          var _h2h3Obj=new md_mm_h2h3($.fn.zTree.getZTreeObj("tree"),_data,"u",updateGrid);
        });
        return false;
      }
      //数据元
      if(nodeClick.datatable == "sys_mdm003"){
        zy.net.loadHTML("md/mm/sys_mdm003.html", $("#md_mm_h1_modal"),function(){
          mm_sys_mdm003('u',nodeClick.typecd,_data.decd,updateGrid);
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
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                var name = treeObj.getNodeByParam("typecd", _data.typecd, nodeClick);
                name.typenm = msg.data.typenm;
                name.shownm = msg.data.shownm;
                name.datatable = msg.data.datatable;
                treeObj.updateNode(name);
              }
              $('#md_mm_h5h6').modal('hide');
              // $('#md_mm_h1_edit').btnDisable(true);
              // $('#md_mm_h1_delete').btnDisable(true);
            }
          }, _form.serialize() + encodeURI(oldParam));
          $('#md_mm_h5h6_form').formDisable(true);
        }, function() {
          $('#md_mm_h5h6').modal('hide');
        });
        zy.net.loadHTML("md/mm/h5h6.html", $("#md_mm_h1_modal"), function() {
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
    $('#md_mm_h1_export').click(function() {
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
            app:'c879dcc94d204d96a98a34e0b7d75676',
            mod:'mm',
            api:'getdatatable'
          }
          data_export.event(options,$("#md_mm_h1_modal"),param)

    });
    //注册删除按钮点击事件
    $('#md_mm_h1_delete').click(function() {
      zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
        //选择行数据
        _data = _datatable_init.getrow();
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get('api/deletedata', function(msg) {
          if (msg && msg.ret=="0") {
            Console.log("22222 = " + JSON.stringify(msg));
            zy.ui.msg('提示', '删除成功', 's');
            _datatable_init = _datatable.init($("#md_mm_h1_table"), {
              typecd: _typecd
            });
            _tools_rowEvent(); //添加点击事件
            //编辑按钮、删除按钮变为不可点击
            $('#md_mm_h1_edit').btnDisable(true);
            $('#md_mm_h1_delete').btnDisable(true);
          }
        }, _data);
      });
    });
    //更新grid
    function updateGrid(){
      var conditions = $('#row_form').find(".smart-form").serialize();
      _datatable_init = _datatable.init($("#md_mm_h1_table"),conditions+"&typecd="+nodeClick.typecd);
      //编辑按钮变为不可点击
      $('#md_mm_h1_edit').btnDisable(true);
      $('#md_mm_h1_delete').btnDisable(true);
    }
    //关闭/打开右侧文件目录
    $('#md_mm_h1').find('[name=toolbar_folder]').parent().unbind('click').click(function () {
      if($('#md_mm_h1_left').is(':visible')){
        $('#md_mm_h1_left').hide();
        $('#md_mm_h1_container').removeClass().addClass('col col-xs-12 col-sm-12');
        $('#md_mm_h1_tab_container').removeClass().addClass('col col-xs-12 col-sm-12');
      }else{
        $('#md_mm_h1_left').show();
        $('#md_mm_h1_container').removeClass().addClass('col col-xs-12 col-sm-9');
        $('#md_mm_h1_tab_container').removeClass().addClass('col col-xs-12 col-sm-9');
      }
    });
    //关闭左侧文件目录
    $('#md_mm_h1').find('header').children('a').unbind('click').click(function(){
      //执行工具条上的click事件
      $('#md_mm_h1').find('[name=toolbar_folder]').parent().click();
    });
    //操作日志
    $('#md_mm_h1').find('.fa-book').parent().unbind('click').click(function () {
      zy.net.loadHTML("md/log/operation_log.html", $("#md_mm_h1_modal_log"), function(){});
    });
    //API
    $('#md_mm_h1').find('.fa-list').parent().unbind('click').click(function () {
      zy.net.loadHTML("md/usage/api.html", $("#md_mm_h1_modal_log"), function(){});
    });
  }
  //注册行点击事件
  function _tools_rowEvent() {
    $('#md_mm_h1_table').on('click', 'tr', function(e) {
      zy.log('#md_mm_h1_table  click');
      if (_datatable_init.getrow()) {
        // if (thiz._g._data_init.getrow()) {
        $('#md_mm_h1_edit').btnDisable(false);
        $('#md_mm_h1_delete').btnDisable(false);
      } else {
        $('#md_mm_h1_edit').btnDisable(true);
        $('#md_mm_h1_delete').btnDisable(true);
      }
    });
  }
  
  //widget标题
  function treeTitle(_node) {

    //添加tree的标题
    var _name = _node.typenm;
    var flg_ = true;
    var _tnode = _node;
    while (flg_) {
      if (_tnode.getParentNode()) {
        _name = _tnode.getParentNode().typenm + " >" + _name;
        _tnode = _tnode.getParentNode();
      } else {
        flg_ = false;
        break;
      }
    }
    var _title = $('#md_mm_h1').find('strong');
    _title.text("元数据管理 " + _name + "(" + _node.typecd + ")");

  }
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
      var root = {
        shownm : '外部数据源',
        children : msg.result,
        open : true
      }
      _tree = $.fn.zTree.init($('#outer_source_tree'), option, root);
    });
  }
  
  //初始化
  function Init(){
    //左边tab初始化
    $("#lefttabs").tabs();
    //加载操作记录
    zy.net.loadHTML('md/mm/logtable.html', $("#md_mm_h1_table"),null);
    //md_mm_h1_container的resize事件
    $('#md_mm_h1_container').resize(function(){
      var thisHeight = $(this).height();
      var treeHeight = $('#lefttabs').find('.ztree').height();
      if(thisHeight > 440)
        $('#lefttabs').find('.ztree').height(thisHeight - 80);
      else
        $('#lefttabs').find('.ztree').height(360);
    });
    //数据字典
    zy.cache.initDicts("ZR.0001,ZR.0052", function() {});
    // 初始化ztree
    _tree.init($("#tree"), function(treenode) {
      $('#row_form').show();
      $('#md_mm_h1_add').parent().show();
      // $('[name=createobj]').parent().remove();
      treeTitle(treenode);
      //为nodeClick赋值
      nodeClick = treenode;
      
      // 节点的datatable属性值为sys_md_mm002时
      if (treenode.datatable === 'sys_md_mm002') {
        container.hide();
        $('#md_mm_h1_tab_container').show();
        zy.net.loadHTML('md/mm/sys_md_mm.html', $('#md_mm_h1_tab_container'), function() {
          var o = new sys_md_mm();
          o.init(treenode);
          $('[name=tab_first]').find('[name=edit]').btnDisable(true);
          $('[name=tab_first]').find('[name=delete]').btnDisable(true);
        });
        return;
      }
      // // 节点的datatable属性值不为sys_md_mm002时
      else {
        container.show();
        $('#md_mm_h1_tab_container').empty();
        
        //调用datatable
        _datatable_init = _datatable.init($("#md_mm_h1_table"), {
          typecd: treenode.typecd
        }, function(_msg) {
          if (_msg.type.length > 0) {
            $('#md_mm_h1').find('[class=btn-group]').css('display', 'inline-block');
            $('#md_mm_h1').find('[name=total_count]').html('总数:' + _msg.count);
            $('#md_mm_h1_edit').btnDisable(true);
            if (treenode.datatable == null || treenode.datatable.trim() == "") {
              $('#md_mm_h1').find('[id=md_mm_h1_delete]').css('display', 'none');
            } else {
              $('#md_mm_h1').find('[id=md_mm_h1_delete]').css('display', 'block');
              $('#md_mm_h1_delete').btnDisable(true);
            }
          } else {
            $('#md_mm_h1').find('[class=btn-group]').css('display', 'none');
          }
        });
        var cb = function(msg) {
          $('#row_form').empty();
          if (msg.type.length > 0) {
            var _dy = new dyForm();
            $('#row_form').append(_dy.searchform(msg.type, function() {
              var conditions = $('#row_form').find(".smart-form").serialize();
              _datatable_init = _datatable.init($("#md_mm_h1_table"), conditions + "&typecd=" + treenode.typecd, function(_msg) {
                if (_msg.type.length > 0) {
                  $('#md_mm_h1').find('[class=btn-group]').css('display', 'inline-block');
                  $('#md_mm_h1_edit').btnDisable(true);
                  if (treenode.datatable.trim() == "") {
                    $('#md_mm_h1').find('[id=md_mm_h1_delete]').css('display', 'none');
                  } else {
                    $('#md_mm_h1').find('[id=md_mm_h1_delete]').css('display', 'block');
                    $('#md_mm_h1_delete').btnDisable(true);
                  }
                } else {
                  $('#md_mm_h1').find('[class=btn-group]').css('display', 'none');
                }
              });
            },true));
            // thiz._g._data_init = _datatable_init;
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
    //添加修改按钮事件
    _tools(); 
    // 初始化外部数据源Tree
    outerTree(function(node){
      if(!node || node.level == 0)
        return;
      if(!node.isParent){
        zy.net.loadHTML('md/mm/md_mm_outer_tblinfo.html', $('#md_mm_h1_tab_container'), function(){
          container.hide();
          tab_container.show();
          new outer_tblinfo(node);
        });
      }
    },function(node){
  
      if(!node || node.level == 0)
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
          var tree = $.fn.zTree.getZTreeObj("outer_source_tree");
          tree.refresh();
        }
      })
    });
  }
  
  return md_mm_h1;
})(zy, jQuery);

