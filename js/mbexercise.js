if (typeof jQuery === "undefined") {
    throw new Error("jQuery plugins need to be before this file");
}

$.MBexercise = {};
$.MBexercise.options = {
    colors: {
        red: '#F44336',
    },
    leftSideBar: {
        scrollColor: 'rgba(0,0,0,0.5)',
        scrollWidth: '4px',
        scrollAlwaysVisible: false,
        scrollBorderRadius: '0',
        scrollRailBorderRadius: '0',
        scrollActiveItemWhenPageLoad: true,
        breakpointWidth: 1170
    },
    dropdownMenu: {
        effectIn: 'fadeIn',
        effectOut: 'fadeOut'
    }
}


$.MBexercise.leftSideBar = {
    activate: function () {
        var _this = this;
        var $body = $('body');
        var $overlay = $('.overlay');

        $(window).click(function (e) {
            var $target = $(e.target);
            if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

            if (!$target.hasClass('bars') && _this.isOpen() && $target.parents('#leftsidebar').length === 0) {
                if (!$target.hasClass('js-right-sidebar')) $overlay.fadeOut();
                $body.removeClass('overlay-open');
            }
        });

        $.each($('.menu-toggle.toggled'), function (i, val) {
            $(val).next().slideToggle(0);
        });

        $.each($('.menu .list li.active'), function (i, val) {
            var $activeAnchors = $(val).find('a:eq(0)');

            $activeAnchors.addClass('toggled');
            $activeAnchors.next().show();
        });

        $('.menu-toggle').on('click', function (e) {
            var $this = $(this);
            var $content = $this.next();

            if ($($this.parents('ul')[0]).hasClass('list')) {
                var $not = $(e.target).hasClass('menu-toggle') ? e.target : $(e.target).parents('.menu-toggle');

                $.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
                    if ($(val).is(':visible')) {
                        $(val).prev().toggleClass('toggled');
                        $(val).slideUp();
                    }
                });
            }

            $this.toggleClass('toggled');
            $content.slideToggle(320);
        });

        _this.setMenuHeight();
        _this.checkStatuForResize(true);
        $(window).resize(function () {
            _this.setMenuHeight();
            _this.checkStatuForResize(false);
        });

        Waves.attach('.menu .list a', ['waves-block']);
        Waves.init();
    },
    setMenuHeight: function (isFirstTime) {
        if (typeof $.fn.slimScroll != 'undefined') {
            var configs = $.MBexercise.options.leftSideBar;
            var height = ($(window).height() - ($('.legal').outerHeight() + $('.user-info').outerHeight() + $('.navbar').innerHeight()));
            var $el = $('.list');

            $el.slimscroll({
                height: height + "px",
                color: configs.scrollColor,
                size: configs.scrollWidth,
                alwaysVisible: configs.scrollAlwaysVisible,
                borderRadius: configs.scrollBorderRadius,
                railBorderRadius: configs.scrollRailBorderRadius
            });

            if ($.MBexercise.options.leftSideBar.scrollActiveItemWhenPageLoad) {
                var activeItemOffsetTop = $('.menu .list li.active')[0].offsetTop
                if (activeItemOffsetTop > 150) $el.slimscroll({ scrollTo: activeItemOffsetTop + 'px' });
            }
        }
    },
    checkStatuForResize: function (firstTime) {
        var $body = $('body');
        var $openCloseBar = $('.navbar .navbar-header .bars');
        var width = $body.width();

        if (firstTime) {
            $body.find('.content, .sidebar').addClass('no-animate').delay(1000).queue(function () {
                $(this).removeClass('no-animate').dequeue();
            });
        }

        if (width < $.MBexercise.options.leftSideBar.breakpointWidth) {
            $body.addClass('ls-closed');
            $openCloseBar.fadeIn();
        }
        else {
            $body.removeClass('ls-closed');
            $openCloseBar.fadeOut();
        }
    },
    isOpen: function () {
        return $('body').hasClass('overlay-open');
    }
};
/* Searchbar ================================================================================================
*/
var $searchBar = $('.search-bar');
$.MBexercise.search = {
    activate: function () {
        var _this = this;

        //Search button click event
        $('.js-search').on('click', function () {
            _this.showSearchBar();
        });

        //Close search click event
        $searchBar.find('.close-search').on('click', function () {
            _this.hideSearchBar();
        });

        //ESC key on pressed
        $searchBar.find('input[type="text"]').on('keyup', function (e) {
            if (e.keyCode == 27) {
                _this.hideSearchBar();
            }
        });
    },
    showSearchBar: function () {
        $searchBar.addClass('open');
        $searchBar.find('input[type="text"]').focus();
    },
    hideSearchBar: function () {
        $searchBar.removeClass('open');
        $searchBar.find('input[type="text"]').val('');
    }
}
/* Navbar =======================================================================================================
*/
$.MBexercise.navbar = {
    activate: function () {
        var $body = $('body');
        var $overlay = $('.overlay');

        //Open left sidebar panel
        $('.bars').on('click', function () {
            $body.toggleClass('overlay-open');
            if ($body.hasClass('overlay-open')) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
        });

        //Close collapse bar on click event
        $('.nav [data-close="true"]').on('click', function () {
            var isVisible = $('.navbar-toggle').is(':visible');
            var $navbarCollapse = $('.navbar-collapse');

            if (isVisible) {
                $navbarCollapse.slideUp(function () {
                    $navbarCollapse.removeClass('in').removeAttr('style');
                });
            }
        });
    }
}
/* Browser ======================================================================================================
*/
var edge = 'Microsoft Edge';
var ie10 = 'Internet Explorer 10';
var ie11 = 'Internet Explorer 11';
var opera = 'Opera';
var firefox = 'Mozilla Firefox';
var chrome = 'Google Chrome';
var safari = 'Safari';

$.MBexercise.browser = {
    activate: function () {
        var _this = this;
        var className = _this.getClassName();

        if (className !== '') $('html').addClass(_this.getClassName());
    },
    getBrowser: function () {
        var userAgent = navigator.userAgent.toLowerCase();

        if (/edge/i.test(userAgent)) {
            return edge;
        } else if (/rv:11/i.test(userAgent)) {
            return ie11;
        } else if (/msie 10/i.test(userAgent)) {
            return ie10;
        } else if (/opr/i.test(userAgent)) {
            return opera;
        } else if (/chrome/i.test(userAgent)) {
            return chrome;
        } else if (/firefox/i.test(userAgent)) {
            return firefox;
        } else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
            return safari;
        }

        return undefined;
    },
    getClassName: function () {
        var browser = this.getBrowser();

        if (browser === edge) {
            return 'edge';
        } else if (browser === ie11) {
            return 'ie11';
        } else if (browser === ie10) {
            return 'ie10';
        } else if (browser === opera) {
            return 'opera';
        } else if (browser === chrome) {
            return 'chrome';
        } else if (browser === firefox) {
            return 'firefox';
        } else if (browser === safari) {
            return 'safari';
        } else {
            return '';
        }
    }
}

$(function () {
    $.MBexercise.browser.activate();
    $.MBexercise.leftSideBar.activate();
    $.MBexercise.navbar.activate();
    $.MBexercise.search.activate();

    setTimeout(function () { $('.page-loader-wrapper').fadeOut(); }, 50);
});