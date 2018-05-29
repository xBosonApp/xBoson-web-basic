//柱形图
function reCallbackColumn(retData, type, divId) {
    var type='column';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        //animatePie(retData.dataMap.dataAll, divId);
        //animateColumnday(retData.dataMap.data, divId);
        animateColumnTt(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt(retData,divId);
    }
}
//条形图
function reCallbackBar(retData, type, divId) {
    var type='bar';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        animateBarTt(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt(retData,divId);
    }
}
//饼图
function reCallbackPic(retData, type, divId) {
    var type='pie';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        animatePieTt(retData.dataMap.dataAll, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt(retData,divId);
    }
}
//折线图
function reCallbackSpline(retData, type, divId) {
    var type='spline';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        reCallbackSplineTt(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt(retData,divId);
    }
}

//无数据提示
function emptyDataTt(retData, divId){
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






//柱形图--无钻取
var animateColumnTt = function(data, divId) {
   var dataArray = fetchDataForColumnTt(data);
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
                }/*,
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
                }*/
            }
        },
        credits: 0,
        series:dataArray[1]
    });
}
//条形图
var animateBarTt = function(data, divId) {
   var dataArray = fetchDataForColumnTt(data);
    $(divId).highcharts({
        chart: {
            type: 'bar'
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
        credits: 0,
        series:dataArray[1]
    });
}
//饼形图
var animatePieTt = function(data, divId) {
    var dataArray = fetchDataForPieTt(data[0]);
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
//折线图
var reCallbackSplineTt = function(data, divId) {
    var dataArray = fetchDataForColumntimedayTt(data);
    $(divId).highcharts({
        chart: {
            //type: 'spline'
            type: 'line'
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
                /*dataLabels: {
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
                },*/
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















//圆形---数据
var fetchDataForPieTt = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('机构' !== key  && '社区' !== key && '居委会' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}
//柱形---数据
var fetchDataForColumnTt = function(data) {
    var dataArray = []; 
    var data1 = [];
    var data2 = [];
    var keyArray = [];
    $.each(data[0], function(key, value) {
        if ('机构' !== key  && '社区' !== key  &&  '居委会' !== key  &&  '年' !== key) {
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
                if ('机构' === key  || '社区' === key || '居委会' === key || '年' === key) {
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
//折线图---数据
var fetchDataForColumntimedayTt = function(data) {
    var dataArray = []; 
    var data1 = [];
    var data2 = [];
    var keyArray = [];
    
    $.each(data[0], function(key, value) {
        if ('机构' !== key  && '社区' !== key  &&  '居委会' !== key  &&  '年' !== key) {
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
                if ('机构' === key  && '社区' === key || '居委会' === key || '年' === key) {
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
        //return parseInt(formatnumber(parseInt(data),2));
        return parseInt(parseInt(data).toFixed(2));
    } else if (isDouble.test(data)) {
        //return parseFloat(formatnumber(parseFloat(data),2));
        return parseFloat(parseFloat(data).toFixed(2));
    } else {
        //return formatnumber(data,2);
        return data.toFixed(2);
    }
}








