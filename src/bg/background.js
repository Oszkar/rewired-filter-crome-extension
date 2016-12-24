chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
		if (request.query == "filteredusers") {
			var users = localStorage["filteredusers"];
			sendResponse({data: users});
		} else {
			console.error("Unknown query: " + request.query + " in background.js. Sending back empty string.");
			sendResponse({data: ""});
		}
	})