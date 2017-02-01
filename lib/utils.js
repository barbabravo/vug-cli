const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const https = require('https')
const logger = require('./logger')

let version = '';

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

exports.isLatestVersion = ()=>{
	let local_version_arr = this.getVersion().split('.'), 
		remote_version = '0.0.0', 
		is_outdate = false;
	logger.log('正在检测是否是最新版本...\n')
	return new Promise((resolve, reject)=>{
		let options = {
			hostname: 'api.github.com',
			path:'/repos/bluers/vug-cli/tags',
			method:'GET',
			headers:{
				'User-Agent': 'vug-cli'
			}
		}
		https.get(options, res=>{
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				try {
				  	let parsedData = JSON.parse(rawData);
					if(parsedData.length){
						remote_version = parsedData[0].name.replace('v');
					}
					let remote_version_arr = remote_version.split('.');
					for(let i = 0, len = remote_version_arr.length; i<len; i++){
						if(remote_version_arr[i]>local_version_arr[i]){
							is_outdate = true;
							break;
						}
					}
					if(is_outdate==true){
						resolve(is_outdate);
					}else{
						logger.success('已是最新版本\n');
						reject();
					}
				} catch (e) {
					logger.warn('vug版本检测失败\n')
					reject();
				}
			});
		}).on('error', (e) => {
		  	logger.warn('vug校验服务器连接失败\n')
		  	reject();
		});
	})
}

exports.getVersion = ()=>{
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString()).version;
}
