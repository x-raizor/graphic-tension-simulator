/**
 * INTERACTIONS
 */

function mouseClicked() { 

  var newSize = random(MIN_SIZE, MAX_SIZE);
  if (getNearestDistance() > newSize) {
    objects.push([mouseX, mouseY, newSize]);
  }
  return false; // prevent default
}


function mousePressed() {
  pickedObjectIndex = getNearest();
  if (pickedObjectIndex < 0) pickedObjectIndex = objects.length - 1;
  return false; // prevent default
}


function mouseReleased() {
  pickedObjectIndex = -1;
  return false; // prevent default
}


function mouseDragged() {
  if (isScaling) {  
    // SCALE
    var amount = DRAG_AMOUNT * // scale factor 
      sign() * // direction
      dist(pmouseX, pmouseY, mouseX, mouseY);
    // adjust size then dragg
    var newSize = max(MIN_SIZE, objects[pickedObjectIndex][2] + amount);
    objects[pickedObjectIndex][2] = newSize;
    if (newSize > MIN_SIZE) { 
      // correct center
      objects[pickedObjectIndex][0] -= amount/2;
      objects[pickedObjectIndex][1] -= amount/2;
    }

  } else {
    // MOVE
    objects[pickedObjectIndex][0] += mouseX - pmouseX;
    objects[pickedObjectIndex][1] += mouseY - pmouseY;
  }
  return false; // prevent default
}


function keyPressed() {

  if (key == ' ') {
    isSimulating = !isSimulating;
  } else if (keyCode == 'c') {
    objects =  new Array();
    objects_all =  new Array().concat(obstacles);
  }

  switch (keyCode) {
 
  case DOWN_ARROW:
    showResultForces = !showResultForces;
    break;

  case UP_ARROW:
    showTension = !showTension;
    break;

  case RIGHT_ARROW:
    showDisplacements = !showDisplacements;
      break;
      
  case LEFT_ARROW:
    showFrame = !showFrame;
      break;

  case SHIFT:
    isScaling = true;
    break;
  }
  return false; // prevent default
}

function keyReleased() {

  switch (keyCode) {

    case DOWN_ARROW:
      showResultForces = !showResultForces;
      break;

    case UP_ARROW:
      showTension = !showTension;
      break;

    case RIGHT_ARROW:
      showDisplacements = !showDisplacements;
        break;
        
    case LEFT_ARROW:
      showFrame = !showFrame;
        break;

    case SHIFT:
      isScaling = false;
      break;
  }
  return false; // prevent default
}