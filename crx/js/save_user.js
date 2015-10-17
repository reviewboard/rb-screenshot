function saveInformation() {
    var server = $('#server').val();
    var api_key = $('#api_key').val();

    if (!server || !api_key) {
        alert('Please fill in all fields.');
        return;
    }

    chrome.runtime.sendMessage({
        option: 'save_info',
        server_url: server,
        api_key: api_key
    });
}