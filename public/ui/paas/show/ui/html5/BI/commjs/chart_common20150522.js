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
                animateDrilldowmColumn(retData.dataMap.data, divId);
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
                rotation: -75,
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
                    rotation: -75,
                    align: 'top',
                    x: 4,
                    y: 0,
                    formatter: function() {
                        return this.y;
                    }
                },*/
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
            type: 'spline'
            //type: 'line'
        },
        title: {
            text:''
        },
        xAxis: {
            categories: dataArray[0],
            type: 'category',
            labels: {
                rotation: -75,
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
                    rotation: -75,
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


//直接显示机构，没有下转
var animateDrilldowmColumn = function(data, divId) {
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
                rotation: -75,
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
        /*tooltip: {
            pointFormat: '<b>{point.y:,.of}</b><br/>({series.name})'
        },*/
        tooltip: {
            headerFormat: '<b style="font-size:10px">{point.key}</b><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.of} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
                    rotation: -75,
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




//圆形---机构
var fetchDataForPie = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('机构' !== key && '社区' !== key && '专病门诊人数' !== key && '专科门诊人数' !== key && '特需门诊人数' !== key && '退号人数' !== key && '体检人次' !== key && '体检人次数' !== key && '挂号人次数' !== key && '住院诊断数' !== key && '诊断总数' !== key && '当值医生数量' !== key && '出院病人床日' !== key && '平均占床日' !== key && '留观入院人数' !== key && '留观出院人数' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key && '人均处方数' !== key && '门诊医生工作量' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}
//圆形---月份
var fetchDataForPieyy = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('月' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '上一年度末常住人口总数' !== key && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key && '诊疗人次合计数' !== key && '处方总数' !== key && '医疗收入合计' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key) {
            dataArray.push([key, parseData(data[key])]);
        }
    }
    return dataArray;
}
//圆形---日期
var fetchDataForPiedd = function(data) {
    var dataArray = [];
    for (var key in data) {
        if ('日期' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '上一年度末常住人口总数' !== key && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key && '诊疗人次合计数' !== key && '处方总数' !== key && '医疗收入合计' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key) {
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
        if ('机构' !== key && '社区' !== key && '专病门诊人数' !== key && '专科门诊人数' !== key && '特需门诊人数' !== key && '退号人数' !== key && '体检人次' !== key && '体检人次数' !== key && '挂号人次数' !== key && '住院诊断数' !== key && '诊断总数' !== key && '当值医生数量' !== key && '出院病人床日' !== key && '平均占床日' !== key && '留观入院人数' !== key && '留观出院人数' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key  && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）'  !== key && '应管理人数（高血压）' !== key && '人均处方数' !== key && '门诊医生工作量' !== key) {
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
                if ('机构' === key || '社区' === key) {
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
        if ('月' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key  && '应管理人数（精神病）' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key) {
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
        if ('日期' !== key && '重点人群累计健档人数' !== key && '建档管理累计人数（糖尿病）' !== key && '建档管理累计人数（精神病）' !== key && '建档管理累计人数（高血压）' !== key && '累计规范建档率' !== key && '纸制档案累计人数' !== key && '纸制累计建档率' !== key && '计算机档案规范管理累计人数' !== key && '健康管理人数（儿童）' !== key && '健康（规范）管理人数' !== key && '上一年度末常住人口总数' !== key && '中医药健康管理人数' !== key  && '应管理人数（糖尿病）' !== key && '应管理人数（高血压）' !== key) {
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


/*function formatnumber(value, num){
     var a, b, c, i;
     a = value.toString();
     b = a.indexOf(".");
     c = a.length;
     if (num == 0) {
         if (b != -1) {
             a = a.substring(0, b);
         }
     } else {//如果没有小数点
         if (b == -1) {
             a = a + ".";
             for (i = 1; i <= num; i++) {
                 a = a + "0";
             }
         } else {//有小数点，超出位数自动截取，否则补0
             a = a.substring(0, b + num + 1);
             for (i = c; i <= b + num; i++) {
                 a = a + "0";
             }
         }
     }
     return a;
 }*/


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








