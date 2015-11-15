function click() {
    self.port.emit('close');
    switch(this.id) {
        case '1':
            self.port.emit('capture-all-content');
            break;
        case '2':
            self.port.emit('capture-area');
            break;
        case '3':
            self.port.emit('user');
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