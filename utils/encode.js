export function decodeUTF8(str) {
	return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0, $1, $2) {
		return String.fromCharCode(parseInt($2, 16));
	});
}

export function encodeUTF8(str) {
	var temp = "",
		rs = "";
	for (var i = 0, len = str.length; i < len; i++) {
		temp = str.charCodeAt(i).toString(16);
		rs += "\\u" + new Array(5 - temp.length).join("0") + temp;
	}
	return rs;
}
