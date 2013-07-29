(function() {
	//todo
	var inspectorSettings = inspectorSettings || {};

	//inspector state of contentScript
	var isRunning = true;

	//listen message
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		isRunning = !!message.runningState;
		if(!isRunning) {
			return;
		}
		if(HTMLInspector) {
			HTMLInspector.inspect(inspectorSettings);
		}
	});

	//ready state
	var stateArray = ["complete", "loaded", "interactive"];

	//check "isRunning" at chrome storage,
	//if true is set, execute inspection.
	chrome.storage.local.get(["isRunning"], function(items) {
		isRunning = !!items.isRunning;
		if(!isRunning) {
			return;
		}
		if(stateArray.indexOf(document.readyState) !== -1) {
			if(HTMLInspector) {
				HTMLInspector.inspect(inspectorSettings);
			}
		} else {
			document.addEventListener("DOMContentLoaded", function() {
				if(HTMLInspector) {
					HTMLInspector.inspect(inspectorSettings);
				}
			});
		}
	});
})();
