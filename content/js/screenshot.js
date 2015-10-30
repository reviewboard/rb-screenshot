var url = require('url');
var toBlob = require('data-uri-to-blob');
var toastr = require('toastr');
var exports = module.exports;

// Functions below are exported under the name 'screenshot'

exports.setScreenshotUrl = function setScreenshotUrl(url) {
    document.getElementById('screenshot').src = url;

    // Resize screenshot to 90% of original size. This ensures the screenshot
    // fits on the screen for whatever browser size the user has.
    var width = document.getElementById('screenshot').width * 0.9;
    var height = document.getElementById('screenshot').height * 0.9;
    document.getElementById('screenshot').src = resizeImage(document.getElementById('screenshot'), width, height);
}

// Gets value of the server in the spinnerbox which is also the value
// of it's index in the saved userInfo array.
exports.getServerValue = function getServerValue() {
    var serverSelect = document.getElementById('account-select');
    return serverSelect.options[serverSelect.selectedIndex].value;
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

exports.getScreenshotUri = function getScreenshotUri() {
    return document.getElementById('screenshot').src;
}

exports.postScreenshot = function postScreenshot(serverUrl, username, apiKey, revRequest, screenshotUri) {
    var request = 'api/review-requests/' + revRequest + '/file-attachments/'
    var postUrl = url.resolve(serverUrl, request);
    var fd = new FormData();
    var screenshot = toBlob(screenshotUri);
    var rrSelect = document.getElementById('rr-select');
    fd.append('path', screenshot);

    $.ajax({
        url: postUrl,
        type: 'post',
        data: fd,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "token " + apiKey);
        },
        contentType: false,
        processData: false,
        error: function(jqXHR, textStatus, errorThrown) {
            var errorString = 'Failed to post screenshot. ';
            if(errorThrown) {
                errorString = errorString + textStatus + ': ' + errorThrown;
            }
            toastr.error(errorString,
                         rrSelect.options[rrSelect.selectedIndex].innerHTML);
        },
        success: function(json) {
            toastr.success('Successfully posted screenshot',
                            rrSelect.options[rrSelect.selectedIndex].innerHTML);
        }
    });
};

exports.getReviewId = function getReviewId() {
    var reqSelect = document.getElementById('rr-select');
    var selectedRequestId = reqSelect.options[reqSelect.selectedIndex].value;

    return selectedRequestId;
}

// Makes request to a Review Board server for a given user's Review Requests.
// Function then updates the review request dropdown box in screenshot.html.
exports.reviewRequests = function reviewRequests(serverUrl, username) {
    var requestUrl = url.resolve(serverUrl, 'api/review-requests/');
    var rrSelect =  document.getElementById('rr-select');
    rrSelect.options.length = 0;
    $.ajax({
        url: requestUrl,
        type: 'get',
        data: {
            'from-user': username
        },
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {
            var errorString = 'Failed to get review requests. '
            if(errorThrown) {
                errorString = errorString + textStatus + ': ' + errorThrown;
            }
            toastr.error(errorString);
        },
        success: function(json) {
            var reqCount = json.total_results;

            if(reqCount == 0) {
                toastr.info('No open or draft review requests found for user: ' +
                            username + '.');
            } else {
                for (i = 0; i < reqCount; i++) {
                    var option = document.createElement('option');
                    option.value = json.review_requests[i].id;
                    option.text = 'r/' + json.review_requests[i].id + ' - ' +
                                  json.review_requests[i].summary;
                    rrSelect.add(option);
                }
            }
        }
    });
}

exports.setCrop = function setCrop() {
    $('#screenshot').Jcrop({
        bgColor: 'black',
        bgOpacity: .4,
        onSelect: updateCoords,
        setSelect: [100, 100, 50, 50]
    });
    document.getElementById('crop-button').disabled = false;
}

// Used in Chrome to add the save_user.js script. Firefox has a
// specific method for attaching javascript to a popup.
exports.setScript = function setScript() {
    var head = document.getElementsByTagName('head')[0];
    var saveScript = document.createElement('script');
    var userScript = document.createElement('script');

    saveScript.src = 'js/save_user.js';
    userScript.src = 'js/user_form.js';
    head.appendChild(saveScript);
    head.appendChild(userScript);
}

function resizeImage(img, width, height) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL();
}

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
}

function drawCanvas(x, y, width, height) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var image = document.getElementById('screenshot');

    canvas.height = height;
    canvas.width = width;

    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    return canvas.toDataURL();
}

$(document).ready(function() {
    $('#crop-button').click(function() {
        var x = $('#x').val();
        var y = $('#y').val();
        var w = $('#w').val();
        var h = $('#h').val();
        document.getElementById('screenshot').src = drawCanvas(x, y, w, h);
        document.getElementById('screenshot').style.visibility = 'visible';
        document.getElementById('screenshot').style.display = 'block';
        document.getElementById('screenshot').style.height = '100%';
        document.getElementById('screenshot').style.width = 'auto';
        $('.jcrop-holder').hide(0, function() {
            $(this).remove();
        });
    });
    document.getElementById('crop-button').disabled = true;

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-top-full-width",
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});