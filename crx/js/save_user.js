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
}