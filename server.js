const mySQL = require("mysql");
const inquirer = require("inquirer");
// const { start } = require("repl");
// const { fstat } = require("fs");

//create connections to sql database
let connection = mySQL.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "M@rif3fa",
    database: "employeeChart_db",
});

//connect to mySQL server and SQLDB
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to start prompting questions
    start();
});

//function which prompts the users
let start = () => {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            name: "actions",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                //"Update Employee Manager",
                "Exit",
            ],
        })
        .then((answers) => {
            switch (answers.actions) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees By Department":
                    viewAllEmployeesByDept();
                    break;

                case "View All Employees by Manager":
                    viewAllEmployeesByMgr();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                //case "Update Employee Manager":
                //updateEmployeeMgr();
                //break;
                case "Exit":
                    console.log("Thank you for using this App!");
                    connection.end();
            }
        });
};

//View all Employees
const viewAllEmployees = () => {
    let query =
        "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";

    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("What would you like to do next?");
        start();
    });
};

//view all employees by dept
const viewAllEmployeesByDept = () => {
    let query =
        "SELECT department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";

    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";
    query += "ORDER BY department.name ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("----------------------------------");
        start();
    });
};

//view all employees by mgr
const viewAllEmployeesByMgr = () => {
    let query =
        "SELECT CONCAT(manager.mgr_first, manager.mgr_last) AS Manager, department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";

    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "INNER JOIN manager ON manager.id = employee.manager_id ";
    query += "ORDER BY manager.mgr_first ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("----------------------------------");
        start();
    });
};

// add employee
const addEmployee = () => {
    let query =
        "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "empFirstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "empLastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "empRole",
                    type: "rawlist",
                    message: "What this is employee's role?",
                    choices: () => {
                        let choiceArrary = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArrary.push(results[i].title);
                        }
                        return choiceArrary;
                    },
                },
                {
                    name: "whichMgr",
                    type: "rawlist",
                    message: "Who is this employee's manager?",
                    choices: () => {
                        let choiceArrary = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArrary.push(results[i].Manager);
                        }
                        return choiceArrary;
                    },
                },
            ])
            .then((answer) => {
                //get the id of the chosen role
                connection.query("SELECT * FROM employeeChart_db.role", (err, results) => {
                    let chosenRoleID;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].title === answer.empRole) {
                            chosenRoleID = results[i].id;
                        }
                    }

                    connection.query(
                        "SELECT id, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager FROM employeeChart_db.manager; ",
                        (err, result) => {
                            let chosenMgrID;
                            for (var j = 0; j < result.length; j++) {
                                if (result[j].Manager === answer.whichMgr) {
                                    chosenMgrID = result[j].id;
                                }
                            }
                            connection.query(
                                "INSERT INTO employee SET ?",
                                {
                                    first_name: answer.empFirstName,
                                    last_name: answer.empLastName,
                                    role_id: chosenRoleID,
                                    manager_id: chosenMgrID,
                                },
                                (err) => {
                                    if (err) throw err;
                                    console.log("You've added an employee successfully!");
                                    start();
                                }
                            );
                        }
                    );
                });
            });
    });
};

// remove employee
const removeEmployee = () => {
    //query employee first and last name and display as Employee
    connection.query(
        "SELECT id, CONCAT(first_name, last_name) AS Employee FROM employeeChart_db.employee; ",
        (err, results) => {
            if (err) throw err;

            //start prompt
            inquirer
                .prompt([
                    {
                        name: "removeEmp",
                        type: "rawlist",
                        message: "Select the employe that you would like to remove.",
                        choices: () => {
                            let choiceArrary = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArrary.push(results[i].Employee);
                            }
                            return choiceArrary;
                        },
                    },
                ])
                .then((answer) => {
                    // get chosen employee
                    let chosenEmp;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Employee === answer.removeEmp) {
                            chosenEmp = results[i].id;
                            console.log(chosenEmp);

                            connection.query(
                                "DELETE FROM employee WHERE ?",
                                {
                                    id: chosenEmp,
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("You have sucessfully removed " + answer.removeEmp);
                                    start();
                                }
                            );
                        }
                    }
                });
        }
    );
};

//update employee role
const updateEmployeeRole = () => {
    let query =
        "SELECT CONCAT(employee.first_name, employee.last_name) AS Employee, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, results) => {
        if (err) throw err;

        connection.query("SELECT * FROM employeeChart_db.role; ", (err, result) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "rawlist",
                        message: "Which employee would you like to update?",
                        choices: () => {
                            let choiceArrary = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArrary.push(results[i].Employee);
                            }
                            return choiceArrary;
                        },
                    },
                    {
                        name: "role",
                        type: "rawlist",
                        message: "Which role are they switching to?",
                        choices: () => {
                            let choiceArrary = [];

                            for (var j = 0; j < result.length; j++) {
                                choiceArrary.push(result[j].title);
                            }
                            return choiceArrary;
                        },
                    },
                ])
                .then((answer) => {
                    connection.query(
                        "SELECT employee.id, CONCAT(employee.first_name, employee.last_name) AS Employee, employee.role_id, role.title FROM employee INNER JOIN role ON role.id = employee.role_id; ",
                        (err, results) => {
                            if (err) throw err;

                            let chosenEmp;

                            for (var i = 0; i < results.length; i++) {
                                if (results[i].Employee === answer.employee) {
                                    chosenEmp = results[i].id;
                                }
                            }
                            let chosenRoleID;

                            for (var j = 0; j < result.length; j++) {
                                if (result[j].title === answer.role) {
                                    console.log("This employee is already at this role.");
                                    return;
                                } else {
                                    chosenRoleID = result[j].id;
                                    console.log("what is result " + result[j].title + result[j].id);

                                    connection.query(
                                        "UPDATE employeeChart_db.employee SET ? WHERE ? ;",
                                        [
                                            {
                                                role_id: chosenRoleID,
                                            },
                                            {
                                                id: chosenEmp,
                                            },
                                        ],
                                        (error) => {
                                            if (error) throw err;
                                            console.log("Employee role as been updated.");
                                        }
                                    );
                                }
                            }
                        }
                    );
                });
        });
    });
};

//update employee mgr`

// view total utilized budget of a department (combined salaries of all employees in the dept)
