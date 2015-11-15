var { ToggleButton } = require('sdk/ui/button/toggle');
var { Cc, Ci } = require('chrome');
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var panels = require('sdk/panel');
var pageMod = require('sdk/page-mod');
var ss = require('sdk/simple-storage');

var button = ToggleButton({
    id: "reviewboard-icon",
    label: "Review Board Screenshot Tool",
    icon: {
        "16": "./images/icons/icon16.png",
        "32": "./images/icons/icon32.png",
        "64": "./images/icons/icon64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    height: 175,
    width: 175,
    contentURL: self.data.url("popup.html"),
    contentScriptFile: self.data.url("js/popup.js"),
    contentScriptWhen: 'ready',
    onHide: handleHide
});

pageMod.PageMod({
  include: 'chrome://rb-screenshot/content/screenshot.html',
  contentScriptFile: ['./js/save_user.js',
                      './js/user_form.js'],
  onAttach: function(worker) {
    worker.port.on('save-info', function(userInfo) {
        if (ss.storage.userInfo) {
            ss.storage.userInfo.push({
                apiKey: userInfo.apiKey,
                username: userInfo.username,
                serverUrl: userInfo.serverUrl
            });
        } else {
            ss.storage.userInfo = [{
                apiKey: userInfo.apiKey,
                username: userInfo.username,
                serverUrl: userInfo.serverUrl
            }];
        }
        worker.port.emit('update');
    });
  }
});

pageMod.PageMod({
    include: 'chrome://rb-screenshot/content/users.html',
    contentScriptFile: ['./js/modify_users.js'],
    onAttach: function(worker) {
        worker.port.on('send-users', function() {
            worker.port.emit('users', ss.storage.userInfo);
        });

        worker.port.on('modify-users', function(users) {
            ss.storage.userInfo = users;
            worker.port.emit('success');
        });
    }
});

panel.port.on('capture-all-content', function() {
    setScreenshot(false);
});

panel.port.on('capture-area', function() {
    setScreenshot(true);
});

panel.port.on('user', function() {
    tabs.open('chrome://rb-screenshot/content/users.html');
});

panel.port.on('close', function() {
    panel.hide();
});

function setScreenshot(area) {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
             .getService(Ci.nsIWindowMediator);
    var gBrowser = wm.getMostRecentWindow("navigator:browser").gBrowser;
    var window = gBrowser.contentWindow;
    var document = window.document;
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;

    var ctx = canvas.getContext('2d');
    ctx.drawWindow(window, 0, 0, canvas.width, canvas.height, 'rgb(255,255,255)');

    var dataUrl = canvas.toDataURL();

    // Below may need to be refactored when other screenshot features added
    var tab = gBrowser.addTab('chrome://rb-screenshot/content/screenshot.html');
    gBrowser.selectedTab = tab;
    var newTabBrowser = gBrowser.getBrowserForTab(tab);
    newTabBrowser.addEventListener("load", function() {
        newTabBrowser.contentWindow.screenshot.setScreenshotUrl(dataUrl, false);
        setListeners(newTabBrowser);
        setServers(newTabBrowser);

        if (area) {
            newTabBrowser.contentWindow.screenshot.setCrop();
        }
    }, true);
}

function setListeners(browser) {
    // Listens to change in server dropbox and updates values
    var serverDropdown = browser.contentDocument.getElementById('account-select');
    serverDropdown.addEventListener('change', function() {
        setInfo(browser);
    });

    var form = browser.contentDocument.getElementById('user-form');
    form.addEventListener('update', function() {
        // updates server select when new server added
        setInfo(browser);
    });

    var send = browser.contentDocument.getElementById('send-button');
    send.addEventListener('click', function() {
        if(ss.storage.userInfo) {
            var screenshot = browser.contentWindow.screenshot;
            var selectedValue = screenshot.getServerValue();
            var userInfo = ss.storage.userInfo[selectedValue];
            var reviewRequest = screenshot.getReviewId();
            var screenshotUri = screenshot.getScreenshotUri();

            var serverUrl = userInfo.serverUrl;
            var username = userInfo.username;
            var apiKey = userInfo.apiKey;

            screenshot.postScreenshot(serverUrl, username, apiKey, reviewRequest,
                                      screenshotUri);
        }
    });
}

function setInfo(browser) {
    var serverDropdown = browser.contentDocument.getElementById('account-select');
    var index = serverDropdown.options[serverDropdown.selectedIndex].value;
    var userInfo = ss.storage.userInfo[index];

    browser.contentWindow.screenshot.setUsername(userInfo.username);
    browser.contentWindow.screenshot.reviewRequests(userInfo.serverUrl, userInfo.username);
}

function setServers(browser) {
    var serverDropdown = browser.contentDocument.getElementById('account-select');
    var userInfo = ss.storage.userInfo;
    if (userInfo) {
        browser.contentWindow.screenshot.setServers(userInfo);
        setInfo(browser);
    }
}

function handleChange(state) {
    if(state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}