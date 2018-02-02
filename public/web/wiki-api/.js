////////////////////////////////////////////////////////////////////////////////
//
// Copyright 2017 本文件属于 xBoson 项目, 该项目由 J.yanming 维护,
// 本文件和项目的全部权利由 [荆彦铭] 和 [王圣波] 个人所有, 如有对本文件或项目的任何修改,
// 必须通知权利人; 该项目非开源项目, 任何将本文件和项目未经权利人同意而发行给第三方
// 的行为都属于侵权行为, 权利人有权对侵权的个人和企业进行索赔; 未经其他合同约束而
// 由本项目(程序)引起的计算机软件/硬件问题, 本项目权利人不负任何责任, 切不对此做任何承诺.
//
// 文件创建日期: 17-12-27 上午10:32
// 原始文件路径: web/wiki-api/.js
// 授权说明版本: 1.1
//
// [ J.yanming - Q.412475540 ]
//
////////////////////////////////////////////////////////////////////////////////
jQuery(function($) {

var menu = $("#menu");
var content = $('#content');
var current_select;
var default_page;

if (Math.random() * 100 <= 1) {
  menu.addClass("black_menu");
}
load_menu();


function load_menu() {
  var open_page = setPage();

  $.get('menu.json', function(menu_data) {
    console.log('load', menu_data)
    menu.html("");
    menu_data.forEach(function(d) { build_menu(d, null, 0) });
  });

  function build_menu(data, parent, level) {
    var m = $("<a class='menu_item'>");
    if (level) {
      m.css('padding-left', level * 20);
    } else {
      m.css('margin-top', 20);
    }
    m.html(data.name);

    if (data.file) {
      m.attr("href", "#");
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

    if (data.file == open_page) {
      m.click();
    }
    else if (open_page == null && data.default) {
      m.click();
    }
  }
}


function setPage(page) {
  if (page) {
    sessionStorage.wikiPage = page;
  }
  return sessionStorage.wikiPage;
}


function isMD(file) {
  return file.lastIndexOf(".md") > 0 
      || file.lastIndexOf(".markdown") > 0;
}


function open_doc(data) {
  $.get(data.file, function(txt) {
    var html;
    if (isMD(data.file)) {
      html = markdown.toHTML(txt);
    } else {
      html = txt;
    }
    content.html(html);

    var code = content.find("code");
    code.each(function() {
      var thiz = $(this);
      var all = thiz.text().split('\n');

      if (all.length > 1) {
        thiz.wrap("<pre>").css('display', 'inline-block');
        var title = "<div class='firstLine'>" + all[0].toUpperCase() + "</div>";
        thiz.addClass(aliasName(all[0]));
        all.splice(0, 1);
        thiz.text(all.join('\n'));
        thiz.before(title);
      }
    });
    setPage(data.file);
    
    hljs.initHighlighting.called = null;
    hljs.initHighlighting();
  });
  console.debug("Open", data.file);
} 


function aliasName(name) {
  name = name.toLowerCase()
  switch (name) {
    case 'sh':
    case 'shell':
      return 'bash';
    default:
      return name;
  }
}


});