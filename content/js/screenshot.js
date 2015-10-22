var url = require('url');
var exports = module.exports;

// Functions below are exported under the name 'screenshot'
exports.setScreenshotUrl = function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

// Gets value of the server in the spinnerbox which is also the value
// of it's index in the saved user_info array.
exports.getServerValue = function getServerValue() {
	var server_value = $('#account-select').val();
	return server_value;
}

exports.setUsername = function setUsername(username) {
	$('#username').html('Username: ' + username);
}

// Makes request to a Review Board server for a given user's Review Requests.
// Function then updates the review request dropdown box in screenshot.html.
exports.reviewRequests = function reviewRequests(server_url, username) {
	var request_url = url.resolve(server_url, 'api/review-requests/');
	$.ajax({
		url: request_url,
		type: 'get',
		data: {
			'from-user': username
		},
		dataType: 'json',
		success: function(json) {
			var req_count = json.total_results;
			var req_dropdown =  document.getElementById('rr-select');
			req_dropdown.options.length = 0;

			for (i = 0; i < req_count; i++) {
				var option = document.createElement('option');
				option.text = 'r/' + json.review_requests[i].id + ' - ' +
							  json.review_requests[i].summary;
				req_dropdown.add(option);
			}
		}
	});
}