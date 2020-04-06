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

  $('.counterBox button').click(function() {
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

  $('.add-cart').click(function() {
    const itemNo = this.parentNode.childNodes[1].childNodes[7].id;
    const qty = this.parentNode.childNodes[1].childNodes[3].value
    const price = this.parentNode.childNodes[1].childNodes[9].value;

    if (Number(qty) !== 0) {
      console.log(itemNo, qty, price);

    } else {
      console.log('Please specify a nubmer of items you want');
    }

  })

});
