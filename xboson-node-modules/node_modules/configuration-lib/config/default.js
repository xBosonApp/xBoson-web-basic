// 默认配置文件, 集成了多个系统的默认配置
module.exports = {
  port    : 80,
  cluster : false,


  // 如果启用了这个选项, 首次运行时配置文件会被复制到这个路径
  // 之后总是从这个配置文件中读取配置
  // ext_config_file : '/usr/local/config.json'


  // from [logger-lib]
  logger : {
    // ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, MARK, OFF
    logLevel : 'ALL',

    // 相对于项目目录的日志文件目录
    log_dir  : 'logs',

    // 达到 log_size 后文件分块
    log_size : 20 * 1024 * 1024, // 20MB

    // 文件分块后, 最多保留几个分块文件
    reserve_count : 10, 
    
    create_dir: true,

    // 写 kfk 日志时需要的参数
    kfk_log: {
    }
  },

  // form [dcip-prj]
  dcip : {
    // udp 广播端口
    port : 19818,
    // 数据加密密码
    pass : 'abcdefg',
  },
};
