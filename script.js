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
totalScoreSpan.textContent = total / 10; // Display the initial total score

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
        const cactusWidth = cactus.offsetWidth;
        const cactusHeight = cactus.offsetHeight;

        if (cactusLeft > 0 && cactusLeft < 40 && dinoBottom <= 40) {
            clearInterval(checkCollision);

            // Trigger explosion at collision point
            triggerExplosion(
                cactusLeft + cactusWidth / 2,
                dinoBottom + cactusHeight / 2
            );

            // Update the total score
            total += score;
            totalScoreSpan.textContent = parseFloat(total / 10).toFixed(4); // Update total score display

            // Save the total score to local storage
            localStorage.setItem("totalScore", total);

            gameOver = true;
            cactus.style.animation = "none";
            dino.style.visibility = "hidden";

            // Add the start button back to the DOM after delay
            setTimeout(() => {
                addStartButton();
            }, 2000); // Delay for the explosion animation
        }

        if (!gameOver) {
            score += level;
            scoreElement.textContent = parseFloat(score / 10).toFixed(1);

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

function generateSecureUUID() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);

    // Set the version and variant bits
    array[6] = (array[6] & 0x0f) | 0x40; // Version 4
    array[8] = (array[8] & 0x3f) | 0x80; // Variant 1

    return [...array]
        .map(
            (b, i) =>
                (i === 4 || i === 6 || i === 8 || i === 10 ? "-" : "") +
                b.toString(16).padStart(2, "0")
        )
        .join("");
}

// Add start button function
function addStartButton() {
    const button = document.createElement("img");
    button.id = "start-game-image";
    button.src = "./assets/images/start-game.png";
    button.alt = "Start Game";
    button.className = "start-game-image";
    dino.style.visibility = "visible";
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

// Function to trigger explosion animation
function triggerExplosion(x, y) {
    const explosion = document.getElementById("explosion");
    explosion.style.left = `${x}px`;
    explosion.style.bottom = `${y}px`;
    explosion.style.opacity = 1; // Make it visible
    explosion.style.animation = "explosionEffect 2s forwards"; // Trigger the animation

    setTimeout(() => {
        explosion.style.opacity = 0; // Hide after animation
        explosion.style.animation = "none"; // Reset animation
    }, 2000); // Duration of the animation
}

// Add event listener to the document for the click event to trigger jump
document.addEventListener("click", jump);

// Add event listener for the initial start button
document.getElementById("start-game-image").addEventListener("click", () => {
    startGame();
});

// Handle Download App button click
document
    .getElementById("download-app-link")
    .addEventListener("click", () => {
        const userId = getTelegramUserId(); // Implement a function to retrieve the user ID
        const downloadAppLink = generateDownloadAppLink(userId);
        window.location.href = downloadAppLink;
    });

// Function to generate and set the referral link in the input field
function setReferralLink() {
    const userId = getTelegramUserId(); // Implement a function to retrieve the user ID
    const referralLink = generateReferralLink(userId);
    const referInput = document.getElementById("refer-input");
    referInput.value = referralLink; // Set referral link as input value
}

document
    .getElementById("copy-refer-link")
    .addEventListener("click", () => {
        const referInput = document.getElementById("refer-input");
        referInput.select(); // Select the input text

        // Copy the selected text to clipboard
        document.execCommand("copy");

        // Optionally, provide feedback to the user
        alert("Referral link copied to clipboard!");
    });

setReferralLink(); // Initialize referral link on page load

function generateReferralLink(userId) {
    return `https://t.me/NpTrumpBot/TheTestApp&refertoken=${userId}`;
}

function generateDownloadAppLink(userId) {
    return `https://link.page&refertoken=${userId}`;
}

// Function to get user ID (stubbed for example purposes)
function getTelegramUserId() {
    if (window.Telegram && window.Telegram.WebApp) {
        // Initialize the Web App
        const tg = window.Telegram.WebApp;

        // Get user information
        const user = tg.initDataUnsafe?.user;

        if (user) {
            return user.id;
        } else {
            return "user-id-not-available";
        }
    } else {
        return "telegram-not-available";
    }
}
