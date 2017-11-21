 /**
  *系统信息
  * @class MgtSystemList
  */
 MgtSystemList = (function() {

   var PT = MgtSystemList.prototype;
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
     count: 1 //总记录数
   };

   //表格元素对象
   var dt = $('#mgt_sys_system_getsystemlist_dt');

   /**
    * 事件绑定规则定义
    * @property Events
    */
   PT.Events = {};

   /**
    * @class MdmAddrH7
    * @constructor
    */
   function MgtSystemList() {
     Console.log("new MgtSystemList()");
     thiz = this;
     thiz.Init();
     return this;
   }

   /**
    * 画面初始化
    * @method init
    */
   PT.Init = function() {
     thiz.DataTable();
     thiz.Toolbar();
     thiz.SetDt();
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
       "data": "apilist",
       "render": function(data, type, row, meta) {
         return '<input name=\'apilist\' class=\'btn btn-info btn-xs\' type=\'button\' value= \'&emsp;API 列表&emsp;\' >' + '<input name=\'modellist\' class=\'btn btn-info btn-xs\' type=\'button\' value= \'&emsp;模型 列表&emsp;\' >' ;
       }
     }, {
       "data": "sysid"
     }, {
       "data": "sysnm"
     }, {
       "render": function(data, type, row, meta) {
         return zy.cache.cd2name('ZR.0001', row.status);
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
       Console.log('this.is("tr") = ' + $(this).find('th').is('th') + ' : ' + $(this).find('td').hasClass('dataTables_empty'));

       if ($(this).find('th').is('th') || $(this).find('td').hasClass('dataTables_empty'))
         return false;
       Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
       var data = dt.DataTable().row(this).data();
       //查看api列表
       if ($(e.target).is('input')&&$(e.target).attr('name')=='apilist') {
         thiz._g.param.sysid = data.sysid;
         zy.net.loadHTML("mgt/sys_system/get_system_api.html", $("#mgt_sys_system_getsystemlist_form2"));
       }
       if ($(e.target).is('input')&&$(e.target).attr('name')=='modellist') {
         thiz._g.param.sysid = data.sysid;
         zy.net.loadHTML("mgt/sys_system/get_system_model.html", $("#mgt_sys_system_getsystemlist_form2"));
       }
       //【修改状态,保存按钮】事件托管
       if ($(e.target).is('button')) {
         thiz.SaveStatus($(e.target).parents("form"));
       }
       // 变换选择行状态颜色
       if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
         $(this).removeClass('active');
       } else {
         dt.DataTable().$('tr.active').removeClass('active');
         $(this).addClass('active');
       }
     });
   };

   /**
    * 设置表格数据
    * @method SetDt
    * @param {Number} page 页码
    */
   PT.SetDt = function() {
     var cb = function(msg) {
       if (msg) {
         thiz.DataTable(msg.result);
         thiz._g.data = msg.result;
       }
     };
     zy.g.am.pagesize = 10000; 
     var pagenum = 1;
     var param = {};
     zy.g.comm.app = 'zyapp_sysmgt';
     zy.g.comm.mod = 'userserver';
     zy.net.get("api/jionsystem", cb, param, pagenum);
   };
   return MgtSystemList;
 })();
