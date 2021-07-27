var conf = require('../index.js');
var console = require('../lib/logger.js');

var a = {
	ex: { c1:1, c2:2, c9:9 },
	m: 1,
	n: 99,
	ar1: [0,0,0,0,9],
	ar3: {}
};

var b = {
	ex: { c3: 3, c9:0 },
	m: 2,
	k: 88,
	z: { z1: 99, z2:{ z21: { z211: 1} }  },
	ar1: [1,2,3,4],
	ar2: [5,6],
	ar3: [7,8]
}

var c = conf.extends(a, b);

console.log("must be all 'true':");
console.log(
	c.ex.c1 == a.ex.c1,
	c.ex.c2 == a.ex.c2,
	c.ex.c3 == b.ex.c3,
	c.ex.c9 == b.ex.c9,
	c.m == b.m,
	c.n == a.n,
	c.k == b.k,
	c.z.z1 == b.z.z1,
	c.z.z2.z21.z211 == b.z.z2.z21.z211,
	c.ar1[1] == b.ar1[1],
	c.ar1[4] == a.ar1[4],
	c.ar2[0] == b.ar2[0],
	c.ar3[0] == b.ar3[0]
);

console.log(c);
console.log(c.ex.c9, b.ex.c9, a.ex.c9)

console.log(conf.extends({}));
