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
const mysql = require('mysql2/promise');
const cTable = require("console.table");
const commands = require('./assets/js/commands');


// Move this after the prompt or set it up within it?
const connectionConfig =
{
    user: 'root',
    password: '',
    database: 'company'
};

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'company',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
});

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
                pool.query('SELECT * FROM departments').then(  ([rows,fields])=>{
                    console.table(
                        '***Departments***',
                        rows
                    );
                    promptUser();
                }).catch(console.log);
                break;
            case 'view all roles':
                pool.query('SELECT * FROM roles').then(  ([rows,fields])=>{
                    console.table(
                        '***Roles***',
                        rows
                    );
                    promptUser();
                }).catch(console.log);
                break;
            case 'view all employees':
            pool.query('SELECT * FROM employees').then(  ([rows,fields])=>{
                console.table(
                    '***Employees***',
                    rows
                );
                promptUser();
            }).catch(console.log);
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
                    pool.query(`INSERT INTO departments (name) VALUES ('${deptNameVar}')`).then(()=>{
                        promptUser();
                    }
                    );
                });
                break;
            case 'add a role':

                const [rows] = await pool.query('SELECT name FROM departments');
                const departments = await pool.query('SELECT * FROM departments');
 
                const names = rows.map(row => row.name); 
                const answer = await inquirer.prompt([{
                    type: 'input',
                    name: 'roleName',
                    message: 'Enter the roles name'
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the roles salary'
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: 'choose a department',
                    choices: names
                }
            ]);

            // console.log(departments[0]);
            const dept = departments[0].find(obj => obj.name === answer.roleDept);
            console.log(answer);
            pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.roleName}',${answer.roleSalary},${dept.id})`).then(()=>{
                promptUser();
            }
            );
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
                // connection.close();
                pool.end();
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