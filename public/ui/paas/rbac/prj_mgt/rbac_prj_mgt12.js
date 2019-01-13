rbac_prj_mgt12 = (function() {
  var PT = rbac_prj_mgt12.prototype;
  var thiz;
  var thisPage = $('#rbac_prj_mgt12_modal');
  var frmSearch = thisPage.find('#rbac_prj_mgt12_search_form');
  var btnSearch = thisPage.find('#rbac_prj_mgt12_search');
  var bTotalCnt = thisPage.find('[name=rbac_prj_mgt12_total_count]');
  var dt = thisPage.find('#rbac_prj_mgt12_dt');
  var pagination = thisPage.find('#rbac_prj_mgt12_pagination');
  var btnConfirm = thisPage.find('#rbac_prj_mgt12_confirm');

  PT._g = {
    prjid: '',
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1 //总记录数
  };

  var cbFunc;

  function rbac_prj_mgt12(prjid, func) {
    thiz = this;
    thiz._g.prjid = prjid;
    cbFunc = func;
    Init();
    return this;
  }

  function Init() {
    frmSearch.find('input[name=prjid]').val(thiz._g.prjid);
    // 隐藏时将自身删除
    thisPage.on('hidden.bs.modal', function () {
      thisPage.remove();
    });
    Pagination(1);
    Toolbar();
    btnConfirm.btnDisable(true);
    thisPage.modal('show');
  }

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      { 'data': 'pageid' },
      { 'data': 'pagenm' },
      { 'data': 'page_path' }
    ];
    //预设初始化参数
    var options = {
      'data': data,
      'columns': columns
    };
    // 合并初始化参数选项
    $.extend(options, zy.ui.dataTable);
    //初始化 DataTable
    dt.dataTable(options);
  };

  function Toolbar() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        btnConfirm.btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        btnConfirm.btnDisable(false);
      }
    });

    // 双击事件
    dt.on('dblclick', 'tr', function(e) {
      $(this).trigger('click');
      btnConfirm.trigger('click');
    });

    //查询
    btnSearch.click(function() {
      btnConfirm.btnDisable(true);
      btnSearch.button('loading');
      Pagination(1);
    });

    //确认选择
    btnConfirm.click(function() {
      var data = dt.DataTable().row('.active').data();
      if (cbFunc) {
        var ret = cbFunc(data.pageid, data.pagenm);
        if (ret) {
          thisPage.modal('hide');
        }
      }
    });
  }

  function Pagination(page) {
    $.jqPaginator('#rbac_prj_mgt12_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        SetDt(num);
      }
    });
  }

  function SetDt(page) {
    var cb = function(msg) {
      btnSearch.button('reset');
      if (msg) {
        btnConfirm.btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        bTotalCnt.html('总数：' + msg.count + '&nbsp;');
        DataTable(msg.result);
        if (msg.count > 0 && msg.result.length > 0) {
          pagination.jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          pagination.jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
    zy.g.am.mod = 'XMGL';
    zy.net.get("api/prjpagelist", cb, frmSearch.serialize(), page);
  }

  return rbac_prj_mgt12;
})();