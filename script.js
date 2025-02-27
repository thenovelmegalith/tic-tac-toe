const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-index')
    );

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Add class for animation

    checkForWinner();
}

function checkForWinner() {
    let roundWon = false;
    let winningCombo = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            winningCombo = winningConditions[i];
            break;
        }
    }


    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} win!`;
        gameActive = false;
        drawWinningLine(winningCombo); // Draw the winning line
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = 'It\'s a tie!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function drawWinningLine(winningCombo) {
    const [a, b, c] = winningCombo;
    const cell1 = document.querySelector(`.cell[data-index="${a}"]`);
    const cell2 = document.querySelector(`.cell[data-index="${b}"]`);
    const cell3 = document.querySelector(`.cell[data-index="${c}"]`);

    const boardRect = board.getBoundingClientRect();
    const cell1Rect = cell1.getBoundingClientRect();
    const cell3Rect = cell3.getBoundingClientRect();

    const line = document.createElement('div');
    line.classList.add('winning-line');

    // Position the line based on the winning combination
    if (a === 0 && c === 2) { // Top row
        line.style.top = `${cell1Rect.top - boardRect.top + cell1Rect.height / 2}px`;
        line.style.left = `${cell1Rect.left - boardRect.left}px`;
        line.style.width = `${cell3Rect.right - cell1Rect.left}px`;
    } else if (a === 0 && c === 8) { // Middle row
        line.style.top = `${cell1Rect.top - boardRect.top}px`;
        line.style.left = `${cell1Rect.left - boardRect.left}px`;
        line.style.width = `${Math.hypot(cell3Rect.right - cell1Rect.left, cell3Rect.bottom - cell1Rect.top)}px`;
        line.style.transform = 'rotate(45deg)';
        line.style.transformOrigin = '0 0';
    } else if (a === 2 && c === 6) { // Diagonal (top-right to bottom-left)
        line.style.top = `${cell1Rect.top - boardRect.top}px`;
        line.style.left = `${cell1Rect.left - boardRect.left}px`;
        line.style.width = `${Math.hypot(cell3Rect.left - cell1Rect.right, cell3Rect.bottom - cell1Rect.top)}px`;
        line.style.transform = 'rotate(-45deg)';
        line.style.transformOrigin = '0 0';
    } else { // Columns or middle row
        line.style.top = `${cell1Rect.top - boardRect.top + cell1Rect.height / 2}px`;
        line.style.left = `${cell1Rect.left - boardRect.left}px`;
        line.style.width = `${cell3Rect.right - cell1Rect.left}px`;
    }

    board.appendChild(line);
}

function resetGame() {
    cells.forEach(cell => {
        cell.classList.add('reset'); // Add reset class for animation
        setTimeout(() => {
           cell.textContent = '';
           cell.classList.remove('x', 'o', 'reset'); // Remove all classes 
        }, 300); // Match the duration of the animation
    });

    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    // Remove the winning line if it exists
    const winningLine = document.querySelector('.winning-line');
    if (winningLine) {
        winningLine.remove();
    }
}
//    cells.forEach(cell => cell.textContent = '');
//}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initialize game status
statusText.textContent = `Player ${currentPlayer}'s turn`;

