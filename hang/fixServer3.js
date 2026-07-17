const fs = require('fs');
const path = require('path');

const serverPath = path.join('..', 'train-server', 'app.js');

fs.readFile(serverPath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  const oldCode = `app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});`;

  const newCode = `app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});`;

  if (data.includes(oldCode)) {
    const newData = data.replace(oldCode, newCode);
    fs.writeFile(serverPath, newData, (err) => {
      if (err) {
        console.error('写入文件失败:', err);
      } else {
        console.log('修复成功！已完善 CORS 配置');
      }
    });
  } else {
    console.log('未找到需要修复的代码段');
  }
});