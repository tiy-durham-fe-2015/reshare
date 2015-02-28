app.factory('Share', function() {
  return function(spec) {
    spec = spec || {};
    return {
      title: spec.title || '',
      description: spec.description || '',
      url: spec.url || '',
      timestamp: new Date(), // non-mvp
      // author: spec.author, // non-mvp
      // authorId: spec.authorId, // non-mvp
      // upvotes: spec.upvotes || 0, // non-mvp
      // downvotes: spec.downvotes || 0, // non-mvp
      // comments: spec.comments || [], // non-mvp
      // score: function() { // non-mvp
      //   return this.upvotes - this.downvotes;
      // },
      // getComments: function() { // non-mvp
      //   return this.comments;
      // },
      // equals: function(share) { // non-mvp
      //   return (this.url === share.url);
      // },
    };
  };
});
