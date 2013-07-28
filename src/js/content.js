(function() {
	//todo
	var inspectorOption = settings || {};

	//inspector state of contentScript
	var isRunning = true;

	//listen message
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		isRunning = !!message.runningState;
		if(isRunning) {
			if(message.command === "inspect" && HTMLInspector) {
				HTMLInspector.inspect(inspectorOption);
			}
		}
	});
	var stateArray = ["complete", "loaded", "interactive"];
	chrome.storage.local.get(["isRunning"], function(items) {
		isRunning = !!items.isRunning;
		if(isRunning) {
			if(stateArray.indexOf(document.readyState) !== -1) {
				if(HTMLInspector) {
					HTMLInspector.inspect(inspectorOption);
				}
			} else {
				document.addEventListener("DOMContentLoaded", function() {
					console.log("DOMContentLoaded");
					if(HTMLInspector) {
						HTMLInspector.inspect(inspectorOption);
					}
				});
			}
		}
	});
})();
