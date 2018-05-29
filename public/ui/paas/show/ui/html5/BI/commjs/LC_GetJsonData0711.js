﻿
function sys_ValueReplace(v) {
	
//	if (v.indexOf("\"") != -1) {
//	v = v.toString().replace(new RegExp('(["\"])', 'g'), "\\\"");
//	}
//	else if (v.indexOf("\\") != -1){
//	v = v.toString().replace(new RegExp("([\\\\])", 'g'), "\\\\");
//	}
 //var a="a\a\\a/b";
// var reg=/\\|\//g;  
 //alert(a.replace(reg,"-"));

	v=v.replace(/\'/g,"＇");//替换半角单引号为全角单引号
	v=v.replace(/\"/g,"＂");//替换半角双引号为全角双引号
	v=v.replace(/</g,"＜").replace(/>/g,"＞");
	v=v.replace(/%/g,"％");
　　//v=v.replace(/\\/g,"＼");
	//v=v.replace(/?/g,"？");
	//v=v.replace(/&/g,"＆");

	return v;
} 

function sys_PostJsonData(id, infoMap, itemsList){
	 sys_GetJsonData(id, infoMap, itemsList)
	 var retMap = new Map();
	 var dataList =  new Array();
	 // var dataList =  new  List();
 
//	 infoMap.put('oid',oid);    
//	 infoMap.put('app',app);
//	 infoMap.put('empi',empi);
     // 如果数组不等于空
     if(itemsList.length>0){
    	 // 获取循环个数
    	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
    	 // 循环遍历
    	 for(var i=0;i<itemsSize;i++){
    		 var dataMap = new Map();
    		 // 获取每个元素
    		 for(var m=0;m<itemsList.length;m++){
    			 if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").get(0)!=undefined){
    			      if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").get(0).tagName==="INPUT"){
    			          if($("#"+id).find("[id='"+itemsList[m]+"']").attr("type")==="radio"){
    			        	  dataMap.put(itemsList[m],$("#"+id).find("input[id='"+itemsList[m]+"']:checked").val());
    			          }else if($("#"+id).find("[id='"+itemsList[m]+"']").attr("type")==="checkbox"){
    			        	   var chk_value =[];    
    			        	   $("#"+id).find("input[id="+itemsList[m]+"]:checked").each(function(){    
    			        	       chk_value.push($(this).val());    
    			        	   });  
    			        	  dataMap.put(itemsList[m],chk_value);
    			          }else{
    			        	  dataMap.put(itemsList[m],sys_ValueReplace($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()));
        			      }
    			      }else{
    			    	  dataMap.put(itemsList[m],sys_ValueReplace($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()));
    			      }
    			 }
    		 }
    		 dataList.push(dataMap);
    	 }	 
     }

     var infoKeyList=infoMap.keys();
     var jsonString="";
     jsonString='"info":{';
     for(var i=0; i<infoKeyList.length;i++){
    	 jsonString+='"'+infoKeyList[i]+'":'+'"'+infoMap.get(infoKeyList[i])+'"';
    	 if(i!=infoKeyList.length-1){
    		 jsonString+=',';
    	 }
     }
     jsonString+='}';
     jsonString+=',"data":[';
     for(var i=0;i<dataList.length;i++){
    	 var dataListMapKeyList=dataList[i].keys();
    	 jsonString+='{';
         for(var j=0; j<dataListMapKeyList.length;j++){
        	 jsonString+='"'+dataListMapKeyList[j]+'":'+'"'+dataList[i].get(dataListMapKeyList[j])+'"';
        	 if(j!=dataListMapKeyList.length-1){
        		 jsonString+=',';
        	 }else{
        		 jsonString+='}';
        	 }
         }
         if(i!=dataList.length-1){
        	 jsonString+=',';
    	 }
     }
     jsonString+=']';
     jsonString='{'+jsonString+'}';

     return jsonString;
}

function sys_GetJsonData(id, infoMap, itemsList){

	var retMap = new Map();
	var dataList =  new Array();
    var retStr="";

	retStr="oid="+oid+"&app="+app+"&empi="+empi;
    if(pid!=""&&pid!=null&&pid!="null"){
        retStr=retStr+"&pid="+pid;
    }else if(sys_LS.get("pid")!=""&&sys_LS.get("pid")!="null"&&sys_LS.get("pid")!=null){
        retStr=retStr+"&pid="+sys_LS.get("pid");
    }

    if(typeCode!=""&&typeCode!=null){
        retStr=retStr+"&typeCode="+typeCode;
    }else if(sys_LS.get("typeCode")!=null&&sys_LS.get("typeCode")!=""&&sys_LS.get("typeCode")!=undefined){
        retStr=retStr+"&typeCode="+sys_LS.get("typeCode");
    }
	
    
    var infoKeyList=infoMap.keys();
    for(var i=0; i<infoKeyList.length;i++){
    	retStr+="&"+infoKeyList[i]+"="+infoMap.get(infoKeyList[i]);
    }
    // 如果数组不等于空
    if(itemsList.length>0){
	   	 // 获取循环个数
	   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		 if($("#"+id).find("[id='"+itemsList[0]+"']").attr("type")==="checkbox"||$("#"+id).find("[id='"+itemsList[0]+"']").attr("type")==="radio"){
		     itemsSize=1;
		 }
	   	 // 循环遍历
	   	 for(var i=0;i<itemsSize;i++){
	   		 // 获取每个元素
	   		 //for(var m=0;m<itemsList.length;m++){
	    		 for(var m=0;m<itemsList.length;m++){
	    			 if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").get(0)!=undefined){
    			         if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").get(0).tagName==="INPUT"){
	    			          if($("#"+id).find("[id='"+itemsList[m]+"']").attr("type")==="radio"){
	   			        	       retStr+="&"+itemsList[m]+"="+$("#"+id).find("input[id='"+itemsList[m]+"']:checked").val();
	    			          }else if($("#"+id).find("[id='"+itemsList[m]+"']").attr("type")==="checkbox"){
	    			        	   var chk_value =[];    
	    			        	   $("#"+id).find("input[id="+itemsList[m]+"]:checked").each(function(){    
	    			        	       chk_value.push($(this).val());    
	    			        	   });  
	    			        	   retStr+="&"+itemsList[m]+"="+chk_value;
	    			          }else{
							    if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()!=null&&$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()!=""){
	    			        	   retStr+="&"+itemsList[m]+"="+sys_ValueReplace($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val());
								   }
	        			      }
	    			      }else{
						  if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()!=null&&$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()!=""){
	    			    	  retStr+="&"+itemsList[m]+"="+sys_ValueReplace($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val());
							  }
	    			      }
	    			 }
		   		}
	    	// } 
	    }
    }
    return retStr;
}


function sys_GetJsonDataLoad(id, infoMap, itemsList){
	var retMap = new Map();
	var dataList =  new Array();
    var retStr="";
    pid = LoadUrlParm.parm("pid");
    typeCode = LoadUrlParm.parm("typeCode");
    retStr="oid="+oid+"&app="+app+"&empi="+empi+"&pid="+pid+"&typeCode="+typeCode;
    var infoKeyList=infoMap.keys();

    for(var i=0; i<infoKeyList.length;i++){
    	retStr+="&"+infoKeyList[i]+"="+infoMap.get(infoKeyList[i]);
    }
    
    // 如果数组不等于空
    if(itemsList.length>0){
	   	 // 获取循环个数
	   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
	   	 // 循环遍历
	   	 for(var i=0;i<itemsSize;i++){
	   		 // 获取每个元素
	   		 for(var m=0;m<itemsList.length;m++){
	   			
	   			retStr+="&"+itemsList[m]+"="+sys_ValueReplace($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val());
	   		 }
    	 }	 
    }
    return retStr;
}