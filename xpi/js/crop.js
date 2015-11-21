var jcropAPI;

function createInput(id) {
    var input = document.createElement('input');
    input.type = 'hidden';
    input.id = id;
    input.name = id;

    return input;
}

function createCropButton() {
    var cropButton = document.createElement('img');
    cropButton.id = 'crop-button';
    cropButton.className = 'crop-container-button';
    cropButton.src = 'resource://rb-screenshot-images/crop.png';
    cropButton.addEventListener('click', function() {
        console.log('crop clicked');
    });

    var exitButton = document.createElement('img');
    exitButton.id = 'exit-button';
    exitButton.className = 'crop-container-button'
    exitButton.src = 'resource://rb-screenshot-images/exit.png';
    exitButton.addEventListener('click', function() {
        console.log('exit clicked');
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

function destroy() {
    jcropAPI.destroy();
    $('#crop-button-container').remove();
    $('#rb-area').remove();
}

function hideCropButton() {
    $('#crop-button-container').css('visibility', 'hidden');
}

function showCropButton() {
    $('#crop-button-container').css('visibility', 'visible');
}

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);

    updateCropButton(c.x2, c.y2);
    showCropButton();
}

function updateCropButton(x, y) {
    // 45px is the width of the crop image.
    $('#crop-button-container').css({
        'top': y,
        'left': x - document.getElementById('crop-button-container').clientWidth
    });
}

function resetSelect() {
    var x = Number($('#x').val());
    var y = Number($('#y').val());
    var x2 = x + Number($('#w').val());
    var y2 = y + Number($('#h').val());
    jcropAPI.setSelect([x, y, x2, y2]);
}

$(document).ready(function() {
    var imageOverlay = document.getElementById('rb-image-overlay');

    if (imageOverlay) {
        createCropButton();

        $('#rb-image-overlay').Jcrop({
            bgColor: 'black',
            bgOpacity: .4,
            onChange: hideCropButton,
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
    }
});