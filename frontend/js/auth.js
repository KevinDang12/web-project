// auth.js

function showForm(formId) {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => form.style.display = 'none');

    document.getElementById(formId).style.display = 'block';

    const titleMap = {
        signInForm: 'Sign In',
        signUpForm: 'Sign Up',
        forgotPasswordForm: 'Forgot Password'
    };
    
    document.getElementById('form-title').innerText = titleMap[formId];
}

// For further backend integration, you can add listeners to handle form submissions
document.getElementById('signInForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    const response = await fetch('http://localhost:5000/api/verify_user/' + email + '/' + password, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.text();
    console.log(data);

    if (!data) {
        alert('Invalid Email or Password');
    } else {
        const user = { email: data, signedIn: true };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = './mainmenu.html';
    }
});

document.getElementById('signUpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('http://localhost:5000/api/users/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.text();
    console.log(data);

    if (!data || data == null) {
        fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(() => {
            alert('User created successfully');
            const user = { email: email, signedIn: true };
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = './mainmenu.html';
        })
    } else {
        console.log('User already exists');
        alert('User already exists! Enter a different email address.');
    }
});
