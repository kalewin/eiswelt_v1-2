$(document).ready(onDocumentReady);

var mouseIsPressed = false;

var zoom = 1;
var dZoom = 1;

var scrollXPos = 0;
var scrollYPos = 0;

var startScrollXPos = 0;
var startScrollYPos = 0;

var startClientXPos = 0;
var startClientYPos = 0;

// setInterval(onInterval, 40);


function onDocumentReady() {
    
    $(".Wrapper").bind("mousedown", onWrapperMousedown);
    $(document).bind("mouseup", onWrapperMouseup);
    $(".Wrapper").bind("mousemove", onWrapperMousemove);
    $(".Wrapper").bind("gesturechange", onWrapperGestureChange);
    
    $("#zoomInButton").bind("click", onZoomInButtonClick);
    $("#zoomOutButton").bind("click", onZoomOutButtonClick);
    
    $(".SmallPlanet").bind("mouseover", onSmallPlanetMouseOver);
    $(".SmallPlanet").bind("mouseout", onSmallPlanetMouseOut);
    // $(".BigPlanet").bind("click", onBigPlanetClick);
}

function onBigPlanetClick() {
 
    console.log("BigPlanetClick ");
    //$(this).children(".explanation").css("opacity", 1);
}

function onSmallPlanetMouseOver() {
 
    $(this).children(".explanation").css("opacity", 1);
}

function onSmallPlanetMouseOut() {
 
    $(this).children(".explanation").css("opacity", 0);
}

function onWrapperMousedown(event) {
    
    mouseIsPressed = true;
    startClientXPos = event.clientX;
    startClientYPos = event.clientY;
    
    startScrollXPos = scrollXPos;
    startScrollYPos = scrollYPos;
}

function onWrapperMouseup() {
    
    mouseIsPressed = false;
}

function onWrapperMousemove(event) {
    if (!mouseIsPressed)
        return;
    
    var distX = startClientXPos - event.clientX;
    var distY = startClientYPos - event.clientY;
    
    scrollXPos = startScrollXPos - distX/zoom;
    scrollYPos = startScrollYPos - distY/zoom;
    
    updateZoomAndPosition();
    
    console.log("mouse move ", scrollXPos, scrollYPos);
}

function onWrapperGestureChange(event) {
    
    console.log("gesture", event);
}

function onInterval() {
    
    if (dZoom < 0.1)
        dZoom = 0.1;
    
    if (dZoom > 2)
        dZoom = 2;
    
    zoom += (dZoom - zoom) * 0.2;
    
    updateZoomAndPosition();
    
    if (Math.abs(dZoom-zoom) > 0.2)
        setTimeout(onInterval, 40);
}

function updateZoomAndPosition() {
    
    $(".Elements").css({left:scrollXPos,top:scrollYPos});
    $(".Zoomer").css({transform:"scale("+zoom+")"});
    $(document).trigger('planeMoved');
}

function onZoomInButtonClick() {
    
    dZoom+=0.4;
    onInterval();
}

function onZoomOutButtonClick() {
    
    dZoom-=0.5;
    onInterval();
}