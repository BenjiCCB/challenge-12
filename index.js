const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');

function callMainPrompts(){
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
        displayTable("departments");
        callMainPrompts();
        break
      case "View roles":
        displayTable("roles");
        callMainPrompts();
        break
      case "View employees":
        displayTable("employees");
        callMainPrompts();
        break
      case "Add a department":
        createDepartment();
        callMainPrompts();
        break
      case "Add a role":
        createRole();
        callMainPrompts();
        break
      case "Add an employee":
        console.log("add emp")
        break;
      case "Update an employee role":
        console.log("update emp");
        break;
      case "Exit app":
        console.log("exiting app");
        process.exit();
      default:
          console.log("error occured")
    }

  });
}

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


// Query tables
function displayTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.log('\n');
    console.table(results);
  });
}

// Create Department
function createDepartment(){
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: "What is the name of the department you'd like to add?"
      }
    ])

  .then((data) => {
    
    db.query(`INSERT INTO departments (name) VALUES ("${data.department}")`, function (err, results) {
      if(err){console.log(err)}
      console.log('department added!');
  
    });

  });
}

// Create Role
function createRole(){
  
  var departmentsArray = []
  db.query(`SELECT * FROM departments`, function (err, results) {

    var departments = results;
    for (let i = 0; i < departments.length; i++) {
      const { id, name } = departments[i];

      const depOption = {
        name: name,
        value: id,
      };
      departmentsArray.push(depOption)
    } 
  });

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What is the role's title?"
      },
      {
        type: 'input',
        name: 'salary',
        message: "What is the role's salary?"
      },
      {
        type: 'list',
        name: 'department',
        message: "What is the role's department?",
        choices: departmentsArray
      }
    ])

  .then((data) => {
    
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES 
      ("${data.title}", ${data.salary}, ${data.department})`, function (err, results) {
      
      console.log('department added!');
  
    });

  });
}


// // Create Employee
// function createEmployee(){
  
//   // roles choices
//   var rolesArray = []
//   db.query(`SELECT * FROM roles`, function (err, results) {

//     var roles = results;
//     for (let i = 0; i < roles.length; i++) {
//       const { id, title, salary, department_id } = roles[i];

//       const roleOption = {
//         name: title,
//         value: id,
//       };
//       departmentsArray.push(depOption)
//     } 
//   });

//   inquirer
//     .prompt([
//       {
//         type: 'input',
//         name: 'title',
//         message: "What is the role's title?"
//       },
//       {
//         type: 'input',
//         name: 'salary',
//         message: "What is the role's salary?"
//       },
//       {
//         type: 'list',
//         name: 'department',
//         message: "What is the role's department?",
//         choices: departmentsArray
//       }
//     ])

//   .then((data) => {
    
//     db.query(`INSERT INTO roles (title, salary, department_id) VALUES 
//       ("${data.title}", ${data.salary}, ${data.department})`, function (err, results) {
      
//       console.log('department added!');
  
//     });

//   });
// }


// ------------START APP------------

callMainPrompts()