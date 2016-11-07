const inquirer = require('inquirer')

exports.confirm = function(message, default_value){
    return inquirer({
        type:'confirm',
        message:message,
        name: 'ok',
        default: default_value||true
    })
}
