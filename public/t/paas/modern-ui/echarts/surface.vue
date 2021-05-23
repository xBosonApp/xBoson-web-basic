<!-- Create By xBoson System -->

<template><doc>
  <h2>3D 曲面</h2>
  
  <div v-for='(op, i) in options'>
    <chart :option='op'></chart>
  </div>
  
</doc></template>

<script>
const ROOT_PATH = "";
const myChart = {
  showLoading(){},
  hideLoading(){},
  setOption(o) { return o; },
};
//const $ = require("./data.js");
//const ecStat = require('cdn/echarts-stat/1.2.0/ecStat.min.js');
//const ecSimpleTransform = require("./data/ecSimpleTransform.min.js", 0, 0, 1)
let option;


// 这里插入数据生成代码
function d1() {
  var sin = Math.sin;
var cos = Math.cos;
var pow = Math.pow;
var sqrt = Math.sqrt;
var cosh = Math.cosh;
var sinh = Math.sinh;
var exp = Math.exp;
var PI = Math.PI;
var square = function (x) {
    return x*x;
}
var mod2 = function (a, b) {
    var c = a % b;
    return c > 0 ? c : (c + b);
}

var theta1 = -(20/9) * PI;
var theta2 = 15 * PI;
function getParametricEquation() {
    return {
        u: {
            min: 0,
            max: 1,
            step: 1 / 24
        },
        v: {
            min: theta1,
            max: theta2,
            step: (theta2 - theta1) / 575
        },
        x: function (x1, theta) {
            var phi = (PI/2)*exp(-theta/(8*PI));
            var y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
            var X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
            var r = X*(x1*sin(phi)+y1*cos(phi));
            return r * sin(theta);
        },
        y: function (x1, theta) {
            var phi = (PI/2)*exp(-theta/(8*PI));
            var y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
            var X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
            var r = X*(x1*sin(phi)+y1*cos(phi));
            return r * cos(theta);
        },
        z: function (x1, theta) {
            var phi = (PI/2)*exp(-theta/(8*PI));
            var y1 = 1.9565284531299512*square(x1)*square(1.2768869870150188*x1-1)*sin(phi);
            var X = 1-square(1.25*square(1-mod2((3.6*theta),(2*PI))/PI)-0.25)/2;
            var r = X*(x1*sin(phi)+y1*cos(phi));
            return X*(x1*cos(phi)-y1*sin(phi));
        }
    };
}

return option = {
    toolbox: {
        feature: {
            saveAsImage: {
                backgroundColor: '#111'
            }
        },
        iconStyle: {
            normal: {
                borderColor: '#fff'
            }
        },
        left: 0
    },
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {

        show: false,

        axisPointer: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        },
        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 10,
                intensity: 2
            },
            edge: {
                enable: true
            }
        },
        temporalSuperSampling: {
            enable: true
        },
        light: {
            main: {
                intensity: 3,
                shadow: true,
            },
            ambient: {
                intensity: 0
            },
            ambientCubemap: {
                // texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                exposure: 0,
                diffuseIntensity: 1,
                specularIntensity: 0.5
            }
        },
        viewControl: {
            // projection: 'orthographic'
        }
    },
    series: [{
        type: 'surface',
        parametric: true,
        shading: 'realistic',
        silent: true,
        wireframe: {
            show: false
        },
        realisticMaterial: {
            // baseTexture: ROOT_PATH + '/asset/get/s/data-1494250104909-SkZtfeAyZ.jpg',
            roughness: 0.7,
            metalness: 0,
            textureTiling: [200, 20]
        },
        itemStyle: {
            color: '#fff'
        },
        parametricEquation: getParametricEquation()
    }]
};
}

function d2() {
  return option = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value'
    },
    grid3D: {
        viewControl: {
            // projection: 'orthographic'
        }
    },
    series: [{
        type: 'surface',
        wireframe: {
            // show: false
        },
        equation: {
            x: {
                step: 0.05
            },
            y: {
                step: 0.05
            },
            z: function (x, y) {
                if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                    return '-';
                }
                return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
            }
        }
    }]
}
}

function d3() {
  return option = {
    tooltip: {},
    visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {},
    yAxis3D: {},
    zAxis3D: {},
    grid3D: {},
    series: [{
        type: 'surface',
        parametric: true,
        // shading: 'albedo',
        parametricEquation: {
            u: {
                min: -Math.PI,
                max: Math.PI,
                step: Math.PI / 20
            },
            v: {
                min: 0,
                max: Math.PI,
                step: Math.PI / 20
            },
            x: function (u, v) {
                return Math.sin(v) * Math.sin(u);
            },
            y: function (u, v) {
                return Math.sin(v) * Math.cos(u);
            },
            z: function (u, v) {
                return Math.cos(v);
            }
        }
    }]
};
}

function d4() {
  var sin = Math.sin;
var cos = Math.cos;
var pow = Math.pow;
var sqrt = Math.sqrt;
var cosh = Math.cosh;
var sinh = Math.sinh;
var PI = Math.PI;

var aa = 0.4;
var r = 1 - aa * aa;
var w = sqrt(r);

return option = {
    toolbox: {
        left: 20,
        iconStyle: {
            normal: {
                borderColor: '#000'
            }
        },
        feature: {
            myExportObj: {
                title: 'Export OBJ',
                icon: 'M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
                onclick: function () {
                    var res = echarts.exportGL2PLY(myChart, {
                        mainType: 'grid3D',
                        index: 0
                    });
                    download(res, 'surface.ply', 'text/plain');
                }
            }
        }
    },
    tooltip: {},
    visualMap: {
        show: false,
        dimension: 2,
        min: -3,
        max: 3,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {},
    yAxis3D: {},
    zAxis3D: {},
    grid3D: {
        show: true,
        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 4
            }
        },
        viewControl: {
            distance: 130,
            beta: 50
        },
        light: {
            main: {
                intensity: 2,
                shadow: true
            },
            ambient: {
                intensity: 0
            },
            ambientCubemap: {
                // texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                exposure: 2,
                diffuseIntensity: 0.2,
                specularIntensity: 1
            }
        }
    },
    series: [{
        type: 'surface',
        parametric: true,
        wireframe: {
            show: false
        },
        shading: 'realistic',
        realisticMaterial: {
            roughness: 0.3,
            metalness: 0
        },
        parametricEquation: {
            u: {
                min: -13.2,
                max: 13.2,
                step: 0.2
            },
            v: {
                min: -37.4,
                max: 37.4,
                step: 0.2
            },
            x: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return -u + (2 * r * cosh(aa * u) * sinh(aa * u) / denom);
            },
            y: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return 2 * w * cosh(aa * u) * (-(w * cos(v) * cos(w * v)) - (sin(v) * sin(w * v))) / denom;
            },
            z: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return  2 * w * cosh(aa * u) * (-(w * sin(v) * cos(w * v)) + (cos(v) * sin(w * v))) / denom
            }
        }
    }]
};
}

function d5() {
  return option = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value',
        max: 1,
        splitNumber: 2
    },
    grid3D: {
        viewControl: {
            // projection: 'orthographic'
        },
        boxHeight: 40
    },
    series: [{
        type: 'surface',
        wireframe: {
            show: false
        },
        shading: 'color',
        equation: {
            x: {
                step: 0.05,
                min: -3,
                max: 3,
            },
            y: {
                step: 0.05,
                min: -3,
                max: 3,
            },
            z: function (x, y) {
                return Math.sin(x * x + y * y) * x / 3.14
            }
        }
    }]
}
}


let options = [
  d1, d2, d3, d4, d5,
];

export default {
  data() {
    return {
      options
    };
  }
}
</script>

<style>
</style>