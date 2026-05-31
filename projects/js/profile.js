$(document).ready(function () {

  const token = localStorage.getItem('session_token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Load existing profile data
  $.ajax({
    url: 'php/profile.php',
    method: 'GET',
    data: { token: token },
    dataType: 'json',
    success: function (response) {
      if (response.status === 'success') {
        $('#name').val(response.data.name);
        $('#email').val(response.data.email);
        $('#contact').val(response.data.contact);
        $('#dob').val(response.data.dob);
        $('#age').val(response.data.age);
        $('#address').val(response.data.address);
        $('#bio').val(response.data.bio);

        // New user — no data yet, enable fields directly
        const hasData = response.data.name || response.data.contact || response.data.age;
        if (!hasData) {
          $('#profileForm input:not(#email), #profileForm textarea').prop('disabled', false);
          $('#saveBtn').removeClass('d-none');
          $('#editBtn').addClass('d-none');
        }
      } else {
        window.location.href = 'login.html';
      }
    }
  });

  // Logout
  $('#logoutBtn').on('click', function () {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_email');
    window.location.href = 'login.html';
  });

  // Edit button — enable all fields
  $('#editBtn').on('click', function () {
    $('#profileForm input:not(#email), #profileForm textarea').prop('disabled', false);
    $('#saveBtn').removeClass('d-none');
    $('#editBtn').addClass('d-none');
    $('#message').text('');
  });

  // Save changes
  $('#profileForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      url: 'php/profile.php',
      method: 'POST',
      data: {
        token:   token,
        name:    $('#name').val(),
        contact: $('#contact').val(),
        dob:     $('#dob').val(),
        age:     $('#age').val(),
        address: $('#address').val(),
        bio:     $('#bio').val()
      },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'success') {
          // Go back to read-only mode
          $('#profileForm input:not(#email), #profileForm textarea').prop('disabled', true);
          $('#saveBtn').addClass('d-none');
          $('#editBtn').removeClass('d-none');
          $('#message').text('Profile updated successfully!').removeClass('text-danger').addClass('text-success');
        } else {
          $('#message').text(response.message).removeClass('text-success').addClass('text-danger');
        }
      },
      error: function () {
        $('#message').text('Something went wrong.').removeClass('text-success').addClass('text-danger');
      }
    });

  });

});
