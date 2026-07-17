const fs = require('fs');
const path = require('path');

const serverPath = path.join('..', 'train-server', 'app.js');

fs.readFile(serverPath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  const newData = data.replace(/module\.exports = app;/, `app.listen(3000, function() {
  console.log('Server running on port 3000');
});`);

  fs.writeFile(serverPath, newData, (err) => {
    if (err) {
      console.error('写入文件失败:', err);
    } else {
      console.log('修复成功！已恢复服务器启动代码');
    }
  });
});