const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    // Get x position from CSS
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    // Get y position from CSS
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    // getBoundingClientRect is native function
    return this.ballElem.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = {x: 0};
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      // Generate random direction between 0-360 degrees
      const heading = randomNumberBetween(0, 2 * Math.PI); // 2 * Math.PI = 360 degrees
      // Convert direction to x and y position. (Unit vector)
      this.direction = {x: Math.cos(heading), y: Math.sin(heading)};
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();

    // Check if ball has gone past bottom or top of screen, and flip y-direction if it does.
    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }

    // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    // If paddle collision occurs, flip x-direction.
    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
    }

    // Horisontal rebound. Debugging only.
    // if (rect.right >= window.innerWidth || rect.left <= 0) {
    //   this.direction.x *= -1;
    // }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Check for collision with paddles
function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}