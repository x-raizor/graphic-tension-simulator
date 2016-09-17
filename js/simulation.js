
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

var GAP = 80; // margin for initial points
var MIN_SIZE = 10; // object minimum size
var MAX_SIZE = 200; // object maximum size
var CAPACITANCE = 15; // electrical charge capacity, 'electro viscocity'
var DRAG_AMOUNT = 0.5; //  scale factor of dragging for mass scale 
var FORCE_SCALE = 130; // forces lines multiplicator
var FIELD_SCALE = 5; // tension field lines multiplicator
var TENSION_FIELD_STEP = 10;


var w = 601; // simulation window width
var h = 306; // height
var frameAspectRatio = 16/9;

// frame particles characteristics
var cornerWeight = 0;  // weights in corners
var borderStep = 20;   // distance between frame particles
var borderWeight = 30; //w * h / ((w + h)/borderStep); // weights on frame

var pickedObjectIndex = -1; // buffer for clicked object index

var showTension = true; // field picture
var showDisplacements = false; // displacemens lines
var showResultForces = false; // resulrint Forces-arrows
var showFrame = false;
var isScaling = true;
var isFramed = true; // mass-electric constraints on frame boundary
var isSimulating = true; // animation trigger

var objects =  new Array();
var obstacles =  new Array();
var objects_all =  new Array();
var delta = new Array();

function setup() {

	//frameRate(60);
	// w = windowWidth;
	// h = windowWidth/frameAspectRatio;
	var canvas = createCanvas(w, h);

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

	var realObjectsNumber = objects.length;
	objects_all = objects.concat(obstacles);  // concatinate

	background(240);
	stroke(0, 0, 255);
	strokeWeight(0.25);

	// calculate accumulative displacements
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
		    	line(x1, y1, x2, y2);
	    	}
		}
	}

	// Draw tension field
	if (showTension) {

		stroke(0, 0, 0);
		strokeWeight(0.1);

	 	for (var x = 0; x < width; x += TENSION_FIELD_STEP) {
	    	for (var y = 0; y < height; y += TENSION_FIELD_STEP) {
	     		var _delta = [0, 0];
	    		for (var k = 0; k < objects_all.length; k++) {
			     	var _x = objects_all[k][0];
			     	var _y = objects_all[k][1];
			     	var squareMass = area(objects_all[k][2]);
			     	//if (squareMass > dist(x, y, _x, _y)) continue;
			     	var __delta = calculateDelta(x, y, _x, _y, squareMass);
			     	_delta[0] += __delta[0] * FIELD_SCALE; 
			     	_delta[1] += __delta[1] * FIELD_SCALE;
	    		}
	      		line(x, y, x + _delta[0], y + _delta[1]);
	    	}
		}
	}


	// Simulate and Draw objects
	for (var i = 0; i < realObjectsNumber; i++) {

		if (isSimulating) {
			// simulate: add displacements to coords
			objects[i][0] += correctShift(delta[i][0]);
			objects[i][1] += correctShift(delta[i][1]);
		}

		// draw objects
		fill(0, 255);
		noStroke();
		ellipse(objects[i][0], objects[i][1], objects[i][2], objects[i][2]);

		if (showResultForces) {
			var x1 = objects[i][0] + objects[i][2]/2;
			var x2 = x1 + delta[i][0] * FORCE_SCALE;
			var y1 = objects[i][1] + objects[i][2]/2;
			var y2 = y1 + delta[i][1] * FORCE_SCALE;

			stroke(255, 0, 0, 100);
			fill(255, 0, 0, 100);
			//drawArrow(x1, y1, x2, y2, 0, 3, true);
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
  	
}