/* eslint-disable no-undef */
$(function() {
  $('.delete-item').on('click', function(e) {
    e.preventDefault();

    $(this)
      .parent()
      .parent()
      .remove();
  });
  $("input[name='price-qty']").on('change', function(e) {
    e.preventDefault();
    var price = $(this)
      .siblings('.text-price')
      .text();
    var qty = $(this).val();
    var totalOutput = $(this)
      .parent()
      .parent()
      .siblings('.subtotal')
      .find('.text-subtotal');

    price = parseFloat(price);
    qty = parseFloat(qty);
    var total = qty * price;

    totalOutput.text(total);
  });
  $("input[name='basket-item-size']").on('change', function(e) {
    e.preventDefault();
    var price = $(this)
      .siblings('label')
      .find('i')
      .text();
    var qty = $(this)
      .parent()
      .parent()
      .siblings('.qty')
      .find('.price-qty')
      .find("input[type='number']")
      .val();
    var priceOutput = $(this)
      .parent()
      .parent()
      .siblings('.qty')
      .find('.text-price');
    var totalOutput = $(this)
      .parent()
      .parent()
      .siblings('.subtotal')
      .find('.text-subtotal');

    price = parseFloat(price);
    qty = parseFloat(qty);
    var total = qty * price;

    totalOutput.text(total);
    priceOutput.text(price);
  });
});
