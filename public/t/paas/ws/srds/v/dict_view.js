/* Create By xBoson System */
// 数据字典一览
dict_view = (function(){
  var pt = dict_view.prototype;
  
  pt.typecd=null; //类别编码
  pt.count=0; //总条数
  pt.currentPage=0; //当前页码
  
  // 构造方法
  // 参数 typecd
  function dict_view(typecd){
    pt.typecd=typecd;
    searchform.find('input[name=typecd]').val(typecd);
    Init();
  }
  
  
  //搜索表单form
  var searchform = $('#dict_view_search_form');
  //表格元素对象
  var dt = $('#dict_view_dt');
  
  
  //初始化
  function Init(){
    SearchFormInit(function(){
      pt.Toolbar();
      $('#dict_view_search').click();
    });
  }
  
  //搜索表单init
  function SearchFormInit(cb){
    //获取版本select2数据源
    zy.g.am.app = 'faac7c3dc3844e61a8ca4bd7ab2ff096';
    zy.g.am.mod = 'dict';
    zy.net.get('api/versions',function(msg){
      if(msg&&msg.versions){
        if(msg.versions.length==0){
          //版本为文本框
          searchform.find('input[name=version][data-type=select2]').remove();
        }else{
          //版本为select2
          searchform.find('input[name=version][type=text]').remove();
          //初始化版本select2
          searchform.find('input[name=version][data-type=select2]').zySelectCustomData('',true,{'width':'100%'},msg.versions);
        }
        cb&&cb();
      }
    },{'typecd':pt.typecd});
  }
  
  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  pt.DataTable = function(data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "dictcd"
      },
      {
        "data": "dictnm"
      },
      {
        "data": "version"
      }, 
      {
        "data": "shortkey"
      },
      {
        "data": "mark"
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
  /*窗口改变时，重新调整画面大小*/
  function DynamicWidth() {
    $('.dataTables_scrollHeadInner').css('width', '100%');
    $('.dataTables_scrollBody table').css('width', '100%');
    $('.dataTables_scrollHeadInner table').css('width', '100%');
  }
  
  /**
   * Toolbar 事件处理
   * @method Toolbar
   */
  pt.Toolbar = function() {
    // 单击事件
    dt.on('click', 'tr', function(e) {
      // 当前选择行 index
      if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
        return false;
      //【修改状态,保存按钮】事件托管
      // if ($(e.target).is('button')) {
      //   thiz.SaveStatus($(e.target).parents("form"));
      // }
      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#dict_view_edit').btnDisable(true);
        $('#dict_view_del').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#dict_view_edit').btnDisable(false);
        $('#dict_view_del').btnDisable(false);
      }
    });
    //查询
    $('#dict_view_search').click(function() {
      $('#dict_view_edit').btnDisable(true);
      $('#dict_view_del').btnDisable(true);
      $('#dict_view_search').button('loading');
      pt.Pagination(1);
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  pt.Pagination = function(page) {
    $.jqPaginator('#dict_view_pagination', {
      totalCounts: 10,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function(num) {
        pt.currentPage=page;
        pt.SetDt(num);
      }
    });
  };
  /**
   * 设置表格数据
   * @method SetDt
   * @param {Number} page 页码
   */
  pt.SetDt = function(page) {
    var cb = function(msg) {
      $('#dict_view_search').button('reset');
      if (msg) {
        pt.DataTable(msg.result);
        if (msg.count > 0) {
          $('[name=dict_view_total_count]').html('总数：'+msg.count);
          $('#dict_view_pagination').jqPaginator('option', {
            totalCounts: msg.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          $('#dict_view_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = "faac7c3dc3844e61a8ca4bd7ab2ff096";
    zy.g.am.mod = "dict";
    zy.net.get("api/queryvaliddict", cb, searchform.serialize(), page);
  };
  
  return dict_view;
})();