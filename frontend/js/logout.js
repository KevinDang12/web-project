// Initiate logout process
document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('board');
    localStorage.removeItem('players');
    localStorage.removeItem('currentTurn');
    window.location.href = './login.html';
});