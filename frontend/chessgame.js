// Board layout using abbreviations for each piece
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

// Load images for each piece type
const pieceImages = {
    'P': 'images/white_pawn.png',
    'R': 'images/white_rook.png',
    'N': 'images/white_knight.png',
    'B': 'images/white_bishop.png',
    'Q': 'images/white_queen.png',
    'K': 'images/white_king.png',
    'p': 'images/black_pawn.png',
    'r': 'images/black_rook.png',
    'n': 'images/black_knight.png',
    'b': 'images/black_bishop.png',
    'q': 'images/black_queen.png',
    'k': 'images/black_king.png',
};

// Initialize the chessboard with pieces
function initializeBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = ''; // Clear existing squares if any

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            // Create square
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;

            // Place piece if exists in the initial layout
            const piece = initialBoard[row][col];
            if (piece) {
                const pieceImg = document.createElement('img');
                pieceImg.src = pieceImages[piece];
                pieceImg.alt = piece;
                pieceImg.className = 'piece';
                pieceImg.draggable = true; // Enable drag-and-drop
                pieceImg.dataset.piece = piece;
                pieceImg.dataset.row = row;
                pieceImg.dataset.col = col;

                // Event listeners for drag-and-drop
                pieceImg.addEventListener('dragstart', dragStart);
                pieceImg.addEventListener('dragend', dragEnd);
                square.appendChild(pieceImg);
            }

            // Allow drop on squares
            square.addEventListener('dragover', dragOver);
            square.addEventListener('drop', drop);

            chessboard.appendChild(square);
        }
    }
}

// Variables to store current piece and its position
let selectedPiece = null;
let startRow, startCol;

// Drag start event
function dragStart(event) {
    selectedPiece = event.target;
    startRow = parseInt(selectedPiece.dataset.row);
    startCol = parseInt(selectedPiece.dataset.col);
    setTimeout(() => (selectedPiece.style.display = 'none'), 0); // Hide element for drag effect
}

// Drag end event
function dragEnd() {
    setTimeout(() => (selectedPiece.style.display = 'block'), 0);
    selectedPiece = null;
}

// Drag over event
function dragOver(event) {
    event.preventDefault();
}

// Drop event
function drop(event) {
    event.preventDefault();
    const endRow = parseInt(event.target.dataset.row);
    const endCol = parseInt(event.target.dataset.col);

    // Only handle moves for white pawns as an example
    if (selectedPiece.dataset.piece === 'P' && isValidPawnMove(startRow, startCol, endRow, endCol, 'P')) {
        movePiece(selectedPiece, startRow, startCol, endRow, endCol);
    } else {
        alert('Invalid move for this piece.');
    }
}

// Move piece to new position
function movePiece(piece, startRow, startCol, endRow, endCol) {
    // Update board array
    initialBoard[endRow][endCol] = piece.dataset.piece;
    initialBoard[startRow][startCol] = '';

    // Update piece position on board
    const endSquare = document.querySelector(`.square[data-row="${endRow}"][data-col="${endCol}"]`);
    endSquare.appendChild(piece);
    piece.dataset.row = endRow;
    piece.dataset.col = endCol;
}

// Validate pawn moves
function isValidPawnMove(startRow, startCol, endRow, endCol, piece) {
    const direction = piece === 'P' ? -1 : 1; // White moves up (-1), black moves down (+1)
    const startingRow = piece === 'P' ? 6 : 1; // White starts on row 6, black on row 1

    // Moving forward by one square
    if (startCol === endCol && startRow + direction === endRow && !initialBoard[endRow][endCol]) {
        return true;
    }

    // Moving forward by two squares from the starting row
    if (
        startCol === endCol &&
        startRow === startingRow &&
        startRow + 2 * direction === endRow &&
        !initialBoard[endRow][endCol] &&
        !initialBoard[startRow + direction][startCol]
    ) {
        return true;
    }

    // Diagonal capture
    if (
        Math.abs(startCol - endCol) === 1 &&
        startRow + direction === endRow &&
        initialBoard[endRow][endCol] &&
        initialBoard[endRow][endCol].toLowerCase() !== piece.toLowerCase() // Ensure capturing opposite color
    ) {
        return true;
    }

    return false;
}

// Run initialization on page load
window.onload = initializeBoard;
