export const sample = `
// Source: https://editor.p5js.org/sh5304@nyu.edu/sketches/S1twNBni7

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Enable 3D drawing
}

function draw() {
  background(25,23,22);
  noFill();
  stroke(192,87,70);
  translate(0, 0, -100);
  rotateZ(0.40578905); // Earth axial tilt = 23.25 degrees = 0.405 radians
  rotateY(millis() / 10000);//rotate slowly 
  sphere(300);

  //make the circle sphere
  push();
  noFill();
  // stroke(147,163,177); //grey blue
  stroke(198,161,91);//yellow
  rotateY(millis() / 5000);
  sphere(30);
  pop();
}
`;