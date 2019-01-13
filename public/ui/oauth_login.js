/**
 * 数据字典类型
 * @class Login
 */
Login = (function () {
    var PT = Login.prototype;
    var thiz;
    var ls_zy_user_info;

    /**
     * 默认配置参数
     * @attribute _g
     * @private
     */
    PT._g = {
        orgList: []
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

    function R() {
        return zy.g.host.api + 'captcha?' + Math.round(Math.random() * 100000);
    }

    function Event(c) {
        c.attr('src', R());
        c.unbind('click').click((function () {
            var time = 0;
            return function (e) {
                var now = (new Date()).getTime();

                if (now - time < 15000) return false;

                time = now;

                $('[name=c]').val('');
                var $this = $(this);
                $this.attr('src', R());

                var next = $this.next();

                var t = 15;
                next.html(t);
                var I = setInterval(function () {
                    --t;
                    zy.log(t);
                    if (t > 0) {
                        next.html(t);
                    } else {
                        clearInterval(I);
                        next.html('');
                    }
                }, 1000)
            }
        })());
    }

    /**
     * 画面初始化
     * @method init
     */
    PT.Init = function () {
        //本地缓存
        ls_zy_user_info = zy.cache.get('_zy_user_info', 'ls');

        //检测httpUrl
        zy.g.host.api = zy.net.getHttpUrl("/ds/");
        zy.g.host.ui = zy.net.getHttpUrl();

        var errorTime = ls_zy_user_info.get('errorTimeout');

        if (errorTime) {
            var now = (new Date()).getTime();
            if (now - errorTime < 900000) {
                $('#c').closest('section').show();
                Event($('#c'));
            }
        }

        $('#login-form input[name=userid]').focus();

        // Form 提交登录
        // Validation
        Event($('#cc'));
        $("#login-form").validate({
            // Rules for form validation
            rules: {
                userid: {
                    required: true,
                    minlength: 4,
                    maxlength: 20
                },
                password: {
                    required: true,
                    minlength: 6,
                    maxlength: 20
                }
            },

            // Messages for form validation
            messages: {
                userid: {
                    required: '请输入用户ID'
                },
                password: {
                    required: '请输入密码'
                }
            },

            submitHandler: function (form) {
                Submit(form);
            },

            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
    };

    //如果不支持cookie 使用本地缓存
    function checkCookie(userkey) {
        ls_zy_user_info.set('user_local_userkey', userkey);
        ls_zy_user_info.set('user_openid', zy.g.comm.openid);
    }

    function getQueryParam(name) {
        var parm = document.location.search;
        // var reg = new RegExp(name + '=(.+)\&?');
        var reg = new RegExp('url=([\\w%\\.\\-~\\*\'\\(\\)!]+)\&?');
        var ret = reg.exec(parm);
        if (ret) ret = ret[1];
        return ret && decodeURIComponent(ret);
    }

    function getRequest(url) {
        var theRequest = {};
        var index = url.indexOf("?");
        if (index != -1) {
            url = url.substring(index + 1);
        }
        var strArray = url.split("&");
        for(var i = 0; i < strArray.length; i ++) {
            var rowArray = strArray[i].split("=");
            theRequest[rowArray[0]] = rowArray[1];
        }
        return theRequest;
    }
    function fillForm() {
        var urlValue = getQueryParam('url');
        var paraObj = getRequest(urlValue);
        var form = $('#auth_form');
        form.find('input[name=response_type]').val(paraObj['response_type']);
        form.find('input[name=scope]').val(paraObj['scope']);
        form.find('input[name=client_id]').val(paraObj['client_id']);
        form.find('input[name=redirect_uri]').val(paraObj['redirect_uri']);
        form.find('input[name=state]').val(paraObj['state']);
    }

    PT.auth = function (auth) {
        fillForm();
        var form = $('#auth_form');
        if (!auth) {
            form.find('input[name=op]').val('cancel');
        }
        form.submit();
    };

    //登陆验证
    function Submit(form) {
        var param = $("#login-form").form2json();
        param.password = $.md5(param.password);

        var callback = function (msg) {
            if (msg) {
                zy.log("login.success: " + JSON.stringify(msg));
                if (msg.ret == "0") {

                    ls_zy_user_info.remove('errorTimeout');
                    zy.g.comm.openid = msg.openid;
                    zy.g.comm.mdk = msg.mdk;
                    ls_zy_user_info.set('user_mdk', msg.mdk);

                    checkCookie(msg.userkey);

                    //$('#redirect_api').on('load', _complete).prop('src', url);
                    //
                    //function _complete() {
                    //    $('#div_login').html('<div style="padding: 100px">登录完成</div>');
                    //    window.close();
                    //}
                    thiz.auth(true);
                }
            }
        };
        var error = function (msg) {
            if (msg) {
                ls_zy_user_info.set('errorTimeout', (new Date()).getTime());
                if (msg.ret === '1001') {
                    zy.ui.msg("登录失败：", "用户名或密码错误请尝试重新输入", "e");
                    $('#c').closest('section').show();
                    Event($('#c'));
                    $('[name=c]').val('');
                }
                else if (msg.ret === '10') {
                    zy.ui.msg("登录失败：", "验证码错误请重新输入", "e");
                    $('#c').closest('section').show();
                    Event($('#c'));
                    $('[name=c]').val('');
                }
                else {
                    zy.ui.msg('登录失败：', msg.msg, 'e');
                    $('#c').closest('section').show();
                    Event($('#c'));
                    $('[name=c]').val('');
                }
            }
        };
        zy.g.am.app = '';
        zy.g.am.mod = '';
        zy.net.post("user/login", callback, param, null, error);
        $('#login-form input[name=password]').val('');
    }
    //PT.cancellogin = function() {
    //    var cookie = $('#redirect_cookie').html();
    //    var url = getQueryParm('url');
    //    url = url.replace('oauth2/authorize', 'oauth2/cancellogin');
    //    console.log('Oauth2 :', url, cookie);
    //    $('#redirect_api').on('load', _complete).prop('src', url);
    //
    //    function _complete() {
    //        $('#div_login').html('<div style="padding: 100px">取消完成</div>');
    //        window.close();
    //    }
    //};
    return Login;
})();
