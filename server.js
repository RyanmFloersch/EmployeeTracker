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



function promptUser() {

    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: "Select a command: ",
            choices: options,
            loop: false
        }


    ).then(async answerObj => {


        try {
            switch (answerObj.option) {
                // WHEN I choose to view all departments
                // THEN I am presented with a formatted table showing department names and department ids
                case 'view all departments':
                    pool.query('SELECT * FROM departments').then(([rows, fields]) => {
                        console.table(
                            '***Departments***',
                            rows
                        );
                        promptUser();
                    }).catch(console.log);
                    break;
                case 'view all roles':
                    pool.query('SELECT * FROM roles').then(([rows, fields]) => {
                        console.table(
                            '***Roles***',
                            rows
                        );
                        promptUser();
                    }).catch(console.log);
                    break;
                case 'view all employees':
                    pool.query('SELECT * FROM employees').then(([rows, fields]) => {
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


                    await inquirer.prompt(
                        {
                            name: 'deptName',
                            message: 'What is the department name?'
                        }
                    ).then(async (deptAns) => {
                        const deptNameVar = deptAns.deptName;
                        await pool.query(`INSERT INTO departments (name) VALUES ('${deptNameVar}')`).then(() => {
                            promptUser();
                        }
                        );
                    });
                    break;
                case 'add a role':

                    const [rows] = await pool.query('SELECT name FROM departments');
                    const departments = await pool.query('SELECT * FROM departments');

                    //Array of all the names OF departments
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
                    pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.roleName}',${answer.roleSalary},${dept.id})`).then(() => {
                        promptUser();
                    });
                    break;

                case 'add an employee':
                    // WHEN I choose to add an employee
                    // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

                    //Get an array of objects representing titles from each rows
                    const [rowsRole] = await pool.query('SELECT title FROM roles');

                    //Get an array of objects representing columns first name and last name concated together as full name from employee table
                    const [full_Name_Results] = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees`);


                    //Parese the objects and returns an array of all the role names as strings 
                    const roleNames = rowsRole.map(rowsRole => rowsRole.title);
                    //Parses the objects and returns an array of all the employees full name as strings
                    const full_Names = full_Name_Results.map(full_Name_Results => full_Name_Results.full_name);
                    //Add to the array None so it is an option to pick during the prompts
                    full_Names.push('None');

                    const answerEmpQuestions = await inquirer.prompt([{
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name?'
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name?'
                    },
                    {
                        type: 'list',
                        name: 'roleName',
                        message: "What is the employees role?",
                        choices: roleNames
                    },
                    {
                        type: 'list',
                        name: 'managerName',
                        message: 'Enter a manager first and last name if the employee has one.',
                        choices: full_Names
                    }
                    ]);

                    const nameValues = answerEmpQuestions.managerName.split(' ');
                    // console.log(nameValues);
                    let managerId;
                    if (answerEmpQuestions.managerName != 'None') {
                        const [manager] = await pool.query(`SELECT id FROM employees WHERE first_name = '${nameValues[0]}' AND last_name = '${nameValues[1]}'`);
                        managerId = manager[0].id;
                    } else {
                        managerId = null;
                    }

                    const [roleID] = await pool.query(`SELECT id FROM roles WHERE title = '${answerEmpQuestions.roleName}'`);

                    pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${answerEmpQuestions.firstName}', '${answerEmpQuestions.lastName}', ${roleID[0].id}, ${managerId})`).then(() => {
                        promptUser();

                    });

                    break;
                case 'update an employee role':

                    // WHEN I choose to update an employee role
                    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database

                    //An array of all the employees
                    const [emps] = await pool.query(`SELECT * FROM employees`);

                    //Get an array of objects representing columns first name and last name concated together as full name from employee table
                    const [empFullNamesResults] = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees`);
                    //Parses the objects and returns an array of all the employees full name as strings
                    const empFullNameList = empFullNamesResults.map(empFullNamesResults => empFullNamesResults.full_name);

                    //Get an array of objects representing all the roles
                    const [roles] = await pool.query(`SELECT * FROM roles`);
                    //Parses the objects and returns an array of all the roles names
                    const rolesList = roles.map(roles => roles.title);



                    // console.log(emps);
                    const empList = [];  
                    emps.forEach(element => {

                        empList.push({
                            id: element.id,
                            fullName: element.first_name+" "+element.last_name });
                    });

                    const updateAnswers = await inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Select an employee",
                            choices: empFullNameList
                        },
                        {
                            type: "list",
                            name: "newRole",
                            message: "Enter the employees new role.",
                            choices: rolesList
                        }
                    ]);
                    // const nameValues = answerEmpQuestions.managerName.split(' ');

                    const empNameValues = updateAnswers.employee.split(' ');
                    const chosenEmployee = await pool.query(`SELECT * FROM employees WHERE first_name = '${empNameValues[0]}' AND last_name = '${empNameValues[1]}'`);
                   
                    
                    const [roleIdResult] = await pool.query(`SELECT id FROM roles WHERE title = '${updateAnswers.newRole}'`);
                    const roleId = roleIdResult[0].id;
                    
                    pool.query(`Update employees SET first_name = '${chosenEmployee[0].first_name}', last_name = '${chosenEmployee[0].last_name}' WHERE id = ${roleId}`).then(() => {
                        promptUser();

                    });


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
        } catch (err) {
            if (err) throw err;
        }

    }).catch((err) => {
        if (err) throw err;
    });


}


async function main() {



    promptUser();
}



main();