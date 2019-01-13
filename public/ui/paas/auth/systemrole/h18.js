/**
 * 选择系统信息
 * @class AuthGetsystemlist
 */
AuthGetsystemlist = (function () {

  var PT = AuthGetsystemlist.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    paramdata: [],
    param: {
      orgid: ""
    },
  };

  //表格元素对象
  var dt = $('#auth_h18_dt');

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class EaGetalarmmanage
   * @constructor
   */
  function AuthGetsystemlist() {
    Console.log("new AuthGetsystemlist()");
    thiz = this;
    //为orgid赋值
    thiz._g.param.orgid = auth_h16._g.param.orgid;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function () {
    //thiz.ResponseStatus();
    thiz.Getsystemdict();
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
  PT.DataTable = function (data) {
    //定义绑定数据结构
    var columns = [
      {
        "data": "sysid"
    },
      {
        "data": "sysnm"
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
  PT.Toolbar = function () {
    // 单击事件
    dt.on('click', 'tr', function (e) {
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
      }
    });
  };

  /**
   * 表格数据加载显示
   * Getsystemdict 事件处理
   * @method Getsystemdict
   */
  PT.Getsystemdict = function () {
    var cb = function (msg) {
      if (msg) {
        thiz.DataTable(msg.result);
        //thiz._g.data = msg.result;
      }
    };
    var param2 = {};
    param2.orgid = thiz._g.param.orgid;
    param2.paramdata = auth_h16._g.paramdata.join();
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'systemrole';
    zy.net.get("api/getsystemlist", cb, param2);
  };
  /**
   * form表单处理
   * @method validate
   */
  PT.validate = function () {
    $('#auth_h18_form').validate({
      submitHandler: function (form) {
        //获取选择数据
        var data = dt.DataTable().row('.active').data();
        auth_h16._g.paramdata.push(data.sysid);

        var add = [{
          sysid: data.sysid,
          sysnm: data.sysnm,
          statusnm: "有效"
        }];
        //合并数据，重新显示h16的datatable
        var enddata = add.concat(auth_h16._g.data);
        auth_h16._g.data = enddata;
        auth_h16.DataTable(enddata);
        //关闭当前模态
        $('#auth_h18_modal').modal('hide');
      },
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
    });
  };
  //  //dialog取消按钮事件
  //  function cb2() {
  //    thiz.callback && thiz.callback();
  //  }
  //选择系统信息
  //    $('#select_btn').click(function () {
  //      thiz._g.param.flg = 'i'; //设置添加模式标记
  //      zy.net.loadHTML("auth/systemrole/h18.html", $("#auth_h18_form"));
  //    });
  //回调，模态框显示
  //  PT.callback = function() {
  //    $('#auth_h18_modal').modal('show');
  //  };
  return AuthGetsystemlist;
})();