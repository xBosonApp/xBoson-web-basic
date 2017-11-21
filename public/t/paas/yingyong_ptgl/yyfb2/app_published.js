/**
 * APP表管理
 * @class APPview
 */
APPview = (function () {

  var PT = APPview.prototype;
  var thiz;
  var conditions;

  /**
   * 默认配置参数
   * @attribute _g;
   * @private
   */
  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    curpage: 1 //当前页
  };

  //表格元素对象
  var dt = $('#app_view_dt');
  var selectedRoles = [];

  function postForm(apinm, form, callback, error) {
    //设置Url及参数
    var _l = 'http://' + location.host + '/api/' + apinm + '?' + zy.net.parseParam(zy.g.comm);
    form.ajaxSubmit({
      url: _l,
      type: "post",
      async: false,
      timeout: 10000,
      cache: false,
      dataType: "json",
      success: function (msg) {
        if (msg.ret == '0') {
          callback && callback(msg);
        } else {
          zy.ui.msg("提示: ", '接口异常', "e");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (textStatus == "timeout") {
          zy.ui.msg("访问超时: ", link + "\r\n" + errorThrown, "e");
        }
        throw {
          XMLHttpRequest: XMLHttpRequest,
          textStatus: textStatus,
          errorThrown: errorThrown
        };
      }
    });
  }

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class APPview
   * @constructor
   */
  function APPview() {
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    thiz.Select();
    thiz.DataTable();
    thiz.Toolbar();
    $('#app_view_role').btnDisable(true);
    $('#app_view_his').btnDisable(true);
    $('#app_view_logo').btnDisable(true);
    $('#app_view_search').trigger('click');
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns = [{
      "data": "applicationnm"
    }, {
      "data": "apinum"
    }, {
      "data": "p_applicationid"
    }, {
      "render": function (data, type, row, meta) {
        return row['biz_status'] != '' ? zy.cache.cd2name('ZR.0038', row['biz_status']) : '';
      }
    }, {
      "data": "orgnum"
    }, {
      "render": function (data, type, row, meta) {
        return $.format.date(row.createdt, 'yyyy-MM-dd HH:mm:ss');
      }
    }];
    //预设初始化参数
    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    DynamicWidth();
  };
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function () {
    // 单击事件
    dt.on('click', 'tr', function (e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#title').text('创建应用');
        $('#app_view_add i').removeClass('fa-edit').addClass('fa-plus');
        $('#app_view_role').btnDisable(true);
        $('#app_view_his').btnDisable(true);
        $('#app_view_logo').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#app_view_role').btnDisable(false);
        $('#app_view_his').btnDisable(false);
        $('#app_view_logo').btnDisable(false);
      }
    });
    //查询
    $('#app_view_search').click(function () {
      $('#title').text('创建应用');
      $('#app_view_add i').removeClass('fa-edit').addClass('fa-plus');
      conditions = $('#app_view_form').serialize();
      $('#app_view_role').btnDisable(true);
      $('#app_view_his').btnDisable(true);
      $('#app_view_logo').btnDisable(true);
      $('#app_view_search').button('loading');
      thiz.Pagination(1);
    });
    //APP管理
    $('#app_view_add').click(function () {
      zy.net.loadHTML("yingyong_ptgl/yyfb2/add_edit_modal.html", $("#app_view_modal"), function () {
        _Modal();
      });
    });
    //更新应用
    $('#app_view_role').click(function () {
      var data = dt.DataTable().row('.active').data();
      zy.net.loadHTML("yingyong_ptgl/yyfb2/add_edit_modal.html", $("#app_view_modal"), function () {
        _Modal(data.applicationid);
      });
    });
    //更新历史
    $('#app_view_his').click(function () {
      var rowIdx = dt.DataTable().row('.active').index();
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.applicationid = data.applicationid;
      zy.net.loadHTML("yingyong_ptgl/yyfb2/app_view_his.html", $("#app_view_modal2"));
    });
    //上传LOGO
    $('#app_view_logo').click(function () {
      var rowIdx = dt.DataTable().row('.active').index();
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.applicationid = data.applicationid; //获取选择行数据，设置参数
      thiz._g.param.image_path = data.image_path; //logo路径
      //window.modal = $(this).closest('.modal');
      zy.net.loadHTML("yingyong_ptgl/yyfb2/app_logo.html", $("#app_view_modal"));
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    $.jqPaginator('#app_view_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        thiz._g.curpage = num; //当前页码
        thiz.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function (page) {
    var cb = function (msg) {
      $('#app_view_search').button('reset');
      $('#app_view_role').btnDisable(true);
      $('#app_view_logo').btnDisable(true);
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#app_view_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#app_view_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
    zy.g.am.mod = 'yyfb';
    zy.net.get("api/published_app_view", cb, conditions, page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function (msg) {
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    dt.DataTable().rows().invalidate().draw();
  };
  PT.Select = function () {
    // 数据字典处理
    var cb = function () {
      // 字典数据绑定
      $("#app_view_form input[name=status]").zySelect('ZR.0001', true, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    $("#app_view_form input[name=status]").val('1');
    zy.cache.initDicts('ZR.0001,ZR.0038,ZR.0051,ZR.0045', cb);
  };

  function _Modal(appid) {
    var modal = $('#app_add_upd');
    var btnSync = modal.find('#app_add_upd_sync_container');

    function jsonToForm(data) {
      
      var appid = $('<input name="applicationid" style="display:none;">');
      appid.appendTo($('#appinfo').children().children(':first'));
      var a = $('#appinfo').find('img');
      a.attr('src', data.image_path);
      $.each(data, function (i, v) {
        var t = modal.find('[name="' + i + '"]');
        t.val(v);
        if (t.hasClass('select2-offscreen'))
          t.select2('val', v);
      });

      var c = $('#app_add_upd_role_container').find('.list-group a');
      c.each(function(i) {
        var dataRoleid = $(this).attr('data-roleid');
        var isFound = false;
        var aThis = $(this);
        $.each(data.role, function(ii,vv) {
          if (dataRoleid === vv.local_roleid) {
            aThis.parent().parent().parent().addClass('well-light');
            aThis.addClass('active');
            isFound = true;
            return false;
          }
        });
        if (!isFound) {
          // 角色事件
          $(this).on('click', function () {
            $(this).parent().parent().parent().addClass('well-light');
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            } else {
              $(this).addClass('active');
            }
            return false;
          });
          // 双击事件
          $(this).on('dblclick', function (e) {
            $(this).trigger('click');
          });
        }
      });

      var publicapi = data.publicapis[0].publicapi;
      
      if (publicapi.length > 0) {
        var arr = JSON.parse(JSON.stringify(publicapi));
        var publicapitree = $.fn.zTree.getZTreeObj('publicapilisttree');
        // $.each(publicapi, function (i, v) {
          $.each(arr, function (i, v) {
            var _id = v.appid + '--' + v.moduleid + '--' + v.apiid;
            var node = publicapitree.getNodeByParam('id', _id, null);
            publicapitree.checkNode(node, true, true);
          });
        // });
      }

      if (data.publicmodel && data.publicmodel.length > 0) {
        var secondModeltree = $.fn.zTree.getZTreeObj('secondModeltree');
        $.each(data.publicmodel, function (i, v) {
          var allnodes = secondModeltree.getNodes();
          function _checknode(all) {
            $.each(all, function (ii, vv) {
              if (vv.check_Child_State == -1 && vv.typecd == v) {
                var node = secondModeltree.getNodeByParam('typecd', v, null);
                secondModeltree.checkNode(node, true, true);
              }
              if (vv.children)  _checknode(vv.children)
            })
          }
          _checknode(allnodes);
        });
      }
    }

    function _async(num) {
      return (function (num) {
        var count = 0;
        var m = null;
        return function (callback) {
          return function (msg) {
            if (msg)
              m = msg;
            count++;
            if (count == num) {
              callback(m || null);
            }
          };
        };
      }(num))
    }

    function init(cb) {
      selectedRoles = [];
      var async = _async(2);
      var done = async(function (msg) {
        var _c = modal.find('#accordion-4').find("#publicapilisttree");
        var _Mc = modal.find('#accordion-4').find("#secondModeltree");
        apilistTree('', '', _c, _Mc);

        modal.trigger('init');

        modal.find('[name=category]').zySelect('ZR.0051', false, {width: '100%', allowClear: false});
        modal.find('[name=excl]').zySelect('ZR.0045', false, {width: '100%', allowClear: false});
        modal.find('[name=category]').select2('val', '01');
        modal.find('[name=excl]').select2('val', '0');

        zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
        zy.g.am.mod = 'yyfb';
        zy.net.get('api/getlocalroles', function(msg) {
          if (msg) {
            var html = $('#app_add_upd_tmpl').render(msg.result);
            var tmplContainer = $('#app_add_upd_role_container');
            tmplContainer.empty();
            tmplContainer.html(html);
          }
        });

        if (appid) {
          btnSync.show();
        } else {
          btnSync.hide();
        }

        if (msg) {
          var result = msg.result;
          if (appid) {
            result = [];
            $.each(msg.result, function (i, v) {
              if (appid != v.id)
                result.push(v);
            })
          }
          modal.find('[name=p_application_id]').zySelectCustomData('', false, {width: '100%'}, result)
        }
        cb && cb()
      });

      zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
      zy.g.am.mod = 'yyfb';
      zy.net.get('api/p_app_get', done);
      zy.cache.initDicts('ZR.0001,ZR.0046', done)
    }

    function checkAll() {
      return false;
    }

    function checkFirst(container) {
      var result = '';
      var finalresult;
      flg = true;
      var target = container.find('.fa-exclamation');
      if (target.length > 0) {
        $.each(target, function (i, v) {
          var name = $(v).parent().prev().text();
          if (result.indexOf(name) < 0) {
            result = result + $(v).parent().prev().text() + ',';
          }
          finalresult = result.trimCom();
        });
        zy.ui.msg('提示', finalresult + "不可以为空", 'w');
        return true;
      }
    }

    // 应用名称重复验证 true 重复
    function checkAppname() {
      var flg = false;
      var param = {applicationnm: modal.find('#appnm').val()};
      if (appid) {
        param.applicationid = appid;
      }
      zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
      zy.g.am.mod = 'yyfb';
      zy.net.get('api/app_name_validate', function(){}, param, null, function (msg) {
        if (msg.ret === '2') {
          zy.ui.msg('提示信息', '应用名称已存在', 'w');
          flg = true
        }
      });
      return flg;
    }

    function checkInner(container) {
      var _flg = false;
      $.each(container, function (ii, vv) {
        var result = '';
        var finalresult;
        var target = $(vv).find('.fa-exclamation');
        if (target.length > 0) {
          $.each(target, function (i, v) {
            var name = $(v).parent().prev().text();
            if (result.indexOf(name) < 0) {
              result = result + $(v).parent().prev().text() + ',';
            }
            finalresult = result.trimCom();
          });
          zy.ui.msg('提示', '第' + (ii + 1) + '个 ' + finalresult + "不可以为空", 'w');
          _flg = true;
          return false;
        }
      });
      return _flg;
    }

    var tools = {
      label: function (str) {
        var t = '<' + str + '></' + str + '>';
        return $(t);
      }
    };

    function newtab(id, type) {
      function newId(old) {
        var random = Math.round(Math.random() * 1000);
        var newid = old + random;
        if ($('#' + newid).length > 0)
          newId(old);
        else
          return newid;
      }

      function collapseAll() {
        container.children('.panel').each(function (i, v) {
          $(v).children(':first').find('a').addClass('collapsed');
          $(v).children(':last').removeClass().addClass('panel-collapse collapse');
        })
      }

      var match = {
        role: approle.clone(),
        menu: appmenu.clone()
      };

      var container = modal.find('#' + id);
      collapseAll();

      var newT = match[type];
      var newID = newId('new');
      newT.children(':first').find('a').attr('href', "#" + newID);
      newT.children(':last').attr('id', newID);

      container.children('.row').before(newT);
      modal.find('[name=menu_icon]').zySelectIcons();
      modal.trigger('init');
      return newT;
    }

    function eachRole() {
      var arr = [];
      return arr;
    }

    modal.bind('init', function () {
      var $this = $(this);

      $(this).find('textarea').unbind()
        .bind('input', function (e) {
          if ($(this).val() !== '')
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-check');
          else
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-exclamation');
        });

      $(this).find('[name=appnm]').unbind('input')
        .bind('input', function (e) {
          if ($(this).val() !== '')
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-check');
          else
            $(this).siblings('i').removeClass().addClass('icon-append fa fa-exclamation');
        });

      btnSync.on('click', function() {
        var c = $('#app_add_upd_role_container').find('.list-group a');
        c.each(function(i) {
          if ($(this).hasClass('active')) {
            var dataRoleid = $(this).attr('data-roleid');
            if (_.indexOf(selectedRoles, dataRoleid) < 0) {
              selectedRoles = _.concat(selectedRoles, dataRoleid);
            }
          }
        });
      });
      

      $(this).find('[name=uilist]').unbind()
        .bind('click', function () {
          var _container = $(this).closest('section').prev().find('input')
          $('#app_add_upd').modal('hide');
          zy.net.loadHTML('yingyong_ptgl/yyfb2/app_ui_list.html', $("#app_view_modal2"), function () {
            uilisttree(_container);
          })
        });

      $(this).find('[name=apilist]').unbind()
        .bind('click', function () {
          var btn = $(this);
          var del = btn.parent().parent().siblings('section').find('button');
          $('#app_add_upd').modal('hide');

          zy.net.loadHTML('yingyong_ptgl/yyfb2/app_api_list.html', $("#app_view_modal2"), function () {
            apilistTree(del, btn);
          })
        });

      var _appcontainer = $(this).find('[name=intro_path]');
      $(this).find('[name=appuilist]').unbind()
        .bind('click', function () {
          $('#app_add_upd').modal('hide');
          zy.net.loadHTML('yingyong_ptgl/yyfb2/app_ui_list.html', $("#app_view_modal2"), function () {
            uilisttree(_appcontainer);
          })
        })
    });

    function apilistTree(del, btn, container, modelcon) {
      var _tools = {
        _api: function (_param, _success, _nodata_cb) {
          if (!_param.apiid)
            return;
          var _p = $.extend(true, {}, _param.r_param);
          var _cb = function (msg) {
            if (msg) {
              _success && _success(msg);
            } else {
              _nodata_cb && _nodata_cb(msg);
            }
          };

          zy.g.am.mod = _param.modid || 'yyfb';
          zy.g.am.app = _param.appid || '03229cbe4f4f11e48d6d6f51497a883b';
          zy.net.get('api/' + _param.apiid, _cb, _p);
        }
      };

      var auth_callback2 = function (msg) {
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
            dblClickExpand: false
          }
        };
        if (msg) {
          if (modelcon) {
            $.fn.zTree.init(modelcon, setting, msg.result);
          } else {
            $('#publish_app_api_list').modal('show');
            $.fn.zTree.init($("#modellisttree"), setting, msg.result);
          }
        }
      };
      zy.g.am.app = 'auth';
      zy.g.am.mod = 'role_model';
      // 发送请求并注册回调函数
      zy.net.get("api/getrolemodeltree", auth_callback2);

      function _tree(cb) {
        var setting = {
          data: {
            key: {
              checked: 'checked',
              name: 'name',
              title: 'id'
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
          },
          view: {
            showTitle: true,
            selectedMulti: false,
            showIcon: true,
            dblClickExpand: false
          }
        };
        var tree = null;

        function _checkData(arr) {
          var result = [];
          var match = {};
          var _m = [];
          var _mid = {};

          $.each(arr, function (i, v) {
            _m[v.id] = arr[i];
            match[v.id] = arr[i];
            _mid[v.pid] = true;
          });

          $.each(arr, function (i, v) {
            var id = v.id.split('--');
            if (id.length == 2) {
              if (!_mid[v.id]) {
                delete match[v.id];
              }
            }
          });

          $.each(match, function (i, v) {
            var flg = false;
            if (v.isparient == 'false')
              flg = true;
            $.each(match, function (ii, vv) {
              if (i == vv.pid)
                flg = true;
            });
            if (flg)
              result.push(v);
          });
          return result;
        }

        _tools._api({
          apiid: 'publish_api_tree'
        }, function (msg) {
          if (container) {
            $.fn.zTree.init(container, setting, _checkData(msg.result));
          } else {
            $('#publish_app_api_list').modal('show');
            tree = $.fn.zTree.init($("#publish_app_api_list").find("#publishapilisttree"), setting, _checkData(msg.result));
            cb && cb(tree);
          }
        })
      }

      _tree(function (tree) {
        //点击保存事件
        $('[name=apilistsubmit]').click(function () {
          //获取改变check状态的节点
          var nodes = tree.getCheckedNodes(true);

          function _each(_arr) {
            var _larr = [];
            $.each(_arr, function (i, v) {
              var role = {};
              var _split = v.id.split('--');
              if (!v.isParent && _split.length > 2) {
                role.appid = _split[0];
                role.moduleid = _split[1];
                role.apiid = _split[2]
              } else {
                return;
              }
              _larr.push(role)
            });
            return _larr;
          }

          var _roleapi = _each(nodes);
          var modeltreeObj = $.fn.zTree.getZTreeObj("modellisttree");
          //checked的节点
          var treenodes = modeltreeObj.getCheckedNodes();

          function modelnode(mnode) {
            var marr = [];
            $.each(mnode, function (i, v) {
              if (v.check_Child_State == -1)
                marr.push(v.typecd);
            });
            return marr;
          }

          var typecd = modelnode(treenodes);
          var _toge = [JSON.stringify(_roleapi), JSON.stringify(typecd)]

          if (_roleapi.length == 0) {
            zy.ui.msg('提示信息', '请至少选择一个 API', 'w');
          } else {
            $('#publish_app_api_list').modal('hide');
            btn.val(JSON.stringify(_toge));
            del.val(JSON.stringify(typecd));
            $('#app_add_upd').modal('show');
          }
        });

        function checkAgain(tree, str) {
          var arr = JSON.parse(str);
          $.each(JSON.parse(arr[0]), function (i, v) {
            var _id = v.appid + '--' + v.moduleid + '--' + v.apiid;
            var node = tree.getNodeByParam('id', _id, null);
            tree.checkNode(node, true, true);
          });
        }

        function checkcheck(str) {
          var arr = JSON.parse(str);
          var modellisttree = $.fn.zTree.getZTreeObj('modellisttree');
          var allnodes = modellisttree.getNodes();
          $.each(arr, function (i, v) {
            function _checknode(all) {
              $.each(all, function (ii, vv) {
                if (vv.check_Child_State == -1 && vv.typecd == v) {
                  var node = modellisttree.getNodeByParam('typecd', v, null);
                  modellisttree.checkNode(node, true, true);
                }
                if (vv.children)  _checknode(vv.children)
              })
            }
            _checknode(allnodes);
          });
        }

        if (btn.val())
          checkAgain(tree, btn.val());

        if (del.val())
          checkcheck(del.val());

        //点击取消事件
        $('[name=apilistcancle]').click(function () {
          $('#publish_app_api_list').modal('hide');
          $('#app_add_upd').modal('show');
        })
      })
    }

    function uilisttree(_c) {
      $('#ui_list').modal('show');
      var _tools = {
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
        _post: function (_apinm, _cb, _param) {
          $.post('http://' + location.host + '/api/' + _apinm, _param, function (data) {
            _cb && _cb(data);
          });
        },
        _label: function (_str) {
          var _q = '<' + _str + '></' + _str + '>';
          return $(_q);
        }
      };
      //设置ztree
      function _tree(cb) {
        var tree = null;
        var setting = {
          data: {
            key: {
              checked: "checked",
              name: 'name',
              title: 'path'
            },
            simpleData: {
              enable: true
            }
          },
          check: {
            enable: true,
            chkDisabledInherit: true,
            chkStyle: "radio",
            chkboxType: {
              "Y": "ps",
              "N": "ps"
            },
            radioType: "all"
          },
          view: {
            showTitle: true,
            selectedMulti: false,
            showIcon: true,
            dblClickExpand: false
          },
          callback: {
            onExpand: _expand
          }
        };

        function _fromServer(_path, _cb, _flag) {
          if (_flag == 'rightex')
            var _t = {
              path: _path,
              branch: 'ui'
            };
          if (_flag == 'right')
            var _t = {
              path: _path,
              double: 'double'
            };

          _tools._api('getfilelist', function (_m) {
            if (!Boolean(_m.ret)) {
              if (_flag == 'rightex')
                var _mm = _m.result;
              if (_flag == 'right') {
                var _mm = _m.ui;
              }
              if ($.isArray(_mm)) {
                _mm = _sort(_mm)
              } else {
                _mm.children = _sort(_mm.children)
              }
              _cb && _cb(_mm);
            } else
              zy.ui.msg('提示', '接口执行失败:' + _m.msg, 'e');
          }, $.extend(true, _t, zy.g.comm));
        }

        function _sort(_arr) {
          var _fileArray = [],
            _dirArray = [];
          $.each(_arr, function (_i, _v) {
            if (_v.isParent)
              _dirArray.push(_v);
            else
              _fileArray.push(_v);
          });
          return [].concat(_dirArray, _fileArray);
        }

        function _expand(_e, _id, _node) {
          if (!_node.children || _node.children.length === 0)
            _fromServer(_node.path, function (_m) {
              var _result = _m;
              // if (_node.checked)
              //   $.each(_result, function(i, v) {
              //     v.checked = true;
              //   });
              _node.children = _result;
              tree.refresh();
            }, 'rightex');
        }

        _fromServer('/', function (_m) {
          tree = $.fn.zTree.init($('#ui_list').find("#uilisttree"), setting, _m);
          cb && cb(tree);
        }, 'right');
      }

      _tree(function (tree) {
        $('[name=appuilistsubmit]').click(function () {
          var nodes = tree.getCheckedNodes();
          function _each(_arr) {
            var path = [];
            $.each(_arr, function (i, v) {
              var _length = v.name.split('.').length;
              var name = v.name.split('.')[_length - 1];
              if (!v.isParent && (name == 'html' || name == 'htm'))
                path.push(v.path);
            });
            return path;
          }

          path = _each(nodes);
          if (path.length == 0) {
            zy.ui.msg('提示信息', '请选择一个html文件', 'w');
          } else {
            _c.val(path[0]);
            _c.siblings('i').removeClass().addClass('icon-append fa fa-check');
            $('#ui_list').modal('hide');
            $('#app_add_upd').modal('show');
          }
        });

        $('[name=appuilistcancle]').click(function () {
          $('#ui_list').modal('hide');
          $('#app_add_upd').modal('show');
        })
      });
    }

    $('#uplogo').click(function () {
      $('#app_add_upd').modal('hide');
      zy.net.loadHTML("yingyong_ptgl/yyfb2/app_logo.html", $("#app_view_modallogo"));
    });


    function _eachresult(id) {
      var _arr = [];
      $('#' + id).children().each(function (i, v) {
        if ($(v).hasClass('row'))
          return;
        var role = {};
        $(v).find('input').each(function (ii, vv) {
          if ($(vv).attr('name') != undefined) {
            role[$(vv).attr('name')] = $(vv).val();
            role[$(v).find('textarea').attr('name')] = $(v).find('textarea').val();
          }
        });
        if (id == 'accordion-2') {
          if ($(v).find('[name=apilist]').val() !== '') {
            var api_model = JSON.parse($(v).find('[name=apilist]').val());
            var _roleapi = api_model[0];
            var _Model = api_model[1];
            role['roleapi'] = JSON.parse(_roleapi);
            role['model'] = JSON.parse(_Model);
          } else {
            role['roleapi'] = [];
            role['model'] = [];
          }
        }
        _arr.push(role);
      });
      return _arr;
    }

    function nodeToApi(path) {
      function _saveform() {
        zy.net.loadHTML("yingyong_ptgl/yyfb2/app_change.html", $('#app_view_modal2'), function () {
          $('#app_change_submit').click(function () {
            var _updatecmt = $(this).closest('form').find('textarea').val().trim();
            if (_updatecmt === '')
              return zy.ui.msg('提示', '修改原因为必填项', 'w');
            else
              a[0]['mark'] = _updatecmt;
            var t = {
              op_type: 'u',
              'create_app': JSON.stringify(a[0])
            };

            zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
            zy.g.am.mod = 'yyfb';
            var apinm = 'applicationmaint';
            zy.net.post('api/' + apinm, function (msg) {
              if (msg.ret == '0') {
                zy.ui.msg('提示', '成功', 's');
                $('#app_change').modal('hide');
              }
            }, t);
          });
          $('#app_change').modal('show');
          $('#app_add_upd').modal('hide');
        });
      }

      var result = checkAll();
      if (!result) {
        var a = _eachresult('appinfo');
        //a[0].approle = _eachresult('accordion-2');

        //公共应用的Api
        var publicApitree = $.fn.zTree.getZTreeObj('publicapilisttree');
        var nodes = publicApitree.getCheckedNodes(true);

        function _each(_arr) {
          var _larr = [];
          $.each(_arr, function (i, v) {
            var role = {};
            var _split = v.id.split('--');
            if (!v.isParent && _split.length > 2) {
              role.appid = _split[0];
              role.moduleid = _split[1];
              role.apiid = _split[2]
            } else {
              return;
            }
            _larr.push(role)
          });
          return _larr;
        }

        a[0].publicapi = _each(nodes);
        //公共模型
        var publicmodeltreeObj = $.fn.zTree.getZTreeObj("secondModeltree");
        //checked的节点
        var pubtreenodes = publicmodeltreeObj.getCheckedNodes();

        function publicmodelnode(mnode) {
          var marr = [];
          $.each(mnode, function (i, v) {
            if (v.check_Child_State == -1)
              marr.push(v.typecd);
          });
          return marr;
        }

        a[0].publicmodel = publicmodelnode(pubtreenodes);
        delete(a[0].src);
        if (path) {
          a[0]['image_path'] = path;
        }
        if (!appid) {
          var c = $('#app_add_upd_role_container').find('.list-group a');
          c.each(function(i) {
            if ($(this).hasClass('active')) {
              var dataRoleid = $(this).attr('data-roleid');
              if (_.indexOf(selectedRoles, dataRoleid) < 0) {
                selectedRoles = _.concat(selectedRoles, dataRoleid);
              }
            }
          });
        }
        a[0].role = selectedRoles;
        if (appid) {
          _saveform();
        } else {
          var s = {
            op_type: 'i',
            'create_app': JSON.stringify(a[0])
          };
          var apinm = 'applicationmaint';
          zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
          zy.g.am.mod = 'yyfb';
          zy.net.post('api/' + apinm, function (msg) {
            if (msg.ret == '0') {
              zy.ui.msg('提示', '成功', 's');
              modal.modal('hide');
            }
          }, s);
        }
      }
    }

    loadScript("lib/js/plugin/bootstrap-wizard/jquery.bootstrap.wizard.min.js", runBootstrapWizard);
    function runBootstrapWizard() {
      
      init(function () {
        
        if (appid) {
          zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
          zy.g.am.mod = 'yyfb';
          zy.net.get('api/sync_app_info', function (msg) {
            if (!msg || !msg.result || msg.result.length === 0){
              return zy.ui.msg('提示', '接口异常', 'e');
            }
            modal.modal('show');
            modal.find('.fa-exclamation').removeClass('fa-exclamation').addClass('fa-check');
            jsonToForm(msg.result[0]);
          }, {
            applicationid: appid
          })
        } else {
          $('#app_add_upd_role_container').find('.list-group a').on('click', function () {
            $(this).parent().parent().parent().addClass('well-light');
            if ($(this).hasClass('active')) {
              $(this).removeClass('active');
            } else {
              $(this).addClass('active');
            }
            // 双击事件
            $(this).on('dblclick', function (e) {
              $(this).trigger('click');
            });
          });
          modal.modal('show');
        }
      });

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
        if ($('[name=src]').val() === '') {
          nodeToApi();
        } else {
          var form = $('<form></form>');
          var file = $('[name=src]').clone(true, true);
          file.appendTo(form);
          postForm('upapplogo', form, function (msg) {
            nodeToApi(msg.result.path);
          });
        }
      });

      $('[name=nexttab]').click(function () {
        var index = $('#rootwizard').bootstrapWizard('currentIndex');
        if (index === 0) {
          var target = $($('.tab-content').find('.active')).find('.panel-body');
          var result = checkFirst(target);
          if (result)
            return;
          if (checkAppname())
            return;
          $('#rootwizard').bootstrapWizard('next');
        } else {
          var target = $($('.tab-content').find('.active')).find('.panel-default')
          if (checkInner(target) || checkAll())
            return false;
          $('#rootwizard').bootstrapWizard('next');
        }
      });
    }
  }

  return APPview;
})();