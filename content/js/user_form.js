$(document).ready(function() {
    // Replaces the submit event on the add user form.
    $('#submit').click(function(event) {
        event.preventDefault();
        saveInformation();
        dialog.dialog('close');
    });

    // Set up add user form
    var dialog;
    var form;

    dialog = $('#dialog-form').dialog({
        autoOpen: false
    });

    $('#add-user-button').button().on('click', function() {
        dialog.dialog('open');
    });
});