document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('logout');
    localStorage.removeItem('user');
    localStorage.removeItem('board');
    localStorage.removeItem('players');
    window.location.href = './login.html';
});