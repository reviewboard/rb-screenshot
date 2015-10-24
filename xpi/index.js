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
    height: 210,
    width: 200,
    contentURL: self.data.url("popup.html"),
    contentScriptFile: self.data.url("js/popup.js"),
    contentScriptWhen: 'ready',
    onHide: handleHide
});

pageMod.PageMod({
  include: 'chrome://rbscreenshot/content/screenshot.html',
  contentScriptFile: './js/save_user.js',
  onAttach: function(worker) {
    worker.port.on('save-info', function(userInfo) {
        if (ss.storage.userInfo) {
            ss.storage.userInfo.push({
                apiKey: userInfo.apiKey,
                username: userInfo.username,
                server: userInfo.server
            });
        } else {
            ss.storage.userInfo = [{
                apiKey: userInfo.apiKey,
                username: userInfo.username,
                server: userInfo.server
            }];
        }
        worker.port.emit('update');
    });
  }
});

panel.port.on('capture-all-content', function() {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
               .getService(Ci.nsIWindowMediator);
    var gBrowser = wm.getMostRecentWindow("navigator:browser").gBrowser;
    var window = gBrowser.contentWindow;
    var document = window.document;
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var ctx = canvas.getContext('2d');
    ctx.drawWindow(window, 0, 0, canvas.width, canvas.height, 'rgb(255,255,255)');

    var dataUrl = canvas.toDataURL();
    canvas = null;

    // Below may need to be refactored when other screenshot features added
    var tab = gBrowser.addTab('chrome://rbscreenshot/content/screenshot.html');
    gBrowser.selectedTab = tab;
    var newTabBrowser = gBrowser.getBrowserForTab(tab);
    newTabBrowser.addEventListener("load", function() {
        newTabBrowser.contentDocument.getElementById('screenshot').src = dataUrl;
        setListeners(newTabBrowser);
        setServers(newTabBrowser);
    }, true);

});

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
}

function setInfo(browser) {
    var serverDropdown = browser.contentDocument.getElementById('account-select');
    var index = serverDropdown.options[serverDropdown.selectedIndex].value;
    var userInfo = ss.storage.userInfo[index];

    browser.contentWindow.screenshot.setUsername(userInfo.username);
    browser.contentWindow.screenshot.reviewRequests(userInfo.server, userInfo.username);
}

function setServers(browser) {
    var serverDropdown = browser.contentDocument.getElementById('account-select');
    var userInfo = ss.storage.userInfo;
    if (userInfo) {
        for (var i = 0; i < userInfo.length; i++) {
            var option = browser.contentDocument.createElement('option');
            option.value = i;
            option.text = userInfo[i].server;
            serverDropdown.add(option);
        }
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