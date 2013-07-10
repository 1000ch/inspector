(function() {
	var option = settings || {};
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		if(message.command === "inspect" && HTMLInspector) {
			HTMLInspector.inspect(option);
		}
	});
})();
