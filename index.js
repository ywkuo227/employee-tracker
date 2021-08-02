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
    const deptUserRes = await inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "deptName"
        }
    ]);

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
    let strDeptRes = [], listDeptName = [];

    await query(`SELECT * FROM department`)
        .then((response) => {
            strDeptRes = JSON.parse(JSON.stringify(response));
            for (var i = 0; i < strDeptRes.length; i++) {
                listDeptName.push(strDeptRes[i].name);
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
    const idRoleDept = strDeptRes[strDeptRes.findIndex(ary => ary.name === roleUserRes.roleDept)].id;
    const params = [roleUserRes.roleName, roleUserRes.roleSalary, idRoleDept];

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
    let strRoleRes = [], listRoleTitle = [], strMgrRes = [], listMgrName = [];

    await query(`SELECT r.id, r.title FROM role r`)
        .then((response) => {
            strRoleRes = JSON.parse(JSON.stringify(response));
            for (var i = 0; i < strRoleRes.length; i++) {
                listRoleTitle.push(strRoleRes[i].title);
            };
        })
        .catch((err) => console.error(err));

    await query(`SELECT e.id, CONCAT(e.first_name, " " , e.last_name) AS name FROM employee e`)
        .then((response) => {
            strMgrRes = JSON.parse(JSON.stringify(response));
            strMgrRes.push({ id: null, name: 'None' });
            for (var i = 0; i < strMgrRes.length; i++) {
                listMgrName.push(strMgrRes[i].name);
            };
        })
        .catch((err) => console.error(err));

    const empUserRes = await inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "empFirstName"
        }, {
            type: "input",
            message: "What is the employee's last name?",
            name: "empLastName"
        }, {
            type: "list",
            message: "What is the employee's role?",
            name: "empRole",
            choices: listRoleTitle
        }, {
            type: "list",
            message: "Who is the employee's manager?",
            name: "empMgr",
            choices: listMgrName
        }
    ]);

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const idEmpRole = strRoleRes[strRoleRes.findIndex(ary => ary.title === empUserRes.empRole)].id;
    const idEmpMgr = strMgrRes[strMgrRes.findIndex(ary => ary.name === empUserRes.empMgr)].id;
    const params = [empUserRes.empFirstName, empUserRes.empLastName, idEmpRole, idEmpMgr];

    query(sql, params)
        .then((results) => {
            console.log(`Added ${empUserRes.empFirstName + " " + empUserRes.empLastName} to the database.`)
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
};

const updateEmployeeRole = async () => {
    let strEmpRes = [], listEmpName = [], strRoleRes = [], listRoleTitle = [];

    await query(`SELECT e.id, CONCAT(e.first_name, " " , e.last_name) AS name FROM employee e`)
        .then((response) => {
            strEmpRes = JSON.parse(JSON.stringify(response));
            for (var i = 0; i < strEmpRes.length; i++) {
                listEmpName.push(strEmpRes[i].name);
            };
        })
        .catch((err) => console.error(err));

    await query(`SELECT r.id, r.title FROM role r`)
        .then((response) => {
            strRoleRes = JSON.parse(JSON.stringify(response));
            for (var i = 0; i < strRoleRes.length; i++) {
                listRoleTitle.push(strRoleRes[i].title);
            };
        })
        .catch((err) => console.error(err));

    const updEmpRoleUserRes = await inquirer.prompt([
        {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "empName",
            choices: listEmpName
        }, {
            type: "list",
            message: "Which role do you want to assign to the selected employee?",
            name: "empUpdatedRole",
            choices: listRoleTitle
        }
    ]);

    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const idEmpName = strEmpRes[strEmpRes.findIndex(ary => ary.name === updEmpRoleUserRes.empName)].id;
    const idRoleTitle = strRoleRes[strRoleRes.findIndex(ary => ary.title === updEmpRoleUserRes.empUpdatedRole)].id;
    const params = [idRoleTitle, idEmpName];

    query(sql, params)
        .then((results) => {
            console.log(`Updated ${updEmpRoleUserRes.empName}'s role in the database.`)
            return whatToDo();
        })
        .catch((err) => {
            console.error(err);
        })
}

const whatToDo = async () => {
    const response = await inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "selectedOperation",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"]
        }
    ]);
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
            console.log(`\nGoodbye!\n`);
            return process.exit(0);
    }
};

whatToDo();