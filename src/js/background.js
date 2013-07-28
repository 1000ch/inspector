(function() {
	//this is global
	var settingKey = "inspector.isRunning";
	var isRunning = localStorage.getItem(settingKey) || true;
	console.log("background.js is executed");
	console.log("settingKey is " + localStorage.getItem(settingKey));
	changeIconState(isRunning);

	chrome.tabs.onActivated.addListener(function(activeInfo) {
		console.log("chrome.tabs.onActivated");
		//if active tab is changed
		changeIconState(isRunning);
	});

	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tab) {
			//toggle flag to inspect
			isRunning = !isRunning;

			//save the flag
			localStorage.setItem(settingKey, isRunning);

			//change icon state
			changeIconState(isRunning);

			//if state is changed to inspect, send message
			if(isRunning) {
				var message = {
					command: "inspect"
				};
				chrome.tabs.connect(tab.id);
				chrome.tabs.sendMessage(tab.id, message, function(response) {});
			}
		}
	});

	function changeIconState(isRunning) {
		if(isRunning) {
			chrome.browserAction.setIcon({
				path: "/src/icon/badge_on.png"
			}, function() {});
			chrome.browserAction.setBadgeText({
				text: "on"
			});
		} else {
			chrome.browserAction.setIcon({
				path: "/src/icon/badge_off.png"
			}, function() {});
			chrome.browserAction.setBadgeText({
				text: "off"
			});
		}
	}
})();