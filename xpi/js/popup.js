var id = 100;

function click() {
    alert(this.id);
}

document.addEventListener('DOMContentLoaded', function() {
	var buttons = document.querySelectorAll('a');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', click);
	}
});