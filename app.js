// app.js

const express = require('express');
const app = express();
const db = require('./db'); // db.js içindeki bağlantıyı alıyoruz
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { sql, poolPromise } = require('./db');
app.use(express.static(__dirname));

// Ortam değişkenlerini yükle (.env dosyasından)
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '\\index.html');
});

// Kullanıcıları listeleme
app.get('/kullanicilar', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Kullanicilar');
        res.json(result.recordset);
    } catch (err) {
        console.error("Veritabanı hatası:", err);
        res.status(500).send("Veritabanı hatası: " + err.message);
    }
});
app.get("/blogyazarlari", async (req, res) => {
  try {
    const pool = await poolPromise; // poolPromise kullanıyorsan sql.connect gerekmez
    const result = await pool.request().query(`
      SELECT 
        B.BlogID,
        B.Baslik,
        B.BlogIcerigi,
        B.Goruntu,
        B.OlusturulmaTarihi,
        K.KullaniciIsim AS YazarAdi
      FROM BlogYazarlari B
      JOIN Kullanicilar K ON B.KullaniciID = K.KullaniciID
      ORDER BY B.BlogID DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Veri alınamadı:", err);
    res.status(500).send("Veri alınamadı.");
  }
});
app.post('/blog-ekle', async (req, res) => {
  try {
    const { Baslik, BlogIcerigi, Goruntu, KullaniciID } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('Baslik', sql.NVarChar(100), Baslik)
      .input('BlogIcerigi', sql.NVarChar(sql.MAX), BlogIcerigi)
      .input('Goruntu', sql.NVarChar(256), Goruntu)
      .input('KullaniciID', sql.Int, KullaniciID)
      .execute('sp_BlogEkle'); // Prosedür adın

    res.send("Blog başarıyla eklendi.");
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).send("Blog eklenemedi: " + err.message);
  }
});
app.delete('/blog-sil/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('BlogID', sql.Int, req.params.id)
      .execute('sp_BlogSil');

    res.send("Blog başarıyla silindi.");
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).send("Blog silinirken hata oluştu.");
  }
});



// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
