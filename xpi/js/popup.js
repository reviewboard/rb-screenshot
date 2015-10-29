var id = 100;

// Check for button id when more screenshot functionality added
function click() {
    switch(this.id) {
        case '1':
            self.port.emit('capture-all-content');
            break;
        case '2':
            self.port.emit('capture-area');
            break;
        default:
            alert('Unhandled id');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('a');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', click);
    }
});