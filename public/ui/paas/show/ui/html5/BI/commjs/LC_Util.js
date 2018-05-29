
// 字典分割字符串;
var dictSplit = "";
var staSplit = "";
var chOrgSplit = "";
var OrgSplit = "";
var dictcallback = "";
var stacallback = "";
var chOrgcallback = "";
var Orgcallback = "";
var deptcallback="";
var deptSplit=""
var allOrgcallback="";

var retDicData= new Map();
var sys_items="";

//var retDicData="";
/*以下做添加*/


function sys_SetData(formid,data,id)
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


// map赋值
function sys_SetMapData(formid,mapData){
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
					 for(var i=0;i<strCheck.length;i++){
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
}
// 从mdm中生成下拉选
function sys_GetSelect(formId,controlId,infoMap,dataList,flg){
    
	var str="";
	//if(flg=="0"){
	    //str="<option value=''></option>";
	//}else 
	if(flg=="1"){
	}else if(flg=="2"){
	    str="<option value=''></option>";
	}else if(flg=="3"){
	   str="<option value=''>全部</option>"; 
	}else if(flg=="4"){
	   str="<option value=''>请选择</option>"; 
	}
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

// 生成复选框
function sys_GetCheckBox(divId,controlId,infoMap,dataList,flg){
  
	var str="";
	if(flg=="0"){
	    //str="<option value=''></option>";
	}
	//else if(flg=="1"){
	//    str="<input type='checkbox' value='' id='' name=''/>";
	//}else if(flg=="2"){
	//    str="<input type='checkbox' value='' id='' name=''/>";
	//}else if(flg=="3"){
	//    str="<input type='checkbox' value='' id='' name=''/>";
	//}
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
         　str=str+"<input type='checkbox' value='"+getKey+"' id='"+controlId+"' name='"+controlId+"' />"+getValue+"&nbsp;&nbsp;";
	}
	 $("#"+divId).html(str);

}
// 将从mdm方法中获取的
function sys_getDataMap(infoMap,dataList){
	var map = new Map();
		for(var i=0;i<dataList.length;i++){
			var getKey=dataList[i][infoMap.get("key")[0]];
			var getValue=dataList[i][infoMap.get("value")[0]];
	
         　 map.put(getKey,getValue);
	 　　}
   return map;
}
function sys_getMapTextValue(formid,dataList){
	for(var i=0;i<dataList.length;i++){
	  var textValue=(dataList[i][1]).get($("#"+formid).find("#"+dataList[i][0]).text());
	  
	  if(textValue==false){
	      $("#"+formid).find("#"+dataList[i][0]).text("");
	   }else{
	      $("#"+formid).find("#"+dataList[i][0]).text(textValue);
	   }
	}

}

function sys_getMapValue(key,mapData){
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
function sys_SetListData(formid,mapData){
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
}
// 截取字段
function sys_SubStr(str,start,end){
    return str.substring(start-1,end-1);
}
//非文本框批量截取处理
function sys_SubTextStrList(formid,itemsList,start,end){
    for(var i=0;i<itemsList.length;i++){
       $("#"+formid).find("#"+itemsList[i][0]).text($("#"+formid).find("#"+dataList[i][0]).text().substring(start-1,end));
	}
}
//非文本框单个截取处理
function sys_SubTextStr(formid,id,start,end){
       $("#"+formid).find("#"+id).text($("#"+formid).find("#"+id).text().substring(start-1,end));
}
//文本框批量截取处理
function sys_SubValStrList(formid,itemsList,start,end){
    for(var i=0;i<itemsList.length;i++){
       $("#"+formid).find("#"+itemsList[i][0]).val($("#"+formid).find("#"+dataList[i][0]).val().substring(start-1,end));
	}
}
//文本框单个截取处理
function sys_SubValStr(formid,id,start,end){
       $("#"+formid).find("#"+id).val($("#"+formid).find("#"+id).val().substring(start-1,end));
}
// 文本的时间格式化yyyyMMdd
function sys_FormatTextYMD(formid,itemsList)   {  
	for(var i=0;i<itemsList.length;i++){
		var timeData=$("#"+formid).find("#"+itemsList[i]).val();
	    $("#"+formid).find("#"+itemsList[i]).val(sys_FormatYMD(timeData));
	}
}  
// 文本的时间格式化 yyyyMMddHHMMSS
function sys_FormatTextYMDHMS(formid,itemsList)   {  
	for(var i=0;i<itemsList.length;i++){
		var timeData=$("#"+formid).find("#"+itemsList[i]).val();     
	    $("#"+formid).find("#"+itemsList[i]).val(sys_FormatYMDHMS(timeData));
	}
}  
// 文本的时间格式化 yyyyMMddHHMMS
function sys_FormatTextYMDHM(formid,itemsList)   {  
	for(var i=0;i<itemsList.length;i++){
		var timeData=$("#"+formid).find("#"+itemsList[i]).val();     
	    $("#"+formid).find("#"+itemsList[i]).val(sys_FormatYMDHM(timeData));
	}
}  
// 列表中的格式化yyyymmdd
function sys_FormatYMD(timeData)   {  
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
// 列表中的格式化 yyyyMMdd HHmm   
function sys_FormatYMDHM(timeData)   { 
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
function sys_FormatYMDHMS(timeData)   { 
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

/**
 * 获取弹出窗口url值.
 * 返回map格式 
 * 创建时间2013-12-09
 * 创建人：jiaRC 
 */
function sys_getOpenUrl(){
    //var url = parent.$("#openRoleDiv").attr("href");
	var url = $("#openRoleDiv").attr("href");
    var arrStr = url.substring(url.indexOf("?")+1).split("&");
    var infoUrl=new Map();
    for(var i =0;i<arrStr.length;i++){
        var key = arrStr[i].substring(0,arrStr[i].indexOf("="));
		var value=arrStr[i].substring(arrStr[i].indexOf("=")+1);
		infoUrl.put(key,value);
	}
	return infoUrl;
}
/**
 * 获取iframe传入的参数值.
 * 返回map格式 
 * 创建时间2013-12-09
 * 创建人：jiaRC 
 */
function sys_getIframeOpenUrl(id){
    var url = parent.$("#"+id).attr("src");
    var arrStr = url.substring(url.indexOf("?")+1).split("&");
    var infoUrl=new Map();
    for(var i =0;i<arrStr.length;i++){
        var key = arrStr[i].substring(0,arrStr[i].indexOf("="));
		var value=arrStr[i].substring(arrStr[i].indexOf("="));
		infoUrl.put(key,value);
	}
   return infoUrl;
}


//获取弹出窗口url值.

function sys_getOpenUrl(){
    //var url = parent.$("#openRoleDiv").attr("href");
	var url = $("#openRoleDiv").attr("href");
    var arrStr = url.substring(url.indexOf("?")+1).split("&");
    var infoUrl=new Map();
    for(var i =0;i<arrStr.length;i++){
        var key = arrStr[i].substring(0,arrStr[i].indexOf("="));
		var value=arrStr[i].substring(arrStr[i].indexOf("=")+1);
		infoUrl.put(key,value);
	}
	return infoUrl;
}

//弹出页传值
function sys_setDataInfo(data){
    sys_LS.set("sysDataInfo",JSON.stringify(data));
}
// 弹出页得值
function sys_getDataInfo(){
    return JSON.parse(sys_LS.get("sysDataInfo"));
}
//登陆用户信息设置
function sys_setUserInfo(data){
    sys_LS.set("sysUserDataInfo",JSON.stringify(data));
}
//登陆用户信息获取
function sys_getUserInfo(){
   return JSON.parse(sys_LS.get("sysUserDataInfo"));
   //var userMap=new Map();
   //userMap.put("orgId","ac81760208964450a39de3e60d15dc6e");
   //userMap.put("staffId","456");
   //return userMap;
}
//获取iframe传入的参数值.

function sys_getIframeOpenUrl(id){
    var url = parent.$("#"+id).attr("src");
    var arrStr = url.substring(url.indexOf("?")+1).split("&");
    var infoUrl=new Map();
    for(var i =0;i<arrStr.length;i++){
        var key = arrStr[i].substring(0,arrStr[i].indexOf("="));
		var value=arrStr[i].substring(arrStr[i].indexOf("="));
		infoUrl.put(key,value);
	}
   return infoUrl;
}


/**
 *  
 *  根据传入的字典编号获取对应集合
 *  参数说明 callback:回调函数名，info要查询的字典集合
 *  创建时间2013-12-10
 *  创建人：jiarc
 *
 */
 
function sys_getDictList(callback,info){
    dictcallback=callback;
    dictSplit="";
	//retDicData=new Map();
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var map= new Map();
	var strs= new Array(); 
	strs=info.get("split").split(",");
	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|dict|"+strs[i])==undefined){
		    if(dictSplit!=""){
		        dictSplit=dictSplit+","+strs[i];
		    }else{
			    dictSplit=strs[i];
			}
		}
		//jiarc屏蔽误删
	    //if(sys_LS.get(strs[i])!=undefined){
		//debugger;
		//alert(JSON.parse(sys_LS.get(ymd+"|"+strs[i]))[0]["typeName"]);
	    //retDicData.put(strs[i],JSON.parse(sys_LS.get(ymd+"|"+strs[i])));
	    //sys_LS.set(strs[i],JSON.parse(sys_LS.get(strs[i])));
	    //}
	    // JSON.stringify();
		// document.write(strs[i]+"<br/>");    //分割后的字符输出
	} 

	if(dictSplit!=""){
		var url="VA000402";
		var infoa = new Map();
		infoa.put("sqlid","selectByYearAndcode1");
		infoa.put("stringsplit",dictSplit);
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_dictSelectd",infoa,itemsList);
	}else{
	    //this.fun = new Function(dictcallback+"('"+retDicData+"');");
		 this.fun = new Function(dictcallback+"();");
         this.fun();
	}

}

function sys_dictSelectd(data){

	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=dictSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        // jiarc屏蔽误删	
         sys_LS.set(ymd+"|dict|"+strs[i],JSON.stringify(data.dataMap[strs[i]]));
		// retDicData.put(strs[i],data.dataList[strs[i]]);
		//sys_LS.set(strs[i],JSON.stringify(data.dataList[strs[i]]));
	}
	//this.fun = new Function(dictcallback+"('"+retDicData+"');");
	this.fun = new Function(dictcallback+"();");
    this.fun();
}
// 字典数据
function sys_getDictData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|dict|"+key));
}

function sys_getDeptList(callback,info){
    deptcallback=callback;
    deptSplit="";
	//retDicData=new Map();
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var map= new Map();
	var strs= new Array(); 
	strs=info.get("split").split(",");
	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|dept|"+strs[i])==undefined){
		    if(deptSplit!=""){
		        deptSplit=deptSplit+","+strs[i];
		    }else{
			    deptSplit=strs[i];
			}
		}
	}
	if(deptSplit!=""){
		var url="OSMS003";
		var infoa = new Map();
		infoa.put("sqlid","selectDeptByOrgId");
		infoa.put("orgid",deptSplit);
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_deptSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(deptcallback+"();");
        this.fun();
	}
}

function sys_deptSelectd(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=deptSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        // jiarc屏蔽误删	
        sys_LS.set(ymd+"|dept|"+strs[i],JSON.stringify(data.dataMap[strs[i]]));
		// retDicData.put(strs[i],data.dataList[strs[i]]);
		// sys_LS.set(strs[i],JSON.stringify(data.dataList[strs[i]]));
	}
	//this.fun = new Function(dictcallback+"('"+retDicData+"');");
	this.fun = new Function(deptcallback+"();");
    this.fun();
}

function sys_getDeptData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|dept|"+key));
}

//***************************************************************************************
    var jobcallback=callback;
    var jobSplit="";
function sys_getJobList(callback,info){
    jobcallback=callback;
    jobSplit="";
	//retDicData=new Map();
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var map= new Map();
	var strs= new Array(); 
	strs=info.get("split").split(",");
	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|job|"+strs[i])==undefined){
		    if(jobSplit!=""){
		        jobSplit=jobSplit+","+strs[i];
		    }else{
			    jobSplit=strs[i];
			}
		}
	}
	if(jobSplit!=""){
		var url="OSMS005";
		var infoa = new Map();
		infoa.put("sqlid","selectByDeptId");
		infoa.put("deptid",jobSplit);
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_jobSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(jobcallback+"();");
        this.fun();
	}
}

function sys_jobSelectd(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=jobSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        // jiarc屏蔽误删	
        sys_LS.set(ymd+"|job|"+strs[i],JSON.stringify(data.dataMap[strs[i]]));
		// retDicData.put(strs[i],data.dataList[strs[i]]);
		// sys_LS.set(strs[i],JSON.stringify(data.dataList[strs[i]]));
	}
	//this.fun = new Function(dictcallback+"('"+retDicData+"');");
	this.fun = new Function(jobcallback+"();");
    this.fun();
}

function sys_getJobData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|job|"+key));
}

//人员
function  sys_getStaList(callback,info){
    staSplit="";
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    stacallback=callback;
	var strs= new Array(); 
	strs=info.get("split").split(",");

	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|sta|"+strs[i])==undefined){
		    if(staSplit!=""){
		        staSplit=staSplit+","+strs[i];
		    }else{
			    staSplit=strs[i];
			}
		}
	} 
	if(staSplit!=""){
		var url="OSMS004";
		var infoa = new Map();
		infoa.put("orgid",staSplit);
		infoa.put("sqlid","selectByOrgId")
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_staSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}
// 人员请求回调
function sys_staSelectd(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=staSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        sys_LS.set(ymd+"|sta|"+strs[i],JSON.stringify(data.dataList));
	}
	this.fun = new Function(stacallback+"();");
    this.fun();
}
// 人员数据
function sys_getStaData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|sta|"+key));
}
//******************************************************************************
//查询所有机构
function  sys_getAllOrgList(callback,info){

	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    allOrgcallback=callback;
	if(sys_LS.get(ymd+"|allOrg")==undefined){
		var url="OSMS001";
		var infoa = new Map();
		//infoa.put("orgid",allOrgSplit);
		infoa.put("sqlid","selectAll")
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_allOrgSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}
// 查询说有机构请求回调
function sys_allOrgSelectd(data){
//alert(data.dataList);
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    sys_LS.set(ymd+"|allOrg",JSON.stringify(data.dataList));
	this.fun = new Function(allOrgcallback+"();");
    this.fun();
}
// 获取全部机构数据
function sys_getAllOrgData(){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|allOrg"));
}

//******************************************************************************

// 机构对应关系(反查)
function  sys_getChOrgList(callback,info){
    chOrgSplit="";
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    chOrgcallback=callback;
	var strs= new Array(); 
	strs=info.get("split").split(",");

	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|ChOrg|"+strs[i])==undefined){
		    if(chOrgSplit!=""){
		        chOrgSplit=chOrgSplit+","+strs[i];
		    }else{
			    chOrgSplit=strs[i];
			}
		}
	} 
	if(chOrgSplit!=""){

		var url="OSMS007";
		var infoa = new Map();
		infoa.put("sqlid","selectByChOrgId");
		infoa.put("chorgid",chOrgSplit);
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_chOrgSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}
// 反查对应关系回调
function sys_chOrgSelectd(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=chOrgSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        sys_LS.set(ymd+"|ChOrg|"+strs[i],JSON.stringify(data.dataList));

	}
	this.fun = new Function(chOrgcallback+"();");
    this.fun();
}

// 反查机构对应关系数据
function sys_getChOrgData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|ChOrg|"+key));
}




// 机构对应关系
function  sys_getOrgList(callback,info){
    OrgSplit="";
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    Orgcallback=callback;
	var strs= new Array(); 
	strs=info.get("split").split(",");

	for (var i=0; i < strs.length; i++ )   
	{   
		if(sys_LS.get(ymd+"|Org|"+strs[i])==undefined){
		    if(OrgSplit!=""){
		        OrgSplit=OrgSplit+","+strs[i];
		    }else{
			    OrgSplit=strs[i];
			}
		}
	} 
	if(OrgSplit!=""){
		var url="OSMS007";
		var infoa = new Map();
		//infoa.put("stringsplit",OrgSplit);
		infoa.put("orgid",OrgSplit);
		infoa.put("sqlid","selectByOrgId");
		var itemsList= [];
		sys_AjaxGet(MDMBaseUrl1+url,"","sys_OrgSelectd",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}
// 对应关系回调
function sys_OrgSelectd(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
	strs=OrgSplit.split(",");
	for (var i=0; i < strs.length; i++ ){  
        sys_LS.set(ymd+"|Org|"+strs[i],JSON.stringify(data.dataList));
	}
	this.fun = new Function(Orgcallback+"();");
    this.fun();
}


// 机构对应关系数据
function sys_getOrgData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|Org|"+key));
}
//动态生成
function sys_custom(divId,reData){
   sys_items="";
   var allCode="";
   var selectStr="";
   var checkStr="";
   var radioStr="";
   for(var i=0;i<reData.dataList.length;i++){
       if(reData.dataList[i]["convarchar"]==="1"){
	       var colid=reData.dataList[i].colid;
           var defvalue=reData.dataList[i].defvalue;
           var flolength=reData.dataList[i].flolength;
           var contype=reData.dataList[i].contype;
           var colname=reData.dataList[i].colname;
           var formula=reData.dataList[i].formula;
		   var minlenorval=reData.dataList[i].minlenorval;
           var maxlenorval=reData.dataList[i].maxlenorval;
		   var required=reData.dataList[i].required
		   //var formulavalue="formula";
	      allCode=allCode+'<div class="mainW-256"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div>'
          allCode=allCode+'<div class="itemRW-160"><input id="'+reData.dataList[i].colid+'" onblur="sys_customCheck(\''+divId+'\',\''+colid+'\',\''+defvalue+'\',\''+flolength+'\',\''+contype+'\',\''+colname+'\',\''+minlenorval+'\',\''+maxlenorval+'\',\''+required+'\',\''+formula+'\')" type="text" value='+defvalue+'></div></div>';
	   }
       else if(reData.dataList[i]["convarchar"]==="2"){
          selectStr="";
		  for(var m=0;m<reData.dataMap[reData.dataList[i]["colid"]].length;m++){
			  selectStr=selectStr+"<option value='"+reData.dataMap[reData.dataList[i].colid][m]["conval"]+"'>";
			  selectStr=selectStr+reData.dataMap[reData.dataList[i].colid][m]["conname"]+"</option>";
		  }
		  
		  var selectStrDiv='<div class="mainW-256"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div><div class="itemRW-160">';
		  selectStr=selectStrDiv+"<select name='"+reData.dataList[i].colid+"' id='"+reData.dataList[i].colid+"'>"+selectStr;
		  selectStr=selectStr+"</select></div></div>";
		  allCode=allCode+selectStr;
	   }else if(reData.dataList[i]["convarchar"]==="3"){
	        checkStr="";
	   	    for(var m=0;m<reData.dataMap[reData.dataList[i]["colid"]].length;m++){
			     checkStr=checkStr+"<input type='checkbox' value='"+reData.dataMap[reData.dataList[i].colid][m]["conval"]+"' id='"+reData.dataList[i].colid+"' name='"+reData.dataList[i].colid+"'/>";
			     checkStr=checkStr+reData.dataMap[reData.dataList[i].colid][m]["conname"];
		    }
			var checkStrDiv='<div class="mainW-256"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div><div class="itemRW-160">';
			checkStr=checkStrDiv+checkStr+"</div></div>";
			allCode=allCode+checkStr;
	   }else if(reData.dataList[i]["convarchar"]==="4"){
	   	    radioStr="";
	   	    for(var m=0;m<reData.dataMap[reData.dataList[i]["colid"]].length;m++){
			     radioStr=radioStr+"<input type='radio' value='"+reData.dataMap[reData.dataList[i].colid][m]["conval"]+"' id='"+reData.dataList[i].colid+"' name='"+reData.dataList[i].colid+"'/>";
			     radioStr=radioStr+reData.dataMap[reData.dataList[i].colid][m]["conname"];
		    }
			var radioStrDiv='<div class="mainW-256"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div><div class="itemRW-160">';
			radioStr=radioStrDiv+radioStr+"</div></div>";
			allCode=allCode+radioStr;
	   }else if(reData.dataList[i]["convarchar"]==="5"){
	      allCode=allCode+'<div class="mainW-512"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div>'
          allCode=allCode+'<div class="itemRW-416"><textarea rows="5" cols="60" id="'+reData.dataList[i].colid+'"></textarea></div></div>';
	   }else if(reData.dataList[i]["convarchar"]==="6"){
	      allCode=allCode+'<div class="mainW-512"><div class="itemLW-96 padT-4">'+reData.dataList[i].colname +':</div>'
          allCode=allCode+'<div class="itemRW-416"><input id="'+reData.dataList[i].colid+'" class="Wdate" onclick="WdatePicker()" type="text"></div></div>';
	   }
	   if(sys_items!=""){
	       sys_items=sys_items+","+reData.dataList[i].colid;
	   }else{
	       sys_items=reData.dataList[i].colid;
	   }
   }
   $("#"+divId).html(allCode);
}


function sys_customCheck(divId,colid,defvalue,flolength,contype,colname,minlenorval,maxlenorval,required,formula){

     //alert("formula="+formula)
	 var itemsList=[colid];
	 clearError1(divId,colid,0);
	 //var formulavalue=colid+"formula";
     if(contype==="1"){
	     //var formula=$("#"+divId).find("[id='"+formulavalue+"']:eq("+0+")").val();
         if(minlenorval!=""&&maxlenorval!=""){
		     var min = parseInt(minlenorval) < 200 ? parseInt(minlenorval): 200;
			 var lenMax=parseInt(maxlenorval) < 200 ? parseInt(maxlenorval): 200;
		     sys_IsCheckLength(divId,itemsList,min,lenMax);
         } else if(minlenorval==""&&maxlenorval!=""){
		     var lenMax=parseInt(maxlenorval) < 200 ? parseInt(maxlenorval): 200;
		     sys_IsCheckLengthMax(divId,itemsList,lenMax);
		 }else if(minlenorval!=""&&maxlenorval==""){
		     var min = parseInt(minlenorval) < 200 ? parseInt(minlenorval): 200;
		     sys_IsCheckLength(divId,itemsList,min,200);
		 }
         //if($("#"+divId).find("[id='"+formulavalue+"']:eq("+0+")").val()!=""){
	     //     itemsCheckCus(divId,itemsList,"填入格式有误",sys_SubStr(formula,1,formula.length-1));
		 //}
		 if(formula!=""){
	          itemsCheckCus(divId,itemsList,"填入格式有误",sys_SubStr(formula,1,formula.length-1));
		 }
     } else if(contype==="2"){
	      sys_IsNumCheck(divId,itemsList);
		  var inval=$("#"+divId).find("[id='"+colid+"']:eq("+0+")").val();
		  if(parseInt(minlenorval)>inval||parseInt(maxlenorval)<inval){
		     var errormsg="填入值大小超出范围:(范围值是:"+minlenorval+"到"+maxlenorval+")";
		     setCheckError(divId,itemsList[0],0,errormsg);//
		  }
     } else if(contype==="3"){
	      sys_IsDoubleCheck(divId,itemsList);
		  var inval=$("#"+divId).find("[id='"+colid+"']:eq("+0+")").val();
		  if(parseInt(minlenorval)>inval||parseInt(maxlenorval)<inval){
		         var errormsg="填入值大小超出范围:(范围值是:"+minlenorval+"到"+maxlenorval+")";
		         setCheckError(divId,itemsList[0],0,errormsg);//
		  }else{
		     var intvalD=inval.split(".")[1];
		     if(intvalD.length>parseInt(flolength)){
			     var errormsg="小数部分精度过长:(小数点精度:"+flolength+"位)";
                 setCheckError(divId,itemsList[0],0,errormsg);
			 }
		  }
	  }
}


    function sys_initPage(pagePath){
        var mapInfo = new Map();
		mapInfo.put("sqlid","selectPageConGroup");
		mapInfo.put("pagePath",pagePath);
	  	var itemsList=[];
  		var url = "authMenu";
  		sys_AjaxGet(MDMBaseUrl+url,"","sys_initPageCallback",mapInfo,itemsList);

    }

    function sys_initPageCallback(retData){
		if(retData.dataList.length>0){
		     for(var i=0;i<retData.dataList.length;i++){
		         $("#"+retData.dataList[i].pageFormId).find("[id='"+retData.dataList[i].conId+"']").remove();
		     }
		}
	}

    function sys_msg(msg){
	    self.parent.$.messager.alert('操作提示',msg,'info');
	}

function sys_fun(name){
    var a="-----------------54******************************";
    this.fun = new Function(name+"('"+a+"');");
    this.fun();
	 alert("ie");
    var a="``````````````````";
    // var cTest = new sys_func("namea");
    // cTest.fun();
}
function sys_func(name){
    var a="54******************************";
    this.fun = new Function(name+"('"+a+"');");
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


