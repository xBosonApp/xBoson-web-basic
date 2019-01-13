
var sys_BI_daoid="";
var sys_BI_dimcvListcallback="";
var sys_BI_dimcvListInfo="";
var sys_BI_dimcv103CallBack="";
var sys_BI_dimcv103Info="";
var sys_BI_diccallback="";
var sys_orgid="";
//机构请求
function sys_BI_getDaoidList(callback){
    sys_BI_daoid=callback;
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var map= new Map();
	var strs= new Array(); 

	if(sys_LS.get(ymd+"|BIselectdaoid")==undefined){
		var url="dimOrg";
		var infoa = new Map();
		var itemsList= [];
		sys_AjaxGet(BIUrl+url,"","sys_BI_selectdaoid",infoa,itemsList);
	}else{
	    this.fun = new Function(sys_BI_daoid+"('"+retDicData+"');");
        this.fun();
	}
}

function sys_BI_selectdaoid(data){
    var myDate = new Date();
    var ymd=myDate.toLocaleDateString();
    sys_LS.set(ymd+"|BIselectdaoid",JSON.stringify(data.dataList));
    this.fun = new Function(sys_BI_daoid+"();");
    this.fun();
}
// 机构获取
function sys_BI_getCacheDaoidData(){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|BIselectdaoid"));
}


//保险类别
function  sys_BI_getDimcvList(callback,info){
    sys_BI_dimcvListInfo=info;
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
    sys_BI_dimcvListcallback=callback;
	var strs= new Array(); 
	if(sys_LS.get(ymd+"|BI_dimcv"+info)==undefined){
		var url="GetDimType";
		var infoa = new Map();
		infoa.put("dimtype",info);
		var itemsList= [];
		sys_AjaxGet(BIUrl+url,"","sys_BI_getDimcvListCallback",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}

function sys_BI_getDimcvListCallback(data){
    var myDate = new Date();
    var ymd=myDate.toLocaleDateString();
    var strs= new Array(); 
    sys_LS.set(ymd+"|BI_dimcv"+sys_BI_dimcvListInfo,JSON.stringify(data.dataList));
    this.fun = new Function(sys_BI_dimcvListcallback+"();");
    this.fun();
}
//  获取保险类别
function sys_BI_getDimcvListData(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|BI_dimcv"+key));
}


// 费用类别
function  sys_getOrgList(callback,info){
    sys_BI_dimcv103CallBack=callback;
    sys_BI_dimcv103Info=info;
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	if(sys_LS.get(ymd+"|BI_dimcv103"+info)==undefined){
		var url="GetDimType";
		var infoa = new Map();
		infoa.put("dimtype",info);
		var itemsList= [];
		sys_AjaxGet(BIUrl+url,"","sys_BI_dimcv103callback",infoa,itemsList);
	}else{
	    this.fun = new Function(callback+"();");
        this.fun();
	}
}

function sys_BI_dimcv103callback(data){
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var strs= new Array(); 
    sys_LS.set(ymd+"|BI_dimcv103"+sys_BI_dimcv103Info,JSON.stringify(data.dataList));
	this.fun = new Function(sys_BI_dimcv103CallBack+"();");
    this.fun();
}

//获取费用类别
function sys_BI_getCacheDimcv103Data(key){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|BI_dimcv103"+key));
}




//医生请求
function sys_BI_getDicList(orgid,callback){
    sys_orgid=orgid.toString();
    sys_BI_diccallback=callback;
	var myDate = new Date();
	var ymd=myDate.toLocaleDateString();
	var map= new Map();
	var strs= new Array(); 

	if(sys_LS.get(ymd+"|BIselectdicid|"+sys_orgid)==undefined){
		var url="dimdoc";
		var infoa = new Map();
		infoa.put("orgid",sys_orgid);
		var itemsList= [];
		sys_AjaxGet(BIUrl+url,"","sys_BI_selectdicid",infoa,itemsList);

	}else{

	    this.fun = new Function(sys_BI_diccallback+"('"+retDicData+"');");
        this.fun();
	}
}

function sys_BI_selectdicid(data){
    var myDate = new Date();
    var ymd=myDate.toLocaleDateString();
	var newdataList=[];
	for(var i=0;i<data.dataList.length;i++){
         var dataM=data.dataList[i];
	     var newmap=new Map
         if(dataM["healthstaffno"]!="All"){
		 var HospUnitOrgCode = dataM["healthstaffno"].split(dataM["hospunitorgcode"]);

		 if(HospUnitOrgCode.length>1){
		     newmap.put("healthstaffno",HospUnitOrgCode[1]);
			 newmap.put("healthstaffnm",dataM["healthstaffnm"]);
			 newdataList.push(newmap);
		 }else{
		     newmap.put("healthstaffno",HospUnitOrgCode[0]);
			 newmap.put("healthstaffnm",dataM["healthstaffnm"]);
			 newdataList.push(newmap); 
		 }
		 }else{
		 	 newmap.put("healthstaffno","All");
			 newmap.put("healthstaffnm","All");
			 newdataList.push(newmap); 
		 }
	}
    sys_LS.set(ymd+"|BIselectdicid|"+sys_orgid,JSON.stringify(data.dataList));
    this.fun = new Function(sys_BI_diccallback+"();");
    this.fun();
}
// 医生获取
function sys_BI_getCacheDicData(orgid){
   var myDate = new Date();
   var ymd=myDate.toLocaleDateString();
   return JSON.parse(sys_LS.get(ymd+"|BIselectdicid|"+orgid.toString()));
}












