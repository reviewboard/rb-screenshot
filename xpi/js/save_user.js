/**
 * Sends message to the background.js script to save the information
 * submitted through the screenshot.html add user form and adds the
 * server to the server select.
 *
 * @param apiKey - API key from the form.
 * @param server - Server URL from the form.
 * @param username - Username from the form.
 */
function saveInformation(apiKey, server, username) {
    screenshot.addServerToList(server);

    var formInfo =  {
        apiKey: apiKey,
        username: username,
        serverUrl: server
    }
    self.port.emit('save-info', formInfo);

    self.port.on('update', function() {
        var updateEvent = new Event('update');
        document.getElementById('user-form').dispatchEvent(updateEvent)
    });
}