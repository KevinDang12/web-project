// Display saved games from localStorage
function displaySavedGames() {
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    const loadGameTable = document.getElementById('loadGameTable').getElementsByTagName('tbody')[0];
    loadGameTable.innerHTML = ''; // Clear existing rows

    // Populate each saved game with a "Load" button
    savedGames.forEach((gameData) => {
        const newRow = loadGameTable.insertRow();
        
        newRow.insertCell(0).textContent = gameData.player1;
        newRow.insertCell(1).textContent = gameData.player2;
        newRow.insertCell(2).textContent = gameData.gameTime;
        newRow.insertCell(3).textContent = gameData.gameDate;

        const loadCell = newRow.insertCell(4);
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.className = 'load-button';
        loadButton.onclick = () => loadGame(gameData);
        loadCell.appendChild(loadButton);
    });
}

// Function to load a specific game
function loadGame(gameData) {
    localStorage.setItem('currentGame', JSON.stringify(gameData)); // Store selected game
    alert(`Loading game for ${gameData.player1} vs ${gameData.player2} on ${gameData.gameDate} at ${gameData.gameTime}`);
    window.location.href = 'chessgame.html'; // Redirect to main game
}

// Automatically display saved games on page load
window.onload = displaySavedGames;
