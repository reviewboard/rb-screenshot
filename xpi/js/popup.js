/**
 * Handles the button presses from the popup file.
 */
function click() {
    self.port.emit('close');
    switch(this.id) {
        case 'capture-visible-content':
            self.port.emit('capture-visible-content');
            break;
        case 'capture-area':
            self.port.emit('capture-area');
            break;
        case 'accounts':
            self.port.emit('accounts');
            break;
        default:
            console.log('Button ID not recognized.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('a');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', click);
    }
});