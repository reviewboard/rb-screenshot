var id = 100;

function tab_screenshot() {

    chrome.tabs.captureVisibleTab(function(screenshotURL) {
        var viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++);
        var targetId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
            if (tabId != targetId || changedProps.status != "complete") {

                return;
            }

            return tabId;

            // TODO:: FINISH TAB_SCREENSHOT
        });
    });
}