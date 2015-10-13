var id = 100;

function click() {
    switch(this.id) {
    	case '1':
    		chrome.runtime.sendMessage({option: 'all-webcontent'}, function() {
    			this.close();
    		});
    		break;
    	default:
    		alert('Button ID not recognized');
    		// TODO: Update above error message
    }
}

document.addEventListener('DOMContentLoaded', function() {
	var buttons = document.querySelectorAll('a');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', click);
	}
});