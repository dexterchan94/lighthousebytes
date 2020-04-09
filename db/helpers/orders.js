const getAllOrders = (db) => {
  const queryString = `
  SELECT DISTINCT orders.*, users.first_name AS first_name, users.last_name AS last_name, SUM(order_items.quantity * items.price) AS total_price, users.type AS user_type
  FROM orders
  JOIN users ON users.id = orders.user_id
  JOIN order_items ON order_items.order_id = orders.id
  JOIN items ON items.id = order_items.item_id
  GROUP BY orders.id, users.first_name, users.last_name, users.type
  ORDER BY orders.created_at DESC;
  `;
  return db.query(queryString)
    .then(orders => {
      const promises = [];
      for (row of orders.rows) {
        promises.push(getOrderItems(db,row.id,row).catch(err => console.log(err)));
      }
      return Promise.all(promises)
        .then(values => values);
    })
    .catch(err => console.log(err));
};

// Fetch all items and quantitied for a specific order
const getOrderItems = (db, orderID, row) => {
  const queryString = `
  SELECT items.name AS item_name, order_items.quantity AS quantity, (items.price * quantity) AS item_total
  FROM items
  JOIN order_items ON order_items.item_id = items.id
  WHERE order_items.order_id = $1
  `;
  return db.query(queryString, [orderID])
    .then(data => {
      row.items = data.rows;
      return row;
    })
    .catch(err => console.log(err));
};

const acceptOrder = (db, orderID) => {
  const queryString = `
  UPDATE orders SET accepted_at = Now(), status = 'accepted'
  WHERE id = $1
  `;
    return db.query(queryString, [orderID])
    .then(data => data.rows)
    .catch(err => console.log(err));
};

const completeOrder = (db, orderID) => {
  const queryString = `
  UPDATE orders SET completed_at = Now(), status = 'completed'
  WHERE id = $1
  `;
  return db.query(queryString, [orderID])
  .then(data => data.rows)
  .catch(err => console.log(err));
};

const cancelOrder = (db, orderID) => {
  const queryString = `
  UPDATE orders SET cancelled_at = Now(), status = 'cancelled'
  WHERE id = $1
  `;
    return db.query(queryString, [orderID])
    .then(data => data.rows)
    .catch(err => console.log(err));
};

module.exports = {
  getAllOrders,
  getOrderItems,
  acceptOrder,
  completeOrder,
  cancelOrder
};
