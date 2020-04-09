const getAllItems = (db) => {
  return db.query(`SELECT * FROM items WHERE active = true;`)
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      console.error(err);
    });
};

const placeOrder = (db, items, userID) => {
  // INSERT orders with userID
  const queryStringOrder = `INSERT INTO orders (user_id) VALUES ($1) returning id;`;

  // INSERT order_items with orderID
  let queryStringOrderItems = `INSERT INTO order_items (order_id, item_id, quantity) VALUES `;

  return db.query(queryStringOrder, [userID])
    .then(data => {
      return data.rows[0].id;
    })
    .then(orderID => {

      // arr[0] remains the same
      const queryParamsOrderItems = [orderID];
      let [curItemNo, paramIndex, comma] = [1, 2, ','];

      // loop through ordered menu objects
      for (const item in items) {
        // put comma between objects, semicolon for the last object
        if (curItemNo >= Object.keys(items).length) {
          comma = ';';
        }
        queryStringOrderItems += `($1, $${paramIndex}, $${paramIndex + 1})${comma} `;
        queryParamsOrderItems.push(item.substr(-1), items[item]);
        paramIndex += 2;
        curItemNo++;
      }

      db.query(queryStringOrderItems, queryParamsOrderItems);
      return orderID;
    })
    .catch(err => {
      console.error(err);
    });



}

module.exports = {
  getAllItems, placeOrder
};
