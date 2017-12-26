jQuery(function($) {

var menu = $("#menu");
var content = $('#content');
var current_select;

load_menu();


function load_menu() {
  $.get('menu.json', function(menu_data) {
    console.log('load', menu_data)
    menu.html("");
    menu_data.forEach(function(d) { build_menu(d, null, 0) });
  });

  function build_menu(data, parent, level) {
    var m = $("<a class='menu_item' href='#'>");
    if (level) {
      m.css('padding-left', level * 20);
    } else {
      m.css('margin-top', 20);
    }
    m.html(data.name);

    if (data.file) {
      m.click(function() {
        open_doc(data);
        if (current_select) {
          current_select.removeClass("selected_menu");
        }
        m.addClass('selected_menu');
        current_select = m;
        return false;
      });
    }
    m.appendTo(menu);

    if (data.sub && data.sub.length > 0) {
      data.sub.forEach(function(d) {
        build_menu(d, m, level+1);
      });
    }

    if (data.default) {
      m.click();
    }
  }
}


function open_doc(data) {
  if (!data.file) return;
  $.get(data.file, function(txt) {
    var html = markdown.toHTML(txt);
    content.html(html);

    var code = content.find("code");
    code.wrap("<pre>");
    code.each(function() {
      var thiz = $(this);
      var all = thiz.text().split('\n');
      var title = "<div class='firstLine'>" + all[0].toUpperCase() + "</div>";
      all.splice(0, 1);
      thiz.html(all.join('\n'));
      thiz.before(title);
    });
  });
  console.debug("Open", data.file);
} 


});