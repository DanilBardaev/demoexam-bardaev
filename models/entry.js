
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");



const createEntriesTableSql = `
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    imagePath TEXT,
    bookingTime TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;


db.run(createEntriesTableSql);

class Entry {
  static create(data) {
    const insertEntrySql = `
      INSERT INTO entries (username, title, content, imagePath, bookingTime, timestamp, createdAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    db.run(insertEntrySql, [data.username, data.title, data.content, data.imagePath, data.bookingTime], (err) => {
      if (err) {
        console.error("Error creating entry:", err);
      } else {
  
      }
    });
  }

  static selectAll(cb) {
    const selectAllSql = "SELECT * FROM entries ORDER BY timestamp DESC";
    db.all(selectAllSql, cb);
  }

  static getEntryById(id, cb) {
    const selectEntrySql = "SELECT * FROM entries WHERE id = ?";
    db.get(selectEntrySql, [id], cb);
  }

  
  static deleteById(id, cb) {
    const deleteEntrySql = "DELETE FROM entries WHERE id = ?";
    db.run(deleteEntrySql, [id], cb);
  }


  static updateById(id, updateInf, cb) {
    const updateEntrySql = `
      UPDATE entries
      SET title = ?, content = ?, imagePath = ?, bookingTime = ?, timestamp = datetime('now')
      WHERE id = ?
    `;
    db.run(updateEntrySql, [updateInf.title, updateInf.content, updateInf.imagePath, updateInf.bookingTime, id], cb);
  }
}

module.exports = Entry;
