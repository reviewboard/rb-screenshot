var url = require('url');
var exports = module.exports;

// Functions below are exported under the name 'screenshot'
exports.setScreenshotUrl = function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

// Gets value of the server in the spinnerbox which is also the value
// of it's index in the saved userInfo array.
exports.getServerValue = function getServerValue() {
	var serverValue = $('#account-select').val();
	return serverValue;
}

exports.setUsername = function setUsername(username) {
	$('#username').html('Username: ' + username);
}

exports.setServers = function setServers(userInfo) {
	var serverDropdown = document.getElementById('account-select');
	serverDropdown.options.length = 0;

    for (var i = 0; i < userInfo.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = userInfo[i].serverUrl;
        serverDropdown.add(option);
    }
};

exports.addServerToList = function addServerToList(server) {
	var serverDropdown = document.getElementById('account-select');
	var option = document.createElement('option');

	if (serverDropdown.options.length == 0) {
		option.value = 0;
	} else {
		option.value = serverDropdown.options.length;
	}

	option.text = server;
	serverDropdown.add(option);
};

// Makes request to a Review Board server for a given user's Review Requests.
// Function then updates the review request dropdown box in screenshot.html.
exports.reviewRequests = function reviewRequests(serverUrl, username) {
	var requestUrl = url.resolve(serverUrl, 'api/review-requests/');
	$.ajax({
		url: requestUrl,
		type: 'get',
		data: {
			'from-user': username
		},
		dataType: 'json',
		success: function(json) {
			var reqCount = json.total_results;
			var reqDropdown =  document.getElementById('rr-select');
			reqDropdown.options.length = 0;

			for (i = 0; i < reqCount; i++) {
				var option = document.createElement('option');
				option.text = 'r/' + json.review_requests[i].id + ' - ' +
							  json.review_requests[i].summary;
				reqDropdown.add(option);
			}
		}
	});
}