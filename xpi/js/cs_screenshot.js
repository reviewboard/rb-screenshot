// Content script for screenshot.html
self.port.on('dataUrl', function(url) {
    var message = {'option' : 'setScreenshotUrl',
                   'url': url};
    sendMessageToPageScript(message);
});

setServers();
setListeners();

function setListeners() {
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.addEventListener('change', function() {
        setInformation();
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        setInformation();
    });

    var send = document.getElementById('send-button');
    send.addEventListener('click', function() {
        self.port.emit('get-users');
        self.port.on('users', sendScreenshot);
    });
}

function sendScreenshot(userInfo) {
    if(userInfo) {
        var serverSelect = document.getElementById('account-select');
        var screenshot = document.screenshot;

        var reviewRequest = document.getElementById('rr-select').value;
        var screenshotUri = document.getElementById('screenshot').src;
        var index = serverSelect.options[serverSelect.selectedIndex].value;

        var serverUrl = userInfo[index].serverUrl;
        var username = userInfo[index].username;
        var apiKey = userInfo[index].apiKey;

        var message = {'option' : 'sendScreenshot',
                       'serverUrl' : serverUrl,
                       'username' : username,
                       'apiKey' : apiKey,
                       'reviewRequest' : reviewRequest,
                       'screenshotUri' : screenshotUri}
        sendMessageToPageScript(message);
    }
    self.port.removeListener('users', sendScreenshot);
}

function setInformation() {
    self.port.emit('get-users');
    self.port.on('users', sendInformation);
}

function sendInformation(userInfo) {
    var serverSelect = document.getElementById('account-select');
    var index =  serverSelect.options[serverSelect.selectedIndex].value;
    var message = {'option' : 'setUsername',
                   'username' : userInfo[index].username};
    sendMessageToPageScript(message);
    message = {'option' : 'setReviewRequests',
               'serverUrl' : userInfo[index].serverUrl,
               'username' : userInfo[index].username}
    sendMessageToPageScript(message)
    self.port.removeListener('users', sendInformation);
}

function setServers() {
    var serverDropdown = document.getElementById('account-select');
    self.port.emit('get-users');
    self.port.once('users', function(userInfo) {
        if (userInfo) {
            var message = {'option' : 'setServers',
                           'users' : userInfo}
            sendMessageToPageScript(message);
        }
    });
}

function sendMessageToPageScript(message) {
    var cloned = cloneInto(message, document.defaultView);
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent('addon-message', true, true, cloned);
    document.documentElement.dispatchEvent(event);
}