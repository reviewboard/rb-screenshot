/**
 * Handles the button presses from the popup file.
 */
function click() {
    switch(this.id) {
        case 'capture-visible-content':
            chrome.runtime.sendMessage({option: 'capture-visible-content'});
            break;
        case 'capture-area':
            chrome.runtime.sendMessage({option: 'capture-area'});
            break;
        case 'accounts':
            chrome.runtime.sendMessage({option: 'accounts'});
            break;
        default:
            console.log('Button ID not recognized');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('a');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', click);
    }
});