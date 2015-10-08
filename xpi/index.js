var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
	id: "reviewboard-icon",
	label: "Review Board Screenshot Tool",
	icon: {
		"16": "./icon16.png",
		"32": "./icon32.png",
		"64": "./icon64.png"
	},
	onClick: handleClick
});

function handleClick(state) {
	tabs.open("http://www.reviewboard.org/");
}

