// Save game function
function saveGame() {
    const players = JSON.parse(localStorage.getItem('players'));
    const player1 = players.player1;
    const player2 = players.player2;

    const now = new Date();
    const gameTime = now.toLocaleTimeString();
    const gameDate = now.toLocaleDateString();

    const gameData = {
        gameId: `Game ${Date.now()}`, // Unique ID
        userId: JSON.parse(localStorage.getItem('user')).email,
        currentTurn: localStorage.getItem('currentTurn'),
        player1,
        player2,
        gameTime,
        gameDate,
        boardState: JSON.parse(localStorage.getItem('board') || '[]') // Placeholder for current board
    };

    fetch('http://localhost:5000/api/boards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
    .then(
        alert('Game saved successfully!')
    )

    document.getElementById('gameForm').reset();

    // Optionally, redirect back to the chess game or confirmation page
    window.location.href = 'chessgame.html';
}

function showSavePreview() {
    let player1 = document.getElementById('player1');
    let player2 = document.getElementById('player2');
    let date = document.getElementById('date');
    let time = document.getElementById('time');

    let players = JSON.parse(localStorage.getItem('players'));

    player1.innerHTML = players.player1;
    player2.innerHTML = players.player2;
    date.innerHTML = new Date().toLocaleDateString();
    time.innerHTML = new Date().toLocaleTimeString();
}
