const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');

const logo = require('asciiart-logo');
const config = require('./package.json');

// Call Main Prompts
//----------------------------------------------------//

function callMainPrompts(){
  
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do (next)?',
        choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update an employee manager', 'View advanced', 'Exit app'],
        loop: false
      }
    ])

  .then((data) => {

    switch (data.action) {
      case "View departments":
        displayDepartments();
        break
      case "View roles":
        displayRoles();
        break
      case "View employees":
        displayEmployees();
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
        updateEmployeeRole();
        break;
      case "Update an employee manager":
        updateEmployeeManager();
        break;
      case "View advanced":
        viewAdvanced();
        break;
      case "Exit app":
        console.log("\n** Exiting app **\n");
        process.exit();
      default:
          console.log("error occured")
    }

  });
}

// Connect to Database
//----------------------------------------------------//
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

// Display Departments
//----------------------------------------------------//
function displayDepartments() {
  db.query(`SELECT departments.id, departments.name AS Department FROM departments `, function (err, results) {
    console.log('\n');
    console.table(results);
  
    callMainPrompts();
  });
}

// Display Employees
//----------------------------------------------------//
function displayEmployees() {
  
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, manager.first_name as manager_first, manager.last_name as manager_last
      FROM employees
      JOIN employees manager ON manager.id = employees.manager_id
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      ORDER BY employees.id;`, function (err, results) {
    console.log('\n');
    console.table(results);
  
    callMainPrompts();
  });
}

// Display Roles
//----------------------------------------------------//
function displayRoles() {
  
  db.query(`SELECT roles.id, roles.title, roles.salary, roles.title, departments.name AS department
      FROM roles
      JOIN departments ON roles.department_id = departments.id
      ORDER BY roles.id;`, function (err, results) {
    console.log('\n');
    console.table(results);
  
    callMainPrompts();
  });
}

// Generate employee choices
//----------------------------------------------------//
function generateEmployeeChoices(){
  var empPromise = new Promise ((resolve, reject) => {
    db.query(`SELECT * FROM employees`, function (err, results) {
      var employeesArray = []
      var employees = results;
      for (let i = 0; i < employees.length; i++) {
        const { id, first_name, last_name, role_id, manager_id } = employees[i];
  
        const employeeOption = {
          name: first_name + " " + last_name,
          value: id,
        };
        employeesArray.push(employeeOption)
      } 
      resolve(employeesArray)
    });
  })
  return empPromise;
}

// Generate role choices
//----------------------------------------------------//

async function generateRoleChoices(){
  var rolePromise = new Promise ((resolve, reject) => {
    db.query(`SELECT * FROM roles`, function (err, results) {
      var rolesArray = []
      var roles = results;
      for (let i = 0; i < roles.length; i++) {
        const { id, title, salary, department_id } = roles[i];
  
        const roleOption = {
          name: title,
          value: id,
        };
        rolesArray.push(roleOption)
      }
      resolve(rolesArray)
    });
  })
  return rolePromise;
}

// Generate department choices
//----------------------------------------------------//

async function generateDepartmentChoices(){
  var depPromise = new Promise ((resolve, reject) => {
    db.query(`SELECT * FROM departments`, function (err, results) {
      var depsArray = []
      var deps = results;
      for (let i = 0; i < deps.length; i++) {
        const { id, name } = deps[i];
  
        const depOption = {
          name: name,
          value: id,
        };
        depsArray.push(depOption)
      }
      resolve(depsArray)
    });
  })
  return depPromise;
}


// Create Department
//----------------------------------------------------//

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
      console.log(`\n** Department added **\n`);
      callMainPrompts();
    });

  });
}

// Create Role
//----------------------------------------------------//

async function createRole(){
  
  var departmentsArray = await generateDepartmentChoices();

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
        message: "What is the role's salary?",
        validate: async(data) => {
          if (parseInt(data)) {
            return true
          } else {
            console.log("\nPlease enter a number only\n")
            return false
          }
        }
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
        console.log('\n** Role added **\n');  
        callMainPrompts();
      });

  });
}

// Create Employee
//----------------------------------------------------//

async function createEmployee(){
  
  var rolesArray = await generateRoleChoices();
  var employeesArray = await generateEmployeeChoices();

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
      console.log('\n** Employee added **\n');
      callMainPrompts();
    });

  });
}

// Update Employee Role
//----------------------------------------------------//

async function updateEmployeeRole(){
  var employeesArray = await generateEmployeeChoices();
  var rolesArray = await generateRoleChoices();
  
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

    db.query(`UPDATE employees SET role_id = ${data.role} WHERE id = ${data.employee}`, 
      function (err, results) { 
      console.log('\n** Employee updated **\n');
      callMainPrompts();
    });

  });
}

// Update Employee Manager
//----------------------------------------------------//

async function updateEmployeeManager(){
  
  var employeesArray = await generateEmployeeChoices();
  
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
        name: 'manager',
        message: "Who is the employee's new manager?",
        choices: employeesArray
      }
    ])

  .then((data) => {

    db.query(`UPDATE employees SET manager_id = ${data.manager} WHERE id = ${data.employee}`, 
      function (err, results) { 
      console.log('\n** Employee updated **\n');
      callMainPrompts();
    });

  });
}

// View Advanced
//----------------------------------------------------//

function viewAdvanced(){

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'query',
        message: "Which would you like to delete?",
        choices: ["View employees by manager", "View employees by department", "View budget by department"]
      }
    ])

  .then((data) => {

    if(data.query == "View employees by manager"){
      viewEmpManagers();
    } else if (data.query == "View employees by department"){
      viewEmpDeps();
    } else if (data.query== "View budget by department"){
      viewBudgets();
    }
  })
}

  // View employees by manager
  //----------------------
  
  async function viewEmpManagers(){
  
  var employeesArray = await generateEmployeeChoices();

    inquirer
    .prompt([
      {
        type: 'list',
        name: 'manager',
        message: "Which manager would you like to view?",
        choices: employeesArray
      }
    ])
    .then((data) => {
      db.query(`SELECT CONCAT(employees.first_name, " ", employees.last_name) AS Employee, roles.title AS Title, CONCAT(manager.first_name, " ", manager.last_name) AS Manager
        FROM employees
        LEFT JOIN roles on employees.role_id = roles.id
        LEFT JOIN employees manager ON manager.id = employees.manager_id
        WHERE employees.manager_id = ${data.manager};`, 
        function (err, results) { 
          if(results != ""){
            console.log('\n** See data below **\n');
            console.table(results)  
          } else{
            console.log('\n** This employee is not a manager **\n');
          }
          callMainPrompts();
        }
      ); 
    })
  }
 
  // View employees by department
  //----------------------
  
  async function viewEmpDeps(){
  
    var depsArray = await generateDepartmentChoices();

    inquirer
    .prompt([
      {
        type: 'list',
        name: 'department',
        message: "Which department would you like to list?",
        choices: depsArray
      }
    ])
    .then((data) => {     
      db.query(`SELECT CONCAT(employees.first_name, " ", employees.last_name) AS Name, roles.title AS Title, departments.name AS Department
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        WHERE departments.id = ${data.department};`, 
       
        function (err, results) { 
          console.log('\n** See data below **\n');
          console.table(results);
          callMainPrompts();
        }
      );
    })
  }

  // View budget by department
  //----------------------
  
  async function viewBudgets(){

    db.query(`SELECT departments.id, departments.name AS Department, SUM(roles.salary) AS Total_Budget
      FROM employees 
      LEFT JOIN roles on employees.role_id = roles.id
      LEFT JOIN departments on roles.department_id = departments.id
      GROUP BY departments.id, departments.name
      ORDER BY departments.id;`, 
      
      function (err, results) { 
        console.log('\n** See data below **\n');
        console.table(results);
        callMainPrompts();
      }
    );    
  }


// Start App
//----------------------------------------------------//

console.log(logo(config).render());
callMainPrompts()