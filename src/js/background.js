(function() {
	//this is master
	var settings = {isRunning: true};

	var settingKeys = Object.keys(settings);

	//check chrome storage and update icon.
	//if data is not set yet, set default settings.
	chrome.storage.local.get(settingKeys, function(items) {
		if(items.isRunning === undefined) {
			chrome.storage.local.set(settings, function() {
				//here is asynchronous i/o though, nothing to do.
			});
		} else {
			settings.isRunning = items.isRunning;
		}
		changeIconState(settings.isRunning);
	});

	//when a tab is activated,
	//update contentScript settings.
	chrome.tabs.onActivated.addListener(function(activeInfo) {
		//if active tab is changed
		changeIconState(settings.isRunning);

		//message object
		var message = {
			runningState: settings.isRunning
		};

		//update contentScript setting
		chrome.tabs.sendMessage(activeInfo.tabId, message, noop);
	});

	//when the icon is clicked
	chrome.browserAction.onClicked.addListener(function(tab) {
		if(!tab) {
			return;
		}
		//toggle flag to inspect
		settings.isRunning = !settings.isRunning;

		//save the flag
		chrome.storage.local.set(settings, noop);

		//change icon state
		changeIconState(settings.isRunning);

		//if state is changed to inspect, send message
		var message = {
			runningState: settings.isRunning
		};

		//send message
		chrome.tabs.sendMessage(tab.id, message, noop);
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
	 * noop function
	 */
	function noop() {}

})();