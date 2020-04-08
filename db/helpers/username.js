const getUsernameWithID = (db, id) => {
  const queryString = `
    SELECT first_name, last_name
    FROM users
    WHERE id = $1;
  `;
  return db.query(queryString, [id])
    .then((user) => {
      return `${user.rows[0].first_name} ${user.rows[0].last_name}`;
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = {
  getUsernameWithID
}
