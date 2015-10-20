var id = 100;

// Check for button id when more screenshot functionality added
function click() {
    self.port.emit('capture-all-content');
}

document.addEventListener('DOMContentLoaded', function() {
	var buttons = document.querySelectorAll('a');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', click);
	}
});