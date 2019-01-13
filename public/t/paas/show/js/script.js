$(document).ready(function() {
    /*==== ISOTOPE LAYOUT ====*/
    var $container = $('.section');
    var vertical = $('body').hasClass('vertical');
    var Xoffset = 0, Yoffset = 0;
    
    function setContentWidth() {
        var finalWidth = 0;
        $container.each(function() {
            finalWidth += $(this).outerWidth(true);
        });
        $('#content').width(finalWidth)
    }
    if (!vertical) {
        $('body, html').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event, delta, deltaX, deltaY) {
          if($('#main_modal').css('display') === 'none'){
             $(this).scrollLeft($(this).scrollLeft() - deltaY * 100);
                event.preventDefault();
          }
        });
    }

    /*==== SCROLLBARS ====*/
    if (vertical) {
        $container.isotope({
            itemSelector: '.tile',
            layoutMode: 'masonry'
        });
    } else {
        $container.isotope({
            itemSelector: '.tile',
            layoutMode: 'masonryHorizontal',
            masonryHorizontal: {
                rowHeight: 0
            }
        });
    }

    $(window).load(function() {
        setContentWidth()
    })


    $(".htmltile").mCustomScrollbar({
        mouseWheelPixels: 300,
        theme: 'light-thick',
        scrollButtons: {
            enable: true
        }
    });

    $('#sidebar').mCustomScrollbar({
        mouseWheelPixels: 300,
        theme: 'light-thick',
        scrollButtons: {
            enable: true
        }
    });
    var modalOut = function(){
        $("#Primary_health_care_modal1").fadeOut(400);
        $("#Primary_health_care_modal2").fadeOut(400)
    }
    /*==== SCROLLTO ====*/
    $("a[data-scroll='scrollto']").click(function(e) {
        e.preventDefault();
        var $gotodiv = $($(this).attr('href'));

        if (!vertical)
            $('body, html').animate({
                'scrollLeft': $gotodiv.offset().left
            });
        else
            $('body, html').animate({
                'scrollTop': $gotodiv.offset().top
            });
        e.stopPropagation();
        modalOut();
    });
    /*==== SCROLLTO P 标签事件====*/
    $("p[data-scroll='scrollto']").click(function(e) {
        e.preventDefault();
        var uri = $(this).attr('data-href');
        if (uri.substr(0 ,1) === '#') {
          var $gotodiv = $(uri);
          if (!vertical)
              $('body, html').animate({
                  'scrollLeft': $gotodiv.offset().left
              });
          else
              $('body, html').animate({
                  'scrollTop': $gotodiv.offset().top
              });
        } else {
          window.open(uri); 
        }
        e.stopPropagation();
        modalOut();
    });

    /*==== METROMEGA FUNCTIONS ====*/
    $('.tileshow').each(function() {
        $(this).tileshow();
    });

    $('.bgtileshow').tileshow({
        timeout: 5000
    });

    /*==== REVEAL TILE ====*/
    $('.reveal-slide').each(function() {
        var height = $(this).height();
        $(this).hover(function() {
            $('.reveal', $(this)).stop().slideDown();
        }, function() {
            $('.reveal', $(this)).stop().slideUp(function() {
                $(this).height(height);
            });
        });
    });

    $('.reveal-fade').each(function() {
        $(this).hover(function() {
            $('.reveal', $(this)).stop().fadeIn(500, function() {
                $('.reveal', $(this)).css({
                    'display': 'block',
                    '-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    'filter': 'alpha(opacity=100)',
                    '-moz-opacity': 1,
                    '-khtml-opacity': 1,
                    'opacity': 1
                });
            });
        }, function() {
            $('.reveal', $(this)).stop().fadeOut(500, function() {
                $('.reveal', $(this)).css({
                    'display': 'none',
                    '-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    'filter': 'alpha(opacity=0)',
                    '-moz-opacity': 0,
                    '-khtml-opacity': 0,
                    'opacity': 0
                });
            });
        });
    });

    /*==== FUNCTIONS ====*/
    function setMargin() {
        //var marginH = ($(window).height() - $('.section').height()) * 0.9;
        var marginH = ($(window).height() - $('header').height() - $('.section').height()) * 0.5;
        $('.section').css({
            'margin-top': marginH,
            'margin-left': "170px",
            'margin-right': "170px"
        });
    }
    setMargin()


    var theWindow = $(window),
            $bg = $(".background"),
            aspectRatio = $bg.width() / $bg.height();

    function resizeBg() {
        if ((theWindow.width() / theWindow.height()) < aspectRatio) {
            $bg
                .removeClass('bgwidth')
                .addClass('bgheight');
        } else {
            $bg
                .removeClass('bgheight')
                .addClass('bgwidth');
        }
    }

    function initImages() {
        $('.imagetile').each(function() {
            var parent = $(this);
            var ratio = $('img', parent).width() / $('img', parent).height();

            if ((parent.width() / parent.height()) < ratio) {
                $('img', parent).removeClass('bgwidth').addClass('bgheight');
            }
            else {
                $('img', parent).removeClass('bgheight').addClass('bgwidth');
            }

            if (parent.hasClass('tileshow')) {
                var addClass = parent.find('.slide img').last().attr('class');
                $('img', parent).attr('class', ' ').addClass(addClass);
            }
        });
    }

    $('img').on('dragstart', function(event) {
        event.preventDefault();
    });

    /*==== FUNCTION CALLS ====*/
    initImages();
    resizeBg();
    if (!$('body').hasClass('vertical'))
        setMargin();

    $(window).resize(function() {
        setTimeout(function() {
            //$('.section').isotope('layout');
            if (!$('body').hasClass('vertical'))
                setMargin();
            initImages();
            resizeBg();
        }, 300);
        if (!vertical) {
            setTimeout(function() {
                setContentWidth();
            }, 1000);
        }
        resizeBg();
    });

    $(window).load(function() {
        initImages();
    });

    /*==== OPTIONS ====*/
    var $optionLinks = $('#portfolio a');

    $optionLinks.click(function() {
        if ($(this).hasClass('selected'))
            return false;
        else {
            var $filter = $(this).attr('data-option-value');
            $('#gallery').isotope({
                filter: $filter
            });

            if (!vertical) {
                setTimeout(function() {
                    setContentWidth();
                }, 1000)
            }
        }
    });

    /*==== METROMEGA SIDEBAR ====*/
    $('#opensidebar i').hover(function() {
        $('#sidebar').show(0).animate({
            'right': '0px'
        });
    });
    $('#sidebar').mouseleave(function() {
        $('#sidebar').animate({
            'right': '-120px'
        }, function() {
            $(this).css({
                'display': 'none'
            });
        });
    });

    /*==== METROMEGA CONTACT FORM ====*/

    //submission scripts
    $('#contactme').submit(function() {
        //statements to validate the form	
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var email = document.getElementById('email');
        if (!filter.test(email.value)) {
            $('.email-missing').fadeIn(500);
        } else {
            $('.email-missing').fadeOut(500);
        }
        if (document.cform.firstname.value == "") {
            $('.firstname-missing').fadeIn(500);
        } else {
            $('.firstname-missing').fadeOut(500);
        }
        if (document.cform.lastname.value == "") {
            $('.lastname-missing').fadeIn(500);
        } else {
            $('.lastname-missing').fadeOut(500);
        }
        if (document.cform.message.value == "") {
            $('.message-missing').fadeIn(500);
        } else {
            $('.message-missing').fadeOut(500);
        }
        if ((document.cform.firstname.value == "") || (document.cform.lastname.value == "") || (!filter.test(email.value)) || (document.cform.message.value == "")) {
            return false;
        }

        if ((document.cform.firstname.value != "") && (document.cform.lastname.value != "") && (filter.test(email.value)) && (document.cform.message.value != "")) {

            $('#messageload').fadeIn();

            $.post('mail.php', {
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                email: $('#email').val(),
                subject: $('#subject option:selected').text(),
                message: $('#message').val()
            },
            //return the data
            function(data, status) {
                $('#messageload').fadeOut();
                if (status == 'success') {
                    $('#contactme').fadeOut();
                    $('#messagesuccess').fadeIn();
                }
                else {
                    alert('Your message could not be sent. Please try again later!');
                }
            });
            //stay on the page
            return false;
        }
    });

    /*==== mLightBox ====*/
    $('a[data-lightbox="mlightboximage"]').each(function() {
        $(this).mlightbox('image');
    });

    $('a[data-lightbox="mlightboxvideo"]').each(function() {
        $(this).mlightbox('video');
    });

    $('a[data-lightbox="mlightboxblog"]').each(function() {
        $(this).mlightbox('blog');
    });
});