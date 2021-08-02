const util = require("util");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "company_db"
    },
    console.log(`\nConnected to employee database, please proceed.\n`)
);

const query = util.promisify(db.query).bind(db);

const appCapabilitySet = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "selectedOperation",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"]
    }
];

const addDeptQueSet = [
    {
        type: "input",
        message: "What is the name of the department?",
        name: "deptName"
    }
]

const viewAllDepartments = () => {
    query(`SELECT * FROM department`)
        .then((results) => {
            console.table(results);
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
};

const viewAllRoles = () => {
    query(`SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.dept_id = d.id`)
        .then((results) => {
            console.table(results);
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
};

const viewAllEmployees = () => {
    query(`SELECT e.id, e.first_name, e.last_name, r.title, r.department, r.salary, m.employee_name AS manager FROM employee e LEFT OUTER JOIN (SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.dept_id = d.id) r ON e.role_id = r.id LEFT OUTER JOIN (SELECT id, CONCAT(first_name, " ",last_name) as employee_name FROM employee) m ON e.manager_id = m.id`)
        .then((results) => {
            console.table(results);
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
};

const addADept = async () => {
    const deptUserRes = await inquirer.prompt(addDeptQueSet);
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = deptUserRes.deptName;

    query(sql, params)
        .then((results) => {
            console.log(`Added ${params} to the database.`)
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
}

const addARole = async () => {
    var listDeptName = [];
    query(`SELECT d.name FROM department d;`)
    .then((response) => {
        const strResponse = JSON.parse(JSON.stringify(response));
        for (var i = 0; i < strResponse.length; i++) {
            listDeptName.push(strResponse[i].name);
        };
    })
    .catch((err) => console.error(err));

    const roleUserRes = await inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "roleName"
        }, {
            type: "input",
            message: "What is the salary of the role?",
            name: "roleSalary"
        }, {
            type: "list",
            message: "Which department does the role belong to?",
            name: "roleDept",
            choices: listDeptName
        }
    ]);
    const sql = `INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)`;
    const params = [roleUserRes.roleName, roleUserRes.roleSalary, roleUserRes.roleDept];

    query(sql, params)
        .then((results) => {
            console.log(`Added ${roleUserRes.roleName} to the database.`)
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
}

const addAnEmployee = async () => {
    const deptUserRes = await inquirer.prompt(addDeptQueSet);
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = deptUserRes.deptName;

    query(sql, params)
        .then((results) => {
            console.log(`Added ${params} to the database.`)
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
}

const whatToDo = async () => {
    const response = await inquirer.prompt(appCapabilitySet);
    switch (response.selectedOperation) {
        case "View all departments":
            return viewAllDepartments();
        case "View all roles":
            return viewAllRoles();
        case "View all employees":
            return viewAllEmployees();
        case "Add a department":
            return addADept();
        case "Add a role":
            return addARole();
        case "Add an employee":
            return addAnEmployee();
        case "Update employee role":
            return updateEmployeeRole();
        default:
            return;
    }
};

whatToDo();