const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/',(req,res) => {
    res.send('aaaaaaaaaaaaa');
});

const upload = multer({
  dest: path.join(__dirname, 'assets'), // 保存先ディレクトリ
  limits: { fileSize: 10 * 1024 * 1024 }, // 最大10MB
});

app.post('/upload', upload.any(), (req, res) => {
  res.send('音声ファイルが保存されました');
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しています`);
});
