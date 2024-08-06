// Initialize variables
const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const totalScoreSpan = document.getElementById("total-score-span"); // Element to display total score

let score = 0;
let level = 1;
let isJumping = false;
let gravity = 0.9;
let gameOver = false;
let cactusSpeed = 2000; // Initial speed in milliseconds (doubled for half-speed)
let checkCollision;

// Load total score from local storage, or initialize it if not present
let total = parseInt(localStorage.getItem("totalScore")) || 0;
totalScoreSpan.textContent = total; // Display the initial total score

// Array of obstacle images
const obstacles = [
  "./assets/images/obsticle-1.png",
  "./assets/images/obsticle-2.png",
  "./assets/images/obsticle-3.png",
  "./assets/images/obsticle-4.png",
  "./assets/images/obsticle-5.png",
  "./assets/images/obsticle-6.png",
];

// Function to update cactus image based on level
function updateCactusImage(level) {
  if (level > 5) {
    // Random obstacle for level 4 and above
    const randomIndex = Math.floor(Math.random() * obstacles.length);
    console.log("random index ---> ", randomIndex);
    cactus.style.backgroundImage = `url('${obstacles[randomIndex]}')`;
  } else {
    // Set specific obstacle for levels 1 to 3
    cactus.style.backgroundImage = `url('${obstacles[level]}')`;
  }
}

// Jump function
function jump() {
  if (isJumping || gameOver) return; // Prevent jump if already jumping or game is over
  let position = 0;
  isJumping = true;

  let timerId = setInterval(() => {
    if (position >= 150) {
      // Halved the max jump height
      clearInterval(timerId);

      // Move down
      let downTimerId = setInterval(() => {
        if (position <= 0) {
          clearInterval(downTimerId);
          isJumping = false;
        }
        position -= 5; // Halved the downward movement
        position *= gravity;
        dino.style.bottom = position + "px";
      }, 40); // Doubled the interval time for slower descent
    }

    // Move up
    position += 20; // Halved the upward movement
    position *= gravity;
    dino.style.bottom = position + "px";
  }, 40); // Doubled the interval time for slower ascent
}

// Start game function
function startGame() {
  // Reset game state
  score = 0;
  level = 1;
  gameOver = false;
  scoreElement.textContent = score;
  levelElement.textContent = level;
  cactusSpeed = 2000; // Reset speed to half

  // Remove the start button
  const startButton = document.getElementById("start-game-image");
  if (startButton) {
    startButton.remove();
  }

  // Set initial cactus speed and image
  setCactusSpeed(cactusSpeed);
  updateCactusImage(level);

  // Check for collisions and update score
  checkCollision = setInterval(() => {
    const dinoBottom = parseInt(
      window.getComputedStyle(dino).getPropertyValue("bottom")
    );
    const cactusLeft = parseInt(
      window.getComputedStyle(cactus).getPropertyValue("left")
    );

    if (cactusLeft > 0 && cactusLeft < 40 && dinoBottom <= 40) {
      clearInterval(checkCollision);

      // Update the total score
      total += score;
      totalScoreSpan.textContent = total; // Update total score display

      // Save the total score to local storage
      localStorage.setItem("totalScore", total);

      gameOver = true;
      cactus.style.animation = "none";

      // Add the start button back to the DOM
      addStartButton();
    }

    if (!gameOver) {
      score += level;
      scoreElement.textContent = score;

      // Level up every 200 points
      if (3000 > score && score % 200 === 0) {
        level++;
        levelElement.textContent = level;

        // Update cactus image and speed
        updateCactusImage(level);
        cactusSpeed *= 0.99; // Increase cactus speed by 1%
        setCactusSpeed(cactusSpeed);
      } else if (cactusLeft >= -28 && cactusLeft <= -23) {
        updateCactusImage(level);
      }
    }
  }, 50);
}

// Set cactus speed function
function setCactusSpeed(speed) {
  cactus.style.animation = `cactusMove ${speed / 1000}s infinite linear`;
}

// Add start button function
function addStartButton() {
  const button = document.createElement("img");
  button.id = "start-game-image";
  button.src = "./assets/images/start-game.png";
  button.alt = "Start Game";
  button.className = "start-game-image";

  button.addEventListener("click", () => {
    if (gameOver || score === 0) {
      // Reset game elements if the game was previously over or if it's the initial start
      cactus.style.animation = "none";
      dino.style.bottom = "0px";
      setTimeout(startGame, 100); // Delay restart to reset animation
    }
  });

  document.body.appendChild(button);
}

// Add event listener to the document for the click event to trigger jump
document.addEventListener("click", jump);

// Add event listener for the initial start button
document.getElementById("start-game-image").addEventListener("click", () => {
  startGame();
});
