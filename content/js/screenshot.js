var url = require('url');
var toBlob = require('data-uri-to-blob');
var exports = module.exports;

/**
 * Sets the server select element to be a JQuery UI selectmenu and
 * sets the first option as the selected option in the menu.
 */
function setServerSelectMenu() {
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.options[0].selected = true;

    $('#account-select').selectmenu({
        width: '25%',
        change: function(event, data) {
            var serverSelect = document.getElementById('account-select');
            serverSelect.selectedIndex = data.item.value;
            sendUpdateEvent();
        }
    });
    $('#account-select').selectmenu('refresh');
}


/**
 * Checks the width of the selectmenu and sets the selectmenu dropdown
 * to have the same width.
 *
 * @param selectmenuId (String): id of selectmenu whose width is to be set.
 * @param className (String): name given to new dropdown 'width' class.
 */
function setSelectMenuWidth(selectmenuId, className) {
    $('#' + selectmenuId + '-menu').addClass(className);

    var selectButtonId = selectmenuId + '-button';
    var w = document.getElementById(selectButtonId).offsetWidth + 'px';
    var overflowClass = document.querySelector('.' + className);
    overflowClass.style.maxWidth = w;
}

/**
 * Sets all the available servers in userInfo as options in the
 * server select element and sets the select to be a Jquery UI
 * selectmenu.
 *
 * @param userInfo (Array)
 *        Array of user information with each element containing:
 *        serverUrl, apiKey, and username.
 */
function setServers(userInfo) {
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.options.length = 0;

    for (var i = 0; i < userInfo.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = userInfo[i].serverUrl;
        serverDropdown.add(option);
    }

    setServerSelectMenu();
    setSelectMenuWidth('account-select', 'account-overflow');
};

/**
 * Adds a new server to the server select element.
 *
 * @param server (String) - URL of the server to add.
 */
function addServerToList(server) {
    var serverDropdown = document.getElementById('account-select');
    var option = document.createElement('option');

    if (serverDropdown.options.length == 0) {
        option.value = 0;
    } else {
        option.value = serverDropdown.options.length;
    }

    option.text = server;
    serverDropdown.add(option);
    $('#account-select').selectmenu('refresh');
};

/**
 * Resizes the image to 90% of its original size. When cropping feature
 * is completed, function should be removed and size should be set in
 * the `screenshot.less` file.
 */
function resizeImage() {
    var screenshot = document.getElementById('screenshot');
    var width = screenshot.width * 0.9;
    var height = screenshot.height * 0.9;

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    context.drawImage(screenshot, 0, 0, width, height);
    screenshot.src = canvas.toDataURL();
    screenshot.removeEventListener('load', resizeImage);
}

/**
 * Updates the coordinates of the crop box.
 *
 * @param c (Coordinate) - coordinates given by JCrop onSelect.
 */
function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
}

/**
 * Crops the image.
 *
 * @param x (Integer) - x coordinate of where to start cropping.
 * @param y (Integer) - y coordinate of where to start cropping.
 * @param width (Integer) - width of the cropped image.
 * @param height (Integer) - height of the cropped image.
 * @return dataURL (URI) - Data URI containing the cropped image.
 */
function crop(x, y, width, height) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var image = document.getElementById('screenshot');

    canvas.height = height;
    canvas.width = width;

    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    return canvas.toDataURL();
}

/**
 * Enables the crop handles on the image.
 */
function setCrop() {
    document.getElementById('screenshot').addEventListener('load', function() {
        $('#screenshot').Jcrop({
            bgColor: 'black',
            bgOpacity: .4,
            onSelect: updateCoords,
            setSelect: [100, 100, 50, 50]
        });
        $('#crop-button').button({
            disabled: false
        });
    });
}

/**
 * Disables the crop handles on the image.
 */
function disableCrop() {
    $('#crop-button').button({
        disabled: true
    });
    $('#crop-button').off('click');
    $('#crop-button').button('refresh');
}

/**
 * Creates and sends an 'update' event. This event is used to communicate
 * with the background.js/index.js script and requests that the current
 * user information be updated (used when server selected or added).
 */
function sendUpdateEvent() {
    var updateEvent = new Event('update');
    document.getElementById('user-form').dispatchEvent(updateEvent);
}

/**
 * Sends a GET request to a Review Board server for a specified
 * user's review requests. On success, it sets the review request
 * select element to contain all the review requests obtained.
 *
 * @param serverUrl (String) - URL of server that request is being sent to.
 * @param username (String) - Username of user whose Review Requests we want.
 */
function reviewRequests(serverUrl, username) {
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
                rrSelect.options[0].selected = true;
                $('#rr-select').selectmenu({
                    width: '35%'
                });
                $('#rr-select').selectmenu('refresh');
                setSelectMenuWidth('rr-select', 'rr-overflow');
            }
        }
    });
}

/**
 * Sends a POST request to a Review Board server for a specified
 * user's review request. On success, it attaches the screenshot file
 * to the user's review request.
 *
 * @param serverUrl (String) - URL of server we wish to send request to.
 * @param username (String) - Username of user whose Review Request we want.
 * @param apiKey (String) - API Key for the given user.
 * @param revRequest (String) - Review request id we wish to update.
 * @param screenshotUri (String) - URI of screenshot we wish to send.
 */
function postScreenshot(serverUrl, username, apiKey, revRequest, screenshotUri) {
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

/**
 * Sets the username span in the toolbar.
 *
 * @param username (String) - username to be set in toolbar.
 */
function setUsername(username) {
    $('#username').html('Username: ' + username);
}

/**
 * Sets the screenshot src and optionally resizes the image. Resize option
 * should be removed when crop functionality complete.
 *
 * @param url (String) - URL of the screenshot.
 * @param resize (Boolean) - Boolean specifiying if we wish to resize the image.
 */
function setScreenshotUrl(url, resize) {
    document.getElementById('screenshot').src = url;

    if (resize) {
        document.getElementById('screenshot').addEventListener('load', resizeImage);
    }
}

/**
 * Gets the screenshot URL.
 *
 * @return screenshotURL (URL) - returns URL of screenshot source.
 */
function getScreenshotUri() {
    return document.getElementById('screenshot').src;
}

/**
 * Gets the current value of the selected server.
 *
 * @return serverValue (Integer) - Value associated with selected server.
 */
function getServerValue() {
    var serverSelect = document.getElementById('account-select');
    return serverSelect.options[serverSelect.selectedIndex].value;
}

/**
 * Gets the current value of the selected review request.
 *
 * @return reviewRequestValue (Integer) - id associated with review request.
 */
function getReviewId() {
    return $('#rr-select').val();
}

/**
 * Sets the save_user.js and user_form.js script for Chrome. Firefox sets
 * the scripts manually in its `index.js` file.
 */
function setScript() {
    var head = document.getElementsByTagName('head')[0];
    var saveScript = document.createElement('script');
    var userScript = document.createElement('script');

    saveScript.src = 'js/save_user.js';
    userScript.src = 'js/user_form.js';
    head.appendChild(saveScript);
    head.appendChild(userScript);
}

/**
 * Listener that allows content scripts to pass messages to this script.
 * The message contains an option for which function we wish to execute
 * and also contains any data necessary for those functions.
 */
window.addEventListener('addon-message', function(event) {
    switch(event.detail.option) {
        case 'setUsername':
            setUsername(event.detail.username);
            break;
        case 'setReviewRequests':
            reviewRequests(event.detail.serverUrl, event.detail.username);
            break;
        case 'setServers':
            setServers(event.detail.users);
            break;
        case 'setScreenshotUrl':
            setScreenshotUrl(event.detail.url, true);
            break;
        case 'sendScreenshot':
            postScreenshot(event.detail.serverUrl,
                           event.detail.username,
                           event.detail.apiKey,
                           event.detail.reviewRequest,
                           event.detail.screenshotUri);
            break;
        case 'setCrop':
            setCrop();
            break;
        default:
            break;
    }
})

/**
 * Sets Jquery UI elements along with the crop and toast options.
 */
$(document).ready(function() {
    $('#send-button').button();
    $('#account-select').selectmenu({
        width: '25%'
    });
    $('#rr-select').selectmenu({
        width: '35%'
    });

    $('#crop-button').button({
        disabled: true
    });
    $('#crop-button').button().mousedown(function() {
        var x = $('#x').val();
        var y = $('#y').val();
        var w = $('#w').val();
        var h = $('#h').val();
        document.getElementById('screenshot').src = crop(x, y, w, h);
        document.getElementById('screenshot').style.visibility = 'visible';
        document.getElementById('screenshot').style.display = 'block';
        document.getElementById('screenshot').style.height = '100%';
        document.getElementById('screenshot').style.width = 'auto';
        $('.jcrop-holder').hide(0, function() {
            $(this).remove();
        });
    });
    $('#crop-button').button().mouseup(function() {
        disableCrop();
    })

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

/**
 * Functions that execute when an AJAX request starts and ends.
 */
$(document).ajaxStart(function() {
    $('#loading-div').show();
});

$(document).ajaxStop(function() {
    $('#loading-div').hide();
});

/**
 * Functions below are exported under the module name 'screenshot'
 */
exports.addServerToList = addServerToList;
exports.getReviewId = getReviewId;
exports.getScreenshotUri = getScreenshotUri;
exports.getServerValue = getServerValue;
exports.postScreenshot = postScreenshot;
exports.reviewRequests = reviewRequests;
exports.setCrop = setCrop;
exports.setScreenshotUrl = setScreenshotUrl;
exports.setScript = setScript;
exports.setServers = setServers;
exports.setUsername = setUsername;