//
//
//var retCheckFlg=true;
//	// ����
//	var emailErrorMsg = "�ʼ������ϸ�ʽ;"; 
//	var emailRe= /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
//	// ����
//	var numErrorMsg = "ֻ����������"; 
//	var numRe= /^[\d]+$/ ; 
//	// ������
//	var doubleErrorMsg = "��������ȷ���ָ�ʽ"; 
//	var doubleRe=/^[\d]+[.]{1}+[\d]+$/;
//	// ��ĸ��ĸ�����ּ��
//	var licitRe = /^[_0-9a-zA-Z]*$/;
//	var licitErrorMsg = "����a-z0-9_��ɵ��ַ���(�����ִ�Сд);"; 
//	
//	// ��ַ
//	var urlRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|"+ "([0-9a-z_!~*'()-]+\.)*"+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|"+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
//	var urlRe = new RegExp(urlRegex);
//	var urlErrorMsg ="��ַ��������;";
//	// ������֤
//	function LC_isEmailCheck(id,itemsList){
//	
//		itemsCheck(id,itemsList,emailErrorMsg,emailRe);
//	}
//	//������֤
//	function LC_isNumCheck(id,itemsList){
//		itemsCheck(id,itemsList,licitErrorMsg,licitRe);
//	}
//	//��ĸ��ĸ�����ּ��
//	function LC_isLicitCheck(id,itemsList){
//		itemsCheck(id,itemsList,numErrorMsg,numRe);
//	}
//	//������
//	function LC_isDoubleCheck(id,itemsList){
//		alert("�������");
//		itemsCheck(id,itemsList,doubleErrorMsg,doubleRe);
//	}
//	//��ַ���
//	function LC_isUrlCheck(id,itemsList){
//		alert("��ַ���");
//		itemsCheck(id,itemsList,urlErrorMsg,urlRe);
//	}
//	// ѭ������ÿһ��
//	function itemsCheck(id,itemsList,msg,re){
//	    // ������鲻���ڿ�
//	    if(itemsList.length>0){
//		   	 // ��ȡѭ������
//		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
//		   	 // ѭ������
//		   	 for(var i=0;i<itemsSize; i++){
//		   		 var dataMap = new Map();
//		   		 // ��ȡÿ��Ԫ��
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
//	// ��֤
//	function isCheckRe(str,re){
//		return re.test(str); 
//	}
//	// ���ô�����Ϣ
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
//	 // ���������Ϣ
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
