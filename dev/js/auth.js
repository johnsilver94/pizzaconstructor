/* eslint-disable no-undef */
$(function() {
  // remove errors
  function removeErrors() {
    $('p.error').remove();
    $('input').removeClass('error');
  }

  // clear
  $('input.form-control').on('focus', function() {
    console.log('focus');
    removeErrors();
  });

  //register
  $('.register-button').on('click', function(e) {
    e.preventDefault();
    removeErrors();

    var data = {
      login: $('#username').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      passwordConfirm: $('#confirmpassword').val()
    };
    console.log(data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/register'
    }).done(function(data) {
      if (!data.ok) {
        $('.form-register').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href', '/');
      }
    });
  });

  //login
  $('.login-button').on('click', function(e) {
    e.preventDefault();
    removeErrors();

    console.log('login');

    var data = {
      login: $('#loginusername').val(),
      password: $('#loginpassword').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/login'
    }).done(function(data) {
      if (!data.ok) {
        $('.form-login').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href', '/');
      }
    });
  });
});
