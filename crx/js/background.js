// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  switch (request.option) {
    case 'all-webcontent':
        tab_screenshot();
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