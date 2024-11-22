document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('logout');
    localStorage.removeItem('userId');
    localStorage.removeItem('board');
    window.location.href = './login.html';
});