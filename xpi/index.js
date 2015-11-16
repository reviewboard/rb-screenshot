var { ToggleButton } = require('sdk/ui/button/toggle');
var { Cc, Ci } = require('chrome');
var crop = false;
var dataUrl;
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var panels = require('sdk/panel');
var pageMod = require('sdk/page-mod');
var ss = require('sdk/simple-storage');
var browserMM;

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
    height: 200,
    width: 200,
    contentURL: './popup.html',
    contentScriptFile: './js/popup.js',
    contentScriptWhen: 'ready',
    onHide: handleHide
});

pageMod.PageMod({
  include: 'chrome://rb-screenshot/content/screenshot.html',
  contentScriptFile: ['./js/save_user.js',
                      './js/user_form.js',
                      './js/cs_screenshot.js'],
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

    worker.port.on('get-users', function() {
        worker.port.emit('users', ss.storage.userInfo);
    });

    if (crop) {
        worker.port.emit('setCrop');
        crop = false;
    }

    worker.port.emit('dataUrl', dataUrl);
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
    captureScreen();
    browserMM.addMessageListener('dataUrl', allContent);
});

panel.port.on('capture-area', function() {
    captureScreen();
    browserMM.addMessageListener('dataUrl', area);
});

panel.port.on('user', function() {
    tabs.open('chrome://rb-screenshot/content/users.html');
});

panel.port.on('close', function() {
    panel.hide();
});

function allContent(message) {
    dataUrl = message.data;
    tabs.open('chrome://rb-screenshot/content/screenshot.html');
    browserMM.removeMessageListener('dataUrl', allContent);
}

function area(message) {
    dataUrl = message.data;
    crop = true;
    tabs.open('chrome://rb-screenshot/content/screenshot.html');
    browserMM.removeMessageListener('dataUrl', area);
}

function setScreenshot(area) {
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

function captureScreen() {
    var currentTab = tabs.activeTab;
    var xulTab = require('sdk/view/core').viewFor(currentTab);
    var xulBrowser = require('sdk/tabs/utils').getBrowserForTab(xulTab);

    browserMM = xulBrowser.messageManager;
    browserMM.loadFrameScript(self.data.url('js/capture.js'), false);
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