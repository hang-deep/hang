const fs = require('fs');
const path = require('path');

const serverPath = path.join('..', 'train-server', 'app.js');

fs.readFile(serverPath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    return;
  }

  const oldCode = `app.post('/api/addUser', async function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var phone = req.body.phone;
    var checkSql = 'SELECT * FROM user WHERE username = ?';
    var [checkRows] = await db.query(checkSql, [username]);
    if (checkRows.length > 0) {
      res.json({ code: 400, msg: 'username exists' });
      return;
    }
    var sql = 'INSERT INTO user(username, password, phone) VALUES (?,?,?)';
    await db.query(sql, [username, password, phone]);
    res.json({ code: 200, msg: 'success' });
  } catch (err) {
    res.json({ code: 500, msg: 'error', error: err.message });
  }
});`;

  const newCode = `app.post('/api/addUser', async function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var checkSql = 'SELECT * FROM user WHERE username = ?';
    var [checkRows] = await db.query(checkSql, [username]);
    if (checkRows.length > 0) {
      res.json({ code: 400, msg: 'username exists' });
      return;
    }
    var sql = 'INSERT INTO user(username, password) VALUES (?,?)';
    await db.query(sql, [username, password]);
    res.json({ code: 200, msg: 'success' });
  } catch (err) {
    res.json({ code: 500, msg: 'error', error: err.message });
  }
});`;

  if (data.includes(oldCode)) {
    const newData = data.replace(oldCode, newCode);
    fs.writeFile(serverPath, newData, (err) => {
      if (err) {
        console.error('写入文件失败:', err);
      } else {
        console.log('修复成功！已移除 phone 字段');
      }
    });
  } else {
    console.log('未找到需要修复的代码段');
  }
});