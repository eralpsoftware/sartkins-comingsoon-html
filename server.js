const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3020;

// Statik dosyalar için public klasörü
app.use(express.static(path.join(__dirname)));

// Dil algılama fonksiyonu
function detectLanguage(req) {
  // Accept-Language header'ından dil bilgisini al
  const acceptLanguage = req.headers['accept-language'] || '';
  console.log('Accept-Language:', acceptLanguage);
  
  if (!acceptLanguage) {
    return 'en'; // Varsayılan
  }
  
  // Accept-Language formatı: "en-US,en;q=0.9,tr;q=0.8,..."
  // İlk dil tercihini al (virgülden önceki kısım)
  const firstLanguage = acceptLanguage.split(',')[0].trim();
  
  // Dil kodunu al (örn: "en-US" -> "en", "tr-TR" -> "tr")
  const languageCode = firstLanguage.split('-')[0].toLowerCase();
  
  console.log('Detected language code:', languageCode);
  
  // Dil kontrolü
  if (languageCode === 'tr') {
    return 'tr';
  }
  
  if (languageCode === 'ar') {
    return 'ar';
  }
  
  // Varsayılan olarak İngilizce
  return 'en';
}

// Ana route
app.get('/', (req, res) => {
  const lang = detectLanguage(req);
  console.log(lang);
  const filePath = path.join(__dirname, `index-${lang}.html`);
  
  // Dosyanın varlığını kontrol et
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Dosya yoksa varsayılan olarak Türkçe gönder
    res.sendFile(path.join(__dirname, 'index-tr.html'));
  }
});

// Manuel dil seçimi için route'lar
app.get('/tr', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-tr.html'));
});

app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-en.html'));
});

app.get('/ar', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-ar.html'));
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
  console.log(`Türkçe: http://localhost:${PORT}/tr`);
  console.log(`İngilizce: http://localhost:${PORT}/en`);
  console.log(`Arapça: http://localhost:${PORT}/ar`);
});

