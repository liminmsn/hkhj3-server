const axios = require('axios');
const pid = "2025040423043232";
const key = "f8848mCKqEGc51N5Fp69FZNyNQbtFPqp";
const query_url = "https://zpayz.cn/api.php";
exports.premium_check = async function(device_id, out_trade_no) {
	const url = query_url.concat(`?act=order&pid=${pid}&key=${key}&out_trade_no=${out_trade_no}`);
	const res = await axios.get(url);
	
	if (res.status == 200) {
		const db = uniCloud.database().collection('hkhj3_premium');
		const query_data = await db.where({
			"device_id": device_id
		}).get();
		//创建订阅数据
		if (query_data.affectedDocs == 0) {
			
			await db.add({
				'device_id': device_id,
				'premium_time': res['data']['endtime']
			})
			//更新订阅数据
		} else if (query_data.affectedDocs == 1) {
			db.doc(query_data['data'][0]['_id']).update({
				'premium_time': ''
			});
		}
		return {
			code: 200,
			message: "订阅成功！"
		}
	}
	return {
		code: 500,
		data: res['data'],
		message: "服务器内部错误！"
	};
}