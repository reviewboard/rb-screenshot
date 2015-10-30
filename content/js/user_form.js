var validUrl = require('valid-url');

$(document).ready(function() {
    // Replaces the submit event on the add user form.
    var apiKey = $('#api-key');
    var username = $('#username-input');
    var server = $('#server');
    var allFields = $([]).add(apiKey).add(username).add(server);

    $('#submit').click(function(event) {
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

function checkApiKey(apiKey) {
}

function updateTips(text) {
    var tips = $('.validateTips');
    tips
        .text(text)
        .addClass('ui-state-highlight');
    setTimeout(function() {
        tips.removeClass('ui-state-highlight', 1500)
    }, 500);
}