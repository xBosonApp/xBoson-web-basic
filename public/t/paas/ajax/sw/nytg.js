var nytg = nytg || {};

//格式话金额	
nytg.fmoney=function(s, n)//将数字转换成逗号分隔的样式,保留两位小数s:value,n:小数位数   
{
	n = n >= 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
	r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i ++ )
	{
	t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + (n>0? "." + r:"");
}
//还原金额
nytg.rmoney = function (s)
{
	return parseFloat(s.replace(/[^\d\.-]/g, ""));
}
nytg.formatNumber = function (n, decimals) {
	return nytg.fmoney(n, 0)+ "亿元";
    if (n < 0) {
        n = -n
    };
    n=n*10000;
    if (n >= 100000000) {
        suffix = " 亿元"
        n = n / 100000000
    } else if (n >= 1000000) {
        suffix = " 百万元"
        n = n / 1000000
    } else if (n >= 10000) {
        suffix = " 万元"
        n = n / 10000
    }

    return nytg.fmoney(n, decimals) + suffix;
};

