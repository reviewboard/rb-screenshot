/**
 * Captures all content in the browser and overlays a crop on the current tab's
 * web content unless that tab already has a crop overlay.
 */
var rbArea = content.document.getElementById('rb-area');

if (!rbArea) {
    var canvas = content.document.createElement('canvas');
    canvas.width = content.document.body.clientWidth;
    canvas.height = content.document.body.clientHeight;

    var ctx = canvas.getContext('2d');
    ctx.drawWindow(content.window, 0, 0,
                   canvas.width, canvas.height, 'rgb(255,255,255)');

    var dataUrl = canvas.toDataURL();

    var area = content.document.createElement('div');
    area.id = 'rb-area';

    var image = content.document.createElement('img');
    image.src = dataUrl;
    image.id = 'rb-image-overlay';
    image.style.cssText = 'position: absolute; top: 0px; left: 0px;';
    area.appendChild(image);
    content.document.body.appendChild(area);
}