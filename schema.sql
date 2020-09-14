DROP DATABASE IF EXISTS employeeChart_db;
CREATE DATABASE employeeChart_db;
USE employeeChart_db; 

CREATE TABLE department (
PRIMARY KEY (id),
id INT(11) NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
PRIMARY KEY (id),
id INT(11) NOT NULL AUTO_INCREMENT, 
title VARCHAR(30) NOT NULL,
salary DECIMAL (10,2) NOT NULL,
department_id INT NOT NUll 
);

CREATE TABLE employee (
    PRIMARY KEY (id),
    id INT(11) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NUll,
    role_id INT(11) NOT NULL,
    manager_id INT(11) NULL
);

CREATE TABLE manager (
    PRIMARY KEY (id),
    id INT (11) NOT NULL AUTO_INCREMENT, 
    mgr_first VARCHAR (30) NOT NULL,
    mgr_last VARCHAR (30) NOT NULL
);