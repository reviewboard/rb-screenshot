// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  switch (request.option) {
    case 'all-webcontent':
        tab_screenshot();
        break;
    case 'save_info':
        save_info(request.server_url, request.api_key);
        break;
    default:
        alert('Unmatched request from script to background');
        // Todo: Add request to above string
  }
});

function tab_screenshot() {
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    var tabUrl = chrome.extension.getURL('screenshot.html?id=' + id++);
    var targetTabId = null;

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId != targetTabId || changeInfo.status != 'complete') {
        return;
      }
      chrome.tabs.onUpdated.removeListener(listener);

      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view.location.href == tabUrl) {
          view.setScreenshotUrl(screenshotUrl);
          set_users(view);
          break;
        }
      }
    });

    // Get tabId for the screenshot.html tab
    chrome.tabs.create({url: tabUrl}, function(tab) {
      targetTabId = tab.id;
    });
  });
}

function set_users(screenshot_view) {
  var user_dropdown = screenshot_view.document.getElementById('account-select');
  
  chrome.storage.sync.get('user_info', function(obj) {
    if (Object.keys(obj).length != 0) {
      var user_info = obj['user_info'];
      for (var i = 0; i < user_info.length; i++) {
        var option = document.createElement('option');
        option.text = user_info[i].server_url;
        user_dropdown.add(option);
      }
    }
  });

}

function save_info(server_url, api_key) {
  chrome.storage.sync.get('user_info', function(obj) {
    if (Object.keys(obj).length == 0) {
      var user_info = [{
        server_url: server_url,
        api_key: api_key
      }];

      chrome.storage.sync.set({'user_info': user_info});

    } else {
      var user_info = obj['user_info'];
      user_info.push({
        server_url: server_url,
        api_key: api_key
      });

      chrome.storage.sync.set({'user_info': user_info});
    }
  }); 
}