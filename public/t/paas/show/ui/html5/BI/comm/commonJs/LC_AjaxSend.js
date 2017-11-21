// 跨域提交
function LC_CrossAjaxPost(url, formid, callback, infoMap, itemsList){
    var parmeData=LC_CrossJsonData(formid, infoMap, itemsList)
    LC_Request.setname(parmeData, url);
    LC_Request.send(url,callback);
}

// 为第三方跨域提交  系统默认调用
function LC_AjaxPostThird(url,reCallBack,paramData){
    retData=undefined;
	$.ajax({
	   type: "post",
           contentType : 'application/json;charset=utf-8',
	   url : url+"?"+"callback="+reCallBack,
	   dataType:"jsonp",
	   data:paramData,  
	   async: false, 
	   jsonpCallback: reCallBack,
	   success : function(data) {
			if(data.ret==="0"){
			   retData = data;
			}else if(data.ret==="400"){
				alert(data.msg);//系统异常
			}else if(data.ret==="101"){
				alert(data.msg);//无数据（接口调用正常执行，结果数据位空，如：查询数据位空返回） 	
			}else if(data.ret==="102"){
				alert(data.msg);//传递参数有问题（调用接口参数校验错误） 		
			}else if(data.ret==="103"){
				alert(data.msg);//未登录
			}else if(data.ret==="104"){
				alert(data.msg);//该数据已存在（如：用户己存在等）
			}else if(data.ret==="105"){
				alert(data.msg);//已登录
			}else if(data.ret==="106"){
				alert(data.msg);//权限过低，无权限操作该功能或该数据
			}else if(data.ret==="107"){
				alert(data.msg);//该数据已存在（与104重复，ret编号保留，以后追加用）
			}else if(data.ret==="108"){
				alert(data.msg);//登陆失败	
			}else if(data.ret==="109"){
				alert(data.msg);//该数据已被其他用户操作
			}
	   },   
	   error : function() {   
		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
		   retData= undefined;
	   }   
	});
}
// 为自己系统提供跨域post提交
function LC_AjaxPost(url,reCallBack,paramData){
    retData=undefined;
	$.ajax({
	    type: "post",
            contentType : 'application/json;charset=utf-8',
	    url : url+"?"+"callback="+reCallBack,
	    dataType:"jsonp",
	    data:paramData,  
	    async: false, 
	    jsonpCallback: reCallBack,
	    success : function(data) {
	   		if(data.ret==="0"){
			   retData = data;
			}else if(data.ret==="400"){
			     self.parent.$.messager.alert('错误提示',"系统异常",'warning');
			}else if(data.ret==="101"){
			     alert("无数据");//无数据（接口调用正常执行，结果数据位空，如：查询数据位空返回） 	
			}else if(data.ret==="102"){
			     self.parent.$.messager.alert('错误提示',"传递参数有问题",'warning');//传递参数有问题（调用接口参数校验错误） 
                             //LC_SetMapError("form1",data.dataMap);				
			}else if(data.ret==="103"){
		    	self.parent.$.messager.alert('错误提示',"未登录",'warning');
			}else if(data.ret==="104"){
			    self.parent.$.messager.alert('错误提示',"该数据已存在",'warning');
			}else if(data.ret==="105"){
			    self.parent.$.messager.alert('错误提示',"已登录",'warning');
			}else if(data.ret==="106"){
			    self.parent.$.messager.alert('错误提示',"权限过低，无权限操作该功能或该数据",'warning');
			}else if(data.ret==="107"){
			    //self.parent.$.messager.alert('错误提示',"已登录",'warning');
			    //alert(data.msg);//该数据已存在（与104重复，ret编号保留，以后追加用）
			}else if(data.ret==="108"){
			    self.parent.$.messager.alert('错误提示',"登陆失败",'warning');
			}else if(data.ret==="109"){
			    self.parent.$.messager.alert('错误提示',"该数据已被其他用户操作",'warning');
			}
	   
//		if(data.returnCode==="0"){
//		    retData = data;
//		}else{
//		    LC_SetError(formid,data);
//		    self.parent.$.messager.alert('错误提示',data.msg,'warning');
//		    retData= undefined;
//		}
	    },   
	    error : function() {   
		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
		   retData= undefined;
	    }   
	});
}

function LC_SqlAjaxPost(url,formid,reCallBack,info,itemsList){


   
    retData=undefined;
	var jsonData=LC_PostJsonData(formid,info,itemsList);
//alert(jsonData);
	$.ajax({
	   type: "post",
       contentType : 'application/json;charset=utf-8',
	   url : url+"?"+"callback="+reCallBack,
	   dataType:"jsonp",
	   data:jsonData,
	  //data: '{"data":[{"typeCode1": "CV0000.01"}],"Info":{"app": "***系统","oid": "123456898***","pageSize": "10", "pageNum": "1"}}',
	   //jsonp: "jsoncallback",   
	   async: false, 
	   jsonpCallback: reCallBack,
	   success : function(data) {
//		if(data.returnCode==="0"){
//		    retData = data;
//		}else{
//		    LC_SetError(formid,data);
//		    self.parent.$.messager.alert('错误提示',data.msg,'warning');
//		    retData= undefined;
//		}
	   },   
	   error : function() {   
		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
		   retData= undefined;
	   }   
	});




//    retData=undefined;
//	debugger;
//	var jsonData=LC_PostJsonData(formid,info,itemsList);
//	alert("jsonData================2222=="+jsonData);
//	alert(url+"?"+"callback="+reCallBack);
//	//alert(url+"?"+"callback="+reCallBack+"&"+jsonData);
//	$.ajax({
//	   type: "post",
//      //contentType : 'application/json;charset=utf-8',
//	   url : url+"?"+"callback="+reCallBack,
//	   dataType:"jsonp",
//	   data:jsonData,  
//	   async: false, 
//	   jsonpCallback: reCallBack,
//	   success : function(data) {
//		if(data.returnCode==="0"){
//		    retData = data;
//		}else{
//		    LC_SetError(formid,data);
//		    self.parent.$.messager.alert('错误提示',data.msg,'warning');
//		    retData= undefined;
//		}
//	   },   
//	   error : function() {   
//		   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
//		   retData= undefined;
//	   }   
//	});
}

// ajaxget提交
function LC_AjaxGet(url,formid,reCallBack,info,itemsList){
	retData=undefined;
	var jsonData=LC_GetJsonData(formid,info,itemsList);
	//alert(url+"?"+"callback="+reCallBack+"&"+jsonData);
	$.ajax({
	   type: "get",
       //contentType : 'application/json;charset=utf-8',
	   url : url+"?"+"callback="+reCallBack+"&"+jsonData,
	   dataType:"jsonp",
	   //jsonp: "jsoncallback",   
	   async: false, 
	   jsonpCallback: reCallBack,
	   success : function(data) {
	   		if(data.ret==="0"){
			    retData = data;
			}else if(data.ret==="400"){
				self.parent.$.messager.alert('错误提示',"系统异常",'warning');
			}else if(data.ret==="101"){
				alert("无数据");//无数据（接口调用正常执行，结果数据位空，如：查询数据位空返回） 	
			}else if(data.ret==="102"){
				self.parent.$.messager.alert('错误提示',"传递参数有问题",'warning');//传递参数有问题（调用接口参数校验错误） 
                //LC_SetMapError("form1",data.dataMap);				
			}else if(data.ret==="103"){
		    	self.parent.$.messager.alert('错误提示',"未登录",'warning');
			}else if(data.ret==="104"){
			    self.parent.$.messager.alert('错误提示',"该数据已存在",'warning');
			}else if(data.ret==="105"){
			    self.parent.$.messager.alert('错误提示',"已登录",'warning');
			}else if(data.ret==="106"){
			    self.parent.$.messager.alert('错误提示',"权限过低，无权限操作该功能或该数据",'warning');
			}else if(data.ret==="107"){
			    //self.parent.$.messager.alert('错误提示',"已登录",'warning');
				//alert(data.msg);//该数据已存在（与104重复，ret编号保留，以后追加用）
			}else if(data.ret==="108"){
			    self.parent.$.messager.alert('错误提示',"登陆失败",'warning');
			}else if(data.ret==="109"){
			    self.parent.$.messager.alert('错误提示',"该数据已被其他用户操作",'warning');
			}
	   },   
	   error : function() {   
		//   self.parent.$.messager.alert('系统错误提示',"操作数据失败",'error'); 
		//   retData= undefined;
	   }   
	});
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