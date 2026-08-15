/* eslint-disable no-undef */
$(function() {
  $("input[name='category']").on('change', function(e) {
    var category = $(this).val();
    window.location.href = '/menu/' + category;
  });
});
