/**
 * Redirect to save game page
 */
function saveGame() {
    const chessboard = document.getElementById('chessboard');
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
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('currentTurn', currentTurn);
    window.location.href = 'savegame.html';
}

/**
 * Redirect to load game page
 */
function loadGame() {
    window.location.href = 'loadgame.html';
}

let currentTurn = localStorage.getItem('currentTurn') || 'white';

// Initial board setup
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

// Image paths for each piece
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

/**
 * Initialize the chessboard
 */
function initializeBoard() {
    let board = localStorage.getItem('board');
    toggleTurn();

    if (board) {
        board = JSON.parse(board);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                initialBoard[row][col] = board[row][col];
            }
        }
    }

    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;

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

                pieceImg.addEventListener('dragstart', dragStart);
                pieceImg.addEventListener('dragend', dragEnd);
                square.appendChild(pieceImg);
            }

            square.addEventListener('dragover', dragOver);
            square.addEventListener('drop', drop);

            chessboard.appendChild(square);
        }
    }
}

/**
 * Save the score of the game to the server
 * @param {*} player1 Name of player 1
 * @param {*} player2 Name of player 2
 * @param {*} winner Name of the winner
 */
async function saveScore(player1, player2, winner) {
    const now = new Date();
    const gameData = {
        gameId: now.toLocaleDateString(),
        player1,
        player2,
        winner
    };

    // Save the score to the server
    await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    });
}

let selectedPiece = null;
let startRow, startCol;

/**
 * Hover effect when about to drag a piece
 * @param {*} event Event object
 */
function dragStart(event) {
    selectedPiece = event.target;
    startRow = parseInt(selectedPiece.dataset.row);
    startCol = parseInt(selectedPiece.dataset.col);
    selectedPiece.style.opacity = '0.5';
}

/**
 * Reset the opacity of the piece
 */
function dragEnd() {
    if (selectedPiece) {
        selectedPiece.style.opacity = '1';
        selectedPiece = null;
    }
}

/**
 * Prevent the right-click menu from appearing
 * @param {*} event Event object
 */
function dragOver(event) {
    event.preventDefault();
}

/**
 * Update the indicator around the chess board to show whose turn it is
 */
function toggleTurn() {
    const turnIndicator = document.getElementsByClassName('chessboard-container');
    turnIndicator[0].style.backgroundColor = currentTurn === 'white' ? 'white' : 'black';
}

/**
 * Check if the move is valid and move the piece
 * @param {*} event Event object
 * @returns If the move is not the correct turn, an alert will be shown
 */
function drop(event) {
    event.preventDefault();

    let targetSquare = event.target;
    if (!targetSquare.classList.contains('square')) {
        targetSquare = targetSquare.closest('.square');
    }

    if (!targetSquare || !selectedPiece) return;

    const pieceType = selectedPiece.dataset.piece;
    const pieceColor = pieceType === pieceType.toUpperCase() ? 'white' : 'black';

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
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        toggleTurn();
    } else {
        alert('Invalid move for this piece.');
    }
}

/**
 * Check if the move is valid for a rook 
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 * @returns True if the move is valid, false otherwise
 */
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

/**
 * Check if the move is valid for a knight
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 * @returns True if the move is valid, false otherwise
 */
function isValidKnightMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

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

/**
 * Check if the move is valid for a queen
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 * @returns True if the move is valid, false otherwise
 */
function isValidQueenMove(startRow, startCol, endRow, endCol) {
    return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
}

/**
 * Check if the move is valid for a king
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 * @returns True if the move is valid, false otherwise
 */
function isValidKingMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return rowDiff <= 1 && colDiff <= 1;
}

/**
 * Move the piece to the target square
 * @param {*} piece The piece to move
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 */
function movePiece(piece, startRow, startCol, endRow, endCol) {
    initialBoard[endRow][endCol] = piece.dataset.piece;
    initialBoard[startRow][startCol] = '';

    const endSquare = document.querySelector(`.square[data-row="${endRow}"][data-col="${endCol}"]`);
    if (endSquare) {
        endSquare.appendChild(piece);
        piece.dataset.row = endRow;
        piece.dataset.col = endCol;
        console.log("Piece moved to:", endRow, endCol);
    } else {
        console.error("Target square not found.");
    }
}

/**
 * Check if the move is valid for a pawn
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 * @param {*} pieceType White or black pawn
 * @returns True if the move is valid, false otherwise
 */
function isValidPawnMove(startRow, startCol, endRow, endCol, pieceType) {
    const direction = pieceType === 'P' ? -1 : 1;
    const startingRow = pieceType === 'P' ? 6 : 1;

    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    const destinationPiece = initialBoard[endRow][endCol];
    const isCapture = destinationPiece && isOpponentPiece(pieceType, destinationPiece);

    if (colDiff === 0 && rowDiff === direction && !destinationPiece) {
        return true;
    }

    if (colDiff === 0 && rowDiff === 2 * direction && startRow === startingRow && !destinationPiece && !initialBoard[startRow + direction][startCol]) {
        return true;
    }

    if (Math.abs(colDiff) === 1 && rowDiff === direction && isCapture) {
        return true;
    }

    if (Math.abs(colDiff) === 1 && rowDiff === direction && destinationPiece) {
        return true;
    }

    return false;
}

/**
 * Check if the piece is an opponent piece when capturing
 * @param {*} pieceType White or black piece
 * @param {*} destinationPieceType The piece type of the destination square
 * @returns True if the piece is an opponent piece, false otherwise
 */
function isOpponentPiece(pieceType, destinationPieceType) {
    const isWhitePiece = pieceType === pieceType.toUpperCase();
    const isDestinationWhite = destinationPieceType === destinationPieceType.toUpperCase();
    return isWhitePiece !== isDestinationWhite;
}

/**
 * Move the piece to the target square and capture the opponent piece if necessary
 * @param {*} piece Piece to move
 * @param {*} startRow Start row
 * @param {*} startCol Start column
 * @param {*} endRow End row
 * @param {*} endCol End column
 */
async function movePiece(piece, startRow, startCol, endRow, endCol) {
    const capturedPiece = initialBoard[endRow][endCol];
    initialBoard[endRow][endCol] = piece.dataset.piece;
    initialBoard[startRow][startCol] = '';

    if (capturedPiece) {
        const capturedPieceElement = document.querySelector(
            `.piece[data-row="${endRow}"][data-col="${endCol}"]`
        );
        if (capturedPieceElement) {
            capturedPieceElement.remove();
            console.log(`Captured piece: ${capturedPiece}`);
        }
    }

    const endSquare = document.querySelector(`.square[data-row="${endRow}"][data-col="${endCol}"]`);
    if (endSquare) {
        endSquare.appendChild(piece);
        piece.dataset.row = endRow;
        piece.dataset.col = endCol;
        console.log("Piece moved to:", endRow, endCol);
    } else {
        console.error("Target square not found.");
    }

    if (capturedPiece === 'K' || capturedPiece === 'k') {
        let players = JSON.parse(localStorage.getItem('players'));

        let player1 = players.player1;
        let player2 = players.player2;

        const winner = capturedPiece === 'k' ? player2 : player1;

        await saveScore(player1, player2, winner);
        alert("Game over! The king has been captured.");
        resetGame();
    }
}

/**
 * Reset the game to the initial state
 */
function resetGame() {
    localStorage.removeItem('board');
    localStorage.removeItem('currentTurn');
    currentTurn = 'white';
    location.reload();
}

/**
 * Redirect to the main menu
 */
function mainMenu() {
    window.location.href = "mainmenu.html";
}

// Initialize the board when the window loads
window.onload = initializeBoard;