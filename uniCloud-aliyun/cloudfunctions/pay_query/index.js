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
	} else if (query_type == '1') {
		const db = uniCloud.database().collection('hkhj3_premium');
		const data_ = await db.where({
			'device_id': device_id
		}).get()
		if (data_.affectedDocs == 1) {
			data = {
				code: 200,
				message: "查询成功！",
				data: data_['data'][0]
			};
		} else {
			data = {
				code: 500,
				message: "没有查询到当前设备的订阅数据！"
			};
		}
	}

	return data;
};