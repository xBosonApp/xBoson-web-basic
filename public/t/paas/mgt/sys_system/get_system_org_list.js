/**
 * 系统所属机构信息 
 * @class MgtGetsystemorglist
 */
MgtGetsystemorglist = (function() {

  var PT = MgtGetsystemorglist.prototype;
  var thiz;
//  var sysid;
//  var mgt_system = null;
  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    paramdata: [],
    param: {sysid:""},
  };

  //表格元素对象
  var dt = $('#get_system_org_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class EaGetalarmmanage
   * @constructor
   */
  function MgtGetsystemorglist() {
    Console.log("new MgtGetsystemorglist(obj)");
    thiz = this;
//    mgt_system = obj;
		//为orgid赋值
		//thiz._g.param.sysid=get_system_org._g.param.sysid;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    //thiz.ResponseStatus();
    thiz.Getsystemorgdict();
    thiz.Toolbar();
    thiz.validate();
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
    var columns = [
    {
      "data":"orgid"
    },
    {
      "data": "de0810013j"
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
      Console.log($(e.target).is('input') + '==== ' + $(e.target).parents("form").html());

      // 变换选择行状态颜色
      if (!$(this).find('div').hasClass('popover') && $(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        sysid = dt.DataTable().row('.active').data();
      }
    });
  };

  /**
   * 表格数据加载显示
   * Getsystemorgdict 事件处理
   * @method Getsystemorgdict
   */
  PT.Getsystemorgdict = function() {
    var cb = function(msg) {
      if (msg) {
        thiz.DataTable(msg.result);
      }
    };
    var param2 = {};
    param2.sysid = mgt_system._g.param.sysid;
//    Console
    //param2.paramdata=get_system_org._g.paramdata.join();
    zy.g.am.app = 'zyapp_sysmgt';
    zy.g.am.mod = 'system_mgt';
    zy.net.get("api/getsysorginfo", cb, param2);
  };
	/**
   * form表单处理
   * @method validate
   */
	PT.validate = function() {
		$('#get_system_org_form').validate({
		  submitHandler : function(form){
				//获取选择数据
				var data=dt.DataTable().row('.active').data();
				var add=[{sysid:data.sysid , sysnm:data.sysnm, statusnm:"有效"}];
				//合并数据，重新显示h16的datatable
				var enddata=add.concat(gt_sys_system_getsystemlist_wid1._g.data);
				get_system_org.DataTable(enddata);
				//关闭当前模态
				$('#get_system_org_modal').modal('hide');
			},
			errorPlacement: function (error, element) {
			  error.insertAfter(element.parent());
		  }
		});
	};
  return MgtGetsystemorglist;
})();