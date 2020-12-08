jQuery(function($) {
  const parm = parseParm();
  const state = $(".state");
  
  // {id:数据}
  const obj = {};
  const operator = {
    get_labels  : null,
    new_node    : null,
    edit_node   : null,
    remove_node : null,
    new_rel     : null,
    edit_rel    : null,
    remove_rel  : null,
    new_query   : null,
    get_rel     : null,
    clean_graph,
  };
  
  console.log(parm)
  state.find(".id").text(parm._id);
  
  $('.operator a').click(function() {
    return false;
  });
  
  cytoscape({
    container: document.getElementById('graph'),
    //demo
    elements : [
      { // node n1
        data: { id: 'n1', label:'a' },
      },
      
      { // node n2
        data: { id: 'n2', label:'b' },
        renderedPosition: { x: 200, y: 200 } // can alternatively specify position in rendered on-screen pixels
      },
  
      { // node n3
        data: { id: 'n3', label: 'nparent' },
        position: { x: 123, y: 234 }
      },
      
      { data: { label: 'top left' }, classes: 'top-left' },
  
      { // node nparent
        data: { id: 'nparent' }
      },
  
      { // edge e1
        data: {
          id: 'e1',
          // inferred as an edge because `source` and `target` are specified:
          source: 'n1', // the source node id (edge comes from this node)
          target: 'n2'  // the target node id (edge goes to this node)
          // (`source` and `target` can be effectively changed by `eles.move()`)
        },
  
        pannable: true // whether dragging on the edge causes panning
      }
    ],
    
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': randomColor(),
          'color': '#aaa',
          'label': 'data(id)'
        }
      },
    ]
  });
  
  
  function clean_graph() {
  }
  
  
  function parseParm() {
    var pm = {};
    location.search.substr(1).split('&').forEach(function(p) {
      var x = p.split('=');
      pm[x[0]] = decodeURIComponent(x[1]);
    });
    return pm;
  }
  
  
  function randomColor() {
    return '#'+ cc() + cc() + cc();
  }
  
  
  function cc() {
    var a = Math.random() * 0xDF + 0x20;
    a = parseInt(a).toString(16);
    if (a.length < 2) a = '0'+ a;
    return a;
  }
});