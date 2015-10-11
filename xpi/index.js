var { ToggleButton } = require('sdk/ui/button/toggle');
var { Cc, Ci } = require('chrome');
var tabs = require('sdk/tabs');
var self = require('sdk/self');
var panels = require("sdk/panel");

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

panel.port.on('alert', function(message) {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
               .getService(Ci.nsIWindowMediator);
    var window = wm.getMostRecentWindow("navigator:browser").gBrowser.contentWindow;
    var document = window.document;
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var ctx = canvas.getContext('2d');
    ctx.drawWindow(window, 0, 0, canvas.width, canvas.height, 'rgb(255,255,255)');

    var dataUrl = canvas.toDataURL();
    canvas = null;

    tabs.open(dataUrl);
});

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