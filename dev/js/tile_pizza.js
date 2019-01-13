/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(function() {
  $('.add-product').on('click', function(e) {
    e.preventDefault();

    // eslint-disable-next-line no-unused-vars
    var size = $(this)
      .siblings('.size')
      .find("input[name='size']:checked")
      .val();
    var qty = $(this)
      .siblings('price-qty')
      .find('.qty')
      .find("input[type='number']")
      .val();
  });
  $("input[name='qty']").on('change', function(e) {
    e.preventDefault();
    var price = $(this)
      .parent()
      .siblings('.price')
      .find('p')
      .text();

    var qty = $(this).val();
    var totalOutput = $(this)
      .parent()
      .parent()
      .siblings('button')
      .find('span');

    price = parseFloat(price);
    qty = parseFloat(qty);
    var total = qty * price;

    totalOutput.text(' (' + total + ' RON)');
  });
  $("input[name='size']").on('change', function(e) {
    e.preventDefault();
    var price = $(this)
      .siblings('label')
      .find('i')
      .text();
    var qty = $(this)
      .parent()
      .parent()
      .siblings('.price-qty')
      .find('.qty')
      .find("input[type='number']")
      .val();
    var priceOutput = $(this)
      .parent()
      .parent()
      .siblings('.price-qty')
      .find('.price')
      .find('p');
    var totalOutput = $(this)
      .parent()
      .parent()
      .siblings('button')
      .find('span');

    price = parseFloat(price);
    qty = parseFloat(qty);
    var total = qty * price;

    totalOutput.text(' (' + total + ' RON)');
    priceOutput.text(price);
  });
});
