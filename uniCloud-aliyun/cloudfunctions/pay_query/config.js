const axios = require('axios');
const pid = "2025040423043232";
const key = "f8848mCKqEGc51N5Fp69FZNyNQbtFPqp";
const query_url = "https://zpayz.cn/api.php";


function get_time(dateStr = '0000-0-0 0:0:0') {
	const timestamp = new Date(dateStr.replace(' ', 'T')).getTime();
	return timestamp;
}

exports.premium_check = async function(device_id, out_trade_no, premium_day_time) {
	const url = query_url.concat(`?act=order&pid=${pid}&key=${key}&out_trade_no=${out_trade_no}`);
	const res = await axios.get(url);

	if (res.status == 200) {
		//支付状态
		const play_state = res['data']['status'];
		const SUCESS = "1";
		//计算订阅时间
		const premium_time = get_time(res['data']['endtime']) + await premium_item_map(res['data']['money']);

		const db = uniCloud.database().collection('hkhj3_premium');
		const query_data = await db.where({
			"device_id": device_id
		}).get();

		//创建订阅数据
		if (query_data.affectedDocs == 0) {
			//已经付费
			if (play_state == SUCESS || true) {
				await db.add({
					'device_id': device_id,
					'premium_time': premium_time
				})
				return {
					code: 200,
					message: "订阅成功！",
					data: res.data
				}
			} else {
				return {
					code: 500,
					message: "付费未完成！"
				}
			}
			//已经有订阅记录，支付也成功
			// && play_state == SUCESS
		} else if (query_data.affectedDocs == 1 || true) {
			//剩余时间
			const sur_time = Number(query_data['data'][0]['premium_time']) - new Date().getTime();
			await db.doc(query_data['data'][0]['_id']).update({
				'premium_time': sur_time > 0 ? premium_time + sur_time : premium_time
			});
			return {
				code: 200,
				message: "订阅成功！",
				data: res.data
			}
		} else {
			return {
				code: 500,
				message: "付费未完成！"
			}
		}
	}
	return {
		code: 500,
		data: res['data'],
		message: "服务器内部错误！"
	};
}

// {
//     "code": "1",
//     "msg": "查询订单号成功！",
//     "status": "0",
//     "name": "权益订阅14天",
//     "money": "10.00",
//     "out_trade_no": "2025061410261670",
//     "trade_no": "",
//     "type": "alipay",
//     "param": "",
//     "addtime": "2025-06-14 18:26:16",
//     "endtime": "2025-06-14 18:26:16",
//     "pid": "2025040423043232",
//     "buyer": ""
// }
//查询当前价格拥有的时间戳大小
async function premium_item_map(money = "2.00") {
	const db = uniCloud.database().collection('hkhj3_premium_price_list');
	const data = await db.where({
		'price': money
	}).get();
	if (data['affectedDocs'] == 1) {
		return data['data'][0]['time_map'];
	}
	return 0;
}