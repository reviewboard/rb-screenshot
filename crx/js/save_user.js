function saveInformation(apiKey, server, username) {
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
                document.getElementById('user-form').dispatchEvent(updateEvent);
                break;
        }
    });
}