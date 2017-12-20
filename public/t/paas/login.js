 /**
 * 数据字典类型
 * @class Login
 */
Login = (function() {

  var PT = Login.prototype;
  var thiz;
  var ls_zy_user_info;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    orgList : []
  };

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class Login
   * @constructor
   */
  function Login() {
    thiz = this;
    return this;
  }

  function Reg(){
    var form = $('#register-form');
    var useridbtn = form.find('[name=userid]');
    var passwordbtn = form.find('[name=password]');
    var confirmpasswordbtn = form.find('[name=confirmpassword]');
		var emailbtn = form.find('[name=email]');
		var telbtn = form.find('[name=tel]');
		var invitation_codebtn = form.find('[name=invitation_code]');
    var submitbtn = form.find('#register-button');


    var password = null;    
    var ur = /^[a-zA-Z][a-zA-Z0-9_-]{3,15}$/;//用户id
    var pr = /^[a-zA-Z0-9_-]{6,32}$/;//密码
		var emailr = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;//email
		var telr = /^(13[0-9]|14[57]|15[0-9]|17[0678]|18[0-9])[0-9]{8}$/;//手机号码
		var invicoder=/\w{6}/;//邀请码

//    form.unbind('_submit').bind('_submit',(function(){
//      var id,pass;
//      return function(e,userid,userpass){
//        if(userid) id = userid;
//        if(userpass) pass = userpass;
//
//        if(id && pass){
//          var param = {
//            userid : id,
//            password : pass
//          };
//
//          zy.log(param);
//    
//          submitbtn.trigger('_change',[param]);
//        }
//      }
//    })());

    submitbtn.unbind('_change').bind('_change',function(e,json){
      var $this = $(this);
      $this.unbind('click');
      $this.btnDisable(true);

      if(json){
				//check
				if(!ur.test(json.userid)){
					return true;
				}
				if(!pr.test(json.password)){
					return true;
				}
				if(json.password!=json.confirmpassword){
					return true;
				}
				if(!emailr.test(json.email)){
					return true;
				}
				if(!telr.test(json.tel)){
					return true;
				}
				if(!form.find('[name=agree]').is(':checked')){
					return true;
				}
        json.password = $.md5(json.password);
        delete json.confirmpassword;
        $this.btnDisable(false);
        $this.click(function(e){
          zy.g.am.app = 'ZYAPP_LOGIN';
          zy.g.am.mod = 'ZYMODULE_REG';
          zy.net.post("user/register", function(msg){
            zy.ui.msg('提示','注册成功','s');
            Event($('#cc'));
            var target = $('#form-section');
            target.hide();
            target.prev().show();
            $('#login-header-space a').html('创建用户');
          }, json, null, function(msg){
            Event($('#cc'));
            if(msg.ret != '0'){
              zy.ui.msg("注册失败：", msg.msg, "w");
            }
          });
        })
      }
    });

    passwordbtn.unbind('blur').bind('blur',function(e){
      var $this = $(this);
      var val = $this.val();
      if(pr.test(val)){
        password = val;
//        form.trigger('_submit');
        $this.next().remove();
      }else{
        $this.after($('<p>').html('密码规则为6-32位数字,字母,_或-'));
      }
    });

    confirmpasswordbtn.unbind('blur').bind('blur',function(e){
      var val = $(this).val();
      if(val != password){
        $(this).after($('<p>').html('两次密码不同'));
      }else{
//        form.trigger('_submit',[null,password]);
        $(this).next().remove();
      }
    });
		//邮箱
		emailbtn.unbind('blur').bind('blur',function(e){
      var $this = $(this);
      var val = $this.val();
			if(val==''){
				$this.after($('<p>').html('邮箱为必填项'));
				return true;
			}
	$this.val($this.val().toLowerCase());
	val = $this.val();
      if(emailr.test(val)){
        $this.next().remove();
	zy.g.am.app = 'ZYAPP_LOGIN';
	zy.g.am.mod = 'ZYMODULE_REG';
	zy.net.post('user/get_havinguser',function(msg){
		if(msg && msg.result && msg.result[0].count=='1'){
		}else{
			$this.after($('<p>').html('用户邮箱已被注册！'));
		}
	},{email:val});
      }else{
        $this.after($('<p>').html('邮箱格式不正确'));
      }
    });
		//手机号码
	telbtn.unbind('blur').bind('blur',function(e){
      var $this = $(this);
      var val = $this.val();
			if(val==''){
				$this.after($('<p>').html('手机号码为必填项'));
				return true;
			}
      if(telr.test(val)){
        $this.next().remove();
	zy.g.am.app = 'ZYAPP_LOGIN';
	zy.g.am.mod = 'ZYMODULE_REG';
	zy.net.post('user/get_havinguser',function(msg){
		if(msg && msg.result && msg.result[0].count=='1'){
		}else{
			$this.after($('<p>').html('此手机号码已被注册！'));
		}
	},{tel:val});
      }else{
        $this.after($('<p>').html('手机号码格式不正确'));
      }
    });
		//邀请码
    invitation_codebtn.unbind('blur').bind('blur',function(e){
      var $this = $(this);
      var val = $this.val();
			if(val==''){
				return true;
			}
      if(invicoder.test(val)){
        $this.next().remove();
      }else{
        $this.after($('<p>').html('邀请码格式不正确'));
      }
    });

    useridbtn.unbind('blur').blur(function(e){
      var $this = $(this);
      $this.val($this.val().toLowerCase());
      var val = $this.val();

      if(ur.test(val)){
        // removed by J.ym 疯狂请求 get_havinguser
        //
        //   $this.next().remove();
        //   zy.g.am.app = "ZYAPP_LOGIN";
        //   zy.g.am.mod = "ZYMODULE_REG";

        //   zy.net.post("user/get_havinguser", function(msg) {
        //     console.log("!!!!!!!!!!!", msg);
        //     if(msg.result && "1" == msg.result[0].count){
        //       $this.next().remove();
        //     }else{
        //       $this.after($('<p>').html('用户ID已存在'));
        //     }
        //   },{userid:val});
      }else{
        $this.after($('<p>').html('用户ID为4-16位数字,字母,_或-,以字母开头'));
      }
    });

    $('#register-form :input').unbind('input').bind('input',function(e){
        submitbtn.trigger('_change',form.form2json());
      }).unbind('focus').bind('focus',function(e){
        $(this).siblings('p').remove();
      });
    $('#register-form').find('[name=agree]').bind('change',function(e){
	submitbtn.trigger('_change',form.form2json());
    });

    submitbtn.trigger('_change');
    submitbtn.btnDisable(true);
  }

  function R(){
    return zy.g.host.api + 'captcha?' + Math.round(Math.random() * 100000);
  }

  function Event(c){

    c.attr('src',R());

    c.unbind('click').click((function(){
      var time = 0;
      return function(e){
        var now = (new Date()).getTime();

        if(now - time < 15000) return false;

        time = now;

        $('[name=c]').val('');
        var $this = $(this);
        $this.attr('src',R());

        var next = $this.next();

        var t = 15;
        next.html(t);
        var I = setInterval(function(){
          --t;
          zy.log(t);
          if(t > 0){
            next.html(t);
          }else{
            clearInterval(I);
            next.html('');
          }
        },1000)
      }
    })());
  }



  /**
   * 画面初始化
   * @method init
   */
  PT.Init = function() {
    //本地缓存
      ls_zy_user_info = zy.cache.get('_zy_user_info', 'ls');

    //检测httpUrl
      // zy.g.host.api = zy.net.getHttpUrl("/ds/");
      // zy.g.host.ui = zy.net.getHttpUrl();
      // zy.g.host.ui = zy.net.getHttpUrl("/xboson/face");
      // zy.g.host.api = zy.net.getHttpUrl("/xboson/");
      zy.check_xboson_system();

      var errorTime = ls_zy_user_info.get('errorTimeout');

      if(errorTime){
        var now = (new Date()).getTime();
        if(now - errorTime < 900000){
          $('#c').closest('section').show();
          Event($('#c'));
        }
      }

    $('#login-form input[name=userid]').focus();

    // Form 提交登录
    // Validation
    Reg();
    Event($('#cc'));
    $("#login-form").validate({
      // Rules for form validation
      rules : {
        userid : {
          required : true,
          minlength : 4,
          maxlength : 20
        },
        password : {
          required : true,
          minlength : 6,
          maxlength : 20
        }
      },

      // Messages for form validation
      messages : {
        userid : {
          required : '请输入用户ID'
        },
        password : {
          required : '请输入密码'
        }
      },

      submitHandler : function(form) {
        Submit(form);
      },

      // Do not change code below
      errorPlacement : function(error, element) {
        error.insertAfter(element.parent());
      }
    });
  };

  //如果不支持cookie 使用本地缓存
  function checkCookie(userkey){
    zy.log("checkCookie: " + userkey);
    ls_zy_user_info.set('user_local_userkey', userkey);
    // if (!zy.g.checkServerOrLocal()) {
      ls_zy_user_info.set('user_openid', zy.g.comm.openid);
      //ls_zy_user_info.set('user_local_userkey', userkey);
      //$.cookie('local_userkey', userkey, {expires:7, path:'/', domain:document.location.hostname});
    // }
  }

  //登陆验证
  function Submit(form) {

    var param = $("#login-form").form2json();
    param.password = $.md5(param.password);

    var callback = function(msg) {
      if (msg) {
        zy.log("login.success: " + JSON.stringify(msg));
        if (msg.ret == "0") {

          ls_zy_user_info.remove('errorTimeout');
          zy.g.comm.openid = msg.openid;
          zy.g.comm.mdk = msg.mdk;
          ls_zy_user_info.set('user_mdk', msg.mdk);

          checkCookie(msg.userkey);

          zy.log("登录之后 zy.g.comm.openid=" + zy.g.comm.openid);
          // 检查用户所属机构 如多个，显示机构选择界面
          var cb = function(msg) {
            if (msg) {
              ls_zy_user_info.set('user_org_list', msg.result);
              if (msg.result.length > 1) {
                // 当前用户所属机构列表
                thiz._g.orgList = msg.result;
                // 浏览器缓存中有上次选择过的机构，则直接跳转到主页面，否则显示机构选择界面
                var lastSelectedOrgInCache = ls_zy_user_info.get('user_selected_org');
                if (lastSelectedOrgInCache) {
                  var matchedOrgID = $.grep(thiz._g.orgList, function(n, i) {
                    return n.orgid === lastSelectedOrgInCache;
                  });
                  if (matchedOrgID.length > 0) {
                    // 跳转到主页面
                    zy.net.loadIndex();
                  } else {
                    showOrgSelection();
                  }
                } else {
                  // 机构选择
                  showOrgSelection();
                }
              } else if (msg.result.length == 1) {
                // 当前用户所属机构列表
                thiz._g.orgList = msg.result;
                zy.g.comm.org = msg.result[0].orgid;
                zy.g.comm.orgtype = msg.result[0].org_type;
                var orgpath = msg.result[0].isplatorg? 'paas':'saas/' + msg.result[0].orgid;
                zy.g.comm.orgpath = orgpath;
                ls_zy_user_info.set('user_selected_org', msg.result[0].orgid);
                ls_zy_user_info.set('user_selected_org_type', msg.result[0].org_type);
                ls_zy_user_info.set('user_selected_org_path', orgpath);
                // 转入 index
                zy.net.loadIndex();
              } else {
                // 当前用户所属机构列表 清空
                thiz._g.orgList = [];
                zy.ui.msg("提示信息：", "您尚未被登记为属于任何一个机构的用户，将不能进行任何操作，请联系管理员！", "e");
              }
            }
          };
          zy.g.am.app = "ZYAPP_LOGIN";
          zy.g.am.mod = "ZYMODULE_LOGIN";
          zy.net.get("user/getuserorg", cb);
        }
      }
    };
    var error = function(msg) {
      if (msg) {
        ls_zy_user_info.set('errorTimeout',(new Date()).getTime());
        if (msg.ret === '1001') {
          zy.ui.msg("登录失败：", "用户名或密码错误请尝试重新输入", "e");
          $('#c').closest('section').show();
          Event($('#c'));
          $('[name=c]').val('');
          $('#login-form input[name=password]').val('');
        }
        else if(msg.ret === '10'){
          zy.ui.msg("登录失败：", "验证码错误请重新输入", "e");
          $('#c').closest('section').show();
          Event($('#c'));
          $('[name=c]').val('');
        }
	else{
		zy.ui.msg('登录失败：',msg.msg, 'e');
		$('#c').closest('section').show();
		Event($('#c'));
		$('[name=c]').val('');
    $('#login-form input[name=password]').val('');
	}
      }
    };
    zy.log("登录之前 zy.g.comm.openid=" + zy.g.comm.openid);
    zy.g.am.app = '';
    zy.g.am.mod = '';
    zy.net.post("user/login", callback, param, null, error);
  }

  function showOrgSelection() {
    $("#div_login").hide();

    var ul = '<ol class="dd-list">';
    var tmp1 = '<li class="dd-item"><div class="dd-handle" data-org="';
    var tmp2 = '>';
    var tmp3 = '</div></li>';
    var orgList = thiz._g.orgList;
    var org_type = ' data-orgtype=';
    
    for (var i = 0; i < orgList.length; i++) {
      var orgpath = orgList[i].isplatorg? 'paas':'saas/' + orgList[i].orgid;
      ul = ul + tmp1 + orgList[i].orgid +'\" data-orgpath="' + orgpath + '" ' + org_type + orgList[i].org_type + tmp2 + orgList[i].orgnm + tmp3;
    }
    ul = ul + '</ol>';
    $("#org_list").append(ul);

    $("#div_login_org_selection").show();

    $('.dd-handle').on('click', function(e) {
      zy.log($(e.target));
      var selectedOrg = $(e.target).data('org');
      var _orgtype = $(e.target).data('orgtype');
      var _orgpath = $(e.target).data('orgpath');
      zy.log(JSON.stringify(ls_zy_user_info));
      ls_zy_user_info.set('user_selected_org', selectedOrg);
      ls_zy_user_info.set('user_selected_org_type', _orgtype);
      ls_zy_user_info.set('user_selected_org_path', _orgpath);
      zy.g.comm.org = selectedOrg;
      zy.g.comm.orgtype = _orgtype;
      zy.g.comm.orgpath = _orgpath;
      // 跳转到主页面
      zy.net.loadIndex();
    });
  }

  return Login;
})();
