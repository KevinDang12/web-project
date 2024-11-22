document.getElementById('newgame').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('New Game');
    window.location.href = './newgame.html';
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