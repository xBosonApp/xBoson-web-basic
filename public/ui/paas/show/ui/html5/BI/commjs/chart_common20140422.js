function reCallback(retData, type, divId) {
    if(retData.dataMap.data.length > 0 && type !== null && type !== undefined) {
        $(".tools").show();
        $(".loadshow").hide();
        if('pie' === type) {
            animatePie(retData.dataMap.dataAll, divId);
        } else {
            //选择转曲条件---------------------------------开始
            var zhuanqu=$("#zhuanqu").val();
            //animateColumn(retData.dataMap.data, divId);  时间
            //animateDrilldowmColumn(retData, divId);      机构
            if (zhuanqu=="1" || zhuanqu==undefined) {
                setTimeout(function(){
                animateDrilldowmColumn(retData, divId);
                }, 300);
                                
            }else{
                if (retData.dataMap.data[0].月) {
                    animateColumn(retData.dataMap.data, divId);
                }else{
                    animateColumnday(retData.dataMap.data, divId);
                };
            };
            
            //选择转曲条件---------------------------------结束
        }
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyData(retData,divId);
    }
}
function emptyData(retData, divId){
    $(divId).highcharts({
        title: {
            text: ''
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        credits: {
            enabled: !0,
            text: 'livechain.com.cn',
            href: 'http://www.livechain.com.cn'
        },
        series: [{
            name: '没有数据',
            data: [0]

        }]
    });
}
var animatePie = function(data, divId) {
    var zhuanqu=$("#zhuanqu").val();
    if(zhuanqu=="1" || zhuanqu==undefined){
        var dataArray = fetchDataForPie(data[0]);
    }else{
        if (retData.dataMap.data[0].月) {
                var dataArray = fetchDataForPieyy(data[0]);
            }else{
                var dataArray = fetchDataForPiedd(data[0]);
            };
    }
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
//月份
var animateColumn = function(data, divId) {
    var dataArray = fetchDataForColumntime(data);
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
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    distance: 0,
                    rotation: -90,
                    align: 'top',
                    x: 4,
                    y: 0,
                    formatter: function() {
                        return this.y;
                    }
                },
                events: {
                    click: function(e) {
                    $("#MM").val(e.point.category);
                    EtbjgltimeDay();
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
//$(".highcharts-legend-item").last().remove();
/*var lastname=$(".highcharts-legend-item").last()
var lastnametext=lastname.text()
    if (lastnametext=="重点人群累计健档人数") {
        lastname.click();
    };*/
}


//日期
var animateColumnday = function(data, divId) {
    var dataArray = fetchDataForColumntimeday(data);
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
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    distance: 0,
                    rotation: -90,
                    align: 'top',
                    x: 4,
                    y: 0,
                    formatter: function() {
                        return this.y;
                    }
                },
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
        name = '全部',
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
            type: 'column',
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
                    enabled: true,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return this.y;
                    }
                }
            },
            series: {
                            events: {
                                //控制图标的图例legend不允许切换
                                legendItemClick: function (event) {                                    
                                    return false; //return  true 则表示允许切换
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
            color: 'white',
            events: {
                //控制图标的图例legend不允许切换
                legendItemClick: function (event) {                                    
                    return false; //return  true 则表示允许切换
                }
            }
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
var fetchDataForPieyy = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('月' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '上一年度末常住人口总数' !== key && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key && '诊疗人次合计数' !== key && '处方总数' !== key && '医疗收入合计' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}

var fetchDataForPiedd = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('日期' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '上一年度末常住人口总数' !== key && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key && '诊疗人次合计数' !== key && '处方总数' !== key && '医疗收入合计' !== key) {
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



var fetchDataForColumntime = function(data) {
    var dataArray = []; 
    var data1 = [];
    var data2 = [];
    var keyArray = [];
    $.each(data[0], function(key, value) {
        if ('月' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key) {
            keyArray.push(key);
        }
    });
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
                if ('月' === key) {
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
var fetchDataForColumntimeday = function(data) {
    var dataArray = []; 
    var data1 = [];
    var data2 = [];
    var keyArray = [];
    
    $.each(data[0], function(key, value) {
        if ('日期' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key) {
            keyArray.push(key);
        }
    });
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
                if ('日期' === key) {
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
        return parseInt(parseInt(data).toFixed(4));
    } else if (isDouble.test(data)) {
        return parseFloat(parseFloat(data).toFixed(4));
    } else {
        return data.toFixed(4);
    }
}








