/**
 * API服务信息 
 * @class rbac_ms_mgt01
 */
rbac_ms_mgt01 = (function() {

  var PT = rbac_ms_mgt01.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    data: [],
    paramdata: [],
    param: {id:""},
  };

  //表格元素对象
  var dt = $('#rbac_ms_mgt01');
  var _m = {}; //API请求参数
  var paramList = {}; //API参数项


  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};


  /**
   * @class EaGetalarmmanage
   * @constructor
   */
  function rbac_ms_mgt01() {
    Console.log("new rbac_ms_mgt01(obj)");
    thiz = this;
    thiz.Init();
    return this;
  }

  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    thiz.listTree();
  };

  /**
   * API List 的 zTree 初始化处理
   * @method listTree
   */
  PT.listTree = function() {
    zy.extend.get({
      app: 'apils',
      mod: 'apihelp',
      apinm: 'getprj'
    }, function (msg) {
      if (msg && msg.result)
        $.fn.zTree.init($("#apilist"), setting(), msg.result);
        var treeObj = $.fn.zTree.getZTreeObj("apilist");
        treeObj.expandAll(true);
    }, {flg:0});
  };

  /**
   * zTree初始化配置
   * @param setting  
   */
  function setting() {
    //点击树触发的事件
    function onclickTree(event, treeId, treeNode) {
      if (treeNode.flg===0) {
      //获取API帮助信息
        _m.appid=treeNode.aid;
        _m.moduleid=treeNode.pid;
        _m.apiid=treeNode.id;
        zy.g.am.app='ZYAPP_IDE'
        zy.g.am.mod='ZYMODULE_IDE'
        zy.net.get('api/getapiinfo',function(msg) {
          var _form = $("#form_help");
          $.each(msg.result[0], function(_i, _v) {
            // zy.log('name:',_i)
            var _t = _form.find('[name=' + _i + ']')
            if (_t.length > 0) {
              _t.html(_v.replace(/\.0/g,''));
            }
          });
          document.getElementById("form_help").style.display="block";
          $("#param").empty();

          if (msg.result[0].help_info){
            var _h = JSON.parse(msg.result[0].help_info);
            // zy.log("msg.result[0].help_info" + _h);
            _form.find('[name="api_classify"]').html(_h.api_classify);
            _m.requests=_h.requests;
            if (_m.requests=='01'){
              _form.find('[name="requests"]').html('GET');
            } else {
              _form.find('[name="requests"]').html('POST');
            }
            // 参数项
            if(_h.param.length>0) {
              $.each(_h.param,function(i,v) {
                newlabel(v);
              });
            }
          } else {
            _form.find('[name="api_classify"]').html();
            _form.find('[name="requests"]').html();
            _m.requests="02";
          }
          fullurl();

        },_m,null,function(msg) {
          // zy.log(msg)
        });
        return;
      }
      var treeObj = $.fn.zTree.getZTreeObj(treeId);
      var node = treeObj.getNodeByTId(treeNode.tId);
      // console.log(node2,treeNode)
      if (!node.children) {//判断是否有二级树
        zy.extend.get({
          app: 'apils',
          mod: 'apihelp',
          apinm: 'getapi'
        }, function (msg) {
          if (msg && msg.value)
            newNode = treeObj.addNodes(node, msg.value);
            var nodeName = treeNode.name;//记录节点名称
            var str = nodeName.split("{");//去掉括号
            var newname = str[0]+"{"+msg.value.length+'}';//添加子节点数并加上括号
            treeNode.name = newname;//重新命名
            treeObj.updateNode(treeNode);//并更新节点信息

        }, {id:treeNode.id,pid:treeNode.pid,flg:treeNode.flg});
        console.log(treeNode.id + treeId + treeNode.name);
      }
    }
    //获取树成功后进行的回调操作
    function ztreeOnAsyncSuccess(event, treeId, treeNode) {
      console.log(treeId, treeNode)
      //展开树
      var treeObj = $.fn.zTree.getZTreeObj(treeId);
      treeObj.expandAll(true);
    }

    return {
      view: {
        selectedMulti: false,
      },
      data: {
        key: {
			    name: "name",
			    title: "mark"
		    },
        simpleData: {
          enable: true, //是否用简单数据
          idKey: 'id', //对应json数据中的ID
          pIdKey: 'pid', //对应json数据中的父ID
          rootPId: 0 // 用于修正根节点父节点数据，即 pIdKey 指定的属性值
        }
      },
      callback: {
        onClick: onclickTree, //点击相关节点触发的事件
        onAsyncSuccess: ztreeOnAsyncSuccess, //异步加载成功后执行的方法
      }
    };
  }

  function newlabel(row) {
    var row = row || {key:'',desc:'',value:''};
    var rk = Random();

    var _r = $('<div>').addClass('row').attr('_index',rk);
    $("#param").append(_r);
    var key_section = $('<section>').addClass('col col-3');
    var key_label = $('<label>').addClass('label').html(row.key);
    key_section.append(key_label);
    _r.append(key_section);

    var value_section = $('<section>').addClass('col col-5');
    var value_label = $('<label>').addClass('label').html(row.value);
    value_section.append(value_label);
    _r.append(value_section);

    var desc_section = $('<section>').addClass('col col-4');
    var desc_label = $('<label>').addClass('label').html(row.desc);
    desc_section.append(desc_label);
    _r.append(desc_section);
    
    paramList[rk] = [row.key,encodeURIComponent(row.value)];
  }

  function fullurl() {

    var atype = 'api';
    var host = location.host;
    var ds = '/ds/';
    var param = '';
    var fullc = $("#form_help").find('[name="url"]');
    fullc.val("");

    var t = $.extend({},zy.g.comm,{app:_m.appid,mod:_m.moduleid,s:'d',ems:"ems"});
    delete t.orgtype;
    delete t.orgpath;

    var full = '';

    //get
    if(_m.requests=='01'){
      var last = '&';
      var tt = [];
      $.each(paramList,function(i,v) {
        var _tmp = v;
        tt.push(_tmp.join('='));
      });
      param = tt.join('&');
      console.log("param = "+param);

      if(param!=''){
        if(param[param.length - 1] == '&') {
          last = '';
        }
      }else{
        last = '';
      }
      full = zy.g.host.api + zy.fix_api_call(atype + '/' + _m.apiid, t)
          + '?' + param + last + zy.net.parseParam(t);
    }
    //post等
    else {
      full = zy.g.host.api + zy.fix_api_call(atype + '/' + _m.apiid, t)
        + '?' + zy.net.parseParam(t);
    }
    fullc.val(full);
  }

  function Random() {
    return Math.round(Math.random() * 1000000);
  }
  
  return rbac_ms_mgt01;
})();