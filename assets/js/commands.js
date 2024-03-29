const cTable = require('console.table');
const mysql = require('mysql2');



async function showDepartments(connection){

    await connection.promise().query(`SELECT * FROM departments`, function(err, result, fields){
        if(err) throw err;

        // console.log(result);
        console.table(
            '***Departments***',
            // ['id','name'],
            result
        );
    });
}




function showRoles(connection){
    connection.query(`SELECT * FROM roles`, function(err, result, fields){
        if(err) throw err;

        // console.log(result);
        console.table(
            '***Roles***',
            // ['id','title', 'salary', 'department_id'],
            result
        );
            // console.log(roles);
    });

    // connection.promise().query(`SELECT * FROM roles`).then(([rows,fields]) => {
    //     console.table(
    //         '***Roles***',
    //         rows
    //     );
    // }
    // ).catch(console.log);

}

function showEmployees(connection){
    let emp;
    connection.query(`SELECT * FROM employees`, function(err, result, fields){
        if(err) throw err;

        // console.log(result);
        console.table(
            '***Employees***',
            // ['id','first_name', 'last_name', 'role_id', 'manager_id'],
            result
        );

    });

}

function addDept(connection, name){
    connection.query(`CREATE TABLE ${name}`, function(err, result, fields){
        if(err) throw err;

        console.log(result);
    });
    
}

module.exports = {
    showDepartments,
    showRoles,
    showEmployees,
    addDept

};