var validUrl = require('valid-url');

/**
 * Sets the dialog and button to be JQuery UI elements and performs
 * validation after the submit button is pressed. The data is saved
 * to the browser's storage via the saveInformation() function in
 * `save_user.js`.
 *
 */
$(document).ready(function() {
    var apiKey = $('#api-key');
    var username = $('#username-input');
    var server = $('#server');
    var allFields = $([apiKey, username, server]);
    var dialog;

    $('#submit').button().on('click', function(event) {
        event.preventDefault();
        allFields.removeClass('ui-state-error');

        if (!server.val() || !apiKey.val() || !username.val()) {
            $('#server').addClass('ui-state-error');
            $('#username-input').addClass('ui-state-error');
            $('#api-key').addClass('ui-state-error');
            updateTips('Please fill in all fields.');
            return;
        }

        if (!validUrl.isUri(server.val())) {
            $('#server').addClass('ui-state-error');
            updateTips('Please enter a valid url.');
            return;
        }

        if (apiKey.val().length != 40) {
            $('#api-key').addClass('ui-state-error');
            updateTips('API Key should have 40 characters.');
            return;
        }

        saveInformation(apiKey.val(), server.val(), username.val());
        dialog.dialog('close');
    });

    dialog = $('#dialog-form').dialog({
        autoOpen: false
    });

    $('#add-user-button').button().on('click', function() {
        dialog.dialog('open');
    });
});

/**
 * Updates the form with an error message to show the user.
 *
 * @param text (String) - error message to display.
 */
function updateTips(text) {
    var tips = $('.validateTips');
    tips
        .text(text)
        .addClass('ui-state-highlight');
    setTimeout(function() {
        tips.removeClass('ui-state-highlight', 1500)
    }, 500);
}