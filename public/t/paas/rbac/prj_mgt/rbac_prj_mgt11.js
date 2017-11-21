rbac_prj_mgt11 = (function () {

  var PT = rbac_prj_mgt11.prototype;
  var thiz;
  PT._g = {
    prjid: '',
    pageid: '',
    menuchildren: [],
    pagechildren: [],
    crt_page: 1, //当前页码
    page: 1, //开始页数
    count: 1 //总记录数
  };
  // var thisPage = $('#rbac_prj_mgt11_page');
  // var frmSearch = $('#rbac_prj_mgt11_search_form');
  // var btnSearch = $('#rbac_prj_mgt11_search');
  // var btnAdd = $('#rbac_prj_mgt11_add');
  // var btnEdit = $('#rbac_prj_mgt11_edit');
  // var btnDel = $('#rbac_prj_mgt11_del');
  // var bTotalCnt = $('[name=rbac_prj_mgt11_total_count]');
  // var dt = $('#rbac_prj_mgt11_dt');
  // var pagination = $('#rbac_prj_mgt11_pagination');
  // var dlg = $('#rbac_prj_mgt11_dialog');
  // var domPageInfos = $('#rbac_prj_mgt01_rbac_prj_mgt09_modals');

  var thisPage;

  function rbac_prj_mgt11(prjid) {
    thiz = this;
    thiz._g.prjid = prjid;
    thisPage = $('#rbac_prj_mgt11_page').attr('id', 'rbac_prj_mgt11_page'+thiz._g.prjid);
    thiz.Init();
    return this;
  }
  PT.v = {
    frmSearch: null,
    btnSearch: null,
    btnAdd: null,
    btnEdit: null,
    btnDel: null,
    bTotalCnt: null,
    dt: null,
    pagination: null,
    dlg: null,
    domPageInfos: $('#rbac_prj_mgt01_rbac_prj_mgt09_modals')
  };
  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    PT.v.frmSearch = thisPage.find('#rbac_prj_mgt11_search_form');
    PT.v.btnSearch = thisPage.find('#rbac_prj_mgt11_search');
    PT.v.btnAdd = thisPage.find('#rbac_prj_mgt11_add');
    PT.v.btnEdit = thisPage.find('#rbac_prj_mgt11_edit');
    PT.v.btnDel = thisPage.find('#rbac_prj_mgt11_del');
    PT.v.bTotalCnt = thisPage.find('[name=rbac_prj_mgt11_total_count]');
    PT.v.dt = thisPage.find('#rbac_prj_mgt11_dt');
    PT.v.pagination = thisPage.find('#rbac_prj_mgt11_pagination').attr('id', 'rbac_prj_mgt11_pagination'+thiz._g.prjid);
    PT.v.dlg = thisPage.find('#rbac_prj_mgt11_dialog');
    PT.v.frmSearch.find('input[name=prjid]').val(thiz._g.prjid);

    thiz.Pagination(1);
    thiz.Toolbar();
    PT.v.btnAdd.btnDisable(false);
    PT.v.btnEdit.btnDisable(true);
    PT.v.btnDel.btnDisable(true);
  };

  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  PT.Toolbar = function() {
    // 单击事件
    PT.v.dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      // 行按钮事件托管
      if ($(e.target).is('button')) {
        hidePopover();
      }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        PT.v.btnEdit.btnDisable(true);
        PT.v.btnDel.btnDisable(true);
      } else {
        PT.v.dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        PT.v.btnEdit.btnDisable(false);
        PT.v.btnDel.btnDisable(false);
      }
    });

    // 双击事件
    PT.v.dt.on('dblclick', 'tr', function(e) {
      $(this).trigger('click');
      PT.v.btnEdit.trigger('click');
    });

    //查询
    PT.v.btnSearch.click(function() {
      PT.v.btnEdit.btnDisable(true);
      PT.v.btnDel.btnDisable(true);
      PT.v.btnSearch.button('loading');
      thiz.Pagination(1);
    });
    //添加
    PT.v.btnAdd.click(function() {
      var selfid = PT.v.domPageInfos.attr('id') + zy.tool.random();
      var domPageInfo = $('<div>').attr('id', selfid);
      PT.v.domPageInfos.append(domPageInfo);
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt09.htm?op_type=i&prjid=' + thiz._g.prjid + '&selfid=' + selfid, domPageInfo);
    });
    //修改
    PT.v.btnEdit.click(function() {
      // 当前选择行数据
      var data = PT.v.dt.DataTable().row('.active').data();
      var selfid = PT.v.domPageInfos.attr('id') + zy.tool.random();
      var domPageInfo = $('<div>').attr('id', selfid);
      PT.v.domPageInfos.append(domPageInfo);
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt09.htm?op_type=u&prjid=' + thiz._g.prjid + '&pageid=' + data.pageid + '&selfid=' + selfid, domPageInfo);
    });
    //点击左侧菜单栏时，销毁对话框实例
    $('#left-panel nav').bind("click", function() {
      PT.v.dlg.dialog('destroy');
    });
    //删除
    PT.v.btnDel.click(function() {
      //获取选择行数据，设置参数
      var data = PT.v.dt.DataTable().row('.active').data();
      thiz._g.pageid = data.pageid;
      thiz._g.menuchildren = data.menuchildren;
      thiz._g.pagechildren = data.pagechildren;
      thiz.dialogInit();
      PT.v.dlg.dialog('open');
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function(page) {
    $.jqPaginator('#rbac_prj_mgt11_pagination'+thiz._g.prjid, {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
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
    var cb = function(msg) {
      PT.v.btnSearch.button('reset');
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        PT.v.bTotalCnt.html('总数：' + msg.count + '&nbsp;');
        thiz.DataTable(msg.result);
        if (msg.count > 0) {
          PT.v.pagination.jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          PT.v.pagination.jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
    zy.g.am.mod = 'XMGL';
    zy.net.get("api/prjpagelist", cb, PT.v.frmSearch.serialize(), page);
  };

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      { 'data': 'pageid' },
      { 'data': 'pagenm' },
      { 'data': 'page_path' },
      {
        'render': function(data, type, row, meta) {
          if ((row.menuchildren && row.menuchildren.length > 0) || (row.pagechildren && row.pagechildren.length > 0)) {
            var sb = new zy.tool.string.StringBuffer();
            sb.append('<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 引用方\" data-content=\"<div class=\'row\'>&nbsp;菜单：<br>');
            if (row.menuchildren && row.menuchildren.length > 0) {
              $.each(row.menuchildren, function(i,v){
                sb.append('&nbsp;');
                sb.append(v.menunm);
                sb.append('<br>');
              });
            } else {
              sb.append('&nbsp;无');
              sb.append('<br>');
            }
            sb.append('<br>');
            sb.append('</div><div class=\'row\'>&nbsp;页面：<br>');
            if (row.pagechildren && row.pagechildren.length > 0) {
              $.each(row.pagechildren, function(i,v){
                sb.append('&nbsp;');
                sb.append(v.pageid);
                sb.append('&nbsp;');
                sb.append(v.pagenm);
                sb.append('&nbsp;<br>');
              });
            } else {
              sb.append('&nbsp;无');
              sb.append('<br>');
            }
            sb.append('<br></div>');
            sb.append('<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button class=\'btn btn-primary btn-xs\'>OK</button></div></div></div></form>\" data-html=\"true\">');
            sb.append('引用方</a>');
            return sb.toString();
          } else {
            return '无';
          }
        }
      }];

      //预设初始化参数
      var options = {
        'data': data,
        'columns': columns
      };
      // 合并初始化参数选项
      $.extend(options, zy.ui.dataTable);
      //初始化 DataTable
      PT.v.dt.dataTable(options);
  };

  PT.dialogInit = function() {
    //对话框标题转换为html
    $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
      _title: function(title) {
        if (!this.options.title) {
          title.html("&#160;");
        } else {
          title.html(this.options.title);
        }
      }
    }));
    //对话框
    PT.v.dlg.dialog({
      autoOpen: false,
      width: 600,
      resizable: false,
      modal: true,
      focus: function(event, ui) {
        // 在dialog获得焦点时设置焦点到取消按钮
        $(PT.v.dlg.siblings('.ui-dialog-buttonpane').find('button:eq(1)')).focus();
      },
      title: '<div class="widget-header"><h4><i class="fa fa-warning"></i> 确定删除该数据？</h4></div>',
      open: function(event, ui) {
        if ((!thiz._g.menuchildren || thiz._g.menuchildren.length === 0) && (!thiz._g.pagechildren || thiz._g.pagechildren.length === 0)){
          $('#rbac_prj_mgt11_dlg_none').attr('style', 'vertical-align:top;');
        } else {
          $('#rbac_prj_mgt11_dlg_none').attr('style', 'vertical-align:top; display: none;');
        }
        if (!thiz._g.menuchildren || thiz._g.menuchildren.length === 0) {
          $('#rbac_prj_mgt11_dlg_menu').attr('style', 'vertical-align:top; display: none;');
        } else {
          $('#rbac_prj_mgt11_dlg_menu').attr('style', 'vertical-align:top;');
          var content0 = '受影响的菜单：<table>';
          $.each(thiz._g.menuchildren, function(i,v){
            content0 = content0 + '<tr><td style="padding: 4px;">' + v.menunm + '</td><td style="padding: 4px;"></td><tr/>';
          });
          content0 = content0 + '</table>';
          $('#rbac_prj_mgt11_dlg_menu').html(content0);
        }
        if (!thiz._g.pagechildren || thiz._g.pagechildren.length === 0) {
          $('#rbac_prj_mgt11_dlg_page').attr('style', 'vertical-align:top; display: none;');
        } else {
          $('#rbac_prj_mgt11_dlg_page').attr('style', 'vertical-align:top;');
          var content1 = '受影响的上级关联页面：<table>';
          $.each(thiz._g.pagechildren, function(i,v){
            content1 = content1 + '<tr><td style="padding: 4px;">' + v.pageid + '</td><td style="padding: 4px;">' + v.pagenm + '</td><tr/>';
          });
          content1 = content1 + '</table>';
          $('#rbac_prj_mgt11_dlg_page').html(content1);
        }
      },
      buttons: [{
        html: "<i class='fa fa-trash-o'></i>&nbsp; 确定",
        "class": "btn btn-danger btn-xs",
        click: function() {
          var callback = function(msg) {
            if (msg) {
              thiz._g.count = thiz._g.count - 1;
              var m = thiz._g.count % zy.g.page.pagesize;
              PT.v.dt.DataTable().row('.active').remove().draw();
              PT.v.btnEdit.btnDisable(true);
              PT.v.btnDel.btnDisable(true);
              if (m > 0) {
                thiz.Pagination(thiz._g.crt_page); //更新当前页
              } else {
                thiz._g.crt_page = thiz._g.crt_page - 1;
                if (thiz._g.crt_page > 0) {
                  thiz.Pagination(thiz._g.crt_page); //更新当前页
                }
              }
              zy.ui.msg("提示信息：", "删除成功！", "s");
            }
          };
          zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
          zy.g.am.mod = 'XMGL';
          zy.g.am.json = true;// JSON提交
          zy.net.post('api/prjpagemaint', callback, {op_type: 'd', prjid: thiz._g.prjid, pageid: thiz._g.pageid});
          $(this).dialog("close");
        }
      }, {
        html: "<i class='fa fa-times'></i>&nbsp; 取消",
        "class": "btn btn-default btn-xs",
        click: function() {
          $(this).dialog("close");
        }
      }],
      close: function() {
        $(this).remove();
      }
    });
  };

  function hidePopover() {
    $('[rel=popover]').each(function() {
      $(this).popover('hide');
    });
  }

  return rbac_prj_mgt11;
})();