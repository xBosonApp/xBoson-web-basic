# 日期模块


全局模块, 在脚本中立即可用.

这些方法仅为兼容性而存在, 可用 js 自身 api 替换, 不再另行文档.
与 js 中的 Date 区分.


# Api

## date.formattedTime(dateObj, formatStr)

将日期对象格式化为字符串

参数:

* dateObj 日期类型对象
* formatStr 格式化字符串

```javascript
var dateTimeString = date.formattedTime(dateTime, "yyyyMMddHHmmssSSS");
```


## date.parseDate(dateStr, formatStr)

将日期字符串解析为日期对象

参数:

* dateStr 日期字符串
* formatStr  格式化字符串, 例如: "yyyyMMddHHmmssSSS"

```javascript
var dateTime = date.parseDate("20140606120000222", "yyyyMMddHHmmssSSS");
```

## date.plusDate(dateObj, num, unit)

日期字段算数运算, 

参数:

* dateObj 日期对象
* num 数字
* unit 单位, 可用: [ y 年,M 月,w 周,d 日,h 消息,m 分钟,s 秒,S 毫秒 ]

```javascript
//
// 给日期加 1 天
//
var dateTime = date.plusDate(sys.currentDate(), 1,"d");
```


## date.plusString(dateStr, formatStr, num, unit)

解析后在进行字段算术运算, 算法同 date.plusDate


## date.currentDate()
## date.currentTimeString()
## date.currentTimeMillis()
## date.unixTimestampFromDate(dateObj)
## date.dateFromUnixTimestamp(unixObj)
## date.compare(d1, d2)
## date.getYear(dateObj)
## date.getWeek(dateObj)
## date.getDayOfYear(dateObj)
## date.getDayOfMonth(dateObj)
## date.getDayOfWeek(dateObj)
## date.getHourOfDay(dateObj)
## date.getMinuteOfDay(dateObj)
## date.getMinuteOfHour(dateObj)
## date.getMillis(dateObj)
## date.getMillisOfDay(dateObj)
## date.getMillisOfSecond(dateObj)
## date.setYear(dateObj, num)
## date.setMonth(dateObj, num)
## date.setYear(dateObj, num)
## date.setDayOfYear(dateObj, num)
## date.setDayOfMonth(dateObj, num)
## date.setDayOfWeek(dateObj, num)
## date.setHourOfDay(dateObj, num)
## date.setMinuteOfHour(dateObj, num)
## date.setMillis(dateObj, num) 
## date.setMillisOfDay(dateObj, num)
## date.setMillisOfSecond(dateObj, num)