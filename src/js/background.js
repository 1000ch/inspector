(function() {
	//this is global
	var settings = {isRunning: true};
	chrome.storage.local.get(Object.keys(settings), function(items) {
		if(items.isRunning === undefined) {
			chrome.storage.local.set(settings, function() {
				//here is asynchronous i/o though, don't mind.
			});
		} else {
			settings.isRunning = items.isRunning;
		}
		changeIconState(settings.isRunning);
	});

	chrome.tabs.onActivated.addListener(function(activeInfo) {
		//if active tab is changed
		changeIconState(settings.isRunning);

		var message = {
			runningState: settings.isRunning
		};

		//update contentScript setting
		chrome.tabs.sendMessage(activeInfo.tabId, message, noop);
	});

	chrome.browserAction.onClicked.addListener(function(tab) {
		if(tab) {
			//toggle flag to inspect
			settings.isRunning = !settings.isRunning;

			//save the flag
			chrome.storage.local.set(settings, noop);

			//change icon state
			changeIconState(settings.isRunning);

			//if state is changed to inspect, send message
			var message = {
				runningState: settings.isRunning,
				command: "inspect"
			};

			//send message
			chrome.tabs.sendMessage(tab.id, message, noop);
		}
	});

	/**
	 * set extension badge
	 * @param {Boolean} isRunning
	 */
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

	/**
	 * noop
	 */
	function noop() {}

})();