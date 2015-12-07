/**
 * Handles the button presses from the popup file.
 */
document.addEventListener('DOMContentLoaded', function() {
    var buttonsDiv = document.getElementById('buttons');
    buttonsDiv.addEventListener('click', function(event) {
        click(event.target.id);
    });
});

function click(id) {
    switch(id) {
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
    window.close();
}