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