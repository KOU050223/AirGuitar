const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ファイル操作のために fs モジュールを追加
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('aaaaaaaaaaaaa');
});

// multerのストレージ設定をカスタマイズ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 保存先ディレクトリを指定
    cb(null, path.join(__dirname, 'assets')); // 'assets' フォルダに保存
  },
  filename: (req, file, cb) => {
    const index = file.fieldname.split('-')[1]; // 例: audio-1 から 1 を取得
    const filename = `audio-${index}.mp3`; // ファイル名: audio-1.mp3, audio-2.mp3 のように設定

    // 同じファイル名がすでに存在するかチェック
    const filePath = path.join(__dirname, 'assets', filename);

    if (fs.existsSync(filePath)) {
      // ファイルが存在すれば上書き
      cb(null, filename);
    } else {
      // ファイルが存在しなければ新規保存
      cb(null, filename);
    }
  }
});

const upload = multer({
  storage: storage, // 上記でカスタマイズしたストレージ設定を使う
  limits: { fileSize: 10 * 1024 * 1024 }, // 最大10MB
});

app.post('/upload', upload.any(), (req, res) => {
  // 保存されたファイル名をログに表示
  res.send('音声ファイルが保存されました');
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しています`);
});
