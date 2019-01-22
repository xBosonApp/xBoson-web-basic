/**
 * 数据源管理
 * @class MgtDataSource
 */
MgtDataSource = (function() {

  var PT = MgtDataSource.prototype;
  var thiz;

  PT._g = {
    data: [],
    param: {},
    page: 1, //开始页数
    count: 1, //总记录数
    crt_page: 1 //当前页
  };

  //表格元素对象
  var dt = $('#mgt_datasource_dt');

  function MgtDataSource() {
    thiz = this;
    thiz.Init();
    thiz.Select();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.DataTable();
    thiz.Toolbar();
    $('#mgt_datasource_edit').btnDisable(true);
    $('#mgt_datasource_delete').btnDisable(true);
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
      "title": "数据源ID",
      "data": "did"
    }, {
      "title": "数据源名称",
      "data": "dn"
    }, {
      "title": "数据库类型",
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name("ZR.0014", row.dbtype);
      }
    }, {
      "title": "数据库物理名称",
      "data": "en"
    }, {
      "title": "数据库中文名称",
      "data": "cn"
    }, {
      "title": "标记",
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name("ZR.0004", row.flg);
      }
    }, {
      "title": "所有者",
      "data": "orgnm"
    }, {
      "title": "连接池",
      "render": function(data, type, row, meta) {
        return zy.cache.cd2name("ZR.0045", row.pool_enabled);
      }
    }, {
      "title": "状态",
      "render": function(data, type, row, meta) {
        var _data, str, str0, str1;
        // 参数设置
        _data = 'data-did=\'' + row.did + '\'';
        _data += ' data-status=\'' + row.status + '\'';
        if (row.status === '1') {
          str0 = '';
          str1 = 'checked=\'checked\'';
        } else {
          str0 = 'checked=\'checked\'';
          str1 = '';
        }
        str = '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'0\' ' + str0 + '><span>无效</span></label></div>';
        str += '<div class=\'radio\'><label><input type=\'radio\' name=\'status\' value=\'1\' ' + str1 + '><span>有效</span></label></div>';
        return '<a href=\"javascript:void(0);\" rel=\"popover\" data-placement=\"left\" data-original-title=\"<i class=\'fa fa-fw fa-pencil\'></i> 修改状态\" data-content=\"<form id=\'mgt_datasource_status_form\' onsubmit=\'return false;\' ' + _data + ' style=\'min-width:170px\'>' + str + '<div class=\'form-actions\'><div class=\'row\'><div class=\'col-md-12\'><button id=\'mgt_datasource_status_form\' class=\'btn btn-primary btn-sm\' type=\'submit\'>保存</button></div></div></div></form>\" data-html=\"true\">' + zy.cache.cd2name('ZR.0001', row.status) + '</a>';
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
        $('#mgt_datasource_edit').btnDisable(true);
        $('#mgt_datasource_delete').btnDisable(true);
      } else {
        dt.DataTable().$('tr.active').removeClass('active');
        $(this).addClass('active');
        //不能修改的
        var data = dt.DataTable().row($(this)).data();
         $('#mgt_datasource_edit').btnDisable(false);
          $('#mgt_datasource_delete').btnDisable(false);
        /* console.log(data.owner) ;
         console.log(zy.g.comm.org);*/
        // if (data.owner == zy.g.comm.org) {
        //   /* console.log('deng');*/
        //   $('#mgt_datasource_edit').btnDisable(false);
        //   $('#mgt_datasource_delete').btnDisable(false);
        // } else {
        //   /* console.log('budeng');*/
        //   $('#mgt_datasource_edit').btnDisable(true);
        //   $('#mgt_datasource_delete').btnDisable(true);
        // }
        // $('#mgt_datasource_edit').btnDisable(false);
        // $('#mgt_datasource_delete').btnDisable(false);
      }
    });

    //查询
    $('#mgt_datasource_search').click(function() {
      $('#mgt_datasource_edit').btnDisable(true);
      $('#mgt_datasource_delete').btnDisable(true);
      $('#mgt_datasource_search').button('loading');
      Pagination(1);

    });
    //添加
    $('#mgt_datasource_add').click(function() {
      thiz._g.param.flg = 'i'; //设置添加模式标记
      zy.net.loadHTML("mgt/datasource/add_upddatasource.html", $("#mgt_datasource_form2"), function() {
        $("#add_upddatasource_title").text('添加');
      });
      thiz.add_upd();
    });
    //修改
    $('#mgt_datasource_edit').click(function() {
      // 当前选择行 index
      var rowIdx = dt.DataTable().row('.active').index();
      // 当前选择行数据
      var data = dt.DataTable().row('.active').data();
      thiz._g.param.flg = 'u'; //设置修改模式标记
      thiz._g.param.did = data.did; //获取选择行数据，设置参数
      zy.net.loadHTML("mgt/datasource/add_upddatasource.html", $("#mgt_datasource_form2"), function() {
        thiz.add_upd();
        var callback = function(msg) {
          $('#add_upddatasource_form').formDisable(false);
          if (msg) {
            $('#add_upddatasource_form').json2form(msg.result[0]);
            //触发dbtype事件
            $("#add_upddatasource_form input[name=dbtype]").change();
          }
        };
        var did = {
          did: thiz._g.param.did
        };
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'datasource';
        zy.net.get("api/getdatasourceupt", callback, did);
        $("#add_upddatasource_title").text('修改');
        $("#add_upddatasource_form input[name=did]").attr('readonly', true);
        $("#add_upddatasource_b").remove();
      });
    });

    //删除
    $('#mgt_datasource_delete').click(function() {
      zy.ui.mask('删除确认', '数据删除后将不能再恢复，是否确定删除该数据？', function() {
        $('#mgt_third_applist_form').formDisable(true);
        var param = {};
        var data = dt.DataTable().row('.active').data();
        param.did = data.did;
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'datasource';
        zy.net.get('api/deletedatasource', function(msg) {
          if (msg) {
            $('#mgt_third_applist_form').formDisable(false);
            dt.DataTable().row('.active').remove().draw();
            Pagination(thiz._g.crt_page); //更新当前页
            zy.ui.msg("提示信息：", "删除成功！", "s");
          } else {
            zy.ui.msg('提示', '删除失败', 'e');
          }
        }, param);
      });
    });
  };

  PT.add_upd = function() {
    //form
    var addup_form=$("#add_upddatasource_form");
    //dbtype
    var jq_dbtype=addup_form.find('[name=dbtype]');
    //en
    var jq_en=addup_form.find('[name=en]');
    //dhost
    var jq_dhost=addup_form.find('[name=dhost]');
    //dport
    var jq_dport=addup_form.find('[name=dport]');
    //url
    var jq_url=addup_form.find('[name=url]');
    // 字典数据绑定
    $("#add_upddatasource_form input[name=status]").zySelect('ZR.0001', false, { width: '100%' });
    $("#add_upddatasource_form input[name=dbtype]").zySelect('ZR.0014', false, { width: '100%' });
    $("#add_upddatasource_form input[name=flg]").zySelect('ZR.0004', false, { width: '100%' });
    $("#add_upddatasource_form input[name=pool_enabled]").zySelect('ZR.0045', false, { width: '100%' });
    if (thiz._g.param.flg === 'i') {
      $("#add_upddatasource_form input[name=status]").select2('val','1');
      $("#add_upddatasource_form input[name=flg]").select2('val','1');
      $("#add_upddatasource_form input[name=pool_enabled]").select2('val','0');
    }
    //dbtype绑定change事件
    $("#add_upddatasource_form input[name=dbtype]").on("change",function(){
      if($(this).val()=="03" || $(this).val()=="06" ){
        $("#add_upddatasource_en").html("SID");
      }else{
        $("#add_upddatasource_en").html("数据库物理名称");
      }
    });
    //dbtype,en,dhost,dport的change事件
    addup_form.find('[name=dbtype],[name=en],[name=dhost],[name=dport]').change(function(e){
      var dbtype=jq_dbtype.val(),en=jq_en.val(),dhost=jq_dhost.val(),dport=jq_dport.val();
      jq_url.val(gene_jdbc_url(dbtype,en,dhost,dport));
    });
    //生成jdbc url
    function gene_jdbc_url(dbtype,en,dhost,dport){
      zy.log('dbtype='+dbtype+'|en='+en+'|dhost='+dhost+'|dport='+dport);
      var jdbc_url='';
      switch(dbtype){
        case '01':
          //mysql
          jdbc_url='jdbc:mysql://'+dhost+(dport?':'+dport:'')+(en?'/'+en:'');
          break;
        case '02':
          //sqlserver
          jdbc_url='jdbc:sqlserver://'+dhost+(dport?':'+dport:'')+(en?';databaseName='+en:'');
          break;
        case '03':
          //oracle
          jdbc_url='jdbc:oracle:thin:@'+dhost+(dport?':'+dport:'')+(en?':'+en:':ORCL');
          break;
        case '04':
          //db2
          jdbc_url='jdbc:db2://'+dhost+(dport?':'+dport:'')+(en?'/'+en:'');
          break;
        case '05':
          //mpp
          jdbc_url='jdbc:mpp://'+dhost+(dport?':'+dport:'')+(en?'/'+en:'');
          break;
        case '06':
          //mpp
          jdbc_url='jdbc:inspur:thin:@'+dhost+(dport?':'+dport:'')+(en?':'+en:':kdb');
        break;
        default:
          jdbc_url='';
      }
      return jdbc_url;
    }
    //测试jdbc连接按钮事件
    addup_form.find('button[name="test-jdbc-conn"]').click(function(){
      var user_name = addup_form.find('input[name=user_name]').val();
      var pass = addup_form.find('input[name=pass]').val();
      var url  = addup_form.find('input[name=url]').val();
      var type = addup_form.find('input[name=dbtype]').val();
      var host = addup_form.find('input[name=dhost]').val();
      var port = addup_form.find('input[name=dport]').val();
      var db   = addup_form.find('input[name=en]').val();
      // var did  = addup_form.find('input[name=did]').val();
      
      //判断参数
      if(!user_name)
        return zy.ui.msg('提示：','请输入用户名','i');
      if(!pass)
        return zy.ui.msg('提示：','请输入密码','i');
      // if(!url)
      //   return zy.ui.msg('提示：','请输入JDBC URL','i');
      
      zy.g.am.app = 'ZYAPP_SYSMGT';
      zy.g.am.mod = 'datasource';
      zy.net.get("api/test_jdbc_conn",function(msg){
        if(msg&&msg.ret=='0'){
          if(msg.result&&msg.result[0]){
            if(msg.result[0].isconn=='1'){
              zy.ui.msg('提示信息：','连接成功','s');
              if (!url && msg.jdbc_url) {
                addup_form.find('input[name=url]').val(msg.jdbc_url);
              }
            }else{
              zy.ui.msg('提示信息：','连接失败：'+msg.result[0].message,'i');
            }
          }else{
            zy.ui.msg('提示信息：','连接失败：','s');
          }
        }
      },{
        user_name : user_name,
        pass : pass,
        url  : url,
        host : host,
        port : port,
        type : type,
        db   : db,
        // did  : did,
      });
    });
    //接口判断是否为开发商
    function inner_flag(msg){
      if(msg.result[0].isplatorg){
      }else{
        $("#add_upddatasource_form input[name=flg]").select2('val','1');
        $("#add_upddatasource_form input[name=flg]").attr('readonly', true);
      }
    }
    zy.g.am.app = 'zyapp_login';
    zy.g.am.mod = 'zymodule_login';
    zy.net.post("api/getuserorgtype", inner_flag);
    $('#add_upddatasource').modal('show');

    $("#add_upddatasource_form").validate({
      // Rules for form validation
      rules: {
        user_name: {
          required: true,
          maxlength: 50
        },
        dbtype: {
          required: true
        },
        en: {
          maxlength: 32
        },
        cn: {
          required: true,
          maxlength: 150
        },
        dhost:{
          required: true,
          maxlength: 50
        },
        dport:{
          required: true,
          maxlength: 11
        },
        url: {
          maxlength: 200
        },
        pass: {
          maxlength: 50
        },
        mark: {
          maxlength: 600
        }
      },
      // 验证成功后保存
      submitHandler: function(form) {
        var callback = function(msg) {
          $('#add_upddatasource_form').formDisable(false);
          if (msg) {
            if (thiz._g.param.flg == 'u') {
              thiz.SetRow($('#add_upddatasource_form').form2json());
            }
            $('#add_upddatasource').modal('hide');
            zy.ui.msg("提示信息：", "保存成功！", "s");

          }
          thiz.UpDt();
        };
        zy.g.am.app = 'ZYAPP_SYSMGT';
        zy.g.am.mod = 'datasource';
        if (thiz._g.param.flg == 'i') {
          zy.net.post("api/adddatasource", callback, $('#add_upddatasource_form').serialize());
        } else if (thiz._g.param.flg == 'u') {
          zy.net.post("api/setdatasource", callback, $('#add_upddatasource_form').serialize());
        }
        $('#add_upddatasource_form').formDisable(true);
      },
      // Do not change code below
      errorPlacement: function(error, element) {
        error.insertAfter(element.parent());
      }
    });
  };
  /**
   * 分页处理
   * @method Pagination
   * @param {Number} page 页码
   */
  function Pagination(page) {
      Console.log('Pagination page = ' + page);
      $.jqPaginator('#mgt_datasource_pagination', {
        totalCounts: thiz._g.count,
        pageSize: zy.g.page.pagesize,
        currentPage: page,
        onPageChange: function(num) {
          Console.log('onPageChange num = ' + num);
          thiz._g.crt_page = num; //当前页码
          SetDt(num);
        }
      });
    }
    /**
     * 设置表格数据
     * @method SetDt
     * @param {Number} page 页码
     */
  function SetDt(page) {
    Console.log('SetDt page = ' + page);
    var cb = function(msg) {
      $('#mgt_datasource_search').button('reset');
      if (msg) {
        $('#mgt_datasource_edit').btnDisable(true);
        $('#mgt_datasource_delete').btnDisable(true);
        thiz._g.count = msg.count; //获取总记录数
        thiz._g.data = msg.result;
        thiz.DataTable(msg.result);
        Console.log('if (msg) thiz._g.count = ' + thiz._g.count);
        if (msg.count > 0) {
          $('#mgt_datasource_pagination').jqPaginator('option', {
            totalCounts: thiz._g.count,
            pageSize: zy.g.page.pagesize,
            currentPage: page
          });
        } else {
          thiz._g.count = 1;
          thiz._g.page = 1;
          $('#mgt_datasource_pagination').jqPaginator('destroy');
        }
      }
    };
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'datasource';
    zy.net.get("api/getdatasourcelist", cb, $('#mgt_datasource_form').serialize(), page);
  }


  /**
   * 更新表格数据
   * @method UpDt
   */
  PT.UpDt = function() {
    Pagination(1);
  };
  /**
   * 设置和更新行数据
   * @method SetRow
   * @param {Object} msg 数据对象 $('#form_id').form2json()
   */
  PT.SetRow = function(msg) {
    Console.log("SetRow msg = " + JSON.stringify(msg));
    // 当前选择行数据
    var data = dt.DataTable().row('.active').data();
    // 修改数据并刷新 dataTable
    $.extend(data, msg);
    if (data.status === '1') {
      data.statusnm = '有效';
    } else {
      data.statusnm = '失效';
    }
    Console.log("更新后的行数据 = " + JSON.stringify(data));
    dt.DataTable().rows().invalidate().draw();
  };
  /**
   * 保存状态修改结果
   * @method SaveStatus
   * @param {Object} el 表单对象
   */
  PT.SaveStatus = function(el) {
    var param = {};
    var st = zy.ui.form.getRadioValue('status', el);
    // 状态值是否有变化
    if (st == el.data("status")) return;
    var cb = function(msg) {
      if (msg) {
        thiz.SetRow(param);
        $('[rel=popover]').each(function() {
          $(this).popover('hide');
        });
        zy.ui.msg('提示信息：', '保存【状态】成功！', 's');
      }
      thiz.UpDt(); //刷新页面
    };
    param.did = el.data('did');
    param.status = st;
    zy.g.am.app = 'ZYAPP_SYSMGT';
    zy.g.am.mod = 'datasource';
    zy.net.get('api/setdatasourcestatus', cb, param);
  };
  PT.Select = function() {
    // 数据字典处理
    var cb = function() {
      $("#mgt_datasource_form input[name=status]").zySelect('ZR.0001', true, { width: '100%' });
      $("#mgt_datasource_form input[name=status]").select2('val', '1');
    };
    // 预处理该画面所需的字典类型，以 , 号分割
    zy.cache.initDicts('ZR.0001,ZR.0014,ZR.0004,ZR.0045', cb);
  };
  return MgtDataSource;
})();