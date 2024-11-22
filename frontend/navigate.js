// Redirect to chessgame.html when New Game is clicked
document.getElementById("newgame").addEventListener("click", function() {
    window.location.href = "chessgame.html";
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
