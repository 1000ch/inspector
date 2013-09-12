(function() {
	//default settings
	var defaultInspectorSettings = {
		domRoot: "body",
		exclude: "iframe",
		excludeSubTree: []
	};

	var REPLACER = null;
	var SPACES = "    ";

	//copy settings
	var inspectorSettings = extend({}, defaultInspectorSettings);

	ready(function() {
		var settingTextarea = document.getElementById("inspectorOption");
		chrome.storage.sync.get(["inspectorSettings"], function(items) {
			if(items.inspectorSettings) {
				inspectorSettings = items.inspectorSettings;
			} else {
				chrome.storage.sync.set({inspectorSettings: defaultInspectorSettings}, noop);
			}
			settingTextarea.value = JSON.stringify(inspectorSettings, REPLACER, SPACES);
		});

		document.getElementById("defaultOption").addEventListener("click", function() {
			var btn = this;
			btn.setAttribute("disabled", "disabled");
			settingTextarea.setAttribute("disabled", "disabled");
			settingTextarea.value = JSON.stringify(defaultInspectorSettings, REPLACER, SPACES);
			settingTextarea.removeAttribute("disabled");
			btn.removeAttribute("disabled");
		});

		document.getElementById("reloadOption").addEventListener("click", function() {
			var btn = this;
			btn.setAttribute("disabled", "disabled");
			settingTextarea.setAttribute("disabled", "disabled");
			try {
				chrome.storage.sync.get(function(items) {
					if(items.inspectorSettings) {
						inspectorSettings = items.inspectorSettings;
					}
					settingTextarea.value = JSON.stringify(inspectorSettings, REPLACER, SPACES);
					settingTextarea.removeAttribute("disabled");
					btn.removeAttribute("disabled");
				});
			} catch(e) {
				console.log(e);
			}
		});

		document.getElementById("saveOption").addEventListener("click", function() {
			var btn = this;
			btn.setAttribute("disabled", "disabled");
			settingTextarea.setAttribute("disabled", "disabled");
			var settingText = settingTextarea.value;
			try {
				var settingJson = JSON.parse(settingText);
				chrome.storage.sync.set({inspectorSettings: settingJson}, function() {
					settingTextarea.removeAttribute("disabled");
					btn.removeAttribute("disabled");
				});
			} catch(e) {
				console.log(e);
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

	/**
	 * noop function
	 */
	function noop() {}

})();