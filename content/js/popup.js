var id = 100;

function click() {
    tab_screenshot();
}

function tab_screenshot() {
    var background = chrome.extension.getBackgroundPage();
    console.log(background.tab_screenshot());
}

document.addEventListener('DOMContentLoaded', function() {
	var buttons = document.querySelectorAll('a');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', click);
	}
});