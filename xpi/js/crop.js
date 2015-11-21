var jcropAPI;

/**
 * Creates an HTML input element.
 *
 * @param id (String) - ID for the created input element.
 * @return input (Input) - HTML input element.
 */
function createInput(id) {
    var input = document.createElement('input');
    input.type = 'hidden';
    input.id = id;
    input.name = id;

    return input;
}

/**
 * Creates the crop buttons and the container for the buttons.
 */
function createCropButtons() {
    var cropButton = document.createElement('img');
    cropButton.id = 'crop-button';
    cropButton.className = 'crop-container-button';
    cropButton.src = 'resource://rb-screenshot-images/crop.png';
    cropButton.addEventListener('click', function() {
        var dataURL = crop();
        self.port.emit('cropped', dataURL);
        destroy();
    });

    var exitButton = document.createElement('img');
    exitButton.id = 'exit-button';
    exitButton.className = 'crop-container-button'
    exitButton.src = 'resource://rb-screenshot-images/exit.png';
    exitButton.addEventListener('click', function() {
        destroy();
    });

    var divider = document.createElement('div');
    divider.className = 'vertical-divider';

    var div = document.createElement('div');
    div.id = 'crop-button-container';
    div.appendChild(cropButton);
    div.appendChild(divider);
    div.appendChild(exitButton);
    document.body.appendChild(div);
}

/**
 * Creates the form for storing the crop coordinates.
 */
function createCoordinateForm() {
    var coord_form = document.createElement('form');
    coord_form.style.display = 'none';
    var x = createInput('x');
    var y = createInput('y');
    var w = createInput('w');
    var h = createInput('h');
    x.value = 100;
    y.value = 100;
    w.value = 50;
    h.value = 50;
    coord_form.appendChild(x);
    coord_form.appendChild(y);
    coord_form.appendChild(w);
    coord_form.appendChild(h);

    document.getElementById('crop-button-container').appendChild(coord_form);
}

/**
 * Crops the image.
 *
 * @return dataURL (URI) - Data URI containing the cropped image.
 */
function crop() {;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var image = document.getElementById('rb-image-overlay');
    var x = $('#x').val();
    var y = $('#y').val();
    var w = $('#w').val();
    var h = $('#h').val();

    canvas.height = h;
    canvas.width = w;
    context.drawImage(image, x, y, w, h, 0, 0, w, h);

    return canvas.toDataURL();
}

/**
 * Destroys all the elements created and added to the page.
 */
function destroy() {
    jcropAPI.destroy();
    $('#crop-button-container').remove();
    $('#rb-area').remove();
    $('#intro-wrapper').remove();
}

/**
 * Hides the crop buttons.
 */
function hideCropButtons() {
    $('#crop-button-container').css('visibility', 'hidden');
}

/**
 * Shows the crop buttons.
 */
function showCropButtons() {
    $('#crop-button-container').css('visibility', 'visible');
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

    updateCropButtons(c.x2, c.y2);
    showCropButtons();
}

/**
 * Updates the location of the crop buttons.
 *
 * @param x (Integer) - X coordinate of crop box's bottom right corner.
 * @param y (Integer) - Y coordinate of the bottom of the crop box.
 */
function updateCropButtons(x, y) {
    // 45px is the width of the crop image.
    $('#crop-button-container').css({
        'top': y,
        'left': x - document.getElementById('crop-button-container').clientWidth
    });
}

/**
 * Displays the crop box if the user clicks on the overlay.
 * Note: by default, JCrop will remove the crop handles and overlay if the user clicks
 *       on the overlay without dragging out the crop handles.
 */
function resetSelect() {
    var x = Number($('#x').val());
    var y = Number($('#y').val());
    var x2 = x + Number($('#w').val());
    var y2 = y + Number($('#h').val());
    jcropAPI.setSelect([x, y, x2, y2]);
}

/**
 * Shows instructions on how to operate the crop.
 */
function showIntroMessage() {
    var introWrapper = document.createElement('div');
    introWrapper.id = 'intro-wrapper';
    introWrapper.style.top = window.scrollY + 'px';

    var introDiv = document.createElement('div');
    introDiv.id = 'crop-intro';
    introDiv.innerHTML = 'Drag to Capture (Esc to Exit)';
    introWrapper.appendChild(introDiv);

    document.body.appendChild(introWrapper);
    $('#intro-wrapper').show().delay(2500).fadeOut();
}

/**
 * Set up crop box and listeners for destroying the crop box.
 */
$(document).ready(function() {
    var imageOverlay = document.getElementById('rb-image-overlay');

    if (imageOverlay) {
        createCropButtons();

        $('#rb-image-overlay').Jcrop({
            bgColor: 'black',
            bgOpacity: .4,
            onChange: hideCropButtons,
            onSelect: updateCoords,
            onRelease: resetSelect,
            setSelect: [0, 0, 0, 0]
        }, function() {
            jcropAPI = this;
        });

        $(document).keyup(function(event) {
            if (event.keyCode == 27) {
                destroy();
            }
        });

        $(document).on('contextmenu', '.jcrop-holder', function(event) {
            destroy();
        });

        createCoordinateForm();
        showIntroMessage();
    }
});