// db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Azure kullanıyorsan true olmalı
    trustServerCertificate: true // local geliştirme için true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('SQL Server bağlantısı başarılı');
    return pool;
  })
  .catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
  });

module.exports = {
  sql,poolPromise
};
