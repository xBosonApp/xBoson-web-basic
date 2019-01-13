/* 
 Plugin     : Tileshow
 Version    : 1.1
 Created on : Aug 13, 2013
 Author     : Grozav http://grozav.com
 */

(function($) {
    $.fn.mlightbox = function(option) {

        var a = $(this);
        var $preloader = $('.mlightbox#loader');
        var $this = $($(this).attr('href'));
        function fbShare(url, title, descr, image, winWidth, winHeight) {
            var winTop = (screen.height / 2) - (winHeight / 2);
            var winLeft = (screen.width / 2) - (winWidth / 2);
            window.open();
        }
        function twitterShare(url, title, descr) {
            window.open();
        }

        if (option == 'image') {

            function lightboxshow() {
                $this.fadeIn(1000);
                $details.css({
                    'left': '50px'
                });
                $details.delay(500).animate({
                    'left': '50px'
                }, 500);
                $content.fadeIn(0);
            }

            var $content = $('.mlightbox-content', $this);
            var $details = $('.mlightbox-details', $this);
            var $image = $('img', $content);
            var href = a.attr('data-src');
            function updateImg() {
                var contentwidth = $content.width();
                var contentheight = $content.height();
                var imagewidth = $image.width();
                var imageheight = $image.height();
                var ratio = imageheight / imagewidth;
                if ((imagewidth / imageheight) > (contentwidth / contentheight)) {
                    $image.css("width", contentwidth * 0.5);
                    $image.css("height", contentwidth * 0.5);
                    var margintop = (contentheight - imageheight) / 2;
                    $image.css({
                        'margin-top': "5vh",
                        'margin-left': "5vw"
                    });
                } else {

                    $image.css("height", contentheight * 0.5);
                    $image.css("width", contentheight * 0.5);
                    var marginleft = (contentwidth - imagewidth) / 2;
                    $image.css({
                        'margin-top': "5vh",
                        'margin-left': "5vw"
                    });
                }

            }

            $(window).resize(function() {
                updateImg();
            }).trigger('reisize');
            a.click(function() {

                if ($image.attr('src') != href) {
                    $image.attr('src', href);
                    $image.css({
                        'height': '300px',
                        'width': '300px'
                    });
                    $preloader.fadeIn();
                    var cancel = 0;
                    $preloader.click(function() {
                        $preloader.fadeOut();
                        cancel = 1;
                    });

                    var title = a.attr('data-title');
                    var description = a.attr('data-description');
                    $('.mlightbox-title').html(title);
                    $('.mlightbox-subtitle').html(description);
                    $image.load(function() {
                        if (cancel)
                            return false;
                        $preloader.fadeOut();
                        lightboxshow();
                        $(window).trigger('resize');
                    });
                } else {
                    lightboxshow();
                    $(window).trigger('resize');
                }
            });

            $content.click(function() {
                $this.fadeOut();
            });
        }
        else if (option == 'video') {

            var $content = $('.mlightbox-content', $this);
            var $details = $('.mlightbox-details', $this);
            var $video = $('.fitvideo', $this);

            function lightboxshow3() {
                $this.fadeIn(1000);
                $details.css({
                    'right': "5vw"
                });
                $details.delay(500).animate({
                    'right': "5vw"
                }, 500);
                $content.fadeIn(0);
            }

            a.click(function(e) {

                var title = a.attr('data-title');
                var description = a.attr('data-description');
                var src = a.attr('data-src');
                $('.mlightbox-title').html(title);
                $('.mlightbox-subtitle').html(description);
                $('iframe', $video).attr('src', src);

                $preloader.fadeIn();

                setTimeout(function(){
                    lightboxshow3();
                    $(window).trigger('resize');
                }, 500);

                $preloader.delay(500).fadeOut(500);

                
            });

            $video.fitVids();

            $(window).resize(function() {
                var contentheight = $content.height();
                var videoheight = $video.height();
                var margintop = (contentheight - videoheight) / 2;
                $video.css({
                    'margin-top': margintop,
                    'margin-left': 0
                });
            });

        }
        else if (option == 'blog') {
            var $content = $('.mlightbox-content', $this);
            var $details = $('.mlightbox-details', $this);
            var $blog = $('.fitblog', $this);

            function lightboxshow3() {
                $this.fadeIn(600);
                $details.css({
                    'right': -$details.width() + 'px'
                });
                $details.delay(600).animate({
                    'right': '0px'
                }, 600);
                $content.fadeIn(0);
            }

            a.click(function(e) {
                var title = a.attr('data-title');
                var description = a.attr('data-description');
                var src = a.attr('data-src');
                $('.mlightbox-title').html(title);
                $('.mlightbox-subtitle').html(description);
                $('iframe', $blog).attr('src', src);

                $preloader.fadeIn();

                setTimeout(function(){
                    lightboxshow3();
                    $(window).trigger('resize');
                }, 300);

                $preloader.delay(300).fadeOut(300);
            });

            $(window).resize(function() {
                var contentheight = $content.height();
                var blogheight = $blog.height();
                var margintop = (contentheight - blogheight) / 2;
                $blog.css({
                    'margin-top':'8vh',
                    'text-align': 'center'
                });
            });
            $content.click(function() {
              if (a.attr('data-href')) {
                var $gotodiv = $(a.attr('data-href'));
                $('body, html').animate({
                  'scrollLeft': $gotodiv.offset().left
                });
              }
              $this.fadeOut();
            });
        }

        $('.close-mlightbox', $this).click(function(e) {
            $this.fadeOut();
            $preloader.fadeOut();
            $('iframe', $video).attr('src', '#');
            $('iframe', $blog).attr('src', '#');
            e.preventDefault();
        });


    };
}(jQuery));