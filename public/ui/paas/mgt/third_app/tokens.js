/* Create By xBoson System */

/**
 * 令牌管理
 * @class ManagedToken
 */
ManagedToken = (function() {

  var PT = ManagedToken.prototype;
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
  var dt = $('#managed_token_dt'); //变更信息表格
  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};
  /**
   * @class ManagedToken
   * @constructor
   */
  function ManagedToken() {
      Console.log("new ManagedToken()");
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
    thiz.Toolbar();
    thiz.DataTable();
  };
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }
  
  function endTime(row) {
    return new Date(row.birth_time).getTime() + row.expires_in*1000;
  }
  
  /**
   * 表格加载
   * @method DataTable @method DataTable2  @method DataTable3
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      // { "data": "client_id" }, 
      { "data": "userid" },
      { "data": "token" },
      { 
        "render": function(d, t, row) {
          if (endTime(row) < Date.now()) return '过期';
          return row.enable == 1 ? '启用' : '禁用';
        }
      },
      {
        "render": function(d, t, row) {
          return new Date(row.birth_time).toLocaleString();
        }
      },
      {
        "render": function(d, t, row) {
          return new Date(endTime(row)).toLocaleString();
        }
      },
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
  PT.Toolbar = function() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      Console.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#managed_token_delete').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        if (mgt_app._g.param.orgid == zy.g.comm.org) {
          $('#managed_token_add').btnDisable(false);
          $('#managed_token_delete').btnDisable(false);
        } else {
          $('#managed_token_add').btnDisable(true);
          $('#managed_token_delete').btnDisable(true);
        }
      }
    });
    
    //查询
    $('#managed_token_search').click(function() {
      $('#managed_token_form input[name=tp_appid]').val(mgt_app._g.param.tp_appid);
      $('#managed_token_form input[name=orgid]').val(mgt_app._g.param.orgid);
      conditions = $('#managed_token_form').serialize();
      $('#managed_token_delete').btnDisable(true);
      $('#managed_token_search').button('loading');
      if (mgt_app._g.param.orgid == zy.g.comm.org) {
        $('#managed_token_add').btnDisable(false);
      } else {
        $('#managed_token_add').btnDisable(true);
      }
      thiz.Pagination(1);
    });
    
    //删除
    $('#managed_token_delete').click(function() {
      zy.ui.mask('删除确认', '数据删除后将不能再恢复，是否确定删除该数据？', function() {
        tokenState('delete', function() {
          dt.DataTable().row('.active').remove().draw();
        });
      });
    });
    
    $('#managed_token_v').click(function() {
      zy.net.loadHTML("mgt/third_app/import_user.html", $("#managed_token_form2"), function(){
        tokenState('enable');
      });
    });
    
    $('#managed_token_x').click(function() {
      zy.net.loadHTML("mgt/third_app/export_user.html", $("#managed_token_form2"), function(){
        tokenState('disable');
      });
    });
  };
  
  function tokenState(act, rcb) {
    $('#managed_token_form').formDisable(true);
    var data = dt.DataTable().row('.active').data();
    var param = {
      token: data.token,
      act: act,
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get('api/token_state', function(msg) {
      if (msg) {
        $('#managed_token_form').formDisable(false);
        dt.DataTable().row('.active').remove().draw();
        thiz.Pagination(thiz._g.crt_page); //更新当前页
        zy.ui.msg("提示信息：", "成功！", "s");
        rcb && rcb();
      } else {
        zy.ui.msg('提示信息：', '失败', 'e');
      }
    }, param);
  }
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#managed_token_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        Console.log('onPageChange num = ' + num);
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
    Console.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#managed_token_search').button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if(msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#managed_token_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#managed_token_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.comm.app = 'ZYAPP_SYSMGT';
    zy.g.comm.mod = 'third_app_mgt';
    zy.net.get("api/token_list", cb, conditions, page);
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
    Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function(el) {
    var rowIdx = dt.DataTable().row('.active').index();
    var data = dt.DataTable().row('.active').data();
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
    var param = {
      tp_appid: el.data('tp_appid'),
      pid: data.pid,
      status: st
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get('api/setuidstatus', cb, param);
  };
  /**
   * Select2 加载
   * @method Select
   */
  PT.Select = function() {
    // 数据字典处理
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'third_app_mgt';
    zy.net.get('api/select2user', function(msg) {
      if (msg) {
        $("#managed_token_form input[name=userid]").zySelectCustomData('', true, {
          width: '100%'
        }, msg.result);
      }
    }, zy.g.comm.org);
    var cb = function() {
      // 字典数据绑定
      $("#managed_token_form input[name=status]").zySelect('ZR.0001', true, {
        width: '100%'
      });
      $("#managed_token_form input[name=status]").select2("val", '1');
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001', cb);
  };
  return ManagedToken;
})();