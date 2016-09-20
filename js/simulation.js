
/**
 *  Graphical Tension Visualizer. Circles
 *
 *  Coded by Andrew Shapiro
 *  in collaboration with Igor Shtang
 *
 *  Controls:
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  c           clear screen
 *  space       launch/stop simulation
 *  click       add an object with random size
 *  drag        moves object
 *  shift+drag  changes object size
 *  ↓           trigger result forces visibility, red-arrowed
 *  ↑           trigger tension field visibility
 *  ←           trigger frame visibility
 *  →           trigger displacement direction visibility
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

var GAP = 40; // margin for initial points
var MIN_SIZE = 40; // object minimum size
var MAX_SIZE = 40; // object maximum size
var CAPACITANCE = 15; // electrical charge capacity, 'electro viscocity'
var DRAG_AMOUNT = 1; //  scale factor of dragging for mass scale 
var FORCE_SCALE = 130; // forces lines multiplicator
var FIELD_SCALE = 20; // tension field lines multiplicator
var TENSION_FIELD_STEP = 15;

// frame particles characteristics
var cornerWeight = 0;  // weights in corners
var borderStep = 30;   // distance between frame particles
var borderWeight = 60; //w * h / ((w + h)/borderStep); // weights on frame

var w = 601; // simulation window width
var h = 306; // height
var frameAspectRatio = 5/2;

var pickedObjectIndex = -1; // buffer for clicked object index
//var scaleSign = 0; // buffer of sign for scaling
var isScaling = false; // flag of object scaling while drug-n-drop
var isDeleting = false; // flag of object deleting
var isMoving = false; // flag of object moving

var showTension = true; // field picture
var showDisplacements = false; // displacemens lines
var showResultForces = false; // resulrint Forces-arrows
var showFrame = false;
var isFramed = true; // mass-electric constraints on frame boundary
var isSimulating = true; // animation trigger

var objects =  new Array();
var obstacles =  new Array();
var objects_all =  new Array();
var delta = new Array();

//p5.disableFriendlyErrors = true;

function setup() {

	//frameRate(60);
	w = $('#sketch-holder').width();
	h = w / frameAspectRatio;
	var canvas = createCanvas(w, h);

	// setup an interaction inside simulator canvas
	canvas.mousePressed(function() {
		if (objects.length != 0) {
			var sample = getNearest(mouseX, mouseY);
			pickedObjectIndex = sample[0];
			var minDistance = sample[1];
			if (pickedObjectIndex < 0) return;
			if (isDeleting) {
				objects.splice(pickedObjectIndex, 1);
				objects_all.splice(pickedObjectIndex, 1);
				return;
			}
			var objectSize = objects[pickedObjectIndex][2]/2;
			if (minDistance < objectSize) return;
		}

		var newSize = random(MIN_SIZE, MAX_SIZE);
		objects.push([mouseX, mouseY, newSize]);
		pickedObjectIndex = -1;

		return false; // prevent default
	});

	canvas.mouseReleased(function() {
		pickedObjectIndex = -1;
		scaleSign = 0;
		isMoving = false;
		return false; // prevent default
	});


	// initiate with objects
	objects.push([GAP, GAP, 30]);
	objects.push([GAP, height - GAP, 30]);
	objects.push([width - GAP, height - GAP, 30]);
	objects.push([width - GAP, GAP, 30]);


	if (isFramed) {                    
		// horizontal frame part
		for (var x = 0; x <= width; x += borderStep) {
		  obstacles.push([x, 0, borderWeight]);
		  obstacles.push([x, height, borderWeight]);
		}

		// vertical frame part
		for (var y = 0; y <= height; y += borderStep) {
		  obstacles.push([0, y, borderWeight]);
		  obstacles.push([width, y, borderWeight]);
		}

		// concentrators in the corners
		obstacles.push([0, 0, cornerWeight]);
		obstacles.push([width - cornerWeight, height - cornerWeight, cornerWeight]);
		obstacles.push([width - cornerWeight, 0, cornerWeight]);
		obstacles.push([0, height - cornerWeight, cornerWeight]);
	}
	// Move the canvas so it's inside our <div id="sketch-holder">.
	canvas.parent('sketch-holder');

}


function draw() {

	background(240);

	var fps = frameRate();
	fill(0);
	stroke(255);
	text('FPS: ' + fps.toFixed(0), 10, height - 10);

	stroke(0, 0, 255);
	strokeWeight(0.25);


	var realObjectsNumber = objects.length;
	objects_all = objects.concat(obstacles);  // concatinate

	// calculate accumulative displacements
	// TODO: optimize. no need to calulate it when simulation is stopped
	var delta = new Array() // float[realObjectsNumber][2]; // [[0, 0]] * real_objects;
	for (var i = 0; i < realObjectsNumber; i++) delta.push([0, 0]);

	for (var i = 0; i < realObjectsNumber; i++) {
		for (var j = 0; j < objects_all.length; j++) {
		    if (i == j) continue;
		    var _delta = calculateDeltaByIndex(j, i, objects_all);
		    //delta[i] = [];
		    delta[i][0] += _delta[0];
		    delta[i][1] += _delta[1];
		    //console.log(_delta, i, j);
		    
		    if (showDisplacements) {
		    	var x1 = objects[i][0];
		    	var x2 = x1 + _delta[0] * FORCE_SCALE;
		    	var y1 = objects[i][1];
		    	var y2 = y1 + _delta[1] * FORCE_SCALE;
		    	drawArrow(x1, y1, x2, y2, 0.5, 2, false);
		    	//line(x1, y1, x2, y2);
	    	}
		}
	}

	// Draw tension field
	if (showTension) {

		strokeWeight(1.5);

	 	for (var x = 0; x < width; x += TENSION_FIELD_STEP) {
	    	for (var y = 0; y < height; y += TENSION_FIELD_STEP) {
	     		var _delta = [0, 0];
	    		for (var k = 0; k < objects_all.length; k++) {
			     	var _x = objects_all[k][0];
			     	var _y = objects_all[k][1];
			     	var squareMass = area(objects_all[k][2]);
			     	var __delta = calculateDelta(x, y, _x, _y, squareMass);
			     	_delta[0] += __delta[0]; 
			     	_delta[1] += __delta[1];
	    		}
	    		var vec = createVector(_delta[0], _delta[1]);
	    		var closeObject = getNearest(x, y);
	    		var objIndex = closeObject[0];
	    		var magnitude = 1;
	    		if (objIndex > -1) {
	    			var closeCharge = objects[objIndex][2];
	    			magnitude = 1/closeCharge;
	    		}
	    		vec.mult(magnitude);
	    		var vecLength = vec.mag();
	    		var thinkness = map(vecLength, 0, 100, 30, 255);
	    		stroke(0, thinkness);
  				vec.normalize();
	      		line(x, y, x + FIELD_SCALE * vec.x, y + FIELD_SCALE * vec.y);
	      		
	    	}
		}
	}


	// Simulate and Draw objects
	for (var i = 0; i < realObjectsNumber; i++) {

		if (isSimulating) { 
			objects[i][0] += correctShift(delta[i][0]); // simulate: add displacements to coords
			objects[i][1] += correctShift(delta[i][1]);
		}

		// draw objects
		fill(0, 30);
		noStroke();
		if (i == pickedObjectIndex) fill(255, 0, 0);
		ellipse(objects[i][0], objects[i][1], objects[i][2], objects[i][2]);

		if (showResultForces) {
			var x1 = objects[i][0] + objects[i][2]/2;
			var x2 = x1 + delta[i][0] * FORCE_SCALE;
			var y1 = objects[i][1] + objects[i][2]/2;
			var y2 = y1 + delta[i][1] * FORCE_SCALE;

			stroke(255, 0, 0, 100);
			fill(255, 0, 0, 100);
			line(x1, y1, x2, y2);
		}
	}

	if (showFrame) {
	  for (item of obstacles) {
	    var halfSize = item[2]/2;
	    var size = item[2];
	    ellipse(item[0], item[1], size, size);
	  }
	}

	//Cursors	
	fill(0);
	noStroke();
	if (isDeleting) {
		cursor(ARROW);
		text("delete", mouseX + 12, mouseY + 10);
	} else if (isScaling) {
		cursor(ARROW);
		text("zoom", mouseX + 12, mouseY + 10);
	} else if (isMoving) {
		cursor(MOVE)
	} else {
		cursor(CROSS); // cursor(HAND)
	}
  	
}