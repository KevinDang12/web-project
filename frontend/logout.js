document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('logout');
    localStorage.removeItem('user');
    window.location.href = './login.html';
});