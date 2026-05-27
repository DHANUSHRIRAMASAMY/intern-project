$(document).ready(function () {

  // If already logged in, go to profile
  if (localStorage.getItem('session_token')) {
    window.location.href = 'profile.html';
    return;
  }

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#email').val().toLowerCase();
    const password = $('#password').val();

    $.ajax({
      url: 'php/login.php',
      method: 'POST',
      data: { email, password },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'success') {
          localStorage.setItem('session_token', response.token);
          localStorage.setItem('user_email', email);
          window.location.href = 'profile.html';
        } else {
          alert(response.message);
        }
      },
      error: function () {
        alert('Something went wrong. Please try again.');
      }
    });

  });

});
