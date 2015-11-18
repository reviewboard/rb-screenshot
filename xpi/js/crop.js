function createInput(id) {
    var input = document.createElement('input');
    input.type = 'hidden';
    input.id = id;
    input.name = id;

    return input;
}

function createCropButton() {
    var div = document.createElement('div');
    div.id = 'crop-button-container';
    div.innerHTML = '<img src="resource://rb-screenshot-images/crop.png">';

    document.body.appendChild(div);
}

function createCoordinateForm() {
    var coord_form = document.createElement('form');
    var x = createInput('x');
    var y = createInput('y');
    var w = createInput('w');
    var h = createInput('h');
    coord_form.appendChild(x);
    coord_form.appendChild(y);
    coord_form.appendChild(w);
    coord_form.appendChild(h);

    document.getElementById('crop-button-container').appendChild(coord_form);
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

    // 40px is the width of the crop image.
    $('#crop-button-container').css({
        'top': c.y + c.h,
        'left': c.x + c.w - 40
    });

    showCropButton();
}

$('document').ready(function() {
    var imageOverlay = document.getElementById('rb-image-overlay');

    if (imageOverlay) {
        createCropButton();

        $('#rb-image-overlay').Jcrop({
            bgColor: 'black',
            bgOpacity: .4,
            onChange: hideCropButton,
            onSelect: updateCoords,
            setSelect: [100, 100, 50, 50]
        });

        createCoordinateForm();
    }
});

$(window).on('beforeunload', function() {
    $('#crop-button-container').remove();
});