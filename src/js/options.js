(function() {
  /**
   * listen DOMContentLoaded
   * @param {Function} callback
   */
  function ready(callback) {
    if(["complete", "loaded", "interactive"].indexOf(document.readyState) !== -1) {
      callback.call(document);
    } else {
      document.addEventListener("DOMContentLoaded", callback);
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
    var textarea = document.getElementById("inspectorOption");
    var buttons = document.getElementById("js-buttons").getElementsByClassName("btn");

    chrome.storage.sync.get(["inspectorSettings"], function(items) {
      if(items.inspectorSettings) {
        inspectorSettings = items.inspectorSettings;
      } else {
        chrome.storage.sync.set({inspectorSettings: defaultInspectorSettings}, noop);
      }
      textarea.value = JSON.stringify(inspectorSettings, REPLACER, SPACES);
    });

    document.getElementById("defaultOption").addEventListener("click", function() {
      for(var i = 0, l = buttons.length;i < l;i++) {
        buttons[i].setAttribute("disabled", "disabled");
      }
      textarea.setAttribute("disabled", "disabled");
      textarea.value = JSON.stringify(defaultInspectorSettings, REPLACER, SPACES);
      textarea.removeAttribute("disabled");
      for(var i = 0, l = buttons.length;i < l;i++) {
        buttons[i].removeAttribute("disabled");
      }
    });

    document.getElementById("reloadOption").addEventListener("click", function() {
      for(var i = 0, l = buttons.length;i < l;i++) {
        buttons[i].setAttribute("disabled", "disabled");
      }
      textarea.setAttribute("disabled", "disabled");
      try {
        chrome.storage.sync.get(function(items) {
          if(items.inspectorSettings) {
            inspectorSettings = items.inspectorSettings;
          }
          textarea.value = JSON.stringify(inspectorSettings, REPLACER, SPACES);
        });
      } catch(e) {
        console.log(e);
      } finally {
        textarea.removeAttribute("disabled");
        for(var i = 0, l = buttons.length;i < l;i++) {
          buttons[i].removeAttribute("disabled");
        }
      }
    });

    document.getElementById("saveOption").addEventListener("click", function() {
      for(var i = 0, l = buttons.length;i < l;i++) {
        buttons[i].setAttribute("disabled", "disabled");
      }
      textarea.setAttribute("disabled", "disabled");
      var settingText = textarea.value;
      try {
        var settingJson = JSON.parse(settingText);
        chrome.storage.sync.set({inspectorSettings: settingJson}, function() {
          textarea.removeAttribute("disabled");
          for(var i = 0, l = buttons.length;i < l;i++) {
            buttons[i].removeAttribute("disabled");
          }
        });
      } catch(e) {
        console.log(e);
      } finally {
        textarea.removeAttribute("disabled");
        for(var i = 0, l = buttons.length;i < l;i++) {
          buttons[i].removeAttribute("disabled");
        }
      }
    });
  });
})();