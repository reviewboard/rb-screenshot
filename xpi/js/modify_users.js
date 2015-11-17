var table = document.getElementById('user-info-body');
var saveButton = document.getElementById('save');
var modified = false;

/**
 * Toast displayed if data saved successfully.
 */
function successToast() {
    toastr.success('User information successfully saved.');
    self.port.removeListener('success', successToast);
}

/**
 * Sets up the user information table. The table cell's event listeners
 * are also added.
 */
self.port.emit('send-users');
self.port.on('users', function(users) {
    if (users && users.length != table.rows.length && !modified) {
        for (var i = 0; i < users.length; i++) {

            var row = table.insertRow(i);
            var server = row.insertCell(0);
            var user = row.insertCell(1);
            var apiKey = row.insertCell(2);
            var del = row.insertCell(3);
            var pad = row.insertCell(4);

            server.textContent = users[i].serverUrl;
            server.id = 'server' + i;
            user.textContent = users[i].username;
            user.id = 'user' + i;
            apiKey.textContent = users[i].apiKey;
            apiKey.id = 'apiKey' + i;
            del.innerHTML = '<i class="fa fa-times"></i>';
            del.id = i;
            del.className = 'delete';
            pad.className = 'non-edit';
        }

        var tableCells = document.getElementsByTagName('td');
        for (i = 0; i < tableCells.length; i++) {
            setCellListeners(tableCells[i]);
        }
    }
});

/**
 * Listener for the save button which updates the saved user information
 * with the information in the user table.
 */
saveButton.addEventListener('click', function() {
    self.port.on('success', successToast);
    modified = true;
    var tableRows = document.getElementById('user-info').rows;
    var tableCells = document.getElementsByTagName('td');

    self.port.emit('send-users');
    self.port.on('users', function(users) {
        var tableCells = document.getElementsByTagName('td');

        if (users) {
            userInfo = users;
        } else {
            userInfo = [];
        }

        for (var i = 0; i < tableCells.length; i++) {
            var id = tableCells[i].id.slice(-1);

            if (id && tableCells[i].className != 'delete' &&
                (Number(id) || (Number(id) == 0)) && tableCells[i].textContent) {
                var saveData = tableCells[i].id.slice(0, -1);

                if (userInfo[id]) {
                    if (saveData == 'server') {
                        userInfo[id].serverUrl = tableCells[i].textContent;
                    } else if (saveData == 'user') {
                        userInfo[id].username = tableCells[i].textContent;
                    } else if (saveData == 'apiKey') {
                        userInfo[id].apiKey = tableCells[i].textContent;
                    }
                } else {
                    userInfo.push({serverUrl: tableCells[i].textContent});
                }
            }
        }

        var deleteDiff = difference();

        // Remove deleted information in reverse order as to not change
        // the indices while removing objects
        if (deleteDiff.length > 0) {
            for (var i = deleteDiff.length; i > 0; i--) {
                userInfo.splice(deleteDiff[i-1], 1);
            }
        }
        resetIds();

        self.port.emit('modify-users', userInfo);
    });
});