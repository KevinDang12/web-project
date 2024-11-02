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
                pieceImg.draggable = true;
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
    selectedPiece.style.opacity = '0.5'; // Set opacity for drag effect
    console.log("Drag started for piece:", selectedPiece.dataset.piece, "at", startRow, startCol); // Debug log
}

// Drag end event
function dragEnd() {
    if (selectedPiece) {
        selectedPiece.style.opacity = '1'; // Reset opacity
        console.log("Drag ended for piece:", selectedPiece.dataset.piece); // Debug log
        selectedPiece = null;
    }
}

// Drag over event
function dragOver(event) {
    event.preventDefault(); // Allow drop
}

// Drop event
// Drop event (updated to handle all pieces)
// Drop event (updated to handle all pieces for both colors)
function drop(event) {
    event.preventDefault();

    let targetSquare = event.target;
    if (!targetSquare.classList.contains('square')) {
        targetSquare = targetSquare.closest('.square');
    }

    if (!targetSquare) return;

    const endRow = parseInt(targetSquare.dataset.row);
    const endCol = parseInt(targetSquare.dataset.col);

    const pieceType = selectedPiece.dataset.piece;
    const isValidMove = 
        (pieceType === 'P' && isValidPawnMove(startRow, startCol, endRow, endCol, 'P')) ||
        (pieceType === 'p' && isValidPawnMove(startRow, startCol, endRow, endCol, 'p')) ||
        (pieceType === 'R' && isValidRookMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'r' && isValidRookMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'N' && isValidKnightMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'n' && isValidKnightMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'B' && isValidBishopMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'b' && isValidBishopMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'Q' && isValidQueenMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'q' && isValidQueenMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'K' && isValidKingMove(startRow, startCol, endRow, endCol)) ||
        (pieceType === 'k' && isValidKingMove(startRow, startCol, endRow, endCol));

    if (isValidMove) {
        movePiece(selectedPiece, startRow, startCol, endRow, endCol);
    } else {
        alert('Invalid move for this piece.');
    }
}


// Function for rook movement (horizontal or vertical)
function isValidRookMove(startRow, startCol, endRow, endCol) {
    if (startRow !== endRow && startCol !== endCol) return false;

    const rowDirection = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colDirection = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;

    let row = startRow + rowDirection;
    let col = startCol + colDirection;

    while (row !== endRow || col !== endCol) {
        if (initialBoard[row][col]) return false;
        row += rowDirection;
        col += colDirection;
    }

    return true;
}

// Function for knight movement (L-shape)
function isValidKnightMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

// Function for bishop movement (diagonal)
function isValidBishopMove(startRow, startCol, endRow, endCol) {
    if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false;

    const rowDirection = endRow > startRow ? 1 : -1;
    const colDirection = endCol > startCol ? 1 : -1;

    let row = startRow + rowDirection;
    let col = startCol + colDirection;

    while (row !== endRow && col !== endCol) {
        if (initialBoard[row][col]) return false;
        row += rowDirection;
        col += colDirection;
    }

    return true;
}

// Function for queen movement (combines rook and bishop)
function isValidQueenMove(startRow, startCol, endRow, endCol) {
    return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
}

// Function for king movement (one square in any direction)
function isValidKingMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return rowDiff <= 1 && colDiff <= 1;
}


// Move piece to new position
function movePiece(piece, startRow, startCol, endRow, endCol) {
    // Update board array
    initialBoard[endRow][endCol] = piece.dataset.piece;
    initialBoard[startRow][startCol] = '';

    // Update piece position in DOM
    const endSquare = document.querySelector(`.square[data-row="${endRow}"][data-col="${endCol}"]`);
    if (endSquare) {
        endSquare.appendChild(piece); // Move piece to new square
        piece.dataset.row = endRow;
        piece.dataset.col = endCol;
        console.log("Piece moved to:", endRow, endCol); // Debug log
    } else {
        console.error("Target square not found.");
    }
}

// Validate pawn moves (white pawns only as example)
// Validate pawn moves for both white ('P') and black ('p') pawns
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

