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
			res = uniID.register(params);
			break;
		case 'login':
			res = uniID.login(params);
			break;
		case 'checkToken':
			res = uniID.checkToken(event.uniIdToken);
			break;
		case 'logout':
			res = await uniID.logout(event.uniIdToken)
			break;
		case 'sendSmsCode':
			const randomStr = '00000' + Math.floor(Math.random() * 1000000)
			const code = randomStr.substring(randomStr.length - 6)
			res = await uniID.sendSmsCode({
				mobile: params.mobile,
				code,
				type: 'login'
			})
			break;
		case 'loginBySms':
			res = await uniID.loginBySms(params)
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
