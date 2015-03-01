app.factory('VoteFactory', function () {
	
	function upvote (color) {		
		console.log($(this));
		event.target.style.color = color;
		var downEl = $(event.target).parent().find('.fa-arrow-down')
		console.log(downEl.css('color'))
		if (downEl.css('color') === 'rgb(255, 165, 0)') {
			console.log('hey')
			downEl.css({
				'color': 'lightgray'
			});
		};
		// function that accesses a function in Ashley's code to upvote
	}

	function downvote (color) {
		console.log('test1');
		event.target.style.color = color;
		var downEl = $(event.target).parent().find('.fa-arrow-up')
		console.log(downEl.css('color'))
		if (downEl.css('color') === 'rgb(0, 0, 255)') {
			console.log('hey')
			downEl.css({
				'color': 'lightgray'
			});
		};
		// function that accesses a function in Ashley's code to downvote
	}

	function eraseVote () {
		console.log('try again');
		event.target.style.color = 'lightgray';
		// function that accesses a function in Ashley's code to erase vote
	}

	return {
		vote: function (color, voted) {
		  	// document.querySelector(el).onclick = function () {
			  	
			  // }
			  console.log($(this));
		    if (voted === 'upvote' && (event.target.style.color === 'blue')) {
		    	eraseVote();
		    } else if (voted === 'downvote' && (event.target.style.color === 'orange')) {
		    	eraseVote();
		    } else if (voted === 'upvote') {
		    	upvote(color);
		    } else if (voted === 'downvote') {
		    	downvote(color);
		    } 
	    }
	};

});