const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');

function callInitialPrompts(){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit app']
      }
    ])

  .then((data) => {

    switch (data.action) {
      case "View departments":
        queryTable("departments");
        break;
      case "View roles":
        queryTable("roles");
        break;
      case "View employees":
        queryTable("employees");
        break;
      case "Add a department":
        console.log("add dept");
        break;
      case "Add a role":
        console.log("add role");
        break;
      case "Add an employee":
        console.log("add emp")
        break;
      case "Update an employee role":
        console.log("update emp")
        break;
      case "Update an employee role":
        console.log("exit app")
        break;
      default:
          console.log("error occured")
    }

  });
}


// function callDepartmentPrompts(){
//   inquirer
//     .prompt([
//       {
//         type: 'list',
//         name: 'action',
//         message: "What is the name of the department you'd like to add?",
//         choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit app']
//       }
//     ])

//   .then((data) => {
    


//   });
// }


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'ccb12345',
    database: 'org_db'
  },
  console.log(`Connected to the classlist_db database.`)
);


// Query database
function queryTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    if(err){console.log(err)}
    console.log('\n');
    console.table(results);
  });
}

callInitialPrompts()