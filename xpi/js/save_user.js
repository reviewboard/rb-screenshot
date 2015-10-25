function saveInformation() {
	var apiKey = $('#api-key').val();
	var username = $('#username-input').val();
	var server = $('#server').val();

	if (!apiKey || !username || !server) {
		alert('Please fill in all form information.');
		return;
	}

	screenshot.addServerToList(server);

	var formInfo =  {
		apiKey: apiKey,
		username: username,
		server: server
	}
	self.port.emit('save-info', formInfo);

	self.port.on('update', function() {
		var updateEvent = new Event('update');
    	document.getElementById('user-form').dispatchEvent(updateEvent)
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