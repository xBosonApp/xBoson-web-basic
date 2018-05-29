index = (function() {
  var ls_zy_user_info;
  var zm;
  var ui_base = '';


  function index() {
    // 开启log控制台输出
    Console.open();

    //本地缓存
    ls_zy_user_info = zy.cache.get('_zy_user_info', 'ls');

    //根据url改变host
    // zy.g.host.api = zy.net.getHttpUrl("/ds/");
    // zy.g.host.ui = zy.net.getHttpUrl();
    // zy.g.host.api = zy.net.getHttpUrl("/xboson/");
    // zy.g.host.ui = zy.net.getHttpUrl("/xboson/face");
    zy.check_xboson_system();

    if (zy.debug) {
      ui_base = zy.g.host.ui + '/t';
    } else {
      ui_base = zy.g.host.ui + '/ui';
    }

    check();
    return this;
  }

  //工具
  function getData(req_model, _success, _nodata_cb) {
    var parm = $.extend({}, req_model.r_parm);

    var _cb = function(msg) {
      if (msg) {
        _success && _success(msg);
      } else {
        _nodata_cb && _nodata_cb(msg);
      }
    };

    zy.g.am.mod = req_model.mod;
    zy.g.am.app = req_model.app;
    if (req_model.api == 'getuserorg') {
      zy.net.get("user/" + req_model.api, _cb, parm, null, null);
    } else {
      zy.net.get("api/" + req_model.api, _cb, parm, null, null);
    }
  }

  //检测服务器或是本地请求
  function check() {
    zy.g.comm.openid = $.cookie('openid') || ls_zy_user_info.get('user_openid');
    // zy.g.comm.mdk = ls_zy_user_info.get('user_mdk');
    // zy.g.comm.userkeylocal = ls_zy_user_info.get('user_local_userkey');

    if(zy.g.comm.openid) {
      getData({
        api : 'getuserorg',
        app : 'ZYAPP_LOGIN',
        mod : 'ZYMODULE_LOGIN'
      }, function(msg) {
        if (msg && msg.result && msg.result.length > 0) {
          ls_zy_user_info.set('user_org_list', msg.result);
          var lastSelectedOrgInCache = ls_zy_user_info.get('user_selected_org');

          if (lastSelectedOrgInCache) {
            var matchedOrgID = $.grep(msg.result, function(n, i) {
              return n.orgid === lastSelectedOrgInCache;
            });
            if (matchedOrgID.length > 0) {
              zy.g.comm.org = lastSelectedOrgInCache;
              
              getUserInfo();
              initIndex();
              initChangeOrg(msg.result); 
              return;
            }
          }
        }
        // window.location = ui_base + '/login.html';
        zy.net.loadLogin();
      }, null);
    } else {
      // window.location = ui_base + '/login.html';
      zy.net.loadLogin();
    }
  }

  //获取用户信息
  function getUserInfo(_success) {
    getData({
      api : 'getuserinfo',
      app : 'ZYAPP_LOGIN',
      mod : 'ZYMODULE_LOGIN'
    }, function(msg) {
      zy.g.user.userid=msg.result[0].userid;
      $('#login_userid').html(msg.result[0].name);
      if(msg.result[0].image_path === '') return false;
      $('#show-shortcut img').attr('src',msg.result[0].image_path);
      if (typeof _success == 'function') _success();
    });
  }

  //初始化主页
  function initIndex(_success) {
     //初始化菜单
    zm = new zyMenu("#left-panel nav");
    zm.Init(_success);
//    var socket = io.connect('http://zr-i.com:8090');
//    socket.on(zy.g.comm.org + '2', function(msg) {
//      $.fn.alarm.init(msg.datas);
//    });
  }

  //机构切换
  function initChangeOrg(msglist) {
    var list = ls_zy_user_info.get('user_org_list');
    if (!list) {
      ls_zy_user_info.set('user_org_list', msglist);
      list = msglist;
    }
    if (list.length > 0) {
      var ul = '';
      var project_context = $('#project-context');
      for (var i = 0; i < list.length; i++) {
        if (list.length == 1) {
          project_context.children('span').eq(1).hide();
        } else {
          project_context.children('span').eq(1).show();
        }
        var orgpath = list[i].isplatorg? 'paas':'saas/' + list[i].orgid;
        if (list[i].orgid == zy.g.comm.org) {
          project_context.children(':first').html(list[i].orgnm);
          ul = ul + '<li style="display: none;"><a href="javascript:void(0);" data-org=\"' + list[i].orgid + '\" data-orgpath=\"' + orgpath + '\" data-orgtype="'+ list[i].org_type + '">' + list[i].orgnm + '</a></li>';
        } else {
          ul = ul + '<li><a href="javascript:void(0);" data-org=\"' + list[i].orgid + '\" data-orgpath=\"' + orgpath + '\" data-orgtype="'+ list[i].org_type + '">' + list[i].orgnm + '</a></li>';
        }
      }
      $("#index_org_list").append(ul);

      project_context.find('ul').find('a').on('click', function(e) {
        var selectedOrg = $(e.target).data('org');
        var _orgtype = $(e.target).data('orgtype');
        var _orgpath = $(e.target).data('orgpath');
        project_context.children(':first').html($(this).text());
        $(this).parent('li').hide();
        $(this).parent('li').siblings().show();
        zy.g.comm.org = selectedOrg;
        var ls_zy_user_info = zy.cache.get('_zy_user_info', 'ls');
        ls_zy_user_info.set('user_selected_org', selectedOrg);
        ls_zy_user_info.set('user_selected_org_type', _orgtype);
        ls_zy_user_info.set('user_selected_org_path', _orgpath);
        $('#content').empty();
        $("#divbigBoxes").empty();
        $('#divMiniIcons').empty();
        // 重新加载加载菜单
        zm.Init();
        zy.g.comm.org = selectedOrg;
      });
    }
  }

  return index
})();