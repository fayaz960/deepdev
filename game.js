const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images
const birdImg = new Image();
birdImg.src = "https://i.imgur.com/OCVKJyl.png";  // Flappy Bird character image
const tntImg = new Image();
tntImg.src = "https://i.imgur.com/5PMMGyy.png";  // TNT explosion image

let bird = { x: 50, y: canvas.height / 2, size: 50, gravity: 0.5, velocity: 0 };
let pipes = [];
let pipeGap = 170;
let pipeWidth = 60;
let frame = 0;
let points = 0;
let isGameOver = false;
let explosion = { active: false, x: 0, y: 0 };

// Event listener for the spacebar to make the bird jump
document.addEventListener('keydown', (event) => {
    if (event.code === "Space") {
        if (isGameOver) {
            resetGame();  // Restart the game if it's over
        } else {
            bird.velocity = -8;  // Make the bird jump upward
        }
    }
});

document.getElementById('play-button').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

function spawnPipe() {
    const pipeHeight = Math.random() * (canvas.height / 2) + 50;
    pipes.push({ x: canvas.width, y: pipeHeight });
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    points = 0;
    isGameOver = false;
    explosion.active = false;
}

function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);
}

function drawPipes() {
    context.fillStyle = "#5DA130";
    pipes.forEach(pipe => {
        context.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        context.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 5;

        if (pipe.x + pipeWidth === bird.x) {
            points += 1;
        }

        if ((bird.x + bird.size > pipe.x && bird.x < pipe.x + pipeWidth) &&
            (bird.y < pipe.y || bird.y + bird.size > pipe.y + pipeGap)) {
            triggerExplosion(bird.x, bird.y);
            isGameOver = true;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
    if (frame % 90 === 0) spawnPipe();
}

function triggerExplosion(x, y) {
    explosion.active = true;
    explosion.x = x;
    explosion.y = y;
}

function drawExplosion() {
    if (explosion.active) {
        context.drawImage(tntImg, explosion.x, explosion.y, 100, 100);
    }
}

function updateBird() {
    bird.velocity += bird.gravity;  // Gravity pulls the bird downward
    bird.y += bird.velocity;  // Update the bird's position based on velocity

    // Check if the bird hits the ground or flies too high
    if (bird.y + bird.size > canvas.height || bird.y < 0) {
        triggerExplosion(bird.x, bird.y);
        isGameOver = true;
    }
}

function drawScore() {
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(`Score: ${points}`, 20, 40);
}

function gameLoop() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        drawScore();
        updateBird();
        updatePipes();
    } else {
        drawExplosion();
    }
    frame++;
    requestAnimationFrame(gameLoop);
}

