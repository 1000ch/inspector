(function() {
	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tab) {
			var message = {
				command: "inspect"
			};
			chrome.tabs.connect(tab.id);
			chrome.tabs.sendMessage(tab.id, message, function(response) {});
		}
	});
})();