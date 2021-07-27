<!-- Create By xBoson System -->

<template>
  <div ref='x'>
  <canvas ref='c' :width='width' :height='height' />
  </div>
</template>

<script>
var q,w,e,r,t,y,u,i,o,p,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m;
var Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M;

function demo1(a, b, c) {
  function A(e, t) {
   if (t) C += t;
   M[e * L + C] = 2;
   return A
  }
  let D = Math.max(c.height, c.width); // = 720;
  let T = 10, L = D / T, M = [], Z = [-1, 0, 1], R = Math.round;
  a.shadowBlur = 2;
  for (let i = 0; i < L * L; ++i) M[i] = 0;
  let C = 1;
  
  A(5)(6)(5, 1)(6)(5, 9)(6)(7)(4, 1)(8)(3, 1)(9)(3, 1)(9)(6, 1)(4, 1)(8)(5, 1)(6)(7)(6, 1)(3, 3)(4)(5)(3, 1)(4)(5)(2, 1)(6)(1, 2)(2)(6)(7)(4, 10)(5)(4, 1)(5);
  
  var tid = setInterval(function() {
   function e(e) {
   	a.fillStyle = a.shadowColor = e
   }
   e("#002c00");
   a.fillRect(0, 0, c.width, c.height);
   M = M.map(function(t, n) {
   	e(t > 1 ? (M[n] = t = 1) && "#00e900" : "#007a00");
   	t && a.fillText(String.fromCharCode(0x10280 + Math.random() * 96), n % L * T, T * (n - n % L) / L);
   	var s = 0;
   	Z.map(function(e) {
   		Z.map(function(t) {
   			var x = n % L + e;
   			s += x >= 0 && x < L && M[n + t * L + e] && 1 || 0
   		})
   	});
   	return s - 3 ? s == 4 && t : t ? 1 : 2
   })
  }, 199);
  
  c.onmousemove = function(e) {
   e.offsetY < D && e.offsetX < D && (M[R(e.offsetY / T) * L + R(e.offsetX / T)] = 2)
  }
  return tid;
}

function demo2(a, b, c) {
  var w = Math.max(c.width, c.height);
  // c.width = c.height = w = 410;
  var cy, h, Z, Y, U, x, i, y, z, T, tX, tY, k, N, j;
  var W = w / 2;
  var cx = cy = h = 99;
  var cp = Z = 0;
  var ca = 0.9;
  var hD = [];
  var d = [];
  var X = -20;
  
  // c.onmousemove = function(b) {
  // 	X = b.clientX - W;
  // 	Y = b.clientY - W
  // };
  
  var tid = setInterval(function() {
  	cx += Math.cos(ca += X / w / 9);
  	cy += Math.sin(ca);
  	h += cp = 4 > h ? 0.1 : cp - Y / w / 9;
  	hD[(cx | 0) + (cy | 0) * w + W] / 7 > h && (cp = 1);
  	for (x = w; x--;) {
  		var L = w;
  		var R = ca + Math.asin((x - W) / w);
  		for (y = 700; y > W; y--)
  			if (T = w * h / (y - W), tX = cx + T * Math.cos(R) | 0, tY = cy + T * Math.sin(R) | 0, i = 0 > tX || 0 > tY || tX > w || tY > w ? 0 : tX + tY * w + W, k = hD[i], o = 50 * k / T | 0, N = 0 > y - o ? 0 : y - o, N < L) {
  				var s = T / w;
  				var l = 1 < s ? 0 : U / s;
  				var o = L - N;
  				for (L = N; o--;)
  					if (j = 4 * (x + N * w + o * w), D[j + 3] = l, D[j] = U, !k || o) D[j] = k == U ? 99 : k && !(o % 9) ? U : d[4 * i], D[j + 1] = !k ? 99 : d[4 * i + 1], D[j + 2] = i ? d[4 * i + 2] : W, D[j + 3] = o && o < w / T && 1 < L ? U : i ? l += Math.cos(s) : 0.8 < Math.sin(R * T) ? 0.8 * l : l
  			}
  	}
  	for (i = 3; i < 4 * w * w; i += 4) D[i] || (D[i] = 3 * ((4 * w * w - i) / w / 9 * (i / 4 % w) / i) * w, D[i - 1] = W, D[i - 2] = D[i - 3] = cx);
  	for (a.putImageData(I, 0, 0); i--;) D[i] = 0;
  	Z++;
  	Z %= w;
  	for (i = 9; i--;) o = 5 + U * i + Z * w, Z < w - 1 && (hD[o] = 9), hD[o - w] = 0
  }, U = Y = 88);
  
  for (i = w * w; i--;) x = i % w, y = i / w, z = 16 < y % U && 11 < x % U ? Math.abs(Math.cos(x / U | 0) / Math.cos(y / U | 0) * h) : 0, hD[i] = z < U ? 0 : x % 74 > U && y % 75 > U ? z / ca : z, d[4 * i] = d[4 * i + 1] = d[4 * i + 2] = 4 > (x - 3) % U || 9 > (y - 3) % U ? h : 2 > x % 8 || 2 > y % 9 ? 0 : Math.cos((x / 8 | 0) + (y / 9 | 0)) < ca ? hD[i] && x % W > h && y % W < h ? U + h : U : 0, 38 < (x - 8) % U && 38 < (y - 2) % U && (hD[i + 1] = U);
  var I = a.getImageData(0, 0, w, w);
  var D = I.data;
  return tid;
}

function demo3(a, b, c) {
  var X, Y, H, I, J, E, Q, U, V, i, s, F, z, p, Q, B, W, Z, L, K, l, D, P, y, g, w, q, d, f, v, u, x;
   X = Y = H = I = J = E = Q = U = V = 0;
  var T = [l = 1];
  var C = Math.min(c.width, c.height) / 2;
  var WW = Math.max(c.width, c.height);
  
  var tid = setInterval(function() {
  	for (i = H; i < X + 1400; H = ++i) {
  		(s = i % 800) || (D = i / 800, P = D & 1 && -Q + (Q = Math.random() > .5), K = !P && D && (K + 2 + (Math.random() > .5)) % 3 - 1, B = !P && D > 9 && !B && Math.random() > .7, W = 1.8 * Math.random() - 1);
  		E += F = (s < 160) - (s > 639);
  		p = T[i % 1400] = [I += J, J += K, U += V, V = P * E, !P && Math.exp(-(L = i % 400 - 200) * L / 3e3) / 1.5, i % 400, Math.random() > .95];
  		if (i % 10 == 0) {
  			for (y = Z = 9.8 + B * E / 15, z = W * B * E / 15, g = Math.random() / 6; g < 6.3; g += 2 / Z) Math.random() > (P || B ? .4 : Math.cos(g) > .5) && p.push(1.1 * Z * Math.cos(g + 11), 7 + B * 16, 4 - F, Z * Math.cos(g) + 2 + z, 4 - F);
  			for (t = 2 * Z * Math.random() - Z, w = t * t * Math.random() / 6; B * w > .2;) p.push(t, 7 + B * 16, w, --y + z, 1.1, t, 7 + B * 16, w *= .8, -y + z, 1.1);
  			Q || B * W > .6 && p.push(2 * Z * Math.random() - Z, 12, .2, Z * Math.random() - Z / 2 + z, 1 + Math.random());
  			!B || i % 20 || p.push(-2, 22, .5, -7, Z - 8 - z, 2, 22, .5, -7, Z - 8 - z);
  			i % 20 || p.push(0, 6, 6, -6.8, .8);
  			L || p.push(0, 7 + B * 16, .2, Z + z, Z + z - 5, 0, 7, .6, 5, .6);
  			P || B || (i % 40 || p.push(-6, 6, 1.5, 5, 14, 6, 6, 1.5, 5, 14), i % 20 || p.push(0, 6, 17, 8, 3))
  		}
  		i % 5 || p.push(-2, 6, .5, -6.5, .6, 2, 6, .5, -6.5, .6)
  	}
  	for (q = T[X % 1400]; d = --i - X;)
  		for (p = T[i % 1400], f = C / (d / 10 + 3), v = g = 0, t = C + f * (p[g] - q[g++] - d * q[g++]) / 3e3, u = C + f * (p[g] - q[g++] - d * q[g++]) / 3e3, x = p[g++] * (l = p[g++] ? g++ && l : p[g++] ? Math.random() > .3 : 1), y = d / 1800; z = f * p[g++], w = p[g++];) {
  			v != w && (v = w, a.fillStyle = 'hsl(0,0%,' + 16 * (w & 7) * (w & 8 || y + x * (w < 16)) + '%)');
  			a.fillRect(t + z - (z = f * p[g++]) / 2, u - f * p[g++] + (w == 12 && f * 6 * Math.cos(g + X / 400)), z, f * p[g++])
  		}
  	Y += 4 - 3 * Math.exp(-X / 400) + q[2] / 3e4;
  	X = 0 | Y
  }, 35)
  return tid;
}

function demo4(a, b, c) {
  var q, s;
  var z = q = s = 0, B = [];
  // c.width = 320;
  // c.height = 250 * 2;
  var u = function(e, r) {
  	B[e] = {
  		x: 250 * Math.random(),
  		y: r,
  		t: 1 > 6 * Math.random(),
  		d: 3 * Math.random() | -1
  	}
  };
  var v = function(e, r) {
  	for (f = i = n = k = m = 0; 7 > i;) u(i++, f), c.height > f && (f += 71);
  	g = 155;
  	h = 463;
  	(j = 1, l = 17)
  };
  v();
  var w = function(e, r) {
  	0 > e ? 0 < g && (g -= 6) : 0 < e ? c.width > g + 10 && (g += 6) : 0
  };
  b.onmousemove = function(e, r) {
  	p = e.offsetX;
  	w(p < g ? -1 : p > g ? 1 : 0)
  };
  
  c.onclick = function(e, r) {
  	!q && (q = !v())
  };
  return setInterval(function(e, r) {
  	a.fillStyle = "#79F";
  	a.fillRect(0, 0, c.width, c.height);
  	if (q) {
  		w(s);
  		j && (250 < h ? h -= l : (10 < l && n++, B.forEach(function(e, r) {
  			250 * 2 < (e.y += l) && u(r, e.y - 250 * 2)
  		})), !--l && (j = 0, k = m = 1));
  		k && (463 > h ? h += m++ : n ? q = 0 : k = m = 0);
  		!k && !j && (j = 1, l = 17);
  		B.forEach(function(e, r) {
  		// 	with(e) { 
  			  d *= 0 > e.x || 250 < e.x ? -1 : 1, e.x += d * (r / 2) * n / 100 | 0, a.fillStyle = e.t ? "#FD3" : "#FFF", a.fillRect(e.x, e.y, 70, 20), k && g < e.x + 70 && g + 10 > e.x && h + 37 > e.y && h + 37 < e.y + 20 && (k = m = 0, !j && (j = 1, l = 17), e.t && (l = 50)) 
  		});
  		a.beginPath();
  		for (i = 0; 5 > i;) a.arc(g, h + i++ * (7 - l / 2), 9, 0, 2 * Math.PI);
  		a.stroke()
  	}
  	a.fillStyle = "#000";
  	a.font = "20px arial";
  	a.fillText("Score: " + n, 9, 491);
  	!q && (15 > ++z % 25 && a.fillText("Click/tap to play", 80, 250), a.font = "13px arial", a.fillText("Use the mouse or tilt device to move", 40, 290))
  }, 20)
}

function demo5(a, b, c, ref) {
  var s = 6,
  	S = 0,
  	m = [],
  	Q = [],
  	I = [],
  	P = 0,
  	x, y, i, j, J = Math,
  	r = J.random,
  	f = J.floor,
  	K = "#",
  	Z = window;
  
  function l(p, q, e, f) {
  	for (i = p; i--;) {
  		e();
  		for (j = q; j--;) f()
  	}
  };
  
  function T(i, j) {
  	if (i < 0 || j < 0 || i >= x || j >= y) return -1;
  	else return m[i][j]
  };
  
  function R(V) {
  	return ((V - 1) / 2)
  };
  
  function W(i, j) {
  	Q[i][j] = P;
  	for (var q = -1; q < 2; q++)
  		for (var n = -1; n < 2; n++) {
  			if (n == 0 || q == 0) continue;
  			if (T(i + R(n), j + R(q)) == -R(n / q) && Q[i + n][j + q] == 0) W(i + n, j + q)
  		}
  };
  
  function k(A) {
  	a.strokeStyle = I[Q[i + A][j]];
  	a.moveTo((i + A) * s, j * s);
  	a.lineTo((i + 1 - A) * s, s + j * s)
  };
  e = ()=>{};
  J = function() {
    x=f((c.width-S)/s),y=f((c.height-S)/s);
    l(x,y,()=>{m[i]=[]}, ()=>{m[i][j]=f(r()*2)} );
    l(x+1,y+1,()=>{Q[i]=[]}, ()=>{Q[i][j]=0});
    l(x+1,y+1,e,()=>{if(Q[i][j]==0){P++;for(var z=3,G=K;z--;)G=G+f(r()*15).toString(16);I[P]=G;W(i,j)}});
    a.lineWidth=s/2;
    a.lineCap="round";
    l(x,y,e,()=>{a.beginPath();k(T(i,j));a.stroke()});
  }
  
  b.style.textAlign = "center";
  J();
  Z.onresize = ref.update = J;
  b.onkeydown = b.onclick = function(e) {
  	L = e.keyCode;
  	if (L == 38) s++;
  	if (L == 40 && s > 2) s--;
  	J()
  };
}

// not work
function demo6() {
  for (a in c) c[a[0] + a[6]] = a;
  v = {};
  C = y = t = a = D = H = r = p = n = m = l = k = f = e = 0;
  u = 2;
  c[c.gC] = "destination-over";
  for (w = []; 998 > a;) {
  	i = a ? (a / 6 | 0) % 2 / 9 : 1;
  	I = Math.random();
  	o = (Math.cos(a / 98) - 1) / 98 + H;
  	a && !(a % 49) && 98 * I & 1 && (H = (I - C) / 49, C = I);
  	D += (H - D) / 9;
  	x = [o, H, D, 0, i, 0, 0, 0, 4, 0, .35, .35 * a, 35, -499, 998];
  	w[a++] = x;
  	a % 3 && x.splice(3, 0, 0, 1, 0, 0, 2, .1);
  	a % 9 || (F = a % 2 ? 8 : -6, x.splice(3, 0, 4, .35, a + 98, 98, F, 2, 3, 1, 0, 0, 9, F + 1, .1, 1, 8, .35, -a, 98, 4 * I, 1, 1))
  }
  onkeydown = (g) => {
  	v[g.key] = 1
  };
  onkeyup = (g) => {
  	v[g.key] = 0
  };
  setInterval(() => {
  	g = t | 0;
  	r += 35 * ((v.a | 0) - (v.d | 0)) * (v.l | 2) / 4E3;
  	q = r - l;
  	e += 35 * ((v.w | 0) / 5E4 - e / (0 < u & 4 > u & !v.l ? 5E3 : 998));
  	t += 35 * Math.cos(q) * e;
  	u -= 35 * Math.sin(q) * e;
  	(t | 0) != g && (g = w[g % 998], p = k, k -= g[0], l -= g[1], n = m, m -= g[2]);
  	x = w[(y | 0) % 998];
  	f && x.splice(3, 35);
  	y += 35 / (9 + y - t);
  	x = w[(y | 0) % 998];
  	x.splice(3, 0, .9, 1, 0, 0, .4, 1, .3, 1, .5, 0, 98, .3, 1.2, .5, .7, .35, 0, 98, .2, 1.4, .6, 1, y % .35, 0, 0, .3, .3, 1, 1, y % .35, 0, 0, 1.2, .3, 1);
  	c[c.ce](0, 0, 998, 998);
  	j = 0;
  	g = t - (t | 0);
  	q = (k - p) * g;
  	d = r - l;
  	for (h = (m - n) * g, J = -u - g * Math.sin(d), K = .35 - g * Math.sin(q); 98 > j;) {
  		j++;
  		G = 998 / (j - g) * Math.cos(d);
  		J += Math.tan(d);
  		K += Math.sin(q);
  		x = w[(t + j | 0) % 998];
  		for (a = 3; a < x.length;) {
  			M = x[a++];
  			E = x[a++];
  			L = j * (1 - E) + 98 * E + 2;
  			c[c.fy] = "hsl(" + x[a++] + "," + x[a++] + "%," + L + "%)";
  			c[c.sn](G, 0, 0, G, 499, 499);
  			c[c.to](Math.cos(h), Math.sin(h), -Math.sin(h), Math.cos(h), J * Math.cos(h) - K * Math.sin(h), K * Math.cos(h) + J * Math.sin(h));
  			L = x[a++];
  			s = x[a++];
  			c[c.fc](L, -M, s, M ? x[a++] : 9);
  			c[c.sn](1, 0, 0, 1, 0, 0)
  		}
  		q += x[0];
  		d += x[1];
  		h += x[2]
  	}
  	f += 35
  }, 35);
}

const tool = require("./tool.js");
export default {
  props: ['width', 'height'],
  
  watch: {
    width()  { this.callUp() },
    height() { this.callUp() },
  },
  
  data() {
    return {
      tid : null,
      demo: [ demo1, demo2, demo3, demo4, demo5 ],
      ref : { update: null },
      callUp : tool.delayWorker(this._callUp, 100),
    };
  },
  
  mounted() {
    this.$nextTick(()=>{
      let canvas = this.$refs.c;
      let d = this.getDemo();
      // let d = demo5;
      this.tid = d(canvas.getContext("2d"), this.$refs.x, canvas, this.ref);
    });
  },
  
  beforeDestroy() {
    clearInterval(this.tid);
  },
  
  methods: {
    getDemo() {
      let i = parseInt(Math.random() * this.demo.length);
      return this.demo[i];
    },
    
    _callUp() {
      this.ref.update && this.ref.update();
    },
  },
}
</script>

<style scoped>
</style>