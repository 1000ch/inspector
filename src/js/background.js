(function() {
	//this is master
	var defaultInspectorSettings = {
		domRoot: "body",
		exclude: "iframe",
		excludeSubTree: []
	};
	var settings = {
		isRunning: true
	};

	extend(settings, {
		inspectorSettings: defaultInspectorSettings
	});

	var settingKeys = Object.keys(settings);

	//check chrome storage and update icon.
	//if data is not set yet, set default settings.
	chrome.storage.local.get(settingKeys, function(items) {
		if(items.isRunning === undefined) {
			chrome.storage.local.set({
				isRunning: true
			}, noop);
		} else {
			settings.isRunning = items.isRunning;
		}
		if(items.inspectorSettings === undefined) {
			chrome.storage.local.set({
				inspectorSettings: {
					domRoot: "body",
					exclude: "iframe",
					excludeSubTree: []
				}
			}, noop);
		} else {
			settings.inspectorSettings = items.inspectorSettings;
		}
		changeIconState(settings.isRunning);
	});

	//when a tab is activated,
	//update contentScript settings.
	chrome.tabs.onActivated.addListener(function(activeInfo) {
		//if active tab is changed
		changeIconState(settings.isRunning);

		syncInspectorSettings(function(inspectorSettings) {
			//message object
			var message = {
				runningState: settings.isRunning,
				inspectorSettings: settings.inspectorSettings
			};
			try {
				//update contentScript setting
				chrome.tabs.sendMessage(activeInfo.tabId, message, noop);
			} catch(e) {
				console.log(e);
			}
		});
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

		syncInspectorSettings(function(inspectorSettings) {
			//if state is changed to inspect, send message
			var message = {
				runningState: settings.isRunning,
				inspectorSettings: settings.inspectorSettings
			};

			//send message
			chrome.tabs.sendMessage(tab.id, message, noop);
		});
	});

	/**
	 * get newest inspector settings from chrome storage
	 * @param callback
	 */
	function syncInspectorSettings(callback) {
		chrome.storage.local.get(["inspectorSettings"], function(items) {
			if(items.inspectorSettings) {
				settings.inspectorSettings = items.inspectorSettings;
			} else {
				settings.inspectorSettings = defaultInspectorSettings;
				chrome.storage.local.set({
					inspectorSettings: defaultInspectorSettings
				}, noop);
			}
			callback(settings.inspectorSettings);
		});
	}

	/**
	 * set extension badge
	 * @param {Boolean} isRunning
	 */
	function changeIconState(isRunning) {
		var iconPath = "";
		var badgeText = "";
		if(isRunning) {
			iconPath = "/src/icon/badge_on.png";
			badgeText = "on";
		} else {
			iconPath = "/src/icon/badge_off.png";
			badgeText = "off";
		}
		chrome.browserAction.setIcon({
			path: iconPath
		}, noop);
		chrome.browserAction.setBadgeText({
			text: badgeText
		});
	}

	/**
	 * extend object
	 */
	function extend(obj, src) {
		for(var key in src) {
			if(src.hasOwnProperty(key) && src[key]) {
				obj[key] = src[key];
			}
		}
		return obj;
	}

	/**
	 * noop function
	 */
	function noop() {}

})();