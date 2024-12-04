// Initiate a new game by storing the player names in local storage and redirecting to the game page
document.getElementById('start-game').addEventListener('click', function(e) {
    e.preventDefault();
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    let players = {
        player1 : player1,
        player2 : player2
    };

    if (!player1 || !player2) {
        alert("Please enter both player names.");
        return;
    }

    localStorage.setItem('players', JSON.stringify(players));
    window.location.href = './chessgame.html';
});
