/**
 * Handles the button presses from the popup file.
 */
function click(id) {
    self.port.emit('close');
    switch(id) {
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
    var buttonsDiv = document.getElementById('buttons');
    buttonsDiv.addEventListener('click', function(event) {
        click(event.target.id);
    });
});