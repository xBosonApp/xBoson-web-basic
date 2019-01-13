/**
 * 地址字典类型
 * @class MdmAddrH7
 */
MdmAddrH7 = (function() {

  var PT = MdmAddrH7.prototype;
  var thiz;
  var conditions;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    crt_page: 1 //当前页
  };

  //表格元素对象
  var dt = $('#mdm_addr_h7_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class MdmAddrH7
   * @constructor
   */
  function MdmAddrH7() {
    zy.log("new MdmAddrH7()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.Select();
    thiz.DataTable();
    thiz.Toolbar();
    $('#mdm_addr_h7_edit').btnDisable(true);
    $('#mdm_addr_h7_initadmin').btnDisable(true);
    $('#mdm_addr_h7_createdatabase').btnDisable(true);

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
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [{
      "data": "de0810013j"
    },
    {
      "data":"userid"
    },
    {
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name('ZR.0035', row.init_db);
      }
    },
    {
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name('ZR.0034', row.org_type);
      }
    }, 
    {
      "data":"orgid"
    },
    {
      "render": function(data, type, row, meta) {
        var _data, str, str0, str1;
        // 参数设置
        _data = 'data-orgid=\'' + row.orgid + '\'';
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
        return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'mdm_addr_h7_form1\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button id=\'mdm_addr_h7_status\' class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + zy.cache.cd2name('ZR.0001', row.status) + '</a>';
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
  PT.Toolbar = function() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      zy.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;

      zy.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#mdm_addr_h7_edit').btnDisable(true);
        $('#mdm_addr_h7_initadmin').btnDisable(true);
        $('#mdm_addr_h7_createdatabase').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#mdm_addr_h7_edit').btnDisable(false);
        $('#mdm_addr_h7_initadmin').btnDisable(false);
        $('#mdm_addr_h7_createdatabase').btnDisable(false);
      }
    });
    //查询
    $('#mdm_addr_h7_search').click(function() {
      conditions = $('#addr_h7_form').serialize();
      $('#mdm_addr_h7_edit').btnDisable(true);
      $('#mdm_addr_h7_initadmin').btnDisable(true);
      $('#mdm_addr_h7_createdatabase').btnDisable(true);
      $('#mdm_addr_h7_search').button('loading');
      thiz.Pagination(1);
    });
    //导入机构
    $('#mdm_addr_h7_exportorg').click(function() {
      zy.net.loadHTML("yunying_ptgl/kfsgl/export_org.html", $("#mdm_addr_h7_form"));
    });
    //添加
    $('#mdm_addr_h7_add').click(function() {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("yunying_ptgl/kfsgl/add_upd_org.html", $("#mdm_addr_h7_form"));
    });
    //修改
    $('#mdm_addr_h7_edit').click(function() {
      thiz._g.param.flg = 'u'; //设置修改模式标记
      var rowIdx = dt.DataTable().row('.active').index();
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.orgid = data.orgid; //获取选择行数据，设置参数
      zy.log(thiz._g.param.orgid);
      zy.net.loadHTML("yunying_ptgl/kfsgl/add_upd_org.html", $("#mdm_addr_h7_form"));
    });
    //绑定管理员
    $('#mdm_addr_h7_initadmin').click(function() {
      var rowIdx = dt.DataTable().row('.active').index();
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.orgid = data.orgid; //获取选择行数据，设置参数
      thiz._g.param.status = data.status;
      thiz._g.param.org_type = data.org_type;
      zy.net.loadHTML("yunying_ptgl/kfsgl/initadmin.html", $("#mdm_addr_h7_form"));
    });
    //初始化数据库
    $('#mdm_addr_h7_createdatabase').click(function() {
      var tr = dt.DataTable().row('.active');
      zy.net.loadHTML('yunying_ptgl/kfsgl/pre_treelist_modal.html',$("#mdm_addr_h7_form"),function(){
        FirstModal(tr);
        var target = $("#mdm_addr_h7_form");
        target.find('.modal').modal('show');
      });
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    zy.log('Pagination page = ' + page);
    $.jqPaginator('#mdm_addr_h7_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        zy.log('onPageChange num = ' + num);
        thiz._g.crt_page = num; //当前页码
        thiz.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  PT.SetDt = function(page) {
    zy.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#mdm_addr_h7_search').button('reset');
      if (msg) {
        $('#mdm_addr_h7_edit').btnDisable(true);
        $('#mdm_addr_h7_initadmin').btnDisable(true);
        $('#mdm_addr_h7_createdatabase').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        $('#org_num').html("租户总数：" + msg.count);
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        zy.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#mdm_addr_h7_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#mdm_addr_h7_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = '0418a865dac144cfa77a1e4573e3f549';
    zy.g.am.mod = 'tenant_manager';
    zy.net.get("api/tenantinfo", cb, conditions, page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function(msg) {
    zy.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    zy.log("更新前的行数据 = " + JSON.stringify(data));
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    zy.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function(el) {
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function(msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function() {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
    };
    param.orgid = el.data('orgid');
    param.status = st;
    zy.g.am.app = '0418a865dac144cfa77a1e4573e3f549';
    zy.g.am.mod = 'tenant_manager';
    zy.net.get('api/edit_org_status', cb, param);
  };
  PT.Select = function() {
    // 数据字典处理
    var cb = function() {
      // 字典数据绑定
      $("#addr_h7_form input[name=status]").zySelect('ZR.0001', true, {
        width: '100%'
      });
      $("#addr_h7_form input[name=org_type]").zySelect('ZR.0034', true, {
        width: '100%'
      });
      $("#addr_h7_form input[name=status]").select2('val', '1');
      $("#addr_h7_form input[name=org_type]").select2('val', 'v');
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001,ZR.0034,ZR.0035', cb);
  };
  return MdmAddrH7;
})();
