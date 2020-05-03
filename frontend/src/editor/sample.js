export const sample = `// Sample from https://codepen.io/kulturdesign/pen/wKQNNX
var objRotateX = 0;
var objRotateY = 0;
var objRotateZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(230);
  doAnimate();
  objRotate();
  drawModel();
}

function drawModel() {
  var spikeCount = 1000;
  var spikeMaxLen = height/10;
  var groupRadius = (height/2) - (height/10);
  
  for (var s=0; s < spikeCount; s++) {
    
    var noiseCoord = s;
    var rnd = lerp(-1,1,noise(noiseCoord));

    
    // translate
    rotateY(PI*rnd);
    rotateZ(PI*rnd);
    translate(groupRadius,0,0); 
    
    plane(rnd * spikeMaxLen,0.5);
    
    //reset translation
    translate(-groupRadius,0,0);  
    rotateY(-(PI*rnd));
    rotateZ(-(PI*rnd));
  }
}

function doAnimate() {
  // increment animation variables
  objRotateX -= 0.1;
  objRotateY -= 0.1;
  objRotateZ -= 0.1;
}

function objRotate() {
  rotateX(radians(objRotateX));
  rotateY(radians(objRotateY));
  rotateZ(radians(objRotateZ));
}`;