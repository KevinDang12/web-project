document.getElementById('start-game').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('board');
    let players = {
        player1 : document.getElementById('player1').value,
        player2 : document.getElementById('player2').value
    };
    localStorage.setItem('players', JSON.stringify(players));
    window.location.href = './chessgame.html';
});
