var table = document.getElementById('user-info-body');
var currentElement = false;

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
    if (tableCell.id != 'footer-text' && tableCell.className != 'delete' &&
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