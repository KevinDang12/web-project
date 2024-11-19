// Display saved games from localStorage
async function displaySavedGames() {
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
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
    console.log(data);

    data.forEach((data) => {
        const newRow = loadGameTable.insertRow();
        
        newRow.insertCell(0).textContent = data.player1;
        newRow.insertCell(1).textContent = data.player2;
        newRow.insertCell(2).textContent = data.gameTime;
        newRow.insertCell(3).textContent = data.gameDate;

        const loadCell = newRow.insertCell(4);
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.className = 'load-button';
        loadButton.onclick = () => loadGame(data.gameId);
        loadCell.appendChild(loadButton);
    });

    // Populate each saved game with a "Load" button
    // savedGames.forEach((gameData) => {
    //     const newRow = loadGameTable.insertRow();
        
    //     newRow.insertCell(0).textContent = gameData.player1;
    //     newRow.insertCell(1).textContent = gameData.player2;
    //     newRow.insertCell(2).textContent = gameData.gameTime;
    //     newRow.insertCell(3).textContent = gameData.gameDate;

    //     const loadCell = newRow.insertCell(4);
    //     const loadButton = document.createElement('button');
    //     loadButton.textContent = 'Load';
    //     loadButton.className = 'load-button';
    //     loadButton.onclick = () => loadGame(gameData);
    //     loadCell.appendChild(loadButton);
    // });
}

// Function to load a specific game
async function loadGame(gameData) {
    const email = JSON.parse(localStorage.getItem('user')).email;

    const response = await fetch('http://localhost:5000/api/boards/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);

    // get game data from server
    let game = data.find((g) => g.gameId === gameData);
    console.log(game);

    localStorage.setItem('currentGame', JSON.stringify(game)); // Store selected game
    alert(`Loading game for ${game.player1} vs ${game.player2} on ${game.gameDate} at ${game.gameTime}`);

    // add to local storage
    localStorage.setItem('board', JSON.stringify(game.boardState));

    window.location.href = 'chessgame.html'; // Redirect to main game
}

// Automatically display saved games on page load
window.onload = displaySavedGames;
