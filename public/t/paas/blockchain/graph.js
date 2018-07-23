/* Create By xBoson System */
jsPlumb.bind("ready", function() {
  var SHOW_BLOCK_COUNT = 20;
  var graph = $('#graph');
  var chain_id = $('#graph_form').find('input[name=chain_id]').val();
  var genesis;
  var draw_connect = $.Callbacks();
  var chaincodeMap = {};
  var blockName = ['', '创', '块', '密', '码', '消'];
  
  var pl = jsPlumb.getInstance({      
     Endpoint           : ["Dot", {radius:2}],
     HoverPaintStyle    : { strokeStyle: "#1e8151", lineWidth: 3 },
     DragOptions        : { zIndex:2000 },
     Container          : graph,
     ConnectionOverlays : [
         [ "Arrow", { location: 1, id: "arrow", length:10, foldback:0.8, width: 10} ],
         [ "Label", { label: "", id: "label", cssClass: "labelstyle" }]
     ],
  });
  
  init();


  function init() {
    $('#subtitle').html("最近"+ SHOW_BLOCK_COUNT +"个区块浏览, 关联链码和密钥");
    build();
    xb.waitDisplay(graph, repaint_connect);
    xb.on("PAGE_DESTROY", null, freeAll);
    $(window).resize(repaint_connect);
  }
  
  
  function freeAll() {
    $(window).off('resize', repaint_connect);
    graph.find("td").find('*').remove();
    pl.reset();
  }
  
  
  function build() {
    build_signer(function() {
      build_genesis(function() {
        build_data_block(function() {
          build_all_connect();
        });
      });
    });
  }
  
  
  function setChainAttribute(ret) {
    $('#blockchainsize').val(ret.size);
    $('#worldState').val(ret.worldState);
  }
  
  
  function repaint_connect() {
    pl.revalidate(graph);
    pl.repaintEverything();
  }
  
  
  function build_all_connect() {
    draw_connect.fire('make');
  }
  
  
  function getblock(key, cb) {
    if (!key) throw new Error("key is null");
    var parm = {chain_id: chain_id, key: key};
    xb.api('81092b8cd82041a2b81296409eba92da', 'basic', 'getblock', parm, cb);
  }
  
  
  function build_data_block(cb) {
    var parm = {chain_id:chain_id};
    var count = SHOW_BLOCK_COUNT;
    var nextKey = null;
    
    xb.api('81092b8cd82041a2b81296409eba92da', 'basic', 'lastblockkey', parm, function(last) {
      _create_block(last.block);
    });
    
    function _next() {
      if (--count > 0 && nextKey != genesis.key) {
        getblock(nextKey, function(ret) {
          _create_block(ret.block);
        });
      } else {
        if (nextKey != genesis.key) {
          var id = blockid(nextKey);
          create_block('data_block', "忽略更多的数据块", ". . .").attr("id", id);
          connect(id, blockid(genesis), ["Left", "Right"], '链', 1);
        }
        cb && cb();
      }
    }
    
    function _create_block(_block) {
      var id = blockid(_block);
      create_block('data_block', _block, blockName[_block.type] +' '+ _block.key).attr("id", id);
      nextKey = _block.previousKey;
      connect(signerid(_block), id, ['Right', 'Left'], '签名', 300);
      connect(id, blockid(nextKey), ['Left', 'BottomLeft'], '链', 20);
      build_chaincode(_block, _next);
    }
  }
  
  
  function build_signer(cb) {
    xb.api('81092b8cd82041a2b81296409eba92da', 'basic', 'keys', {chain_id:chain_id}, function(ret) {
      ret.result.forEach(function(s) {
        create_block('signer', s, s.type_name +"<br/>Public Key: "+ s.publickey).attr("id", signerid(s));
      });
      cb && cb();
    });
  }
  
  
  function build_genesis(cb) {
    xb.api('81092b8cd82041a2b81296409eba92da', 'basic', 'getgenesis', {chain_id:chain_id}, function(ret) {
      var id = blockid(ret.block);
      create_block('genesis', ret.block, "创世区块<br/>"+ ret.block.key).attr("id", id);
      genesis = ret.block;
      connect(signerid(ret.block), id, ['Left', 'Right'], '签名');
      cb && cb();
      setChainAttribute(ret);
    });
  }
  
  
  function build_chaincode(ref, cb) {
    var key = ref.chaincodeKey;
    if (!key) return (cb && cb()); // 链码本身没有 chaincodeKey
    var cc = chaincodeMap[key];
    
    if (!cc) {
      getblock(key, function(ret) {
        cc = chaincodeMap[key] = ret.block;
        var id = chaincodeid(cc);
        var name = '链码<br/>'+ cc.apiPath +"<br/>["+ cc.create +"]";
        create_block('chaincode', cc, name).attr("id", id);
        connect(signerid(cc), id, ['Right', 'Left'], '签名');
        _create_conn(id);
      });
    } else {
      _create_conn(chaincodeid(cc));
    }
    
    function _create_conn(id) {
      connect(blockid(ref), id, ['BottomRight', 'TopLeft'], '链码', 50);
      cb && cb();
    }
  }
  
  
  function create_block(toID, data, name) {
    var b = $("<div class='block'></div>");
    b.html(name || data);
    var info = $("<pre>");
    info.text(JSON.stringify(data, 0, 2)).appendTo(b);
    info.hide();
    pl.draggable(b);
    
    b.mouseover(function() {
      info.show();
    }).mouseout(function() {
      info.hide();
    });
    
    switch (toID) {
      case 'data_block': 
        $('#'+ toID).prepend(b);
        break;
        
      default:
        $('#'+ toID).append(b);
        break;
    }
    return b;
  }
  
  
  function signerid(x) {
    return 'signer_'+ x.type;
  }
  
  
  function blockid(b) {
    return 'block_'+ (b.key || b);
  }
  
  
  function chaincodeid(b) {
    return 'chaincode_'+ (b.chaincodeKey || b.key);
  }
  
  
  function connect(a, b, anchors, text, curviness) {
    var conn;
    draw_connect.add(function() {
      try {
        var stroke;
        var strokeWidth = 1;
        var connector = [ "Bezier", { curviness: curviness || 100, cssClass: 'linebezier' }];
        
        switch (text) {
          case '链码':
            stroke = '#CC9999'; break;
          case '签名':
            stroke = '#CCCC99'; break;
          case '链':
            //connector = [ 'Flowchart', { midpoint: 1, cornerRadius: 5, stub: 3 }];
            strokeWidth = 2;
            stroke = '#666666'; break;
          default:
            stroke = '#333'; break;
        }
        
        var setting = {
          source        : a, 
          target        : b,
          anchor        : anchors || [ "Perimeter", { shape:"Square", anchorCount:150 }],
          endpointStyle : { fill: "#999" },
          detachable    : false,
          connector     : connector,
          paintStyle    : { stroke: stroke, strokeWidth: strokeWidth, cssClass: 'linestyle' },
        };
        conn = pl.connect(setting);
        conn.setHoverPaintStyle({ strokeWidth: 3 });
        text && conn.getOverlay("label").setLabel(text);
      } catch(e) {
        zy.ui.msg("错误", e.message || e, 'e');
      }
    });
  }
});