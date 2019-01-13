
// (function($) {

//   var color = {
//     red : '#CC3300',
//     black : '#000000',
//     lightred : '#CC6600',
//     white: '#FFFFFF'
//   }

//   var tools = {
//     getData : function(req_model, _success, _nodata_cb) {
//       var thiz = this;
//       var parm = $.extend({}, req_model.r_parm);

//       var _cb = function(msg) {
//         if (msg) {
//           _success && _success(msg);
//         } else {
//           _nodata_cb && _nodata_cb(msg);
//         }
//       };

//       zy.g.am.mod = req_model.mod;
//       zy.g.am.app = req_model.app;
//       zy.net.get("api/" + req_model.api, _cb, parm);
//     },

//     buildUuid : function() {
//       var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
       
//       Math.uuid = function(len, radix) {  
//         var chars = CHARS, uuid = [], i;
//         radix = radix || chars.length;
//         if (len) {  
//           for ( i = 0; i < len; i++)
//             uuid[i] = chars[0 | Math.random() * radix];
//         } else {   
//           var r;
//           uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
//           uuid[14] = '4';
//           for ( i = 0; i < 36; i++) {  
//             if (!uuid[i]) {   
//               r = 0 | Math.random() * 16;
//               uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];     
//             }              
//           }          
//         }      
//         return uuid.join('');
//       };

//       Math.uuidFast = function() {
//         var chars = CHARS, uuid = new Array(36), rnd = 0, r;
//         for (var i = 0; i < 36; i++) {       
//           if (i == 8 || i == 13 || i == 18 || i == 23) {      
//             uuid[i] = '-';
//           } else if (i == 14) {          
//             uuid[i] = '4';
//           } else {         
//             if (rnd <= 0x02)
//               rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
//             r = rnd & 0xf;
//             rnd = rnd >> 4;
//             uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
//           }
//         }
//         return uuid.join('');
//       };
       
//       Math.uuidCompact = function() {  
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {     
//           var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//           return v.toString(16);
//         });
//       };
//       return Math.uuid();
//     },

//     spliceArr : function(data) {
//       var arr = data.split('##');
//       return {
//         channelnm : arr[0],
//         channeldata : arr[1],
//         changetime : arr[2],
//         defcolor : arr[3],
//         onoffcol : arr[4]
//       }
//     },

//     checkKey : function(_key) {
//       var arr = ['sitenm', 'zonenm', 'datatime'];
//       for (i in arr) {
//         if (arr[i] == _key)
//           return true;
//       }
//       return false;
//     },

//     buildLabel : function(str) {
//       var jqStr = '<' + str + '></' + str + '>';
//       return $(jqStr);
//     },

//     delOther : function(arr){
//       $.each(arr, function(i,v) {
//         $.each(v, function(ii,vv) {
//           delete v.sitecd
//         });
//       });
//     },

//     regexp : function(str){
//       return str.replace(/\(|\)|\"|\'|\&|\\|\<|\>|\{|\}/g,'');
//     },

//     showNull : function(str){
//       return str != '--' ? str : '-';
//     },

//     buildTestData : function(obj,rowNum) {
//       var result = $.extend({}, obj);
//       if(!result.tabledata[0])
//       return;
//       var start = result.tabledata.length;
//       for(var i = start ;i<rowNum - start;i++){
//         result.tabledata.push(result.tabledata[0]);
//       }
//       return result;
//     }
//   };

//   var event = {


//     onChange : function(cData,cb, obj, channelMod) {
//       var jqStr = '[name='+ cData.key +']';
//       var tr = obj.find(jqStr).closest('tr');
//       var datatd = obj.find(jqStr).closest('td');
//       var timetd = obj.find(jqStr).closest('td').siblings('td:last');
//       var time = new Date(Number(cData.datetimes) * 1000).toFormat('yyyy-MM-dd hh:mm:ss');
//       obj.find(jqStr).html(cData.value);
//       timetd.html(time);
//       channelMod[cData.key].data = cData.value;
//       channelMod[cData.key].time = time;
//       event.checkTime(obj,channelMod[cData.key],cb);
//     },

//     checkTime : function(wid,obj,cb) {
//       var str = '[name=' + obj.name + ']';
//       wid.find(str).closest('td').css('color',(obj.defcolor == '--') ? color.black : obj.defcolor);
//       wid.find(str).closest('td').css('background-color','transparent');
//       if (obj.timeoutid)
//         clearTimeout(obj.timeoutid);
//       obj.timeoutid = setTimeout(function() {
//         wid.find(str).closest('td').css('background-color',color.red);
//         wid.find(str).closest('td').css('color',(obj.chacolor == '--') ? color.white : obj.chacolor);
//         cb && cb(obj);
//       }, obj.outTime || 60000);
//     },

//     cancelAll : function(obj){
//       $.each(obj, function(i,v) {
//         clearTimeout(v.timeoutid);
//       });
//     }
//   };

//   function _buildHander(hander) {

//     function _class(id, apiInfo, ready_cb) {

//       var channelMod, table, widObject = null;
//       //根据数据源创造数据模型
//       function _modal() {

//         //根据数据通道标识创建key 使用obj[name]检索通道

//         function buildChannelModal(tabledata) {
//           var obj = {};
//           $.each(tabledata, function(i, v) {
//             $.each(v, function(ii, vv) {
//               if (!tools.checkKey(ii)) {
//                 var arr = tools.spliceArr(vv);
//                 if (arr.channelnm != '--') {
//                   obj[arr.channelnm] = {
//                     name : arr.channelnm,
//                     data : arr.channeldata,
//                     time : arr.changetime,
//                     timeoutid : '',
//                     defcolor : arr.defcolor,
//                     chacolor : arr.onoffcol
//                   }
//                 }
//               }
//             });
//           })
//           return obj;
//         }

//         return {
//           buildChannelModal : buildChannelModal
//         }
//       }

//       //控制器
//       function _controller() {

//         function _chnOutTime(_arr) {
//           $.each(_arr, function(i, v) {
//             if(channelMod[v.channelsn])
//               channelMod[v.channelsn].outTime = (Number(v.catchcyc) * 60 + 10) * 1000;
//           });
//         }

//         //页面事件控制
//         function _On(){
//           var timeId = null;
//           $('[name=dySco]').unbind('click');
//           $('[name=dySco]').click(function(){
//             var step = $('[name=step]').val();
//             if(step == ''){
//               zy.ui.msg('提示信息','请输入速度','w');
//               return false;
//             }
//             if(!timeId){
//               $(this).html('停止');
//               timeId = _dyScroll(widObject.scrollTop(),step);
//             } else{
//               $(this).html('开始');
//               clearInterval(timeId);
//               timeId = null;
//             }
//           })
//         }

//         function _show(){
//           var trueHeight = widObject.find('tbody').css('height').replace(/px/g,'');
//           var showHieght = widObject.css('height').replace(/px/g,'');
//           console.log(trueHeight +'  '+showHieght);
//           if(Number(trueHeight) > Number(showHieght)){
//             $('[name=colCon]').show();
//             _On();
//           }
//         }

//         //动态滚动条
//         function _dyScroll(start, step) {
//           if (Number(step) == NaN || parseInt(step) <= 0){
//             zy.ui.msg('提示信息', '请输入有效数字', 'w');
//             return
//           }
//           var _step = parseInt(step);
//           var scrollEnd = start - _step;
//           var scrollStart = start;
//           var obj = widObject;
//           var timeId = setInterval(function() {
//             if (scrollStart - scrollEnd != _step) {
//               scrollStart = 0;
//               scrollEnd = 0 - _step;
//             }
//             obj.scrollTop(scrollStart);
//             scrollStart += _step;
//             scrollEnd = obj.scrollTop();
//           }, 1000);
//           return timeId;
//         }

//         //表格初始化
//         function _initTable(data, _id) {
//           $('#' + id).empty();
//           var _data = data;
//           var mod = _modal();
//           var con = _view(_id);
//           tools.delOther(_data.tabledata);
//           if (table || channelMod) {
//             event.cancelAll(channelMod);
//             table = null;
//             channelMod = null;
//           }
//           if (_data.tabledata && _data.tabledata.length > 0) {
//             channelMod = mod.buildChannelModal(_data.tabledata);
//             table = con.buildDataTable(_data, con.tableCon);
//             _chnOutTime(_data.channeldate);
//             _stTimeCheck(channelMod);
//           }else{
//             zy.ui.msg('提示','接口出错','e');
//           }
//         }

//         //websocket匹配
//         function _match(arr, cb) {
//           console.log(arr);
//           $.each(arr, function(i, v) {
//             if (channelMod[v.key]) {
//               event.onChange(v, cb, widObject, channelMod);
//             }
//           });
//         }

//         //过期检测
//         function _stTimeCheck(obj) {
//           $.each(obj, function(i, v) {
//             event.checkTime(widObject,v);
//           });
//         }

//         return {
//           initTable : _initTable,
//           match : _match,
//           eventOn : _show
//         }
//       }

//       //DOM接口
//       function _view(id) {
//         var widCon = null;
//         var tableCon = tools.buildLabel('table').attr('id', tools.buildUuid());
//         widCon = $('#' + id);
//         widCon.append(tableCon);
//         mangeClass(widCon);
//         widObject = widCon;

//         function genId(oldId) {
//           var newId, tableCon
//           newId = tools.buildUuid();
//           tableCon = $('#' + oldId).attr('id', newId);
//           return tableCon;
//         }

//         function mangeClass(obj) {
//           obj.addClass('dataTables_wrapper');
//           obj.children('table').addClass('table table-bordered table-striped');
//         }

//         function DynamicWidth() {
//           $('tbody tr:eq(0) td').each(function(i, v) {
//             $('.tableHead th').eq(i).css('width', $(v).css('width'));
//           })
//         }

//         function _buildDataTable(data, tableCon) {

//           function _delClass(){
//             widObject.find('tbody td').css('background-color','transparent');
//             widObject.find('tbody [rowspan]').css({
//               'text-align' : 'center',
//               'vertical-align' : 'middle'
//             });
//             $('.tableHead th').css({
//               'text-align' : 'center',
//               'vertical-align' : 'middle'
//             });
//           }

//           function buildIndex() {
//             $.each(widCon.find('tbody td[rowspan]'), function(i, v) {
//               var str = '<td rowspan=' + $(v).attr('rowspan') + '>' + (i + 1) + '</td>'
//               $(v).before(str);
//             })
//           }

//           function colMerge() {
//             function merge(arr, num) {
//               $.each(arr, function(i, v) {
//                 if (i == 0) {
//                   $(v).closest('td').attr('rowspan', arr.length);
//                   $(v).closest('td').siblings('td:first').attr('rowspan', arr.length).html(num);
//                 } else {
//                   $(v).closest('td').siblings('td:first').remove();
//                   $(v).closest('td').remove();
//                 }
//               });
//             }

//             var index = 1;
//             $.each(tArr, function(i, v) {
//               var str = '[name=' + v + ']';
//               merge(widCon.find(str), index);
//               index++;
//             });
//           }

//           if (!data || !tableCon)
//             return;

//           function tablehead(tableCon) {
//             var div = $('<div></div>').addClass('row').attr('id','header_con');
//             var table = $('<table></table>');
//             div.append(table);
//             var thead = $('<thead></thead>');
//             var td = $('<td></td>');
//             var tr = $('<tr></tr>');
//             tr.addClass('tableHead');
//             tr.append('<th>序号</th>');
//             var arr = {};
//             $.each(data.tabletitle[0], function(i, v) {
//               var th = $('<th></th>');
//               th.html(v);
//               tr.append(th);
//               thead.append(tr);
//               arr[i] = true;
//             });
//             table.append(thead);
//             tableCon.parent().before(div);
//             tablebody(arr,tableCon);
//           }

//           function tablebody(arr,tableCon) {
//             var tbody = $('<tbody></tbody>');

//             function tabletr(k) {
//               var tr = $('<tr></tr>');
//               tr.append('<td></td>');
//               $.each(data.tabledata[k], function(i, v) {
//                 if (arr[i]) {
//                   var td = $('<td></td>');
//                   if (i != 'zonenm' && i != 'datatime' && i != 'sitenm') {
//                     var obj = tools.spliceArr(v);
//                     td.append('<div name=' + obj.channelnm + '>' + tools.showNull(obj.channeldata) + '</div>');
//                   } else {
//                     if (i == 'sitenm') {
//                       var nm = tools.regexp(v)
//                       if (!tArr[nm])
//                         tArr[nm] = nm;
//                       td.append('<div name=' + nm + '>' + v + '</div>');
//                     } else {
//                       td.html(v);
//                     }
//                   }
//                   tr.append(td);
//                   td.css('width',$('#header_con th').eq(td.index()).css('width'));
//                 }
//               });

//               tbody.append(tr);
//             }

//             $.each(data.tabledata, function(i, v) {
//               tabletr(i);
//             });
//             tableCon.append(tbody);

//             $('.tScroll').resize(function() {
//               $('tbody tr:eq(0) td').each(function(i, v) {
//                 $('.tableHead th').eq(i).css('width', $(v).css('width'));
//               })
//             })
//           }

//           var tArr = {};
//           tablehead(tableCon);
//           colMerge();
//           _delClass();

//           DynamicWidth();
//           return tableCon
//         }

//         return {
//           widCon : widCon,
//           tableCon : tableCon,
//           buildDataTable : _buildDataTable
//         }
//       }

//       //入口
//       function _init(id, apiInfo, ready_cb) {
//         $('#header_con').remove();
//         $('#' + id).children().empty();
//         tools.getData(apiInfo, function(msg) {
//           if (msg.tabledata && msg.tabledata.length > 0 && msg.channeldate && msg.channeldate.length > 0 ) {
//             var c = _controller();
//             c.initTable(msg, id);
//             c.eventOn();
//             ready_cb && ready_cb({
//               wbs : _wbs
//             });
//           }else{
//             zy.ui.msg('提示','无数据','w');
//             $('[name=search]').button('reset');
//           }
//         })
//       }

//       //websocket数据入口
//       function _wbs(arr, cb) {
//         console.log(arr);
//         function _cObj(arr){
//           var _a = []
//           if ($.isArray(arr)) {
//             $.each(arr, function(i, v) {
//               _a[i] = JSON.parse(v);
//             });
//           }else{
//             _a[0] = JSON.parse(arr.datas);
//           }
//           return _a;
//         }
//         var c = _controller();
//         c.match(_cObj(arr), cb);
//       }

//       _init(id, apiInfo, ready_cb);

//     }

//     hander && hander({
//       init : _class
//     })
//   }

//   $.fn.factData = {
//     buildHander : _buildHander
//   }

// })(jQuery);
