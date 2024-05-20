const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");


const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL, isAdmin INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, profile_img TEXT DEFAULT 'https://kappa.lol/Nykez')";

db.run(sql);

class User {
  static create(username, email, password, age, isAdmin, recipientEmail, cb) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return cb(err);
      const insertUserQuery = "INSERT INTO users (name, email, password, age, isAdmin) VALUES (?, ?, ?, ?, ?)";
      db.run(insertUserQuery, [username, email, hashedPassword, age, isAdmin], (err) => {
        if (err) return cb(err);
       
        cb(null);
      });
    });
  }
  
  static findOneByEmail(email, cb) {
    const selectUserQuery = "SELECT * FROM users WHERE email = ?";
    db.get(selectUserQuery, [email], (err, user) => {
      if (err) {
        console.error("Ошибка при поиске пользователя по email:", err);
        return cb(err);
      }
      cb(null, user); 
    });
  }
  
  static findOneByName(username, cb) {
    const selectUserQuery = "SELECT * FROM users WHERE name = ?";
    db.get(selectUserQuery, [username], (err, user) => {
      if (err) {
        console.error("Ошибка при поиске пользователя по имени:", err);
        return cb(err); 
      }
      cb(null, user); 
    });
  }
  
 
  }


module.exports = User;
