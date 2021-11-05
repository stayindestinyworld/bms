$(function ($) {
    "use strict";

    jQuery(document).ready(function () {
        $('.play-video').magnificPopup({
            type: 'video'
        });

        $('.img-popup').magnificPopup({
            type: 'image'
        });
        $('[data-countdown]').each(function () {
            var $this = $(this),
                finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function (event) {
                $this.html(event.strftime('<span>%D:</span><span>%H:</span><span>%M:</span><span>%S</span>'));
            });
        });
        $('[data-countdown2]').each(function () {
            var $this = $(this),
                finalDate = $(this).data('countdown2');
            $this.countdown(finalDate, function (event) {
                $this.html(event.strftime('<p>%D : <span>Days</span></p> <p>%H : <span>Hours</span></p> <p>%M : <span>Minutes</span></p> <p>%S <span>Seconds</span></p>'));
            });
        });
    });
    
    var scrollToElement = { scrollSpeed : 700 }
    $('a[data-scroll^="#"]').on('click', function(event) {
           var target = $(this.getAttribute('data-scroll'));
           if( target.length ) {
               event.preventDefault();
               $('html, body').stop().animate({
                   scrollTop: target.offset().top
               }, scrollToElement.scrollSpeed);
           }
       });

    $(document).on('click', '.bottomtotop', function () {
        $("html,body").animate({
            scrollTop: 0
        }, 2000);
    });

    var lastScrollTop = '';
    $(window).on('scroll', function () {
        var $window = $(window);
        if ($window.scrollTop() > 0) {
            $(".header").addClass('nav-fixed');
        } else {
            $(".header").removeClass('nav-fixed');
        }

        var st = $(this).scrollTop();
        var ScrollTop = $('.bottomtotop');
        if ($(window).scrollTop() > 1000) {
            ScrollTop.fadeIn(1000);
        } else {
            ScrollTop.fadeOut(1000);
        }
        lastScrollTop = st;

    });

    $(window).on('load', function () {
        var preLoder = $("#preloader");
        preLoder.addClass('hide');
        var backtoTop = $('.back-to-top');
        var backtoTop = $('.bottomtotop');
        backtoTop.fadeOut(100);

    });

});


