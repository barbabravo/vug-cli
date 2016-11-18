const inquirer = require('inquirer')

exports.confirm = (message, default_value)=>{
    return inquirer({
        type:'confirm',
        message:message,
        name: 'ok',
        default: default_value||true
    })
}

exports.join = (...args)=>{
	return args.join('');
}