function distance(x1, y1, x2, y2) {
  /**
   *(float, float, float, float) --> float
   *   Calculate Euclidian distance between two povars
   */
  return Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) );
}


function area(size) {
  /** 
   * Calculates an area of oval
   */
  return size * size;
}


function sign() {
  var x;
  if (abs(mouseX - pmouseX) > abs(mouseY - pmouseY)) {
    x = mouseX - pmouseX;
  } else {
    x = mouseY - pmouseY;
  }
  if (x > 0)
    return 1;
  else if (x < 0) 
    return -1;
  return 0;
}


function getNearest() {
  var minDistance = 1.0e32;
  var bestCandidate = -1;
  for (item of objects) {
    var distance = dist(item[0], item[1], mouseX, mouseY);
    if (distance < minDistance) {
      minDistance = distance;
      bestCandidate = objects.lastIndexOf(item);
    }
  }
  return bestCandidate;
}

function getNearestDistance() {
  var minDistance = 1.0e32;
  for (item of objects) {
    var distance = dist(item[0], item[1], mouseX, mouseY);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}


function calculateDeltaByIndex(i, j, objectsArray) {
  /** (int, int, list) --> (float, float)
   *  Calculates displacement according to the Coulomb's low
   */
  var x1 = objectsArray[i][0];
  var y1 = objectsArray[i][1];
  var x2 = objectsArray[j][0];
  var y2 = objectsArray[j][1];
  var s2 = area(objectsArray[i][2]);
  return calculateDelta(x1, y1, x2, y2, s2);
}


function calculateDelta(x1, y1, x2, y2, s2) {
  /*  Calculates displacement according to the Coulomb's low
   *
   *  F12 = k* q1*q1 * r12/|r12| / |r12|^2,
   *
   *  where k = 1/(4pi epsilon0), epsilon0 = 8.854e-12 [F/m]
   *  and the Newton's equation
   *
   *  F = m * a  →  F = m * dx / dt / dt  →  dx = F / m
   */

  var rx = x2 - x1;
  var ry = y2 - y1;
  var  alfa = CAPACITANCE;  // capacitance
  var  dist = Math.pow( distance(x1, y1, x2, y2), 3);
  if (dist < 1e-12) return [0, 0];
  return [alfa * s2 * rx / dist, alfa * s2 * ry / dist];
}


function correctShift(displacement) {
  //if (displacement > height / 5) return displacement / CAPACITANCE / 1.0;
  return displacement;
}
