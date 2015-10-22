// Variable to keep an id for when user opens multiple screenshot tabs.
var id = 1;

// Listens to messages from other scripts. Executes commands based on message.
chrome.runtime.onMessage.addListener(function(request, sender, response) {
    switch (request.option) {
    case 'all-webcontent':
        tab_screenshot();
        break;
    case 'save_info':
        save_new_user_info(request.server_url, request.api_key, request.username);
        break;
    case 'update':
        break;
    default:
        alert('Unmatched request from script to background 1');
        // Todo: Add request to above string
    }
});

// Take screenshot of all visible web content.
function tab_screenshot() {
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
                    var server_id = view.screenshot.getServerValue();
                    view.screenshot.setScreenshotUrl(screenshotUrl);
                    set_listeners(view);
                    set_servers(view);
                    set_info(server_id, view);
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

function set_listeners(screenshot_view) {
    // Sets a listener for the server dropdown box
    var document = screenshot_view.document;
    var server_dropdown = document.getElementById('account-select');
    server_dropdown.addEventListener("change", function() {
        // sets the username span in option bar and review requests dropdown
        set_info(server_dropdown.options[server_dropdown.selectedIndex].value,
                 screenshot_view);
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        // updates server select when new server added
        set_info(server_dropdown.options[server_dropdown.selectedIndex].value,
                 screenshot_view);
    });
}

function set_info(server_id, screenshot_view) {
    // Sets information in screenshot.html whenever server dropdown value changes
    chrome.storage.sync.get('user_info', function(obj) {
        if (obj) {
            var user_info = obj['user_info'];
            var server_url = user_info[server_id].server_url;
            var username = user_info[server_id].username;

            screenshot_view.screenshot.setUsername(username);
            screenshot_view.screenshot.reviewRequests(server_url, username);
        }
    });
}

function set_servers(screenshot_view) {
    // Set screenshot.html server dropdown with saved servers information
    chrome.storage.sync.get('user_info', function(obj) {
        if (Object.keys(obj).length != 0) {
            var user_info = obj['user_info'];
            screenshot_view.screenshot.setServers(user_info);
        }
    });

}

function save_new_user_info(server_url, api_key, username) {
    // Saves user information when submitted through add_user.html form
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
        chrome.runtime.sendMessage({option: 'update'});
    });
}