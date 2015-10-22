function save_information() {
	var api_key = $('#api_key').val();
	var username = $('#username-input').val();
	var server = $('#server').val();

	if (!api_key || !username || !server) {
		alert('Please fill in all form information.');
		return;
	}

	screenshot.addServerToList(server);

	var form_info =  {
		api_key: api_key,
		username: username,
		server: server
	}
	self.port.emit('save_info', form_info);

	self.port.on('update', function() {
		var update_event = new Event('update');
    	document.getElementById('user-form').dispatchEvent(update_event)
	});
}

$(document).ready(function() {
	document.getElementById("submit").onclick = function() {
		save_information();
	};
});