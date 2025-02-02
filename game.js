const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images loaded from local assets directory
const birdImg = new Image();
birdImg.src = "./assets/bird.png";

const botBirdImg = new Image();
botBirdImg.src = "./assets/botBird.png";

const pipeTopImg = new Image();
pipeTopImg.src = "./assets/pipeTop.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "./assets/pipeBottom.png";

const backgroundImg = new Image();
backgroundImg.src = "./assets/background.png";

const cloudImg = new Image();
cloudImg.src = "./assets/cloud.png";


// Player and bot birds
let bird = { x: 50, y: canvas.height / 2, size: 50, gravity: 0.5, velocity: 0 };
let botBird = { x: 150, y: canvas.height / 2, size: 50, gravity: 0.5, velocity: 0 };

let pipes = [];
let pipeGap = 200;
let pipeWidth = 60;
let frame = 0;
let points = 0;
let isGameOver = false;
let clouds = [{ x: canvas.width / 2, y: 100 }, { x: canvas.width, y: 200 }];

// Shooting stars array
let stars = [];

// Initialize some stars
for (let i = 0; i < 10; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2,
        size: Math.random() * 3 + 1,
        speedX: -Math.random() * 2 - 2,
        speedY: Math.random() * 2 + 1
    });
}

// Event listener for spacebar
document.addEventListener('keydown', (event) => {
    if (event.code === "Space") {
        if (isGameOver) {
            resetGame();
        } else {
            bird.velocity = -8;  // Bird jumps
        }
    }
});

function spawnPipe() {
    const pipeHeight = Math.random() * (canvas.height / 2) + 50;
    pipes.push({ x: canvas.width, y: pipeHeight });
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    botBird.y = canvas.height / 2;
    botBird.velocity = 0;
    pipes = [];
    frame = 0;
    points = 0;
    isGameOver = false;
    clouds = [{ x: canvas.width / 2, y: 100 }, { x: canvas.width, y: 200 }];
}

function drawBackground() {
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawClouds() {
    clouds.forEach(cloud => {
        context.drawImage(cloudImg, cloud.x, cloud.y, 100, 60);
        cloud.x -= 2;  // Move clouds slowly

        // Wrap around when clouds move off screen
        if (cloud.x + 100 < 0) {
            cloud.x = canvas.width;
            cloud.y = Math.random() * (canvas.height / 2);
        }
    });
}

function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);
}

function drawBotBird() {
    context.drawImage(botBirdImg, botBird.x, botBird.y, botBird.size, botBird.size);
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Draw top pipe
        context.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.y);

        // Draw bottom pipe
        context.drawImage(pipeBottomImg, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 5;  // Move pipes to the left

        if (pipe.x + pipeWidth === bird.x) {
            points += 1;
        }

        if ((bird.x + bird.size > pipe.x && bird.x < pipe.x + pipeWidth) &&
            (bird.y < pipe.y || bird.y + bird.size > pipe.y + pipeGap)) {
            isGameOver = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
    if (frame % 90 === 0) spawnPipe();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.size > canvas.height || bird.y < 0) {
        isGameOver = true;
    }
}

function updateBotBird() {
    // Simple AI: Check for upcoming pipe gaps and jump if needed
    const nextPipe = pipes.find(pipe => pipe.x > botBird.x);
    if (nextPipe) {
        if (botBird.y > nextPipe.y + pipeGap / 2) {
            botBird.velocity = -8;  // Bot jumps if below the gap
        }
    }

    botBird.velocity += botBird.gravity;
    botBird.y += botBird.velocity;

    // Prevent bot bird from going off screen
    if (botBird.y + botBird.size > canvas.height) {
        botBird.y = canvas.height - botBird.size;
    }
    if (botBird.y < 0) {
        botBird.y = 0;
    }
}

function drawScore() {
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(`Score: ${points}`, 20, 40);
}

function drawStars() {
    stars.forEach(star => {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
        star.x += star.speedX;
        star.y += star.speedY;

        // Respawn stars when they move off screen
        if (star.x < 0 || star.y > canvas.height) {
            star.x = canvas.width + Math.random() * 100;
            star.y = Math.random() * canvas.height / 2;
            star.size = Math.random() * 3 + 1;
            star.speedX = -Math.random() * 2 - 2;
            star.speedY = Math.random() * 2 + 1;
        }
    });
}

function gameLoop() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawStars();  // Draw shooting stars
        drawClouds();
        drawPipes();
        drawBird();
        drawBotBird();
        drawScore();
        updateBird();
        updateBotBird();
        updatePipes();
    }
    frame++;
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

