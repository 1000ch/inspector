(function() {
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

  var settings = {
    isRunning: true,
    inspectorSettings: null
  };

  var settingKeys = Object.keys(settings);

  //check chrome storage and update icon.
  //if data is not set yet, set default settings.
  chrome.storage.sync.get(settingKeys, function(items) {
    if(items.isRunning === undefined) {
      chrome.storage.sync.set({isRunning: true}, noop);
    } else {
      settings.isRunning = items.isRunning;
    }
    changeIconState(settings.isRunning);
  });

  //when the icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab) {
      return;
    }
    //toggle flag to inspect
    settings.isRunning = !settings.isRunning;

    //save the flag
    chrome.storage.sync.set(settings, noop);

    //change icon state
    changeIconState(settings.isRunning);

    fetchInspectorSettings(function(inspectorSettings) {
      //if state is changed to inspect, send message
      sendMessage(tab.id, settings.isRunning, settings.inspectorSettings, noop);
    });
  });

  /**
   * send message to tab
   * @param {Number} tabId
   * @param {Boolean} isRunning
   * @param {Object} inspectorSettings
   * @param {Function} callback
   */
  function sendMessage(tabId, isRunning, inspectorSettings, callback) {
    try {
      chrome.tabs.sendMessage(tabId, {
        runningState: isRunning,
        inspectorSettings: inspectorSettings
      }, function(data) {
        console.debug(data);
      });
    } catch(e) {
      console.log(e);
    }
  }

  /**
   * get newest inspector settings from chrome storage
   * @param {Function} callback
   */
  function fetchInspectorSettings(callback) {
    //get inspectorSettings from chrome storage
    //if settings are not saved, set default value
    chrome.storage.sync.get(["inspectorSettings"], function(items) {
      if(items.inspectorSettings) {
        settings.inspectorSettings = items.inspectorSettings;
      } else {
        settings.inspectorSettings = defaultInspectorSettings;
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
      iconPath = "/icon/badge_on.png";
      badgeText = "on";
    } else {
      iconPath = "/icon/badge_off.png";
      badgeText = "";
    }
    chrome.browserAction.setIcon({
      path: iconPath
    }, noop);
    chrome.browserAction.setBadgeText({
      text: badgeText
    });
  }
})();