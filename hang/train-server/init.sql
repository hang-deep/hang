CREATE DATABASE IF NOT EXISTS train_db DEFAULT CHARACTER SET utf8mb4;

USE train_db;

CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  img VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  goodsId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart (userId, goodsId),
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (goodsId) REFERENCES goods(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  totalPrice DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT '待支付',
  address VARCHAR(255),
  phone VARCHAR(20),
  receiver VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  goodsId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (goodsId) REFERENCES goods(id)
);

CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  detail VARCHAR(255),
  isDefault TINYINT DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES user(id)
);

INSERT IGNORE INTO goods (name, price, stock, img) VALUES 
('iPhone 15 Pro Max', 12999.00, 100, '/static/goods/iphone15Pro Max.png'),
('华硕天选6', 8999.00, 50, '/static/goods/华硕天选6.png'),
('大疆DJI Osmo Pocket4', 3499.00, 80, '/static/goods/大疆DJI Osmo Pocket4.png'),
('纯实木鞋架柜', 599.00, 200, '/static/goods/纯实木鞋架柜.png'),
('圆形实木茶几', 899.00, 100, '/static/goods/圆形实木茶几.png'),
('真皮沙发', 2999.00, 60, '/static/goods/真皮沙发.png'),
('福州鱼丸', 39.00, 500, '/static/goods/福州鱼丸.png'),
('经典海盐风味苏打饼干', 29.00, 300, '/static/goods/经典海盐风味苏打饼干.png'),
('乳酸菌口袋小面包', 25.00, 400, '/static/goods/乳酸菌口袋小面包.png'),
('马克华菲纯棉短袖', 199.00, 150, '/static/goods/马克华菲纯棉短袖.png'),
('工装牛仔裤男士夏季薄款', 159.00, 200, '/static/goods/工装牛仔裤男士夏季薄款男裤宽松直筒男生裤子美式微喇裤休闲长裤.png'),
('休闲鞋男鞋新款复古', 299.00, 180, '/static/goods/休闲鞋男鞋新款复古老爹鞋减震回弹厚底增高跑步运动鞋.png');
