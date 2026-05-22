// register.js - handles form submission via jQuery AJAX
$(document).ready(function () {

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
