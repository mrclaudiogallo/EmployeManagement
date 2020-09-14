USE employeeChart_db;

-- departments --
INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", 1);

-- role data -- 
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", "80000", 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", "150000", 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", "120000", 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", "190000", 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", "1250000", 3);

-- Manager Values
INSERT INTO manager (mgr_first, mgr_last)
VALUES ("Ashley", "Rodriguez");

INSERT INTO manager (mgr_first, mgr_last)
VALUES ("John", "Doe");

INSERT INTO manager (mgr_first, mgr_last)
VALUES ("Sarah", "Lourd");

INSERT INTO manager (mgr_first, mgr_last)
VALUES ("Mike", "Chan");

-- employee data--
INSERT employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1);

INSERT employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 2, 2);

INSERT employee (first_name, last_name, role_id)
VALUES ("Ashley", "Rodriquez",3);

INSERT employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Johnson", 4, 1);

INSERT employee (first_name, last_name, role_id)
VALUES ("Malia", "Brown", 5 );

INSERT employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Allen", 6, 3);

INSERT employee (first_name, last_name, role_id)
VALUES ("Sarah", "Lourd", 6);

INSERT employee (first_name, last_name, role_id)
VALUES ("Ken", "Smith", 7);