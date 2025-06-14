const {
	pid,
	key,
	pay_url,
	getFormattedTimestamp,
	getVerifyParams
} = require('./config.js');
const {
	URLSearchParams
} = require('url');
const utility = require('utility');
const axios = require('axios');

'use strict';
exports.main = async (event, context) => {
	// const obj = await getPayData()
	//event为客户端上传的参数
	console.log('event : ', event)
	try {
		const obj = await getPayData(event.headers['x-client-ip'], event)
		return obj;
	} catch (error) {
		return {
			code: 2,
			message: "参数不合法!"
		};
		//TODO handle the exception
	}
};


//返回加密好的数据
async function getPayData(ip = '0.0.0.0', event) {
	const body = JSON.parse(event.body)
	const name = body['title'];
	const money = body['price'];
	const data = {
		pid: pid,
		type: 'alipay',
		out_trade_no: getFormattedTimestamp().concat(Math.ceil(Math.random() * 100)),
		notify_url: 'https://static-mp-00fbb6fa-0b8f-41d8-ac0c-122a477de70e.next.bspapp.com/notify_url',
		name: '权益订阅' + name,
		money: money,
		clientip: ip,
		sign: '',
		sign_type: "MD5"
	}
	const str = getVerifyParams(data);
	data.sign = utility.md5(str + key);
	//请求支付数据post fromData
	const data_ = new URLSearchParams(data).toString();
	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
	const res = await axios.post(pay_url, data_, config);
	if (res['status'] == 200) {
		return res['data'];
	} else {
		return {
			code: 404,
			message: '请求错误!(非支付服务器)'
		};
	}
}