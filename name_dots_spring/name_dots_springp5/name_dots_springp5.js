let fontLarge, fontSmall;
const mainText = "Steven Morse";
const subText = "Designer - Engineer - Educator - Systems Thinker";
const dotSize = 5;
let dots = [];
const springStrength = 0.05;
let restingPositions = [];
const restoreDelay = 3000; // 3 seconds in milliseconds
let lastInteractionTime = 0; // Keep track of the last interaction time
let restoring = false;

// Generate tints for each letter with increasing (r, g, b) values
let letterTints = [];

function preload() {
  fontLarge = loadFont('Roboto-Regular.ttf');
  fontSmall = loadFont('Roboto-Regular.ttf');
}

function setup() {
  createCanvas(1000, 500); // Set the canvas size
  background(255);

  // Calculate text dimensions
  let mainTextWidth = textWidth(mainText);
  let mainTextHeight = textAscent() + textDescent();
  let subTextWidth = textWidth(subText);
  let subTextHeight = textAscent() + textDescent();

  // Calculate positions for the main text and sub text to center them
  let mainTextX = (width - mainTextWidth) / 2;
  let mainTextY = (height - (mainTextHeight + subTextHeight + 30)) / 2; // Center vertically

  let subTextX = (width - subTextWidth) / 2;
  let subTextY = mainTextY + mainTextHeight + 30; // Position below the main text with some spacing

  textFont(fontLarge);
  fill(0);
  text(mainText, mainTextX, mainTextY);

  textFont(fontSmall);
  text(subText, subTextX, subTextY);

  loadDots();
  
  // Generate letter tints
  for (let i = 0; i < mainText.length; i++) {
    letterTints.push(color(i * 10, i * 10, i * 10));
  }
}

function draw() {
  background(255);
  for (let dot of dots) {
    dot.update();
    dot.display();
  }

  // Check if restoring dots is required
  if (!restoring) {
    // Check if not already restoring
    let elapsedTime = millis() - lastInteractionTime;
    if (elapsedTime > restoreDelay) {
      restoreDots();
    }
  }
}

class Dot {
  constructor(x, y, letterIndex) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.targetX = x;
    this.targetY = y;
    this.letterIndex = letterIndex; // Index of the letter in the text
  }

  update() {
    this.vx += (this.targetX - this.x) * springStrength;
    this.vy += (this.targetY - this.y) * springStrength;
    this.vx *= 0.9;
    this.vy *= 0.9;
    this.x += this.vx;
    this.y += this.vy;
  }

  display() {
    fill(letterTints[this.letterIndex]); // Set the fill color based on letter index
    noStroke();
    ellipse(this.x, this.y, dotSize, dotSize);
  }
}

function loadDots() {
  loadPixels();
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      let index = x + y * width;
      let pixelColor = pixels[index];
      if (red(pixelColor) === 0 && green(pixelColor) === 0 && blue(pixelColor) === 0) {
        let letterIndex = int(map(x, 0, width, 0, mainText.length));
        dots.push(new Dot(x, y, letterIndex));
        restingPositions.push({ x, y });
      }
    }
  }
  updatePixels();
}

function mouseMoved() {
  for (let dot of dots) {
    if (dist(mouseX, mouseY, dot.x, dot.y) < 20) {
      dot.targetX = random(width);
      dot.targetY = random(height);
      lastInteractionTime = millis(); // Update the last interaction time
      restoring = false;
    }
  }
  return false;
}

function mousePressed() {
  restoreDots();
}

function restoreDots() {
  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];
    let { x, y } = restingPositions[i];
    dot.targetX = x;
    dot.targetY = y;
  }
  restoring = true;
}
