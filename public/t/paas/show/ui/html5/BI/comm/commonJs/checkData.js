//
//
//var retCheckFlg=true;
//	// 邮箱
//	var emailErrorMsg = "邮件不符合格式;"; 
//	var emailRe= /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
//	// 数字
//	var numErrorMsg = "只能输入整数"; 
//	var numRe= /^[\d]+$/ ; 
//	// 浮点型
//	var doubleErrorMsg = "请输入正确数字格式"; 
//	var doubleRe=/^[\d]+[.]{1}+[\d]+$/;
//	// 字母字母和数字检测
//	var licitRe = /^[_0-9a-zA-Z]*$/;
//	var licitErrorMsg = "是由a-z0-9_组成的字符串(不区分大小写);"; 
//	
//	// 网址
//	var urlRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|"+ "([0-9a-z_!~*'()-]+\.)*"+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|"+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
//	var urlRe = new RegExp(urlRegex);
//	var urlErrorMsg ="网址输入有误;";
//	// 邮箱验证
//	function LC_isEmailCheck(id,itemsList){
//	
//		itemsCheck(id,itemsList,emailErrorMsg,emailRe);
//	}
//	//数字验证
//	function LC_isNumCheck(id,itemsList){
//		itemsCheck(id,itemsList,licitErrorMsg,licitRe);
//	}
//	//字母字母和数字检测
//	function LC_isLicitCheck(id,itemsList){
//		itemsCheck(id,itemsList,numErrorMsg,numRe);
//	}
//	//浮点检测
//	function LC_isDoubleCheck(id,itemsList){
//		alert("浮点测试");
//		itemsCheck(id,itemsList,doubleErrorMsg,doubleRe);
//	}
//	//网址检测
//	function LC_isUrlCheck(id,itemsList){
//		alert("网址检测");
//		itemsCheck(id,itemsList,urlErrorMsg,urlRe);
//	}
//	// 循环遍历每一项
//	function itemsCheck(id,itemsList,msg,re){
//	    // 如果数组不等于空
//	    if(itemsList.length>0){
//		   	 // 获取循环个数
//		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
//		   	 // 循环遍历
//		   	 for(var i=0;i<itemsSize; i++){
//		   		 var dataMap = new Map();
//		   		 // 获取每个元素
//		   		 for(var m=0;m<itemsList.length; m++){
//	
//		   			clearError(id,itemsList[m],i);
//		   			if (!this.isCheckRe($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val(),re)) { 
//		   				retCheckFlg= false;
//		   				setCheckError(id,itemsList[m],i,msg);
//		   			}
//		   		 }
//		   	 }
//	    }
//	}
//	// 验证
//	function isCheckRe(str,re){
//		return re.test(str); 
//	}
//	// 设置错误信息
//	function setCheckError(id,itemsId,num,str){
//		 var newTitle=$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title");
//		 if(newTitle!==undefined){
//			 newTitle = newTitle+str;
//		 }else{
//			 newTitle = str;
//		 }
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title",newTitle);
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").css("background-color","red");
//	}
//	 // 清除错误信息
//	function clearError(id,itemsId,num){
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title","");
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").css("background-color","");
//	}
//	
//	function   formatYMD(now)   {  
//	    var   d=new   Date(now);     
//	    var   year=d.getYear();     
//	    var   month=d.getMonth()+1;     
//	    var   date=d.getDate();     
//	    var   hour=d.getHours();     
//	    var   minute=d.getMinutes();     
//	    var   second=d.getSeconds();     
//	    return   year+"-"+month+"-"+date ;
//	}  
//	
//	function   formatYMDHMS(now)   {  
//	    var   d=new   Date(now);     
//	    var   year=d.getYear();     
//	    var   month=d.getMonth()+1;     
//	    var   date=d.getDate();     
//	    var   hour=d.getHours();     
//	    var   minute=d.getMinutes();     
//	    var   second=d.getSeconds();     
//	    return   year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
//	}    
