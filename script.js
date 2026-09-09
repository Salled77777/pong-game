const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');

// Game variables
const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 8;
const paddleSpeed = 6;
const ballSpeed = 5;

let gameRunning = false;
let gamePaused = false;

// Player 1 (Left)
const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Player 2 (Right)
const player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed,
    dy: ballSpeed,
    radius: ballSize
};

// Keyboard input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        gameRunning = !gameRunning;
    }
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Draw rectangle
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw center line
function drawCenterLine() {
    ctx.strokeStyle = '#667eea';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Update player position
function updatePlayer(player, upKey, downKey) {
    if (keys[upKey]) {
        player.y = Math.max(0, player.y - paddleSpeed);
    }
    if (keys[downKey]) {
        player.y = Math.min(canvas.height - player.height, player.y + paddleSpeed);
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Ball collision with paddles
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player1.x + player1.width + ball.radius;
    }

    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player2.x - ball.radius;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// Reset game
function resetGame() {
    gameRunning = false;
    player1.score = 0;
    player2.score = 0;
    player1.y = canvas.height / 2 - paddleHeight / 2;
    player2.y = canvas.height / 2 - paddleHeight / 2;
    resetBall();
    updateScore();
}

// Update score display
function updateScore() {
    score1El.textContent = player1.score;
    score2El.textContent = player2.score;
}

// Draw game
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#1a1a1a');
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles
    drawRect(player1.x, player1.y, player1.width, player1.height, '#667eea');
    drawRect(player2.x, player2.y, player2.width, player2.height, '#764ba2');
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#fff');
    
    // Draw game status
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    if (!gameRunning) {
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to start', canvas.width / 2, 30);
    }
}

// Update game
function update() {
    if (gameRunning) {
        updatePlayer(player1, 'w', 's');
        updatePlayer(player2, 'arrowup', 'arrowdown');
        updateBall();
        updateScore();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();