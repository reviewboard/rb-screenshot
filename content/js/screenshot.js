var $ = require('jquery');
var urljoin = require('url-join')
var exports = module.exports;

$(document).ready(function() {
	$('#account-select').change(function() {
		screenshot.getServerValue();
	});
});

// Functions below are exported under the name 'screenshot'
exports.setScreenshotUrl = function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

exports.getServerValue = function getServerValue() {
	var server_value = $('#account-select').val();
	return server_value;
}

// CURRENT CODE IS FOR TESTING ON MY LOCALSERVER
// WILL NOT WORK ON OTHER SERVERS YET
exports.reviewRequests = function reviewRequests() {
	$.ajax({
		url: 'http://localhost:8080/api/review-requests/',
		type: 'get',
		data: {
			'from-user': 'qyfcb'
		},
		dataType: 'json',
		success: function(json) {
			var req_count = json.total_results;
			var req_dropdown =  document.getElementById('rr-id-select');

			for (i = 0; i < req_count; i++) {
				var option = document.createElement('option');
				option.text = 'r/' + json.review_requests[i].id + ' - ' +
							  json.review_requests[i].summary;
				req_dropdown.add(option);
			}
		}
	});
}