function reCallback(retData, type, divId) {
    if(retData !== null && retData !== undefined && type !== null && type !== undefined) {
        if('pie' === type) {
            animatePie(retData.dataMap.dataAll, divId);
        } else {
            animateColumn(retData.dataMap.data, divId);
        }
    } else {
        alert("Unexpecting Error");
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
                }
            }
        },
		credits: 0,
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
		credits: 0,
        series:dataArray[1]
    });
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




