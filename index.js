const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table")


const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "company_db"
    },
    console.log(`\nConnected to employee database, please proceed.\n`)
);

// db.query("SELECT * FROM department", (err, results) => {
//     console.table(results);
// });

// db.query("SELECT * FROM role", (err, results) => {
//     console.table(results);
// });

// db.query("SELECT * FROM employee", (err, results) => {
//     console.table(results);
// });

const appCapabilitySet = [{
    type: "list",
    message: "What would you like to do?",
    name: "selectedOperation",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"]
}];

const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, results) => {
        console.table(results);
        return whatToDo();
    });
};

const viewAllRoles = () => {
    db.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN role ON role.dept_id = department.id", (err, results) => {
        console.table(results);
        return whatToDo();
    });
};

const viewAllEmployees = () => {
    db.query("SELECT employee.name AS Department_Name FROM department", (err, results) => {
        console.table(results);
        return whatToDo();
    });
};

const whatToDo = async () => {
    const response = await inquirer.prompt(appCapabilitySet);
    switch (response.selectedOperation) {
        case "View all departments":
            return viewAllDepartments();
        case "View all roles":
            return viewAllRoles();
        case "View all employees":
            return viewAllEmployees();
    }
};


whatToDo();