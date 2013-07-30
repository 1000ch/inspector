(function() {
	//inspector state of contentScript
	var isRunning = true;

	//listen message
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		isRunning = !!message.runningState;
		var inspectorSettings = message.inspectorSettings;
		if(!isRunning) {
			return;
		}
		if(HTMLInspector) {
			HTMLInspector.inspect(inspectorSettings);
			console.log("*** settings from message");
			console.log(inspectorSettings);
		}
	});

	//check "isRunning" at chrome storage,
	//if true is set, execute inspection.
	chrome.storage.local.get(["isRunning", "inspectorSettings"], function(items) {
		isRunning = !!items.isRunning;
		var inspectorSettings = items.inspectorSettings || {};
		if(!isRunning) {
			return;
		}
		ready(function() {
			HTMLInspector.inspect(inspectorSettings);
			console.log("*** settings from saved data");
			console.log(inspectorSettings);
		});
	});

	/**
	 * listen DOMContentLoaded
	 * @param {Function} callback
	 */
	function ready(callback) {
		if(["complete", "loaded", "interactive"].indexOf(document.readyState) !== -1) {
			callback.call(document);
		} else {
			document.addEventListener("DOMContentLoaded", function() {
				callback.call(document);
			});
		}
	}
})();
