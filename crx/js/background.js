/**
 * Id of the screenshot.html tab. Increments by 1 each time
 * a new screenshot tab is created.
 */
var id = 1;

/**
 * Listens to messages from other scripts.
 */
chrome.runtime.onMessage.addListener(function(request, sender, response) {
    switch (request.option) {
    case 'visible-content':
        tabScreenshot(false);
        break;
    case 'save-info':
        saveNewUserInfo(request.serverUrl, request.apiKey, request.username);
        break;
    case 'area':
        tabScreenshot(true);
        break;
    case 'all-content':
        chrome.tabs.executeScript(null, {
            file: 'js/all_content.js'
        });
        break;
    case 'user':
        var tabUrl = chrome.extension.getURL('users.html');
        chrome.tabs.create({url: tabUrl});
        break;
    case 'update':
        break;
    default:
        console.log('Unmatched request from script to background 1');
    }
});

/**
 * Takes a screenshot of all visible content in the browser. Optionally
 * sets the crop handles on the screenshot.
 *
 * @paramas crop (Boolean) - Boolean specifying if crop handles should be set.
 */
function tabScreenshot(crop) {
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
                    view.screenshot.setScript();
                    setListeners(view);
                    setServers(view);
                    view.screenshot.setScreenshotUrl(screenshotUrl, true);
                    break;
                }
            }
            if (crop) {
                view.screenshot.setCrop();
            }
        });

        chrome.tabs.create({url: tabUrl}, function(tab) {
            targetTabId = tab.id;
        });
    });
}

/**
 * Sets listeners for elements that require saved Chrome browser data.
 *
 * @paramas view (ViewType) - View for the screenshot tab.
 */
function setListeners(view) {
    var document = view.document;
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.addEventListener("change", function() {
        setInformation(view);
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        setInformation(view);
    });

    var send = document.getElementById('send-button');
    send.addEventListener('click', function() {
        chrome.storage.sync.get('userInfo', function(obj) {
            if (Object.keys(obj).length != 0) {
                var selectedValue = view.screenshot.getServerValue()
                var reviewRequest = view.screenshot.getReviewId();
                var screenshotUri = view.screenshot.getScreenshotUri();

                var userInfo = obj['userInfo'];
                var server = userInfo[selectedValue].serverUrl;
                var username = userInfo[selectedValue].username;
                var apiKey = userInfo[selectedValue].apiKey;

                view.screenshot.postScreenshot(server, username, apiKey, reviewRequest,
                                                         screenshotUri);
            }
        });
    });
}

/**
 * Sets username and review requests associated with a server.
 *
 * @paramas view (ViewType) - View for the screenshot tab.
 */
function setInformation(view) {
    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj).length != 0) {
            var userInfo = obj['userInfo'];
            var serverId = view.screenshot.getServerValue();
            var serverUrl = userInfo[serverId].serverUrl;
            var username = userInfo[serverId].username;

            view.screenshot.setUsername(username);
            view.screenshot.reviewRequests(serverUrl, username);
        }
    });
}

/**
 * Fill server select with saved account information.
 *
 * @paramas view (ViewType) - View for the screenshot tab.
 */
function setServers(view) {
    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj).length != 0) {
            var userInfo = obj['userInfo'];

            view.screenshot.setServers(userInfo);
            setInformation(view);
        }
    });

}

/**
 * Saves new user information submitted through the "add user" button
 * form.
 *
 * @paramas serverUrl (String) - Server URL to save.
 * @paramas apiKey (String) - API Key to save.
 * @paramas username (String) - Username to save.
 */
function saveNewUserInfo(serverUrl, apiKey, username) {
    chrome.storage.sync.get('userInfo', function(obj) {
        var userInfo;

        if (Object.keys(obj).length == 0) {
            userInfo = [{
                apiKey: apiKey,
                username: username,
                serverUrl: serverUrl
            }];

            chrome.storage.sync.set({'userInfo': userInfo});
        } else {
            userInfo = obj['userInfo'];
            userInfo.push({
                apiKey: apiKey,
                username: username,
                serverUrl: serverUrl
            });

            chrome.storage.sync.set({'userInfo': userInfo});
        }

        chrome.runtime.sendMessage({option: 'update'});
    });
}