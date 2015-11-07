var table = document.getElementById('user-info-body');
var toDelete = [];
var toAdd = [];
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

        // Set listener for delete buttons
        var rows = table.rows.length;
        for (var i = 0 ; i < rows; i++) {
            var deleteButton = document.getElementById(i);
            setDeleteListener(deleteButton)
        }
    }
});

// Set listener for add button
var addButton = document.getElementById('add');
addButton.addEventListener('click', function() {
    var deleteButton = document.getElementById(table.rows.length - 1);
    setDeleteListener(deleteButton)

    if(toAdd.indexOf(table.rows.length - 1) == -1) {
        toAdd.push(table.rows.length - 1);
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
                (Number(id) || (Number(id) == 0)) && tableCells[i].innerHTML) {
                var saveData = tableCells[i].id.slice(0, -1);

                // If userInfo already exists or if it needs to be created
                if (userInfo[id]) {
                    if (saveData == 'server') {
                        userInfo[id].serverUrl = tableCells[i].innerHTML;
                    } else if (saveData == 'user') {
                        userInfo[id].username = tableCells[i].innerHTML;
                    } else if (saveData == 'apiKey') {
                        userInfo[id].apiKey = tableCells[i].innerHTML;
                    }
                } else {
                    // If it DNE, Server is the first unknown cell to be seen so
                    // push that information onto array.
                    userInfo.push({serverUrl: tableCells[i].innerHTML});
                }
            }
        }

        // Delete rows in deleteDiff
        var deleteDiff = difference(toDelete, toAdd);
        deleteDiff.sort();

        // Remove deleted information in reverse order as to not change
        // the indices while removing objects
        if (deleteDiff.length > 0) {
            for (var i = deleteDiff.length; i > 0; i--) {
                userInfo.splice(deleteDiff[i-1], 1);
            }
        }
        toDelete = [];
        toAdd = [];
        resetIds();

        self.port.emit('modify-users', userInfo);
    });
});

function setDeleteListener(deleteButton) {
    deleteButton.addEventListener('click', function() {
        var rowIndex = this.parentNode.rowIndex - 1;
        var server = this.parentNode.cells[0];
        var conf = confirm('Are you sure you want to delete: ' + server.innerHTML);
        if (conf) {
            table.deleteRow(rowIndex);

            if (toDelete.indexOf(Number(this.id)) == -1) {
                toDelete.push(Number(this.id));
            }
        }
    });
}

// Reset ids after a row is deleted
function resetIds() {
    var rows = table.rows;

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');

        // Modify cell ids to correspond to correct rows
        cells[0].id = 'server' + i;
        cells[1].id = 'user' + i;
        cells[2].id = 'apiKey' + i;
        cells[3].id = i;
    }
}