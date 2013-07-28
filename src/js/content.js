(function() {
	console.log("content.js");
	var option = settings || {};
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		if(message.command === "inspect" && HTMLInspector) {
			HTMLInspector.inspect(option);
		}
	});
	document.addEventListener("DOMContentLoaded", function() {
		console.log("DOMContentLoaded");
		if(HTMLInspector) {
			HTMLInspector.inspect(option);
		}
	});
})();
