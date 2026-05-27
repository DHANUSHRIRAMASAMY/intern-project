$(document).ready(function () {

  // If already logged in, go to profile
  if (localStorage.getItem('session_token')) {
    window.location.href = 'profile.html';
    return;
  }

  $('#registerForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#name').val();
    const email = $('#email').val();
    const password = $('#password').val();

    $.ajax({
      url: 'php/register.php',
      method: 'POST',
      data: { name, email, password },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'success') {
          window.location.href = 'login.html';
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
