/* Create By xBoson System */
(function() {
  
  
const op = window.graph_operator = {
  module : 'neo4j',
  query,
};


function query(parm, cb) {
  var thiz = this;
  
  this.api("query", parm, function(err, data) {
    if (err) return cb(err);
    var table = thiz.newTable();
    var edges = [];
    
    data.data.forEach(function(row) {
      for (var k in row) {
        var o = row[k];
        
        switch(o.$type) {
        case 'node':
          thiz.addNode(o.id+'', o.label, o.propertie);
          break;
          
        case 'rel':
          edges.push(o);
          break;
          
        default:
          table.put(table.col(k), o);
          break;
        }
      }
      table.next();
    });
    
    edges.forEach(addEdge);
    if (table.hasData()) {
      table.show(parm.cql);
      cb();
    } else {
      requestNodesEdge();
    }
  });
  
  function addEdge(o) {
    thiz.addEdge('node.'+ o.id, o.type, o.start+'', o.end+'', o.propertie);
  }
  
  function requestNodesEdge() {
    var id = [];
    thiz.eachNode((i)=>{ 
      id.push(i);
    });
    id = id.join(",");
    
    var q = ['MATCH (a)-[r]->(b) Where id(a) IN [', id, '] And id(b) IN [', id, '] RETURN r'];
    parm.cql = q.join('');
    
    thiz.api("query", parm, function(err, data) {
      if (err) {
        cb(err);
      } else {
        data.data.forEach(function(row) {
          addEdge(row.r);
        });
        cb();
      }
      thiz.update();
    });
  }
}
  

})();