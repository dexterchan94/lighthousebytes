
const createOrderElement = (order, user_id, userType) => {
  let markup = `
  <article class="order-${order.id} card mb-3">
    <div class="row no-gutters">
      <div class="col-md-12">
        <div class="d-flex flex-column justify-content-center card-body h-100">
          <div class="d-flex flex-row justify-content-between align-items-center">
            <span class="card-title">Order #${order.id}</span>
            <span class="card-title">${order.first_name} ${order.last_name}</span>
          </div>
          <ul>
  `;

  for (item of order.items) {
    markup += `<li>${item.item_name} x ${item.quantity}</li>`;
  }

  markup += `
          <div class="d-flex flex-row justify-content-between align-items-center my-3">
          <span class="card-title">Total: $${(order.total_price / 100).toFixed(2)}</span>
  `;

  if (order.status === 'pending') {
    let dateCreated = new Date(order.created_at);
    markup += `<span class="card-text">Created at: ${dateCreated.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  } else if (order.status === 'accepted') {
    let dateAccepted = new Date(order.accepted_at);
    markup += `<span class="card-text">Accepted at: ${dateAccepted.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  } else if (order.status === 'completed') {
    let dateCompleted = new Date(order.completed_at);
    markup += `<span class="card-text">Completed at: ${dateCompleted.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  }
  markup += `
          </div>
          <div class="d-flex flex-row justify-content-end align-items-center mt-3">
  `;

  if (userType === "admin") {
    if (order.status === 'pending') {
      markup += `
      <form class="accept-form" method="POST" action="/orders/${order.id}/accept">
        <input type="number" name="preptime" placeholder="minutes">
        <button type="submit" class="btn btn-outline-primary mx-2">Accept</button>
      </form>

      <form class="reject-form" method="POST" action="/orders/${order.id}/reject">
        <button type="submit" class="btn btn-outline-danger mx-2">Reject</button>
      </form>
      `;
    } else if (order.status === 'accepted') {
      markup += `
      <form class="complete-form" method="POST" action="/orders/${order.id}/complete">
        <button type="submit" class="btn btn-outline-success mx-2">Complete</button>
      </form>
      `;
    }
  }

  markup += `
          </div>
          </ul>
        </div>
      </div>
    </div>
  </article>
  `;

  return markup;
};



const renderOrders = (data) => {
  $("#orders-container").empty();
  if (!data.user_id) {
    $("#orders-container").append(`<h1>Please login to view this page</h1>`);
  } else {
    $("#orders-container").append(`<h1>Orders</h1>`);
    for (order of data.orders) {
      if (order.user_id == data.user_id || data.userType === "admin") {
        $("#orders-container").append(createOrderElement(order, data.user_id, data.userType));
      }
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


  $(".accept-form").on('submit', function (event) {
    // Prevent page from refreshing
    event.preventDefault();

    $.post(`/order/${this.id}/accept`, $(this).serialize())
      .done(() => {
        console.log(`Order ${this.id} accepted! Estimated time: ${this.preptime} minutes`);
        loadOrders();
      })
      .fail((err) => {
        console.log(err);
      });
  });

  $(".complete-form").on('submit', function (event) {
    // Prevent page from refreshing
    event.preventDefault();

    $.post(`/order/${this.id}/complete`, $(this).serialize())
      .done(() => {
        console.log(`Order ${this.id} completed!`);

        loadOrders();
      })
      .fail((err) => {
        console.log(err);
      });
  });




});
