'use strict';

const uniID = require('uni-id')
const db = uniCloud.database()
const dbCmd = db.command
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
			// 简单限制一下客户端调用频率
			const ipLimit = await db.collection('uni-verify').where({
				ip: context.CLIENTIP,
				created_at: dbCmd.gt(Date.now() - 60000)
			}).get()
			if(ipLimit.data.length > 0) {
				return {
					code: 429,
					msg: '请求过于频繁'
				}
			}
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
