/**
 * 服务器列表
 * @class EtlGetTaskJList
 */
EtlGetTaskList = (function () {

  var PT = EtlGetTaskList.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    page: 1, //开始页数
    count: 1, //总记录数
    tasktype_value: 'job' //记录select2当前选择value,默认为job
  };

  //表格元素对象
  var dt = $('#etl_gettasklist_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MdmMoniEquipH19
   * @constructor
   */
  function EtlGetTaskList() {
    Console.log("new EtlGetTaskList()");
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
    thiz.TreeChange();
    thiz.DataTable();
    thiz.Toolbar();
    $('#etl_gettasklist_start').btnDisable(true);
    $("#etl_routeSel").attr('readonly', true);
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width','100%');
    $('.dataTables_scrollBody table').css('width','100%');
    $('.dataTables_scrollHeadInner table').css('width','100%');
  }
  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns;
    if (thiz._g.tasktype_value == "trans") {
      columns = [
        {
          "data": "id_transformation"
        },
        {
          "data": "id_directory"
        },
        {
          "data": "name"
        },
        {
          "data": "trans_version"
        },
        {
          "data": "description"
        },
        {
          "data": "created_user"
        },
        {
          "render": function (data, type, row, meta) {
            return $.format.date(row.created_date, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
           "data":"modified_user"
        },
        {
          "render": function (data, type, row, meta) {
            return $.format.date(row.modified_date, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
          "render": function (data, type, row, meta) {
            return zy.cache.cd2name('ZR.0013', row.trans_status);
          }
        }
      ];
    } else {
      columns = [
        {
          "data": "id_job"
        },
        {
          "data": "id_directory"
        },
        {
          "data": "name"
        },
        {
          "data": "job_version"
        },
        {
          "data": "description"
        },
        {
          "data": "created_user"
        },
        {
          "render": function (data, type, row, meta) {
            return $.format.date(row.created_date, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
          "data": "modified_user"
        },
        {
          "render": function (data, type, row, meta) {
            return $.format.date(row.modified_date, 'yyyy-MM-dd HH:mm:ss');
          }
        },
        {
          "render": function (data, type, row, meta) {
            return zy.cache.cd2name('ZR.0013', row.job_status);
          }
        }
      ];
    }

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
      Console.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#etl_gettasklist_start').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#etl_gettasklist_start').btnDisable(false);
      }
    });

    //查询
    $('#etl_gettasklist_search').click(function () {
      $('#etl_gettasklist_search').button('loading');
      thiz.Pagination(1);
    });
    //启动服务
    $('#etl_gettasklist_start').click(function () {
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#etl_gettasklist_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        Console.log('onPageChange num = ' + num);
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
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      $('#etl_gettasklist_start').btnDisable(true);
      if (msg) {
        $('#etl_gettasklist_search').button('reset');
        thiz._g.count = msg.count; //获取总记录数
        thiz.DataTable(msg.tasklist);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#etl_gettasklist_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#etl_gettasklist_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    //zy.g.comm={};
    //zy.g.host.api="192.168.7.113:8080";
    zy.net.get("ETLServer/api/gettasklist", cb, $('#etl_gettasklist_form').serialize(), page);
  };
  PT.Select = function () {
    // 数据字典处理
    var cb = function () {
      // 字典数据绑定
      $("#etl_gettasklist_form input[name=status]").zySelect('ZR.0013', true, {
        width: '100%'
      });
      $("#etl_gettasklist_form input[name=tasktype]").zySelect('ZR.0012', false, {
        width: '100%'
      });
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001,ZR.0012,ZR.0013', cb);
    $("#etl_gettasklist_form input[name=tasktype]").select2('val','job');
  };

  PT.TreeChange = function () {
    //资源库路径
    var etl_urlname = "";
    var etl_setting = {
      data: {
        key: {
          name: "directory_name"
        },
        simpleData: {
          enable: true,
          idKey: "id_directory",
          pIdKey: "id_directory_parent"
        }
      },
      callback: {
        onClick: zTreeOnClick
      },
      view: {
        selectedMulti: false,
        showIcon: false
      }
    };
    //tree点击事件
    function zTreeOnClick(event, treeId, treeNode) {
      etl_urlname = "";
      var treeNode_cur = treeNode;
      for (var i = 0; i <= treeNode.level; i++) {
        etl_urlname = treeNode_cur.directory_name + "/" + etl_urlname;
        treeNode_cur = treeNode_cur.getParentNode();
      }
      $("#etl_routeSel").attr("value", etl_urlname);
      $("#etl_gettasklist_form input[name=dir]").val(treeNode.id_directory);
      $("#etl_menuContent").fadeOut("fast");
      console.log("urlnm:" + etl_urlname);
      console.log("urlvalue:" + $("#etl_gettasklist_form input[name=dir]").val());
    }
    var gettasklist_cb = function (msg) {
      $.fn.zTree.init($("#tree_api"), etl_setting, msg.dirlist);
    };
    zy.net.get("ETLServer/api/getalldirlist", gettasklist_cb, "");
  };

  $('#etl_gettasklist_form input[name=tasktype]').on("change", function () {
    var tasktype = $("#etl_gettasklist_form input[name=tasktype]").val();
    if (tasktype == "" || tasktype == null) {
      $("#etl_gettasklist_form input[name=tasktype]").val('job');
    }
    thiz._g.tasktype_value = $("#etl_gettasklist_form input[name=tasktype]").val();
    Console.log("选择脚本类型：" + $("#etl_gettasklist_form input[name=tasktype]").val());
  });

  $('#etl_menuBtn').click(function () {
    var routeSelObj = $("#etl_routeSel");
    var routeSelOffset = $("#etl_routeSel").offset();
    $("#etl_menuContent").css({
      left: routeSelOffset.left + "px",
      top: routeSelOffset.top + routeSelObj.outerHeight() + "px"
    }).slideDown("fast");
    $("article").bind("mousedown", onBodyDown);

    function onBodyDown(event) {
      if (!(event.target.id == "etl_menuBtn" || event.target.id == "etl_menuContent" || $(event.target).parents("#etl_menuContent").length > 0)) {
        $("#etl_menuContent").fadeOut("fast");
        $("article").unbind("mousedown", onBodyDown);
      }
    }
    return false;
  });
  return EtlGetTaskList;
})();