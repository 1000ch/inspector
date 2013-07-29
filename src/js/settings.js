(function() {
	var defaultInspectorSettings = {
		domRoot: "body",
		exclude: "iframe",
		excludeSubTree: []
	};

	var inspectorSettings = extend({}, defaultInspectorSettings);

	ready(function() {
		var settingArea = document.getElementById("inspectorOption");
		chrome.storage.local.get(function(items) {
			if(items.inspectorSettings) {
				inspectorSettings = items.inspectorSettings;
			}
			settingArea.value = JSON.stringify(inspectorSettings);
		});

		document.getElementById("defaultOption").addEventListener("click", function() {
			settingArea.value = JSON.stringify(defaultInspectorSettings);
		});

		document.getElementById("reloadOption").addEventListener("click", function() {
			chrome.storage.local.get(function(items) {
				if(items.inspectorSettings) {
					inspectorSettings = items.inspectorSettings;
				}
				settingArea.value = JSON.stringify(inspectorSettings);
			});
		});

		document.getElementById("saveOption").addEventListener("click", function() {
			var settingText = settingArea.value;
			try {
				var settingJson = JSON.parse(settingText);
				chrome.storage.local.set({
					inspectorSettings: settingJson
				});
			} catch(e) {
				alert(e);
			}
		});
	});

	/**
	 * listen DOMContentLoaded
	 * @param callback
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
})();