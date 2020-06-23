'use strict';

const uniID = require('uni-id')

exports.main = async (event, context) => {
    //event为客户端上传的参数
    console.log('event : ' + event)


    let params = event.params
    let res = {}

    let payload = {}

    switch (event.action) {
        case 'register':
            res = uniID.register(event.params, context);
            break;
        case 'login':
            res = uniID.login(event.params, context);
            break;
        case 'checkToken':
            res = uniID.checkToken(event.uniIdToken);
            break;
        case 'logout':
            res = await uniID.logout(event.uniIdToken)
            break;
        default:
            res = {
                code: 403,
                msg: '非法访问'
            }
            break;
    }

    //返回数据给客户端
    return res
};
