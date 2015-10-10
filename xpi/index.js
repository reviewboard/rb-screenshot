var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require('sdk/self');
var panels = require("sdk/panel");

var button = ToggleButton({
    id: "reviewboard-icon",
    label: "Review Board Screenshot Tool",
    icon: {
        "16": "./icon16.png",
        "32": "./icon32.png",
        "64": "./icon64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    height: 210,
    width: 200,
    contentURL: self.data.url("popup.html"),
    onHide: handleHide
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