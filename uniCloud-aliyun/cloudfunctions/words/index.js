'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)

	const db = uniCloud.database();
	switch (event['httpMethod']) {
		case 'GET':
			switch (event['path']) {
				case '/price':
					const res = await db.collection('usr_premium').get();
					return res["data"];
				case '/isactive':
					const res_0 = await db.collection('usr_keys').limit(1).where({
						deviceId: event.headers['deviceid']
					}).get();
					if (res_0['data'][0]) {
						return res_0['data'][0];
					}
					return null;
				case '/active':
					//查询激活码是否有效
					const res_1 = await db.collection('sys_keys').limit(1).where({
						key: event.queryStringParameters['key'],
						active: false
					}).get();
					//创建激活码
					if (res_1['affectedDocs'] == 1) {
						//查询当前设备是否已经有订阅记录
						let res_2 = await db.collection('usr_keys').limit(1).where({
							deviceId: event.headers['deviceid']
						}).get();
						//如果已经有记录了 更新
						if (res_2['affectedDocs'] == 1) {
							// 订阅记录
							const _id = res_2['data'][0]['_id'];
							res_2 = await db.collection('usr_keys').doc(_id).set({
								"deviceId": event.headers['deviceid'],
								"key": event.queryStringParameters['key'],
								"keyType": res_1['data'][0]['keyType'],
								"activeTime": Date.now()
							});
							//添加订阅数据
						} else {
							res_2 = await db.collection('usr_keys').add({
								"deviceId": event.headers['deviceid'],
								"key": event.queryStringParameters['key'],
								"keyType": res_1['data'][0]['keyType'],
								"activeTime": Date.now()
							});
						}
						//设置当前码已激活
						if (res_2['id'] != null || res_2['affectedDocs'] == 1) {
							const res_3 = await db.collection('sys_keys').doc(res_1['data'][0]['_id']).update({
								active: true
							});
							if (res_3['affectedDocs'] == 1) {
								return {
									code: 1,
									msg: "激活成功"
								}
							}
						}
						return {
							code: 0,
							msg: "激活失败",
						};
					}
					return {
						code: 0, msg: "激活码无效",
					};
			}
			break;
		case 'POST':
			switch (event['path']) {
				case '/createkey':
					const time = Date.now();
					const data = {
						keyType: JSON.parse(event.body)['keyType'],
						key: btoa(time),
						createTime: time,
						active: false
					};
					const res = await db.collection("sys_keys").add(data);
					return data;
					break;
				case '/get_all':
					const list = db.collection('sys_keys').get();
					return list;
					break;
			}
			break;
	}
	//返回数据给客户端
	return {
		event,
		context
	}
};