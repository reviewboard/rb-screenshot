// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

// Listens to messages from other scripts. Executes commands based on message.
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
    case 'user-info':
        chrome.tabs.create({'url': chrome.extension.getURL('users.html')});
    case 'update':
        break;
    default:
        alert('Unmatched request from script to background 1');
        // Todo: Add request to above string
    }
});

function tabScreenshotEntire() {
    chrome.tabs.getCurrent(function (tab) {

    });
}

// Take screenshot of all visible web content.
function tabScreenshot(area) {
    chrome.tabs.captureVisibleTab(function (screenshotUrl) {
        var tabUrl = chrome.extension.getURL('screenshot.html?id=' + id++);
        var targetTabId = null;

        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId != targetTabId || changeInfo.status != 'complete') {
                return;
            }
            chrome.tabs.onUpdated.removeListener(listener);

            // May have to move out of here when other screenshot functions added
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
            if (area) {
                view.screenshot.setCrop();
            }
        });

        // Get tabId for the screenshot.html tab
        chrome.tabs.create({url: tabUrl}, function(tab) {
            targetTabId = tab.id;
        });
    });
}

function setListeners(screenshotView) {
    // Sets a listener for the server dropdown box
    var document = screenshotView.document;
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.addEventListener("change", function() {
        // sets the username span in option bar and review requests dropdown
        setInfo(screenshotView);
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        // updates server select when new server added
        setInfo(screenshotView);
    });

    var send = document.getElementById('send-button');
    send.addEventListener('click', function() {
        chrome.storage.sync.get('userInfo', function(obj) {
            if (Object.keys(obj).length != 0) {
                var selectedValue = screenshotView.screenshot.getServerValue()
                var reviewRequest = screenshotView.screenshot.getReviewId();
                var screenshotUri = screenshotView.screenshot.getScreenshotUri();

                var userInfo = obj['userInfo'];
                var server = userInfo[selectedValue].serverUrl;
                var username = userInfo[selectedValue].username;
                var apiKey = userInfo[selectedValue].apiKey;

                screenshotView.screenshot.postScreenshot(server, username, apiKey, reviewRequest,
                                                         screenshotUri);
            }
        });
    });
}

function setInfo(screenshotView) {
    // Sets information in screenshot.html whenever server dropdown value changes
    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj).length != 0) {
            var userInfo = obj['userInfo'];
            var serverId = screenshotView.screenshot.getServerValue();
            var serverUrl = userInfo[serverId].serverUrl;
            var username = userInfo[serverId].username;

            screenshotView.screenshot.setUsername(username);
            screenshotView.screenshot.reviewRequests(serverUrl, username);
        }
    });
}

function setServers(screenshotView) {
    // Set screenshot.html server dropdown with saved servers information
    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj).length != 0) {
            var userInfo = obj['userInfo'];
            screenshotView.screenshot.setServers(userInfo);
            setInfo(screenshotView);
        }
    });

}

function saveNewUserInfo(serverUrl, apiKey, username) {
    // Saves user information when submitted through add user form
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