/**
 * Web服务列表页面js
 */
datas_index = (function(){
  var PT = datas_index.prototype;
  var thiz;
  
  /** 默认可选配置参数 */
  PT._g = {
    count: 0, //总记录数
    top_page: 1, //开始页数
    crt_page: 1, //当前页
    pagesize: 10  //默认每页显示记录条数(分页用)
  };

  /** 画面元素对象定义 */
  PT.v={};

  /**
   * @class datas_index
   * @method attribute opts（options）
   * @constructor
   */
  function datas_index(opts){
    thiz=this;
    // 合并初始化参数选项
    thiz._g = $.extend({}, thiz._g, opts);
    // 初始化
    thiz.Init();
    return this;
  }
  
  /**
   * 初始化
   * @method Init
   * */
  PT.Init=function(){
    //画面元素定义
    fn.setView_el();
    //画面事件定义
    events.init();
    //数据字典
    fn.setSelect2();
    //画面初始化默认请求数据
    fn.setPagination({},thiz._g.top_page);
  };
  
  //画面元素事件
  var events={
    init: function(){
      events.Search();
      events.Toolbar();
    },
    //查询按钮事件
    Search: function(){
      thiz.v.btn.search.click(function(){
        //表单数据对象
        var param = thiz.v.search.serialize();
        //查询请求数据
        fn.setPagination(param,thiz._g.top_page);
      });
    },
    //添加按钮事件
    Toolbar: function(){
      thiz.v.btn.add.click(function(){

      });
    }
  };
  
  //方法
  var fn={
    /** 画面初始化元素定义 */
    setView_el: function () {
      //画面元素对象
      thiz.v.el = $('#sys_datas_index'); //画面总容器元素
      thiz.v.search = thiz.v.el.find('#sys_datas_index_search'); //画面元素：查询form
      thiz.v.table = thiz.v.el.find('#sys_datas_index_table'); //画面元素：表格
      thiz.v.pagination = thiz.v.el.find('#sys_datas_index_pagination'); //画面元素：翻页
      thiz.v.total_count = thiz.v.search.find('#sys_datas_index_total_count'); //画面元素：查询结果总数
      thiz.v.btn={
        search: thiz.v.search.find('button[name=search]'),  //查询按钮
        add: thiz.v.search.find('button[name=add]'),  //添加按钮
        del: thiz.v.search.find('button[name=del]'),  //删除按钮
        edit: thiz.v.search.find('button[name=edit]'),  //编辑按钮
        test: thiz.v.search.find('button[name=test]')  //测试运行按钮
      };
      thiz.v.search.status = thiz.v.search.find('input[name=status]');
      //画面元素默认状态
      thiz.v.btn.del.btnDisable(true);
      thiz.v.btn.edit.btnDisable(true);
      thiz.v.btn.test.btnDisable(true);
    },
    /** 窗口改变时，重新调整画面表格大小 */
    setDynamicWidth: function () {
      thiz.v.table.find('.dataTables_scrollHeadInner').css('width', '100%');
      thiz.v.table.find('.dataTables_scrollBody table').css('width', '100%');
      thiz.v.table.find('.dataTables_scrollHeadInner table').css('width', '100%');
    },
    /** 初始化Select2下拉选项 */
    setSelect2:function() {
      //数据字典处理
      var cb = function() {
        //字典数据绑定
        thiz.v.search.status.zySelect('ZR.0001', true, {width: '100%'});
        //thiz.v.search.status.select2('val','1'); //默认值
      };
      //预处理该画面所需的字典类型，以 , 号分割
      zy.cache.initDicts('ZR.0001', cb);
    },

    /**
     * 设置画面数据翻页
     * @method setPagination
     * @param {Object} param 发送请求参数json对象或表单对象：$('#formid').serialize();
     * @param {Number} pagenum 页码
     */
    setPagination: function(param, pagenum) {
      zy.log('Pagination sys_datas_index_table pagenum = ' + pagenum);
      $.jqPaginator(thiz.v.pagination, {
        totalCounts: 1,
        pageSize: thiz._g.pagesize,
        currentPage: pagenum,
        onPageChange: function(num) {
          zy.log('sys_datas_index_table onPageChange num = ' + num);
          // API获取指定页数据
          fn.getSearchData(param, num, fn.setDt);
        }
      });
    },
    /**
     * 调用API服务获取查询结果数据
     * @method getSearchData
     * @param {Object} param 请求参数
     * @param {Number} pagenum 页码
     * @param {Function} cb 回调函数 (callback)
     */
    getSearchData: function(param, pagenum, cb) {
      zy.g.am.app = "a1e22425b8574d67bf4f200b4ccde506";
      zy.g.am.mod = "webservice";
      zy.g.am.pagesize = thiz._g.pagesize;
      zy.net.get("api/list", function(res){if(res){cb(res,pagenum);}}, param, pagenum);
    },
    /**
     * 设置表格数据
     * @method setDt
     * @param {Object} res response数据
     * @param {Number} pagenum 页码
     */
    setDt: function (res, pagenum) {
      // 表格列定义
      var columns = [
        {
          //'title':'服务ID',
          'data': 'wsid'
        },
        {
          //'title':'服务名称',
          'data': 'wsname'
        },
        {
          //'title':'服务说明',
          'data': 'wsnote'
        },
        {
          //'title':'WSDL URI',
          'data': 'ws_uri'
        },
        {
          //'title':'模块名',
          'data': 'ws_mod_name'
        },
        {
          //'title':'函数名',
          'data': 'ws_func_name'
        },
        {
          //'title':'状态',
          'render': function(data, type, row, meta) {
            return zy.cache.cd2name('ZR.0001', row.status);
          }
        },
        {
          //'title':'创建时间',
          'data': 'createdt'
        },
        {
          //'title':'更新时间',
          'data': 'updatedt'
        }
      ];
      //预设初始化参数
      var options = {
        'data': res.data,
        'columns': columns
      };
      // 合并初始化参数选项
      $.extend(options, zy.ui.dataTable);

      // 加载数据
      if (res.count > 0) {
        zy.log('sys_datas_index_table setDt res.count = ' + res.count);
        thiz.v.total_count.html('总数:' + res.count);
        thiz.v.pagination.jqPaginator('option', {
          totalCounts: res.count,
          pageSize: thiz._g.pagesize,
          currentPage: pagenum
        });
      } else {
        thiz.v.total_count.html('查询结果总数: 0');
        thiz.v.pagination.jqPaginator('destroy');
      }
      //初始化 DataTable
      thiz.v.table.dataTable(options);
      fn.setDynamicWidth();
    }
  };

  return datas_index;
})();