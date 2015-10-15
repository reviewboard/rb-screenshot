$(document).ready(function() {
	reviewRequests();
});

function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

// CURRENT CODE IS FOR TESTING ON MY LOCALSERVER
// WILL NOT WORK ON OTHER SERVERS YET
function reviewRequests() {
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