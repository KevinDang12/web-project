// Redirect to chessgame.html when New Game is clicked
document.getElementById("newgame").addEventListener("click", function() {
    localStorage.removeItem('board');
    localStorage.removeItem('currentTurn');
    localStorage.removeItem('players');
    window.location.href = "./newgame.html";
});

document.getElementById('loadgame').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = './loadgame.html';
});

document.getElementById('scoreboard').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = './scoreboard.html';
});
