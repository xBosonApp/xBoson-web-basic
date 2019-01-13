/**
 * Created by chenqi1 on 2014/7/25.
 */
/**
 * 平台配置属性管理
 * @class MgtConfig
 */
MgtConfig = (function () {

  var PT = MgtConfig.prototype;
  var thiz;


  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    crt_page: 1 //当前页
  };

  //表格元素对象
  var dt = $('#mgt_config_dt');


  function MgtConfig() {

    thiz = this;
    thiz.Init();
    thiz.Select();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    thiz.DataTable();
    thiz.Toolbar();
    thiz.dialogInit();

    $('#mgt_config_edit').btnDisable(true);
    $('#mgt_config_delete').btnDisable(true);
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

    var columns = [
      {
        "title": "配置属性键",
        "data": "config_key"
      },
      {
        "title": "配置属性值",
        "data": "config_value"
      },
      {
        "title": "配置属性说明",
        "data": "config_desc"
      },

      {
        "title": "状态",
        "render": function (data, type, row, meta) {
          var _data, str, str0, str1;
          // 参数设置
          _data = 'data-config_key=\'' + row.config_key + '\'';
          _data += ' data-status=\'' + row.status + '\'';
          if (row.status === '1') {
            str0 = '';
            str1 = 'checked=\'checked\'';
          } else {
            str0 = 'checked=\'checked\'';
            str1 = '';
          }
          str = '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'0\' ' + str0 + '><span>无效</span></label></div>';
          str += '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'1\' ' + str1 + '><span>有效</span></label></div>';
          return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'mgt_config_status_form\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button id=\'mgt_config_status\' class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + zy.cache.cd2name('ZR.0001', row.status) + '</a>';
        }
      }
    ];
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
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;

      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
        window.ko=$(e.target).parents("form");
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#mgt_config_edit').btnDisable(true);
        $('#mgt_config_delete').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#mgt_config_edit').btnDisable(false);
        $('#mgt_config_delete').btnDisable(false);
      }
    });

    //查询
    $('#mgt_config_search').click(function () {
      $('#mgt_config_edit').btnDisable(true);
      $('#mgt_config_delete').btnDisable(true);
      $('#mgt_config_search').button('loading');
      Pagination(1);

    });
    //添加
    $('#mgt_config_add').click(function () {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("mgt/config/add_updConfig.html", $("#mgt_config_form2"), function () {
        $("#add_updConfig_title").text('添加');
      });
      thiz.add_upd();
    });
    //修改
    $('#mgt_config_edit').click(function () {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.config_key = data.config_key; //获取选择行数据，设置参数
      zy.net.loadHTML("mgt/config/add_updConfig.html", $("#mgt_config_form2"), function () {
        var callback = function (msg) {
          $('#add_updConfig_form').formDisable(false);
          if (msg) {
            $('#add_updConfig_form').json2form(msg.result[0]);
          }
        }
        var config_key = {
          config_key: thiz._g.param.config_key
        };
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'config_mgt';
        zy.net.get("api/getconfigupt", callback, config_key);
        $("#add_updConfig_title").text('修改');
        $("#add_updConfig_form input[name=config_key]").attr('readonly', true);
        $("#add_updConfig_b").remove();

      });
      thiz.add_upd();
    });

    //删除
    $('#mgt_config_delete').click(function () {
      $('#mgt_config_dialog_div').dialog('open');
      return false;
    });


    //点击左侧菜单栏时，关闭dialog

    $('#left-panel nav').one("click", function () {
      if ($('#mgt_config_dialog_div').dialog('isOpen')) {
        $('#mgt_config_dialog_div').dialog('close');
      }

    });


  }

  PT.add_upd = function () {

    // 字典数据绑定
    $("#add_updConfig_form input[name=status]").zySelect('ZR.0001', false, {
      width: '100%'
    });


    $('#add_updConfig').modal('show');

    $("#add_updConfig_form").validate({
      // Rules for form validation
      rules: {
        config_key: {
          required: true,
          maxlength: 50
        },
        status: {
          required: true
        },
        config_value: {
          required: true,
          maxlength: 50
        },
        config_desc: {
          maxlength: 200
        }

      },
      // 验证成功后保存
      submitHandler: function (form) {
        var callback = function (msg) {
          $('#add_updConfig_form').formDisable(false);
          if (msg) {
            if (thiz._g.param.flg == 'u') {
              thiz.SetRow($('#add_updConfig_form').form2json());
            }
            $('#add_updConfig').modal('hide');
            zy.ui.msg("提示信息：", "保存成功！", "s");

          }
          thiz.UpDt();
        };
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'config_mgt';
        if (thiz._g.param.flg == 'i') {
          zy.net.post("api/addconfig", callback, $('#add_updConfig_form').serialize());
        } else if (thiz._g.param.flg == 'u') {
          zy.net.post("api/setconfig", callback, $('#add_updConfig_form').serialize());
        }
        $('#add_updConfig_form').formDisable(true);
      },
      // Do not change code below
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
    });
  }


  /**
   * 删除时，提示对话框初始化
   */
  PT.dialogInit = function () {
    //对话框标题转换为html
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
      _title: function (title) {
        if (!this.options.title) {
          title.html("&#160;");
        } else {
          title.html(this.options.title);
        }
      }
    }));
    //对话框
    $('#mgt_config_dialog_div').dialog({
      autoOpen: false,
      width: 600,
      resizable: false,
      modal: true,
      title: "<div class='widget-header'><h4><i class='fa fa-warning'></i> 确认</h4></div>",
      buttons: [
        {
          html: "<i class='fa fa-trash-o'></i>&nbsp; 确定",
          "class": "btn btn-danger",
          click: function () {
            var callback = function (msg) {
              if (msg) {
                $('#mgt_config_form').formDisable(false);
                dt.DataTable().row('.active').remove().draw();
                Pagination(thiz._g.crt_page); //更新当前页
                zy.ui.msg("提示信息：", "删除成功！", "s");
              }
            };
            var param = {};
            var data = dt.DataTable().row('.active').data();
            param.config_key = data.config_key;
            zy.g.am.app = 'ZYAPP_SYSMGT';
            zy.g.am.mod = 'config_mgt';
            $('#mgt_config_form').formDisable(true);
            zy.net.get("api/deleteconfig", callback, param);
            $(this).dialog("close");
          }
        },
        {
          html: "<i class='fa fa-times'></i>&nbsp; 取消",
          "class": "btn btn-default",
          click: function () {
            $(this).dialog("close");
          }
        }
      ]
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  function Pagination(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#mgt_config_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        Console.log('onPageChange num = ' + num);
        thiz._g.crt_page = num; //当前页码
        SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  function SetDt(page) {
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      $('#mgt_config_search').button('reset');
      if (msg) {
        $('#mgt_config_edit').btnDisable(true);
        $('#mgt_config_delete').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#mgt_config_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#mgt_config_pagination').jqPaginator('destroy');
        }


      }
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'config_mgt';
    zy.net.get("api/getconfiglist", cb, $('#mgt_config_form').serialize(), page);
  };


  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function (msg) {
    Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '失效';
    }
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function (el) {
    console.log(el.data)
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function (msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function () {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
      thiz.UpDt();//刷新页面
    };
    param.config_key = el.data('config_key');
    param.status = st;
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'config_mgt';
    zy.net.get('api/setconfigstatus', cb, param);
  };
  PT.Select = function () {
    // 数据字典处理
    var cb = function () {

      // 字典数据绑定
      $("#mgt_config_form input[name=status]").zySelect('ZR.0001', true, {
        width: '100%'
      });
      };
    $("#mgt_config_form input[name=status]").select2('val','1');
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001', cb);

  };
  return MgtConfig;
})();