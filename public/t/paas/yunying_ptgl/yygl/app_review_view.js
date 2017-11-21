 /**
  * APP表管理
  * @class appReviewView
  */
 appReviewView = (function() {

   var PT = appReviewView.prototype;
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
     curpage: 1 //当前页
   };

   //表格元素对象
   var dt = $('#app_review_view_dt');

   /**
    * 事件绑定规则定义
    * @property Events
    */
   PT.Events = {};

   /**
    * @class appReviewView
    * @constructor
    */
   function appReviewView() {
     zy.log("new appReviewView()");
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
     $('#app_review_view_btn').btnDisable(true);
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
       "data": "applicationnm"
     }, {
       "data": "orgnm"
     }, {
        "render": function (data, type, row, meta) {
          return zy.cache.cd2name('ZR.0038', row.biz_status);}
     },{
       "render": function(data, type, row, meta) {
         return $.format.date(row.createdt, 'yyyy-MM-dd HH:mm:ss');}
     }
    // , {
    //   "render": function(data, type, row, meta) {
    //     var _data, str, str0, str1;
    //     // 参数设置
    //     _data = 'data-applicationid=\'' + row.applicationid + '\'';
    //     _data += ' data-status=\'' + row.status + '\'';
    //     if (row.status === '1') {
    //       str0 = '';
    //       str1 = 'checked=\'checked\'';
    //     } else {
    //       str0 = 'checked=\'checked\'';
    //       str1 = '';
    //     }
    //     str = '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'0\' ' + str0 + '><span>无效</span></label></div>';
    //     str += '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'1\' ' + str1 + '><span>有效</span></label></div>';
    //     return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'app_review_view_status\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button id=\'app_review_view_status\' class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + row.statusnm + '</a>';
    //   }
    // }, 
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
         $('#app_review_view_btn').btnDisable(true);
       } else {
         dt.DataTable().$('tr.active').removeClass('active');
         $(this).addClass('active');
         $('#app_review_view_btn').btnDisable(false);
       }
     });
     //查询
     $('#app_review_view_search').click(function() {
       zy.log('查询');
       conditions = $('#app_review_view_form').serialize();
       $('#app_review_view_search').button('loading');
       $('#app_review_view_btn').btnDisable(true);
       thiz.Pagination(1);
     });
     //运营状态管理
     $('#app_review_view_btn').click(function() {
       var rowIdx = dt.DataTable().row('.active').index();
       zy.log("当前选择行 = " + rowIdx);
       var data = dt.DataTable().row('.active').data();
       zy.log(data);
       thiz._g.param.applicationid = data.applicationid; //获取选择行数据，设置参数
       thiz._g.param.biz_status = data.biz_status; //获取选择行数据，设置参数
       thiz._g.param.orgid=data.orgid;
       thiz._g.param.view = data;
       
       zy.net.loadHTML("yunying_ptgl/yygl/app_review_view_manage.html", $("#app_review_view_modal"));
     });
   };
   /**
    * 分页处理
    * @method Pagination
    * @param {Number} page 页码
    */
   PT.Pagination = function(page) {
     zy.log('Pagination page = ' + page);
     $.jqPaginator('#app_review_view_pagination', {
       totalCounts: thiz._g.count,
       pageSize: zy.g.page.pagesize,
       currentPage: page,
       onPageChange: function(num) {
         zy.log('onPageChange num = ' + num);
         thiz._g.curpage = num; //当前页码
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
       $('#app_review_view_search').button('reset');
       if (msg) {
         $('#app_review_view_btn').btnDisable(true);
         thiz._g.count = msg.count; //获取总记录数
         thiz._g.data = msg.result;
         thiz.DataTable(msg.result);
         zy.log('if (msg) thiz._g.count = ' + thiz._g.count);
         if (msg.count > 0 && msg.result.length > 0) {
           $('#app_review_view_pagination').jqPaginator('option', {
             totalCounts: thiz._g.count,
             pageSize: zy.g.page.pagesize,
             currentPage: page
           });
         } else {
           thiz._g.count = 1;
           thiz._g.page = 1;
           $('#app_review_view_pagination').jqPaginator('destroy');
         }
         // DO NOT REMOVE : GLOBAL FUNCTIONS!
         pageSetUp();
       }
     };
     zy.g.am.app = '0418a865dac144cfa77a1e4573e3f549';
     zy.g.am.mod = 'yygl';
     zy.net.get("api/app_review_view", cb, conditions, page);
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
     // 修改数据并刷新 dataTable
     $.extend(data, msg);
    // if (data.status === '1') {
    //   data.statusnm = '有效';
    // } else {
    //   data.statusnm = '无效';
    // }
     zy.log("更新修改的行数据 = " + data);
     dt.DataTable().rows().invalidate().draw();
   };
   PT.Select = function() {
     // 数据字典处理
     var cb = function() {
       // 字典数据绑定
       $("#app_review_view_form input[name=biz_status]").zySelect('ZR.0038', true, {
         width: '100%'
       });
     };
     // 预处理该画面所需的字典类型，以 , 号分割
     zy.cache.initDicts('ZR.0038', cb);
   };
   return appReviewView;
 })();
