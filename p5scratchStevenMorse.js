let img;
let dotSize = 6; // Adjust this value to change the size of the dots
let thresholdValue = 20; // Adjust this value to change the brightness threshold
let dots = []; // Array to store dot objects
let mass = 1; // Mass of the dots
let springConstant = 0.03; // Adjust this value to control the springiness (higher value for faster movement)
let dampingCoefficient = 0.13; // Adjust this value to control damping (higher value for quicker damping)
let mouseInteractionRadius = 20; // Radius for mouse interaction
let tintFactor = 0; // Initial tint factor

function preload() {
  img = loadImage('stevenbanner.png'); // Load your black and white image
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels(); // Load pixel data from the image

  // Initialize dots with a reduced number by increasing the skip value
  let skip = 3; // Increase this value to reduce the number of dots
  for (let x = 0; x < img.width; x += skip) {
    for (let y = 0; y < img.height; y += skip) {
      // Get the color of the pixel at (x, y)
      let pixelColor = img.get(x, y);

      // Check if the pixel is black based on the brightness threshold
      if (brightness(pixelColor) < thresholdValue) {
        let dot = new Dot(x, y, x / img.width); // Pass x-coordinate as a factor of width
        dots.push(dot);
      }
    }
  }
}

function draw() {
  background(255); // White background
  beginShape(); // Start batch drawing

  for (let dot of dots) {
    dot.update();
    dot.display();
  }

  endShape(); // End batch drawing
}

function mouseMoved() {
  for (let dot of dots) {
    if (dist(dot.x, dot.y, mouseX, mouseY) < mouseInteractionRadius) {
      dot.interact(mouseX, mouseY);
    }
  }
}

function mouseClicked() {
  for (let dot of dots) {
    dot.returnToOrigin();
  }
}

class Dot {
  constructor(x, y, factor) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.isMousedOver = false;
    this.targetX = x; // Target X position for interpolation
    this.targetY = y; // Target Y position for interpolation
    this.velocityX = 0; // Velocity in X direction
    this.velocityY = 0; // Velocity in Y direction
    this.tintFactor = factor; // Factor based on x-coordinate for tint
    this.returningToOrigin = false;
  }

  update() {
    if (this.isMousedOver && !this.returningToOrigin) {
      // Calculate the force exerted by the spring
      let forceX = (this.targetX - this.x) * springConstant;
      let forceY = (this.targetY - this.y) * springConstant;

      // Calculate the damping force
      let dampingForceX = -this.velocityX * dampingCoefficient;
      let dampingForceY = -this.velocityY * dampingCoefficient;

      // Calculate the acceleration using Newton's second law (F = ma)
      let accelerationX = (forceX + dampingForceX) / mass;
      let accelerationY = (forceY + dampingForceY) / mass;

      // Update the velocity
      this.velocityX += accelerationX;
      this.velocityY += accelerationY;

      // Update the position
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    if (this.returningToOrigin) {
      // Calculate the force exerted by the spring
      let forceX = (this.targetX - this.x) * springConstant;
      let forceY = (this.targetY - this.y) * springConstant;

      // Calculate the damping force
      let dampingForceX = -this.velocityX * dampingCoefficient;
      let dampingForceY = -this.velocityY * dampingCoefficient;

      // Calculate the acceleration using Newton's second law (F = ma)
      let accelerationX = (forceX + dampingForceX) / mass;
      let accelerationY = (forceY + dampingForceY) / mass;

      // Update the velocity
      this.velocityX += accelerationX;
      this.velocityY += accelerationY;

      // Update the position
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  display() {
    // Interpolate the dot's color based on its x-coordinate and tintFactor
    let dotColor = lerpColor(color(0, this.tintFactor * 255, 0), color(255), this.tintFactor);
    fill(dotColor);
    noStroke(); // No outline
    ellipse(this.x, this.y, dotSize, dotSize); // Draw a dot
  }

  interact(mx, my) {
    let d = dist(this.x, this.y, mx, my);
    if (d < mouseInteractionRadius) {
      this.isMousedOver = true;
      // Set a random target position when moused over
      this.targetX = random(width);
      this.targetY = random(height);
      this.returningToOrigin = false;
    } else {
      this.isMousedOver = false;
    }
  }

  returnToOrigin() {
    this.targetX = this.originalX;
    this.targetY = this.originalY;
    this.returningToOrigin = true;
  }
}
