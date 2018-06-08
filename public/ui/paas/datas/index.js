/**
 * Web服务列表页面js
 * */
datas_index = (function(){
  var PT = datas_index.prototype;
  var thiz;
  
  /**
   * 默认选项
   * @attribute defaults
   * @private
   */
  PT.defaults={
    
  };
  /**
   * 选项
   * @attribute opts
   * @private
   */
  PT.opts={

  };
  /**
   * View 画面元素对象
   * @attribute v
   * @private
   */
  var v_search = $('#sys_datas_index_search'); //画面元素：查询form
  var v_table = $('#sys_datas_index_table');  // 画面元素：表格
  PT.v={
    btn:{
      add_bnt: v_search.find('[name=add]'),  //添加按钮
      del_bnt: v_search.find('[name=del]'),  //删除按钮
      edit_bnt: v_search.find('[name=edit]'),  //编辑按钮
      test_bnt: v_search.find('[name=test]')  //测试运行按钮
    },
    tabl:{
      pagination: $('#sys_datas_index_pagination') // 翻页
    },
    total_count: $('#sys_datas_index_total_count')  // 查询结果总数
  };
  /**
   * constructor
   * */
  function datas_index(){
    thiz=this;
    // 初始化
    thiz.Init();
  }
  
  /**
   * 初始化
   * @method Init
   * */
  PT.Init=function(){

    //数据字典
    zy.cache.initDicts('ZR.0001', function() {});

    
  }
  
  //画面元素事件
  var events={
    //显示隐藏
    top_show_hide: function(){
      thiz.v.showhide.click(function(){
        var $this = $(this);
        if($this.hasClass('fa fa-plus')){
          $this.removeClass('fa-plus').addClass('fa fa-minus');
          thiz.v.fieldset.show();
        }else{
          $this.removeClass('fa fa-minus').addClass('fa fa-plus');
          thiz.v.fieldset.hide();
        }
      });
    },

    //保存维度定义按钮
    submitBtn: function(){
      thiz.v.submitBtn.click(function(){
        var _params=getSubmitParams();
        if(_params.row_json=='[]'||_params.column_json=='[]'){
          zy.ui.msg('提示信息：','行定义或列定义不存在！','w');
          return;
        }
        if(thiz.opts.node.new_node===true){
          zy.g.am.app='c770045becc04c7583f626faacd3b456';
          zy.g.am.mod='mddm_dimension';
          zy.net.post('api/adddimensionmodel',function(msg){
            if(msg){
              thiz.opts.node.new_node=false;
              thiz.opts.node.bm004='1';
              thiz.v.submitBtn.html('修改维度定义');
              zy.ui.msg('提示信息：','添加成功！','s');
            }
          },_params);
        }else{
          zy.g.am.app='c770045becc04c7583f626faacd3b456';
          zy.g.am.mod='mddm_dimension';
          zy.net.post('api/upddimensionmodel',function(msg){
            if(msg){
              zy.ui.msg('提示信息：','修改成功！','s');
            }
          },_params);
        }
      });
    }
  };
  
  //方法
  var fn={
    // 设置翻页
    setPagination: function(page) {
      zy.log('Pagination sys_datas_index_table page = ' + page);
      $.jqPaginator(thiz.v.tabl.pagination, {
      totalCounts: 1,
      pageSize: 10,
      currentPage: page,
      onPageChange: function(num) {
          zy.log('sys_datas_index_table onPageChange num = ' + num);
          thiz.fn.getSearchData(param, num, setDt); // 加载翻页表格数据
        }
      });
    },

    /**
     * 调用API服务获取查询结果数据
     * @method getSearchData
     * @param {Object} param 发送请求参数json对象或表单对象：$('#formid').serialize();
     * @param {Number} pagenum 页码
     * @param {Function} cb 回调函数 (callback)
     */
    getSearchData: function(param, pagenum, cb) {
      zy.g.am.app = "d2c8511b47714faba5c71506a5029d94";
      zy.g.am.mod = "wslist";
      zy.g.am.pagesize = 10;
      zy.net.get("api/query", function(msg){
        if(msg){
          cb(msg.data);
          if (msg.count > 0) {
          thiz.v.total_count.html('总数:' + _msg.count);
          thiz.v.tabl.pagination.jqPaginator('option', {
              totalCounts: msg.count,
              pageSize: 10,
              currentPage: pagenum
            });
          } else {
           $('#logtable_pagination').jqPaginator('destroy');
          }
        }
      }, param, pagenum);

    },
    
    // 设置表格数据
    setDt: function (data) {
    var columns = [
      {
        'title':'类别编码',
        "data": "typecd"
      },
      {
        'title':'类别名称',
        "data": "typenm"
      },
      {
        'title':'操作类型',
        "render": function(data, type, row, meta) {
          return zy.cache.cd2name('mdm001', row.operation_type);
        }
      },
      {
        'title':'操作详细',
        "data": "operation_detail"
      },
      {
        'title':'平台用户ID',
        "data": "userid"
      },
      {
        'title':'创建时间',
        "data": "createdt"
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
  }
  };

  return datas_index;
})();