// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    switch (request.option) {
    case 'all-webcontent':
        tab_screenshot();
        break;
    case 'save_info':
        save_info(request.server_url, request.api_key, request.username);
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
                    var server_id = view.screenshot.getServerValue();
                    view.screenshot.setScreenshotUrl(screenshotUrl);
                    set_listener(view);
                    set_servers(view);
                    set_user(server_id, view);
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

function set_listener(screenshot_view) {
    // Sets a listener for the server dropdown box
    var document = screenshot_view.document;
    var server_dropdown = document.getElementById('account-select');
    server_dropdown.addEventListener("change", function() {
        set_user(server_dropdown.options[server_dropdown.selectedIndex].value,
                 screenshot_view);
    });
}

function set_user(server_id, screenshot_view) {
    if (server_id != 'new') {
        chrome.storage.sync.get('user_info', function(obj) {
            var user_info = obj['user_info'];
            var username = user_info[server_id].username;
            var username_text = screenshot_view.document.getElementById('username');
            username_text.innerHTML = "Username: " + username;
        });
    }
}

function set_servers(screenshot_view) {
    var user_dropdown = screenshot_view.document.getElementById('account-select');

    chrome.storage.sync.get('user_info', function(obj) {
        if (Object.keys(obj).length != 0) {
            var user_info = obj['user_info'];
            for (var i = 0; i < user_info.length; i++) {
                var option = document.createElement('option');
                option.value = i;
                option.text = user_info[i].server_url;
                user_dropdown.add(option);
            }
        }
    });

}

function save_info(server_url, api_key, username) {
    chrome.storage.sync.get('user_info', function(obj) {
        var user_info;
        if (Object.keys(obj).length == 0) {
            user_info = [{
                api_key: api_key,
                username: username,
                server_url: server_url
            }];

            chrome.storage.sync.set({'user_info': user_info});

        } else {
            user_info = obj['user_info'];
            user_info.push({
                api_key: api_key,
                username: username,
                server_url: server_url
            });

            chrome.storage.sync.set({'user_info': user_info});
        }
    });
}