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


/* .Line Drawer. */

var canvas = null;
var wrapper = null;
var lastPlanet = null;
var elements = null;
var canvasCtx = null;
var visitedPlanets = [];

var getCanvasCtx = function() {
    if (canvasCtx == null) {
        var c=canvas.get(0);
        var ctx=c.getContext("2d");
        ctx.beginPath();
        canvasCtx = ctx;
    }
    return canvasCtx;
}

var drawLine = function(fromX,fromY,toX,toY) {
    var ctx = getCanvasCtx();
    ctx.moveTo(fromX,fromY);
    ctx.lineTo(toX,toY);

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ff0000';
    
    ctx.stroke();
}

positionCanvas = function(){
    console.log(elements.offset().top+':'+elements.offset().left);
    canvas.css({
        position: 'absolute',
        height: wrapper.height(),
        width: wrapper.width(),
        top: elements.offset().top * -1,
        left: elements.offset().left * -1

    }).attr({
        height: wrapper.height(),
        width: wrapper.width()
    });

    drawLines();
}
var drawLines = function() {
    var lastPlanet = null;
    for (i in visitedPlanets) {
        planet = visitedPlanets[i];
        console.log(elements.position().left);
        if (lastPlanet !== null) {
            drawLine(
                lastPlanet.offset().left + lastPlanet.width() / 2 - planePosition.left,
                lastPlanet.offset().top + lastPlanet.height() / 2 - planePosition.top,
                planet.offset().left + planet.width() / 2 - planePosition.left,
                planet.offset().top + planet.height() / 2 - planePosition.top
            );
        }
        lastPlanet = planet;
    }            
} 
var addPlanet = function(isWindow) {
    if (visitedPlanets.length === null) {
        console.log('last planet set');
        visitedPlanets.push($(this));
        return;
    }
    visitedPlanets.push($(this));

    drawLines();
}


$(window).resize(function(){
    positionCanvas();
});
$(document).bind("planeMoved", function(){
    positionCanvas();
});

jQuery(function($){
    canvas = $('canvas#lines');
    wrapper = $('.Wrapper');
    elements = $('.Elements');
    
    planePosition = {
        left: elements.position().left,
        top: elements.position().top
    }
    
    
    canvas.css({
        position: 'absolute',
        height: wrapper.height(),
        width: wrapper.width(),
        top: wrapper.height() / 2 * -1,
        left: wrapper.width() / 2 * -1
    }).attr({
        height:wrapper.height(),
        width:wrapper.width()
    });

    $('.BigPlanet a, .MediumPlanet a').click(addPlanet);
    $('.SmallPlanet').mouseover(addPlanet);
});


/* Backdrop */

var backdrop = $('.backdrop');
var backdropContent = $('.backdrop-content');

$('.BigPlanet a, .MediumPlanet a').click(function(){
    var content = $(this).closest('.planet').find('.content').clone();
    
    backdrop.animate({
        opacity:0.5,
        display:'block'
    },500,function(){
      backdropContent
          .empty()
          .append(content)
          .show();
    }).show();
});
backdrop.click(function(){
    backdrop.hide();
    backdropContent.hide(); 
});


