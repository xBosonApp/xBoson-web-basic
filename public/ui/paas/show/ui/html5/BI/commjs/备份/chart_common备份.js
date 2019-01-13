function reCallback(retData, type, divId) {
    if(retData.dataMap.dataAll.length > 0 && type !== null && type !== undefined) {
        if('pie' === type) {
            animatePie(retData.dataMap.dataAll, divId);
        } else {
            //animateColumn(retData.dataMap.data, divId);
			animateDrilldowmColumn(retData, divId);
        }
    } else {
        //alert("Unexpecting Error");
		return {"dataError" : "数据为空"};
    }
}

var animatePie = function(data, divId) {
    var dataArray = fetchDataForPie(data[0]);
    $(divId).highcharts({
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
					distance: 10,
					//rotation:5,
                    format: '{point.name}: <br />{point.percentage:.1f} %'
                },
				showInLegend: true
            }
        },
		credits: {
            enabled: !0,
            text: 'livechain.com.cn',
            href: 'http://www.livechain.com.cn'
        },
        series: [{
            type: 'pie',
            name: '',
            data: dataArray
        }]
    });
}

var animateColumn = function(data, divId) {
    var dataArray = fetchDataForColumn(data);
    $(divId).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text:''
        },
        xAxis: {
            categories: dataArray[0],
            type: 'category',
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: '微软雅黑, 宋体, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        tooltip: {
            pointFormat: '<b>{point.y:,.of}</b><br/>({series.name})'
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function(event) {
                    
                    }
                }
            }
        },
		credits: {
            enabled: !0,
            text: 'livechain.com.cn',
            href: 'http://www.livechain.com.cn'
        },
        series:dataArray[1]
    });
}



var animateDrilldowmColumn = function(retData, divId) {
    var colors = Highcharts.getOptions().colors,
        categories = [],
        name = 'ALL',
        data = [];
    
    var categoryArray = fetchDataForPie(retData.dataMap.dataAll[0]);
    var drilldownCategory = fetchDataForColumn(retData.dataMap.data);
    for (var i = 0; i < categoryArray.length; i++) {
        var dataValue = {
            y: 0,
            color: '',
            drilldown: {
                name: '',
                categories: drilldownCategory[0],
                data: [],
                color: ''
            }
        };
        categories.push(categoryArray[i][0]);
        dataValue.y = categoryArray[i][1];
        dataValue.color = colors[i];
        dataValue.drilldown.name = categoryArray[i][0];
        dataValue.drilldown.data = drilldownCategory[1][i].data;
        dataValue.drilldown.color = colors[i];
        data.push(dataValue);
    }
//    for (var i = 0; i < drilldownCategory[1]; i++) {}
    
    //setChart
    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories, false);
        chart.series[0].remove(false);
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        }, false);
        chart.redraw();
    }
    
    //drawChart
    var chart = $(divId).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: categories,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px'
                    //fontFamily: '宋体, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            var drilldown = this.drilldown;
                            if (drilldown) { // drill down
                                setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
                            } else { // restore
                                setChart(name, categories, data);
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: false,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return this.y;
                    }
                }
            }
        },
        tooltip: {
            formatter: function() {
                var point = this.point,
                    s = this.x +':<b>'+ this.y +'</b><br/>';
                if (point.drilldown) {
                    s += '点击 '+ point.category +' 浏览详细';
                } else {
                    s += '';
                }
                return s;
            }
        },
		credits: {
            enabled: !0,
            text: 'livechain.com.cn',
            href: 'http://www.livechain.com.cn'
        },
        series: [{
            name: name,
            data: data,
            color: 'white'
        }],
        exporting: {
            enabled: true
        }
    })
    .highcharts(); // return chart
}





var fetchDataForPie = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('机构' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}

var fetchDataForColumn = function(data) {
    var dataArray = []; 
    var data1 = [];
    var data2 = [];
    var keyArray = [];
    
    $.each(data[0], function(key, value) {
        if ('机构' !== key) {
            keyArray.push(key);
        }
    });
    
//    for (var key in data) {
//        if ('机构' !== key) {
//            keyArray.push(key);
//        }
//    }
    
    for (var i = 0; i < keyArray.length; i++) {
        var subdata = {
            name: '',
            data: []
        };
        subdata.name = keyArray[i];
        data2.push(subdata);
    }

    try {
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if ('机构' === key) {
                    data1.push(data[i][key]);
                } else {
                    for (var j = 0; j < keyArray.length; j++) {
                        if (key === data2[j].name) {
                           data2[j].data.push(parseData(data[i][key])); 
                        }
                    }
                }
            }
        }
    } catch (err) {}
    dataArray.push(data1);
    dataArray.push(data2);
    //console.log(dataArray);
    return dataArray;
}
var parseData = function (data) {
    var isInteger = /^[1-9]+[0-9]*$/;
    var isDouble = /^[0-9]+.?[0-9]|.[0-9]*$/;
    if (isInteger.test(data)) {
        return parseInt(data);
    } else if (isDouble.test(data)) {
        return parseFloat(data);
    } else {
        return data;
    }
}




