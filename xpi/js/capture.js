/**
 * Captures all visible content in the browser.
 */
var canvas = content.document.createElement('canvas');
canvas.width = content.window.innerWidth;
canvas.height = content.window.innerHeight;

var ctx = canvas.getContext('2d');
ctx.drawWindow(content.window, content.window.scrollX, content.window.scrollY,
               canvas.width, canvas.height, 'rgb(255,255,255)');

var dataUrl = canvas.toDataURL();
sendAsyncMessage('dataUrl', dataUrl);