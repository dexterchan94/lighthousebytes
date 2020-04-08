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
      console.log(content, data.rows[0].phone, process.env.TWILIO_PHONE);

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

const sendMessageToAdmin = (db, content) => {
  const queryString = `
  SELECT phone
  FROM users
  WHERE id = $1;
  `;
  const adminId = 1;
  db.query(queryString, [adminId])
    .then((data) => {
      console.log(content, data.rows[0].phone, process.env.TWILIO_PHONE);

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
  sendMessage, sendMessageToAdmin
};
