exports.pay_url = 'https://zpayz.cn/mapi.php'
exports.pid = '2025040423043232' //商户号,易支付注册会提供pid和秘钥
exports.key = 'f8848mCKqEGc51N5Fp69FZNyNQbtFPqp' //密钥,易支付注册会提供pid和秘钥


//参数进行排序拼接字符串(非常重要)
exports.getVerifyParams = function(params) {
	let sPara = []
	if (!params) return null
	for (const key in params) {
		if (!params[key] || key == 'sign' || key == 'sign_type') {
			continue
		}
		sPara.push([key, params[key]])
	}
	sPara = sPara.sort()
	let prestr = ''
	for (let i2 = 0; i2 < sPara.length; i2++) {
		const obj = sPara[i2]
		if (i2 == sPara.length - 1) {
			prestr = prestr + obj[0] + '=' + obj[1] + ''
		} else {
			prestr = prestr + obj[0] + '=' + obj[1] + '&'
		}
	}
	return prestr
}
// 格式化时间戳为YYYYMMDDHHmmss格式
exports.getFormattedTimestamp = function() {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0') // 月份是0起始
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')
	return `${year}${month}${day}${hours}${minutes}${seconds}`
}