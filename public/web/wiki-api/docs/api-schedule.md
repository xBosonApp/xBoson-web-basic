# 计划任务模块

文件系统需要引入 require 方可使用.
每个机构有独立的任务池.
任务日志输出到 `sys_pl_log_scheduler` 表中.

## 引入:

```javascript
var schedule = require("schedule");
```


# API

## start(string:id, object:config)

* id: 计划任务主键
* config: 任务配置项
* 无返回值

使用配置项中的配置启动任务, 若 id 指定的任务已经存在会抛出异常;
该方法会立刻返回而不是等待任务开始;
如果平台重启, 任务将被清除, 如何恢复应该运行的任务由脚本处理.

配置项, 配置项值可以是对应的类型也可以是字符串类型:

```JSON
{
  "schedulenm" : "任务名称",
  "schedule_interval" : "间隔时间",
  "schedule_cycle" : "间隔单位",
  "run_times" : "运行次数",
  "task_api" : "URL",
  "start_time" : "开始时间",
  "run_end_time" : "结束时间"
}
```

schedule_cycle 间隔单位:

* "10": 立即开始
* "20": 指定时间运行一次
* "30": 每n年
* "31": 每n月
* "40": 每n个星期
* "50": 每n天
* "60": 与 "50" 相同
* "70": 每n小时
* "80": 每n分钟
* "90": 每n秒


```javascript
var schedule = require("schedule");
schedule.start("a", {
  "schedulenm" : "测试",
  "schedule_interval" : "1",
  "schedule_cycle" : "20",
  "run_times" : "1",
  "task_api" : "http://baidu.com",
  "start_time" : "2018-01-16 14:15:00",
  "run_end_time" : "2018-02-01 00:00:00"
});
```


## stop(string:id)

* id: 计划任务主键
* 返回: boolean

停止运行的任务, 若任务不存返回 false, 成功停止任务返回 true.


```javascript
var schedule = require("schedule");
schedule.stop("a");
```


## info(string:id)

* id: 计划任务主键
* 返回: Task 对象

查询任务并返回任务对象; 若任务不存在返回 null.


```javascript
var schedule = require("schedule");
var task = schedule.info("a");
if (task.state == 2) {
  task.stop();
}
```


# Class Task

## Task.state()

返回任务状态.

* 0: 初始化后, 尚未运行过
* 1: 运行的任务正在请求 api 但未返回
* 2: api 返回后产生错误
* 3: 运行的任务休眠中 (等待下次运行)
* 4: 因为到达结束时间而终止
* 5: 因为到达运行次数而终止
* 7: 任务已经删除


## Task.name()

返回任务名称


## Task.nextDate()

返回下一次运行时间, java.util.Date 对象


## Task.stop()

停止任务, 并删除.


## Task.nodeID()

当前任务运行的计算节点 ID.