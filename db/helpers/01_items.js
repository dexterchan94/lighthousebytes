const getAllItems = (db) => {
  return db.query(`SELECT * FROM items WHERE active = true;`)
        .then(data => {
          return data.rows;
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
};

module.exports = {
  getAllItems
};
