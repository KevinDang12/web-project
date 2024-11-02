// Save game function
function saveGame() {
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    if (!player1 || !player2) {
        alert("Please enter both player names.");
        return;
    }

    const now = new Date();
    const gameTime = now.toLocaleTimeString();
    const gameDate = now.toLocaleDateString();

    const gameData = {
        gameId: `Game ${Date.now()}`, // Unique ID
        player1,
        player2,
        gameTime,
        gameDate,
        boardState: JSON.parse(localStorage.getItem('currentBoardState') || '[]') // Placeholder for current board
    };

    // Save the game to localStorage
    let savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    savedGames.push(gameData);
    localStorage.setItem('savedGames', JSON.stringify(savedGames));

    alert('Game saved successfully!');
    document.getElementById('gameForm').reset();

    // Optionally, redirect back to the chess game or confirmation page
    window.location.href = 'chessgame.html';
}
