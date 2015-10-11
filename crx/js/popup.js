var id = 100;

function click() {
	var background = chrome.extension.getBackgroundPage();
	console.log(this.id);
    switch(this.id) {
    	case '1':
    		background.tab_screenshot();
    }
}

document.addEventListener('DOMContentLoaded', function() {
	var buttons = document.querySelectorAll('a');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', click);
	}
});