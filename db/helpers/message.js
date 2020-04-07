const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const sendMessage = (db, id, content) => {
  const queryString = `
  SELECT users.phone AS phone
  FROM users
  JOIN orders ON orders.user_id = users.id
  WHERE orders.id = $1;
  `;
  db.query(queryString, [id])
    .then((data) => {
      client.messages
        .create({
           body: content,
           from: process.env.TWILIO_PHONE,
           to: data.rows[0].phone
         })
        .then(message => console.log(message.sid));
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  sendMessage
};
