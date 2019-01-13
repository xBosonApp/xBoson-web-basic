/**
 * 注册
 * @class Register
 */
Register = (function() {

  var PT = Register.prototype;
  var thiz;

  /**
   * 默认配置参数
   * @attribute _g
   * @private
   */
  PT._g = {
    param: {},

  };

  /**
   * 事件绑定规则定义
   * @property Events
   */
  PT.Events = {};

  /**
   * @class Register
   * @constructor
   */
  function Register() {
    zy.log("new Register()");
    //根据url改变host
    zy.g.host.api = zy.net.getHttpUrl("/ds/");
    zy.g.host.ui = zy.net.getHttpUrl();
    thiz = this;
    thiz.Init();
    return this;
  }

  PT.Init = function() {
    //默认手机注册
    $('input[name=email]').detach();
    $('#tel_register').btnDisable(true);
    $('#email_register').btnDisable(false);
    //获取验证码
    verify();
    GetValwords();
  };

  validator = $("#register-form").validate({
    rules: {
      userid: {
        required: true,
        minlength: 4,
        maxlength: 16,
        userunion: true
      },
      tel: {
        required: true,
        tel: true,
        telunion: true
      },
      email: {
        required: true,
        email: true,
        emailunion: true
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 16
      },
      valwords: {
        required: true,
        minlength: 6,
        maxlength: 6
      },
      agree: {
        required: true,
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
      password: {
        required: '请输入密码'
      },
      valwords: {
        required: '请输入验证码'
      },
      agree: {
        required: '请确认同意'
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
        Submit(form);
    },
  });

  //自定义手机号码验证
  $.validator.addMethod("tel", function(value, element) {
    var length = value.length;
    var tel = /^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9])[0-9]{8}$/;
    return this.optional(element) || (length == 11 && tel.test(value));
  }, "请输入正确的手机号码");

  //自定义用户重复验证
  $.validator.addMethod("userunion", function(value, element) {
    var flag;
    $.ajaxSetup({
      async: false // 设置同步
    });
    zy.g.am.app = "ZYAPP_LOGIN";
    zy.g.am.mod = "ZYMODULE_REG";
    zy.net.post("user/get_havinguser", function(msg) {
      flag = (msg.result && "1" == msg.result[0].count);
    }, {
      userid: value
    });
    $.ajaxSetup({
      async: true // 设置异步
    });
    return this.optional(element) || flag;
  }, "该用户ID已被注册");

  //自定义手机重复验证
  $.validator.addMethod("telunion", function(value, element) {
    var flag;
    $.ajaxSetup({
      async: false // 设置同步
    });
    zy.g.am.app = "ZYAPP_LOGIN";
    zy.g.am.mod = "ZYMODULE_REG";
    zy.net.post("user/get_havinguser", function(msg) {
      flag = (msg.result && "1" == msg.result[0].count);
    }, {
      tel: value
    });
    $.ajaxSetup({
      async: true // 设置异步
    });
    return this.optional(element) || flag;
  }, "该手机号码已被注册");

  //自定义邮箱重复验证
  $.validator.addMethod("emailunion", function(value, element) {
    var flag;
    $.ajaxSetup({
      async: false // 设置同步
    });
    zy.g.am.app = "ZYAPP_LOGIN";
    zy.g.am.mod = "ZYMODULE_REG";
    zy.net.post("user/get_havinguser", function(msg) {
      flag = (msg.result && "1" == msg.result[0].count);
    }, {
      email: value
    });
    $.ajaxSetup({
      async: true // 设置异步
    });
    return this.optional(element) || flag;
  }, "该电子邮箱已被注册");

  //手机注册、邮箱注册切换
  $('.register').on("click", 'button', function() {
    $current = $(this); //当前按键
    $other = $(this).parent().siblings().find('button'); //另一按键
    currentName = $(this).attr('name');
    otherName = $(this).parent().siblings().find('button').attr('name');
    //注册按键切换
    $current.btnDisable(true).addClass('btn-primary');
    $other.btnDisable(false).removeClass('btn-primary');
    //注册表单切换
    $('input[name=' + otherName + ']').detach();
    if ($(this).is('#tel_register')) {
      $('#' + currentName + '').parent().find('i').after('<input type="text" name="tel" placeholder="手机号码">');
    } else {
      $('#' + currentName + '').parent().find('i').after('<input type="text" name="email" placeholder="电子邮箱">');
    }
    //重置表单 清除样式
    $("#register-form label").removeClass('has-error');
    $("#register-form label i").removeAttr('style');
    validator.resetForm();
    $('#get_valwords').btnDisable(true);
    verify();
  });

  //手机或邮箱验证通过 验证码按键可用
  function verify() {
    $('#get_valwords').btnDisable(true);
    $('#register-form label.verify input').blur(function() {
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

  //Form 提交注册
  function Submit(form) {
    var callback = function(msg) {
      if (msg) {
        zy.log("register.success: " + JSON.stringify(msg));
        if (msg.ret == "0") {
          zy.ui.msg('提示信息：', '注册成功！', 's');
          window.location.href='login.html';
        }
      }
    };
    var error = function(msg) {
      if (msg) {
        if (msg.ret === '1001') {
          zy.ui.msg('提示信息：', '注册失败！', 'e');
        }
      }
    };
    zy.log('正在提交表单注册');
    zy.g.am.app = 'ZYAPP_LOGIN';
    zy.g.am.mod = 'ZYMODULE_REG';
    zy.net.post("user/register", callback, $("#register-form").serialize(), null, error);
  }
  return Register;
})();
