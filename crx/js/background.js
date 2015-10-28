// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

// Listens to messages from other scripts. Executes commands based on message.
chrome.runtime.onMessage.addListener(function(request, sender, response) {
    switch (request.option) {
    case 'all-webcontent':
        tabScreenshot();
        break;
    case 'save-info':
        saveNewUserInfo(request.serverUrl, request.apiKey, request.username);
        break;
    case 'area':
        tabScreenshot('area');
        break;
    case 'update':
        break;
    default:
        alert('Unmatched request from script to background 1');
        // Todo: Add request to above string
    }
});

// Take screenshot of all visible web content.
function tabScreenshot(type) {
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
                    var serverId = view.screenshot.getServerValue();
                    view.screenshot.setScreenshotUrl(screenshotUrl);
                    view.screenshot.setScript();
                    setListeners(view);
                    setServers(view);
                    setInfo(serverId, view);

                    if (type == 'area') {
                        view.screenshot.setCrop();
                    }
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

function setListeners(screenshotView) {
    // Sets a listener for the server dropdown box
    var document = screenshotView.document;
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.addEventListener("change", function() {
        // sets the username span in option bar and review requests dropdown
        setInfo(serverDropdown.options[serverDropdown.selectedIndex].value,
                screenshotView);
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        // updates server select when new server added
        setInfo(serverDropdown.options[serverDropdown.selectedIndex].value,
                screenshotView);
    });

    var send = document.getElementById('send-button');
    send.addEventListener('click', function() {
        chrome.storage.sync.get('userInfo', function(obj) {
            if (Object.keys(obj).length != 0) {
                var selectedValue = serverDropdown.options[serverDropdown.selectedIndex].value;
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

function setInfo(serverId, screenshotView) {
    // Sets information in screenshot.html whenever server dropdown value changes
    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj).length != 0) {
            var userInfo = obj['userInfo'];
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