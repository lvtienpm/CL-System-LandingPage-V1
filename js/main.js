(function ($) {
    $(document).on('ready', function () {
        var db = new Object();
        db.preLoad = function () {
            $('#page-loader').delay(800).fadeOut(600, function () {
                $('body').fadeIn();
            });
        }
        db.menuResponsive = function () {
            $('.menu-icon').on('click', function () {
                $('body').toggleClass("open-menu");
                setTimeout(scrollToTop, 0);
            });


            $('.menu-res li.menu-item-has-children').on('click', function (event) {
                event.stopPropagation();
                var submenu = $(this).find(" > ul");
                if ($(submenu).is(":visible")) {
                    $(submenu).slideUp();
                    $(this).removeClass("open-submenu-active");
                } else {
                    $(submenu).slideDown();
                    $(this).addClass("open-submenu-active");
                }
            });
            $('.menu-res li.menu-item-has-children > a').on('click', function () {
                //  return false;
            });

            $('.menu-res li a').on('click', function () {
                $('body').removeClass("open-menu"); // Xóa class open-menu để đóng menu
            });


        }

        db.sliderHome = function () {
            var owl_home = $('.owl-home');
            if ($(owl_home).length) {
                $(owl_home).owlCarousel({
                    loop: true,
                    margin: 0,
                    animateOut: 'fadeOut',

                    nav: true,
                    autoplay: false,
                    navText: ['<i class="icon icon-circle-left2"></i>', '<i class="icon icon-circle-right2"></i>'],
                    items: 1

                });
            }
        }
        db.sliderPartner = function () {
            var owl_partner = $('.owl-partner');
            if ($(owl_partner).length) {
                $(owl_partner).owlCarousel({
                    loop: true,
                    margin: 0,


                    nav: true,
                    autoplay: false,
                    navText: ['<i class="icon icon-circle-left2"></i>', '<i class="icon icon-circle-right2"></i>'],
                    responsive: {

                        0: {
                            items: 1,
                        },

                        576: {
                            items: 2,
                        },

                        768: {
                            items: 2,

                        },
                        991: {
                            items: 4,

                        }
                    },

                });
            }
        }

        db.gallery = function () {

            var openPhotoSwipe = function (index) {
                console.log(index + "ss");
                var pswpElement = document.querySelectorAll('.pswp')[0];

                // build items array
                /* var items = [{
                         src: 'images/16.png',
                         w: 1000,
                         h: 600
                 },
                     {
                         src: 'images/17.png',
                         w: 1000,
                         h: 600
                 } ];*/


                var imgs = $('.news-article img');





                var items = new Array();



                for (i = 0; i < imgs.length; i++) {


                    items[i] = {
                        src: $(imgs[i]).attr("src"),
                        w: 1000,
                        h: 600
                    };


                }




                console.log(items);

                // define options (if needed)
                var options = {
                    // history & focus options are disabled on CodePen        
                    history: false,
                    focus: false,
                    index: parseInt(index, 10),

                    showAnimationDuration: 0,
                    hideAnimationDuration: 0

                };

                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            };

            $('.news-article img').click(function () {
                openPhotoSwipe($(this).attr("data-index"));
                console.log($(this).attr("data-index"));
            });
        }


        db.preLoad();
        db.menuResponsive();
        db.sliderHome();
        db.sliderPartner();
        db.gallery();
    });
})(jQuery);
