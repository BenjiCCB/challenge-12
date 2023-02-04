const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');


// function validateInput(input, type) {
//   if(typeof input == type) {
//       return true;
//   } else {
//       return "Invalid type";
//   }
// }

function callMainPrompts(){
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do (next)?',
        choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit app'],
        loop: false
      }
    ])

  .then((data) => {

    switch (data.action) {
      case "View departments":
        displayTable("departments");
        break
      case "View roles":
        displayTable("roles");
        break
      case "View employees":
        displayTable("employees");
        break
      case "Add a department":
        createDepartment();
        break
      case "Add a role":
        createRole();
        break
      case "Add an employee":
        createEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
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


// Query tables (employee, role, department )
function displayTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.log('\n');
    console.table(results);
  
    callMainPrompts();
  });
}

// Create Department
function createDepartment(){
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: "What is the name of the department you'd like to add?",
      }
    ])

  .then((data) => {
    

    db.query(`INSERT INTO departments (name) VALUES ("${data.department}")`, function (err, results) {
      if(err){console.log(err)}
      console.log('Department added!');
      callMainPrompts();
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
      
      console.log('Department added!');  
      callMainPrompts();
    });

  });

}


// Create Employee
function createEmployee(){
  
  // roles choices
  var rolesArray = []
  db.query(`SELECT * FROM roles`, function (err, results) {

    var roles = results;
    for (let i = 0; i < roles.length; i++) {
      const { id, title, salary, department_id } = roles[i];

      const roleOption = {
        name: title,
        value: id,
      };
      rolesArray.push(roleOption)
    } 
  });

  // manager employee choices
  var employeesArray = []
  db.query(`SELECT * FROM employees`, function (err, results) {

    var employees = results;
    for (let i = 0; i < employees.length; i++) {
      const { id, first_name, last_name, role_id, manager_id } = employees[i];

      const employeeOption = {
        name: first_name + " " + last_name,
        value: id,
      };
      employeesArray.push(employeeOption)
    } 
  });

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first',
        message: "What is the employee's first name?"
      },
      {
        type: 'input',
        name: 'last',
        message: "What is the employee's last name?"
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: rolesArray
      },
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: employeesArray
      }
    ])

  .then((data) => {

    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
      ("${data.first}", "${data.last}", ${data.role}, ${data.manager})`, function (err, results) {
      
      console.log('Employee added!');
      callMainPrompts();
    });

  });
}

// Update Employee
function updateEmployee(){
  
  //  employee choices
  var employeesArray = []
  db.query(`SELECT * FROM employees`, function (err, results) {

    var employees = results;
    for (let i = 0; i < employees.length; i++) {
      const { id, first_name, last_name, role_id, manager_id } = employees[i];

      const employeeOption = {
        name: first_name + " " + last_name,
        value: id,
      };
      employeesArray.push(employeeOption);
    } 
  })

  // roles choices
  var rolesArray = []
  db.query(`SELECT * FROM roles`, function (err, results) {

    var roles = results;
    for (let i = 0; i < roles.length; i++) {
      const { id, title, salary, department_id } = roles[i];

      const roleOption = {
        name: title,
        value: id,
      };
      rolesArray.push(roleOption)
    } 
  })

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Which employee would you like to update?",
        choices: employeesArray
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's new role?",
        choices: rolesArray
      }
    ])

  .then((data) => {

    // db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
    //   ("${data.first}", "${data.last}", ${data.role}, ${data.manager})`, function (err, results) {
      
    //   console.log('Employee added!');
    //   callMainPrompts();
    // });

  });
}


// ------------START APP------------

console.clear()
callMainPrompts()