-- DROP DATABASE IF EXISTS bamazon_db;

-- CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_id INT ,
  price DECIMAL(8,2) NOT NULL,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES
('Engine', '1', '6829.99', '2'),
("Fender", "1", "257.23", "20"),
("Lug Nut", "1", "7.46", "71"),
("Nail", "4", ".02", "1273"),
("Hammer", "4", "34.99", "32"),
("Wrench", "4", "17.39", "40"),
("Keyboard", "3", "29.99", "20"),
("Computer Charger", "3", "39.99", "20"),
("Jacket", "2", "99.99", "20"),
("T-Shirt", "2", "14.99", "100"),
("Ski Helmet", "6", "99.95","10"),
("Lego Kit", "5", "19.99", "20"),
("Bakugan", "5", "11.99", "15");

SELECT * FROM products;