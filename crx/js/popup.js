var id = 100;

function click() {
    switch(this.id) {
        case '1':
            chrome.runtime.sendMessage({option: 'visible-content'});
            break;
        case '2':
            chrome.runtime.sendMessage({option: 'area'});
            break;
        case '3':
            chrome.runtime.sendMessage({option: 'all-content'});
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