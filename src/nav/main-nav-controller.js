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

    function changeHeight (hi, sh) {
      $('.header-index').css({
        'height': hi + 'px'
      });
      $('.site-header').css({
        'height': sh + 'px'
      });
    }

    $('.for-clicking').on('click', function () {
      if (windowWidthLess()) {
       checkbox(true);
        $('.site-header').css({
          'height': '155px',
        });
        if ($('.header-left').length === 5) {
          changeHeight(180, 185);
        }
      }
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
          changeHeight(50, 50);
          checkbox(false);
          $('.for-clicking').show();
        }
    });

    $('.header-left').on('click', function () {
      if (windowWidthLess()) {
        checkbox(false);
        changeHeight(45, 50);
        $('.site-header').animate({
          'height': '50px',
        }, 500);
      }
    });
  }]);
