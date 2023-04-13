// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require("console.table");
const commands = require('./assets/js/commands');


// Move this after the prompt or set it up within it?
const connection = mysql.createConnection(
    {
        user: 'root',
        password: '',
        database: 'company'
    },
    console.log("Connected to comapny database")
);

const options = ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']


// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role



async function promptUser() {

    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: "Select a command: ",
            choices: options,
            loop: false
        }


    ).then(async answerObj => {



        switch (answerObj.option) {
            // WHEN I choose to view all departments
            // THEN I am presented with a formatted table showing department names and department ids
            case 'view all departments':
                console.log('dept selected');
                connection.query('SELECT * FROM departments', (err, result) => {
                    if (err) throw err;

                    // console.log(result);
                    console.table(
                        '***Departments***',
                        result
                    );

                    promptUser();
                });
                break;
            case 'view all roles':
                // WHEN I choose to view all roles
                // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
                connection.query('SELECT * FROM roles', (err, result) => {
                    if (err) throw err;

                    // console.log(result);
                    console.table(
                        '***Roles***',
                        result
                    );

                    promptUser();
                });
                break;
            case 'view all employees':

                // WHEN I choose to view all employees
                // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

                connection.query('SELECT * FROM employees', (err, result) => {
                    if (err) throw err;

                    // console.log(result);
                    console.table(
                        '***Employees***',
                        result
                    );

                    promptUser();
                });
                break;

            case 'add a department':
                // WHEN I choose to add a department
                // THEN I am prompted to enter the name of the department and that department is added to the database
                inquirer.prompt(
                    {
                        name: 'deptName',
                        message: 'What is the department name?'
                    }
                ).then((deptAns) => {
                    const deptNameVar = deptAns.deptName;
                    connection.query(`INSERT INTO departments (name) VALUES ('${deptNameVar}');`, function (err, result, fields) {
                        if (err) throw err;

                        console.log(result);
                        promptUser();
                    });
                });



                break;
            case 'add a role':
                

            inquirer.prompt(
                {
                    name: 'deptName',
                    message: 'What is the department name?'
                }
            ).then((deptAns) => {
                const deptNameVar = deptAns.deptName;
                connection.query(`INSERT INTO departments (name) VALUES ('${deptNameVar}');`, function (err, result, fields) {
                    if (err) throw err;

                    console.log(result);
                    promptUser();
                });
            });
                // WHEN I choose to add a role
                // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

                let departments;

                //   connection.promise().query("SELECT * FROM departments")
                //   .then(([row,fields]) =>{
                //     console.log(row);
                //   }).catch(console.log);

                //   inquirer.prompt(
                //     {
                //         name: 'roleName',
                //         message: 'What is the roles name?'
                //     },
                //     {
                //         name: 'roleSalary',
                //         message: "What is the role's salary?"
                //     },
                //     {
                //         name: 'roleDept',
                //         type: 'list',
                //         message: 'Enter the department id of the department the role belongs to?'
                //     }
                // ).then( roleAns => {
                //     connection.query(`INSERT INTO roles (name, salary, department_id) VALUES ('${roleAns.roleAns}','${roleAns.roleSalary}','${roleAns.roleDept}');`, function (err, result, fields) {
                //         if (err) throw err;

                //         console.log(result);
                //         promptUser();
                //     });
                // });
                // console.log('reached lol');

                // promptUser();
                break;

            case 'add an employee':
                // WHEN I choose to add an employee
                // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
                break;
            case 'update an employee role':

                // WHEN I choose to update an employee role
                // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
                promptUser();
                break;

            case 'exit':
                connection.close();
                break;
            default:
                console.log('invalid input');
                promptUser();
                break;

        }

    }).catch((err) => {
        if (err) throw err;
    });


}


async function main() {



    promptUser();
}



main();