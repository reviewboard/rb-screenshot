/**
 * Captures all visible content in the browser.
 *
 */

/*
 * Images can be built by repeatedly calling context.drawImage();
 *
 * d = destination canvas, s = source canvas
 * Syntax: context.drawImage(image, dx, dy, dWidth, dHeight);
 * We start with dx = 0, dy = 0, dWidth = imageWidth, dHeight = innerHeight
 *
 * On next loops we will have to modify dy as we need to draw the new screenshot
 * below the previously drawn screenshot.
 *
 * So I'm thinking that on pressing "Capture Area," the popup will create a canvas element on
 * its HTML page and using message passing, will execute chrome.tabs.captureVisibleContent()
 * and then on callback, update the created canvas. When the content script passes back a
 * message that states it's done with the screenshots, the pooup should cleanly exit and remove
 * the canvas.
 *
 */

var dataURIs = [];
var lastScroll = 0;
var total = 0;

createCanvas();
scrollPage(window.scrollY, document.body.clientHeight);

/**
 * Listens to screenshot URI from background.js
 */
chrome.runtime.onMessage.addListener(function(request) {
    if (request.option == 'captured-visible') {
        dataURIs.push(request.screenshot);
    }
});

/**
 * Creates the canvas and sets the dimensions to be the width of the window
 * and height of the entire document.
 */
function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.id = 'rb-screenshot-canvas';
    canvas.style.display = 'none';
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    document.body.appendChild(canvas);
}

/**
 * Removes the created canvas from the page.
 */
function destroyCanvas() {
    var canvas = document.getElementById('rb-screenshot-canvas');
    document.body.removeChild(canvas);
}

/**
 * Draws the passed screenshot into the created canvas.
 *
 * @params screenshot (Data URI) - URI of the screenshot
 * @params totalHeight (int)) - y coordinate to start drawing screenshot
 */
function updateCanvas(screenshot, totalHeight) {
    var image = document.createElement('img');
    var canvas = document.getElementById('rb-screenshot-canvas');
    var ctx = canvas.getContext('2d');

    image.src = screenshot;
    image.addEventListener('load', function() {
        ctx.drawImage(image, 0, totalHeight, window.innerWidth, window.innerHeight);
    });
}

/**
 * Scrolls the page down by the height of the window.
 *
 * @params scrolledY (int) - y coordinate of how far down the page we are
 * @params totalHeight (int)) - total height of the document
 */
function scrollPage(scrolledY, totalHeight) {
    if (scrolledY >= totalHeight) {
        // TODO: Save original scroll position and scroll back to that position.
        // Scrolls back to the top
        window.setTimeout(function() {
            window.scrollTo(0, 0);
            console.log('Final scroll: ' + lastScroll);

            updateCanvas(dataURIs[0], 0);
            updateCanvas(dataURIs[1], 700);

        }, 500)

        return;
    }

    // Set timeout for scrolling and then sending a message to the
    // background script to take a screenshot    
    window.setTimeout(function() {
        var remaining = totalHeight - scrolledY;
        chrome.runtime.sendMessage({option: 'capture-visible'});

        scrolledY = window.innerHeight + window.scrollY;
        window.scrollTo(0, scrolledY);
        if (remaining < window.innerHeight) {
            lastScroll = remaining;
        }
        scrollPage(scrolledY, totalHeight);
    }, 500, scrolledY, totalHeight);
}