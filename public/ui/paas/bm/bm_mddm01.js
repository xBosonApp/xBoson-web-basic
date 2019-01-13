/**
 * bm_mddm01.html 视图模型定义画面
 * @class bm_mddm01
 *
 * 用法说明：
 *  所选的zTree节点数据对象(node.typecd=视图模型ID、node.new_node=新创建模型标记)
 *  var options = {node:node};
 *  var _m = new bm_mddm01(options); // 设置参数选项
 *  _m.m; // Model数据对象
 */
bm_mddm01 = (function () {

  var pt = bm_mddm01.prototype;

  /**
   * 默认选项
   * @attribute defaults
   * @private
   */
  pt.defaults = {};

  // 画面元素对象(表单);
  var el = $('#bm-mddm01');
  /**
   * View 画面元素对象
   * @attribute v
   * @private
   */
  pt.v = {
    // 画面元素对象(表单);
    el: el,
    // 配置模式视图
    setup: el.find('#bm-mddm01-setup'),
    // 手写SQL模式视图
    sql: el.find('#bm-mddm01-sql'),
    // 数据源
    did: el.find('input[name=did]'),
    // 是否手写SQL
    editingtype: el.find('input[name=editingtype]'),
    // 是否为图表专用 
    onlychart: el.find('input[name=onlychart]'),
    // SQL语句内容
    sqltext: el.find('textarea[name=sqltext]'),
    // from内容
    tables: el.find('textarea[name=tables]'),
    // 添加表关联 按钮
    join: el.find('#bm-mddm01-where-join'),
    // 添加查询条件 按钮
    item: el.find('#bm-mddm01-where-item'),
    // 图表类型
    chart_type: el.find('[name=chart_type]'),
    // 第一列是否是X轴
    first_is_x: el.find('[name=first_is_x]')
  };

  /**
   * Model数据
   * @attribute m
   * @private
   */
  pt.m = {
    // [数据源]数据
    did: {val:'00000000000000000000000000000000', name:'平台'},
    // [编辑项目]数据
    sel_whe_columns: [],
    // [select]数据
    sel_select: [],
    // [from]数据
    sel_from: '',
    // 数据视图(WHERE)查询条件定义 Select 2 用 table list
    sel_fromTableList: [],
    // 数据视图(WHERE)查询条件定义 Select 2 用 各 table 对应的字段 list 的 map
    sel_fromTableColumnMap: {},
    // [where]数据
    sel_where: {'params': [], 'contact': []},
    sel_whereTempParams: {},
    sel_whereTempContact: {},
    sel_whereIndex: 0,
    // [保存]提交用视图模型定义数据对象
    data: {
      typecd: '', // 视图模型ID
      did: '', // 数据源ID
      editingtype: '', // 是否手动编辑SQL语句
      onlychart: '', // 是否为图表专用
      jsondata_select: '', // select内容(json)
      fromcontent: '', // from内容
      jsondata_where: '', // where内容(json)
      sel_whe_columns: '', // [编辑项目]内容(json)
      sqltext: '', // SQL语句
      chart_type: '',  //手写SQL的图表类型
      first_is_x: ''  //第一列是否是X轴
    }
  };

  /**
   * @class bm_mddm01 构造方法
   * @constructor
   * @param {Object} options 参数
   */
  function bm_mddm01(options) {
    // 合并初始化参数选项
    pt.opts = $.extend({}, pt.defaults, options);
    pt.Init();
    // 页面初始化设置
    // pageSetUp();
    return this;
  }

  /**
   * 初始化
   * @method init
   */
  pt.Init = function () {
    // 数据初始化
    initData.init();
    // 是否新创建数据视图
    pt.opts.node.new_node ? fn.create() : fn.editor();
    // 事件绑定
    events.init();
  };

  /** 数据初始化 */
  var initData = {
    /** 初始化 */
    init: function () {
      // 初始化数据字典
      initData.dicts();
      // 初始化数据源Select2数据
      initData.did();
    },
    /** 数据字典初始化 */
    dicts: function () {
      // 字典 数据图形，[是/否]，SQL比较符，SQL比较符 - 表关联，类别转换
      zy.cache.initDicts('ZR.0002,ZR.0045,ZR.0049,ZR.0064,ZR.004101', function(){
        pt.v.editingtype.zySelect('ZR.0045', false, {width: '100%',allowClear:false,minimumResultsForSearch:-1});
        pt.v.editingtype.select2('val', '0'); //默认值（NO）
        // 是否图表专用
        pt.v.onlychart.zySelect('ZR.0045', false, {width: '100%',allowClear:false,minimumResultsForSearch:-1});
        pt.v.onlychart.select2('val', '1');
        //手写SQL时选择图表类型select2
        pt.v.chart_type.zySelect('ZR.0002', false, {width: '100%',multiple: 'multiple'});
        // 第一列是否是X轴select2
        pt.v.first_is_x.zySelect('ZR.0045', false, {width: '100%',allowClear:false});
        pt.v.first_is_x.select2('val', '1');
      });
    },
    /** 数据源Select2数据初始化 */
    did: function () {
      zy.extend.get({
        app:'c879dcc94d204d96a98a34e0b7d75676',
        mod:'tableandindex',
        apinm:'datasource'
      }, function (msg) {
        pt.v.did.zySelectCustomData('', false, {width: '100%', allowClear: false}, msg.data);
      }, {});
    }
  };

  /** 事件绑定规则定义 */
  var events = {
    /** 事件绑定初始化 */
    init: function () {
      // 阻止下拉菜单事件冒泡，导致点选checkbox时菜单关闭
      events.dropdown_click;
      // 下拉选框事件：数据源值发生变化时发生
      events.did_change;
      // 按钮事件：弹出编辑项目模态画面
      events.items_modal_click;
      // 下拉选框事件：是否手动编辑SQL语句
      events.sql_click;
      // 下拉选框事件：是否图表专用 
      events.onlychart_click;
      // 拖拽方式排序项目
      events.sorting_change();
      // 按钮事件：保存视图模型定义
      events.save;
    },
    /** 阻止下拉菜单事件冒泡，导致点选checkbox时菜单关闭 */
    dropdown_click: pt.v.setup.find('.dropdown-menu').find('input[type=checkbox]').on('click', function(event){
      event=event?event:window.event;
      event.stopPropagation();
    }),
    /** 下拉选框事件：数据源值发生变化时发生 */
    did_change: pt.v.did.on('change', function(){
      var v_old = pt.m.did.val;
      var t_old = pt.m.did.name;
      pt.m.did.val = $(this).val();
      pt.m.did.name = $(this).select2('data').name;
      zy.ui.mask('修改数据源为：'+'['+pt.m.did.name+']',
        '是否清空原'+'['+t_old+']'+'数据源下面全部设置！',
        function sure() {
          // 清空Model数据及更新画面处理！
          // [编辑项目]数据
          pt.m.sel_whe_columns = [];
          // [select]数据
          pt.m.sel_select = [];
          // [from]数据
          pt.m.sel_from = '';
          // [where]数据
          pt.m.sel_where = {'params': [], 'contact': []};
          pt.m.sel_whereTempContact = {};
          pt.m.sel_whereTempParams = {};
          pt.m.sel_whereIndex = 0;
          // 清空画面配置选项
          pt.v.setup.find('#bm-mddm01-nestable1').find('.dd-list').empty();
          pt.v.setup.find('#bm-mddm01-where-list').empty();
          pt.v.tables.val('');
          pt.v.sqltext.val('');
        },
        function cancel() {
          // todo:保留Model数据及画面配置，无操作（适用于不同数据源但数据集相同的场合）！
          pt.m.did.val = v_old;
          pt.m.did.name = t_old;
          pt.v.did.select2('val', v_old);
        }
      );
    }),
    /** 按钮事件：弹出编辑项目模态画面 */
    items_modal_click: pt.v.setup.find('#bm-mddm01-items').on('click', function(e){
      zy.net.loadHTML('bm/bm_mddm02.html',$('#bm-mddm01-modal'),function(){
        // 关闭模态窗口回调函数
        var callback = function() {
          // 返回数据对象给Model
          pt.m.sel_whe_columns=_bm_mddm02.opts.data;
          zy.log('编辑项目模态画面=' + JSON.stringify(pt.m.sel_whe_columns));
          // 清空 pt.m.sel_whereTempContact, pt.m.sel_whereTempParams
          pt.m.sel_whereTempContact = {};
          pt.m.sel_whereTempParams = {};
          // 清空 pt.m.sel_where
          pt.m.sel_where = {'params': [], 'contact': []};
          fn.sel_whe_columns();
          // 更新画面
          fn.update(false);
        };
        // 加载模态画面
        var _bm_mddm02 = new bm_mddm02({did:pt.m.did.val,flag:pt.opts.node.new_node}, pt.m.sel_whe_columns, callback);
      });
    }),
    /** 下拉选框事件：是否手动编辑SQL语句 */
    sql_click: pt.v.editingtype.on('change', function () {
      if ($(this).val() === '0') {
        // 配置模式
        pt.v.setup.show();
        pt.v.sql.hide();
      } else {
        // 手写SQL模式
        pt.v.setup.hide();
        // 如果画面元素[tables]不为空，提示是否覆盖原有SQL内容
        var sqlText = pt.v.sqltext.val();
        var newSqlText = fn.tosql();
        if (sqlText === '') {
          pt.v.sqltext.val(newSqlText);
        } else if (sqlText !== newSqlText) {
          zy.ui.mask('数据更新','是否覆盖原有手写SQL语句内容！',
            function sure() {
              // 重新生成SQL语句内容并覆盖原有SQL内容
              pt.v.sqltext.val(newSqlText);
            },
            function cancel() {
              // todo:不覆盖原有SQL内容，无操作！
            }
          );
        }
        pt.v.sql.show();
      }
    }),
    /** 下拉选框事件：是否图表专用 **/
    onlychart_click: pt.v.onlychart.on('change', function () {
    }),
    /** 拖拽事件：排序项目 */
    sorting_change: function () {
      pt.v.setup.find('#bm-mddm01-nestable1').nestable({maxDepth : 1}).on('change', function(e){
        var r = pt.v.setup.find('.dd').nestable('serialize');
      });
      pt.v.setup.find('.dd-handle a').on('mousedown', function(e){
        e.stopPropagation();
      });
    },
    /** 按钮事件：[保存视图定义]post提交视图模型定义数据 */
    save: pt.v.el.find('#bm-mddm01-save').on('click', function () {
      // 生成where内容(json)
      fn.toSelectWhere(pt.m.sel_whereTempContact,pt.m.sel_whereTempParams);
      // 生成select内容(json)
      pt.m.sel_select = pt.v.setup.find('.dd').nestable('serialize');
      // 验证
      if (pt.v.editingtype.val() === '0' && !fn.validation()) {
        return;
      }
      // 视图模型ID
      pt.m.data.typecd = pt.opts.node.typecd;
      // 数据源ID
      pt.m.data.did = pt.m.did.val;
      // 是否手动编辑SQL语句
      pt.m.data.editingtype = pt.v.editingtype.val();
      // 是否为图表专用
      pt.m.data.onlychart = pt.v.onlychart.val();
      // select内容(json)
      pt.m.data.jsondata_select = JSON.stringify(pt.m.sel_select);
      // from内容
      pt.m.data.fromcontent = pt.v.tables.val();
      // where内容(json)
      pt.m.data.jsondata_where = JSON.stringify(pt.m.sel_where);
      // [编辑项目]内容(json)
      pt.m.data.sel_whe_columns = JSON.stringify(pt.m.sel_whe_columns);
      
      // 根据当前用户选择[配置模式]还是[手写SQL语句模式]确定[SQL语句]的赋值方式
      if (pt.m.data.editingtype=='0') {
        // 配置模式：SQL语句 = 调用函数处理，并返回生成SQL语句内容
        pt.m.data.sqltext = fn.tosql();
      } else {
        // 手写SQL语句模式
        pt.m.data.sqltext = pt.v.sqltext.val();
        pt.m.data.chart_type = pt.v.chart_type.val();
        pt.m.data.first_is_x = pt.v.first_is_x.val();
      }

      // 调用api以post方式提交数据
      if(pt.opts.node.new_node===true){
        // 添加模式
        zy.extend.post({
          app:'c770045becc04c7583f626faacd3b456',
          mod:'mddm_view',
          apinm:'addviewmodal'
        },function(msg){
          if(msg){
            pt.opts.node.new_node=false;
            pt.opts.node.bm003='1';
            zy.ui.msg('提示信息：','保存成功！','s');
            pt.v.el.find('#bm-mddm01-save').html('修改视图定义');
          }
        },pt.m.data);
      }else{
        // 修改模式
        zy.extend.post({
          app:'c770045becc04c7583f626faacd3b456',
          mod:'mddm_view',
          apinm:'updviewmodal'
        },function(msg){
          if(msg){
            zy.ui.msg('提示信息：','修改成功！','s');
          }
        },pt.m.data);
      }
    }),
    /** 按钮事件：数据视图(WHERE)查询条件定义[添加表关联] */
    where_join_click: pt.v.setup.find('#bm-mddm01-where-join').on('click', function() {
      fn.whereJoin(null);
    }),
    /** 按钮事件：数据视图(WHERE)查询条件定义[添加查询条件] */
    where_item_click: pt.v.setup.find('#bm-mddm01-where-item').on('click', function() {
      fn.whereItem(null);
    }),

    /** select 项目事件 */
    select_items: function () {
      var items = pt.v.setup.find('#bm-mddm01-nestable1');
      // 项目别名修改是发生
      items.find('.style-0').on('change', function(e){
        var ele = $(e.target);
        // 更新 dd-item 的 data-alias_name 属性值，data-column_name_cn 属性值
        ele.closest('.dd-item').data(ele.attr('name'),ele.val());
        zy.log('项目别名或列中文名修改时发生.val() = ' + ele.val());
      });
      // 项目设置时发生
      items.find('.btn-group').find('.dropdown-menu').unbind('click').on('click', function(e){
        var ele = $(e.target).closest('li').find('input[type=checkbox]');
        if(ele.length===0){
          return false;
        }
        // 判断是否已经选取
        if(ele.prop('checked')) {
          zy.log('已选，项目设置时发生.val() = ' + ele.attr('value'));
          // 设为选中
          // ele.attr('checked','checked'); // 设为选中
          // 更新 dd-item 的属性值
          ele.closest('.dd-item').data(ele.attr('value'),'1');
        }
        else {
          zy.log('未选，项目设置时发生.val() = ' + ele.attr('value'));
          // 设为取消选取
          // ele.attr('checked','');
          // 更新 dd-item 的属性值
          ele.closest('.dd-item').data(ele.attr('value'),'0');
        }
        e=e?e:window.event;
        e.stopPropagation();
      });
      // 项目设置图表时发生
      items.find('.pull-right').find('.dropdown-menu').unbind('click').on('click', function(e){
        var ele = $(e.target);
        // 判断是否已经选取
        if(ele.attr('checked')===undefined || ele.attr('checked')==='') {
          zy.log('未选，项目设置图表时发生.val() = ' + ele.attr('value'));
          // 设为选中
          ele.attr('checked','checked'); // 设为选中
        }
        else {
          zy.log('已选，项目设置图表时发生.val() = ' + ele.attr('value'));
          // 设为取消选取
          ele.attr('checked','');
        }
        // 更新 dd-item 的 data-alias_name 属性值
        zy.log('项目设置图表时发生.val() = ' + ele.attr('value'));
        // 更新 dd-item 的属性值（chart） 以逗号分隔的字符串
        var chkboxs = ele.closest('.pull-right').find('input[type=checkbox]');
        var _res = "";
        $.each(chkboxs,function(i,v){
          if($(v).prop('checked')){
            _res=_res+','+$(v).val();
          }
        });
        _res = _res.substring(1);
        ele.closest('.dd-item').data('chart',_res);
        // 事件冒泡
        e=e?e:window.event;
        e.stopPropagation();
      });

    }

  };

  /** 逻辑函数处理 */
  var fn = {
    /** 创建数据视图 */
    create : function () {
      // 数据源默认值=平台
      pt.v.did.select2('val', pt.m.did.val);
      // 添加场合：初始化画面
      pt.v.el.find('#bm-mddm01-save').html('添加视图定义');
      fn.update(false);
    },
    /** 编辑数据视图 */
    editor : function () {
      pt.v.el.find('#bm-mddm01-save').html('修改视图定义');
      // 用视图模型ID[pt.opts.node.typecd]获取视图模型数据并初始化画面
      zy.extend.post({
        app:'c770045becc04c7583f626faacd3b456',
        mod:'mddm_view',
        apinm:'getviewmodalupd'
      },function(msg){
      try {
        if(msg && msg.result){
          if(msg.result[0].editingtype=='1'){
            pt.v.setup.hide();
            pt.v.sql.show();
          }
          // 根据api返回数据初始化Model数据
          // did
          pt.m.did.val = msg.result[0].did;
          // editinngtype
          pt.m.data.editingtype = msg.result[0].editingtype;
          // onlychart
          pt.m.data.onlychart = msg.result[0].onlychart;
          // sel_select
          if(msg.result[0].jsondata_select.trim()!==''){
            pt.m.sel_select = JSON.parse(msg.result[0].jsondata_select);
          }
          // sel_from
          pt.m.sel_from = msg.result[0].fromcontent;
          //s el_where
          if(msg.result[0].jsondata_where.trim()!==''){
            pt.m.sel_where = JSON.parse(msg.result[0].jsondata_where);
          }
          // sel_whe_columns
          if(msg.result[0].sel_whe_columns.trim()!==''){
            pt.m.sel_whe_columns = JSON.parse(msg.result[0].sel_whe_columns);
            fn.sel_whe_columns();
          }
          // sqltext
          pt.m.data.sqltext = msg.result[0].sqltext;
          if(msg.result[0].typecontent){
            var typecontentObj = JSON.parse(msg.result[0].typecontent);
            // first_is_x
            if(typecontentObj.type[0].chart && typecontentObj.type[0].chart.length>0){
              pt.m.data.first_is_x = '0';
              // chart_type
              pt.m.data.chart_type = typecontentObj.type[0].chart;
            }else{
              pt.m.data.first_is_x = '1';
              // chart_type
              pt.m.data.chart_type = typecontentObj.type[1]?typecontentObj.type[1].chart:'';
            }
          }

          // 修改场合：更新画面
          fn.update(true);
        } 
      } catch(e) {
        console.log('bm_mddm01.js', e);
      }
      },{'typecd':pt.opts.node.typecd});
    },
    /** 更新画面 */
    /*  @param {bool} flg 参数 */
    update: function (flg) {
      if (flg) {
        // 修改视图模型场合
        // 设置该视图模型对应的数据源select2赋值[did]
        pt.v.did.select2('val', pt.m.did.val);
        pt.m.did.name = pt.v.did.select2('data') && pt.v.did.select2('data').name;
        // 是否手动编辑select2
        pt.v.editingtype.select2('val', pt.m.data.editingtype);
        //是否为图表专用
        pt.v.onlychart.select2('val', pt.m.data.onlychart);
        // sqltext文本框赋值
        pt.v.sqltext.val(pt.m.data.sqltext);
        // sqltext对应的图表类型select2赋值
        pt.v.chart_type.select2('val',pt.m.data.chart_type.split(','));
        // sqltext的第一列是否为X轴
        pt.v.first_is_x.select2('val',pt.m.data.first_is_x);
      }
      // 画面处理
      fn.select(flg);
      fn.from();
      fn.where();
      function BtnWidthInit(){
        var dd_col5 = $('.dd3-content>.col-5');
        var dd_btn = dd_col5.find('.btn-group');
        var dd_col3 = $('.dd3-content>.col-3');
        var dd_input = dd_col3.children('label');

        var maxwid = 0;
        dd_btn.each(function(index,el) {
          if($(el).width() > maxwid) {
            maxwid = $(el).width();
          }
        });
        dd_col5.css('minWidth',maxwid);
        dd_col3.css('minWidth',dd_input.width())
      }  
      BtnWidthInit();
    },
    /** 画面数据绑定：数据视图(SELECT)项目定义 */
    select: function (flg) {
      // 画面动态项目List处理
      var ddList = pt.v.setup.find('#bm-mddm01-nestable1').find('.dd-list');
      ddList.empty(); // 先移除在插入
      if (flg) {
        $.each(pt.m.sel_select, function(i, t) {
          var sb = new zy.tool.string.StringBuffer();
          sb.append(' data-table_name="' + zy.tool.obj2Empty(t.table_name) + '"');
          sb.append(' data-table_name_cn="' + zy.tool.obj2Empty(t.table_name_cn) + '"');
          sb.append(' data-column_name="' + zy.tool.obj2Empty(t.column_name) + '"');
          sb.append(' data-column_name_cn="' + zy.tool.obj2Empty(t.column_name_cn) + '"');
          sb.append(' data-alias_name="' + zy.tool.obj2Empty(t.alias_name) + '"');
          sb.append(' data-is_where="' + zy.tool.obj2Empty(t.is_where) + '"');
          sb.append(' data-is_view="' + zy.tool.obj2Empty(t.is_view) + '"');
          sb.append(' data-is_readonly="' + zy.tool.obj2Empty(t.is_readonly) + '"');
          sb.append(' data-chart="' + zy.tool.obj2Empty(t.chart) + '"');
          sb.append(' data-dict="' + zy.tool.obj2Empty(t.dict) + '"');
          sb.append(' data-is_dictchk="' + zy.tool.obj2Empty(t.is_dictchk) + '"');
          sb.append(' data-datatype="' + zy.tool.obj2Empty(t.datatype) + '"');
          sb.append(' data-numrange="' + zy.tool.obj2Empty(t.numrange) + '"');
          var ddItem = $('<li class="dd-item dd3-item "' + sb.toString() + '></li>');
          var ddHandle = $('<div class="dd-handle dd3-handle">&nbsp;</div>');
          var dd3Content = $('<div class="dd3-content clearfix" style="padding-bottom:4px">&nbsp;</div>');
          var pullLeft1 = '';
          //有数据字典，则显示字段翻转checkbox
          if(t.dict && t.dict.trim()!=''){
            pullLeft1 = $('<div class="pull-left col-5"><div class="btn-group"><button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown"> [' + t.table_name_cn + '].[' + t.column_name_cn + '] <span class="caret"></span></button><ul class="dropdown-menu"><li><span class="font-xs">&nbsp;项目设置：</span></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_view" type="checkbox" '+(t.is_view=='1'?'checked=true':'')+'><span class="font-xs">画面显示</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_readonly" type="checkbox" '+(t.is_readonly=='1'?'checked=true':'')+'><span class="font-xs">画面只读</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_dictchk" type="checkbox" '+(t.is_dictchk=='1'?'checked=true':'')+'><span class="font-xs">字典翻转</span></label></li></ul></div></div>');
          }else{
            pullLeft1 = $('<div class="pull-left col-5"><div class="btn-group"><button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown"> [' + t.table_name_cn + '].[' + t.column_name_cn + '] <span class="caret"></span></button><ul class="dropdown-menu"><li><span class="font-xs">&nbsp;项目设置：</span></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_view" type="checkbox" '+(t.is_view=='1'?'checked=true':'')+'><span class="font-xs">画面显示</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_readonly" type="checkbox" '+(t.is_readonly=='1'?'checked=true':'')+'><span class="font-xs">画面只读</span></label></li><li>&nbsp;&nbsp;</li></ul></div></div>');
          }
          var pullLeft2 = $('<div class="pull-left col-3 text-right"><label><span>&nbsp;&nbsp;<b>AS</b></span>&nbsp;<input class="style-0" name="alias_name" type="text" value="' + t.alias_name + '" placeholder="设置项目别名"></label></div>');
          //列中文名
          var pullLeft3 = $('<div class="pull-left col-3 text-right"><label><span>&nbsp;&nbsp;<b>CN</b></span>&nbsp;<input class="style-0" name="column_name_cn" type="text" value="' + t.column_name_cn + '"></label></div>');
          var pullRight = $('<div class="pull-right"><button class="btn btn-success btn-xs dropdown-toggle" data-toggle="dropdown"> 图表 <span class="caret"></span></button></div>');
          var dropdown_menu_ul = $('<ul class="dropdown-menu"></ul>');
          var dropdown_menu_li1 = $('<li><span class="font-xs">&nbsp;项目对应的图表设置：</span></li>');
          dropdown_menu_ul.append(dropdown_menu_li1);
          // 从缓存中获取数据字典[图表类型] ZR.0002 循环赋值
          var ls = zy.cache.get('_mdm_dict', 'ls');
          var list = ls.get()['ZR.0002'];
          for (i in list) {
            var dropdown_menu_li2 = $('<li>&nbsp;&nbsp;<label><input class="checkbox" value="'+ list[i].id + '" type="checkbox" '+(t.chart.indexOf(list[i].id)!=-1?'checked=true':'')+'><span class="font-xs">' + list[i].name + '</span></label>');
            dropdown_menu_ul.append(dropdown_menu_li2);
          }
          pullRight.append(dropdown_menu_ul); // 图表选项
          dd3Content.append(pullLeft1); // 项目名
          dd3Content.append(pullLeft2); // 项目别名
          dd3Content.append(pullLeft3); // 项目列中文名
          dd3Content.append(pullRight); // 图表设置
          ddItem.append(ddHandle); // 拖拽Handle
          ddItem.append(dd3Content); // 项目容器
          ddList.append(ddItem); // 项目List
          
        });
      } else {
        // 选择表和列模态关闭之后
        // 遍历绑定数据对象
        $.each(pt.m.sel_whe_columns, function(i, t) {
          $.each(t.column_info, function(j, c) {
            if (c.is_select=="1") {
              var sb = new zy.tool.string.StringBuffer();
              sb.append(' data-table_name="' + zy.tool.obj2Empty(t.table_name) + '"');
              sb.append(' data-table_name_cn="' + zy.tool.obj2Empty(t.cn_name) + '"');
              sb.append(' data-column_name="' + zy.tool.obj2Empty(c.column_name) + '"');
              sb.append(' data-column_name_cn="' + zy.tool.obj2Empty(c.cn_name) + '"');
              sb.append(' data-alias_name="' + zy.tool.obj2Empty(c.column_name) + '"');
              sb.append(' data-is_where="' + zy.tool.obj2Empty(c.is_where) + '"');
              sb.append(' data-is_view=""');
              sb.append(' data-is_readonly=""');
              sb.append(' data-chart=""');
              sb.append(' data-dict="'+zy.tool.obj2Empty(c.dict)+'"');
              sb.append(' data-is_dictchk=""');
              sb.append(' data-datatype="' + zy.tool.obj2Empty(c.datatype) + '"');
              sb.append(' data-numrange="' + zy.tool.obj2Empty(c.numrange) + '"');
              var ddItem = $('<li class="dd-item dd3-item "' + sb.toString() + '></li>');
              var ddHandle = $('<div class="dd-handle dd3-handle">&nbsp;</div>');
              var dd3Content = $('<div class="dd3-content clearfix" style="padding-bottom:4px">&nbsp;</div>');
              var pullLeft1 = '';
              //有数据字典，则显示字段翻转checkbox
              if(c.dict && c.dict.trim()!=''){
                pullLeft1 = $('<div class="pull-left col-5"><div class="btn-group"><button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown"> [' + t.cn_name + '].[' + c.cn_name + '] <span class="caret"></span></button><ul class="dropdown-menu"><li><span class="font-xs">&nbsp;项目设置：</span></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_view" type="checkbox"><span class="font-xs">画面显示</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_readonly" type="checkbox"><span class="font-xs">画面只读</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_dictchk" type="checkbox"><span class="font-xs">字典翻转</span></label></li></ul></div></div>');
              }else{
                pullLeft1 = $('<div class="pull-left col-5"><div class="btn-group"><button class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown"> [' + t.cn_name + '].[' + c.cn_name + '] <span class="caret"></span></button><ul class="dropdown-menu"><li><span class="font-xs">&nbsp;项目设置：</span></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_view" type="checkbox"><span class="font-xs">画面显示</span></label></li><li>&nbsp;&nbsp;<label><input class="checkbox" value="is_readonly" type="checkbox"><span class="font-xs">画面只读</span></label></li><li>&nbsp;&nbsp;</li></ul></div></div>');
              }
              var pullLeft2 = $('<div class="pull-left col-3 text-right"><label><span>&nbsp;&nbsp;<b>AS</b></span>&nbsp;<input class="style-0" name="alias_name" type="text" value="' + c.column_name + '" placeholder="设置项目别名"></label></div>');
              //列中文名
              var pullLeft3 = $('<div class="pull-left col-3 text-right"><label><span>&nbsp;&nbsp;<b>CN</b></span>&nbsp;<input class="style-0" name="column_name_cn" type="text" value="' + c.cn_name + '"></label></div>');
              var pullRight = $('<div class="pull-right"><button class="btn btn-success btn-xs dropdown-toggle" data-toggle="dropdown"> 图表 <span class="caret"></span></button></div>');
              var dropdown_menu_ul = $('<ul class="dropdown-menu"></ul>');
              var dropdown_menu_li1 = $('<li><span class="font-xs">&nbsp;项目对应的图表设置：</span></li>');
              dropdown_menu_ul.append(dropdown_menu_li1);
              // 从缓存中获取数据字典[图表类型] ZR.0002 循环赋值
              var ls = zy.cache.get('_mdm_dict', 'ls');
              var list = ls.get()['ZR.0002'];
              for (var i in list) {
                var dropdown_menu_li2 = $('<li>&nbsp;&nbsp;<label><input class="checkbox" value="'+ list[i].id + '" type="checkbox"><span class="font-xs">' + list[i].name + '</span></label>');
                dropdown_menu_ul.append(dropdown_menu_li2);
              }
              pullRight.append(dropdown_menu_ul); // 图表选项
              dd3Content.append(pullLeft1); // 项目名
              dd3Content.append(pullLeft2); // 项目别名
              dd3Content.append(pullLeft3); // 项目列中文名
              dd3Content.append(pullRight); // 图表设置
              ddItem.append(ddHandle); // 拖拽Handle
              ddItem.append(dd3Content); // 项目容器
              ddList.append(ddItem); // 项目List
            }
          });
        });
      }

      //事件绑定
      events.select_items();
    },
    /** 画面数据绑定：数据视图(FROM)相关表定义 */
    from: function () {
      pt.v.tables.val(pt.m.sel_from);
    },
    /** 画面数据绑定：数据视图(WHERE)查询条件定义 */
    where: function () {
      // todo:这里做检索条件的动态画面元素处理
      pt.v.setup.find('#bm-mddm01-where-list').empty();
      // 添加表关联 按钮可用条件：至少有两个表并且每个表至少有一个条件字段
      // 添加查询条件 按钮可用条件：至少有一个表并且这个表至少有一个条件字段
      var joinDisabledFlag = true;
      var itemDisabledFlag = true;
      var sel_fromTableList = pt.m.sel_fromTableList;
      if (sel_fromTableList && sel_fromTableList.length > 0) {
        for (var i = 0, len = sel_fromTableList.length; i < len; i++) {
          var columnList = pt.m.sel_fromTableColumnMap[sel_fromTableList[i]['id']];
          if (columnList && columnList.length > 0) {
            itemDisabledFlag = false;
            if (i > 0) {
              joinDisabledFlag = false;
              break;
            }
          }
        }
      }
      pt.v.join.attr('disabled', joinDisabledFlag);
      pt.v.item.attr('disabled', itemDisabledFlag);
      
      // where 区域
      var contact = pt.m.sel_where['contact'];
      var params = pt.m.sel_where['params'];
      for (var i = 0, l = contact.length; i < l; i++) {
        fn.whereJoin(contact[i]);
      }
      for (var i = 0, l = params.length; i < l; i++) {
        fn.whereItem(params[i]);
      }
    },
    /**
     * 画面数据绑定：WHERE查询条件用select2下拉选择框项目（表名.字段名）更新
     * @method buildString
     * @param {Element} v 元素对象
     * @param {Object} data 数据
     */
    select_item: function (v, data) {
      // select2数据绑定
      v.select2('val', data);
    },
    /**
     * 生成 WHERE 数据（根据 TempContact，TempParams）
     * @method toSelectWhere
     */
    toSelectWhere: function (TempContact,TempParams) {
      pt.m.sel_where = {'params': [], 'contact': []};
      var contact = pt.m.sel_where['contact'];
      var params = pt.m.sel_where['params'];
      contact.splice(0, contact.length);
      params.splice(0, params.length);
      for (var p in TempContact) {
        var tmp = TempContact[p];
        contact.push(tmp);
      }
      for (var p in TempParams) {
        var tmp = TempParams[p];
        params.push(tmp);
      }
    },
    /** 按配置画面的设置生成SQL语句内容 */
    tosql: function () {
      var sb = new zy.tool.string.StringBuffer();
      // select 部分
      sb.append('SELECT ');
      var r = pt.v.setup.find('.dd').nestable('serialize');
      if (r && r.length > 0) {
        for (var i = 0, l = r.length; i < l; i++) {
          var rm = r[i];
          sb.append(rm['table_name']);
          sb.append('.');
          sb.append(rm['column_name']);
          sb.append(' AS ');
          sb.append(rm['alias_name']);
          sb.append(', ');
        }
      }
      if (sb.size() > 1) {
        sb.remove(sb.size() - 1);
      }
      // from 部分
      sb.append(' FROM ');
      sb.append(pt.m.sel_from);
      // where 部分
      sb.append(' WHERE ');
      for (var p in pt.m.sel_whereTempContact) {
        var tmp = pt.m.sel_whereTempContact[p];
        sb.append(tmp['table_name1']);
        sb.append('.');
        sb.append(tmp['column_name1']);
        sb.append(' ');
        sb.append(zy.cache.cd2name('ZR.0049', tmp['condition']));
        sb.append(' ');
        sb.append(tmp['table_name2']);
        sb.append('.');
        sb.append(tmp['column_name2']);
        sb.append(' and ');
      }
      for (var p in pt.m.sel_whereTempParams) {
        var tmp = pt.m.sel_whereTempParams[p];
        var condition = tmp['condition'];
        sb.append(tmp['table_name']);
        sb.append('.');
        sb.append(tmp['column_name']);
        sb.append(' ');
        sb.append(zy.cache.cd2name('ZR.0049', condition));
        if (tmp['flag'] === '1') {
          if (condition === '12' || condition === '13') {
            // BETWEEN, NOT BETWEEN
            if(tmp['elemtype'] != 'date'){
              sb.append(' {');
              sb.append(tmp['column_name']);
              sb.append('1} and {');
              sb.append(tmp['column_name']);
              sb.append('2}');
            }else{
              sb.append(' {');
              sb.append(tmp['column_name']);
              sb.append('}');
            }
            
          } else if (condition === '14' || condition === '15') {
            // IS NULL, IS NOT NULL
          } else {
            sb.append(' {');
            sb.append(tmp['column_name']);
            sb.append('}');
          }
        } else {
          // 根据数据类型决定是否加单引号
          var dataType;
          var dataTypeTemp;
          var ls = zy.cache.get('_mdm_dict', 'ls');
          var listDataType = ls.get()['ZR.004101'];
          var sel_whe_columns = pt.m.sel_whe_columns;
          for (var i = 0, l = sel_whe_columns.length; i < l; i++) {
            if (sel_whe_columns[i]['table_name'] === tmp['table_name']) {
              var columns = sel_whe_columns[i]['column_info'];
              for (var j = 0, lj = columns.length; j < lj; j++) {
                if (columns[j]['column_name'] === tmp['column_name']) {
                  dataTypeTemp = columns[j]['datatype'];
                  if (listDataType && listDataType.length > 0) {
                    for (var k = 0, lk = listDataType.length; k < lk; k++) {
                      if (listDataType[k]['id'] === dataTypeTemp) {
                        dataType = listDataType[k]['name'];
                        break;
                      }
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
          if (condition === '12' || condition === '13') {
            // BETWEEN, NOT BETWEEN
            sb.append(' ');
            if (dataType === 'String' || dataType === 'Date') {
              sb.append('\'');
            }
            sb.append(tmp['value'][0]);
            if (dataType === 'String' || dataType === 'Date') {
              sb.append('\' and \'');
            } else {
              sb.append(' and ');
            }
            sb.append(tmp['value'][1]);
            if (dataType === 'String' || dataType === 'Date') {
              sb.append('\'');
            }
          } else if (condition === '14' || condition === '15') {
            // IS NULL, IS NOT NULL
          } else if (condition === '10' || condition === '11') {
            // IN, NOT IN
            sb.append(' (');
            sb.append(tmp['value'][0]);
            sb.append(')');
          } else {
            sb.append(' ');
            if (dataType === 'String' || dataType === 'Date') {
              sb.append('\'');
            }
            sb.append(tmp['value'][0]);
            if (dataType === 'String' || dataType === 'Date') {
              sb.append('\'');
            }
          }
        }
        sb.append(' AND ');
      }
      sb.remove(sb.size() - 1);
      // 生成后的sql语句内容
      return sb.toString();
    },
    // from 数据，where 表/字段 关联条件 更新
    sel_whe_columns: function () {
      var fromTableList = [];
      var fromTableColumnMap = {};
      var sb = new zy.tool.string.StringBuffer();
      var sel_whe_columns = pt.m.sel_whe_columns;
      for (var i = 0, len = sel_whe_columns.length, indexOfLen = len - 1; i < len; i++) {
        var sel_whe_column = sel_whe_columns[i];
        var tableName = sel_whe_column['table_name'];
        var tableNameCn = sel_whe_column['cn_name'];
        var columns = sel_whe_column['column_info'];
        sb.append(tableName);
        if (i < indexOfLen) {
          sb.append(', ');
        }
        var fromTableColumnList = [];
        for (var j = 0, lenCol = columns.length; j < lenCol; j++) {
          var column = columns[j];
          var isWhere = column['is_where'];
          if (isWhere === '1') {
            var columnName = column['column_name'];
            var columnNameCn = column['cn_name'];
            var columnMap = {};
            columnMap['id'] = columnName;
            columnMap['name'] = columnNameCn;
            columnMap['text'] = columnName + columnNameCn;
            fromTableColumnList.push(columnMap);
          }
        }
        if (fromTableColumnList.length > 0) {
          // 只有 表 和 表字段 都有值的时候才保存
          var tableMap = {};
          tableMap['id'] = tableName;
          tableMap['name'] = tableNameCn;
          tableMap['text'] = tableName + tableNameCn;
          fromTableList.push(tableMap);
          fromTableColumnMap[tableName] = fromTableColumnList;
        }
      }
      pt.m.sel_from = sb.toString();
      pt.m.sel_fromTableList = fromTableList;
      pt.m.sel_fromTableColumnMap = fromTableColumnMap;
    },
    // 表关联 (生成一行)
    whereJoin: function (rowData) {
      var sel_whereIndex = pt.m.sel_whereIndex;
      pt.m.sel_whereIndex++;
      var target = pt.v.setup.find('#bm-mddm01-where-list');
      var divContainer = $('<div>').addClass('row');
      var sectionTblLeft = $('<section>').addClass('col col-2');
      var sectionColLeft = $('<section>').addClass('col col-2');
      var sectionCondition = $('<section>').addClass('col col-2');
      var sectionTblRight = $('<section>').addClass('col col-2');
      var sectionColRight = $('<section>').addClass('col col-2');
      var inputLbl = $('<label>').addClass('input');
      var select2TblLeft = $('<input>').attr({name: 'tbl_left', type: 'hidden'});
      var select2ColLeft = $('<input>').attr({name: 'col_left', type: 'hidden'});
      var select2Condition = $('<input>').attr({name: 'condition', type: 'hidden'});
      var select2TblRight = $('<input>').attr({name: 'tbl_right', type: 'hidden'});
      var select2ColRight = $('<input>').attr({name: 'col_right', type: 'hidden'});
      var sectionClose = $('<section>').addClass('col col-1');
      var btnRemove = $('<h4><i class="fa fa-fw fa-times-circle txt-color-red" style="cursor:pointer;"></i></h4>');

      sectionTblLeft.append(inputLbl.clone().append(select2TblLeft));
      sectionColLeft.append(inputLbl.clone().append(select2ColLeft));
      sectionCondition.append(inputLbl.clone().append(select2Condition));
      sectionTblRight.append(inputLbl.clone().append(select2TblRight));
      sectionColRight.append(inputLbl.clone().append(select2ColRight));
      sectionClose.append(btnRemove);
      divContainer.append(sectionTblLeft).append(sectionColLeft).append(sectionCondition).append(sectionTblRight).append(sectionColRight).append(sectionClose);
      target.append(divContainer);

      select2Condition.zySelect('ZR.0064', false, {width: '100%', allowClear: false});
      if (rowData) {
        select2Condition.select2('val', rowData['condition']);
      } else {
        var ls = zy.cache.get('_mdm_dict', 'ls');
        var list = ls.get()['ZR.0064'];
        if (list && list.length > 0) {
          select2Condition.select2('val', list[0]['id']);
        }
      }
      // 拼接当前行 SQL
      var sqlConnector = function() {
        var contact = {};
        contact['table_name1'] = select2TblLeft.val();
        contact['column_name1'] = select2ColLeft.val();
        contact['condition'] = select2Condition.val();
        contact['table_name2'] = select2TblRight.val();
        contact['column_name2'] = select2ColRight.val();
        pt.m.sel_whereTempContact[sel_whereIndex] = contact;
      };
      select2TblLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, pt.m.sel_fromTableList);
      select2TblLeft.on('change', function() {
        var colList = pt.m.sel_fromTableColumnMap[select2TblLeft.val()];
        if (colList && colList.length > 0) {
          select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, colList);
          select2ColLeft.select2('val', colList[0]['id']);
        } else {
          select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, []);
        }
        sqlConnector();
      });
      select2TblRight.zySelectCustomData('', false, {width: '100%', allowClear : false}, pt.m.sel_fromTableList);
      select2TblRight.on('change', function() {
        var colList = pt.m.sel_fromTableColumnMap[select2TblRight.val()];
        if (colList && colList.length > 0) {
          select2ColRight.zySelectCustomData('', false, {width: '100%', allowClear : false}, colList);
          select2ColRight.select2('val', colList[0]['id']);
        } else {
          select2ColRight.zySelectCustomData('', false, {width: '100%', allowClear : false}, []);
        }
        sqlConnector();
      });
      select2Condition.on('change', function () {
        sqlConnector()
      });
      select2ColLeft.on('change', function () {
        sqlConnector()
      });
      select2ColRight.on('change', function () {
        sqlConnector()
      });
      if (rowData) {
        select2TblLeft.select2('val', rowData['table_name1']);
        select2TblLeft.trigger('change');
        select2TblRight.select2('val', rowData['table_name2']);
        select2TblRight.trigger('change');
        select2ColLeft.select2('val', rowData['column_name1']);
        select2ColRight.select2('val', rowData['column_name2']);
      } else {
        if (pt.m.sel_fromTableList && pt.m.sel_fromTableList.length > 0) {
          var firstId = pt.m.sel_fromTableList[0]['id'];
          select2TblLeft.select2('val', firstId);
          select2TblLeft.trigger('change');
          select2TblRight.select2('val', firstId);
          select2TblRight.trigger('change');
        } else {
          select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear: false}, []);
          select2ColRight.zySelectCustomData('', false, {width: '100%', allowClear: false}, []);
        }
      }
      btnRemove.on('click', function () {
        delete pt.m.sel_whereTempContact[sel_whereIndex];
        $(this).closest('div').remove();
      });
      sqlConnector();
    },
    // 查询条件 （生成一行）
    whereItem: function (rowData) {
      var sel_whereIndex = pt.m.sel_whereIndex;
      pt.m.sel_whereIndex++;
      var target = pt.v.setup.find('#bm-mddm01-where-list');
      var divContainer = $('<div>').addClass('row');
      var sectionTblLeft = $('<section>').addClass('col col-2');
      var sectionColLeft = $('<section>').addClass('col col-2');
      var sectionCondition = $('<section>').addClass('col col-2');
      var sectionSwitch = $('<section>').addClass('col col-1');
      var sectionDefVal1 = $('<section>').addClass('col col-2');
      var sectionDefVal2 = $('<section>').addClass('col col-2');
      var inputLbl = $('<label>').addClass('input');
      var select2TblLeft = $('<input>').attr({name: 'tbl_left', type: 'hidden'});
      var select2ColLeft = $('<input>').attr({name: 'col_left', type: 'hidden'});
      var select2Condition = $('<input>').attr({name: 'condition', type: 'hidden'});
      var chkSwitch = $('<label class="toggle state-success"><input type="checkbox" name="chk_switch"><i data-swchoff-text="预设" data-swchon-text="参数"></i></label>');
      var textDefVal1 = $('<input>').attr({name: 'text_def1', type: 'text'});
      var textDefVal2 = $('<input>').attr({name: 'text_def2', type: 'text'});
      var sectionClose = $('<section>').addClass('col col-1');
      var btnRemove = $('<h4><i class="fa fa-fw fa-times-circle txt-color-red" style="cursor:pointer;"></i></h4>');

      sectionTblLeft.append(inputLbl.clone().append(select2TblLeft));
      sectionColLeft.append(inputLbl.clone().append(select2ColLeft));
      sectionCondition.append(inputLbl.clone().append(select2Condition));
      sectionSwitch.append(chkSwitch);
      sectionDefVal1.append(inputLbl.clone().append(textDefVal1));
      sectionDefVal2.append(inputLbl.clone().append(textDefVal2));
      sectionClose.append(btnRemove);
      divContainer.append(sectionTblLeft).append(sectionColLeft).append(sectionCondition).append(sectionSwitch).append(sectionDefVal1).append(sectionDefVal2).append(sectionClose);
      target.append(divContainer);

      select2Condition.zySelect('ZR.0049', false, {width: '100%', allowClear: false});
      if (rowData) {
        select2Condition.select2('val', rowData['condition']);
      } else {
        var ls = zy.cache.get('_mdm_dict', 'ls');
        var list = ls.get()['ZR.0049'];
        if (list && list.length > 0) {
          select2Condition.select2('val', list[0]['id']);
        }
      }
      // 拼接当前行 SQL
      var sqlConnector = function(isSwitchClick) {
        var name = '';
        var value = [];
        var condition = select2Condition.val();
        var flag;
        var boolFlag = chkSwitch.find('[name=chk_switch]').prop('checked');
        if (isSwitchClick) {
          // 单击 checkbox 时获取到的是单击前的值，其他时候获取到的是当前值
          boolFlag = !boolFlag;
        }
        if (boolFlag) {
          flag = '1';
          if (condition === '12' || condition === '13') {
            // BETWEEN, NOT BETWEEN
            name = select2ColLeft.val();
          } else if (condition === '14' || condition === '15') {
            // IS NULL, IS NOT NULL
            name = '';
          } else {
            name = select2ColLeft.val();
          }
        } else {
          flag = '0';
          if (condition === '12' || condition === '13') {
            // BETWEEN, NOT BETWEEN
            value.push(textDefVal1.val());
            value.push(textDefVal2.val());
          } else if (condition === '14' || condition === '15') {
            // IS NULL, IS NOT NULL
            value = [];
          } else {
            value.push(textDefVal1.val());
          }
        }
        var params = {};
        params['table_name'] = select2TblLeft.val();
        params['column_name'] = select2ColLeft.val();
        params['condition'] = select2Condition.val();
        params['flag'] = flag;
        params['name'] = name;
        params['value'] = value;
        // params['elemtype']
        for(var i=0,len=pt.m.sel_whe_columns.length; i<len; i++){
          if(pt.m.sel_whe_columns[i].table_name==select2TblLeft.val()){
            for(var j=0,len_j=pt.m.sel_whe_columns[i].column_info.length; j<len_j; j++){
              if(pt.m.sel_whe_columns[i].column_info[j].column_name==select2ColLeft.val()){
                params['elemtype'] = pt.m.sel_whe_columns[i].column_info[j].elemtype;
              }
            }
          }
        }
        if(params['elemtype'] && params['elemtype'].trim()!==''){
        }else{
          params['elemtype'] = '';
        }
        pt.m.sel_whereTempParams[sel_whereIndex] = params;
      };
      select2TblLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, pt.m.sel_fromTableList);
      select2TblLeft.on('change', function() {
        var colList = pt.m.sel_fromTableColumnMap[select2TblLeft.val()];
        if (colList && colList.length > 0) {
          select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, colList);
          select2ColLeft.select2('val', colList[0]['id']);
        } else {
          select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear : false}, []);
        }
        sqlConnector(false);
      });
      if (pt.m.sel_fromTableList && pt.m.sel_fromTableList.length > 0) {
        var firstId = pt.m.sel_fromTableList[0]['id'];
        select2TblLeft.select2('val', firstId);
        select2TblLeft.trigger('change');
      } else {
        select2ColLeft.zySelectCustomData('', false, {width: '100%', allowClear: false}, []);
      }

      select2Condition.on('change', function() {
        var $val = $(this).val();
        if ($val === '12' || $val === '13') {
          // BETWEEN, NOT BETWEEN
          sectionSwitch.show();
          sectionDefVal1.show();
          sectionDefVal2.show();
          var flag = chkSwitch.find('[name=chk_switch]').prop('checked');
          if (flag) {
            sectionDefVal1.hide();
            sectionDefVal2.hide();
          } else {
            sectionDefVal1.show();
            sectionDefVal2.show();
          }
        } else if ($val === '14' || $val === '15') {
          // IS NULL, IS NOT NULL
          sectionSwitch.hide();
          sectionDefVal1.hide();
          sectionDefVal2.hide();
        } else {
          sectionSwitch.show();
          sectionDefVal2.hide();
          var flag = chkSwitch.find('[name=chk_switch]').prop('checked');
          if (flag) {
            sectionDefVal1.hide();
          } else {
            sectionDefVal1.show();
          }
        }
        sqlConnector(false);
      });
      select2Condition.trigger('change');
      select2ColLeft.on('change', function () {
        sqlConnector(false)
      });
      chkSwitch.find('i').on('click', function() {
        var flag = chkSwitch.find('[name=chk_switch]').prop('checked');
        if (flag) {
          sectionDefVal1.show();
          var v = select2Condition.val();
          if (v === '12' || v === '13') {
            // BETWEEN, NOT BETWEEN
            sectionDefVal1.show();
            sectionDefVal2.show();
          } else if (v === '14' || v === '15') {
            // IS NULL, IS NOT NULL
            sectionDefVal1.hide();
            sectionDefVal2.hide();
          } else {
            sectionDefVal2.hide();
          }
        } else {
          sectionDefVal1.hide();
          sectionDefVal2.hide();
        }
        sqlConnector(true);
      });
      textDefVal1.on('change', function () {
        sqlConnector(false)
      });
      textDefVal2.on('change', function () {
        sqlConnector(false)
      });
      if (rowData) {
        select2TblLeft.select2('val', rowData['table_name']);
        select2TblLeft.trigger('change');
        select2ColLeft.select2('val', rowData['column_name']);
        if (rowData['flag'] === '1') {
          chkSwitch.find('i').trigger('click');
        } else {
          var value = rowData['value'];
          var condition = rowData['condition']
          if (condition === '12' || condition === '13') {
            // BETWEEN, NOT BETWEEN
            textDefVal1.val(value[0]);
            textDefVal1.val(value[1]);
          } else if (condition === '14' || condition === '15') {
            // IS NULL, IS NOT NULL
          } else {
            textDefVal1.val(value[0]);
          }
        }
      }
      btnRemove.on('click', function () {
        delete pt.m.sel_whereTempParams[sel_whereIndex];
        $(this).closest('div').remove();
      });
      sqlConnector(false);
    },
    // 保存和切换到手写SQL时的验证
    validation: function () {
      // select 别名不可重复
      var alias = {};
      var r = pt.v.setup.find('.dd').nestable('serialize');
      if (r && r.length > 0) {
        for (var i = 0, l = r.length; i < l; i++) {
          var aliasName = r[i]['alias_name'];
          if (alias[aliasName]) {
            zy.ui.msg('错误：', 'SELECT 项目中有重复的别名：' + aliasName, 'e');
            return false;
          } else {
            alias[aliasName] = aliasName;
          }
        }
      }
      // where like，between，in 预设值不可为空
      var contact = pt.m.sel_where['contact'];
      if (contact && contact.length > 0) {
        for (var i = 0, l = contact.length; i < l; i++) {
          if (contact['flag'] === '0') {
            var condition = contact['condition'];
            if (condition === '08' || condition === '09' || condition === '10' ||
              condition === '11' || condition === '12' || condition === '13') {
              var value = contact['value'];
              if (value.length === 0 || value[0] === '') {
                zy.ui.msg('错误：', '比较符为 ' + zy.cache.cd2name('ZR.0049', condition) + ' 时，预设值不可为空', 'e');
                return false;
              }
              if (condition === '12' || condition === '13') {
                if (value.length !== 2 || value[1] === '') {
                  zy.ui.msg('错误：', '比较符为 ' + zy.cache.cd2name('ZR.0049', condition) + ' 时，预设值不可为空', 'e');
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    }
  };

  return bm_mddm01;
})();