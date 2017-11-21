pageSetUp();


(function () {
  var tools = {
    _api: function (_apinm, _cb, _param, _str) {
      $.ajax({
        url: 'http://' + location.host + '/api/' + _apinm,
        dataType: "jsonp",
        data: _param || {},
        type: _str || 'GET',
        jsonpCallback: 'callback' + zy.tool.random(),
        success: function (data) {
          _cb(data);
        },
        error: function (xhr, status, error) {
          zy.log('Error: ' + error.message);
        }
      });
    },
    get: function (apiinfo, cb, param, str) {

      $.extend(zy.g.am, apiinfo);

      zy.net.get('api/' + apiinfo.apinm, function (data) {
        if (data && data.ret && data.ret == '0')
          cb && cb(data);
      }, param);
    },
    post: function (apiinfo, cb, param, str) {

      $.extend(zy.g.am, apiinfo);

      zy.net.post('api/' + apiinfo.apinm, function (data) {
        if (data && data.ret && data.ret == '0')
          cb && cb(data);
        else
          zy.ui.msg('提示', '接口异常', 'e');
      }, param);
    },
    random: function () {
      return new Date().getTime() + '' + Math.round(Math.random() * 10000);
    },
    async: function (count) {
      return function (callback) {
        var index = 0;
        var result = {};
        return function (key, value) {
          index++;
          if (!result[key])
            result[key] = value;
          if (index == count)
            callback && callback(result);
        }
      }
    },
    msg: function (content, flg) {
      zy.ui.msg('提示', content, flg);
    },
    label: function (str) {
      var t = '<' + str + '></' + str + '>';
      return $(t);
    }
  }
  var emptyTable = tools.label('table').attr({
    name: 'table',
    class: 'table table-bordered table-striped'
  });

  function init() {
    $('[name=uploadfile]').unbind().bind('click', function () {
      zy.g.am.app = 'ac25e37830ec4e6cbe367a51a4005b7e';
      zy.g.am.mod = 'import';
      zy.net.postForm("upload/upload", $('#filemsg'), function (msg) {
        $('[name=filenm]').val(msg.result[0].file_name);
        getresult(msg);
      });
    })
  }

  function getresult(msg) {
    var cb = function (_mm) {
      if (_mm) {
        if (_mm.result.apitree.length > 0) {
          apilisttree($('#apilist'), _mm.result.apitree);
        }
        if (_mm.result.dedstree.length > 0) {
          $('#data').attr('style', '');
          datatree($('#datalist'), _mm);
        }

        if (_mm.result.allmodeltree.length > 0) {
          $('#model').attr('style', '');
          modeltree($('#modellist'), _mm.result.allmodeltree);
        }

        if (_mm.result.role.length > 0) {
          $('#role').attr('style', '');
          roletree($('#rolelist'), _mm.result.role)
        }
        
        if(_mm.result.appendices){
          $('[name=appendices]').val(_mm.result.appendices)
        }

      }
    }
    zy.g.am.app = 'ac25e37830ec4e6cbe367a51a4005b7e';
    zy.g.am.mod = 'import';
    zy.net.get('api/return_zip_data', cb, {'filenm': msg.result[0].file_name}, null, function (mm) {
      zy.ui.msg('提示信息', mm.msg, 'w')
    });
  }

  function apilisttree(_c, msg) {

    function _tree(cb) {
      var setting = {
        data: {
          key: {
            checked: 'checked',
            name: 'name',
            title: 'name'
          }
        },
        check: {
          enable: true,
          chkDisabledInherit: true,
          chkStyle: "checkbox",
          chkboxType: {
            "Y": "ps",
            "N": "ps"
          }
        },
        view: {
          showTitle: true,
          selectedMulti: false,
          showIcon: true,
          dblClickExpand: false,
          fontCss : getfontcolor
        }
      };
      var tree = null

      tree = $.fn.zTree.init(_c, setting, msg);
      cb && cb(tree);


    }
    
    function getfontcolor(treeId, node){
      if(node._isexist==true)
      return  {'color':'red'};
    }

    _tree(function (tree) {
      zy.log(111)

    })
  }

  function datatree(container, msg) {
    function _tree(cb) {
      var setting = {
        data: {
          key: {
            checked: 'checked',
            name: 'typenm',
            title: 'typecd'
          },
          simpleData: {
            enable: true,
            idKey: "typecd",
            pIdKey: "parentcd"

          }
        },
        check: {
          enable: true,
          chkDisabledInherit: true,
          chkStyle: "checkbox",
          chkboxType: {
            "Y": "ps",
            "N": "ps"
          }
        },
        view: {
          showTitle: true,
          selectedMulti: false,
          showIcon: true,
          dblClickExpand: false,
          fontCss : getfontcolor
        },
        callback: {
          onClick: onClick,
          onCheck: onCheck
        }
      };
      var tree = null


      tree = $.fn.zTree.init(container, setting, msg.result.dedstree);
      cb && cb(tree);


    }

    _tree(function (tree) {
      zy.log(111)

    })
    
    function getfontcolor(treeId, node){
      if(node._isexist==true)
      return  {'color':'red'};
    }

    function onClick(e, _id, node) {
      if(!node.isParent) initInner(node,$('[name=tablecontainer]'),msg);

      zy.log(node)
    }

    function onCheck(e, _id, node) {
      //   var input=$('#de').children();
      // $.each(input,function(i,v){
      //   if(node.typecd==$(v).attr('typecd'))  $(v).remove();
      // })
    }
  }

  //模型列表
  function modeltree(_c, msg) {
    function _tree(cb) {
      var setting = {
        data: {
          key: {
            checked: 'checked',
            name: 'typenm',
            title: 'typecd'
          },
          simpleData: {
            enable: true,
            idKey: "typecd",
            pIdKey: "parentcd"

          }
        },
        check: {
          enable: true,
          chkDisabledInherit: true,
          chkStyle: "checkbox",
          chkboxType: {
            "Y": "ps",
            "N": "ps"
          }
        },
        view: {
          showTitle: true,
          selectedMulti: false,
          showIcon: true,
          dblClickExpand: false,
          fontCss : getfontcolor
        }
      };
      var tree = null

      tree = $.fn.zTree.init(_c, setting, msg);
      cb && cb(tree);
    }

    _tree(function (tree) {
      var nodes = tree.getNodesByParam("typecd", "DE");
      tree.removeNode(nodes[0]);

    })
    
    function getfontcolor(treeId, node){
      if(node._isexist==true)
      return  {'color':'red'};
    }
  }

  //角色列表
  function roletree(_c, msg) {
    function _tree(cb) {
      var setting = {
        data: {
          key: {
            checked: 'checked',
            name: 'rolenm',
            title: 'roleid'
          }
        },
        check: {
          enable: true,
          chkDisabledInherit: true,
          chkStyle: "checkbox",
          chkboxType: {
            "Y": "ps",
            "N": "ps"
          }
        },
        view: {
          showTitle: true,
          selectedMulti: false,
          showIcon: true,
          dblClickExpand: false,
          fontCss : getfontcolor
        }
      };
      var tree = null


      tree = $.fn.zTree.init(_c, setting, msg);
      cb && cb(tree);


    }

    function getfontcolor(treeId, node){
      if(node._isexist==true)
      return  {'color':'red'};
    }
    
    _tree(function (tree) {
      zy.log(111)

    })
  }
  
  function initInner(node, container,msg) {
    _match = {
      //数据集
      'sys_md_mm002': {
        api: 'getds',
        columns: [{
          'title': '数据元名称',
          'data': 'decd'
        }, {
          'title': '中文名称',
          'data': 'cn'
        }, {
          'title': '英文名称',
          'data': 'en'
        }, {
          'title': '缺省值',
          'data': 'dv'
        }, {
          'title': '排序',
          'data': 'sorting'
        }, {
          'title': '元素标签类型',
          'data': 'elemtype'
        }, {
          'title': '主键',
          'data': 'mk'
        }, {
          'title': '必须',
          'data': 'must'
        }, {
          'title': '状态',
          'data': 'status'
        }, {
          'title': '说明',
          'data': 'mark'
        }, {
          'title': '创建时间',
          'data': 'createdt'
        }, {
          'title': '更新时间',
          'data': 'updatedt'
        }],
        button: '查看表数据'
      },
      'sys_mdm003': {
        api: 'getde',
        columns: [{
          'title': '数据元名称',
          'data': 'decd'
        }, {
          'title': '中文名称',
          'data': 'cn'
        }, {
          'title': '英文名称',
          'data': 'en'
        }, {
          'title': '数据类型',
          'data': 'datatype'
        }, {
          'title': '数据长度',
          'data': 'numrange'
        }, {
          'title': '显示格式',
          'data': 'format'
        }, {
          'title': '单位',
          'data': 'unit'
        }, {
          'title': '字典类别',
          'data': 'dict'
        }, {
          'title': '是否标准',
          'data': 'isstd'
        }, {
          'title': '状态',
          'data': 'status'
        }, {
          'title': '说明',
          'data': 'mark'
        }, {
          'title': '创建时间',
          'data': 'createdt'
        }, {
          'title': '更新时间',
          'data': 'updatedt'
        }],
        button: '保存',
        buttons:'全选'
      }
    }
    var button = tools.label('button').addClass('btn btn-info btn-sm').html(_match[node.datatable].button).attr('val', node.datatable).attr('name','savedata');
    
    if(_match[node.datatable].buttons){
      var selectall=tools.label('button').addClass('btn btn-info btn-sm').html(_match[node.datatable].buttons).attr('name','selectall');
    }
    var api = _match[node.datatable].api;
    var columns = _match[node.datatable].columns;

    function clean() {
      var target = container.find('.dataTables_wrapper');
      target.empty();
      target.append(emptyTable.clone());
    }

    var pagenation = container.next();
    if (pagenation.length == 0) {
      container.after($('<div></div>'));
      pagenation = container.next();
    }
    function Pagination(page) {
      $.jqPaginator(pagenation, {
        totalCounts: 1,
        pageSize: zy.g.page.pagesize,
        currentPage: page,
        onPageChange: function (num) {
          SetDt(num);
        }
      });
    };

    function SetDt(page) {
      clean();
      container.find('.btn-group').children().remove();
      container.find('.btn-group').append(button).append(selectall);
      container.find('[name=table]').attr('en', node.datatable);
      var tabledata=gettabledata(node,msg);
      initTable(node,selectall,container.find('[name=table]'), tabledata, columns, function (data) {
        if (button.attr('val') == 'sys_mdm003') savedatasourse(button, node, data)

      }, function (data2) {

      }, true);
      

      buttonClick(button, node,msg);
      if (msg.result) {
        pagenation.jqPaginator('option', {
          totalCounts:tabledata.length ,
          pageSize: zy.g.page.pagesize,
          currentPage: page
        });
      } else {
        pagenation.jqPaginator('destroy');
      }
    };
    Pagination(1)
  }
  
  function buttonClick(button, node,msg) {
    button.unbind().bind('click', function () {
      if (button.attr('val') == 'sys_md_mm002') SecondModal(node,msg)
    })
  }
  
  function selectAll(button,dt,node){
    button.unbind().bind('click',function(){
      dt.find('tbody').find('tr').addClass('active');
      // window.pp=dt;
      var _param=[];
      $('.active').each(function(i,v){
          var data=dt.DataTable().row(v).data();
          if(data!=undefined) _param.push(data);
        })
      savedatasourse($('[name=savedata]'), node, _param);
    })
    
  }
  
  function gettabledata(node,msg){
    var data=[];
    var typecd=node.typecd;
    if(node.datatable=='sys_mdm003')  data=msg.result.de_data[typecd];
    
    if(node.datatable=='sys_md_mm002')  data=msg.result.ds_data[typecd];
    return data
  }
  
  function savedatasourse(button, node, data) {
    var datatree = $.fn.zTree.getZTreeObj("datalist");
    button.unbind().bind('click', function () {
      $.each(data, function (i, v) {
        
        var input = tools.label('input').attr({
          'style': 'display:none',
          'typecd': v.typecd,
          'decd': v.decd,
          '_isexist':v._isexist,
          '_existinfo':JSON.stringify(v._existinfo)
        });
        $('#de').append(input);
        var node = datatree.getNodeByParam('typecd', v.typecd, null);
        datatree.checkNode(node, true, true);
      })

      tools.msg('已保存', 's');
    })

  }

  function initTable(node,select,dt, data, columns, onfunc, offfunc, flag) {
    var columns = columns
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    if (dt.attr('en') == 'sys_mdm003'){
      checkdata();
      selectAll(select,dt,node);
    } 

    Toolbar(dt, onfunc, offfunc, flag);
    
    return dt;
  }
  
  function checkdata() {
    var children = $('#de').children();
    $.each(children, function (i, v) {
      $('table tbody tr').each(function (ii, tr) {
        $.each($(tr).children(), function (iii, td) {
          if ($(td).text() == $(v).attr('decd')) $(tr).addClass('active')
        })
      });
    })
  }

  function Toolbar(tablecontainer, onfunc, offfunc, flag) {

    tablecontainer.on('click', 'tr', function (e) {
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        if (flag) {
          if ($(this).siblings('tr.active').length == 0) {
            offfunc && offfunc();
          }
        } else {
          offfunc && offfunc();
        }
      } else {
        if (!flag) {
          tablecontainer.DataTable().$('tr.active').removeClass('active');
          $(this).addClass('active');
          onfunc && onfunc(tablecontainer.DataTable().row('.active').data());
        } else {
          $(this).addClass('active');
          var result = [];
          tablecontainer.find('tr.active').each(function () {
            var data = tablecontainer.DataTable().row($(this)).data();
            result.push(data);
          });
          onfunc&&onfunc(result);
        }
      }
    });
  }
  
  function SecondModal(node,array) {
    var container = $('#modal_container');

    function ToolBarFirst(firstT, clickFun) {
      var btn = firstT.find('[name=save]');

      btn.unbind();

      if (clickFun) {
        btn.bind('click', clickFun);
      }
    }

    function makecolumns(_arr) {
      var columns = [];
      $.each(_arr, function (i, v) {

        $.each(v, function (ii, vv) {
          var _o = {};
          _o.title = ii;
          _o.data = ii;
          columns.push(_o);
        })
      })

      return columns
    }

    function _i(Node) {

      var FirstTable = $('#tabledata [name=table]'),
        SecondTable = $('#predata [name=table]'),
        FirstToolBar = $('#tabledata [name=toolbar]'),
        SecondToolBar = $('#predata [name=toolbar]');

      _iii();

      //保存之后
      function _ii(msg) {
        var columns = makecolumns(msg);
        zy.log(columns);
        var dt = container.find('[name=secondcon]').find('[name=table]');
        SecondToolBar.find('[name=delete]').btnDisable(true);
        initTable(null,null,dt, msg, columns,
          function (data) {
            SecondToolBar.find('[name=delete]').btnDisable(false);
            ToolBarSecond(SecondToolBar, function (event) {
              if (data.length && data.length > 0) {
                var arr = [];
                $.each(msg, function (i, v) {
                  $.each(data, function (ii, vv) {
                    if (JSON.stringify(v) != JSON.stringify(vv)) arr.push(v)
                  })
                })
                container.find('[name=secondcon]').empty().append(emptyTable.clone());
                if (arr.length > 0) {
                  _ii(arr);
                  makeinput(Node, arr);
                } else {
                  $('#predata').children().hide();
                  makeinput(Node, arr);
                }
              }
            });

          }, function () {
            SecondToolBar.find('[name=delete]').btnDisable(true);
            ToolBarSecond(FirstToolBar);
          }, true);
        $('#predata').children().show();

      }

      function _iii() {
        var columns = makecolumns(array.result.table_data[0].data);
        zy.log(columns);
          FirstToolBar.find('[name=save]').btnDisable(true);
          $('#tabledata').children().show();
        initTable(null,null,FirstTable, array.result.table_data[0].data, columns,
          function (data) {
            zy.log(data);
            FirstToolBar.find('[name=save]').btnDisable(false);
          ToolBarFirst(FirstToolBar, function (event) {
            if (data.length && data.length > 0) {
              $('[href=#predata]').tab('show');
              _ii(data);
              makeinput(Node, data, true);
            }
          });
          }, function () {
            FirstToolBar.find('[name=save]').btnDisable(true);
          ToolBarFirst(FirstToolBar);
          }, true);
      }

    }

    function makeinput(Node, arr, flg) {
      window.oo=array;
      window.pp=Node;
      var input;
      if (flg) {
        input = tools.label('input').attr({
          'typecd': Node.typecd,
          'en': Node.en,
          'data': JSON.stringify(arr),
          '_isexist':array.result.ds_table[Node.typecd][0]._isexist,
          '_existinfo':JSON.stringify(array.result.ds_table[Node.typecd][0]._existinfo),
          'style': 'display:none'
        })
      } else {
        input = $('[en=' + Node.en + ']').attr({
          'data': JSON.stringify(arr),
          'typecd': Node.typecd,
          'en': Node.en,
          '_isexist':array.result.ds_table[Node.typecd][0]._isexist,
          '_existinfo':JSON.stringify(array.result.ds_table[Node.typecd][0]._existinfo),
          'style': 'display:none'
        });

        if (arr.length < 1) $('[en=' + Node.en + ']').remove()
      }


      container.find('#tablechildren').append(input);
      zy.log(input);
      zy.log(container.find('#tablechildren'));
      sbumit();
    }

    function _eachobj(arr) {
      var table_data = [];
      $.each(arr, function (i, v) {
        var obj = {};
        obj.typecd = v.typecd;
        obj.en = v.en;
        table_data.push(obj);
      })
      return table_data
    }

    function sbumit() {
      var children = container.find('#tablechildren').children();
      container.find('[name=submit]').unbind().bind('click', function () {
        $('#table_data').children().remove();
        $('#table_data').append(children);
      })
    }

    function ToolBarSecond(secondT, clickFun) {
      var btn = secondT.find('button');
      btn.unbind();
      if (clickFun) {
        btn.bind('click', clickFun);
      }
    }

    function BuildTree(data, clickfun, colorfun) {
      var tree = null;

      function click(event, treeId, treeNode, clickFlag) {
        if (!treeNode || treeNode.isParent)
          return;
        clickfun && clickfun(treeNode);
      }


      function option() {

        var o = {
          view: {
            fontCss: colorfun,
          },
          data: {
            key: {
              checked: 'checked',
              name: 'en',
              title: 'typecd'
            }
          },
          check: {
            enable: true,
            chkDisabledInherit: true,
            chkStyle: "checkbox",
            chkboxType: {
              "Y": "ps",
              "N": "ps"
            }
          },
          callback: {
            onClick: click
          }
        }

        return o;
      }

      var setting = option();

      tree = $.fn.zTree.init($("#tablelist"), setting, data);

    }

    function Color(treeId, treeNode) {
      return treeNode.exist_table ? (treeNode.table_change ? {color: "red"} : {color: "blue"} ) : {};
    }

    function TreeClick(Node) {
      $('[href=#tabledata]').tab('show');
      $('#predata').children().hide();
      _i(Node);
    }

    function InnerInit() {
      var target = container.find('.nav');
     
        // BuildTable(function (tablehander) {
          BuildTree(array.result.ds_table[node.typecd], TreeClick, Color);
        // })
      
      container.find('.modal').modal('show');
    }

    zy.net.loadHTML('Import_Export/import/h1.html', $('#modal_container'), function () {
      InnerInit();
    });
  }
  
  function noddeToApi(){
    function uinodes() {
      var uitree = $.fn.zTree.getZTreeObj("uilist");

    }

    function apinodes() {
      if($.fn.zTree.getZTreeObj("apilist")){
        var apitree = $.fn.zTree.getZTreeObj("apilist");
      var checkapi = apitree.getCheckedNodes(true);
      var items = [];
      $.each(checkapi, function (i, v) {
        var obj = {};
        obj.roleid = v.roleid;
        obj.appid = v.appid || '';
        obj.moduleid = v.moduleid || '';
        obj.apiid = v.apiid || '';
        obj.level = v.level;
        obj.contentid=v.contentid || '';
        obj._isexist = v._isexist;
        obj._existinfo = v._existinfo;
        
        items.push(obj);

      })

      return items
      }else{
        return []
      }
      
    }

    function destree() {
      var dedstree = [];
      if($.fn.zTree.getZTreeObj("datalist")){
         var datatree = $.fn.zTree.getZTreeObj("datalist");
      var nodes = datatree.getCheckedNodes(true);
      $.each(nodes, function (i, v) {
        var obj={};
        obj.typecd=v.typecd,
        obj._isexist=v._isexist,
        obj._existinfo=v._existinfo
        dedstree.push(obj)
      })

      return dedstree
      }else{
        return []
      }
     
    }

    function getde() {
      var de = [];
      var input = $('#de').children();
      $.each(input, function (i, v) {
        var obj = {};
        obj.typecd = $(v).attr('typecd');
        obj.decd = $(v).attr('decd');
        obj._isexist=JSON.parse($(v).attr('_isexist'));
        obj._existinfo=JSON.parse($(v).attr('_existinfo'));
        de.push(obj);
      })
      return de
    }

    function gettabeldata() {
      var table_data = []
      var input = $('#table_data').children();
      $.each(input, function (i, v) {
        var obj = {};
        obj.en = $(v).attr('en');
        obj.typecd = $(v).attr('typecd');
        obj.data = JSON.parse($(v).attr('data'));
        obj._isexist=JSON.parse($(v).attr('_isexist'));
        obj._existinfo=JSON.parse($(v).attr('_existinfo'));
        table_data.push(obj);
      })

      return table_data
    }

    function rolenodes() {
      if($.fn.zTree.getZTreeObj("rolelist")){
        var roletree = $.fn.zTree.getZTreeObj("rolelist");
      var checkrole = roletree.getCheckedNodes(true);
      var roles = [];
      $.each(checkrole, function (i, v) {
        var obj={};
        obj.roleid=v.roleid;
        obj._isexist = v._isexist;
        obj._existinfo = v._existinfo;
        
        roles.push(obj);
      })
      return roles
      }else{
        return []
      }
      
    }

    function modelnodes() {
      if($.fn.zTree.getZTreeObj("modellist")){
        var modeltree = $.fn.zTree.getZTreeObj("modellist");
      var checkmodel = modeltree.getCheckedNodes(true);
      var model = [];
      $.each(checkmodel, function (i, v) {
        var obj = {};
        obj.typecd = v.typecd;
        obj._isexist = v._isexist;
        obj._existinfo = v._existinfo;
        model.push(obj);
      })
      return model
      }else{
        return []
      }
      
    }

    var json = {
      'deds': {
        'dedstree': destree(),
        'de': getde()
      },
      'table_data': gettabeldata(),
      'items': apinodes(),
      'model': modelnodes(),
      'roles': rolenodes(),
      'appendices': $('[name=appendices]').val()
    }
    zy.log(json);
    
    var param={
      'filenm':$('[name=filenm]').val(),
      'json': JSON.stringify(json)
    }
    var apiinfo={
      app:'ac25e37830ec4e6cbe367a51a4005b7e',
      mod:'import',
      apinm:'import'
    }
    tools.post(apiinfo,function(mm){
      zy.log(mm);
      $.each(mm.importDetail,function(i,v){
        var section=tools.label('section').addClass('col-sm-2');
        var label=tools.label('label');
        label.html(v);
        section.append(label);
        $('[name=importDetail]').append(section);
      })
      
    },param)
  }
  
  

  loadScript("lib/js/plugin/bootstrap-wizard/jquery.bootstrap.wizard.min.js", runBootstrapWizard);

  function runBootstrapWizard() {
    init();

    $('#rootwizard').bootstrapWizard({

      onTabShow: function (tab, navigation, index) {
        navigation.removeClass('nav nav-pills');
        var $total = navigation.find('li').length;
        var $current = index + 1;
        var $percent = ($current / $total) * 100;
        $('#rootwizard').find('.bar').css({width: $percent + '%'});

        if ($current >= $total) {
          $('#rootwizard').find('.pager .pull-right').hide();
          $('#rootwizard').find('.pager .finish').show();
          $('#rootwizard').find('.pager .finish').removeClass('disabled');
        } else {
          $('#rootwizard').find('.pager .pull-right').show();
          $('#rootwizard').find('.pager .finish').hide();
        }

      },

      onTabClick: function (tab, navigation, index) {
        return false;
      }

    });

    $('#rootwizard .finish').click(function () {
      noddeToApi();
    });

    $('[name=nexttab]').click(function () {

      $('#rootwizard').bootstrapWizard('next');
    });

  }
})();