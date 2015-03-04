app.factory('VoteFactory', ['shareService', function (shareService) {

	var ups;
	var downs;

	function getVotes (votes, dir, rgb) {
		console.log(votes);
		var newVotes = votes + 1;
		console.log(newVotes);
		var el = $(event.target).parent().find('.fa-arrow-' + dir);
		if (el.css('color') !== rgb) {
			$(event.target).parent().find('.' + dir +'vote-count').html(dir + 'votes: ' + newVotes);
		};
	};

	function upvote (color, id, upvotes, downvotes) {
		getVotes(upvotes, 'up', 'rgb(0, 0, 255)');
		ups = (upvotes + 1);
		console.log(ups);
		event.target.style.color = color;
		var downEl = $(event.target).parent().find('.fa-arrow-down');
		if (downEl.css('color') === 'rgb(255, 165, 0)') {
			downEl.css({
				'color': 'lightgray'
			});
			shareService.undovote(id, 'down', (downs - 1));
		}x
		shareService.upvote(id);
	};

	function downvote (color, id, downvotes, upvotes) {
		getVotes(downvotes, 'down', 'rgb(255, 165, 0)');
		downs = (downvotes + 1);
		event.target.style.color = color;

		console.log(ups);
		var upEl = $(event.target).parent().find('.fa-arrow-up');
		if (upEl.css('color') === 'rgb(0, 0, 255)') {
			// upEl.css({
			// 	'color': 'lightgray'
			// });
			console.log(ups);
			eraseVote(id, 'up', (ups - 1));
		}
		shareService.downvote(id);
	}

	function eraseVote (id, dir, votes) {
		var el = $(event.target).parent().find('.fa-arrow-' + dir);
		el.css({'color': 'lightgray'});
		$(event.target).parent().find('.' + dir +'vote-count').html(dir + 'votes: ' + votes);
		shareService.undovote(id);
	}

	return {
		vote: function (color, voted, id, upvotes, downvotes) {
		    if (voted === 'upvote' && (event.target.style.color === 'blue')) {
		    	eraseVote(id, 'up', upvotes);
		    } else if (voted === 'downvote' && (event.target.style.color === 'orange')) {
		    	eraseVote(id,'down', downvotes);
		    } else if (voted === 'upvote') {
		    	upvote(color, id, upvotes, downvotes);
		    } else if (voted === 'downvote') {
		    	downvote(color, id, downvotes, upvotes);
		    }
	    }
	};

}]);
