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

  $('button').click(function (e) {
    console.log(this);
    // let button_classes, value = +$('.counter').val();
    // button_classes = $(e.currentTarget).prop('class');
    // if (button_classes.indexOf('up_count') !== -1) {
    //   this.value = (this.value) + 1;
    // } else {
    //   this.value = (this.value) - 1;
    // }
    // value = value < 0 ? 0 : value;
    // $('.counter').val(value);
  });
  $('.counter').click(function () {
    $(this).focus().select();
  });

});
