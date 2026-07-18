var express = require('express');
var db = require('./db');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});

app.get('/api/getUserList', async function(req, res) {
  try {
    var [rows] = await db.query('SELECT * FROM user');
    res.json({ code: 200, message: 'success', data: rows });
  } catch (err) {
    res.json({ code: 500, message: '获取用户列表失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.get('/api/getGoodsList', async function(req, res) {
  try {
    var [rows] = await db.query('SELECT * FROM goods');
    res.json({ code: 200, message: 'success', data: rows });
  } catch (err) {
    res.json({ code: 500, message: '获取商品列表失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/addGoods', async function(req, res) {
  try {
    var name = req.body.name;
    var price = req.body.price;
    var stock = req.body.stock;
    var img = req.body.img;
    var sql = 'INSERT INTO goods(name,price,stock,img) VALUES (?,?,?,?)';
    await db.query(sql, [name, price, stock, img]);
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '添加商品失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/login', async function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    var [rows] = await db.query(sql, [username, password]);
    if (rows.length > 0) {
      res.json({ code: 200, message: 'success', data: rows[0] });
    } else {
      res.json({ code: 401, message: '用户名或密码错误' });
    }
  } catch (err) {
    res.json({ code: 500, message: '登录失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/addUser', async function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var checkSql = 'SELECT * FROM user WHERE username = ?';
    var [checkRows] = await db.query(checkSql, [username]);
    if (checkRows.length > 0) {
      res.json({ code: 400, message: '用户名已存在' });
      return;
    }
    var sql = 'INSERT INTO user(username, password) VALUES (?,?)';
    await db.query(sql, [username, password]);
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '注册失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.get('/api/getCartList', async function(req, res) {
  try {
    var userId = parseInt(req.query.userId) || 1;
    var sql = 'SELECT c.id as cartId, c.goodsId, c.quantity, g.name, g.price, g.img, g.stock, (g.price * c.quantity) as subtotal FROM cart c JOIN goods g ON c.goodsId = g.id WHERE c.userId = ? ORDER BY c.created_at DESC';
    var [rows] = await db.query(sql, [userId]);
    res.json({ code: 200, message: 'success', data: rows });
  } catch (err) {
    res.json({ code: 500, message: '获取购物车失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/addToCart', async function(req, res) {
  try {
    var userId = parseInt(req.body.userId) || 1;
    var goodsId = parseInt(req.body.goodsId);
    var name = req.body.name || '';
    var price = parseFloat(req.body.price) || 0;
    var quantity = parseInt(req.body.quantity) || 1;
    
    var checkSql = 'SELECT * FROM cart WHERE userId = ? AND goodsId = ?';
    var [checkRows] = await db.query(checkSql, [userId, goodsId]);
    
    if (checkRows.length > 0) {
      var updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND goodsId = ?';
      await db.query(updateSql, [quantity, userId, goodsId]);
    } else {
      var insertSql = 'INSERT INTO cart(userId, goodsId, name, price, quantity) VALUES (?,?,?,?,?)';
      await db.query(insertSql, [userId, goodsId, name, price, quantity]);
    }
    
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '添加失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/updateCart', async function(req, res) {
  try {
    var userId = parseInt(req.body.userId) || 1;
    var goodsId = parseInt(req.body.goodsId);
    var quantity = parseInt(req.body.quantity);
    
    if (quantity <= 0) {
      var deleteSql = 'DELETE FROM cart WHERE userId = ? AND goodsId = ?';
      await db.query(deleteSql, [userId, goodsId]);
    } else {
      var updateSql = 'UPDATE cart SET quantity = ? WHERE userId = ? AND goodsId = ?';
      await db.query(updateSql, [quantity, userId, goodsId]);
    }
    
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '更新购物车失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/deleteFromCart', async function(req, res) {
  try {
    var userId = parseInt(req.body.userId) || 1;
    var goodsId = parseInt(req.body.goodsId);
    
    var sql = 'DELETE FROM cart WHERE userId = ? AND goodsId = ?';
    await db.query(sql, [userId, goodsId]);
    
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '删除购物车商品失败：' + (err.message || '未知错误'), error: err.message });
  }
});

app.post('/api/clearCart', async function(req, res) {
  try {
    var userId = parseInt(req.body.userId) || 1;
    
    var sql = 'DELETE FROM cart WHERE userId = ?';
    await db.query(sql, [userId]);
    
    res.json({ code: 200, message: 'success' });
  } catch (err) {
    res.json({ code: 500, message: '清空购物车失败：' + (err.message || '未知错误'), error: err.message });
  }
});

module.exports = app;