function LC_AjaxPost111(url,formid,reCallBack,info,itemsList){
    retData=undefined;
    var jsonData=LC_PostJsonData(formid,info,itemsList);
    retData=undefined;
	
	$.ajax({
	   type: "POST",
	   contentType : 'application/json;charset=utf-8',
	   //url : "http://localhost:8080/TRS/service/jrctest111?callback="+reCallBack,   
	   //data : '{"info":{"oid":"123","title":"46465"},"data":[{"passowrd":"男","username":"张三"},{"passowrd":"男","username":"张三"},{"passowrd":"男","username":"张三"}]}',
	   url : url+"?"+"callback="+reCallBack,
	   data : jsonData,
	   dataType : 'jsonp',  
	   async: false, 
	   jsonpCallback:reCallBack,
	   success : function(data) {
	  // alert("success---------------成功了");
      //    if(data.returnCode==="0"){
     //   	  retData = data;
     //     }else{
     //   	 LC_SetError(formid,data);
     //        self.parent.$.messager.alert('错误提示',data.msg,'warning');
     //        retData = data;
     //     }
	   },   
	   error : function() {   
		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
           retData = data;
	   }   
	});

return retData;

}



function LC_AjaxGet(url,formid,reCallBack,info,itemsList){

	retData=undefined;
	var jsonData=LC_GetJsonData(formid,info,itemsList);
	//console.log(url+"?"+jsonData);
	$.ajax({
	   type: "get",
       //contentType : 'application/json;charset=utf-8',
	   url : url+"?"+jsonData,
	   dataType:"jsonp",
	   //jsonp: "jsoncallback",   
	   async: false, 
	   jsonpCallback: reCallBack,
	   success : function(data) {
		   if(data.ret=="102"){
		      self.parent.$.messager.alert('错误提示',"传递参数有问题",'warning');
			//  LC_SetMapError("form1",data.dataMap);
		   }
//		if(data.returnCode==="0"){
//		    retData = data;
//		}else{
//		    LC_SetError(formid,data);
//		    self.parent.$.messager.alert('错误提示',data.msg,'warning');
//		    retData= undefined;
//		}
	   },   
	   error : function(data) {   
		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
		   console.log(url+"?"+jsonData);
		   console.log(data);
		   retData= undefined;
	   }   
	});

   //alert("adf+++++++++++++++++++++109+++++++++++++"+retData);
    return retData;
	
	
}
function retData(){
	
}

// 错误信息设置(List)
function LC_SetError(formid,data){
	
	for(var i=0;i<data.data.length;i++){
		  var jsonMap = data.data[i];
		  //如果需要遍历map
		  $.each(jsonMap, function(key, value){
		      if(key!="groupNum"){
		    	 $("#"+formid).find("[id='"+key+"']:eq("+(jsonMap.groupNum-1)+")").attr("title",value);
				 $("#"+formid).find("[id='"+key+"']:eq("+(jsonMap.groupNum-1)+")").css("background-color","red");
		      }
		  });
	}
}
// 错误信息设置(Map)
function LC_SetMapError(formid,jsonMap){
　  for(var key in jsonMap){
		$("#"+formid).find("[id='"+key+"']:eq(0)").attr("title",jsonMap[key]);
		$("#"+formid).find("[id='"+key+"']:eq(0)").css("border","1px solid red");
	} 
}