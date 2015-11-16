/**
 * Handles the button presses from the popup file.
 */
function click() {
    switch(this.id) {
        case '1':
            chrome.runtime.sendMessage({option: 'visible-content'});
            break;
        case '2':
            chrome.runtime.sendMessage({option: 'area'});
            break;
        case '3':
            chrome.runtime.sendMessage({option: 'user'});
            break;
        default:
            alert('Button ID not recognized');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('a');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', click);
    }
});