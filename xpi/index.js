var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var panels = require('sdk/panel');
var pageMod = require('sdk/page-mod');
var ss = require('sdk/simple-storage');

var dataUrl;
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

panel.port.on('capture-visible-content', function() {
    captureScreen();
    browserMM.addMessageListener('dataUrl', allContent);
});

panel.port.on('capture-area', function() {
    captureArea();
});

panel.port.on('accounts', function() {
    tabs.open('chrome://rb-screenshot/content/users.html');
});

panel.port.on('close', function() {
    panel.hide();
});

/**
 * Ran when the user requests that all visible content be captured.
 *
 * @params message (Object) - Message containing screenshot URI.
 */
function allContent(message) {
    dataUrl = message.data;
    tabs.open('chrome://rb-screenshot/content/screenshot.html');
    browserMM.removeMessageListener('dataUrl', allContent);
}

/**
 * Attaches a frame script to the active tab. The frame script
 * takes a screenshot of all visible content.
 */
function captureScreen() {
    createBrowserMM();
    browserMM.loadFrameScript(self.data.url('js/capture.js'), false);
}

function captureArea() {
    createBrowserMM();
    browserMM.loadFrameScript(self.data.url('js/capture-area.js'), false);
    pageMod.PageMod({
        include: tabs.activeTab.url,
        attachTo: ['existing', 'top'],
        contentScriptWhen: 'ready',
        contentStyleFile: [self.data.url('css/jquery.Jcrop.min.css'),
                           self.data.url('css/jcrop-rb-style.css')],
        contentScriptFile: [self.data.url('js/jquery-2.1.4.min.js'),
                            self.data.url('js/jquery.Jcrop.min.js'),
                            self.data.url('js/crop.js')],
        onAttach: function(worker) {
            worker.port.on('cropped', function(dataURI) {
                dataUrl = dataURI;
                tabs.open('chrome://rb-screenshot/content/screenshot.html');
            });
        }
    });
}

function createBrowserMM() {
    var currentTab = tabs.activeTab;
    var xulTab = require('sdk/view/core').viewFor(currentTab);
    var xulBrowser = require('sdk/tabs/utils').getBrowserForTab(xulTab);

    browserMM = xulBrowser.messageManager;
}

/**
 * Handles the state change of the panel (shown or not).
 *
 * @param state (Object) - Object containing the panel's state.
 */
function handleChange(state) {
    if(state.checked) {
        panel.show({
            position: button
        });
    }
}

/**
 * Handles the hide state of the panel.
 */
function handleHide() {
    button.state('window', {checked: false});
}