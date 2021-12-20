import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const cpuPaddle = new Paddle(document.getElementById("cpu-paddle"));

const playerScoreElem = document.getElementById("player-score");
const cpuScoreElem = document.getElementById("cpu-score");

let lastTime;

// Update loop. Runs in every single frame.
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    // ball.update(delta, [playerPaddle.rect(), cpuPaddle.rect()]);

    // Pass in delta, and ball y-posiition so CPU can move towards ball trajectory
    cpuPaddle.update(delta, ball.y);

    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    // Change hue based by delta time
    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);

    if (isLose()) {
      handleLose();
    }
  }

  lastTime = time;
  //   console.log(time);
  window.requestAnimationFrame(update);
}

function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
  const rect = ball.rect();

  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    cpuScoreElem.textContent = parseInt(cpuScoreElem.textContent) + 1;
  }

  ball.reset();
  cpuPaddle.reset();
}

document.addEventListener("mousemove", (e) => {
  playerPaddle.position = (e.y / window.innerHeight) * 100;
});

// Every time the program can change something on screen, run update
window.requestAnimationFrame(update);
