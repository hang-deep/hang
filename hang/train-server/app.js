const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456'
})

db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err)
    console.error('错误代码:', err.code)
    console.error('错误信息:', err.message)
    return
  }
  console.log('数据库连接成功')
  initDatabase()
})

db.on('error', (err) => {
  console.error('数据库错误:', err)
})

function initDatabase() {
  const createDbSql = 'CREATE DATABASE IF NOT EXISTS train_db DEFAULT CHARACTER SET utf8mb4'
  db.query(createDbSql, (err) => {
    if (err) {
      console.error('创建数据库失败:', err)
      return
    }
    
    const useDbSql = 'USE train_db'
    db.query(useDbSql, (err) => {
      if (err) {
        console.error('使用数据库失败:', err)
        return
      }
      
      createTables()
    })
  })
}

function createTables() {
  const tables = [
    {
      name: 'user',
      sql: `CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    },
    {
      name: 'goods',
      sql: `CREATE TABLE IF NOT EXISTS goods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        img VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      dropFirst: true
    },
    {
      name: 'cart',
      sql: `CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        goodsId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_cart (userId, goodsId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
      dropFirst: true
    },
    {
      name: 'orders',
      sql: `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        totalPrice DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT '待支付',
        address VARCHAR(255),
        phone VARCHAR(20),
        receiver VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    },
    {
      name: 'order_items',
      sql: `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        goodsId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT DEFAULT 1
      )`
    },
    {
      name: 'addresses',
      sql: `CREATE TABLE IF NOT EXISTS addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        province VARCHAR(50),
        city VARCHAR(50),
        district VARCHAR(50),
        detail VARCHAR(255),
        isDefault TINYINT DEFAULT 0
      )`
    }
  ]
  
  let index = 0
  
  function createNextTable() {
    if (index >= tables.length) {
      console.log('数据库表初始化成功')
      initGoodsData()
      return
    }
    
    const table = tables[index]
    
    if (table.dropFirst) {
      db.query(`DROP TABLE IF EXISTS ${table.name}`, (err) => {
        if (err) console.error(`删除${table.name}表失败:`, err)
        
        db.query(table.sql, (err) => {
          if (err) console.error(`创建${table.name}表失败:`, err)
          index++
          createNextTable()
        })
      })
    } else {
      db.query(table.sql, (err) => {
        if (err) console.error(`创建${table.name}表失败:`, err)
        index++
        createNextTable()
      })
    }
  }
  
  createNextTable()
}

function initGoodsData() {
  const goods = [
    { name: 'iPhone 15 Pro Max', price: 12999.00, stock: 100, img: '/static/goods/iphone15Pro Max.png' },
    { name: '华硕天选6', price: 8999.00, stock: 50, img: '/static/goods/华硕天选6.png' },
    { name: '大疆DJI Osmo Pocket4', price: 3499.00, stock: 80, img: '/static/goods/大疆DJI Osmo Pocket4.png' },
    { name: '纯实木鞋架柜', price: 599.00, stock: 200, img: '/static/goods/纯实木鞋架柜.png' },
    { name: '圆形实木茶几', price: 899.00, stock: 100, img: '/static/goods/圆形实木茶几.png' },
    { name: '真皮沙发', price: 2999.00, stock: 60, img: '/static/goods/真皮沙发.png' },
    { name: '福州鱼丸', price: 39.00, stock: 500, img: '/static/goods/福州鱼丸.png' },
    { name: '经典海盐风味苏打饼干', price: 29.00, stock: 300, img: '/static/goods/经典海盐风味苏打饼干.png' },
    { name: '乳酸菌口袋小面包', price: 25.00, stock: 400, img: '/static/goods/乳酸菌口袋小面包.png' },
    { name: '马克华菲纯棉短袖', price: 199.00, stock: 150, img: '/static/goods/马克华菲纯棉短袖.png' },
    { name: '工装牛仔裤男士夏季薄款', price: 159.00, stock: 200, img: '/static/goods/工装牛仔裤男士夏季薄款男裤宽松直筒男生裤子美式微喇裤休闲长裤.png' },
    { name: '休闲鞋男鞋新款复古', price: 299.00, stock: 180, img: '/static/goods/休闲鞋男鞋新款复古老爹鞋减震回弹厚底增高跑步运动鞋.png' }
  ]
  
  goods.forEach(item => {
    const sql = 'INSERT IGNORE INTO goods (name, price, stock, img) VALUES (?, ?, ?, ?)'
    db.query(sql, [item.name, item.price, item.stock, item.img], (err) => {
      if (err && !err.message.includes('Duplicate entry')) {
        console.error('插入商品数据失败:', err)
      }
    })
  })
}

app.get('/api/getGoodsList', (req, res) => {
  const sql = 'SELECT * FROM goods'
  db.query(sql, (err, results) => {
    if (err) {
      res.json({ code: 500, message: '查询失败', data: [] })
    } else {
      res.json({ code: 200, message: '查询成功', data: results })
    }
  })
})

app.post('/api/addGoods', (req, res) => {
  const { name, price, stock, img } = req.body
  const sql = 'INSERT INTO goods (name, price, stock, img) VALUES (?, ?, ?, ?)'
  db.query(sql, [name, price, stock, img], (err, results) => {
    if (err) {
      res.json({ code: 500, message: '添加失败', data: null })
    } else {
      res.json({ code: 200, message: '添加成功', data: { id: results.insertId } })
    }
  })
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const sql = 'SELECT * FROM user WHERE username = ? AND password = ?'
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      res.json({ code: 500, message: '登录失败', data: null })
    } else if (results.length === 0) {
      res.json({ code: 401, message: '用户名或密码错误', data: null })
    } else {
      res.json({ code: 200, message: '登录成功', data: results[0] })
    }
  })
})

app.post('/api/addUser', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 400, message: '请输入用户名和密码', data: null })
  }
  
  const checkSql = 'SELECT * FROM user WHERE username = ?'
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('查询用户失败:', err)
      return res.json({ code: 500, message: '查询失败: ' + err.message, data: null })
    }
    if (results.length > 0) {
      return res.json({ code: 500, message: '用户名已存在', data: null })
    }
    
    const insertSql = 'INSERT INTO user (username, password) VALUES (?, ?)'
    db.query(insertSql, [username, password], (err, insertResults) => {
      if (err) {
        console.error('注册用户失败:', err)
        return res.json({ code: 500, message: '注册失败: ' + err.message, data: null })
      }
      res.json({ code: 200, message: '注册成功', data: { id: insertResults.insertId } })
    })
  })
})

app.post('/api/addToCart', (req, res) => {
  console.log('addToCart请求:', req.body)
  const { userId, goodsId, name, price, quantity } = req.body
  const checkSql = 'SELECT * FROM cart WHERE userId = ? AND goodsId = ?'
  db.query(checkSql, [userId, goodsId], (err, results) => {
    if (err) {
      console.error('查询购物车失败:', err)
      res.json({ code: 500, message: '添加失败', data: null })
    } else if (results.length > 0) {
      const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND goodsId = ?'
      db.query(updateSql, [quantity, userId, goodsId], (err, updateResults) => {
        if (err) {
          console.error('更新购物车失败:', err)
          res.json({ code: 500, message: '更新失败', data: null })
        } else {
          res.json({ code: 200, message: '已加入购物车', data: updateResults })
        }
      })
    } else {
      const insertSql = 'INSERT INTO cart (userId, goodsId, name, price, quantity) VALUES (?, ?, ?, ?, ?)'
      db.query(insertSql, [userId, goodsId, name, price, quantity], (err, insertResults) => {
        if (err) {
          console.error('插入购物车失败:', err)
          res.json({ code: 500, message: '添加失败', data: null })
        } else {
          res.json({ code: 200, message: '加入购物车成功', data: { id: insertResults.insertId } })
        }
      })
    }
  })
})

app.get('/api/getCartList', (req, res) => {
  const userId = req.query.userId || 1
  const sql = 'SELECT c.id as cartId, c.goodsId, c.name, c.price, c.quantity, g.img, g.stock FROM cart c LEFT JOIN goods g ON c.goodsId = g.id WHERE c.userId = ?'
  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.json({ code: 500, message: '查询失败', data: [] })
    } else {
      res.json({ code: 200, message: '查询成功', data: results })
    }
  })
})

app.post('/api/updateCart', (req, res) => {
  const { userId, goodsId, quantity } = req.body
  if (quantity <= 0) {
    const deleteSql = 'DELETE FROM cart WHERE userId = ? AND goodsId = ?'
    db.query(deleteSql, [userId, goodsId], (err, results) => {
      if (err) {
        res.json({ code: 500, message: '删除失败', data: null })
      } else {
        res.json({ code: 200, message: '已删除', data: results })
      }
    })
  } else {
    const updateSql = 'UPDATE cart SET quantity = ? WHERE userId = ? AND goodsId = ?'
    db.query(updateSql, [quantity, userId, goodsId], (err, results) => {
      if (err) {
        res.json({ code: 500, message: '更新失败', data: null })
      } else {
        res.json({ code: 200, message: '更新成功', data: results })
      }
    })
  }
})

app.post('/api/deleteFromCart', (req, res) => {
  const { userId, goodsId } = req.body
  const sql = 'DELETE FROM cart WHERE userId = ? AND goodsId = ?'
  db.query(sql, [userId, goodsId], (err, results) => {
    if (err) {
      res.json({ code: 500, message: '删除失败', data: null })
    } else {
      res.json({ code: 200, message: '删除成功', data: results })
    }
  })
})

app.post('/api/clearCart', (req, res) => {
  const userId = req.body.userId || 1
  const sql = 'DELETE FROM cart WHERE userId = ?'
  db.query(sql, [userId], (err, results) => {
    if (err) {
      res.json({ code: 500, message: '清空失败', data: null })
    } else {
      res.json({ code: 200, message: '清空成功', data: results })
    }
  })
})

app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`)
})

process.on('SIGINT', () => {
  console.log('正在关闭服务器...')
  db.end(() => {
    console.log('数据库连接已关闭')
    process.exit(0)
  })
})

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason)
})
