-- DROP DATABASE IF EXISTS bamazon_db;

-- CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hero 8 camera", 3, 399.99 , 20),
("Hero 7 camera", 3, 299.99 , 12),
("T-Shirt", 2, 14.99, 100),
("Nails", 4, .05, 2000),
("Computer Charger", 3, 29.99, 20),
("Shoes", 2 , 49.99, 20),
("Jacket", 2, 99.99, 20),
("Shorts", 2, 29.99, 75);

SELECT * FROM products;