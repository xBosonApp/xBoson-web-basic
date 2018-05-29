//柱形图
function reCallbackColumn2(retData, type, divId) {
    var type='column';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        //animatePie(retData.dataMap.dataAll, divId);
        //animateColumnday(retData.dataMap.data, divId);
        animateColumnTt2(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt2(retData,divId);
    }
}



//条形图
function reCallbackBar2(retData, type, divId) {
    var type='bar';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        animateBarTt2(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt2(retData,divId);
    }
}
//饼图
function reCallbackPic2(retData, type, divId) {
    var type='pie';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        animatePieTt2(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt2(retData,divId);
    }
}
//折线图
function reCallbackSpline2(retData, type, divId) {
    var type='spline';
    if(retData.dataMap.data.length > 0) {
        $(".tools").show();
        $(".loadshow").hide();
        reCallbackSplineTt2(retData.dataMap.data, divId);
    } else {
        $("#rowtable").addClass("rowtable");
        $("#lc-rowtable").removeClass("rowtable");
        $(".tools").hide();
        emptyDataTt2(retData,divId);
    }
}

//无数据提示
function emptyDataTt2(retData, divId){
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
var animateColumnTt2 = function(data, divId) {
   var dataArray = fetchDataForColumnTt2(data);
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
                    click: function(e) {
                        var street = e.point.category;
                        $('#dimOrgan option:contains(' + street + ')').each(function(){
                          if ($(this).text() == street) {
                             $(this).attr('selected', true);
                          }
                        });
                        loadingMrZyjwh();
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
var animateBarTt2 = function(data, divId) {
   var dataArray = fetchDataForColumnTt2(data);
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
var animatePieTt2 = function(data, divId) {
    var dataArray0 = fetchDataForPieTt2(data[0]);
    var dataArray1 = fetchDataForPieTt2(data[1]);
    var dataArray2 = fetchDataForPieTt2(data[2]);
    var dataArray3 = fetchDataForPieTt2(data[3]);
    var dataArray4 = fetchDataForPieTt2(data[4]);
    var dataArray5 = fetchDataForPieTt2(data[5]);
    var dataArray6 = fetchDataForPieTt2(data[6]);
    var dataArray7 = fetchDataForPieTt2(data[7]);
    var dataArray8 = fetchDataForPieTt2(data[8]);
    var dataArray9 = fetchDataForPieTt2(data[9]);
    console.log(dataArray0+"+"+dataArray1+"+"+data[0].社区+"+"+data[1].社区);
    $("#z001").text(data[0].社区);
    $("#z002").text(data[1].社区);
    $("#z003").text(data[2].社区);
    var chart;
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
                size: 180,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
					distance: 10,
					//rotation:5,
                    format: '{point.name}: <br />{point.percentage:.1f} %'
                },
				showInLegend: true,
                events: {
                    click: function(e) {
                    //alert("-------------------")
                    loadingMrZy();
                    }
                }
            }
        },
		credits: {
            enabled: !0,
            text: 'livechain.com.cn',
            href: 'http://www.livechain.com.cn'
        },
        series: [
            {
                type: 'pie',
                name: '人口比率',
                center: [100, 140],
                showInLegend:true,
                data: dataArray0
                },{
                type: 'pie',
                name: '人口比率',
                center: [300, 140],
                showInLegend:false,
                data: dataArray1
                },{
                type: 'pie',
                name: '人口比率',
                center: [500, 140],
                showInLegend:false,
                data: dataArray2
                }






        /*{
            type: 'pie',
            name: '',
            data: dataArray
        }*/]
    },function(chart) {
            
        $(chart.series[0].data).each(function(i, e) {
            e.legendItem.on('click', function(event) {
                var legendItem=e.name;
                
                event.stopPropagation();
                
                $(chart.series).each(function(j,f){
                       $(this.data).each(function(k,z){
                           if(z.name==legendItem)
                           {
                               if(z.visible)
                               {
                                   z.setVisible(false);
                               }
                               else
                               {
                                   z.setVisible(true);
                               }
                           }
                       });
                });
                
            });
        });
    });

    
}
//折线图
var reCallbackSplineTt2 = function(data, divId) {
    var dataArray = fetchDataForColumntimedayTt2(data);
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
var fetchDataForPieTt2 = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('机构' !== key  && '社区' !== key && '居委会' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}
//柱形---数据
var fetchDataForColumnTt2 = function(data) {
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
var fetchDataForColumntimedayTt2 = function(data) {
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








