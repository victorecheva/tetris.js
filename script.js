import { PIECES } from './pieces.js';

const canvas = document.getElementsByClassName('game')[0];
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 30;
const HEIGH = 20;
const WIDTH = 10;
canvas.width = WIDTH * BLOCK_SIZE;
canvas.height = HEIGH * BLOCK_SIZE;

const board = [];

// Initialize the board with empty blocks
// 0 = empty, 1 = filled
function initBoard(){
    for (let y = 0; y < HEIGH; y++) {
        board[y] = [];
        for (let x = 0; x < WIDTH; x++) {
            board[y][x] = 0;
        }
    }
}
initBoard();

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

function getRandomPiece() {
    return PIECES[Math.floor(Math.random() * PIECES.length)];
}

let randomPiece = getRandomPiece();
let currentPiece = {
    position : { x: 4, y: 0 },
    shape: randomPiece.shape,
    color: randomPiece.color,
    name: randomPiece.name
}

let dropCounter = 0;
let lastTime = 0;

function update(time = 0){
    //  console.table(board)
    let deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if( dropCounter > 1000) {
        currentPiece.position.y += 1;
        dropCounter = 0;
    }

    draw();

    //mejor que setInterval
    window.requestAnimationFrame(update);
}

function draw_block(x, y, playerPiece = false, color = null) {
    let blockColor = color || 'white';

    if (!playerPiece) {
        if(board[y][x] === 0) return;
        // Asigna el color según el valor en el tablero
        if(board[y][x] === 1) blockColor = 'yellow';
        if(board[y][x] === 2) blockColor = 'cyan';
        if(board[y][x] === 3) blockColor = 'purple';
        if(board[y][x] === 4) blockColor = 'green';
        if(board[y][x] === 5) blockColor = 'red';
        if(board[y][x] === 6) blockColor = 'blue';
        if(board[y][x] === 7) blockColor = 'orange';
    }

    ctx.fillStyle = blockColor;
    ctx.fillRect(x, y, 1, 1);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.05;
    ctx.strokeRect(x, y, 1, 1);
}

function draw(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, WIDTH, HEIGH);

    // draw grid
    ctx.strokeStyle = '#ccc'; // 
    ctx.lineWidth = 0.02;
    for (let x = 0; x <= WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGH);
        ctx.stroke();
    }
    for (let y = 0; y <= HEIGH; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    //draw blocks
    for (let y = 0; y < HEIGH; y++) {
        for (let x = 0; x < WIDTH; x++) {

            if (board[y][x] != 0) {
                 draw_block(x, y);
            }
        }
    }

    //draw current piece

    for (let y = 0; y < currentPiece.shape.length; y++){
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] === 1) {
                draw_block(currentPiece.position.x + x, currentPiece.position.y + y,true,currentPiece.color);
            }
        }
    }

}


//seguramente mejorable
function checkCollision(){
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] === 1) {
                const boardX = currentPiece.position.x + x;
                const boardY = currentPiece.position.y + y;

                // Check if the piece is out of bounds or collides with existing blocks
                if (boardX < 0 || boardX >= WIDTH || boardY < 0 || boardY >= HEIGH || 
                    (boardY < HEIGH && board[boardY][boardX] != 0)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece(){
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] === 1) {
                const boardX = currentPiece.position.x + x;
                const boardY = currentPiece.position.y + y;

                // Place the piece on the board
                if(currentPiece.name === 'O') {
                    board[boardY][boardX] = 1;
                }
                if(currentPiece.name === 'I') {
                    board[boardY][boardX] = 2;
                }
                if(currentPiece.name === 'T') {
                    board[boardY][boardX] = 3;
                }
                if(currentPiece.name === 'S') {
                    board[boardY][boardX] = 4;
                }
                if(currentPiece.name === 'Z') {
                    board[boardY][boardX] = 5;
                }
                if(currentPiece.name === 'J') {
                    board[boardY][boardX] = 6;
                }
                if(currentPiece.name === 'L') {
                    board[boardY][boardX] = 7;
                }

            }
        }
    }

    checkLines();
    
    currentPiece = getRandomPiece()
    currentPiece.position = { x: 4, y: 0 };
    
    // Check for collisions after placing the piece for checking if the game is over
    if (checkCollision()) {
        console.log("Game Over");
        initBoard();
    }
}

// Check if the are complete lines
function checkLines(){
    for(let row of board){
        if (row.every(block => block != 0)) {

            // Remove the line
            const index = board.indexOf(row);
            board.splice(index, 1);

            // Add a new empty line at the top
            board.unshift(Array(WIDTH).fill(0));
        }
    }
}
// player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft'){
        currentPiece.position.x -= 1;
        if(checkCollision()) {
            currentPiece.position.x += 1;
        }

    }
    if (event.key === 'ArrowRight') {
        currentPiece.position.x += 1;
        if(checkCollision()) {
            currentPiece.position.x -= 1;
        }
    }
    if (event.key === 'ArrowDown') {
        currentPiece.position.y += 1;
        if(checkCollision()) {
            currentPiece.position.y -= 1; 
            placePiece();
        }
    }
    if (event.key === 'ArrowUp') {
        const rotatedShape = rotatePiece(currentPiece.shape);
        const originalShape = currentPiece.shape;

        currentPiece.shape = rotatedShape;

        if (checkCollision()) {
            currentPiece.shape = originalShape; // Cancelar rotación si choca
        }
    }

    if (event.key === ' ') { // Space to drop the piece immediately
        while (!checkCollision()) {
            currentPiece.position.y += 1;
        }
        currentPiece.position.y -= 1; // Revert the last move that caused collision
        placePiece();
    }

    //rotate the piece 90 degrees clockwise
    if (event.key === 'e' || event.key === 'E') { // 'r' key to rotate the piece
        const rotatedShape = rotatePiece(currentPiece.shape);
        const originalShape = currentPiece.shape;

        currentPiece.shape = rotatedShape;

        if (checkCollision()) {
            currentPiece.shape = originalShape; // Cancelar rotación si choca
        }
    }

    //rotate the piece 90 degrees counter-clockwise
    if (event.key === 'q' || event.key === 'Q') { 
        const rotatedShape = rotatePiece(currentPiece.shape,false);
        const originalShape = currentPiece.shape;

        currentPiece.shape = rotatedShape;

        if (checkCollision()) {
            currentPiece.shape = originalShape; // Cancelar rotación si choca
        }
    }
})

// Rotate the piece 90 degrees clockwise
function rotatePiece(matrix, clockwise = true) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];
    if (clockwise){

        for (let x = 0; x < cols; x++) {
            rotated[x] = [];
            for (let y = rows - 1; y >= 0; y--) {
                rotated[x][rows - 1 - y] = matrix[y][x];
            }
        }
    }else{

        for (let x = cols - 1; x >= 0; x--) {
            rotated[cols - 1 - x] = [];
            for (let y = 0; y < rows; y++) {
                rotated[cols - 1 - x][y] = matrix[y][x];
            }
        }
    }
    
    return rotated;
}



update();
