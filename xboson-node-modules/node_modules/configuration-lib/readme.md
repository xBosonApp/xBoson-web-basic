# 读取配置文件


## Usage

该库必须在项目中的其他库引入前被引入

```js
// 加载库, 并初始化配置
var lib = require('configuration-lib');

// ret 从 a, b 中继承属性, b 会覆盖 a 中已经有的属性, 深度复制
var ret = lib.extends(a, b, ...);

// 等待配置文件初始化完成
lib.wait_init(function(conf) {});

// 读取配置, conf 对象是独立的, 如果修改了 conf 中的属性不会影响全局配置
// 这个方法的调用应该在 lib.wait_init 的回调中完成
var conf = lib.load();

// 合并原先的配置, 完成后调用 next
lib.save(conf, next:Function());

// 原始配置被删除, 只保留最新的配置
lib.saveNomerger(conf, next:Function());

// 同步递归的创建目录
lib.mkdir('dirname');

// 自动把配置保存在外部, 并且等到初始化结束执行 over()
lib.auto_init(over:Function(conf));
```

> 保存全局配置, 此时其他模块再次调用 load() 会读取被修改的配置,  
> 这个修改是持久的, 如果设置了 ext_config_file 属性
> 当程序更新, 外部配置文件不同步时, 可以先读取程序配置, 再保存一次到外部文件


## 常量

```js
// 获取与系统相关的应用程序数据存储目录
// windows : %APPDATA%/
// linux   : /usr/etc/
lib.userdata

// node 配置文件根目录 lib.userdata + /node-config/
lib.nodeconf
```

