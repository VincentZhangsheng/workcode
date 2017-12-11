export function formatDate(_date,fmt) {
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4-RegExp.$1.length))
	};
	var Obj = {
		'M+': _date.getMonth() + 1,
		'd+': _date.getDate(),
		'h+': _date.getHours(),
		'm+': _date.getMinutes(),
		's+': _date.getSeconds()
	};
	for(var k in Obj) {
		if(new RegExp(`(${k})`).test(fmt)) {
			var str = Obj[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
		}
	}
	return fmt;
}
function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
