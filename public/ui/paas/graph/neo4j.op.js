/* Create By xBoson System */
(function() {
  
  
const op = window.graph_operator = {
  module : 'neo4j',
  query,
  genDeleteCql,
  genInsertAttrCql,
  genDeleteProp,
  genCreateNode,
  genCreateEdge,
  genDeleteIndex,
  genCreateIndex,
};


function genCreateIndex(label, name) {
  return ['CREATE INDEX ON :', label, ' (', name, ')'].join('');
}


function genDeleteIndex(label, name) {
  return ['DROP INDEX ON :', label, ' (', name, ')'].join('');
}


function genCreateEdge(begin, end, label, prop) {
//   MATCH (a), (b) WHERE id(a) = 1 AND id(b) = 2
// CREATE (a)-[: Relation]->(b) 
  let cql = ['MATCH (begin), (end) WHERE id(begin) = ', begin, 
    ' AND id(end) = ', end,
    ' CREATE (begin)-[:', label];
  out_prop(cql, prop);
  cql.push(']->(end) Return begin, end');
  return cql.join('');
}


function genDeleteCql(id, label, del_rel, isEdge) {
  if (label.constructor == Array) {
    label = label[0];
  }
  if (isEdge) {
    return ['MATCH ()-[r:', label, ']->() WHERE id(r) = ', id, ' DELETE r'].join('');
  } else if (del_rel) {
    return ['MATCH (obj: ', label, ')-[r]->(x) Where id(obj) = ', id, ' DELETE obj, r'].join('');
  } else {
    return ['MATCH (obj: ', label, ') Where id(obj) = ', id, ' DELETE obj'].join('');
  }
}


function genInsertAttrCql(id, label, k, v, isEdge) {
  if (isEdge) {
    return ['MATCH ()-[obj: ', label, ']->() Where id(obj) = ', id, ' SET obj.', k, " = ", JSON.stringify(v)].join('');
  }
  return ['MATCH (obj: ', label, ') Where id(obj) = ', id, ' SET obj.', k, " = ", JSON.stringify(v)].join('');
}


function genDeleteProp(id, label, k, isEdge) {
  if (isEdge) {
    return ['MATCH ()-[obj: ', label, ']->() Where id(obj) = ', id, ' REMOVE obj.', k].join('');
  }
  return ['MATCH (obj: ', label, ') Where id(obj) = ', id, ' REMOVE obj.', k].join('');
}


function genCreateNode(label, prop) {
  let cql = ['CREATE (o:', label];
  out_prop(cql, prop);
  cql.push(')');
  return cql.join('');
}


function out_prop(out, prop) {
  out.push('{');
  let needpop;
  for (let n in prop) {
    out.push(n, ':');
    out.push(JSON.stringify(prop[n]));
    out.push(',');
    needpop = 1;
  }
  if (needpop) out.pop(); // pop last ','
  out.push('}');
}


function query(parm, cb) {
  var thiz = this;
  
  this.api("query", parm, function(err, data) {
    if (err) return cb(err);
    var table = thiz.newTable();
    var edges = [];
    if (data.data.length < 1) {
      return cb(null, data)
    }
    
    data.data.forEach(function(row) {
      for (var k in row) {
        var o = row[k];
        
        switch(o.$type) {
        case 'node':
          thiz.addNode(o.id, o.label, o.propertie);
          break;
          
        case 'rel':
          edges.push({rel : o, table, k, r : table.rowNum() });
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
    } 
    requestNodesEdge();
  });
  
  function addEdge(r) {
    try {
      var o = r.rel;
      thiz.addEdge(o.id, o.type, o.start, o.end, o.propertie);
    } catch(e) {
      if (r.table) {
        r.table.putx(r.r, r.table.col(r.k), r.rel.propertie);
      } else {
        console.error(e);
      }
      // r.table.putx(r.r, r.table.col('error'), e.message);
    }
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
          addEdge({ rel : row.r });
        });
        cb(null, data);
      }
      thiz.update();
    });
  }
}
  

})();