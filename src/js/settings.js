(function() {
	//default settings
	var defaultInspectorSettings = {
		domRoot: "body",
		exclude: "iframe",
		excludeSubTree: []
	};

	//copy settings
	var inspectorSettings = extend({}, defaultInspectorSettings);

	ready(function() {
		var settingTextarea = document.getElementById("inspectorOption");
		chrome.storage.local.get(["inspectorSettings"], function(items) {
			if(items.inspectorSettings) {
				inspectorSettings = items.inspectorSettings;
			}
			settingTextarea.value = JSON.stringify(inspectorSettings, null, "    ");
		});

		document.getElementById("defaultOption").addEventListener("click", function() {
			settingTextarea.value = JSON.stringify(defaultInspectorSettings, null, "    ");
		});

		document.getElementById("reloadOption").addEventListener("click", function() {
			chrome.storage.local.get(function(items) {
				if(items.inspectorSettings) {
					inspectorSettings = items.inspectorSettings;
				}
				settingTextarea.value = JSON.stringify(inspectorSettings, null, "    ");
			});
		});

		document.getElementById("saveOption").addEventListener("click", function() {
			var settingText = settingTextarea.value;
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

	/**
	 * extend object
	 * @param {Object} obj
	 * @param {Object} src
	 */
	function extend(obj, src) {
		for(var key in src) {
			if(src.hasOwnProperty(key)) {
				obj[key] = src[key];
			}
		}
		return obj;
	}
})();