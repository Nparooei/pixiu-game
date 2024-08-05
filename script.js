const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
let score = 0;
let level = 1;
let isJumping = false;
let gravity = 0.9;
let gameOver = false;
let cactusSpeed = 2000; // Initial speed in milliseconds (doubled for half-speed)
let checkCollision;

// Array of obstacle images
const obstacles = [
    './assets/images/obsticle-1.png',
    './assets/images/obsticle-2.png',
    './assets/images/obsticle-3.png',
    './assets/images/obsticle-4.png',
    './assets/images/obsticle-5.png'
];

// Function to update cactus image based on level
function updateCactusImage(level) {
    if (level >= 4) {
        // Random obstacle for level 4 and above
        const randomIndex = Math.floor(Math.random() * obstacles.length);
        cactus.style.backgroundImage = `url('${obstacles[randomIndex]}')`;
    } else {
        // Set specific obstacle for levels 1 to 3
        cactus.style.backgroundImage = `url('${obstacles[level - 1]}')`;
    }
}

function jump() {
    if (isJumping) return;
    let position = 0;
    isJumping = true;

    let timerId = setInterval(() => {
        if (position >= 150) { // Halved the max jump height
            clearInterval(timerId);

            // Move down
            let downTimerId = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downTimerId);
                    isJumping = false;
                }
                position -= 5; // Halved the downward movement
                position *= gravity;
                dino.style.bottom = position + 'px';
            }, 40); // Doubled the interval time for slower descent
        }

        // Move up
        position += 20; // Halved the upward movement
        position *= gravity;
        dino.style.bottom = position + 'px';
    }, 40); // Doubled the interval time for slower ascent
}

function control(e) {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        jump();
    }
}

function startGame() {
    // Reset game state
    score = 0;
    level = 1;
    gameOver = false;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    cactusSpeed = 2000; // Reset speed to half

    // Remove the start button
    const startButton = document.getElementById('start-game-image');
    if (startButton) {
        startButton.remove();
    }

    // Set initial cactus speed and image
    setCactusSpeed(cactusSpeed);
    updateCactusImage(level);

    // Check for collisions and update score
    checkCollision = setInterval(() => {
        const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue('bottom'));
        const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

        if (cactusLeft > 0 && cactusLeft < 40 && dinoBottom <= 40) {
            clearInterval(checkCollision);
            alert('Game Over! Your Score: ' + score);
            gameOver = true;
            cactus.style.animation = 'none';

            // Add the start button back to the DOM
            addStartButton();
        }

        if (!gameOver) {
            score++;
            scoreElement.textContent = score;

            // Level up every 200 points
            if (700 > score && score % 200 === 0) {
                level++;
                levelElement.textContent = level;

                // Update cactus image and speed
                updateCactusImage(level);
                cactusSpeed *= 0.99; // Increase cactus speed by 1%
                setCactusSpeed(cactusSpeed);
            }
        }
    }, 50);
}

function setCactusSpeed(speed) {
    cactus.style.animation = `cactusMove ${speed / 1000}s infinite linear`;
}

function addStartButton() {
    const button = document.createElement('img');
    button.id = 'start-game-image';
    button.src = './assets/images/start-game.png';
    button.alt = 'Start Game';
    button.className = 'start-game-image';

    button.addEventListener('click', () => {
        if (gameOver || score === 0) {
            // Reset game elements if the game was previously over or if it's the initial start
            cactus.style.animation = 'none';
            dino.style.bottom = '0px';
            setTimeout(startGame, 100); // Delay restart to reset animation
        }
    });

    document.body.appendChild(button);
}

// Add event listener for the initial start button
document.getElementById('start-game-image').addEventListener('click', () => {
    startGame();
});

// Listen for keydown events to control the dino
document.addEventListener('keydown', control);
