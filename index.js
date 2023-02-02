const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');

function callManagerPrompts(){
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your manager\'s name?',
      },    
      {
        type: 'input',
        name: 'id',
        message: 'What is your managers\'s ID?',
      },
      {
        type: 'input',
        name: 'email',
        message: 'What is your manager\'s email?',
      },
      {
        type: 'input',
        name: 'office',
        message: 'What is your managers\'s office number?',
      },
      {
        type: 'list',
        name: 'more',
        message: 'Would you like to add more employees?',
        choices: ['Engineer', 'Intern', 'Complete team']
      }
    ])

  .then((data) => {
   
    console.log ("testing")

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
    database: 'classlist_db'
  },
  console.log(`Connected to the classlist_db database.`)
);


// Query database
db.query('SELECT * FROM students', function (err, results) {
  if(err){console.log(err)}
  console.log(results);
});
