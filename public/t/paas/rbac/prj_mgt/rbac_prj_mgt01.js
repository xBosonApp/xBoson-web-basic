var rbac_prj_mgt07_cache = {};
var rbac_prj_mgt09_cache = {};
var rbac_prj_mgt11_cache = {};

(function () {
  var _domLabel = {
    prjappmaint: {
      add: [{
        name: '应用名称',
        type: 'input',
        id: 'appnm',
        write: true,
        width: 6
      }, {
        name: '应用状态',
        type: 'select2',
        id: 'status',
        write: true,
        width: 6
      }, {
        name: '应用说明',
        type: 'textarea',
        id: 'about',
        write: true,
        width: 12
      }],
      edit: [{
        name: '应用ID',
        id: 'appid',
        type: 'input',
        write: false,
        width: 6
      }, {
        name: '应用名称',
        type: 'input',
        write: true,
        id: 'appnm',
        width: 6
      }, {
        name: '应用状态',
        type: 'select2',
        id: 'status',
        write: true,
        width: 6
      }, {
        name: '创建时间',
        type: 'input',
        id: 'createdt',
        write: false,
        width: 6
      }, {
        name: '修改时间',
        type: 'input',
        id: 'updatedt',
        write: false,
        width: 6
      }, {
        name: '应用说明',
        type: 'textarea',
        id: 'about',
        write: true,
        width: 12
      }]
    },
    prjmodmaint: {
      add: [{
        name: '业务ID',
        id: 'moduleid',
        type: 'input',
        write: true,
        width: 6
      }, {
        name: '业务名称',
        type: 'input',
        id: 'modulenm',
        write: true,
        width: 6
      }, {
        name: '业务状态',
        id: 'status',
        type: 'select2',
        write: true,
        width: 6
      }, {
        name: '业务说明',
        type: 'textarea',
        id: 'about',
        write: true,
        width: 12
      }],
      edit: [{
        name: '业务ID',
        type: 'input',
        id: 'moduleid',
        write: false,
        width: 6
      }, {
        name: '业务名称',
        type: 'input',
        id: 'modulenm',
        write: true,
        width: 6
      }, {
        name: '业务状态',
        type: 'select2',
        id: 'status',
        write: true,
        width: 6
      }, {
        name: '创建时间',
        type: 'input',
        id: 'createdt',
        write: false,
        width: 6
      }, {
        name: '修改时间',
        type: 'input',
        id: 'updatedt',
        write: false,
        width: 6
      }, {
        name: '业务说明',
        type: 'textarea',
        id: 'about',
        write: true,
        width: 12
      }]
    },
    prjapimaint: {
      add: [{
        name: 'API ID',
        id: 'apiid',
        type: 'input',
        write: true,
        width: 6
      }, {
        name: 'API 名称',
        id: 'apinm',
        type: 'input',
        write: true,
        width: 6
      }, {
        name: 'API 状态',
        type: 'select2',
        id: 'status',
        write: true,
        width: 6
      }],
      edit: [{
        name: 'API ID',
        type: 'input',
        id: 'apiid',
        write: false,
        width: 6
      }, {
        name: 'API 名称',
        type: 'input',
        id: 'apinm',
        write: true,
        width: 6
      }, {
        name: 'API 状态',
        id: 'status',
        type: 'select2',
        write: true,
        width: 6
      }, {
        name: '创建时间',
        id: 'createdt',
        type: 'input',
        write: false,
        width: 6
      }, {
        name: '修改时间',
        id: 'updatedt',
        type: 'input',
        write: false,
        width: 6
      }]
    }
  };

  var widPath = 'rbac/prj_mgt/rbac_prj_mgt02.htm';
  var addPrjPath = 'rbac/prj_mgt/rbac_prj_mgt03.htm';
  var apiModalPath = 'rbac/prj_mgt/rbac_prj_mgt05.htm';
  var userModalPath = 'rbac/prj_mgt/rbac_prj_mgt06.htm';
  var apiStatusPath = 'rbac/prj_mgt/rbac_prj_mgt04.htm';
  var menuPath = 'rbac/prj_mgt/rbac_prj_mgt07.htm';
  var pagePath = 'rbac/prj_mgt/rbac_prj_mgt11.htm';

  function innerEvent(container, projectObject) {
    // 菜单tab初始化
    function menu() {
      if (rbac_prj_mgt07_cache[projectObject.prjid]) {
        return;
      }
      var target = container.find('#prj_menu').attr('id', 'prj_menu' + projectObject.prjid);
      zy.net.loadHTML(menuPath + '?prjid=' + projectObject.prjid, target);
    }

    // 页面tab初始化
    function page() {
      if (rbac_prj_mgt11_cache[projectObject.prjid]) {
        return;
      }
      var target = container.find('#prj_page').attr('id', 'prj_page' + projectObject.prjid);
      zy.net.loadHTML(pagePath + '?prjid=' + projectObject.prjid, target);
    }

    // 项目组成员
    function roleGroup() {
      var target = container.find('#rolegroup').attr('id', 'rolegroup' + projectObject.prjid);
      if (target.children().length === 0){
        zy.extend.get({
          apinm: 'prjugusers',
          mod: 'XMGL',
          app: '03229cbe4f4f11e48d6d6f51497a883b'
        }, function (msg) {
          buildTree(target, {name: 'de0201039', title: 'userid'}, msg.result, projectObject);
        }, {ugid: projectObject.ugid});
      }
    }

    // API 列表
    function apiList() {
      var target = container.find('#apilist').attr('id', 'apilist' + projectObject.prjid);
      if (target.children().length === 0) {
        buildTree(target, {name: 'appnm', title: 'showid'}, null, projectObject, function (_t) {
          container.find('#up').unbind('click').click(function (event) {
            var $this = $(this);
            zy.net.loadHTML(apiStatusPath, $('#modal_container'), function () {
              $('#modal_container').find('.modal').modal('show');
              apiStatus($this.attr('id'), $('#modal_container'), _t);
            });
          });

          container.find('#down').unbind('click').click(function (event) {
            var $this = $(this);
            zy.net.loadHTML(apiStatusPath, $('#modal_container'), function () {
              $('#modal_container').find('.modal').modal('show');
              apiStatus($this.attr('id'), $('#modal_container'), _t);
            });
          });

          container.find('#redit').unbind('click').click(function (event) {
            var $this = $(this);
            zy.net.loadHTML(apiStatusPath, $('#modal_container'), function () {
              $('#modal_container').find('.modal').modal('show');
              apiStatus($this.attr('id'), $('#modal_container'), _t);
            });
          });
        });
      }
    }

    function apiStatus(id, container, _t) {
      function tree(data) {
        container.find('#empty').hide();
        var tree = null;
        if (!$.isArray(data)) return null;
        var target = container.find('.ztree');

        function handerData() {
          function each(o) {
            if (!tt[o.id]) {
              result.push(o);
              tt[o.id] = true;
              if (match[o.pid]) each(match[o.pid]);
            }
          }

          var result = [], match = {}, tt = {};
          $.each(data, function (i, v) {
            match[v.id] = v;
          });

          var i = 0;
          $.each(data, function (i, v) {
            var t = v.id.split('--');
            if (t.length == 3) {
              each(v);
              i++;
            }
          });
          return result;
        }

        var setting = {
          view: {
            dblClickExpand: false
          },
          data: {
            key: {
              name: "name",
              title: "id"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid"
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
          }
        };

        var nodes = handerData();
        var flg = true;
        tree = $.fn.zTree.init(target, setting, nodes);

        if (nodes.length === 0) {
          container.find('#empty').show();
          flg = false;
        }

        Event(tree, flg);
      }

      function Event(tree, flag) {
        container.find('[name=submit]').unbind('click').click(function (event) {
          var nodos = tree.getNodesByFilter(function (node) {
            return node.level == 2 && node.checked;
          });

          if (nodos.length > 0) {
            zy.extend.get({
              app: '03229cbe4f4f11e48d6d6f51497a883b',
              mod: 'yyxxgl',
              apinm: config[id].editApi
            }, function (msg) {
              zy.extend.msg('成功', 's');
              buildTree(_t, {name: 'appnm', title: 'showid'}, null, projectObject);
              container.find('.modal').modal('hide');
            }, {
              roleid: projectObject.roleid,
              nodesRes: $.map(nodos, function (v) {
                return v.id;
              }).join(',')
            });
          } else {
            if (flag) zy.extend.msg('请至少选择一个API', 'i');
            else container.find('.modal').modal('hide');
          }
        });
      }

      if (!id)return null;

      var config = {
        app: '03229cbe4f4f11e48d6d6f51497a883b',
        mod: 'XMGL',
        up: {
          treeApi: 'prjapiuptree',
          editApi: 'api_manage_up',
          title: '待上线'
        },
        down: {
          treeApi: 'prjapidowntree',
          editApi: 'api_manage_down',
          title: '待下线'
        },
        redit: {
          treeApi: 'prjapidevtree',
          editApi: 'api_manage_dev',
          title: '待转开发'
        }
      };

      container.find('h4').html(config[id].title);

      zy.extend.post({
        app: config.app,
        mod: config.mod,
        apinm: config[id].treeApi
      }, function (msg) {
        tree(msg.result);
      }, {
        prjid: projectObject.prjid
      });
    }

    container.find('#edit_project').click(function (e) {
      zy.net.loadHTML(addPrjPath, $('#modal_container'), function () {
        var _modal = $('#modal_container').find('.modal');
        _modal.find('.modal-title').html('修改项目');

        
        zy.cache.initDicts('ZR.0001', function () {
          var _in = _modal.find("input[name=status]");
          _in.zySelect('ZR.0001', false, { allowClear: false, width: '100%' });
          _in.select2('val', '1');
          _modal.find('form').json2form(projectObject);
          _modal.find('input[name=prj_path]').prop('readonly',true);
          // // 项目组 select 2 初始化
          // zy.extend.get({
          //   apinm: 'ugs',
          //   app: '03229cbe4f4f11e48d6d6f51497a883b',
          //   mod: 'XMGL'
          // }, function (msg) {
          //   _modal.find("input[name=ugid]").zySelectCustomData(null, false, { allowClear: true, width: '100%' },msg.result);
          //   _modal.find('form').json2form(projectObject);
          //   _modal.find('input[name=prj_path]').prop('readonly',true);
          //   _modal.find('input[name=ugid]').prop('readonly',true);
          // });
        });

        _modal.find('[name=add]').unbind('click').click(function (e) {
          zy.extend.get({
            apinm: 'projects',
            app: '03229cbe4f4f11e48d6d6f51497a883b',
            mod: 'XMGL'
          }, function (msg) {
            _modal.modal('hide');
            zy.extend.msg('修改成功', 's');
            $('#widget-grid').empty();
            init();
          }, $.extend({prjid: projectObject.prjid, 'action': 'update'}, _modal.find('form').form2json()));
        });
        _modal.modal('show');
      });
    });

    container.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).closest('li');
      if (target.index() == 1)apiList();
      if (target.index() == 2)menu();
      if (target.index() == 3)page();
      if (target.index() == 4)roleGroup();
    });
    
    
    init_tab6();
    function init_tab6(){
      zy.cache.initDicts('ZR.0030',function(){
        container.find("[name=apizt]").each(function(){
          $(this).zySelect('ZR.0030',false,{width:'100%'});
        });
      });
      container.find(".table-responsive").attr('id','table-responsive'+projectObject.prjid);
      container.find("#prj_api_history_pagination").attr('id','pagination'+projectObject.prjid);
      var _now = new Date();
      container.find('[name=dtstart]').datetimepicker({
        language:'zh-CN',
        format:'yyyy-mm-dd hh:ii:ss',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
      }).datetimepicker('setDate',new Date(_now.getFullYear(),_now.getMonth()-1,_now.getDate()));
      container.find('[name=dtend]').datetimepicker({
        language:'zh-CN',
        format:'yyyy-mm-dd hh:ii:ss',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
      }).datetimepicker('setDate',_now);
      container.find('#tab-r6-query').unbind().bind("click", function() {
        czjlPagination(1);
      });
      function czjlPagination(page){
        var query_form = container.find('#rbac_prj_mgt02r6_form');
        var dtable = container.find('[name=prj_api_history_table]');
        
        $.jqPaginator('#pagination'+projectObject.prjid, {
          totalCounts: 1,
          pageSize: 10,
          currentPage: page,
          onPageChange: function(num) {
            zy.g.am.app = "03229cbe4f4f11e48d6d6f51497a883b";
            zy.g.am.mod = "yyxxgl";
            zy.g.am.prjid = projectObject.prjid;
            zy.g.am.pagesize = 10;
            zy.net.get("api/api_history_list", function(msg){
              if(msg){
                //预设初始化参数
                var options = {
                  "data": msg.result,
                  "columns": [
                    {"title":"app名称","data": "appnm"},
                    {"title":"模块名称","data": "modnm"},
                    {"title":"api名称","data": "apinm"},
                    {
                      "title":"操作类型",
                      "render": function(data, type, row, meta) {
                        return zy.cache.cd2name("ZR.0030", row.stability);
                      }
                    },
                    {"title":"平台用户ID","data": "userid"},
                    {"title":"修改时间","data": "updatedt"}
                  ],
                };
                // 合并初始化参数选项
                $.extend(options, zy.ui.dataTable);
                //初始化 DataTable
                dtable.dataTable(options);
                 
                container.find(".dataTables_scroll").css("clear","none");
                if (msg.count >= 0) {
                  container.find('[name=total_count]').html('总数：'+msg.count)
                  container.find('#pagination'+projectObject.prjid).jqPaginator('option', {
                    totalCounts: msg.count,
                    pageSize: 10,
                    currentPage: num
                  });
                } else {
                  container.find('#pagination'+projectObject.prjid).jqPaginator('destroy');
                }
                
              }
            }, query_form.serialize(), num);
          }
        });
      }
    }
  }

  function enableJ(target) {
    target.jarvisWidgets({
      grid: 'article',
      widgets: '.jarviswidget',
      localStorage: true,
      deleteSettingsKey: '#deletesettingskey-options',
      settingsKeyLabel: '重置设置?',
      deletePositionKey: '#deletepositionkey-options',
      positionKeyLabel: '重置位置?',
      sortable: true,
      buttonsHidden: false,

      // toggle button
      toggleButton: true,
      toggleClass: 'fa fa-minus | fa fa-plus',
      toggleSpeed: 200,
      onToggle: function () {
      },
      // delete btn
      deleteButton: false,
      deleteClass: 'fa fa-times',
      deleteSpeed: 200,
      onDelete: function () {
      },
      // edit btn
      editButton: true,
      editPlaceholder: '.jarviswidget-editbox',
      editClass: 'fa fa-cog | fa fa-save',
      editSpeed: 200,
      onEdit: function () {
      },
      // color button
      colorButton: true,
      // full screen
      fullscreenButton: true,
      fullscreenClass: 'fa fa-expand | fa fa-compress',
      fullscreenDiff: 3,
      onFullscreen: function () {
        // 重画 DataTable以使table宽度自适应
        if (rbac_prj_mgt11_cache){
          $.each(rbac_prj_mgt11_cache,function(i,v){
            var rowIdx = v.v.dt.DataTable().row('.active').index();
            v.DataTable(v.v.dt.DataTable().rows( {page:'current'} ).data());
            v.v.dt.DataTable().rows(rowIdx).nodes().to$().trigger('click');
          });
        }
      },
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
      dragHandle: '> header',
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
      afterLoad: function () {
      },
      rtl: false, // 暂时不能切换!
      onChange: function () {
      },
      onSave: function () {
      },
      ajaxnav: $.navAsAjax // 应当保存在本地存储里 localstorage
    });
  }

  // 处理项目列表数据，初始化 widget
  function HandleData(Array) {
    if ($.isArray(Array)) {
      var cb = zy.extend.async(Array.length);
      var done = cb(function (result) {
        var container = $('#widget-grid');
        enableJ(container);
      });
      $.each(Array, function (i, v) {
        buildDom(v, done);
      });
    }
  }

  function buildDom(projectObject, callback) {
    var container = $('#widget-grid');
    function HandleDom(cb) {
      // 项目基本信息 tab 内容
      function info(article) {
        article.find('#projectName').html(projectObject.prjnm);
        article.find('#projectDe').html(projectObject.mark === '' ? '<br>' : projectObject.mark);
        article.find('#createdt').html(projectObject.createdt.replace(/\.0/g, ''));
      }

      function newDom(article) {
        var target = article.find('.tabs-left');
        var li_a = target.children('ul');
        var tab_content = target.children('div').children();

        li_a.children().each(function (i) {
          var $this = $(this).find('a');
          var $that = $(tab_content[i]);
          var newid = zy.extend.random();
          $this.attr('href', '#' + newid);
          $that.attr('id', newid);
        });
      }

      var rows = container.children();
      if (rows.length === 0) {
        var row = $('<div>').addClass('row');
        container.append(row);
        rows = container.children();
      }

      var article = $('<article>').addClass('col-xs-12 col-sm-12 col-md-12 col-lg-12');
      zy.net.loadHTML(widPath, article, function () {
        rows.append(article);
        info(article);
        newDom(article);
        innerEvent(article.find('.jarviswidget'), projectObject);
        // enableJ(container,projectObject);
        cb && cb(article);
      });
    }

    HandleDom(function (at) {
      var header = at.find('header:has(h2)');
      header.children('h2').text(projectObject.prjnm);
      callback && callback(projectObject.roleid, projectObject);
    });
  }

  function buildTree(c, info, data, project, cb) {
    var _tree = null;
    function _fromServer(_id, _cb, _flag) {
      var _f = true;
      if (typeof _flag !== 'undefined')
        _f = _flag;

      function _children(_arr) {
        $.each(_arr, function (_i, _v) {
          _v.isParent = true;
        });
      }

      zy.extend.get({
        mod: 'XMGL',
        app: '03229cbe4f4f11e48d6d6f51497a883b',
        apinm: 'prjapis'
      }, function (msg) {
        var _result = msg;
        if (!_result.value)
          return;
        if (_f)
          _children(_result.value);
        _cb && _cb(_result.value);
      }, {id: _id, prjid: project.prjid});
    }

    function setting() {
      function _expand(_e, _id, _node) {
        var _flg = _node.moduleid ? false : true;
        if (!_node.children)
          _fromServer(_node.someid, function (_m) {
            var _result = _m;
            if (_node.contentid)
              $.each(_result, function (_i, _v) {
                _v.appnm = _v.appnm.replace(/(.0)$/g, '');
              });
            _node.children = _result;
            _tree.refresh();
          }, _flg);
      }

      function _addHoverDom(_id, _node) {
        var check = $('#' + _node.tId).closest('div.tab-pane').index();
        var sObj = $("#" + _node.tId + "_span");
        if (_node.editNameFlag || $("#addBtn_" + _node.tId).length > 0 || $("#editBtn_" + _node.tId).length > 0 || $("#remBtn_" + _node.tId).length > 0)
          return;
        var addStr = "<span class='button add' id='addBtn_" + _node.tId + "' title='添加' onfocus='this.blur();'></span>";
        var editStr = "<span class='button edit' id='editBtn_" + _node.tId + "' title='修改' onfocus='this.blur();'></span>";
        var remStr = "<span class='button remove' id='remBtn_" + _node.tId + "' title='删除' onfocus='this.blur();'></span>";

        //API管理
        if (check == 1) {
          if (_node.isParent)sObj.after(addStr);
          if (_node.level != 0) sObj.after(editStr);
          if ((_node.level == 1 || _node.level == 2) && (!_node.children)) sObj.after(remStr);
          //添加
          $('#addBtn_' + _node.tId).bind("click", function () {
            _tree.selectNode(_node);
            _addModal(_node);
            return false;
          });
          //删除
          $('#remBtn_' + _node.tId).bind("click", function () {
            var del_apinm = '';
            if (_node.level == 1) {
              del_apinm = 'prjappmaint';
            } else if (_node.level == 2) {
              del_apinm = 'prjmodmaint';
            }
            zy.ui.mask('提示', '确定删除?', function () {
              zy.extend.get({
                apinm: del_apinm,
                app: '03229cbe4f4f11e48d6d6f51497a883b',
                mod: 'XMGL'
              }, function (msg) {
                zy.extend.msg('删除成功', 's');
                _tree.removeNode(_node);
              }, {
                type: '2',
                appid: _node.appid,
                moduleid: _node.moduleid,
                prjid: project.prjid
              }, function (msg) {
                zy.extend.msg(msg.msg, 'w');
              });
            }, function () {
            });
          });
          //修改
          $('#editBtn_' + _node.tId).bind('click', function () {
            _tree.selectNode(_node);
            _editModal(_node);
            return false;
          });
        }
        //人员管理
        else if (check == 4) {
          if (_node.isParent)sObj.after(addStr);
          if (_node.level !== 0) sObj.after(remStr);
          //添加
          $('#addBtn_' + _node.tId).bind("click", function () {
            _tree.selectNode(_node);
            _addUser(_node);
            return false;
          });
          //删除
          $('#remBtn_' + _node.tId).bind("click", function () {
            zy.ui.mask('提示', '确定要将 ' + _node.de0201039 + ' 移出项目?', function () {
              zy.extend.get({
                apinm: 'prjuserop',
                app: '03229cbe4f4f11e48d6d6f51497a883b',
                mod: 'XMGL'
              }, function (msg) {
                zy.extend.msg('删除成功', 's');
                _tree.removeNode(_node);
              }, {
                action: 'delete',
                userid: _node.userid,
                ugid: project.ugid
              }, function (msg) {
                zy.extend.msg(msg.msg, 'w');
              });
            }, function () {
            });
          });
        }
      }

      function _removeHoverDom(_id, _node) {
        $("#addBtn_" + _node.tId).unbind().remove();
        $("#editBtn_" + _node.tId).unbind().remove();
        $("#remBtn_" + _node.tId).unbind().remove();
      }

      return {
        view: {
          showTitle: true,
          selectedMulti: false,
          showIcon: true,
          dblClickExpand: false,
          addHoverDom: _addHoverDom,
          removeHoverDom: _removeHoverDom
        },
        data: {
          key: info,
          simpleData: {
            enable: false
          }
        },
        callback: {
          onExpand: _expand
        }
      };
    }

    function _paramObject(_form) {
      var _o = {};
      var _area = _form.find('textarea');
      _form.find('input').each(function (_i, _v) {
        if (!$(_v).attr('role'))
          _o[$(_v).attr('name')] = $(_v).val();
      });

      delete _o['createdt'];
      delete _o['updatedt'];
      _o[_area.attr('name')] = _area.val();
      return _o;
    }

    function _checkLevel(_node, _flg) {
      if (!_node.appid)
        return 'prjappmaint';
      if (!_node.moduleid)
        return _flg ? 'prjappmaint' : 'prjmodmaint';
      if (_node.apiid && _node.contentid)
        return 'prjapimaint';
      if (_node.moduleid && !_node.apiid)
        return _flg ? 'prjmodmaint' : 'prjapimaint';
      if (_node.apiid && _node.hisid)
        return 'prjhismaint';
    }

    function _initEvent(_form, _node, _flg) {
      function _checkContent(_form) {
        var _flg = true;
        _form.children().find('input').each(function (_i, _v) {
          if ($(_v).attr('name') && $(_v).attr('name') !== 'updatedt' && $(_v).attr('name') !== 'createdt' && $(_v).val() === '') {
            zy.ui.msg('提示', $(_v).attr('placeholder') + '不可为空', 'w');
            _flg = false;
            return false;
          }
        });
        return _flg;
      }

      var _jq = _form;
      if (_flg) {
        if (_node.isParent) {
          $.each(_node, function (_i, _v) {
            var _t = _jq.find('[name=' + _i + ']');
            if (_t.length > 0) {
              if (_t.hasClass('select2-offscreen'))
                _t.select2('val', _v);
              else
                _t.val(_v.replace(/\.0/g, ''));
            }
          });
        } else {
          var _t = {
            appid: _node.appid,
            moduleid: _node.moduleid,
            apiid: _node.apiid
          };
          zy.g.am.app = 'ZYAPP_IDE';
          zy.g.am.mod = 'ZYMODULE_IDE';
          zy.net.get('api/getapiinfo', function (msg) {
            $.each(msg.result[0], function (_i, _v) {
              var _t = _jq.find('[name=' + _i + ']');
              if (_t.length > 0) {
                if (_t.hasClass('select2-offscreen'))
                  _t.select2('val', _v);
                else
                  _t.val(_v.replace(/\.0/g, ''));
              }
            });
          }, _t, null, function (msg) {
            zy.log(msg);
          });
        }
      }

      var _btn = _jq.find('[name=ide_submit]');
      _btn.unbind().click(function () {
        if (!_checkContent(_form))
          return;
        var _type = $(this).closest('.modal-content').find('h4').text() === '修改' ? 1 : 0;
        var _t = {
          type: _type,
          prjid: project.prjid
        };
        if (_node.appid)
          _t.appid = _node.appid;
        if (_node.moduleid)
          _t.moduleid = _node.moduleid;

        zy.extend.post({
          apinm: _checkLevel(_node, Boolean(_type)),
          mod: 'XMGL',
          app: '03229cbe4f4f11e48d6d6f51497a883b'
        }, function (msg) {
          if (Boolean(_type)) {
            $.extend(true, _node, msg.result[0]);
            _tree.refresh();
          } else _tree.addNodes(_node, msg.result[0]);
          zy.ui.msg('提示信息', '成功', 's');
          $('.modal').modal('hide');
        }, $.extend(true, {}, _t, _paramObject(_form)));
      });
    }

    function _form(_c, _arr) {
      var _t = $.extend(true, {}, _arr);
      var _result = _list(_t);

      function _footer(_form) {
        var _footer = zy.extend.label('footer');
        var _btnC = zy.extend.label('button').addClass('btn btn-default').attr('data-dismiss', 'modal').html('取消');
        var _btnS = zy.extend.label('button').addClass('btn btn-primary').attr('name', 'ide_submit').html('确定');
        _footer.append(_btnC).append(_btnS);
        _form.append(_footer);
      }

      function _list(_arr) {
        var _half = [], _full = [], _dt = [];
        $.each(_arr, function (_i, _n) {
          if (_n.width === 12)
            _full.push(_n);
          else {
            if (_n.id === 'createdt' || _n.id === 'updatedt')
              _dt.push(_n);
            else
              _half.push(_n);
          }
        });
        return {
          half: _half,
          full: _full,
          time: _dt
        };
      }

      function _section(_obj) {
        if (_obj.width !== 12)
          var _section = zy.extend.label('section').addClass('col col-' + _obj.width);
        else
          var _section = zy.extend.label('section');
        var _labelnm = zy.extend.label('label').addClass('label').html(_obj.name);
        if (_obj.type === 'textarea') {
          var _labelcon = zy.extend.label('label').addClass('textarea has-warning');
          var _input = zy.extend.label('textarea').attr('name', _obj.id).attr('placeholder', _obj.name);
        } else {
          var _labelcon = zy.extend.label('label').addClass('input has-warning');
          var _input = zy.extend.label('input').attr('name', _obj.id).attr('type', _obj.type).attr('placeholder', _obj.name);
        }
        if (_input.attr('type') === 'select2')
          _input.attr('type', 'input');
        if (!_obj.write)
          _input.attr('readonly', 'readonly');
        var _b = zy.extend.label('b').addClass("tooltip tooltip-bottom-right").html(_obj.name + '为必填项');
        _labelcon.append(_input).append(_b);
        _section.append(_labelnm).append(_labelcon);
        return _section;
      }

      function _check(_num) {
        var _t = _num / 2;
        return Math.round(_t) === _t;
      }

      function _select2(_arr) {
        $.each(_arr, function (_i, _v) {
          if (_v.id === 'status')
            zy.cache.initDicts('ZR.0001', function () {
              _form.find('[name=' + _v.id + ']').zySelect('ZR.0001', false, { allowClear: false, width: '100%' });           _form.find('[name=' + _v.id + ']').select2('val', '1');
            });
        });
      }

      var _form = zy.extend.label('form').attr('onsubmit', 'return false;').addClass('smart-form');
      var fieldset = $('<fieldset>');
      _form.append(fieldset);

      $.each(_result.half, function (_i, _v) {
        var _n = _i / 2;
        if (_check(_i)) {
          var _row = zy.extend.label('div').addClass('row');
          _form.children().append(_row);
        } else {
          _n -= 0.5;
        }
        _form.find('div').eq(_n).append(_section(_v));
      });

      var _row = null;
      $.each(_result.time, function (_i, _v) {
        var _n = _i / 2;
        if (_check(_i)) {
          _row = zy.extend.label('div').addClass('row');
        } else {
          _n -= 0.5;
        }
        _row.append(_section(_v));
        _form.children().append(_row);
        var textatra = $('<textarea>').attr('style', 'display:none').attr('name', 'help_info');
        fieldset.append(textatra);
      });

      $.each(_result.full, function (_i, _v) {
        _form.children().append(_section(_v));
      });

      _footer(_form);
      _select2(_t);
      _c.append(_form);
    }

    function _addUser(node) {
      zy.net.loadHTML(userModalPath, $('#modal_container'), function () {
        $('#modal_container').find('.modal').modal('show');
        var container = $('#modal_container');
        container.find('#confirm_btn').btnDisable(true);
        var dt = $('#search_user_dt');
        zy.cache.initDicts('GBT.2261.1', function () {
          $('#search_user_form input[name=de0201040]').zySelect('GBT.2261.1', true, { allowClear: false, width: '100%' });
        });

        DataTable();
        Toolbar();

        function DataTable(data) {
          var columns = [{
            "data": "userid"
          }, {
            "data": "de0201039"
          }, {
            "render": function (data, type, row, meta) {
              return zy.cache.cd2name('GBT.2261.1', row.de0201040);
            }
          }, {
            "data": "de0201010"
          }, {
            "data": "de0201012"
          }];
          //预设初始化参数
          var options = {
            "data": data,
            "columns": columns
          };
          // 合并初始化参数选项
          $.extend(options, zy.ui.dataTable);
          dt.dataTable(options);
          $('.dataTables_scrollHeadInner').css('width', '100%');
          $('.dataTables_scrollBody table').css('width', '100%');
          $('.dataTables_scrollHeadInner table').css('width', '100%');
        }

        function Toolbar() {
          // 单击事件
          dt.on('click', 'tr', function (e) {
            // 当前选择行 index
            if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
              return false;
            // 变换选择行状态颜色
            if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
              $(this).removeClass('active');
              $('#confirm_btn').btnDisable(true);
            } else {
              $(this).addClass('active');
              $('#confirm_btn').btnDisable(false);
            }
          });

          //关闭
          $('#close_btn').click(function () {
            $('#search_user').modal('hide');
          });

          //查询
          $('#search_btn').click(function () {
            conditions = $('#search_user_form').serialize();
            $('.dataTables_wrapper').removeAttr('style');
            $('#confirm_btn').btnDisable(true);
            $('#search_btn').button('loading');
            Pagination(1);
          });

          //确认选择
          $('#confirm_btn').click(function () {
            var useridList = [];
            container.find('tr.active').each(function (i) {
              var $this = $(this);
              var data = dt.DataTable().row($this).data();
              useridList.push(data.userid);
            });

            zy.extend.get({
              app: '03229cbe4f4f11e48d6d6f51497a883b',
              mod: 'XMGL',
              apinm: 'prjuserop'
            }, function (msg) {
              $('#search_user').modal('hide');
              _tree.addNodes(node, msg.result);
              zy.extend.msg('添加成功', 's');
            }, {
              action: 'add',
              ugid: project.ugid,
              userid: useridList.join(',')
            });
          });

          //手动输入
          $('#cancel_btn').click(function () {
            $('#search_user').modal('hide');
          });
        }

        function Pagination(page) {
          $.jqPaginator('#search_user_pagination', {
            totalCounts: 1,
            pageSize: 5,
            currentPage: page,
            onPageChange: function (num) {
              SetDt(num);
            }
          });
        }

        function SetDt(page) {
          var cb = function (msg) {
            $('#search_btn').button('reset');
            if (msg) {
              $('#confirm_btn').btnDisable(true);
              DataTable(msg.result);
              if (msg.count > 0 && msg.result.length > 0) {
                $('#search_user_pagination').jqPaginator('option', {
                  totalCounts: msg.count,
                  pageSize: 5,
                  currentPage: page
                });
              } else {
                $('#search_user_pagination').jqPaginator('destroy');
              }
            }
          };
          zy.g.am.pagesize = 5;
          zy.g.am.app = 'd2c8511b47714faba5c71506a5029d94';
          zy.g.am.mod = 'personalinfo';
          zy.net.get("api/personalselect2", cb, $('#search_user_form').form2json(), page, function (msg) {
            zy.extend.msg('选择的用户已在项目中', 'i');
          });
        }
      });
    }

    function _editModal(_node) {
      zy.net.loadHTML(apiModalPath, $('#modal_container'), function () {
        var _level = _checkLevel(_node, true);
        var _head = $('#ide_edit .modal-title');
        _head.html('修改');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();

        _form($('#ide_edit .modal-body'), _domLabel[_level].edit);
        $('#ide_edit').modal('show');
        _initEvent($('#ide_edit').find('form'), _node, true);
        if (_level == 'api')
          api_help.button(_jq.find('fieldset'), $('#modal_container2'), $(_jq.find('textarea')[0]), _node);
      });
    }

    function _addModal(_node) {
      zy.net.loadHTML(apiModalPath, $('#modal_container'), function () {
        var _level = _checkLevel(_node, false);
        var _head = $('#ide_edit .modal-title');
        _head.html('新增');
        var _jq = $('#ide_edit .modal-body');
        _jq.empty();

        _form($('#ide_edit .modal-body'), _domLabel[_level].add);
        $('#ide_edit').modal('show');
        _initEvent($('#ide_edit').find('form'), _node, false);

        var textatra = $('<textarea>').attr('style', 'display:none').attr('name', 'help_info');
        _jq.find('fieldset').append(textatra);
        if (_level == 'api')
          api_help.button(_jq.find('fieldset'), $('#modal_container2'), _jq.find('textarea'), _node);
      });
    }

    if (data) {
      _tree = $.fn.zTree.init(c, setting(), [{
        de0201039: project.prjnm,
        isParent: true,
        children: data,
        open: true
      }]);
      return null;
    } else {
      _fromServer('', function (_m) {
        var _result = [{
          isParent: true,
          appnm: project.prjnm,
          children: _m,
          open: true
        }];
        _tree = $.fn.zTree.init(c, setting(), _result);
      });
    }
    cb && cb(c);
  }

  function Event() {
    $('#add_project').unbind('click').click(function (event) {
      zy.net.loadHTML(addPrjPath, $('#modal_container'), function () {
        var _modal = $('#modal_container').find('.modal');

        zy.cache.initDicts('ZR.0001', function () {
          var _in = _modal.find("input[name=status]");
          _in.zySelect('ZR.0001', false, { allowClear: false, width: '100%' });
          _in.select2('val', '1');
        });

        // // 项目组 select 2 初始化
        // zy.extend.get({
        //   apinm: 'ugs',
        //   app: '03229cbe4f4f11e48d6d6f51497a883b',
        //   mod: 'XMGL'
        // }, function (msg) {
        //   _modal.find("input[name=ugid]").zySelectCustomData(null, false, { allowClear: true, width: '100%' },msg.result);
        // });

        _modal.find('[name=add]').unbind('click').click(function (e) {
          zy.extend.get({
            apinm: 'projects',
            app: '03229cbe4f4f11e48d6d6f51497a883b',
            mod: 'XMGL'
          }, function (msg) {
            _modal.modal('hide');
            zy.extend.msg('添加成功', 's');
            $('#widget-grid').empty();
            init();
          }, $.extend(true, {'action':'add'}, _modal.find('form').form2json()));
        });

        _modal.modal('show');
      });
    });
  }
  
  // 初始化获取当前用户项目列表
  function init() {
    zy.extend.get({
      apinm: 'projects',
      mod: 'XMGL',
      app: '03229cbe4f4f11e48d6d6f51497a883b'
    }, function (msg) {
      HandleData(msg.result);
    }, {'action':'get'});
  }

  Event();
  init();
})();