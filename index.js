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
    console.log("Connected to company_db database, please proceed.")
);

