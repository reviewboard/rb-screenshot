// Replaces the submit event on the add_user form.
// TODO: Firefox needs to have a save_user.js file that will save the form
// 		 data to the browser's storage via a save_information() function.
$(document).ready(function() {

    $('#submit').click(function(event) {
        event.preventDefault();
        save_information();
    });

});