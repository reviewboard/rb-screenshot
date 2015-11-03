var table = document.getElementById('user-info-body');
var userLength = 2;
var currentElement = false;

// Add test data
for (var i = 0; i < userLength; i++) {
    var row = table.insertRow(i);
    var server = row.insertCell(0);
    var user = row.insertCell(1);
    var apiKey = row.insertCell(2);
    var del = row.insertCell(3);
    var pad = row.insertCell(4);

    server.innerHTML = 'test server' + i;
    server.id = 'server' + i;
    user.innerHTML = 'test user' + i;
    user.id = 'user' + i;
    apiKey.innerHTML = 'aaaaaaaaaabbbbbbbbbccccccccccddddddddd' + i;
    apiKey.id = 'apiKey' + i;
    del.innerHTML = '<i class="fa fa-times"></i>';
    del.id = i;
    del.className = 'delete';
    pad.className = 'non-edit';
}

// Set double click and enter listener for each table cell (except footer)
var tableCells = document.getElementsByTagName('td');
for (i = 0; i < tableCells.length; i++) {
    setCellListeners(tableCells[i], i);
}

// Add listener to remove focus on element if user clicks outside element
document.addEventListener('click', function(e) {
    if (currentElement) {
        if (e.target.id != currentElement) {
            var current = document.getElementById(currentElement);
            current.contentEditable = false;
            current.blur();
            currentElement = false;
        }
    }
});

// Add listener for creating a new table row
document.getElementById('add').addEventListener('click', function() {
    var id = table.rows.length;
    var row = table.insertRow(id);
    var server = row.insertCell(0);
    var user = row.insertCell(1);
    var apiKey = row.insertCell(2);
    var del = row.insertCell(3);
    row.insertCell(4);

    server.id = 'server' + id;
    server.setAttribute('data-attr', 'Server URL');
    user.id = 'user' + id;
    user.setAttribute('data-attr', 'Username');
    apiKey.id = 'apiKey' + id;
    apiKey.setAttribute('data-attr', 'API Key');
    del.innerHTML = '<i class="fa fa-times"></i>';
    del.id = id;
    del.className = 'delete';

    for (var i = 0; i < row.cells.length; i++) {
        setCellListeners(row.cells[i]);
    }
});

// Sets all the cell listeners for a given cell
function setCellListeners(tableCell) {
    if (tableCell.className == 'delete') {
        var button = document.getElementById(tableCell.id);
        var server = document.getElementById('server' + tableCell.id).innerHTML;

        button.addEventListener('click', function() {
            var conf = confirm('Are you sure you want to delete: ' + server);
            if (conf) {
                table.deleteRow(tableCell.parentNode.rowIndex - 1);
            }
        });
    } else if (tableCell.id != 'footer-text' &&
               tableCell.className != 'non-edit') {
        tableCell.addEventListener('dblclick', function() {
            tableCell.contentEditable = true;
            tableCell.focus();
            currentElement = tableCell.id;
        });

        tableCell.addEventListener('keypress', function(e) {
            if (e.keyCode == 13) {
                tableCell.contentEditable = false;
                tableCell.blur();
            }
        });
    }
}