// Redirect to chessgame.html when New Game is clicked
document.getElementById("newgame").addEventListener("click", function() {
    localStorage.removeItem('board');
    localStorage.removeItem('players');
    window.location.href = "./newgame.html";
});

document.getElementById('loadgame').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Load Game');
    window.location.href = './loadgame.html';
});

document.getElementById('scoreboard').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('scoreboard');
    window.location.href = './scoreboard.html';
});
