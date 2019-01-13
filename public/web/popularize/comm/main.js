/* Create By xBoson System */
(function($) {
  
var pop = window.pop = {
  begin_fadein : begin_fadein,
};


//
// 小屏幕菜单初始化
//
$(function() {
  var main_menu = $(".main_menu");
  var sm_screen = $('.sm_screen');
  var menu_html = main_menu.find('ul').html();
  menu_html = '<ul class="vlist">'+ menu_html +'</ul>';
  
  sm_screen.click(function() {
    var menu = $(menu_html).appendTo(main_menu)
      .css({"position": 'absolute', 'display': 'none', 'z-index': '10'})
      .offset(sm_screen.offset())
      .fadeIn();
    
    $(document.body).one('click', function() {
      menu.remove();
    });
    return false;
  });
});


//
// 页面必须调用一次该方法, 否则 '.fadein' 元素不会显示.
//
function begin_fadein() {
  var fadein = $('.fadein');
  next_fadein();
  
  function next_fadein() {
    if (fadein.size() > 0) {
      var f = fadein.first();
      var speed = parseInt(f.attr('speed')) || f.attr('speed') || 1200;
      fadein = fadein.filter(':not(:first)');
      f.fadeIn(speed);
      setTimeout(next_fadein, 400);
    } else {
      console.debug("fade in end");
    }
  }
}


})(jQuery);