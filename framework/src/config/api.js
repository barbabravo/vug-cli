import utils from 'vug-utils'

var api = {
    getAppList:{
        url:'/sys/api/app/list?ajaxID=57b163de5f75902827478445'
    }
}

utils.extend(api);

module.exports = utils.API;