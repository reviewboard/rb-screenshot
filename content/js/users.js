var table = document.getElementById('user-info-body');
var editCell;
var currentElement = false;
var toDelete = [];
var toAdd = [];

function setCellListeners(tableCell) {
    if (tableCell.id != 'footer-text' && tableCell.className != 'delete' &&
        tableCell.className != 'non-edit') {
        tableCell.addEventListener('dblclick', function() {
            contentEditable(tableCell);
            addPasteListeners(tableCell);
            editCell = document.querySelector('td[contentEditable=true]');
            tableCell.focus();
            currentElement = tableCell.id;
        });

        tableCell.addEventListener('keypress', function(e) {
            if (e.keyCode == 13) {
                contentNotEditable(tableCell);
                removePasteListeners(tableCell);
                tableCell.blur();
            }
        });
    } else if (tableCell.className == 'delete') {
        setDeleteListener(tableCell);
    }
}

function setDeleteListener(deleteButton) {
    deleteButton.addEventListener('click', function() {
        var rowIndex = this.parentNode.rowIndex - 1;
        var server = this.parentNode.cells[0];
        var username = this.parentNode.cells[1];
        var conf = confirm('Are you sure you want to delete ' +
                           server.textContent + ' associated with username: ' +
                           username.textContent +'?');
        if (conf) {
            table.deleteRow(rowIndex);

            if (toDelete.indexOf(Number(this.id)) == -1) {
                toDelete.push(Number(this.id));
            }
        }
    });
}

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

// Get the difference between the toDelete array and the
// toAdd array.
function difference() {
    var diff = [];
    toDelete.forEach(function(key) {
        if (toAdd.indexOf(key) == -1) {
            diff.push(key);
        }
    });
    toDelete = [];
    toAdd = [];
    return diff.sort();
}

// Listener that gets plain text only from a paste event
var pasteListener = function(event) {
    event.preventDefault();
    var text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
}

// Functions below deal with an entire cell's row
function addPasteListeners(cell) {
    var parentRow = cell.parentNode;
    parentRow.cells[0].addEventListener('paste', pasteListener);
    parentRow.cells[1].addEventListener('paste', pasteListener);
    parentRow.cells[2].addEventListener('paste', pasteListener);
}

function removePasteListeners(cell) {
    var parentRow = cell.parentNode;
    parentRow.cells[0].removeEventListener('paste', pasteListener);
    parentRow.cells[1].removeEventListener('paste', pasteListener);
    parentRow.cells[2].removeEventListener('paste', pasteListener);
}

function contentEditable(cell) {
    var parentRow = cell.parentNode;
    parentRow.cells[0].contentEditable = true;
    parentRow.cells[1].contentEditable = true;
    parentRow.cells[2].contentEditable = true;
};

function contentNotEditable(cell) {
    var parentRow = cell.parentNode;
    parentRow.cells[0].contentEditable = false;
    parentRow.cells[1].contentEditable = false;
    parentRow.cells[2].contentEditable = false;
}

$(document).ready(function() {
    // Set Jquery UI elements
    $('#save').button();

    // Listener that removes focus on element if user clicks outside element
    document.addEventListener('click', function(e) {
        if (currentElement) {
            if (e.target.id != currentElement) {
                var current = document.getElementById(currentElement);
                contentNotEditable(current);
                removePasteListeners(current);
                current.blur();
                currentElement = false;
            }
        }
    });

    // Listener for creating a new table row
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

        if(toAdd.indexOf(table.rows.length - 1) == -1) {
            toAdd.push(table.rows.length - 1);
        }
    });
});