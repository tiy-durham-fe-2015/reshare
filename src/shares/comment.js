app.factory('Comment', function () {
  return function (spec) {
    spec = spec || {};
    return {
      userId: spec.userId,
      text: spec.text,
      subjectId: spec.shareId,
      created: Date.now()
    };
  };
});
