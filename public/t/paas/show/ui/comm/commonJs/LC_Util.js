
/*以下做添加*/


function LC_SetData(formid,data,id)
{
	if($("#"+formid).find("#"+id).get(0)!=undefined){
		if($("#"+formid).find("#"+id).get(0).tagName!="INPUT"){	
    		if($("#"+formid).find("#"+id).get(0).tagName=="SELECT")
    		{
    		    $("#"+formid).find("#"+id).val(data==null?"false":data);
    		}
    		else{
		      $("#"+formid).find("#"+id).val(data);
		    }	    
		}else
		{
			$("#"+formid).find("#"+id).val(data);
					}
	}
}

/*添加结束*/
/* 增加日期的格式化输出 */
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// map赋值
function LC_SetMapData(formid,mapData){
  $.each(mapData, function(key, value){
	  if(value!=null&&value!="null"&&value!=undefined&&value!="undefined"){
		  if($("#"+formid).find("#"+key).get(0)!=undefined){
			 if($("#"+formid).find("#"+key).get(0).tagName==="SELECT"||
				 $("#"+formid).find("#"+key).get(0).tagName==="INPUT"||
				 $("#"+formid).find("#"+key).get(0).tagName==="TEXTAREA"){
				 if($("#"+formid).find("#"+key).attr("type")==="radio"){
				     $("#"+formid).find("input[id='"+key+"'][value="+value+"]").attr("checked",true);
				 }else if($("#"+formid).find("#"+key).attr("type")==="checkbox"){
					 var strCheck = value.split(",");
					 for(var i=0;i<strCheck;i++){
					     $("#"+formid).find("input[id='"+key+"'][value="+strCheck[i]+"]").attr("checked",true);
					 }
				 }else{
				   if($("#"+formid).find("#"+key).hasClass("Date")){
				      value = new Date(value).Format("yyyy-MM-dd");
				   }
					 $("#"+formid).find("#"+key).val(value);
				 }
			 }
			 else{
			   if($("#"+formid).find("#"+key).hasClass("Date")){
				      value = new Date(value).Format("yyyy-MM-dd");
				   }
				 $("#"+formid).find("#"+key).text(value);
			 }
		  }
	  }
  });
}
// 从mdm中生成下拉选
function LC_GetSelect(formId,controlId,infoMap,dataList){
	var str="<option value=''></option>";
	for(var i=0;i<dataList.length;i++){
		var getKey="";
		var getValue="";
	       for(var m=0;m<infoMap.get("key").length;m++){
	    	   if(getKey!=""){
	    	       getKey = getKey+infoMap.get("keySplit")+dataList[i][infoMap.get("key")[m]];
	    	   }else{
	    		   getKey = dataList[i][infoMap.get("key")[m]];
	    	   }
	       }
	       for(var k=0;k<infoMap.get("value").length;k++){
	    	   if(getValue!=""){
	    		   getValue = getValue+infoMap.get("valueSplit")+dataList[i][infoMap.get("value")[k]];
	    	   }else{
	    		   getValue = dataList[i][infoMap.get("value")[k]];
	    	   }
	       }
         　             str=str+"<option value="+getKey+">"+getValue+"</option>";
	 　　}
	    $("#"+formId).find("#"+controlId).html(str);
}
// 将从mdm方法中获取的
function LC_getDataMap(infoMap,dataList){
	var map = new Map();
		for(var i=0;i<dataList.length;i++){
			var getKey=dataList[i][infoMap.get("key")[0]];
			var getValue=dataList[i][infoMap.get("value")[0]];
	
         　 map.put(getKey,getValue);
	 　　}
   return map;
}
function LC_getMapTextValue(formid,dataList){
	for(var i=0;i<dataList.length;i++){
	  var textValue=(dataList[i][1]).get($("#"+formid).find("#"+dataList[i][0]).text());
	  
	  if(textValue==false){
	      $("#"+formid).find("#"+dataList[i][0]).text("");
	   }else{
	      $("#"+formid).find("#"+dataList[i][0]).text(textValue);
	   }
	}

}

function LC_getMapValue(key,mapData){
    var _k=$.trim(key);
   	if(mapData.get(_k)==false){
	 	return "";//"无此编码|"+key;
	 }else{
	    return mapData.get(_k);
	 }
}
//	debugger;
//	var keyList = dataList.keys();
// 
//	for(var i=0;i<keyList.length;i++){
//		alert("看看key"+keyList[i]+" 看看value="+dataList.get(keyList[i]));
//		$("#"+id).append("<option value="+keyList[i]+">"+map.get(keyList[i])+"</option>");
//	}

// list赋值
/*
function LC_SetMapData(formid,mapData){
  $.each(mapData, function(key, value){
	  if(value!=null){
		  if($("#"+formid).find("#"+key).get(0)!=undefined){
			 if($("#"+formid).find("#"+key).get(0).tagName==="SELECT"||
				 $("#"+formid).find("#"+key).get(0).tagName==="INPUT"||
				 $("#"+formid).find("#"+key).get(0).tagName==="TEXTAREA"){
				 if($("#"+formid).find("#"+key).attr("type")==="radio"){
				     $("#"+formid).find("input[id='"+key+"'][value="+value+"]").attr("checked",true);
				 }else if($("#"+formid).find("#"+key).attr("type")==="checkbox"){
					 var strCheck = value.split(",");
					 for(var i=0;i<strCheck;i++){
					     $("#"+formid).find("input[id='"+key+"'][value="+strCheck[i]+"]").attr("checked",true);
					 }
				 }else{
					 $("#"+formid).find("#"+key).val(value);
				 }
			 }
			 else{
				 $("#"+formid).find("#"+key).text(value);
			 }
		  }
	  }
  });
}//*/
// 截取字段
function LC_SubStr(str,start,end){
    return str.substring(start,end);
}

function LC_SubTextStr(formid,itemsList){
    for(var i=0;i<itemsList.length;i++){
       $("#"+formid).find("#"+itemsList[i][0]).text(((dataList[i][1]).get($("#"+formid).find("#"+dataList[i][0]).text())).substring(dataList[i][1],dataList[i][2]));
	}
}
// 文本的时间格式化yyyyMMdd
function LC_FormatTextYMD(formid,itemsList)   {  
	for(var i=0;i<itemsList.length;i++){
		var timeData=$("#"+formid).find("#"+itemsList[i]).val();
	    $("#"+formid).find("#"+itemsList[i]).val(LC_FormatYMD(timeData));
	}
}  
// 文本的时间格式化 yyyyMMddHHMMSS
function LC_FormatTextYMDHMS(formid,itemsList)   {  
	for(var i=0;i<itemsList.length;i++){
		var timeData=$("#"+formid).find("#"+itemsList[i]).val();     
	    $("#"+formid).find("#"+itemsList[i]).val(LC_FormatYMDHMS(timeData));
	}
}  
// 列表中的格式化yyyymmdd
function LC_FormatYMD(timeData)   {  
    if(timeData!=null&&timeData!=""&&timeData!=undefined){
		var d=new   Date(timeData*1);     
		var year=d.getFullYear();     
		var month=d.getMonth()+1;
		month=parseInt(month)<10?"0"+(month):(month);   
		var date=d.getDate();
		date = parseInt(date)<10?"0"+(date):date;
		return   year+"-"+month+"-"+date ;
	}else {
	  return "";
	}
}  
// 列表中的格式化 yyyyMMdd HHmm   崔亮修改
function LC_FormatYMDHM(timeData)   { 
	if(timeData!=null&&timeData!=""&&timeData!=undefined){
		var d =new Date(timeData*1);     
		var year=d.getFullYear();     
		var month=d.getMonth()+1;
		month=parseInt(month)<10?"0"+(month):(month);   
		var date=d.getDate();
		date = parseInt(date)<10?"0"+(date):date;   
		var hour=d.getHours();     
		hour=parseInt(hour)<10?"0"+hour:hour;
		var minute=d.getMinutes();     
		minute=parseInt(minute)<10?"0"+minute:minute;
		var second=d.getSeconds();
		second=parseInt(second)<10?"0"+second:second;
		return   year+"-"+month+"-"+date+" "+hour+":"+minute;
	}else {
	  return "";
	}

//	var tt=new Date(parseInt(timeData) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
//	 $("#form1").find("#username").text(tt);
//	return tt;
}
// 列表中的格式化 yyyyMMdd HHmmss
function LC_FormatYMDHMS(timeData)   { 
	if(timeData!=null&&timeData!=""&&timeData!=undefined){
		var d =new Date(timeData*1);     
		var year=d.getFullYear();     
		var month=d.getMonth()+1;
		month=parseInt(month)<10?"0"+(month):(month);   
		var date=d.getDate();
		date = parseInt(date)<10?"0"+(date):date;   
		var hour=d.getHours();     
		hour=parseInt(hour)<10?"0"+hour:hour;
		var minute=d.getMinutes();     
		minute=parseInt(minute)<10?"0"+minute:minute;
		var second=d.getSeconds();
		second=parseInt(second)<10?"0"+second:second;
		return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	}else {
	  return "";
	}

//	var tt=new Date(parseInt(timeData) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
//	 $("#form1").find("#username").text(tt);
//	return tt;
}
// 随机数
function MathRand(n) 
{ 
	var Num=""; 
	for(var i=0;i<n;i++) 
	{ 
	  Num+=Math.floor(Math.random()*10); 
	} 
	return Num;
} 



//写Cookies 
function SetCookie(name,value) {
  var argv=SetCookie.arguments; 
  var argc=SetCookie.arguments.length; 
  var expires=(2<argc)?argv[2]:null; 
  var path=(3<argc)?argv[3]:null; 
  var domain=(4<argc)?argv[4]:null; 
  var secure=(5<argc)?argv[5]:false; 
  document.cookie=name+"="+escape(value)+((expires==null)?"":("; expires="+expires.toGMTString()))+((path==null)?"":("; path="+path))+((domain==null)?"":("; domain="+domain))+((secure==true)?"; secure":""); 
} 
//读Cookies 
function GetCookie(name) 
{ 
  var search = name + "="; 
  var returnvalue = ""; 
  if (document.cookie.length > 0) { 
    offset = document.cookie.indexOf(search); 
    if (offset != -1) { 
      offset += search.length; 
      end = document.cookie.indexOf(";", offset); 
      if (end == -1) 
        end = document.cookie.length; 
        returnvalue=unescape(document.cookie.substring(offset,end)); 
      } 
    } 
  return returnvalue; 
}
/**写Cookies: name=cookie的名子, value=值, days=将被保存的天*/
function setCookie(name,value,days){
	var exp  = new Date();	//new Date("December 31, 9998");
	exp.setTime(exp.getTime() + days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires="+exp.toGMTString();
}
/**读Cookies*/
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null) return unescape(arr[2]); return null;
}
/**删除Cookie*/
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


