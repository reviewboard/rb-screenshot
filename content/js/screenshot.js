function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

function createXMLRequest() {
	var result = null;
	if (window.XMLHttpRequest) {
		result = new XMLHttpRequest();
		if (typeof result.overrideMimeType != 'undefined') {
			result.overrideMimeType('text/xml');
		} else if (window.ActiveXObject) {
			result = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	return result;
}

// CURRENT CODE IS FOR TESTING ON MY LOCALSERVER
// WILL NOT WORK ON OTHER SERVERS YET
function getUserReviewRequests() {
	var xml_req = createXMLRequest();
	xml_req.open('get', 'http://localhost:8080/api/review-requests/?from-user=qyfcb',
				 true);
	xml_req.onreadystatechange = function() {
		if (xml_req.readyState != 4) return;
		if (xml_req.status != 200) {
			// Request failure handling
			return;
		}
		var req_info = JSON.parse(xml_req.responseText);
		var req_count = req_info.total_results;
		var req_dropdown =  document.getElementById('rr-id-select');

		for (i = 0; i < req_count; i++) {
			var option = document.createElement('option');
			option.text = 'r/' + req_info.review_requests[i].id + ' - ' +
						  req_info.review_requests[i].summary;
			req_dropdown.add(option);
		}
	};
	xml_req.send();
}

window.onload = function() {
	getUserReviewRequests();
};