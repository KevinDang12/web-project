// Redirect to save game page
function saveGame() {
    const chessboard = document.getElementById('chessboard');
    console.log(chessboard);
    let board = [];

    for (let row = 0; row < 8; row++) {
        let boardRow = [];
        for (let col = 0; col < 8; col++) {
            const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            const piece = square.querySelector('.piece');

            if (piece) {
                boardRow.push(piece.dataset.piece);
            } else {
                boardRow.push('');
            }
        }
        board.push(boardRow);
    }
    console.log(board);
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('currentTurn', currentTurn);
    window.location.href = 'savegame.html';
}

// Redirect to load game page
function loadGame() {
    window.location.href = 'loadgame.html';
}

let currentTurn = localStorage.getItem('currentTurn') || 'white'; // Set the initial turn to white

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
    'P': '../images/white_pawn.png',
    'R': '../images/white_rook.png',
    'N': '../images/white_knight.png',
    'B': '../images/white_bishop.png',
    'Q': '../images/white_queen.png',
    'K': '../images/white_king.png',
    'p': '../images/black_pawn.png',
    'r': '../images/black_rook.png',
    'n': '../images/black_knight.png',
    'b': '../images/black_bishop.png',
    'q': '../images/black_queen.png',
    'k': '../images/black_king.png',
};

// Initialize the chessboard with pieces
function initializeBoard() {

    let board = localStorage.getItem('board');
    toggleTurn();

    if (board) {
        board = JSON.parse(board);
        console.log(board);
        let index = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                initialBoard[row][col] = board[row][col];
                index++;
            }
        }

        console.log(initialBoard);
    }

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

/**
 * Save the game score to the node backend server
 * @param {*} player1 Name of player 1
 * @param {*} player2 Name of player 2
 * @param {*} winner The winner of the game
 */
async function saveScore(player1, player2, winner) {

    const now = new Date();

    const gameData = {
        gameId: now.toLocaleDateString(),
        player1,
        player2,
        winner
    };

    console.log(gameData);

    await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
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

// Toggle turn indicator
function toggleTurn() {
    const turnIndicator = document.getElementById('turn-indicator');
    if (currentTurn == 'white') {
        turnIndicator.textContent = "White's Turn";
    } else {
        turnIndicator.textContent = "Black's Turn";
    }
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

    if (!targetSquare || !selectedPiece) return;

    const pieceType = selectedPiece.dataset.piece;
    const pieceColor = pieceType === pieceType.toUpperCase() ? 'white' : 'black';

    // Check if it's the correct player's turn
    if (pieceColor !== currentTurn) {
        alert(`It's ${currentTurn}'s turn!`);
        return;
    }

    const endRow = parseInt(targetSquare.dataset.row);
    const endCol = parseInt(targetSquare.dataset.col);

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
        // Switch turn after a successful move
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        // Toggle Turn Indicator
        toggleTurn();

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
// Validate pawn moves for both white ('P') and black ('p') pawns
// Validate pawn moves for both white ('P') and black ('p') pawns
function isValidPawnMove(startRow, startCol, endRow, endCol, pieceType) {
    const direction = pieceType === 'P' ? -1 : 1; // White pawns move up (-1), black pawns move down (+1)
    const startingRow = pieceType === 'P' ? 6 : 1; // White pawns start at row 6, black pawns at row 1

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    const destinationPiece = initialBoard[endRow][endCol]; // Get the piece at the destination square
    const isCapture = destinationPiece && isOpponentPiece(pieceType, destinationPiece); // Check if the move captures an opponent piece

    // Forward move by one square (not capturing)
    if (
        colDiff === 0 && // Same column
        rowDiff === direction && // One step forward
        !destinationPiece // Square must be empty for a regular move
    ) {
        return true;
    }

    // Forward move by two squares from starting position (not capturing)
    if (
        colDiff === 0 && // Same column
        rowDiff === 2 * direction && // Two steps forward
        startRow === startingRow && // From starting position
        !destinationPiece && // Square must be empty
        !initialBoard[startRow + direction][startCol] // Ensure square in-between is also empty
    ) {
        return true;
    }

    // Diagonal capture
    if (
        Math.abs(colDiff) === 1 && // One column difference
        rowDiff === direction && // One step forward diagonally
        isCapture // Must be capturing an opponent's piece
    ) {
        return true;
    }

    // Allow pawn to move diagonally to overlap any piece (like other pieces)
    if (
        Math.abs(colDiff) === 1 && // One column difference
        rowDiff === direction && // One step forward diagonally
        destinationPiece // Must have any piece at the destination (not empty)
    ) {
        return true;
    }

    // Invalid move
    return false;
}






function isOpponentPiece(pieceType, destinationPieceType) {
    const isWhitePiece = pieceType === pieceType.toUpperCase();
    const isDestinationWhite = destinationPieceType === destinationPieceType.toUpperCase();
    return isWhitePiece !== isDestinationWhite;
}


// Move piece to new position
async function movePiece(piece, startRow, startCol, endRow, endCol) {
    // Update board array
    const capturedPiece = initialBoard[endRow][endCol]; // Check if there's a piece in the target square
    initialBoard[endRow][endCol] = piece.dataset.piece;
    initialBoard[startRow][startCol] = '';

    // Remove the captured piece from the DOM, if any
    if (capturedPiece) {
        const capturedPieceElement = document.querySelector(
            `.piece[data-row="${endRow}"][data-col="${endCol}"]`
        );
        if (capturedPieceElement) {
            capturedPieceElement.remove(); // Remove the captured piece from the DOM
            console.log(`Captured piece: ${capturedPiece}`); // Debug log
        }
    }

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

    // Check if the king is captured
    if (capturedPiece === 'K' || capturedPiece === 'k') {
        let players = JSON.parse(localStorage.getItem('players'));

        let player1 = players.player1;
        let player2 = players.player2;

        const winner = capturedPiece === 'k' ? player2 : player1;

        await saveScore(player1, player2, winner);
        alert("Game over! The king has been captured.");
        resetGame(); // Call a function to reset the game or end it
    }
}

// Function to reset the game (you can customize this)
function resetGame() {
    // Clear the board and reset to the initial state
    localStorage.removeItem('board'); // Optionally clear saved state
    location.reload(); // Reload the page to restart the game
}

function mainMenu() {
    window.location.href = "mainmenu.html"; // Redirect to the Main Menu
}

// Run initialization on page load
window.onload = initializeBoard;

