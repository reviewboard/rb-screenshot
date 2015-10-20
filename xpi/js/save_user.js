function save_information() {
	var api_key = $('#api_key').val();
	var username = $('#username').val();
	var server = $('#server').val();

	if (!api_key || !username || !server) {
		alert('Please fill in all form information.');
		return;
	}

	var form_info =  {
		api_key: api_key,
		username: username,
		server: server
	}
	self.port.emit('save_info', form_info);
}

$(document).ready(function() {
	document.getElementById("submit").onclick = function() {
		save_information();
	};
});