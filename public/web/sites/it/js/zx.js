/*!
 * zx (JS库) 当前库依赖第三方库:
 *    jQuery（v1.1x.x）： http://jquery.com/
 *
 * 基本功能:
 * zx: 基础库
 * @method ()
 */
(function ($) {
  var _win = window.frames[0] ? window.frames[0] : window;
  if (!_win.zx) {_win.zx = {};}
})(jQuery);

/** 对象 */
var zx = {
  /* 控制台log输出 */
  debug: true,//false,
  /* 控制台log输出函数封装 */
  log: function () {
      if (window.console && zx.debug) {
          Function.apply.call(console.log, console, arguments);
      }
  },

  /**
   * 动态背景颜色
   */
  initBg:function(){
			var colors = new Array(
          [156,39,176],//紫
          [230,81,0],//橙
          [63,81,181],//蓝
          [244,67,54],//红
          [76,175,80],//绿
          [103,58,183],//蓝紫
				);
			var step = 0;
			var colorIndices = [ 0, 1, 2, 3 ];
			var gradientSpeed = 0.002;
			function updateGradient() {
				if ($ === undefined)
					return;
				var c0_0 = colors[colorIndices[0]];
				var c0_1 = colors[colorIndices[1]];
				var c1_0 = colors[colorIndices[2]];
				var c1_1 = colors[colorIndices[3]];

				var istep = 1 - step;
				var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
				var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
				var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
				var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

				var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
				var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
				var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
				var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
				$($('body').data("bg")).css({
							background : "-webkit-gradient(linear, left top, right top, from("+ color1 + "), to(" + color2 + "))"
						}).css({
							background : "-moz-linear-gradient(left, "+ color1 + " 0%, " + color2+ " 100%)"
						});
				step += gradientSpeed;
				if (step >= 1) {
					step %= 1;
					colorIndices[0] = colorIndices[1];
					colorIndices[2] = colorIndices[3];
					colorIndices[1] = (colorIndices[1] + Math.floor(1+ Math.random() * (colors.length - 1)))% colors.length;
					colorIndices[3] = (colorIndices[3] + Math.floor(1+ Math.random() * (colors.length - 1)))% colors.length;
				}
			}
			setInterval(updateGradient, 50);
		},
};

/*** =============== Page Header =============== */
/** 初始化页头 */
!(function initHeader($){

  // 检测jquery
  if(!$){
    setTimeout(function(){initHeader(window.$);}, 100);
    zx.log('检测jquery = !$');
    return;
  }

  //初始化导航
  $(function(){
    // initScroll();
    triggerBind();  //渲染右侧菜单区
  });

  /** 初始化滚动动作 */
  function initScroll(){
    $(window).resize(function() {
      zx.log("$(window).width() = " + $(window).width());
    });
    $(window).scroll(function(){
      var top = $(window).scrollTop();
      if($(window).width()<=820)return;
      if(top>0){
        zx.log('initScroll.top > 0 : ' + top);
      }else if(top===0){
        zx.log('initScroll.top = 0 : ' + top);
      }
    });
  }

  /** 初始化移动端触发 */
  function triggerBind(){
    function holdBody (slide){
      window.scrollTo(0,0); // 页面滚动到顶部
    }

    var $root = $('html, body');
    var head = $('header');
    var main = $('#main');
    var menuH = head.find('#menu-h');
    var menuV = $('#menu-v');
    var mNav = $('#mNav');
    //菜单事件（微信关注）
    head.find('.sub-nav li').bind('click touchend', function bindMenuWX(e){
      //e.preventDefault();
      //e.stopPropagation();
      //menuH.find('.active').removeClass('active');
      //menuV.find('.active').removeClass('active');
      //var href = $(this).find('a').attr("href"); 
      //var anh = $(href).offset().top;
      //$root.stop().animate({scrollTop:anh},1200);
    });
    //菜单事件（水平）
    menuH.find('li').bind('click touchend', function bindMenuH(e){
      zx.log('菜单事件（水平）');
      var t = $(this);
      var href = t.find('a').attr("href");
      if (href.indexOf('#') !== 0) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      menuH.find('.active').removeClass('active');
      menuV.find('.active').removeClass('active');
      t.addClass('active');
      menuV.find('li').each(function(){
        var th = $(this);
        if (href==th.find('a').attr("href")){
          th.addClass('active');
          return;
        }
      });
      var anh = $(href).offset().top;
      $root.stop().animate({scrollTop:anh},1200);
    });
    //菜单事件（垂直）移动
    menuV.find('li').bind('mousedown touchend', function(){
      zx.log('菜单事件（垂直）移动');
      var t = $(this);
      var href = t.find('a').attr("href");
      if (href.indexOf('#') !== 0) {
        return;
      }
      menuH.find('.active').removeClass('active');
      menuV.find('.active').removeClass('active');
      t.addClass('active');
      menuH.find('li').each(function(){
        var th = $(this);
        if (href==th.find('a').attr("href")){
          th.addClass('active');
          return;
        }
      });
      var anh = $(href).offset().top;
      $root.stop().animate({scrollTop:anh},1200);
    });
    //移动端显示及隐藏菜单事件
    head.find('.J_menuTrigger').bind('click touchend', function bindMenu(e){
      zx.log('移动端显示及隐藏菜单事件');
      e.preventDefault();
      e.stopPropagation();
      var trigger = $(this);
      function cancel(e){
        var cur = $(e.target);
        if(!cur.parents('header').length || cur.parents('.triggers').length){
          e.preventDefault && e.preventDefault();
          head.unbind('click touchstart', cancel);
          main.unbind('click touchstart', cancel);
          menuH.find('a').unbind('click touchend');
          setTimeout(function(){
            trigger.removeClass('active');
            main.removeClass('wrap-slide-right');
            head.removeClass('wrap-slide-right');
            head.attr("style", "position:fixed;");
            mNav.removeClass('me-show');
            mNav.addClass('me-hide');
          }, 100);
        }
      }
      if(trigger.hasClass('active')){
        cancel(e);
        return;
      }
      trigger.addClass('active');
      // holdBody(true);
      main.addClass('wrap-slide-right');
      head.addClass('wrap-slide-right');
      mNav.removeClass('me-hide');
      mNav.addClass('me-show');
      setTimeout(function(){
        head.bind('click touchstart', cancel);
        main.bind('click touchstart', cancel);
        menuH.find('a').bind('click touchend', function(){
          menuH.find('a').unbind('click touchend', arguments.callee);
          cancel({target:$()});
        });
      },100);
    });
  }

})(window.$);

/**
 * 初始化页面
 */
(function ($) {
  zx.initBg();
  
  /** 首页轮播
  参数|描述|默认值
  mode|设置滑动模式，'horizontal':水平, 'vertical':垂直, 'fade':淡入淡出|horizontal
  speed|内容切换速度，数字，ms|500
  startSlide|初始滑动位置，数字|0
  randomStart|随机初始滑动位置|true
  infiniteLoop|循环滑动，如果设置为true时，则到最后滑动位置时会切换到初始位置|true
  easing|切换动画扩展，可以借助jQuery Easing 动画效果扩展设置不同的切换动画效果|null
  captions|设置显示图片标题，当滑动内容为图片时并设置属性title，可以显示图片标题|false
  video|支持视频，当设置为true时，需要jquery.fitvids.js支持|false
  pager|设置是否显示分页，设置为true时，会在滑动内容下方显示分页图标|true
  controls|设置是否显示上一副和下一幅按钮|true
  auto|设置是否自动滑动|false
  pause|自动滑动时停留时间，数字，ms|4000
  autoHover|当鼠标滑向滑动内容上时，是否暂停滑动|false
  */
  $('.bxslider').bxSlider({auto:true,speed:600,pause:6000,autoHover:true});

  $('#circle1').circleProgress({
    //value: 0.7,//值从0.0到1.0，默认值为0
    size: 180,//图的大小，单位像素，默认值100
    startAngle: -1.5,//初始角度，默认值为-Math.PI
    //reverse:false,//是否反向绘制圆弧和动画，默认值为false
    //lineCap:'round',//圆弧的线头样式："butt"、"round"和"square"。默认值为"butt"
    thickness:16,//进度条圆弧的宽度。默认它自动为size的1/14大小，你可以设置你需要的值。默认值为auto
    emptyFill:'rgba(70, 151, 242, 0.98)',//空圆弧的颜色。默认值为"rgba(0, 0, 0, .1)"
    fill: {//圆弧的颜色
      gradient: ["#749abe","#afd5fd"]//["#fece00","#ffa101"]
    }
  }).on('circle-animation-progress', function(event, progress,stepValue) {//当图像正在绘制时的监听事件
		    $(this).find('strong').html(String('<div>省</div><br><div>'+(stepValue*100).toFixed(0))+'<i>%</i></div>');
	});

  //当滚动条的位置处于距顶部500像素以下时，跳转链接出现，否则消失
  var o = $(".btn-back-top");
  $(window).scroll(function() {
    500 < $(this).scrollTop() ? o.addClass("back-show") : o.removeClass("back-show")
  });

  //当点击跳转链接后，回到页面顶部位置
  $(".btn-back-top").click(function(){
    $('body,html').animate({scrollTop:0},500);
      return false;
  });


})(jQuery);