 
BuildGrid = function (con,gridoptions) {
    var InnerCon = con.find('#chart_table_con');
    
    jQuery.fn.dataTableExt.oSort['chinese-asc'] = function (x, y) {
      //javascript 本身提供的本地化比较函数。
      return x.localeCompare(y);
    };

    jQuery.fn.dataTableExt.oSort['chinese-desc'] = function (x, y) {
      return y.localeCompare(x);
    };

    jQuery.fn.dataTableExt.aTypes.push(function (sData) {
      var reg = /^[\u4e00-\u9fa5]{0,}$/;
      if (reg.test(sData)) {
        return 'chinese';
      }
      return null;
    });

    function ResetDom() {
      var target = con.find('#chart_table_template').children().clone();
      InnerCon.empty();
      target.appendTo(InnerCon);
    }

    function buildHeader() {
      var arr = [];
      $.each(gridoptions.columns, function (i, v) {
        arr.push(v.title);
      });
      return arr;
    }

    function OutData(str) {
      var condition = '';
      zy.g.am.mod = 'chartbi';
      zy.g.am.app = 'EWATERBI';
      var r_parm = {
        chartdata: str,
        filenm: null,
        rowcount: gridoptions.data.length,
        colcount: gridoptions.columns.length,
        condition: condition || '空'
      };
      zy.net.postDownload("download/chart_prol_build", r_parm);
    }

    ResetDom();

    /*dataTable初始化参数 */
    var dataTable = {
      "language": {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
          "sFirst": "首页",
          "sPrevious": "上页",
          "sNext": "下页",
          "sLast": "末页"
        },
        "oAria": {
          "sSortAscending": ": 以升序排列此列",
          "sSortDescending": ": 以降序排列此列"
        }
      },
      "searching": false,
      "autoWidth": true,
      "paging": true,
      // "ordering": true,
      // "info": true,
      // "destroy": true,
      // "scrollY": "auto",
      // "scrollCollapse": true,
      //"scrollX": false
    };
    // 合并初始化参数选项
    dataTable = $.extend({}, dataTable, gridoptions);
    var table = InnerCon.find('#chart_table').DataTable(dataTable);
    var dataTableS = $.extend({}, dataTable);
    dataTableS.paging = false;
    InnerCon.find('#chart_table_ods').DataTable(dataTableS);
    InnerCon.find('#chart_table_ods_wrapper').hide();
    InnerCon.find(".dataTables_length").removeClass("dataTables_length");
    //silderbarinit(gridoptions.columns); //取消隐藏显示功能
    InnerCon.find('a.toggle-vis').on('click', function (e) {
      e.preventDefault();
      var column = table.column($(this).attr('data-column'));
      column.visible(!column.visible());
    });
    InnerCon.find('[index=outData]').click(function () {
      var str = InnerCon.find('#chart_table_ods').table2CSV({
        separator: ',',
        delivery: 'value',
        header: buildHeader()
      });
      OutData(str);
    });
    InnerCon.find('[index=closeTable]').click(function () {
      var $this = $(this);
      $this.closest('#chart_table_con').empty();
    });

    function silderbarinit(columnstr) {
      var silderbar = "显示/隐藏: ";
      $.each(columnstr, function (i, type) {
        $.each(type, function (j, val) {
          if ("title" == j) {
            silderbar = silderbar + "-<a class='toggle-vis' data-column='" + i + "'>" + val + "</a>"
          }
        });
      });
      InnerCon.find('#chart_table_slider_bar').html(silderbar);
    }
    
    function DynamicWidth() {
      $('.dataTables_scrollHeadInner').css('width','100%');
      $('.dataTables_scrollBody table').css('width','100%');
      $('.dataTables_scrollHeadInner table').css('width','100%');
    }
    DynamicWidth();
  };


