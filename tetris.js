// Define constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 1, 0]]
];
const COLORS = [
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF'
];

// Initialize variables
// let board = [];
// let currentShape = null;
// let currentX = 0;
// let currentY = 0;

//let score = 0;

// Initialize the game
let board = createBoard(COLS, ROWS);
let currentShape = newShape();
let nextShape = newShape();
let currentX = Math.floor(COLS / 2) - Math.ceil(currentShape[0].length / 2);
let currentY = 0;
let timer = null;
let score = 0;
let gameOver = false;

function createBoard(cols, rows) {
    let board = [];

    for (let y = 0; y < rows; y++) {
        board[y] = [];

        for (let x = 0; x < cols; x++) {
            board[y][x] = 0;
        }
    }

    return board;
}

// Get canvas context and set dimensions
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Create board array
for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
        board[r][c] = 0;
    }
}

// Draw a square on the canvas
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw the current state of the game
function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShape(board, 0, 0);

    drawShape(currentShape, currentX, currentY);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}


// Draw the board and the current shape
// function draw() {
//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw the board
//     for (let r = 0; r < ROWS; r++) {
//         for (let c = 0; c < COLS; c++) {
//             if (board[r][c]) {
//                 drawSquare(c, r, COLORS[board[r][c] - 1]);
//             }
//         }
//     }

//     // Draw the current shape
//     if (currentShape) {
//         for (let r = 0; r < currentShape.length; r++) {
//             for (let c = 0; c < currentShape[r].length; c++) {
//                 if (currentShape[r][c]) {
//                     drawSquare(currentX + c, currentY + r, COLORS[currentShape[r][c] - 1]);
//                 }
//             }
//         }
//     }
// }

// Move the current shape down by one row
function moveDown() {
    if (canMove(0, 1)) {
        currentY++;
    } else {
        freeze();
        removeRows();
        newShape();
        if (isGameOver()) {
            clearInterval(timer);
            alert('Game over! Your score is ' + score);
        }
    }
}

// Move the current shape left by one column
function moveLeft() {
    if (canMove(-1, 0)) {
        currentX--;
    }
}

// Move the current shape right by one column
function moveRight() {
    if (canMove(1, 0)) {
        currentX++;
    }
}

// Rotate the current shape 90 degrees clockwise
function rotateShape() {
    const newShape = [];
    for (let r = 0; r < currentShape[0].length; r++) {
        newShape[r] = [];
        for (let c = 0; c < currentShape.length; c++) {
            newShape[r][c] = currentShape[currentShape.length - 1 - c][r];
        }
    }
    if (canRotate(newShape)) {
        currentShape = newShape;
    }
}

// Check if the current shape can move by the specified offset
function canMove(offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    for (let r = 0; r < currentShape.length; r++) {
        for (let c = 0; c < currentShape[r].length; c++) {
            if (currentShape[r][c]) {
                const newX = currentX + c + offsetX;
                const newY = currentY + r + offsetY;
                if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Check if the current shape can be rotated to the new shape
function canRotate(newShape) {
    for (let r = 0; r < newShape.length; r++) {
        for (let c = 0; c < newShape[r].length; c++) {
            if (newShape[r][c]) {
                const newX = currentX + c;
                const newY = currentY + r;
                if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Freeze the current shape onto the board
function freeze() {
    for (let r = 0; r < currentShape.length; r++) {
        for (let c = 0; c < currentShape[r].length; c++) {
            if (currentShape[r][c]) {
                const newX = currentX + c;
                const newY = currentY + r;
                board[newY][newX] = currentShape[r][c];
            }
        }
    }
}

// Remove completed rows from the board
function removeRows() {
    let rowsRemoved = 0;
    for (let r = 0; r < ROWS; r++) {
        if (board[r].every(block => block)) {
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            rowsRemoved++;
            score += 10;
        }
    }
    if (rowsRemoved === 1) {
        score += 100;
    } else if (rowsRemoved === 2) {
        score += 300;
    } else if (rowsRemoved === 3) {
        score += 500;
    } else if (rowsRemoved === 4) {
        score += 800;
    }
}

// Check if the game is over
function isGameOver() {
    for (let c = 0; c < COLS; c++) {
        if (board[0][c]) {
            return true;
        }
    }
    return false;
}

// Generate a new random
// Generate a new random shape
function newShape() {
    const shapes = "TJLOSZI";
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    switch (shape) {
        case "T":
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        case "J":
            return [
                [0, 0, 0],
                [2, 2, 2],
                [0, 0, 2],
            ];
        case "L":
            return [
                [0, 0, 0],
                [3, 3, 3],
                [3, 0, 0],
            ];
        case "O":
            return [
                [4, 4],
                [4, 4],
            ];
        case "S":
            return [
                [0, 0, 0],
                [0, 5, 5],
                [5, 5, 0],
            ];
        case "Z":
            return [
                [0, 0, 0],
                [6, 6, 0],
                [0, 6, 6],
            ];
        case "I":
            return [
                [0, 0, 0, 0],
                [7, 7, 7, 7],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
    }
}


// Draw a shape at the specified position
function drawShape(shape, offsetX, offsetY) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                drawBlock(offsetX + c, offsetY + r, COLORS[shape[r][c]]);
            }
        }
    }
}

// Draw a single block at the specified position
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Update the game state and redraw the screen
function update() {
    if (!isGameOver()) {
        if (canMove(0, 1)) {
            currentY++;
        } else {
            freeze();
            removeRows();
            currentShape = nextShape;
            nextShape = newShape();
            currentX = Math.floor(COLS / 2) - Math.ceil(currentShape[0].length / 2);
            currentY = 0;
            if (!canMove(0, 0)) {
                gameOver = true;
            }
        }
        draw();
    } else {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2 - 15);
    }
}



// Set up keyboard controls
document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 37: // left arrow
            moveLeft();
            break;
        case 38: // up arrow
            rotateShape();
            break;
        case 39: // right arrow
            moveRight();
            break;
        case 40: // down arrow
            moveDown();
            break;
    }
});

// Start the game loop
let lastTime = 0;
let dropInterval = 500; // milliseconds
let dropCounter = 0;

function gameLoop(timestamp) {
    // console.log(timestamp, lastTime);
    let deltaTime = timestamp - lastTime;

    if (deltaTime >= dropInterval) {
        lastTime = timestamp;
        update(deltaTime);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();