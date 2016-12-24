chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		chrome.runtime.sendMessage({query: "filteredusers"}, function(response) {
			// parse every username from the response
			var toRemoveUserNames = [];
  			response.data.split(',').forEach(function(item) { toRemoveUserNames.push(item); })

  			// below, we will separately remove the posts from the content pages and the topics fromthe main page and the usernames from the statistics page
			// we handle these cases differently as we can only rely on the DOM and the DOM is very different in the content page and main page
			// the three loops are not the most efficient, but there will be probably only a few items in the list and who cares about efficiency on the web in 2016 anyways
			// TODO even handled separately, post removal might be done a bit simpler

			// ----------------------------------------------------
			// Region: removal of actual user posts from the boards
			// ----------------------------------------------------
			var removedPostIds = [];

			// go through every username to filter
			toRemoveUserNames.forEach(function(name) {
				// remove the user's post
				// we'll lok for the user's name in the author pane where the user name and the profile url is stored
				// use the '"/users/...."' profile url for filtering as it is more safe than simply the user name (users can have other user ids in ther names as substrings) 
				var userString = "/users/" + name + "\"";
				$(".author-pane-line.author-name").each(function(index, element) {
					var text = $(element).html().toLowerCase();
					if(text.indexOf(userString) != -1) {
						// the post is several levels above from the author-pane
						var ancestor = $(element).parent().parent().parent().parent().parent().parent()[0];
						var id = ancestor.id.match(/\d+/g)[0];
						console.log("Removing post ID #" + id);
						// store the removed post ID so we can remove the answers to this post later
						removedPostIds.push(id);					
						ancestor.remove();
					}
				});

				// remove answers to previously removed user post
				var userReplyString = "@" + name + ")";
				$(".forum-in-reply-to").each(function(index, element) {
					// the reply header will contain the user name in the url that points to the original post
					var text = $(element).html().toLowerCase();
					// the reply header will also contain the comment-id which this reply points to
					var regex = /(?:-)(\d*)(?:")/g
					var pointedId = regex.exec(text)[1];
					if(text.toLowerCase().indexOf(userReplyString) != -1) {
						// the post is several levels above from the author-pane
						var granpa = $(element).parent().parent()[0];
						var granpaid = granpa.id.match(/\d+/g)[0];
						console.log("Removing post ID #" + granpaid + " (reply to #" + pointedId + ")");
						granpa.remove();
					}
				});
			});

			// -------------------------------------------------------------
			// Region: removal of user names from the bottom statistics pane
			// -------------------------------------------------------------

			// go through every username to filter
			toRemoveUserNames.forEach(function(name) {
				// username class is on every username href on the main page
				$(".username").each(function(index, element) {
					// text is the actual username that this href points to
					var text = $(element).html().toLowerCase();
					if(text === name) {
						if ($(element).parents('.forum-statistics-sub-body').length) {
							// then we are in the statistics pane and have to remove this href but not any of its parents
							console.log("Removing a user name from the bottom statistics panel");
							element.remove();
						}
					}
				});
			});

			// ---------------------------------------------------------------------------------------
			// Region: removal of topics from recents and favorites where the user has the latest post
			// ---------------------------------------------------------------------------------------

			// go through every username to filter
			toRemoveUserNames.forEach(function(name) {
				// username class is on every username href on the main page
				$(".username").each(function(index, element) {
					// text is the actual username that this href points to
					var text = $(element).html().toLowerCase();
					if(text === name) {
						// the grandpa element wil be the main container of the latest topic post
						var granpa = $(element).parent().parent();

						// for favorites and recents, the title of the actual topic is in a bit different places
						var recentTitle = granpa.children(".views-field.views-field-title").children(".topik")[0];
						var favoriteTitle = granpa.children(".views-field").children()[0];
						var forumTitle = granpa.children(".forum-details").children(".forum-name").children()[0];
						
						if (recentTitle) {
							// this case, it was a recent topic the user posted in
							console.log("Removing topic \"" + $(recentTitle).text() + "\" from recents because of filtered a user");
						} else if (favoriteTitle) {
							// this case, it is a topic in the 'favorites' lists
							console.log("Removing topic \"" + $(favoriteTitle).text() + "\" from favorites because of filtered a user");
						} else if (forumTitle) {
							// this case, it is a topic in the 'favorites' lists
							console.log("Removing forum \"" + $(forumTitle).text() + "\" from the main board because of filtered a user");
						} else {
							// this case, it is a topic in the 'favorites' lists
							console.log("Whoops removing something unknown. This is either a bug or you are filtering yourself.");
							console.log("Removed element:");
							console.log(granpa);
							console.log(element);
						}
						granpa.remove();
					}
				});
			});
		});
	}
	}, 10);
});