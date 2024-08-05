const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
let score = 0;
let level = 1;
let isJumping = false;
let gravity = 0.9;
let gameOver = false;
let cactusSpeed = 1000; // Initial speed in milliseconds
let checkCollision;

function jump() {
    if (isJumping) return;
    let position = 0;
    isJumping = true;

    let timerId = setInterval(() => {
        if (position >= 150) {
            clearInterval(timerId);

            // Move down
            let downTimerId = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downTimerId);
                    isJumping = false;
                }
                position -= 5;
                position *= gravity;
                dino.style.bottom = position + 'px';
            }, 20);
        }

        // Move up
        position += 20;
        position *= gravity;
        dino.style.bottom = position + 'px';
    }, 20);
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
    cactusSpeed = 1000; // Reset speed

    // Remove the start button
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.remove();
    }

    // Set initial cactus speed
    setCactusSpeed(cactusSpeed);

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
            if  (700>score &&  score % 200 === 0) {
                level++;
                levelElement.textContent = level;

                // Increase cactus speed by 1%
                cactusSpeed *= 0.99; // Reduce time, hence faster
                setCactusSpeed(cactusSpeed);
            }
        }
    }, 50);
}

function setCactusSpeed(speed) {
    cactus.style.animation = `cactusMove ${speed / 1000}s infinite linear`;
}

function addStartButton() {
    const button = document.createElement('button');
    button.id = 'start-button';
    button.textContent = 'Start Game';
    button.style.marginTop = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s ease';

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
document.getElementById('start-button').addEventListener('click', () => {
    startGame();
});

// Listen for keydown events to control the dino
document.addEventListener('keydown', control);
