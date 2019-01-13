/**
 * 数据字典类型
 * @class SQLPlug
 */
SQLPlug = (function () {

  var PT = SQLPlug.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {},
    page: 1, //开始页数
    count: 1 //总记录数
  };

  //表格元素对象
  var dt = $('#myfiletable');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class SQLPlug
   * @constructor
   */
  function SQLPlug() {
    Console.log("new SQLPlug()");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    thiz.Select();       
    thiz.DataTable();
    thiz.Toolbar();
    $('#myfile_edit').btnDisable(true);
    $('#myfile_view').btnDisable(true);
  };

  /**
   * 表格加载
   * @method DataTable
   * @param {Object} data 数据对象
   */
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "cname"
      },
	  {
        "render": function (data, type, row, meta) {
			return zy.cache.cd2name("52",row.ctype);
        }
      },
      {
        "data": "sqlid"
      },
      {
        "data": "sqlname"
      },
      {
        "data": "updatedt"
      },
	   {
        "render": function (data, type, row, meta) {
			return zy.cache.cd2name("3",row.status);
        }
      }
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

      Console.log($(e.target).is('button') + '==== ' + $(e.target).parents("form").html());
      //【修改状态,保存按钮】事件托管
      if ($(e.target).is('button')) {
        thiz.SaveStatus($(e.target).parents("form"));
      }

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
        $('#myfile_edit').btnDisable(true); 
		$('#myfile_view').btnDisable(true);  				
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        $('#myfile_edit').btnDisable(false);  
		$('#myfile_view').btnDisable(false);		
      }
    });
	//预览
	
	$('#myfile_view').click(function () {
      get_plugview(dt.DataTable().row('.active').data().sqlid);	
    });
    //查询
    $('#myfile_search').click(function () {
      $('#myfile_edit').btnDisable(true);
	  $('#myfile_view').btnDisable(true);
	  getview("");
      $('#myfile_search').button('loading');
      thiz.Pagination(1);
    });
    //添加
    $('#myfile_add').click(function () {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("bi/sqlplug/sqlplug_mod.html", $("#sqlplug_mod"));
    });
    //修改
    $('#myfile_edit').click(function () {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      Console.log("当前选择行 = " + rowIdx);
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.sqlid = data.sqlid; //获取选择行数据，设置参数
      zy.net.loadHTML("bi/sqlplug/sqlplug_mod.html", $("#sqlplug_mod"));
    });    
  };

  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  PT.Pagination = function (page) {
    Console.log('Pagination page = ' + page);
    $.jqPaginator('#myfile_pagination', {
      totalCounts: thiz._g.count,
      pageSize: zy.g.page.pagesize,
      currentPage: page,
      onPageChange: function (num) {
        Console.log('onPageChange num = ' + num);
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
      $('#myfile_search').button('reset');
      if (msg) {
        $('#myfile_edit').btnDisable(true);        
        thiz._g.count = msg.count; //获取总记录数
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#myfile_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#myfile_pagination').jqPaginator('destroy');
        }
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
      }
    };
    zy.g.comm.app = 'EWATERBI';
    zy.g.comm.mod = 'chartbi';
    zy.net.get("api/comm_sqlplug_view", cb, $('#myfile_form').serialize(), page);
  };
  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function () {
    thiz.Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function (msg) {
    //Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    //Console.log("更新前的行数据 = " + JSON.stringify(data));
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '无效';
    }
    //Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };

  PT.Select = function () {    
    var cb = function () {      
      $("#myfile_form input[name=status]").zySelect('3', true, {
        width: '150px'
      });
	  $("#myfile_form input[name=ctype]").zySelect('52', true, {
        width: '150px'
      });
    };    
    zy.cache.initDicts('3,52', cb);
  };
    
	function getview(html){
		if(""!=html){html="<label>预览"+html+"</label>";}
		$("#sqlplug_mod_view").html(html);
	}	
	function get_plugview(prams){
		zy.g.comm.app = 'EWATERBI';
		zy.g.comm.mod = 'chartbi';
		zy.net.get("api/comm_getplugs", function(msg) {
			var inp = eval(msg.html[0].data);
			$.each(inp, function(i, b) {get_plug(b);});// call get_plug
		},{prams:prams});
	}	
		
	function get_plug(plug){	   			
		getview(plug.plughtml);	
		get_plugdata(plug.pramid, function() {
			$(plug.plugid).select2({
				allowClear: true,
				multiple: plug.multiple,
				data:plugdatas[plug.pramid],	
				placeholder:plug.plugnm,
				formatSelection: format,
				formatResult: format
			});		
		});
    }	    
    function format(item) { return item.name; }
		function get_plugdata(prams, cb){
		zy.g.comm.app = 'EWATERBI';
		zy.g.comm.mod = 'chartbi';
		zy.net.get("api/comm_getplugdata", function(msg) {
			plugdatas[msg.key[0].key] = msg.results;	
			cb && cb();
		},{prams:prams});				
	}
  return SQLPlug;
})();
	
