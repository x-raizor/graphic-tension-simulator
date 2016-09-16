
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

var w = 601; // simulation window width
var h = 306; // height

// frame particles characteristics
var cornerWeight = 0;  // weights in corners
var borderStep = 20;   // distance between frame particles
var borderWeight = 20; //(int) w * h / ((w + h)/borderStep); // weights on frame

var pickedObjectIndex = -1;

var isFullscreen = false; 
var isSimulating = false; // animation trigger
var isFramed = true; // mass-electric constraints on frame boundary

var showTension = true; // field picture
var showDisplacements = false; // displacemens lines
var showResultForces = false; // resulrint Forces-arrows
var showFrame = false;
var isScaling = false;

var objects =  new Array();
var objects_all =  new Array();
var obstacles =  new Array();


function setup() {

	var canvas = createCanvas(windowWidth, 200);

	// Move the canvas so it's inside our <div id="sketch-holder">.
	canvas.parent('sketch-holder');

}


function draw() {
	background(240);
	ellipse(mouseX, mouseY, 50, 50);
  	
}