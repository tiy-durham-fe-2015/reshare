app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };

    $('.for-clicking').on('click', function () {
      console.log("eh")
      $('.main-checkbox').prop('checked', true)
      $('.site-header').css({
        'height': '155px',
      });
    });

    $('.header-left').on('click', function () {
      $('.main-checkbox').prop('checked', false)
      $('.site-header').animate({
        'height': '50px',
      }, 500);
    })
  }]);
