function save_information() {
    var api_key = $('#api_key').val();
    var username = $('#username-input').val();
    var server = $('#server').val();

    if (!server || !api_key || !username) {
        alert('Please fill in all fields.');
        return;
    }

    chrome.runtime.sendMessage({
        option: 'save_info',
        api_key: api_key,
        username: username,
        server_url: server
    });

    screenshot.addServerToList(server);

    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        switch (request.option) {
            case 'update':
                var update_event = new Event('update');
                document.getElementById('user-form').dispatchEvent(update_event)
                break;
        }
    });
}