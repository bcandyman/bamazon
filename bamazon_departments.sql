-- DROP DATABASE IF EXISTS bamazon_db;

-- CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (department_id),
  department_name VARCHAR(20) NOT NULL
);

INSERT INTO departments (department_name)
VALUES ("automotive"),
("clothing"),
("electronics"),
("hardware");

SELECT * FROM departments;