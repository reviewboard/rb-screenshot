function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;
}

function createRequest() {
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
	var req = createRequest();
	req.open('get', 'http://localhost:8080/api/review-requests/?from-user=qyfcb', true);
	req.onreadystatechange = function() {
		if (req.readyState != 4) return;
		if (req.status != 200) {
			// Request failure handling
			return;
		}
		console.log('shoot');
		var resp = req.responseText;
		document.getElementById('request-result-placeholder').innerHTML = resp;
	};
	req.send();
}

window.onload = function() {
	getUserReviewRequests();
};