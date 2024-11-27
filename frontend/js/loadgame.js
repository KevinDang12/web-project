// Redirect to Main Menu when Back button is clicked
document.getElementById("backToMenu").addEventListener("click", function() {
    window.location.href = "mainmenu.html"; // Redirect to the Main Menu
});

// Display saved games from localStorage or server
async function displaySavedGames() {
    const loadGameTable = document.getElementById('loadGameTable').getElementsByTagName('tbody')[0];
    loadGameTable.innerHTML = ''; // Clear existing rows
    
    // Get user email from localStorage
    const email = JSON.parse(localStorage.getItem('user')).email;

    const response = await fetch('http://localhost:5000/api/boards/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    data.forEach((game) => {
        const newRow = loadGameTable.insertRow();
        newRow.insertCell(0).textContent = game.player1;
        newRow.insertCell(1).textContent = game.player2;
        newRow.insertCell(2).textContent = game.gameTime;
        newRow.insertCell(3).textContent = game.gameDate;

        const loadCell = newRow.insertCell(4);
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.className = 'load-button';
        loadButton.onclick = () => loadGame(game.gameId);
        loadCell.appendChild(loadButton);

        const deleteCell = newRow.insertCell(5);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteGame(game.gameId);
        deleteCell.appendChild(deleteButton);
    });
}

// Function to load a specific game
async function loadGame(gameId) {
    const email = JSON.parse(localStorage.getItem('user')).email;

    const response = await fetch('http://localhost:5000/api/boards/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    const game = data.find((g) => g.gameId === gameId);

    localStorage.setItem('board', JSON.stringify(game.boardState)); // Save board state
    localStorage.setItem('players', JSON.stringify({ player1: game.player1, player2: game.player2 })); // Save player names
    localStorage.setItem('currentTurn', game.currentTurn); // Save current turn
    window.location.href = 'chessgame.html'; // Redirect to the main game
}

async function deleteGame(gameId) {
    const email = JSON.parse(localStorage.getItem('user')).email;

    await fetch('http://localhost:5000/api/boards', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email : email, gameId : gameId})
    });

    alert(gameId + " is Deleted");
    location.reload();
}

// Automatically display saved games on page load
window.onload = displaySavedGames;
