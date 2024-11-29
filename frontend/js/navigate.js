// Redirect to chessgame.html when New Game is clicked
document.getElementById("newgame").addEventListener("click", function() {
    localStorage.removeItem('board');
    localStorage.removeItem('currentTurn');
    localStorage.removeItem('players');
    window.location.href = "./newgame.html";
});

// Redirect to loadgame.html when Load Game is clicked
document.getElementById('loadgame').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = './loadgame.html';
});

// Redirect to scoreboard.html when Scoreboard is clicked
document.getElementById('scoreboard').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = './scoreboard.html';
});
