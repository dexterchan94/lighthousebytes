$(() => {
  window.onscroll = () => makeSideSticky();

  const sideBar = $('#cart');
  // height of current navBar = 62px + margin around 28px;
  const sticky = sideBar[0].offsetTop - 90;

  const makeSideSticky = () => {
    if (window.pageYOffset >= sticky) {
      sideBar.addClass('sticky');
    } else {
      sideBar.removeClass('sticky');
    }
  };

  const addItem = (itemId, name, qty, price) => {
    const $cartItem = $('<div>').addClass('row');
    $cartItem.attr('id', `cart-${itemId}`);

    // item name
    const $itemName = $('<div>').addClass('col-6');
    $itemName.append(name);

    // item quantity
    const $itemQty = $('<div>').addClass('col-1');
    $itemQty.append(qty);

    // item price
    const $itemPrice = $('<div>').addClass('col-3');
    $itemPrice.append(`$${(price / 100).toFixed(2)}`);

    // remove button
    const $removeButton = $('<div>').addClass('col-1 rmv-btn');
    const $removeIcon = $('<i>').addClass('far fa-trash-alt');
    $removeButton.append($removeIcon);

    // append name, quantity, price to $cartItem
    $cartItem.append($itemName, $itemQty, $itemPrice, $removeButton);

    console.log($cartItem);
    return $cartItem;
  };

  $('.counterBox button').click(function () {
    let qty = this.parentNode.childNodes[3].value;
    // console.log(this.parentNode.childNodes[7].id);

    if (this.className.indexOf('up_count') !== -1) {
      qty = Number(qty) + 1;
    } else {
      qty = Number(qty) - 1;
    };
    qty = qty < 0 ? 0 : qty;
    this.parentNode.childNodes[3].value = qty;
  });
  $('.counter').click(function () {
    $(this).focus().select();
  });

  // event bindig on dynamic elements
  $('body').on('click', '.rmv-btn', function() {
    $(this).parent().remove();

    if ($('.row').length === 0) {
      $('.cart-checkout').prop('disabled', true);
    }
  });

  $('.add-cart').click(function() {
    const currentNodes = this.parentNode.childNodes[1];
    const itemId = currentNodes.childNodes[7].id;
    const qty = currentNodes.childNodes[3].value
    const price = currentNodes.childNodes[9].value;
    const name = this.parentNode.parentNode.childNodes[1].innerHTML;

    if (Number(qty) !== 0) {
      const $itemData = addItem(itemId, name, qty, price);
      $('.cart-body-wrapper').append($itemData);

      if ($('.row').length > 0) {
        $('.cart-checkout').prop('disabled', false);
      }

    } else {
      console.log('Please specify a nubmer of items you want');
    }
  });




});
