var sys_md_mm = (function () {
  var thiz = null;
  var needparam = {};
  var nodeClick = null;
  var table = new dyTable({
    app: 'c879dcc94d204d96a98a34e0b7d75676',
    api: 'getdatatable',
    mod: 'mm'
  });
  //全局变量
  var _g={
    first_Page:1,  //第一个tab页的Table分页查询的当前页
  }
  //jquery元素对象
  var first = $('[name=tab_first]');
  var second = $('[name=tab_second]');
  var third = $('[name=tab_third]');
  var forth = $('[name=tab_forth]');
  var fifth = $('[name=tab_fifth]');
  var firstDt = $('#firstDt');

  var form = new dyForm();
  // var tab = new zyTabs('#tab_container');
  // $('#tab_container').tabs();
  var tools = {
    label: function (str) {
      var t = '<' + str + '></' + str + '>';
      return $(t);
    },
    checkColumnName: function(str){
      var check1 = /\W/;  //非单词字符
      var check2 = /^\d/; //以数字开头
      return !check1.test(str) && !check2.test(str);
    }
  }
  
  var emptyTable = tools.label('table').attr({
    name: 'table',
    class: 'table table-bordered table-striped'
  });

  function sys_md_mm() {
    thiz = this;
    thiz.init = init;
    return this;
  }

  //datatables的resize事件
  function DynamicWidth(container) {
    container.unbind("resize").bind("resize", function () {
      var _width0 = container.find('.dataTables_scrollBody').width();
      var _width1 = container.find('.dataTables_scrollBody table').width();
      //不出滚动条时，调整表格宽度大小；出滚动条时，不对表格进行css处理
      if (_width0 >= _width1) {
        container.find('.dataTables_scrollHeadInner').css('width', '100%');
        container.find('.dataTables_scrollBody table').css('width', '100%');
        container.find('.dataTables_scrollHeadInner table').css('width', '100%');
      }
    });
  }

  function initInner(container, param, cb) {
    var match = {
      'tab_second': {
        apinm: 'gettables',
        tablefun: secondtable
      },
      'tab_third': {
        apinm: 'getindexs',
        tablefun: thirdtable
      },
      'tab_fifth': {
        apinm: 'getusedinfo',
        tablefun: fifthtable
      }
    }

    var apinm = match[container.attr('name')].apinm;
    window.oo=match[container.attr('name')];
    window.pp=container.attr('name');

    function clean() {
      var target = container.find('.dataTables_wrapper');
      target.empty();
      target.append(emptyTable.clone());
    }

    zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
    zy.g.am.mod = 'tableandindex';
    zy.net.get('api/' + apinm, function (msg) {
      if (msg && msg.result) {
        clean();
        container.find('[name=total_count]').html('总数:' + msg.count);
        var dt = match[container.attr('name')].tablefun(container.find('[name=table]'), msg.result);
        cb && cb(msg, dt);
      } else {
        zy.ui.msg('提示', '接口异常', 'e');
      }
    }, param);
  }

  function firsttable(dt, data) {
    var columns = [
      {
        "title": '数据元编码',
        "data": 'decd'
      },
      {
        "title": '英文名称',
        "data": "en"
      },
      {
        "title": '中文名称',
        "data": "cn"
      },
      {
        "title": '主键',
        "render": function(data, type, row, meta){
          return zy.cache.cd2name('ZR.0045', row.mk);
        }
      },
      {
        "title": '必须',
        "render": function(data, type, row, meta){
          return zy.cache.cd2name('ZR.0045', row.must);
        }
      },
      {
        'title':'数据类型',
        'data':'datatype'
      },
      {
        'title':'数据长度',
        'data':'numrange'
      },
      {
        'title':'数据字典',
        // 'data':'dict'
        "render":function(data, type, row, meta){
          return '<a href="javascript:void(0);" name="_dict_cell" data-dict="'+row.dict+'">'+row.dict+'</div>';
        }
      },
      {
        'title':'说明',
        //'data':'mark'
        "render":function(data, type, row, meta){
          var _data = row.mark;
          var _title = _data.replace(/"/g,"'");
          _title = _title.replace(/\r\n/g,"*");
          var _tmpVal = _data.length>30?_data.substr(0,27)+"...":_data;
          return "<div title="+_title+">"+_tmpVal+"</div>";
        }
      },{
        'title':'版本',
        'data':'version'
      }
    ];

    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    DynamicWidth(first.find(".dataTables_wrapper"));
    return dt;
  }
  
  /**
   * 分页处理
   * @method firstPagination
   * @param {Number} totalCounts 总行数
   * @param {Number} page 页码
   */
  function firstPagination(page){
    $.jqPaginator(first.find('[name=pagination]'), {
      totalCounts: zy.g.page.pagesize*page+1,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        _g.first_page=num;
        firstSetDt(num);
      }
    });
  }
  
  function firstSetDt(page){
    zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
    zy.g.am.mod = 'mm';
    zy.net.get('api/getdatatable', function (msg) {
      if (msg && msg.data) {
        first.find('[name=total_count]').html('总数:' + msg.count);
        firsttable(firstDt, msg.data);
        if (msg.count > 0) {
          first.find('[name=pagination]').jqPaginator('option', {
            totalCounts: msg.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          first.find('[name=pagination]').jqPaginator('destroy');
        }
      }
    }, first.find('form').serialize()+'&typecd='+encodeURIComponent(nodeClick.typecd), page);
  }
  
  function secondtable(dt, data) {
    var columns = [{
      "title": '数据源名称',
      "data": "dbnm"
    }, {
      "title": '表物理名称',
      "data": "en"
    }, {
      "title": '表中文名称',
      "data": "cn"
    }, {
      "title": '创建时间',
      "data": "createdt"
    }, {
      "title": '修改时间',
      "data": "updatedt"
    }];

    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    DynamicWidth(second.find(".dataTables_wrapper"));
    return dt;
  }
  
  //初始化Tab2的table
  function secondInitInner(typecd,datatable,cb){
    var param = $('[name=tab_second]').find('form[name=form]').serialize();
    param = param + '&' + zy.net.parseParam({typecd: typecd})
    initInner($('[name=tab_second]'), param, function (msg, dt) {
      datatable[0] = dt;
      $('[name=second]').find('[name=total_count]').html('总数:' + msg.count);
      _btnDis($('[name=tab_second]'), 'edit,delete,data,index,ddl,config-ui', true);
      dt.on('click', 'tr', function (e) {
        if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
          return false;
        var $this = $(this);
        $this.siblings().removeClass('active');
        if ($this.hasClass('active')) {
          $this.removeClass('active');
          _btnDis($('[name=tab_second]'), 'edit,delete,data,index,ddl,config-ui', true);
        } else {
          $this.addClass('active');
          _btnDis($('[name=tab_second]'), 'edit,delete,data,index,ddl,config-ui', false);
        }
      });
      cb && cb();
    });
  }

  function thirdtable(dt, data) {
    var columns = [{
      "title": '索引物理名称',
      "data": "en"
    }, {
      "title": '索引中文名称',
      "data": "cn"
    }, {
      "title": '表字段物理名称',
      "data": "fields"
    }, {
      "title": '排序',
      "data": "sort"
    }, {
      "title": '创建时间',
      "data": "createdt"
    }, {
      "title": '修改时间',
      "data": 'updatedt'
    }];

    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    DynamicWidth(third.find(".dataTables_wrapper"));
    return dt;
  }

  function thirdInitInner(typecd,datatable,cb){
    var param = $('[name=tab_third]').find('form[name=form]').serialize();
    param = param + '&' + zy.net.parseParam({typecd: typecd})
    initInner($('[name=tab_third]'), param, function (msg, dt) {
      datatable[1] = dt;
      _btnDis($('[name=tab_third]'), 'edit,delete', true);
      dt.on('click', 'tr', function (e) {
        if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
          return false;
        var $this = $(this);
        $this.siblings().removeClass('active');
        if ($this.hasClass('active')) {
          $this.removeClass('active');
          _btnDis($('[name=tab_third]'), 'edit,delete', true);
        } else {
          $this.addClass('active');
          _btnDis($('[name=tab_third]'), 'edit,delete', false);
        }
      });
      cb&&cb();
    });
  }
  
  function fifthtable(dt, data) {
    var columns = [{
      "title": '物理表英文名',
      "data": "tableid"
    }, {
      "title": '物理表中文名',
      "data": "tablenm"
    }, {
      "title": '数据源名称',
      "data": "didnm"
    }, {
      "title": '业务类型',
      "data": "bstype"
    }, {
      "title": '业务英文名称',
      "data": "modolcd"
    }, {
      "title": '业务中文名称',
      "data": "modolnm"
    }, {
      "title": '修改时间',
      "data": 'updatedt'
    }];

    var options = {
      "data": data,
      "columns": columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
    DynamicWidth(fifth.find(".dataTables_wrapper"));
    return dt;
  }
  
  function fifthInitInner(typecd,datatable,cb){
    var param = $('[name=tab_fifth]').find('form[name=form]').serialize();
    param = param + '&' + zy.net.parseParam({typecd: typecd})
    initInner($('[name=tab_fifth]'), param, function (msg, dt) {
      datatable[3] = dt;
      cb&&cb();
    });
  }
  function async(num) {
    var pending = (function (num) {
      var count = 0;
      var result = [];
      return function (callback) {
        return function (dt) {
          count++;
          result.push(dt);
          if (count == num) {
            callback(result);
          }
        };
      };
    }(num));
    return pending
  }

  function _btnDis(con, btnName, bol) {
    var t = btnName.split(',');
    $.each(t, function (i, v) {
      con.find("[name='" + v + "']").btnDisable(bol);
    })
  }

  function init(node) {
    nodeClick = node;
    var typecd = node.typecd;
    //初始化第一个Tab
    firstPagination(1);
    toolbar(null, typecd);
    //tab1调用datatable

    var arr = [];

    $('#tab_container').tabs({
      active: 0,
      activate: function (event, ui) {
        var newIndex = ui.newTab.parent().children().index(ui.newTab);
        if (newIndex === 0) {
        }
        else if (newIndex === 1) {
          initInner($('[name=tab_second]'), {
            typecd: typecd
          }, function (msg, dt) {
            // done(dt);
            arr[0] = dt;
            _btnDis($('[name=tab_second]'), 'edit,delete,data,index,ddl,config-ui', true);
            dt.on('click', 'tr', function (e) {
              if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
                return false;
              var $this = $(this);
              var p = $this.closest('.ui-tabs-panel');
              $this.siblings().removeClass('active');
              if ($this.hasClass('active')) {
                $this.removeClass('active');
                _btnDis(p, 'edit,delete,data,index,ddl,config-ui', true);
              } else {
                $this.addClass('active');
                _btnDis(p, 'edit,delete,data,index,ddl,config-ui', false);
              }
            })
            toolbar(arr, typecd);
          });
        }
        else if (newIndex === 2) {
          initInner($('[name=tab_third]'), {
            typecd: typecd
          }, function (msg, dt) {
            arr[1] = dt;
            _btnDis($('[name=tab_third]'), 'edit,delete', true);
            dt.on('click', 'tr', function (e) {
              if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
                return false;
              var $this = $(this);
              var p = $this.closest('.ui-tabs-panel');
              $this.siblings().removeClass('active');
              if ($this.hasClass('active')) {
                $this.removeClass('active');
                _btnDis(p, 'edit,delete,data,index', true);
              } else {
                $this.addClass('active');
                _btnDis(p, 'edit,delete,data,index', false);
              }
            })
            toolbar(arr, typecd);
          });
        }
        else if (newIndex === 4 && fifth.inited ==undefined) {
        initInner($('[name=tab_fifth]'), {
          typecd: typecd
        }, function (msg, dt) {
          fifth.inited = true;
          arr[3] = dt;
          //_btnDis($('[name=tab_fifth]'), 'edit,delete', true);
          dt.on('click', 'tr', function (e) {
            if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
              return false;
            var $this = $(this);
            var p = $this.closest('.ui-tabs-panel');
            $this.siblings().removeClass('active');
            if ($this.hasClass('active')) {
              $this.removeClass('active');
              //_btnDis(p, 'edit,delete,data,index', true);
            } else {
              $this.addClass('active');
              //_btnDis(p, 'edit,delete,data,index', false);
            }
          })
          toolbar(arr, typecd);
        });
        }
      }
    });
    
    var bstpes = [{id:0,name:"API模型"},{id:1,name:"多维模型"},{id:2,name:"操纵模型"}];
    //初始化数据字典
    zy.cache.initDicts('ZR.0045',function(){
      first.find('[name=mk]').zySelect('ZR.0045',false,{'width':'100%'});
      first.find('[name=must]').zySelect('ZR.0045',false,{'width':'100%'});
      fifth.find('[name=bstype]').zySelectCustomData('',false,{'width':'100%'},bstpes);
    });

  }

  function searchData(_t) {
    var _arr = [];
    $.each(_t, function (i, v) {
      if (v.search === '1')
        _arr.push(v);
    });
    return _arr;
  }

  /**搜索栏，工具栏按钮事件*/
  function toolbar(datatable, typecd) {

    function firstModal(param) {
      /************/
      var target = $("#modal_container");
      var value = {
        typecd: {
          required: true,
          maxlength: 100
        },
        decd: {
          required: true,
          maxlength: 100
        },
        en: {
          required: true,
          maxlength: 100
        },
        cn: {
          required: true,
          maxlength: 100
        },
        mk: {
          required: true,
          maxlength: 100
        },
        must: {
          required: true,
          maxlength: 2
        },
        elemtype: {
          maxlength: 100
        },
        mark: {
          maxlength: 600
        }
      }

      function check(oldMsg) {
        function add(cb) {
          return function (form) {
            var _enval = $('#sys_md_mm002').find('[name=en]').val();
            if (tools.checkColumnName(_enval)) {
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.get("api/adddata", function (msg) {
                if (msg) {
                  firstPagination(_g.first_page);
                  cb && cb();
                }
              }, $('#sys_md_mm002_form').serialize());
            } else {
              zy.ui.msg('提示', '非法:英文名为字母,数字,_,且不能以数字开头!', 'i');
            }
          }
        }

        function edit(cb) {
          return function (form) {
            var _oldParam='&_decd='+oldMsg.decd+'&_en='+oldMsg.en+'&_mk='+oldMsg.mk+'&_must='+oldMsg.must;
            var _enval = $('#sys_md_mm002').find('[name=en]').val();
            if (tools.checkColumnName(_enval)) {
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.net.post("api/updatedata", function (msg) {
                if (msg) {
                  console.log(_g.first_page)
                  firstPagination(_g.first_page);
                  // tab1_table_init.setrow($('#sys_md_mm002_form').form2json());
                  cb && cb();
                }
              }, $('#sys_md_mm002_form').serialize() + encodeURI(_oldParam));
            } else {
              zy.ui.msg('提示', '非法:英文名为字母,数字,_,且不能以数字开头!', 'i');
            }
          }
        }

        function alldone() {
          zy.ui.msg("提示信息：", "保存成功！", "s");
          $('#sys_md_mm002').modal('hide');
        }

        var option = {
          rules: value,
          submitHandler: param ? edit(alldone) : add(alldone),
          errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
          }
        };
        target.find("#sys_md_mm002_form").validate(option);
      }

      function add(cb) {
        $("#sys_md_mm002_title").text('添加');
        $('#sys_md_mm002_form').find('[name=typecd]').val(typecd);
        $('#sys_md_mm002').find('input[name=elemtype]').select2('val', 'text');
        // $('#sys_md_mm002').find('[id=sys_md_mm002_sorting]').css('display', 'none');
        cb && cb();

      }

      function edit(cb) {
        // var _data = tab1_table_init.getrow();
        var _data = firstDt.DataTable().row('.active').data();
        var callback = function (msg) {
          if (msg) {
            $('#sys_md_mm002_form').json2form(msg.data[0]);
            cb && cb(msg.data[0]);
          }
        }
        //调接口，往模态铺数据
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/getdataupt", callback, {'typecd':_data.typecd,'decd':_data.decd,'en':_data.en});

        $("#sys_md_mm002_title").text('修改');
        $('#sys_md_mm002_form').find('[name=typecd]').val(typecd);
        $('#sys_md_mm002_form').find('[name=typecd]').attr('readonly', true);
        // $('#sys_md_mm002_form').find('[name=status]').select2("val", '1'); //默认值

      }

      function firstHelp() {
        var tools = {
          api: function (param, cb) {
            var _cb = function (msg) {
              cb && cb(msg);
            };
            zy.g.am.app = param.app;
            zy.g.am.mod = param.mod;
            zy.net.get("api/" + param.api, _cb, param.r_param, param.page);
          }
        };

        function tree(_params) {
          var _tree = null;

          function opt(_dbfunc) {
            function Click(event, treeId, treeNode) {
              _typecd = treeNode.typecd;
              _dbfunc && _dbfunc(treeNode);
            }

            return {
              view: {
                dblClickExpand: false
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

          function refresh(treeContariner, val, dbclick) {
            var option = opt(dbclick);

            function filter(node) {
              return (node.typecd.indexOf(val) > -1);
            }

            var node = _tree.getNodesByFilter(filter);
            _tree = $.fn.zTree.init(treeContariner, option, node);
          }

          function init(treeContariner, dbclick) {
            var option = opt(dbclick);
            tools.api(_params, function (msg) {
              _tree = $.fn.zTree.init(treeContariner, option, msg.result);
            });
          }

          return {
            init: init,
            refresh: refresh
          };
        }

        //注册行点击事件
        function _tools_rowEvent() {
          $('#md_mm_typecd').click(function () {
            showMenu();
          });
          $('#md_mm_typecd').on('input', function () {
            var str = $(this).val();
            _tree.refresh($("#md_mm_tree"), str, function (treenode) {
              _datatable_init = table.init($("#md_mm_h8_table"), {typecd: treenode.typecd});
            });
          });
          $('#md_mm_h8_search').click(function () {
            var mm_datatable = new dyTable({
              app: 'c879dcc94d204d96a98a34e0b7d75676',
              api: 'getdelist',
              mod: 'mm'
            });
            conditions = $('#md_mm_h8_form').serialize();
            _datatable_init = mm_datatable.init($("#md_mm_h8_table"), conditions);
          });
          $('#md_mm_h8').find('[id=btn_ok],[id=md_mm_btn_exit]').click(function () {
            var paramdata = _datatable_init && _datatable_init.getrow();
            $('#md_mm_h8').modal('hide');
            $('#sys_md_mm002').modal('show');
            if (!paramdata) {

              $('#md_mm_h8').modal('hide');
              $('#sys_md_mm002').modal('show');
            }
            else {
              $('#sys_md_mm002_form').find('[name=decd]').select2('val',paramdata.decd);
              $('#sys_md_mm002_form').find('[name=en]').val(paramdata.en);
              $('#sys_md_mm002_form').find('[name=cn]').val(paramdata.cn);
              $('#sys_md_mm002_form').find('[name=mark]').val(paramdata.mark);
              $('#sys_md_mm002_form').find('[name=version]').val(paramdata.version);
              $('#sys_md_mm002').modal('show');
              $('#md_mm_h8').modal('hide');
            }
          });

        }

        //点击类别编码显示tree
        function showMenu() {
          var typecdObj = $('#md_mm_typecd');
          var typecdOffset = $('#md_mm_typecd').offset();
          $("#menuContent").slideDown("fast");
          $("#menuContent").offset({left: typecdOffset.left, top: typecdOffset.top + typecdObj.outerHeight()});
          $("#md_mm_h8").bind("mousedown", onBodyDown);
        }

        function hideMenu() {
          $("#menuContent").fadeOut("fast");
          $("md_mm_h8").unbind("mousedown", onBodyDown);
        }

        function onBodyDown(event) {
          if (!(event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
            hideMenu();
          }
        }

        var _tree = tree({
          app: "c879dcc94d204d96a98a34e0b7d75676",
          api: "getmetadatatree",
          mod: "mm"
        });

        // var _datatable = new dyTable({
        //   app: 'c879dcc94d204d96a98a34e0b7d75676',
        //   api: 'getdatatable',
        //   mod: 'mm'
        // });
        var _datatable_init = null;  //用来存放init后返回的对象
        _tree.init($("#md_mm_tree"), function (treenode) {
          if (treenode.datatable.trim() == "sys_mdm003") {
            v = treenode.typecd;
            var typecdObj = $('#md_mm_typecd');
            typecdObj.val(v);
            _datatable_init = table.init($("#md_mm_h8_table"), {typecd: treenode.typecd});
          }
        });
        _tools_rowEvent();
      }

      function toolbar() {
        $('#sys_md_mm002_help').click(function () {
          $('#sys_md_mm002').modal('hide');
          zy.net.loadHTML("md/mm/h8.html", $("#modal_container1"), function () {
            //为数据元编码输入框赋值
            $('#md_mm_h8_form').find('[name=decd]').val($('#sys_md_mm002').find('[name=decd]').val());
            $('#md_mm_h8').modal('show');
            $('#md_mm_h8').on('shown.bs.modal', function (e) {
              firstHelp();
              //激活一次查询
              $('#md_mm_h8_search').trigger('click');
            })
          });
        });
      }

      function decd_select2(data){
        target.find('[name=decd]').zySelectCustomData('',false,{width:'100%'},data);
        //数据元select2事件
        target.find('[name=decd]').change(function(){
          var $this = $(this);
          if($this.val()){
            var _data = $this.select2('data');
            $("#sys_md_mm002_form input[name=en]").val(_data.en);
            $("#sys_md_mm002_form input[name=cn]").val(_data.cn);
            $('#sys_md_mm002_form').find('[name=mark]').val(_data.mark);
            $('#sys_md_mm002_form').find('[name=version]').val(_data.version);
          }
        });
      }
      zy.cache.initDicts('ZR.0045,ZR.0060', function () {
        //初始化decd的select2（是否从缓存取）
        
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mod';
        zy.net.get("api/getdecds", function (msg) {
          if(msg){
            // msg.result = JSON.parse(JSON.stringify(msg.result).replace(/"disabled"/g,'"b"'));
            decd_select2(msg.result);
          }
        });

        
        $("#sys_md_mm002_form input[name=mk]").zySelect('ZR.0045', false, {
          width: '100%'
        });
        $("#sys_md_mm002_form input[name=must]").zySelect('ZR.0045', false, {
          width: '100%'
        });
        $("#sys_md_mm002_form input[name=elemtype]").zySelect('ZR.0060', false, {
          width: '100%'
        });
        //为主键注册change事件
        $("#sys_md_mm002_form input[name=mk]").change(function () {
          if ($(this).val() == "1") {
            $('#sys_md_mm002').find('input[name=must]').select2('val', '1');
          }
        });
        
        $('#sys_md_mm002').modal('show');
        
        if (param){
          edit(function (msg) {
            check(msg);
            toolbar();
          });  
        }
        else{
          $('#sys_md_mm002').find('input[name=mk]').select2('val', '0');
          $('#sys_md_mm002').find('input[name=must]').select2('val', '0');
          add(function () {
            check();
            toolbar();
          });  
        }
      });

    }

    function firstSort() {
      var tools = {
        label: function (str, type) {
          var t = '<' + str + '></' + str + '>';
          if (type)
            t = '<' + str + '/>';
          return $(t);
        }
      }

      function toNestable(array) {
        var div = tools.label('div');
        var ol = tools.label('ol');
        var li = tools.label('li');
        var _container = div.clone().addClass('dd').attr('align', 'center');
        var _ol = ol.clone().addClass('dd-list');
        if (array && array.length > 0) {
          $.each(array, function (i, v) {
            var _li = li.clone().addClass('dd-item').attr('data-id', v.en);
            var _divInner = div.clone().addClass('dd-handle').html(v.cn);
            _ol.append(_li.append(_divInner));
          });
          _container.append(_ol);
          return _container;
        }
        return null;
      }

      function Event() {

        function _each() {
          var arr = [];
          $('.dd-item').each(function (i, v) {
            arr.push($(v).attr('data-id'));
          });
          return arr.join(',');
        }

        $('#md_mm_h4 .smart-form').find('[type=submit]').unbind()
          .click(function (e) {
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'mm';
            zy.net.get('api/sortmodaldata', function (msg) {
              if (msg.ret && msg.ret == '0')
                zy.ui.msg('提示', '排序成功', 's');
                firstPagination(_g.first_page);
              // tab1_table_init = table.init($('[name=tab_first]').children(".dataTables_wrapper"), {
              //   typecd: typecd
              // }, function (msg) {
              //   $('[name=tab_first]').find('[name=total_count]').html('总数:' + msg.count);
              //   $('[name=tab_first]').find('[name=edit]').btnDisable(true);
              //   $('[name=tab_first]').find('[name=delete]').btnDisable(true);
              // }, function (data) {
              //   $('[name=tab_first]').find('[name=edit]').btnDisable(false);
              //   $('[name=tab_first]').find('[name=delete]').btnDisable(false);
              // }, function () {
              //   $('[name=tab_first]').find('[name=edit]').btnDisable(true);
              //   $('[name=tab_first]').find('[name=delete]').btnDisable(true);
              // });
              $('#md_mm_h4').modal('hide');
            }, {
              typecd: typecd,
              fields: _each()
            })
          })
      }

      loadScript("lib/js/plugin/jquery-nestable/jquery.nestable.js", function () {
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get('api/getmodalfields', function (msg) {
          var target = $('.modal-body').find('div.col-xs-8');
          var tree = toNestable(msg.result);
          target.append(tree);
          tree.nestable({
            maxDepth: 1
          });
          Event();
          $('#md_mm_h4').modal('show');
        }, {typecd: typecd});
      });
    }

    first.find('[name=search]').unbind('click').click(function (e) {
      // firstPagination(_g.first_page);
      firstPagination(1);
    });
    first.find('[name=add]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm002.html", $("#modal_container"), function () {
        firstModal();
      });
    });
    first.find('[name=edit]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm002.html", $("#modal_container"), function () {
        // var data = tab1_table_init.getrow();
        var data = firstDt.DataTable().row('.active').data();
        if (data) {
          firstModal({
            en: data.en,
            typecd: typecd,
            decd: data.decd,
            version:data.version
          });
        }
      });
    });
    first.find('[name=delete]').unbind('click').click(function (e) {
        zy.ui.mask('删除确认', '是否确认删除此条数据', function () {
          //选择行数据
          // var _data = tab1_table_init.getrow();
          var _data = firstDt.DataTable().row('.active').data();
          zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
          zy.g.am.mod = 'mm';
          zy.net.get('api/deletedata', function (msg) {
            if (msg) {
              zy.ui.msg('提示', '删除成功', 's');
              firstPagination(_g.first_page);
            }
          }, {'typecd':_data.typecd,'decd':_data.decd,'en':_data.en,'mk':_data.mk});
        });
    });
    first.find('[name=copy]').unbind('click').click(function (e) {
      var _node = nodeClick;
      zy.net.loadHTML("md/mm/h2h3.html", $('#modal_container'), function() {
        $('#md_mm_h2h3_title').text('复制');
        
        $('#md_mm_h2h3_form [name=typecd]').val(_node.typecd+"_copy");
        $('#md_mm_h2h3_form [name=parentcd]').val(_node.parentcd).attr('readonly', true);
        $('#md_mm_h2h3_form [name=typenm]').val(_node.typenm+"复制");
        //类别添加默认值
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'mm';
        zy.net.get("api/modalsel2",function(msg){
          $('#md_mm_h2h3_form [name=datatable]').zySelectCustomData('', false, {
            width: '100%'
          }, msg.result);
          $('#md_mm_h2h3_form [name=datatable]').select2('val',_node.datatable);
        },{typecd:_node.typecd});
        $('#md_mm_h2h3_form input[name=status]').zySelect('ZR.0001', false, {
          width: '100%'
        });
        $("#md_mm_h2h3_form input[name=status]").select2('val', _node.status);
        $("#md_mm_h2h3_form input[name=standard]").select2('val', '02');
        $('#md_mm_h2h3').find('footer').find('.btn-default').unbind('click')
          .click(function(){
            //cancle&&cancle();
        })
        $('#md_mm_h2h3').find('.close').click(function(){
          $('#md_mm_h2h3').find('footer').find('.btn-default').click();
        });
  
        $('#md_mm_h2h3').modal('show');
        // Registration validation script
        $("#md_mm_h2h3_form").validate({
          // Rules for form validation
          rules: {
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
          },
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
                  var treeObj = $.fn.zTree.getZTreeObj("md_mmD_index_t2_ztree_tree")||$.fn.zTree.getZTreeObj("tree");
                  var newNode = {
                    typecd: msg.data.typecd,
                    typenm: msg.data.typenm,
                    shownm: msg.data.shownm,
                    datatable: msg.data.datatable
                  };
                  var t = treeObj.getNodeByParam('typecd',_node.parentcd,null);
                  treeObj.addNodes(t, newNode);
                  //submit&&submit(newNode);
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'mm';
              zy.g.am.copytypecd = _node.typecd;
              zy.net.post("api/copydatasourse", callback, $('#md_mm_h2h3_form').serialize());
              $('#md_mm_h2h3_form').formDisable(true);
            }
  
          },
          // Do not change code below
          errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
          }
        });
      });
    });
    first.find('[name=sort]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/h4.html", $("#modal_container"), function () {
        firstSort();
      });
    });
    first.find('[name=export]').unbind('click').click(function (e) {
      var param={
        'typecd':typecd,
        '_is_download':1
      };
      var arr=first.find('.smart-form').serializeArray();
      $.each(arr,function(i,v){
        param[v.name]=v.value
      })
      var options={
        app:'c879dcc94d204d96a98a34e0b7d75676',
        mod:'mm',
        api:'getdatatable'
      }
      data_export.event(options,$("#modal_container"),param)
    });
    
    firstDt.off('click','tr').on('click','tr',function(e){
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      // 数据字典列点击事件
      if ($(e.target).is('[name=_dict_cell]')){
        zy.net.loadHTML('md/mm/tab1_dict_modal.html',$("#modal_container"),function(){
          tab1_dict_modal($(e.target).data('dict'));
        });
      }
      // 变换选择行状态颜色
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        first.find('[name=edit]').btnDisable(true);
        first.find('[name=delete]').btnDisable(true);
      } else {
        firstDt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        first.find('[name=edit]').btnDisable(false);
        first.find('[name=delete]').btnDisable(false);
      }
    })
    .on('dblclick','tr',function(){
      firstDt.find('tr').each(function(index,el){
        if ($(el).hasClass('active')) {
          $(el).removeClass('active');
        }
      })
      $(this).click();
      first.find('[name=edit]').click();
    });

    function secondModal(param) {

      var target = $("#modal_container");

      function check(oldMsg) {
        
        function add(cb) {
          return function (form) {
            var _enval = target.find('[name=en]').val();
            if (zy.tool.checkTableName(_enval)) {
              var _p = target.find('#sys_md_mm003_form').serialize()+'&create_model=1';
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'tableandindex';
              zy.net.post("api/createtable", function (msg) {
                if (msg && msg.ret == '0') {
                  secondInitInner(typecd,datatable,function(){
                    cb && cb();
                  });
                }
              }, _p, null, add_error_cb);
            } else {
              zy.ui.msg('提示', '非法:表物理名为字母（小写）,数字,_且不能以数字开头!', 'i');
            }
          }
        }
        
        function edit(cb) {

          function set(msg) {
            var data = datatable[0].DataTable().row('.active').data();
            $.extend(data, msg);
            datatable[0].DataTable().rows().invalidate().draw();
          }

          return function (form) {

            var _enval = target.find('[name=en]').val();
            if (zy.tool.checkTableName(_enval)) {
              var _p = target.find('#sys_md_mm003_form').serialize();
              var r_param = {
                "_en": oldMsg.en
              };
              _p = _p + '&' + zy.net.parseParam(r_param);
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'tableandindex';
              zy.net.post("api/updatetable", function (msg) {
                if (msg.ret == '0') {
                  set($('#sys_md_mm003_form').form2json());
                  cb && cb();
                } else
                  zy.ui.msg('提示', '接口异常', 'e');

              }, _p);
            } else {
              zy.ui.msg('提示', '非法:表物理名为字母（小写）,数字,_且不能以数字开头!', 'i');
            }
          }
        }

        function alldone() {
          zy.ui.msg("提示信息：", "保存成功！", "s");
          $('#sys_md_mm003').modal('hide');
        }

        function add_error_cb(msg){
          if(msg.ret=='20'){
            $('#sys_md_mm003').modal('hide');
            zy.ui.mask('请确认', '此数据源下已存在此物理表，是否添加映射?', function () {
                var _p = target.find('#sys_md_mm003_form').serialize()+'&create_model=1';
                zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                zy.g.am.mod = 'tableandindex';
                zy.net.get('api/addmapping', function (msg) {
                  if (msg && msg.ret == '0') {
                    secondInitInner(typecd,datatable,function(){
                      cb && cb();
                    });
                  }
                },_p);
              }, function(){
                $('#sys_md_mm003').modal('show');
            });
          }else{
            zy.ui.msg("提示信息：", msg.msg, "w");
          }
        }
        
        var option = {
          rules: {
            typecd: {
              required: true,
              maxlength: 100
            },
            did: {
              required: true,
            },
            en: {
              required: true,
              maxlength: 100
            },
            cn: {
              maxlength: 150
            },
            status: {
              required: true
            },
            mark: {
              maxlength: 600
            }
          },
          submitHandler: param ? edit(alldone) : add(alldone),
          errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
          }
        };

        target.find("#sys_md_mm003_form").validate(option);
        
        //查看SQL语句按钮事件
        target.find('[name=seesql]').click(function(){
          //验证表单
          if(!target.find('#sys_md_mm003_form').valid()){
            return;
          }
          var _p = target.find('#sys_md_mm003_form').serialize()+'&retsql=1';
          //修改时
          if(param){
            var r_param = {
              "_en": oldMsg.en
            };
            _p = _p + '&' + zy.net.parseParam(r_param);
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'tableandindex';
            zy.net.post("api/updatetable", function(msg){
              if (msg && msg.ret == '0') {
                target.find('[name=fullsql]').val(msg.result);
                target.find('[name=fullsql]').show();
                target.find('[name=addsql]').show();
                //addsql文本区change事件
                target.find('[name=addsql]').bind('input',function(){
                  target.find('[name=fullsql]').val(msg.result+' '+$(this).val());
                });
              }
            }, _p)
          }
          //创建时
          else{
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'tableandindex';
            zy.net.post("api/createtable", function (msg) {
                if (msg && msg.ret == '0') {
                  target.find('[name=fullsql]').val(msg.result);
                  target.find('[name=fullsql]').show();
                  target.find('[name=addsql]').show();
                  //addsql文本区change事件
                  target.find('[name=addsql]').bind('input',function(){
                    target.find('[name=fullsql]').val(msg.result+' '+$(this).val());
                  });
                }
              }, _p, null, add_error_cb);
          }
        });
      }

      function init(cb) {
        $("#sys_md_mm003_form input[name=status]").zySelect('ZR.0001', false, {
          width: '100%'
        });
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'tableandindex';
        zy.net.get('api/datasource', function (msg) {
          if (msg.data) {
            $("#sys_md_mm003_form input[name=did]").zySelectCustomData('', false, {
              width: '100%'
            }, msg.data);
            cb && cb();
          } else {
            zy.ui.msg('提示', '接口异常', 'e');
          }
        });
      }

      function add(cb) {
        target.find("#sys_md_mm003_title").text('添加');
        target.find('#sys_md_mm003_form input[name=typecd]').val(typecd);
        target.find('#sys_md_mm003_form input[name=status]').select2('val', '0');
        target.find('#sys_md_mm003_form input[name=did]').select2('val', '00000000000000000000000000000000');
        cb && cb();
      }

      function edit(cb) {
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'tableandindex';
        zy.net.get('api/updatetableupt', function (msg) {
          target.find("#sys_md_mm003_title").text('修改');
          target.find('#sys_md_mm003_form').formDisable(false);
          target.find('#sys_md_mm003_form').json2form(msg.result[0]);
          cb && cb(msg.result[0])
        }, param)
      }

      init(function () {
        if (param)
          edit(function (msg) {
            check(msg);
          });
        else
          add(function () {
            check();
          });
        $('#sys_md_mm003').modal('show');
      })
    }

    function secondIndex(param) {

      var target = $('#modal_container');

      var mod = null, api = null;

      function DataTable(data, cb, c) {

        var columns = [
          {
            "data": "index_name",
            "title": '索引名称'
          },
          {
            "data": "seq_in_index",
            "title": '索引顺序'
          },
          {
            "data": "column_name",
            "title": '列名'
          },
          {
            "data": "collation",
            "title": '升降序'
          },
          {
            "data": "comments",
            "title": '注释'
          },
        ];
        var options = {
          "data": data,
          "columns": columns
        };
        $.extend(options, zy.ui.dataTable);
        $('#md_mm_index').modal('show');
        $('#md_mm_index').on('shown.bs.modal', function (e) {
          c.dataTable(options);
          toolbar(c);
          cb && cb(c, options);
        });
        target.find('[name=delete]').btnDisable(true);
      };

      function Pagination(page, cb, c) {
        var pagination = target.find('[name=pagination]');
        $.jqPaginator(pagination, {
          totalCounts: 1,
          pageSize: zy.g.page.pagesize,
          currentPage: page,
          onPageChange: function (num) {
            SetDt(num, cb, c);
          }
        });
      };

      function init(cb, container) {
        var c = $('<table></table>').addClass('table table-bordered table-striped');
        target.find('.dataTables_wrapper').empty()
          .append(c);
        Pagination(1, cb, target.find('.table-bordered'));
      }

      function SetDt(page, _cb, c) {
        var cb = function (msg) {
          if (msg) {
            if (msg.count > 0 && msg.result.length > 0) {
              target.find('[name=pagination]').jqPaginator('option', {
                totalCounts: msg.count,
                pageSize: zy.g.page.pagesize,
                currentPage: page
              });
            } else {
              target.find('[name=pagination]').jqPaginator('destroy');
            }
            DataTable(msg.result, _cb, c);
          }
        };
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'tableandindex';
        zy.net.get("api/gettableindex", cb, {did: param.did, en: param.en}, page);
      };

      function toolbar(dt) {
        dt.on('click', 'tr', function () {
          if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
            return false;
          $(this).siblings().removeClass('active');
          if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
            $(this).removeClass('active');
            target.find('[name=delete]').btnDisable(true);
          } else {
            $(this).addClass('active');
            target.find('[name=delete]').btnDisable(false);
          }
        });

        target.find('[name=add]').unbind('click');
        target.find('[name=add]').click(function () {
          $('#md_mm_index').modal('hide');
          //zy.net.loadHTML("md/mm/md_mm_index2.html", $("#modal_container1"), function () {
          zy.net.loadHTML("md/mm/md_mm_index2.html", $("#modal_container1"), function () {
            var dt = $('#md_mm_index1_dt');

            function DataTable(data) {
              var columns = [
                {
                  "data": "en"
                },
                {
                  "data": "cn"
                },
                {
                  "data": "fields"
                },
                {
                  "data": "mark"
                },
                {
                  "render": function (data, type, row, meta) {
                    return zy.cache.cd2name('ZR.0001', row.status);
                  }
                }
              ];
              var options = {
                "data": data,
                "columns": columns
              };
              $.extend(options, zy.ui.dataTable);
              $('#md_mm_index1').modal('show');
              $('#md_mm_index1').on('shown.bs.modal', function () {
                dt.dataTable(options);
              })
            };

            function Toolbar() {
              dt.on('click', 'tr', function (e) {
                $(this).siblings().removeClass('active');
                if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
                  return false;
                if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
                  $(this).removeClass('active');
                  $('#md_mm_index1').find('[name=btn_ok]').btnDisable(true);
                } else {
                  $(this).addClass('active');
                  $('#md_mm_index1').find('[name=btn_ok]').btnDisable(false);
                }
              });
              // $('#md_mm_index1').find('[name=btn_ok]').unbind('click');
              $('#md_mm_index1').find('[name=btn_ok]').click(function () {
                var data = dt.DataTable().row('.active').data();
                if (data) {
                  zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                  zy.g.am.mod = 'tableandindex';
                  zy.net.get("api/addtableindex", function (msg) {
                    if (msg && msg.ret == '0') {
                      $('#md_mm_index1').modal('hide');
                      init();
                    }
                  }, {
                    typecd: typecd,
                    did: param.did,
                    en: data.en,
                    table: param.en,
                    fields: data.fields,
                    mark: data.mark
                  });
                }
              });
            };

            function Pagination(page) {
              $.jqPaginator('#md_mm_index1_pagination', {
                totalCounts: 1,
                pageSize: zy.g.page.pagesize,
                currentPage: page,
                onPageChange: function (num) {
                  SetDt(num);
                }
              });
            };

            function SetDt(page) {
              var cb = function (msg) {
                if (msg) {
                  DataTable(msg.result);
                  if (msg.count > 0 && msg.result.length > 0) {
                    $('#md_mm_index1_pagination').jqPaginator('option', {
                      totalCounts: msg.count,
                      pageSize: zy.g.page.pagesize,
                      currentPage: page
                    });
                  } else {
                    $('#md_mm_index1_pagination').jqPaginator('destroy');
                  }
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'indexinfo';
              zy.net.get("api/getindexslist", cb, {typecd: typecd}, page);
            };

            Pagination(1);
            Toolbar();
          });
        });

        target.find('[name=delete]').unbind('click');
        target.find('[name=delete]').click(function () {
          var data = dt.DataTable().row('.active').data();
          if (data) {
            $('#md_mm_index').modal('hide');
            zy.ui.mask('请确认', '确定要删除索引?', function () {
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'tableandindex';
              zy.net.get('api/deletetableindex', function (msg) {
                if (msg && msg.ret == '0') {
                  zy.ui.msg('提示', '删除成功', 's');
                  init();
                }
              }, {typecd: typecd, did: param.did, en: param.en, "index_name": data['index_name']});
            }, function () {
              init();
            })
          }
        })
      }

      init(function () {

      })
    }
    second.find('[name=table]').on('dblclick','tr',function(){
      second.find('[name=table]').find('tr').each(function(index,el){
        if ($(el).hasClass('active')) {
          $(el).removeClass('active');
        }
      });
      $(this).click();
      second.find('[name="edit"]').click();
    });
    second.find('[name=search]').unbind('click').click(function (e) {
      var $this = $(this);
      _btnDis($('[name=tab_second]'), 'search', true);
      secondInitInner(typecd,datatable,function(){
        _btnDis($('[name=tab_second]'), 'search', false);
      });
    });
    second.find('[name=add]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm003.html", $("#modal_container"), function () {
        secondModal();
      });
    });
    second.find('[name=edit]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm003.html", $("#modal_container"), function () {
        var target = datatable[0];
        var data = target.DataTable().row('.active').data();
        if (data)
          secondModal({
            en: data.en,
            did: data.did,
            typecd: typecd
          });
        needparam.en = data.en;
        needparam.did = data.did;
        // secondModal();
      });
    });
    second.find('[name=delete]').unbind('click').click(function (e) {
      var o = datatable[0].DataTable().row('.active').data();
      if (!o)
        return;
      zy.ui.mask('请确认', '确定要删除表?', function () {
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'tableandindex';
        zy.net.get('api/deletetable', function (msg) {
          if (msg && msg.ret == '0') {
            secondInitInner(typecd,datatable,function(){
              zy.ui.msg('提示', '删除成功', 's');
            });
          }
        }, {
          typecd: typecd,
          did: o.did,
          en: o.en
        })
      })
    });
    second.find('[name=data]').unbind('click').click(function (e) {
      var o = datatable[0].DataTable().row('.active').data();
      if (o) {
        
        $('#tab_container').find('li:eq(3)').css('display', 'block');
        var table = new dyTable({
          app: 'c879dcc94d204d96a98a34e0b7d75676',
          api: 'gettabledata',
          mod: 'tableandindex'
        });

        $('#tab_container').tabs({active: 3});
        $('[name=tab_forth]').css("width",$("#tab_first").width());
        var c = $('[name=tab_forth]').children(':eq(3)');
        var dtt = table.init(c, {
          typecd: typecd, did: o.did, en: o.en, where: ''
        }, function (msg, dt) {
          $('[name=tab_forth]').find('[name=total_count]').html('总数:' + msg.count);
          _btnDis($('[name=tab_forth]'), 'edit,delete', true);
          forthToolbar(dt, {
            typecd: typecd, did: o.did, en: o.en, where: ''
          }, table);
        }, function (data) {
          _btnDis($('[name=tab_forth]'), 'edit,delete', false);
        }, function () {
          _btnDis($('[name=tab_forth]'), 'edit,delete', true);
        });
      }
    });
    second.find('[name=index]').unbind('click').click(function (e) {
      zy.net.loadHTML('md/mm/md_mm_index.html', $('#modal_container'), function () {
        var o = datatable[0].DataTable().row('.active').data();
        secondIndex(o);
      })
    });
    second.find('[name=ddl]').unbind('click').click(function (e) {
      zy.net.loadHTML('md/mm/tab2_ddl_modal.html', $('#modal_container'), function () {
        var o = datatable[0].DataTable().row('.active').data();
        ddl_modal({
          'did':o.did,
          'table_name':o.en
        });
      })
    });
    second.find('[name=config-ui]').unbind('click').click(function(e){
      zy.net.loadHTML('md/mm/sys_md_mm005.html', $('#modal_container'), function () {
        var o = datatable[0].DataTable().row('.active').data();
        md_mm005_main(o);
      })
    });

    function thirdModal(param) {

      var target = $("#modal_container");

      function newIndex(cb) {

        var match = {
          name: ['列名', '排序'],
          id: ['column', 'collation']
        }

        function _div() {
          var div = tools.label('div').addClass('row');
          var labelForShow = tools.label('label').addClass('label');
          var labelForSelect2 = tools.label('label').addClass('input');
          var button = tools.label('button').addClass('btn btn-info btn-xs').attr('name', 'delete');
          var ifa = tools.label('i').addClass('fa fa-trash-o ').html('&emsp;删 除');
          var input = tools.label('input').attr({
            "data-type": "select2",
            type: 'hidden'
          });

          $.each(match.name, function (i, v) {
            var _i = input.clone().attr({
              name: match.id[i],
              placeholder: v
            });
            if (v == "列名") {
              var section = tools.label('section').addClass('col col-6');
            }
            else if (v == "排序") {
              var section = tools.label('section').addClass('col col-4');
            }
            var _l2 = labelForSelect2.clone().append(_i);
            var _ls = labelForShow.clone().html(v);
            var _s = section.clone().append(_ls).append(_l2);
            div.append(_s);
          })
          var _d = button.append(ifa);
          var _b = tools.label('section').addClass('col col-1').append(labelForShow.html('&emsp;')).append(_d);
          div.append(_b);
          return div;
        }

        zy.g.am.app = "c879dcc94d204d96a98a34e0b7d75676";
        zy.g.am.mod = "indexinfo";
        zy.net.get("api/columnselect2", function (msg) {
          if (msg.result) {
            var div = _div();
            div.find('input[name=column]').zySelectCustomData('', false, {width: '100%'}, msg.result);
            div.find('input[name=collation]').zySelectCustomData('', false, {width: '100%'}, [{
              id: "asc",
              name: "升序"
            }, {id: "desc", name: "降序"}]);
            $('#sys_md_mm004_form').children('fieldset').append(div);
            cb && cb(div, msg.result);
          } else {
            zy.ui.msg('提示', '接口异常', 'e');
          }
        }, {typecd: typecd});
        $("#sys_md_mm004_form").find('[name=delete]').click(function (e) {
          $(this).closest(".row").remove();
        });
      }

      function check(oldMsg) {

        if (!oldMsg)
          newIndex();

        function add(cb) {
          return function (form) {
            var _enval = target.find('[name=en]').val();
            if (zy.tool.checkTableName(_enval)) {
              var _p = target.find('#sys_md_mm004_form').serialize();
              var length = $('#sys_md_mm004_form').children('fieldset').children(':gt(3)').first(".row").length;
              if (length > 0) {
                zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                zy.g.am.mod = 'indexinfo';
                zy.net.post("api/addindex", function (msg) {
                  if (msg.ret == '0') {
                    thirdInitInner(typecd,datatable,function(){
                      cb && cb();
                    });
                  }
                }, _p);
              }
              else {
                zy.ui.msg('提示', '索引不可为空', 'i');
              }
            } else {
              zy.ui.msg('提示', '非法:索引物理名为字母（小写）,数字,_且不能以数字开头!', 'i');
            }
          }
        }

        function edit(cb) {

          function set(msg) {
            var data = datatable[1].DataTable().row('.active').data();
            $.extend(data, msg);
            datatable[1].DataTable().rows().invalidate().draw();
          }

          return function (form) {
            var _enval = target.find('[name=en]').val();
            if (zy.tool.checkTableName(_enval)) {
              var _p = target.find('#sys_md_mm004_form').serialize();
              var r_param = {
                "_en": oldMsg.en
              };
              _p = _p + '&' + zy.net.parseParam(r_param);
              var length = $('#sys_md_mm004_form').children('fieldset').children(':gt(3)').first(".row").length;
              if (length > 0) {
                zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                zy.g.am.mod = 'indexinfo';
                zy.net.post("api/updateindex", function (msg) {
                  if (msg.ret == '0') {

                    set($('#sys_md_mm004_form').form2json());
                    cb && cb();
                  } else
                    zy.ui.msg('提示', '接口异常', 'e');

                }, _p);
              }

              else {
                zy.ui.msg('提示', '索引不可为空', 'i');
              }
            } else {
              zy.ui.msg('提示', '非法:索引物理名为字母（小写）,数字,_且不能以数字开头!', 'i');
            }
          }
        }

        function alldone() {
          zy.ui.msg("提示信息：", "保存成功！", "s");
          $('#sys_md_mm004').modal('hide');
        }

        var option = {
          rules: {
            typecd: {
              required: true,
              maxlength: 100
            },
            en: {
              required: true,
              maxlength: 100
            },
            cn: {
              maxlength: 100
            },
            status: {
              required: true
            },
            mark: {
              maxlength: 600
            },
            column: {
              required: true
            },
            collation: {
              required: true
            }
          },
          submitHandler: param ? edit(alldone) : add(alldone),
          errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
          }
        };

        target.find("#sys_md_mm004_form").validate(option);
      }

      function init(cb) {
        $("#sys_md_mm004_form input[name=status]").zySelect('ZR.0001', false, {
          width: '100%'
        });

        $('#sys_md_mm004_help').unbind()
          .click(function (e) {
            newIndex();
          });
        cb && cb();
      }

      function add(cb) {
        target.find("#sys_md_mm004_title").text('添加');
        target.find('input[name=typecd]').val(typecd);
        target.find('input[name=status]').select2('val', '0');
        cb && cb();
      }

      function edit(cb) {
        oldvalue = {
          typecd: typecd,
          en: param.en

        };
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'indexinfo';
        zy.net.get('api/getindexsupd', function (msg) {
          $('#sys_md_mm004_form').children('fieldset').children(':gt(3)').remove();
          target.find('#sys_md_mm004_form').formDisable(false);
          if (msg.result && msg.result.length > 0) {
            $.each(msg.result[0]['fields_arr'], function (i, v) {
              newIndex(function (row, msg) {
                var flg = false;
                $.each(msg, function (ii, vv) {
                  if (vv.id == v.column) {
                    flg = true;
                    return false;
                  }
                });

                if (flg) {
                  $.each(v, function (ii, vv) {
                    row.find('[name="' + ii + '"]').select2('val', vv);
                  })
                } else {
                  row.remove();
                }
              })

            })
          }
          target.find('#sys_md_mm004_form').json2form(msg.result[0]);

          cb && cb(msg.result[0], oldvalue);
        }, oldvalue)
        target.find("#sys_md_mm004_title").text('修改');
        target.find('input[name=typecd]').val(typecd);
      }

      init(function () {
        if (param)
          edit(function (msg) {
            check(msg);
          });
        else
          add(function () {
            check();
          });
        $('#sys_md_mm004').modal('show');
      })
    }
    third.find('[name=table]').on('dblclick','tr',function(){
       third.find('[name=table]').find('tr').each(function(index,el){
        if ($(el).hasClass('active')) {
          $(el).removeClass('active');
        }
      });
      $(this).click();
      third.find('[name="edit"]').click();
    });
    third.find('[name=add]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm004.html", $("#modal_container"), function () {
        thirdModal();
      });
    });
    third.find('[name=delete]').unbind('click').click(function (e) {
      var o = datatable[1].DataTable().row('.active').data();
      if (!o)
        return;
      zy.ui.mask('请确认', '确定要删除索引?', function () {
        zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
        zy.g.am.mod = 'indexinfo';
        zy.net.get('api/deleteindex', function (msg) {
          if (msg && msg.ret == '0') {
            thirdInitInner(typecd,datatable,function(){
              _btnDis($('[name=tab_third]'), 'edit,delete', true);
              zy.ui.msg('提示', '删除成功', 's');
            });
          }
        }, {
          typecd: typecd,
          did: o.did,
          en: o.en
        })
      })
    });
    third.find('[name=edit]').unbind('click').click(function (e) {
      zy.net.loadHTML("md/mm/sys_md_mm004.html", $("#modal_container"), function () {
        var data = datatable[1].DataTable().row('.active').data();
        if (data)
          thirdModal(data);
      });
    });
    third.find('[name=search]').unbind('click').click(function (e) {
      var $this = $(this);
      _btnDis($('[name=tab_third]'), 'search', true);
      thirdInitInner(typecd,datatable,function(){
        _btnDis($('[name=tab_third]'), 'search', false);
      });
    });
    
    
    fifth.find('[name=search]').unbind('click').click(function (e) {
      var $this = $(this);
      _btnDis($('[name=tab_fifth]'), 'search', true);
      fifthInitInner(typecd,datatable,function(){
        _btnDis($('[name=tab_fifth]'), 'search', false);
      });
    });

    function forthToolbar(dt, _p, table) {
      var jason={};
      var exitfile_name;

      var dtt = dt;

      var _t = $('[name=tab_forth]').children(':eq(3)');

      function forthModal(param) {
        var target = $('#modal_container');

        function init(cb) {

          zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
          zy.g.am.mod = 'tableandindex';
          zy.net.get('api/getcolumninfo', function (msg) {
            if (msg && msg.ret == '0') {
              var formContainer = target.find('.modal-body');
             
              var _dyForm = new dyForm();
              var form = _dyForm.modalform(msg.type, function () {
                 
                var json = form.form2json();
                if (!param) {
                  zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676',
                    zy.g.am.mod = 'tableandindex';
                  zy.net.post('api/addtabledata', function (msg) {
                    if (msg && msg.ret == '0') {
                      zy.ui.msg('提示', '添加成功', 's');
                      alldone(msg);
                    }
                  }, $.extend(true, json, {
                    '_typecd': _p.typecd,
                    '_did': _p.did,
                    '_en': _p.en
                  }));
                } else {
                  zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676',
                    zy.g.am.mod = 'tableandindex';
                  zy.net.post('api/updatetabledata', function (msg) {
                    if (msg && msg.ret == '0') {
                       var pp=$.extend(true, json,jason)
                      zy.ui.msg('提示', '修改成功', 's')
                      alldone(msg);
                    }
                  }, $.extend(true, json,jason, {
                    '_typecd': _p.typecd,
                    '_did': _p.did,
                    '_en': _p.en
                  }));
                }
              }, function () {
               
                $('#md_mm_h5h6').modal('hide');
              });
              formContainer.append(form);
              cb && cb(form);
            } else {
              zy.ui.msg('提示', '接口异常', 'w');
            }
          }, {typecd: typecd})
        }

        function add(form, cb) {
          cb && cb();
        }

        function edit(form, cb) {
          form.json2form(param);
          var formContainer=$('#modal_container').find('.modal-body')
          var result=formContainer.form2json();
              $.each(result,function(i,v){
                i='__'+i;
                jason[i]=v
              })
        }

        init(function (form) {
          if (param)
            edit(form, function (msg) {
              // check(msg);
            });
          else
            add(form, function () {
              // check();
            });
          $('#md_mm_h5h6').modal('show');
        })
      }

      /**刷新表格，隐藏模态*/
      function alldone() {
        _btnDis($('[name=tab_forth]'), 'edit,delete', true);
        var t = forth.find('form').form2json();
        table.init(_t, $.extend(true, t, _p), function (msg, dt) {
          $('[name=tab_forth]').find('[name=total_count]').html('总数:' + msg.count);
          dtt = dt;
        }, function (data) {
          _btnDis($('[name=tab_forth]'), 'edit,delete', false);
        }, function () {
          _btnDis($('[name=tab_forth]'), 'edit,delete', true);
        });
        $('#md_mm_h5h6').modal('hide');
      }
      forth.find('table').on('dblclick','tr',function(){
        forth.find('table').find('tr').each(function(index,el){
          if ($(el).hasClass('active')) {
            $(el).removeClass('active');
          }
        });
        $(this).click();
        forth.find('[name="edit"]').click();
      });
      forth.find('[name=search]').unbind('click').click(function (e) {

          var t = $(this).closest('form').form2json();

          table.init(_t, $.extend(true, t, _p), function (msg, dt) {
            $('[name=tab_forth]').find('[name=total_count]').html('总数:' + msg.count);
            dtt = dt;
          }, function (data) {
            _btnDis($('[name=tab_forth]'), 'edit,delete', false);
          }, function () {
            _btnDis($('[name=tab_forth]'), 'edit,delete', true);
          });
        });
      forth.find('[name=add]').unbind('click').click(function (e) {
          zy.net.loadHTML('md/mm/h5h6.html', $('#modal_container'), function () {
            forthModal();
          });
        });
      forth.find('[name=edit]').unbind('click').click(function (e) {
          var data = dtt.DataTable().row('.active').data();
          if (!data)
            return;
          zy.net.loadHTML('md/mm/h5h6.html', $('#modal_container'), function () {
            forthModal(data);
          });
        });
      forth.find('[name=delete]').unbind('click').click(function (e) {
          var data = dtt.DataTable().row('.active').data();
          if (!data)
            return;

          zy.ui.mask('请确认', '确定要删除数据?', function () {
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'tableandindex';
            zy.net.post('api/deletetabledata', function (msg) {
              if (msg && msg.ret == '0') {
                zy.ui.msg('提示', '删除成功', 's');
                alldone();
              }
            }, $.extend(true, {
              _typecd: typecd,
              _did: _p.did,
              _en: _p.en
            }, data))
          })
        });
      forth.find('[name=param]').unbind('click').click(function (e) {
          zy.net.loadHTML('md/mm/tab4_where_conditions.html', $('#modal_container1'), function () {
            function async(num) {
              var padding = (function (num) {
                return function (callback) {
                  var i = 0;
                  var arr = [];
                  return function (msg) {
                    if (msg) {
                      arr.push(msg);
                      i++;
                      if (i == num)
                        callback && callback(arr);
                    }
                  }
                }
              })(num);
              return padding;
            }

            var async = async(2);
            var alldone = async(function (result) {
              $('#tab4_where_conditions').modal('show');
            });

            function Select() {
              function cb() {
                $("#tab4_where_conditions_form input[name=condition]").zySelect('ZR.0049', false, {
                  width: '100%'
                });
                $("#tab4_where_conditions_form input[name=collation]").zySelect('ZR.0050', false, {
                  width: '100%'
                });
                alldone(1);
              }

              zy.cache.initDicts('ZR.0049,ZR.0050', cb);
            }

            function column() {
              var cb_column = function (msg) {
                if (msg) {
                  $("#tab4_where_conditions_form input[name=column]").zySelectCustomData('', false, {
                    width: '100%'
                  }, msg.result);
                  $("#tab4_where_conditions_form input[name=column1]").zySelectCustomData('', false, {
                    width: '100%'
                  }, msg.result);
                  alldone(msg);
                }
              };
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'indexinfo';
              zy.net.get('api/columnselect2', cb_column, {
                typecd: typecd
              });

            }

            function tools() {

              var target = $('#tab4_where_conditions_form');
              var _text = "";
              var wherearea = $('#tab4_where_conditions_form').find('[name=wherearea]');
              var onarea = $('#tab4_where_conditions_form').find('[name=onarea]');

              $('#tab4_where_conditions_form').find('[name=condition]').change(function (e) {
                var $this = $(this);
                if ($this.val() == '')
                  return;
                var name = $this.select2('data').name
                if (name == 'BETWEEN' || name == 'NOT BETWEEN')
                  target.find('[name=value2]').closest('section').show();
                else
                  target.find('[name=value2]').closest('section').hide();
                target.find('[name=value2]').val('');
              })

              //and
              $('#tab4_where_conditions_form').find('[name=and]').click(function (e) {
                var col = target.find('[name=column]').val();
                var _condition = target.find('[name=condition]').val();
                _condition = _condition == '' ? _condition : target.find('[name=condition]').select2('data').name;
                var _value = target.find('[name=value]').val();
                var _value2 = target.find('[name=value2]').val();
                var oldValue = wherearea.val();
                oldValue = oldValue == "''" || oldValue == "" ? '' : oldValue + ' and ';
                if (_condition == "IS NOT NULL" || _condition == "IS NULL") {
                  wherearea.val(oldValue + col + " " + _condition);
                  return;
                }
                if (_condition == 'LIKE' || _condition == 'NOT LIKE') {
                  wherearea.val(oldValue + col + ' ' + _condition + " '%" + _value + "%' ");
                  return;
                }
                if (_condition == 'IN' || _condition == 'NOT IN') {
                  wherearea.val(oldValue + col + ' ' + _condition + " ('" + _value + "') ");
                  return;
                }
                if (_condition == 'BETWEEN' || _condition == 'NOT BETWEEN') {
                  if (col == '' || _condition == '' || _value == '' || _value2 == '')
                    return zy.ui.msg('提示', '语法非法', 'i');
                  wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' and '" + _value2 + "'");
                  return;
                }
                if (col == '' || _condition == '' || _value == '')
                  return zy.ui.msg('提示', '语法非法', 'i');
                wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' ");
              });

              //or
              $('#tab4_where_conditions_form').find('[name=or]').click(function (e) {
                var col = target.find('[name=column]').val();
                var _condition = target.find('[name=condition]').val();
                _condition = _condition == '' ? _condition : target.find('[name=condition]').select2('data').name;
                var _value = target.find('[name=value]').val();
                var _value2 = target.find('[name=value2]').val();
                var oldValue = wherearea.val();
                oldValue = oldValue == "''" || oldValue == "" ? '' : oldValue + ' or ';
                if (_condition == "IS NOT NULL" || _condition == "IS NULL") {
                  wherearea.val(oldValue + col + " " + _condition);
                  return;
                }
                if (_condition == 'LIKE' || _condition == 'NOT LIKE') {
                  wherearea.val(oldValue + col + ' ' + _condition + " '%" + _value + "%' ");
                  return;
                }
                if (_condition == 'IN' || _condition == 'NOT IN') {
                  wherearea.val(oldValue + col + ' ' + _condition + " ('" + _value + "') ");
                  return;
                }
                if (_condition == 'BETWEEN' || _condition == 'NOT BETWEEN') {
                  if (col == '' || _condition == '' || _value == '' || _value2 == '')
                    return zy.ui.msg('提示', '语法非法', 'i');
                  wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' and '" + _value2 + "'");
                  return;
                }
                if (col == '' || _condition == '' || _value == '')
                  return zy.ui.msg('提示', '语法非法', 'i');
                wherearea.val(oldValue + col + ' ' + _condition + " '" + _value + "' ");
              });
              //on
              $('#tab4_where_conditions_form').find('[name=on]').click(function (e) {
                var col = target.find('[name=column1]').val();
                var _collation = target.find('[name=collation]').val();
                _collation = _collation == '' ? _collation : target.find('[name=collation]').select2('data').name;
                var oldValue = $('[name=onarea]').val();
                oldValue = oldValue == "''" || oldValue == "" ? 'order by ' : oldValue + ' , ';

                if (col == '' || _collation == '')
                  return zy.ui.msg('提示', '语法非法', 'i');
                onarea.val(oldValue + col + " " + _collation);
              });
              //确定
              $('#tab4_where_conditions').find('[name=btn_ok]').click(function (e) {
                var _wherearea = wherearea.val();
                var _onarea = onarea.val();
                $('#tab4_where_conditions').modal('hide');
                $('[name=tab_forth]').find('[name=wherearea]').val(_wherearea + ' ' + _onarea);
              });
              //取消
              $('#tab4_where_conditions').find('[name=btn_cancel]').click(function (e) {
                $('#tab4_where_conditions').modal('hide');
              });
            }

            Select();
            column();
            tools();
          })
        })
      forth.find('[name=export]').unbind('click').click(function (e) {
          var options={
            app:'c879dcc94d204d96a98a34e0b7d75676',
            mod:'export_data',
            api:'main'
          }
          var param={
            did: _p.did,
              en: _p.en,
              where: $('#tab_forth').find('textarea').val(),
          }
          data_export.event(options,$('#modal_container'),param)
         
        });
      forth.find('[name=inport]').unbind('click').click(function (e) {
        zy.net.loadHTML('md/ex_inport/inport.html', $('#modal_container'), function () {
          var InportModal = $('#inport');
          InportModal.modal('show');
          var datainfo = $('#datainfo').children().clone();

          function inportInit() {
            InportModal.find('#datainfo').children().remove();
            var cb = function () {
              InportModal.find('[name=delimiter]').zySelect('csv01', false, {
                width: '100%',
                allowClear: false
              });
              InportModal.find('[name=quoteChar]').zySelect('csv03', false, {
                width: '100%'
              });
              InportModal.find('[name=charset]').zySelect('charset01', false, {
                width: '100%',
                allowClear: false
              });
              InportModal.find('[name=header]').zySelect('ZR.0045', false, {
                width: '100%',
                allowClear: false
              });
              InportModal.find('[name=header]').select2('val', '1');
              InportModal.find('[name=charset]').select2('val', 'GBK');
              InportModal.find('[name=delimiter]').select2('val', '01');
              InportModal.find('[name=quoteChar]').select2('val', '01');
            }

            zy.cache.initDicts('csv01,csv02,csv03,charset01,ZR.0045', cb);
            
            //下载模板按钮事件
            InportModal.find('[name=download_template]').click(function(){
              zy.g.am.app='c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod='import_data';
              zy.net.postDownload('download/export_template',{typecd:_p.typecd});
            });

          }

          function makelabel(data, array) {
            var k = $('#table_col').children();
            var m = $('#csv_col').children();
            k.remove();
            m.remove();
            var _selectlabel = $('<label>').addClass('select');
            var _select = $('<select>').attr({
              'aria-required': true,
              'aria-invalid': false,
              'name': 'select'
            });
            
            $.each(array, function (ii, vv) {
              var option = $('<option>');
                option.html(vv.name);
                option.attr('value', vv.id);

              _select.append(option);
            });
            _selectlabel.append(_select).append($('<i>'));

            //
            $.each(data, function (i, v) {
              var label = $('<label>').addClass('input');
              var input = $('<input>').attr('readonly', 'readonly');
              input.attr({'value': v.column_cn, 'en': v.column_en,'mk':v.mk});
              label.append(input);
              $('#table_col').append(label).append($('<br>'));
              var selectlabel = _selectlabel.clone();
              $('#csv_col').append(selectlabel).append($('<br>'));
            })
            
            if(InportModal.find('[name=operation]:checked').val()=='insert'){
            insert();
            $('#optionrationtitle').html('insert');
            $('#op_title').html('');
            }
            if(InportModal.find('[name=operation]:checked').val()=='update'){
            update();
            $('#optionrationtitle').html('update');
            $('#op_title').html('-根据主键更新');
            }
            if(InportModal.find('[name=operation]:checked').val()=='delete'){
              deletef()
            $('#optionrationtitle').html('delete');
            $('#op_title').html('-根据主键删除');
            }
            

          }
          
          function insert(){
            var input = $('#table_col').find('input');
            var select = $('#csv_col').find('select');
            var length=input.length;
            
            for(i=0;i<length;i++){
              var en=$(input[i]).attr('en');
              var option=$(select[i]).children();
              $.each(option,function(i,v){
                $(v).removeAttr('selected');
                // if(en==$(v).val()){
                //   $(target).removeAttr('selected');
                //   var target= $(select[i]).children()[i];
                //   $(target).attr('selected','')
                // }
                if(en==$(v).val()){
                  $(v).attr('selected','');
                }
               
              })
          }
          }
          
          function update(){
            var input = $('#table_col').find('input');
            var select = $('#csv_col').find('select');
            var option=$('#csv_col').find('select option')
            var ll=option.length;
            var length1=input.length;
            var length=ll/length1;
            for(i=0;i<length;i++){
              var en=$(input[i]).attr('en');
              var option=$(select[i]).children();
              $.each(option,function(i,v){
                $(v).removeAttr('selected');
                if(en==$(v).val()){
                  $(v).attr('selected','')
                }else{
                  var target= $(select[i]).children()[length-1];
                  if($(input[i]).attr('mk')!=1)
                  $(target).attr('selected','')
                }
              })
          }
          }
          
          function deletef(){
             var input = $('#table_col').find('input');
            var select = $('#csv_col').find('select');
            var length=input.length;
            
            for(i=0;i<length;i++){
              var en=$(input[i]).attr('en');
              var option=$(select[i]).children();
              $.each(option,function(i,v){
                $(v).removeAttr('selected');
                if(en==$(v).val()){
                  $(v).attr('selected','')
                }
              })
          }
          }

          function maketable(arr,data) {
            var nport_table = $('#inporttable').children();
            nport_table.remove();
            var table = $('<table>').addClass('table table-striped table-responsive table-bordered smart-form');
            var thead=$('<thead>');
            var _th=$('<th>');
            var _tr=$('<tr>');
            $.each(data,function(ii,vv){
              var th=_th.clone();
              th.html(vv);
              _tr.append(th)
              thead.append(_tr)
              
            })
            table.append(thead)
            $.each(arr, function (i, v) {
              if (i <= 9) {
                var tr = $('<tr>');
                var _td = $('<td>');
                $.each(v, function (ii, vv) {
                  var td = _td.clone();
                  td.html(vv);
                  tr.append(td);
                })
                table.append(tr);
              }
            })
            $('#inporttable').append(table);
          }

          function checkFile() {
            var container = InportModal.find('#fileinfo');
            var filename = container.find('[type=file]').val();
            var finalname=filename.split('.')[1];
            var escapename=InportModal.find('[name=escape]').val();
            if(escapename.length>1){
              zy.ui.msg('提示信息','转义字符的长度为1','w');
              return true
            }
            if (filename == '') {
              zy.ui.msg('提示信息', "请选择要导入的文件", 'w');
              return true;

            } else {
              if(finalname.toLowerCase()!='csv'){
              zy.ui.msg('提示信息', "请选择csv类型的文件", 'w');
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
                  InportModal.find('#datainfo').append(datainfo);
                  $('#rootwizard').bootstrapWizard('next');
                  maketable(_mm.result[0].preview_data,_mm.result[0].preview_header);
                  makelabel(_mm.result[0].table_col, _mm.result[0].map_col);

                }
              }

              var _file_name = msg[0].file_name;
              exitfile_name = msg[0].file_name;
              var param = {
                header:InportModal.find('[name=header]').val(),
                operation:InportModal.find('[name=operation]:checked').val(),
                type:InportModal.find('[name=radio]').val(),
                did: _p.did,
                en: _p.en,
                file_name: _file_name,
                delimiter: InportModal.find('[name=delimiter]').val(),
                quoteChar: InportModal.find('[name=quoteChar]').val(),
                escape: InportModal.find('[name=escape]').val(),
                charset: InportModal.find('[name=charset]').val()
              }
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'import_data';
              zy.net.get('api/parse_csv', cb, param,null,function(mm){
                    zy.ui.msg('提示信息',mm.msg,'w')
                  });
            }


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
              function getmapping() {
                var input = $('#table_col').find('input');
                var select = $('[name=select]');
                var _mapping = {};
                $.each(input, function (i, v) {
                  $.each(select, function (ii, vv) {
                    if (i == ii)
                      _mapping[$(v).attr('en')] = $(vv).val()
                  })
                })
                return _mapping
              }

              var map = getmapping();
              var param = {
                operation:InportModal.find('[name=operation]:checked').val(),
                type: InportModal.find('[name=radio]').val(),
                mapping: JSON.stringify(map),
                did: _p.did,
                en: _p.en,
                file_name: exitfile_name,
                delimiter: InportModal.find('[name=delimiter]').val(),
                quoteChar: InportModal.find('[name=quoteChar]').val(),
                escape: InportModal.find('[name=escape]').val(),
                charset: InportModal.find('[name=charset]').val()
              }
              var cb = function (msg) {

                if (msg.ret=='0'){
                zy.ui.msg('提示信息', '导入成功', 's');
                InportModal.modal('hide');
                }
              }
              zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
              zy.g.am.mod = 'import_data';
              zy.net.get('api/main', cb, param,null,function(msg){
                zy.ui.msg('提示信息', '导入失败:'+msg.msg, 'e');
              })
            });

            $('[name=nexttab]').click(function () {
              var index = $('#rootwizard').bootstrapWizard('currentIndex')
              if (index == 0) {
                // var target = $($('.tab-content').find('.active')).find('.panel-body');
                var result = checkFile();
                if (result) {
                  return
                } else {
                  var filename = InportModal.find('[type=file]').val();
                  var cb = function (msg) {

                    if (msg.ret=='0' &&msg.result.length > 0) {
                      getresult(msg.result);

                    }
                  }
                  
                  zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
                  zy.g.am.mod = 'import_data';
                  zy.net.postForm('upload/upload_file', InportModal.find('#filemsg'), cb,null,function(mm){
                    zy.ui.msg('提示信息',mm.msg,'w')
                  })

                }


              }
            })


          }
        });
      });
    }
  }

  return sys_md_mm;
})();
