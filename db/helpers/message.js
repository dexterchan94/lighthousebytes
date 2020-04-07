const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const sendMessage = (phone, content) => {
  client.messages
    .create({
       body: content,
       from: '+16042432719',
       to: phone
     })
    .then(message => console.log(message.sid));
};

module.exports = {
  sendMessage
};
