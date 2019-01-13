/* eslint-disable no-undef */
$(function() {
  $("input[name='category']").on('change', function(e) {
    e.preventDefault();
    var category = $(this)
      .parent()
      .parent()
      .find("input[name='category']:checked")
      .val();

    console.log(category);
  });
});
