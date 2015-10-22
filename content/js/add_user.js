// Replaces the submit event on the add_user form.
$(document).ready(function() {

    $('#submit').click(function(event) {
        event.preventDefault();
        save_information();
        dialog.dialog('close');
    });

    var dialog;
	var form;

	dialog = $('#dialog-form').dialog({
		autoOpen: false
	});

	$('#add-user-button').button().on('click', function() {
		dialog.dialog('open');
	});

});