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
document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Sign In form submitted'); // Replace with actual sign-in logic
});

document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Sign Up form submitted'); // Replace with actual sign-up logic
});

document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Forgot Password form submitted'); // Replace with password reset logic
});
