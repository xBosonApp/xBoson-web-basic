/**
 * @class Login
 */
Login = (function() {

  var PT = Login.prototype;
  var thiz;
  var ls_zy_user_info;
  var NEED_CAPTCHA = 5;

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
  
  function showCaptcha(force) {
    if (--NEED_CAPTCHA < 0 || force) {
      var cap = $('#c');
      var sec = cap.closest('section').show();
      Event(cap);
      sec.find('[name=c]').val('');
    }
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
          showCaptcha();
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
                }
                // 机构选择
                showOrgSelection();
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
                
                checkReturnParam();
                // 转入 index
                zy.net.loadIndex();
              } else {
                // 当前用户所属机构列表 清空
                thiz._g.orgList = [];
                checkReturnParam();
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
          showCaptcha();
          $('#login-form input[name=password]').val('');
        }
        else if(msg.ret === '10'){
          zy.ui.msg("登录失败：", "验证码错误请重新输入", "e");
          showCaptcha(true);
        } else{
      		zy.ui.msg('登录失败：',msg.msg, 'e');
          showCaptcha();
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
      
      checkReturnParam();
      // 跳转到主页面
      zy.net.loadIndex();
    });
  }
  
  // 支持 returnPage 参数, 在登陆后跳转到 returnPage
  function checkReturnParam() {
    try {
      let url = new URL(document.location);
      let rp = url.searchParams.get('returnPage');

      if (rp) {
        // hack: 递交按钮中不能修改 href
        setTimeout(function() {
          location.href = rp;
          console.log("return page "+ location.href, rp)
        }, 1);
        return true;
      }
    } catch(err) {
      console.debug("cannot support return param", err);
    }
  }

  return Login;
})();


$(function() {

// zy.g.host.ui = zy.net.getHttpUrl();
// zy.g.host.api = zy.net.getHttpUrl("/ds/");
var login = new Login();
 $('#form-password').hide();
login.Init();

// 注册/登陆
$('#login-header-space a').click(function(){
	var target = $('#form-section');
	$('#div_login').find('input').val('');
	$('#form-password').hide();
	if(target.is(':visible')){
		target.hide();
		target.prev().show();
		$(this).html('创建用户');
	}else{
		target.show();
		target.prev().hide();
		$(this).html('登陆');
	}
});

var wxLogin = $("#wxLogin").click(function() {
  var uri = 'openapp/a297dfacd7a84eab9656675f61750078/af1880a8938f4756a3f377c93be99d78/wx_website/redirect_uri';
  zy.net.get(uri, function(d) {
    if (d.code == 0) {
      location.href = d.msg;
    }
  });
});
if (location.port == 80 || location.port == 443 || location.port === "") {
  wxLogin.show();
	// 执行一次登出操作, 否则已经登录的用户会妨碍匿名接口访问.
	$.get(zy.g.host.api +'user/logout', console.log);
}

$('#i-agree').click(function () {
	$this = $('#agree');
	if ($this.checked) {
		$('#myModal').modal('toggle');
	} else {
		$this.prop('checked', true);
		$('#myModal').modal('toggle');
	}
});

// 忘记密码
$('#repw').click(function () {
	var target = $('#form-password');
	target.show();
	target.prev().hide();
	target.prev().prev().hide();

  //默认手机找回
  $('input[name=email]').detach();
  $('#tel_forgotpassword').btnDisable(true);
  $('#email_forgotpassword').btnDisable(false);
  //获取验证码
  verify();
  GetValwords();
});
		
validator = $("#forgotpassword-form").validate({
  rules: {
    userid: {
      required: true,
      minlength: 4,
      maxlength: 16
    },
    tel: {
      required: true,
      tel: true
    },
    email: {
      required: true,
      email: true,
    },
    newpassword: {
      required: true,
      minlength: 6,
      maxlength: 16
    },
    valwords: {
      required: true,
      minlength: 6,
      maxlength: 6
    },
  },
  messages: {
    userid: {
      required: '请输入用户ID'
    },
    tel: {
      required: '请输入手机号码',
    },
    email: {
      required: '请输入电子邮箱',
    },
    newpassword: {
      required: '请输入新密码'
    },
    valwords: {
      required: '请输入验证码'
    },
  },
  onfocusout: function(element) {
    $(element).valid();
  },
  onkeyup: function(element) {
    $(element).valid();
  },
  errorElement: 'b',
  errorPlacement: function(error, element) {
    if (element.is(":checkbox")) {
      error.appendTo(element.parent()).css('color', 'red');
    } else {
      error.appendTo(element.parent()).addClass("tooltip tooltip-top-right");
    }
  },
  highlight: function(element, errorClass, validClass) {
    $(element).parent().addClass('has-error');
    $(element).parent().find('i').css('color', 'red');
  },
  unhighlight: function(element, errorClass, validClass) {
    $(element).parent().removeClass('has-error');
    $(element).parent().find('i').css('color', 'green');
  },
  submitHandler: function(form) {
    $('#forgotpassword-button').click(function(event) {
      Submit(form);
    });
  },
});

//自定义手机号码验证
$.validator.addMethod("tel", function(value, element) {
  var length = value.length;
  var tel = /^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9])[0-9]{8}$/;
  return this.optional(element) || (length == 11 && tel.test(value));
}, "请输入正确的手机号码");

//手机找回、邮箱找回切换
$('.forgotpassword').on("click", 'button', function() {
  $current = $(this); //当前按键
  $other = $(this).parent().siblings().find('button'); //另一按键
  currentName = $(this).attr('name');
  otherName = $(this).parent().siblings().find('button').attr('name');
  //密码找回按键切换
  $current.btnDisable(true).addClass('btn-primary');
  $other.btnDisable(false).removeClass('btn-primary');
  //密码找回表单切换
  $('input[name=' + otherName + ']').detach();
  if ($(this).is('#tel_forgotpassword')) {
    $('#' + currentName + '').parent().find('i').after('<input type="text" name="tel" placeholder="手机号码">');
  } else {
    $('#' + currentName + '').parent().find('i').after('<input type="text" name="email" placeholder="电子邮箱">');
  }
  //重置表单 清除样式
  $("#forgotpassword-form label").removeClass('has-error');
  $("#forgotpassword-form label i").removeAttr('style');
  validator.resetForm();
  $('#get_valwords').btnDisable(true);
  verify();
});

//手机或邮箱验证通过 验证码按键可用
function verify() {
  $('#get_valwords').btnDisable(true);
  $('#forgotpassword-form label.verify input').blur(function() {
    if (validator.element($(this))) {
      $('#get_valwords').btnDisable(false);
    } else {
      $('#get_valwords').btnDisable(true);
    }
  }).keyup(function() {
    $(this).triggerHandler('blur');
  }).focus(function() {
    $(this).triggerHandler('blur');
  });
}

//验证码60s倒计时
function GetValwords() {
  var countdown = 60;
  function time(o) {
    if (countdown == 0) {
      o.btnDisable(false);
      o.val('获取验证码');
      countdown = 60;
    } else {
      o.btnDisable(true);
      o.val("重新发送" + countdown);
      countdown--;
      setTimeout(function() {
        time(o);
      }, 1000);
    }
  }
  $('#get_valwords').on('click', function(event) {
    time($(this));
  });
}

});