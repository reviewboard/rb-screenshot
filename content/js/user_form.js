$(document).ready(function() {
    // Replaces the submit event on the add user form.
    $('#submit').click(function(event) {
        event.preventDefault();
        var apiKey = $('#api-key').val();
        var username = $('#username-input').val();
        var server = $('#server').val();

        if (!server || !apiKey || !username) {
            alert('Please fill in all fields.');
            return;
        }

        saveInformation(apiKey, server, username);
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