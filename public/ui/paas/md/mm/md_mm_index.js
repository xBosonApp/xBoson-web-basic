  md_mm_index = (function(zy, $) {
    var PT = md_mm_index.prototype;
    var thiz;
    
   PT. _g = {
    data: [],
    param: {},
    paramdata:{},
    page: 1, //开始页数
    count: 1, //总记录数
    crt_page: 1 //当前页
  };
    var dt = $('#md_mm_index_dt');
  function md_mm_index() {
    Console.log("new md_mm_index()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
   PT.Init = function () {
      thiz.DataTable();
      thiz.Toolbar();
      thiz.Pagination(1);
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
        "data": "index_name"
      },
      {
        "data": "seq_in_index"
      },
      {
        "data": "column_name"
      },
      {
        "data": "collation"
      },
      {
        "data": "comment"
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
      } else {
         dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        paramdata = dt.DataTable().row('.active').data();
        console.log(123,paramdata);
        console.log(12345,paramdata.did,paramdata.en,paramdata.index_name);
      }
    });
    //添加
    $('#md_mm_index').find('[name=add]').click(function () {
       $('#md_mm_index').modal('hide');
      // zy.net.loadHTML("md/mm/md_mm_index2.html", $("#modal_container"));
       zy.net.loadHTML("md/mm/md_mm_index2.html", $("#mm_test"));
    });
    //删除
     $('#md_mm_index').find('[name=delete]').click(function () {
         zy.ui.mask('删除确认', '是否确认删除此条数据', function sure() {
            //选择行数据
            function cb (msg){
               zy.ui.msg('提示', '删除成功', 's');
              // thiz.UpDt();
              dt.DataTable().row('.active').data();
            }
            zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
            zy.g.am.mod = 'tableandindex';
            zy.net.get('api/deletetableindex',cb,{typecd:"test211",did:"00000000000000000000000000000000",en:"test1",index_name:paramdata.index_name});
            // zy.net.get('api/deletetableindex',cb,{typecd:mm_h1._g._nodeClick.typecd,did:mm_index2._g.paramdata.did,en:mm_index2._g.paramdata.en,index_name:paramdata.index_name});
          });
    });
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#md_mm_index_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
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
  PT.SetDt = function (page) {
    Console.log('SetDt page = ' + page);
    var cb = function (msg) {
      if (msg) {
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0 && msg.result.length > 0) {
          $('#md_mm_index_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#md_mm_index_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
    zy.g.am.mod = 'tableandindex';
    zy.net.get("api/gettableindex", cb, {did:"00000000000000000000000000000000",en:"test1"}, page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    Pagination(1);
  };
  return md_mm_index;
  })(zy, jQuery);