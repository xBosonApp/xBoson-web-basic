(function(data, type, id, handle) { 
  var form = handle.parents("form").first();
  var sql_str = form.find('[name=sql_str]').val();
  var src_did = form.find('[name=source_did]').val();
  var criid   = form.find('[name=criid]').val();
  
  if (!sql_str) return xb.warn("缺少参数", "提取数据的 SQL 文");
  if (!src_did) return xb.warn("缺少参数", "SQL 数据源");
  if (!criid)   return xb.warn("缺少参数", "交换标准");
  
  var conditions = {
    sql : sql_str,
    did : src_did,
  };
  
  api('9da3e4550d1f42d3979ae30931d498c9', 'nsdata', 'cri_list', {criid:criid}, function(ret) {
    var typecd = ret.data[0].typecd;
    
    getDict(typecd, function(dict) {
      api(null, 'dbop', 'meta', conditions, function(dat) {
        makeMapping(dat.data, dict);
      });
    });
  });
  
  function makeMapping(table, dict) {
    console.log(table, dict, '--------------------------');
  }
  
  function getDict(typecd, cb) {
    zy.cache.initDicts(typecd, function() {
      cb(zy.cache.getDict(typecd))
    });
  }
  
  function api(app, mod, api, conditions, cb) {
    zy.g.am.app = app || 'a1e22425b8574d67bf4f200b4ccde506',
    zy.g.am.mod = mod
    zy.net.post('api/'+ api, _cb, conditions, 0, _cb, new Error());
    
    function _cb(ret) {
      if (ret && ret.code == 0) {
        cb(ret);
      } else {
        xb.warn('提取字段错误', dat.msg);
      }
    }
  }
})