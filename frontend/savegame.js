// Redirect to Load Game page
function goToLoadGame() {
    window.location.href = 'loadgame.html';
}

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
    };

    // Save the game to localStorage
    let savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    savedGames.push(gameData);
    localStorage.setItem('savedGames', JSON.stringify(savedGames));

    console.log("Saved games after save:", savedGames); // Debug: Verify saved games in localStorage
    alert('Game saved!');
    document.getElementById('gameForm').reset();
}
