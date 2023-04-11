const cTable = require('console.table');

function showDepartments(connection){
    return connection.query(`SELECT * FROM departments`, function(err, result, fields){
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
    return connection.query(`SELECT * FROM roles`, function(err, result, fields){
        if(err) throw err;

        // console.log(result);
        console.table(
            '***Roles***',
            // ['id','title', 'salary', 'department_id'],
            result
        );

    });
}

function showEmployees(connection){
    return connection.query(`SELECT * FROM employees`, function(err, result, fields){
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
    connection.query(`INSERT INTO departments (name) VALUES (${name})`);
}

module.exports = {
    showDepartments,
    showRoles,
    showEmployees,
    addDept

};