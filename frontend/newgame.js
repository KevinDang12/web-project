document.getElementById('start-game').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('start game');
    localStorage.removeItem('board');
    window.location.href = './chessgame.html';
});
