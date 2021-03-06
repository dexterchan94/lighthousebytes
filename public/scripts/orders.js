const createOrderElement = (order, userType) => {
  // Bootstrap card containers, order ID, and guest name
  let markup = `
  <article class="order-${order.id} card mb-3 order-box">
    <div class="row no-gutters">
      <div class="col-md-12">
        <div class="d-flex flex-column justify-content-between card-body">
          <div class="d-flex flex-row justify-content-between align-items-center">
            <span class="card-title order-number">Order #${order.id}</span>
            <span class="card-title customer-name">${order.first_name} ${order.last_name}</span>
          </div>
          <ul>
  `;

  // Price breakdown for the order
  for (item of order.items) {
    markup += `<li>${item.item_name} x ${item.quantity}</li>`;
  }

  markup += `
          </ul>
          <div class="d-flex flex-row justify-content-between align-items-center">
          <span class="card-text total-price">Total: $${(order.total_price / 100).toFixed(2)}</span>
  `;

  // Order status text
  if (order.status === 'pending') {
    let dateCreated = new Date(order.created_at);
    markup += `<span class="card-text status-text text-muted">Created at: ${dateCreated.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  } else if (order.status === 'accepted') {
    let dateAccepted = new Date(order.accepted_at);
    markup += `<span class="card-text status-text text-muted">Accepted at: ${dateAccepted.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  } else if (order.status === 'completed') {
    let dateCompleted = new Date(order.completed_at);
    markup += `<span class="card-text status-text text-muted">Completed at: ${dateCompleted.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  } else if (order.status === 'cancelled') {
    let dateCancelled = new Date(order.cancelled_at);
    markup += `<span class="card-text status-text text-muted">Cancelled at: ${dateCancelled.toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>`;
  }

  markup +=`
    </div>
  `;

  // Special request text - only appears if there is a special request
  if (order.special_request) {
    markup += `
      <p class="special-request-text my-2"><strong>Special Request: ${order.special_request}</strong></p>
    `;
  }

  markup += `
    <div class="d-flex flex-row justify-content-end align-items-center mt-3">
  `;

  if (userType === "admin") {
      // Accept button - only appears for admin user if the order is pending
      markup += `
      <form class="accept-form hidden" method="POST" action="/orders/${order.id}/accept" data-order-id="${order.id}">
        <input type="number" class="preptime" name="preptime" placeholder="minutes to prepare">
        <button type="submit" class="btn btn-outline-primary mx-2">Accept</button>
      </form>
      `;

      // Complete button - only appears for admin user if the order is accepted
      markup += `
      <form class="complete-form hidden" method="POST" action="/orders/${order.id}/complete" data-order-id="${order.id}">
        <button type="submit" class="btn btn-outline-success mx-2">Complete</button>
      </form>
      `;
  }

// Cancel button - only appears if the order is pending
  markup +=`
  <form class="cancel-form hidden" method="POST" action="/orders/${order.id}/cancel" data-order-id="${order.id}">
    <button type="submit" class="btn btn-outline-danger mx-2">Cancel</button>
  </form>
  `;

  // Blank form error text - only appears if user submits a blank form
  markup += `
            </div>
          <p class="error-text hidden my-2 text-danger">Enter order preparation time</p>
  `;

  markup += `
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
        $("#orders-container").append(createOrderElement(order, data.userType));
        if (order.status === 'pending') {
          $(`.order-${order.id} .accept-form`).removeClass("hidden");
          $(`.order-${order.id} .cancel-form`).removeClass("hidden");
        } else if (order.status === 'accepted') {
          $(`.order-${order.id} .complete-form`).removeClass("hidden");
        }
      }
    }
  }
};

const loadOrders = () => {

  $.get("/orders/data")
  .done((data) => {
    renderOrders(data);
  })
  .fail(err => console.log(err));

};


$(document).ready(() => {

  loadOrders();

  $("#orders-container").on('submit', '.accept-form', function (event) {
    event.preventDefault();

    const $form = $(this);
    const data = $form.data();
    const orderId = data.orderId;
    const $prepTimeInput = $form.find('.preptime');

    // Show error text is form input is empty
    if (!$prepTimeInput.val()) {
      $(`.order-${orderId} .error-text`).slideDown();
    } else {
      // Update order status and display the 'complete' button
      $.post(`/orders/${orderId}/accept`, $(this).serialize())
        .done((res) => {
          $(`.order-${orderId} .error-text`).slideUp();
          $(`.order-${orderId} .accept-form`).addClass("hidden");
          $(`.order-${orderId} .cancel-form`).addClass("hidden");
          $(`.order-${orderId} .complete-form`).removeClass("hidden");
          $(`.order-${orderId} .status-text`).html(`Accepted at: ${(new Date()).toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}`);
        })
        .fail(err => console.log(err));
    }

  });


  $("#orders-container").on('submit', '.complete-form', function (event) {
    event.preventDefault();

    const $form = $(this);
    const data = $form.data();
    const orderId = data.orderId;

    // Update order status and hide the 'complete' button
    $.post(`/orders/${orderId}/complete`)
      .done(() => {
        $(`.order-${orderId} .complete-form`).addClass("hidden");
        $(`.order-${orderId} .status-text`).html(`Completed at: ${(new Date()).toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}`);
      })
      .fail(err => console.log(err));
  });

  $("#orders-container").on('submit', '.cancel-form', function (event) {
    event.preventDefault();

    const $form = $(this);
    const data = $form.data();
    const orderId = data.orderId;

    // Update order status and hide all buttons
    $.post(`/orders/${orderId}/cancel`)
      .done(() => {
        $(`.order-${orderId} .accept-form`).addClass("hidden");
        $(`.order-${orderId} .cancel-form`).addClass("hidden");
        $(`.order-${orderId} .status-text`).html(`Cancelled at: ${(new Date()).toLocaleString("en-US", {year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}`);
      })
      .fail(err => console.log(err));
  });


});
