// savegame.js

// Function to save the game details
function saveGame() {
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    
    const now = new Date();
    const gameTime = now.toLocaleTimeString();
    const gameDate = now.toLocaleDateString();

    const gameData = { player1, player2, gameTime, gameDate };

    // Store in local storage (for simulation)
    let savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    savedGames.push(gameData);
    localStorage.setItem('savedGames', JSON.stringify(savedGames));

    addGameToTable(gameData);

    // Clear the form for next entry
    document.getElementById('gameForm').reset();
}

// Function to add a game entry to the table
function addGameToTable(gameData) {
    const gameTable = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
    const newRow = gameTable.insertRow();

    newRow.insertCell(0).textContent = gameData.player1;
    newRow.insertCell(1).textContent = gameData.player2;
    newRow.insertCell(2).textContent = gameData.gameTime;
    newRow.insertCell(3).textContent = gameData.gameDate;
}

// Function to load saved games from local storage
function loadSavedGames() {
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    const gameTable = document.getElementById('gameTable').getElementsByTagName('tbody')[0];
    
    // Clear existing rows before loading
    gameTable.innerHTML = '';

    // Add each saved game to the table
    savedGames.forEach(gameData => addGameToTable(gameData));
}

// Function to go back to the main menu or previous page
function goBack() {
    window.history.back();
}

// Automatically load saved games when the page loads
window.onload = loadSavedGames;
