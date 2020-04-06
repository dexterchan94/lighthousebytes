
const createOrderElement = (order, user_id, userType) => {
  const markup = `
  <h1>Order #${order.id}</h1>
  `;
  return markup;
}


const renderOrders = (data) => {
  if (!data.user_id) {
    $("#orders-container").append(`<h1>Please login to view this page</h1>`);
  } else {
    $("#orders-container").append(`<h1>Orders</h1>`);
    for (order of data.orders) {
      $("#orders-container").append(createOrderElement(order, data.user_id, data.userType));
    }
  }
};

const loadOrders = () => {
  $.get("/orders/data")
  .done((data) => {
    renderOrders(data);
  })
  .fail((err) => {
    console.log(err);
  });
};

$(document).ready(() => {

  loadOrders();

});
