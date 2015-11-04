var table = document.getElementById('user-info-body');
var toDelete = [];

// Set listeners for all table cells
chrome.storage.sync.get('userInfo', function(obj) {
    if (Object.keys(obj).length != 0) {
        var userInfo = obj['userInfo'];

        // Set data from userInfo
        for (var i = 0; i < userInfo.length; i++) {
            var row = table.insertRow(i);
            var server = row.insertCell(0);
            var user = row.insertCell(1);
            var apiKey = row.insertCell(2);
            var del = row.insertCell(3);
            var pad = row.insertCell(4);

            server.innerHTML = userInfo[i].serverUrl;
            server.id = 'server' + i;
            user.innerHTML = userInfo[i].username;
            user.id = 'user' + i;
            apiKey.innerHTML = userInfo[i].apiKey;
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

            deleteButton.addEventListener('click', function() {
                var serverId = 'server' + this.id;
                var server = document.getElementById(serverId);
                var conf = confirm('Are you sure you want to delete: ' + server.innerHTML);
                if (conf) {
                    table.deleteRow(server.parentNode.rowIndex - 1);
                    toDelete.push(this.id);
                }
            });
        }
    }
});

// Set listener for save button
var saveButton = document.getElementById('save');
saveButton.addEventListener('click', function() {
    var tableCells = document.getElementsByTagName('td');

    chrome.storage.sync.get('userInfo', function(obj) {
        if (Object.keys(obj) != 0) {
            var userInfo = obj['userInfo'];
        }

        // Update changed information
        for (var i = 0; i < tableCells.length; i++) {
            var id = tableCells[i].id.slice(-1);

            if (id && tableCells[i].className != 'delete' &&
                (Number(id) || (Number(id) == 0))) {
                var saveData = tableCells[i].id.slice(0, -1);

                if (saveData == 'server') {
                    userInfo[id].serverUrl = tableCells[i].innerHTML;
                } else if (saveData == 'user') {
                    userInfo[id].username = tableCells[i].innerHTML;
                } else if (saveData == 'apiKey') {
                    userInfo[id].apiKey = tableCells[i].innerHTML;
                }
            }
        }

        // Remove deleted information
        for (var i = 0; i < toDelete.length; i++) {
            userInfo.splice(toDelete[i], 1);
        }
        toDelete = [];
        chrome.storage.sync.set({'userInfo': userInfo});
    });
});