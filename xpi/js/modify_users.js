var table = document.getElementById('user-info-body');
var modified = false;

// Set listeners for all table cells
self.port.emit('send-users');
self.port.on('users', function(users) {
    if(users != undefined && users.length != table.rows.length && !modified) {
        for (var i = 0; i < users.length; i++) {

            var row = table.insertRow(i);
            var server = row.insertCell(0);
            var user = row.insertCell(1);
            var apiKey = row.insertCell(2);
            var del = row.insertCell(3);
            var pad = row.insertCell(4);

            server.innerHTML = users[i].serverUrl;
            server.id = 'server' + i;
            user.innerHTML = users[i].username;
            user.id = 'user' + i;
            apiKey.innerHTML = users[i].apiKey;
            apiKey.id = 'apiKey' + i;
            del.innerHTML = '<i class="fa fa-times"></i>';
            del.id = i;
            del.className = 'delete';
            pad.className = 'non-edit';
        }

        // Set double click and enter listener for each table cell (except footer)
        var tableCells = document.getElementsByTagName('td');
        for (i = 0; i < tableCells.length; i++) {
            setCellListeners(tableCells[i]);
        }
    }
});

// Set listener for save button
var saveButton = document.getElementById('save');
saveButton.addEventListener('click', function() {
    modified = true;
    var tableRows = document.getElementById('user-info').rows;
    var tableCells = document.getElementsByTagName('td');

    self.port.emit('send-users');
    self.port.on('users', function(users) {

        if (users) {
            userInfo = users;
        } else {
            userInfo = [];
        }

        var tableCells = document.getElementsByTagName('td');

        // Update changed information
        for (var i = 0; i < tableCells.length; i++) {
            var id = tableCells[i].id.slice(-1);

            if (id && tableCells[i].className != 'delete' &&
                (Number(id) || (Number(id) == 0)) && tableCells[i].textContent) {
                var saveData = tableCells[i].id.slice(0, -1);

                // If userInfo already exists or if it needs to be created
                if (userInfo[id]) {
                    if (saveData == 'server') {
                        userInfo[id].serverUrl = tableCells[i].textContent;
                    } else if (saveData == 'user') {
                        userInfo[id].username = tableCells[i].textContent;
                    } else if (saveData == 'apiKey') {
                        userInfo[id].apiKey = tableCells[i].textContent;
                    }
                } else {
                    // If it DNE, Server is the first unknown cell to be seen so
                    // push that information onto array.
                    userInfo.push({serverUrl: tableCells[i].textContent});
                }
            }
        }

        // Delete rows in deleteDiff
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