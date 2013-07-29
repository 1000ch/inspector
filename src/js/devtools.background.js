(function() {
	//alias
	var panels = chrome.devtools.panels;

	//create panel
	var inspectorPanel = panels.create("H:inspector", "/src/icon/icon_128.png", "/src/html/panel.html", function(panel) {
		panel.onShown.addListener(function(window) {

		});
	});
})();