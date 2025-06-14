const {
	premium_check
} = require('./config.js');
'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//返回数据给客户端
	const body = JSON.parse(event['body']);
	const device_id = body['device_id'];
	const out_trade_no = body['out_trade_no'];
	let data;
	const query_type = body['query_type'];
	if (query_type == '0') {
		data = await premium_check(device_id, out_trade_no);
	}
	
	return data;
};