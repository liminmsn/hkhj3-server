'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database().collection('hkhj3_premium_price_list')
	const list = await db.get();
	//返回数据给客户端
	return list
};
