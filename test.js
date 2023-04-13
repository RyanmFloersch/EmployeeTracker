
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require("console.table");
const commands = require('./assets/js/commands');




async function promptUser() {

    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: "Select a command: ",
            choices: ['1', '2', '3', 'exit'],
            loop: true

        }


    ).then((ansObj) => {

        console.log(ansObj);
        switch (ansObj.option) {
            case '1':
                console.log('1 was chosen');
                promptUser();
                break;
            case '2':
                console.log('1 was chosen');
                promptUser();
                break;
            case '3':
                console.log('1 was chosen');
                promptUser();
                break;
            case 'exit':
                console.log('exitting');
                break;
            default:
                console.log('invalid choice');
                promptUser();

        }


    });
    return;
}

promptUser();