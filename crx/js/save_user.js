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
    chrome.runtime.sendMessage({
        option: 'save-info',
        apiKey: apiKey,
        username: username,
        serverUrl: server
    });

    screenshot.addServerToList(server);

    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        if (request.option == 'update') {
            var updateEvent = new Event('update');
            document.getElementById('user-form').dispatchEvent(updateEvent);
        }
    });
}