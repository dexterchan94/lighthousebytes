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

  $('button').click(function() {
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

});
