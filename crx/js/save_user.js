function saveInformation() {
    var apiKey = $('#api-key').val();
    var username = $('#username-input').val();
    var server = $('#server').val();

    if (!server || !apiKey || !username) {
        alert('Please fill in all fields.');
        return;
    }

    chrome.runtime.sendMessage({
        option: 'save-info',
        apiKey: apiKey,
        username: username,
        serverUrl: server
    });

    screenshot.addServerToList(server);

    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        switch (request.option) {
            case 'update':
                var updateEvent = new Event('update');
                document.getElementById('user-form').dispatchEvent(updateEvent)
                break;
        }
    });
}

$(document).ready(function() {
    // Replaces the submit event on the add_user form.
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