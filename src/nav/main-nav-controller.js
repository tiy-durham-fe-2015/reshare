app.controller('MainNavCtrl',
  ['$location', 'StringUtil', 'usersService', function($location, StringUtil, usersService) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };

    usersService.currentUser().then(function (data) {
      self.currentUser = data;
    });

    function windowWidthLess () {
      return $(window).width() < 459;
    }

    function checkbox (bool) {
      $('.main-checkbox').prop('checked', bool);
    }

    function changeHeight (height) {
      $('.header-index').css({
        'height': height + 'px'
      });
      $('.site-header').css({
        'height': height + 'px'
      });
    }

    $('.for-clicking').on('click', function () {
      if (windowWidthLess()) {
        console.log('hey')
        checkbox(true);
        changeHeight(150);
        if ($('.header-left').length === 5) {
          changeHeight(180);
        };
      };
    });

    if ($(window).width() > 460) {
      $('.for-clicking').hide();
    }

    $(window).resize(function() {
      if ($(window).width() > 460) {
        $('.for-clicking').hide();
      }
    });

    $(window).resize(function() {
        if (windowWidthLess()) {
          checkbox(false);
          $('.for-clicking').show();
          changeHeight(50);
        };
    });

    $('.header-left').on('click', function () {
      if (windowWidthLess()) {
        checkbox(false);
        changeHeight(50);
        $('.site-header').animate({
          'height': '50px',
        }, 500);
      }
    });
  }]);
