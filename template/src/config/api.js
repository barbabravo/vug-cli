import utils from 'qbs-utils'

var api = {
    getAppList:{
        url:'/sys/api/app/list?ajaxID=57b163de5f75902827478445'
    },
    getApp:{
        url:'/sys/api/app/get?ajaxID=57d6483b5f759028274784ab'
    },
    updateApp:{
        url:'/url?ajaxID=57b164015f75902827478449'
    },
    deleteApp:{
        url:'/sys/api/app/delete?ajaxID=57b164065f7590282747844b'
    },
    createApp:{
        url:'/sys/api/app/create?ajaxID=57b163f45f75902827478447'
    }
}

utils.extend(api);

module.exports = utils.API;