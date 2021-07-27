module.exports.extends = _extends;

var _undefined;

//
// 总是返回一个有效的对象
// a = extens(b, c, d);
//
function _extends() {
	var ret = {};
	var al = arguments.length;

	for (var i=0; i<al; ++i) {
		copy(ret, arguments[i]);
	}

	return ret;
}

function copy(a, b) {
	for (var n in b) {
		if (b[n] === null || b[n] === _undefined) continue;

		if (typeof b[n] == 'object') {

			if (b[n].constructor == Array) {
				if (!a[n]) a[n] = [];
			} else {
				if (!a[n]) a[n] = {};
			}
			copy(a[n], b[n]);
			
		}
		else {
			a[n] = b[n];
		}
	}
}