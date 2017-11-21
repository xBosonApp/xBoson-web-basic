
    var retCheckFlg=true;

	// 邮箱
	var emailErrorMsg = "邮件不符合格式;"; 
	var emailRe= /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
	// 不能为空
	var notNullErrorMsg="不能为空";
	// 数字
	var numErrorMsg = "只能输入整数或0"; 
	var numRe= /^-?[1-9]\d*|0$/ ; 
	var numReLen=/^[0-9]*$/;
	// 正整数或0
	var numErrorMsgPos = "只能输入正整数或0"; 
	var numRePos= /^[1-9]\d*|0$/ ; 
	// 负整数或0
	var numErrorMsgNeg = "只能输入负整数或0"; 
	var numReNeg= /^-[1-9]\d*|0$/ ; 
	
	// 货币
	var moneyRe=/^d*.?d{1,2}$/;
	var moneyErrorMsg ="输入的钱数格式不正确";
	
	// 负货币格式
	var moneyReNeg=/^-?d*.?d{1,2}$/;
	var moneyErrorMsgNeg ="只能输入负数";
	
	// 正货币格式
	var moneyRePos=/^d*.?d{1,2}$/;
	var moneyErrorMsgPos ="只能输入正数";
	// 浮点型
	var doubleErrorMsg = "请输入正确数字格式"; 
	var doubleRe=/^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
	// 负数格式或0
	var doubleErrorMsgNeg = "请输入正确负数格式或0"; 
	var doubleReNeg=/^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/;
	// 整数格式或0
	var doubleErrorMsgPos = "请输入正确正数字格式或0"; 
	var doubleRePos=/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;
	
	// 字母字母和数字检测
	var licitRe = /^[_0-9a-zA-Z]*$/;
	var licitErrorMsg = "是由a-z0-9_组成的字符串(不区分大小写);"; 
	
	// 网址
	var urlRegex = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|"+ "([0-9a-z_!~*'()-]+\.)*"+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|"+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
	var urlRe = new RegExp(urlRegex);
	var urlErrorMsg ="网址输入有误;";
	
	// 验证最小长度
	function LC_IsCheckLengthMin(id,itemsList,lenMin){
		if (!this.LC_IsCheckRe(lenMin,numReLen)) { 
   			retCheckFlg= false;
   			self.parent.$.messager.alert('错误提示','字符长度只能是正整数!','error');
   		}else{
			var lengthErrorMsg="输入字节长度应该大于等于"+ lenMin +"  (汉字/全角是两个字节)";
			itemsCheckLengthMin(id,itemsList,lengthErrorMsg,lenMin);
   		}
	}
	// 验证是否为空
	function LC_IsCheckNotNull(id,itemsList){
		itemsCheckNotNull(id,itemsList,notNullErrorMsg);
	}
	// 验证最大长度
	function LC_IsCheckLengthMax(id,itemsList,lenMax){
		if (!this.LC_IsCheckRe(lenMax,numReLen)) { 
   			retCheckFlg= false;
   			self.parent.$.messager.alert('错误提示','字符长度只能是正整数!','error');
   		}else{
			var lengthErrorMsg="输入字节长度应该小于等于"+lenMax +"  (汉字/全角是两个字节)";
			itemsCheckLengthMax(id,itemsList,lengthErrorMsg,lenMax);
   		}
	}
	
	// 验证最大长度和最下长度
	function LC_IsCheckLength(id,itemsList,lenMin,lenMax){
		if (!this.LC_IsCheckRe(lenMax,numReLen)||!this.LC_IsCheckRe(lenMin,numReLen)) { 
   			retCheckFlg= false;
   			self.parent.$.messager.alert('错误提示','字符长度只能是正整数!','error');
   		}else{
			var lengthErrorMsg="输入字节长度应该大于等于"+lenMin +"并且小于等于"+lenMax +"  (汉字/全角是两个字节)";
			itemsCheckLength(id,itemsList,lengthErrorMsg,lenMin,lenMax);
   		}
	}
	
	// 邮箱验证
	function LC_IsEmailCheck(id,itemsList){
		itemsCheck(id,itemsList,emailErrorMsg,emailRe);
	}
	
	// 货币格式
	function LC_IsMoneyCheck(id,itemsList){
		itemsCheck(id,itemsList,moneyErrorMsg,moneyRe);
	}
	
	// 负货币格式
	function LC_IsMoneyCheckNeg(id,itemsList){
		itemsCheck(id,itemsList,moneyErrorMsgNeg,moneyReNeg);
	}
	
	// 正货币格式
	function LC_IsMoneyCheckPos(id,itemsList){
		itemsCheck(id,itemsList,moneyErrorMsgPos,moneyRePos);
	}
	
	//数字验证
	function LC_IsNumCheck(id,itemsList){
		itemsCheck(id,itemsList,numErrorMsg,numRe);
	}
	
	// 负整数验证
	function LC_IsNumCheckNeg(id,itemsList){
		itemsCheck(id,itemsList,numErrorMsgNeg,numReNeg);
	}
	
	// 正整数验证
	function LC_IsNumCheckPos(id,itemsList){
		itemsCheck(id,itemsList,numErrorMsgPos,numRePos);
	}
	
	// 字母字母和数字检测
	function LC_IsLicitCheck(id,itemsList){
		itemsCheck(id,itemsList,licitErrorMsg,licitRe);
	}
	
	// 浮点检测
	function LC_IsDoubleCheck(id,itemsList){
		itemsCheck(id,itemsList,doubleErrorMsg,doubleRe);
	}
	
	// 正浮点检测
	function LC_IsDoubleCheckPos(id,itemsList){
		itemsCheck(id,itemsList,doubleErrorMsgPos,doubleRePos);
	}
	
	// 负浮点检测
	function LC_IsDoubleCheckNeg(id,itemsList){
		itemsCheck(id,itemsList,doubleErrorMsgNeg,doubleReNeg);
	}
	
	//网址检测
	function LC_IsUrlCheck(id,itemsList){
		itemsCheck(id,itemsList,urlErrorMsg,urlRe);
	}
	
	// 循环遍历每一项
	function itemsCheck(id,itemsList,msg,re){
	    // 如果数组不等于空
	    if(itemsList.length>0){
		   	 // 获取循环个数
		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		   	 // 循环遍历
		   	 for(var i=0;i<itemsSize; i++){
		   		 var dataMap = new Map();
		   		 // 获取每个元素
		   		 for(var m=0;m<itemsList.length; m++){
		   			clearError(id,itemsList[m],i);
					if($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val()!==""){
						if (!this.LC_IsCheckRe($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val(),re)) { 
							retCheckFlg= false;
							setCheckError(id,itemsList[m],i,msg);
						}
					}
		   		 }
		   	 }
	    }
	}
	// 长度循环遍历每一项
	function itemsCheckLength(id,itemsList,msg,lenMin,lenMax){
	    // 如果数组不等于空
	    if(itemsList.length>0){
		   	 // 获取循环个数
		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		   	 // 循环遍历
		   	 for(var i=0;i<itemsSize; i++){
		   		 var dataMap = new Map();
		   		 // 获取每个元素
		   		 for(var m=0;m<itemsList.length; m++){
		   			clearError(id,itemsList[m],i);
		   			if (lenMin>$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val().replace(/[^\x00-\xff]/g,"xx").length||
		   					lenMax<$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val().replace(/[^\x00-\xff]/g,"xx").length) { 
		   				retCheckFlg= false;
		   				setCheckError(id,itemsList[m],i,msg);
		   			}
		   		 }
		   	 }
	    }
	}
	
	// 不为空循环遍历每一项
	function itemsCheckNotNull(id,itemsList,msg){
	    // 如果数组不等于空
	    if(itemsList.length>0){
		   	 // 获取循环个数
		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		   	 // 循环遍历
		   	 for(var i=0;i<itemsSize; i++){
		   		 var dataMap = new Map();
		   		 // 获取每个元素
		   		 for(var m=0;m<itemsList.length; m++){
		   			clearError(id,itemsList[m],i);
		   			if (($("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val().replace(/[ ]/g, "")).length===0) { 
		   				retCheckFlg= false;
		   				setCheckError(id,itemsList[m],i,msg);
		   			}
		   		 }
		   	 }
	    }
	}
	
	// 最小长度循环遍历每一项
	function itemsCheckLengthMin(id,itemsList,msg,lenMin){
	    // 如果数组不等于空
	    if(itemsList.length>0){
		   	 // 获取循环个数
		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		   	 // 循环遍历
		   	 for(var i=0;i<itemsSize; i++){
		   		 var dataMap = new Map();
		   		 // 获取每个元素
		   		 for(var m=0;m<itemsList.length; m++){
		   			clearError(id,itemsList[m],i);
		   			if (lenMin>$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val().replace(/[^\x00-\xff]/g,"xx").length) { 
		   				retCheckFlg= false;
		   				setCheckError(id,itemsList[m],i,msg);
		   			}
		   		 }
		   	 }
	    }
	}
	
	// 最大长度循环遍历每一项
	function itemsCheckLengthMax(id,itemsList,msg,lenMax){
	    // 如果数组不等于空
	    if(itemsList.length>0){
		   	 // 获取循环个数
		   	 var itemsSize=$("#"+id).find("[id='"+itemsList[0]+"']").length;
		   	 // 循环遍历
		   	 for(var i=0;i<itemsSize; i++){
		   		 var dataMap = new Map();
		   		 // 获取每个元素
		   		 for(var m=0;m<itemsList.length; m++){
		   			clearError(id,itemsList[m],i);
		   			if (lenMax<$("#"+id).find("[id='"+itemsList[m]+"']:eq("+i+")").val().replace(/[^\x00-\xff]/g,"xx").length) { 
		   				retCheckFlg= false;
		   				setCheckError(id,itemsList[m],i,msg);
		   			}
		   		 }
		   	 }
	    }
	}
	// 验证
	function LC_IsCheckRe(str,re){
		return re.test(str); 
	}
	
	// 设置错误信息
	function setCheckError(id,itemsId,num,str){
		 var newTitle=$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title");
		 $("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("checkFlg","false");
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").validatebox('reduce');
//		 var newTitle= $("#"+id).find("[id='"+itemsId+"']:eq("+num+")").validatebox('options').prompt;
		 if(newTitle!==undefined){
			 newTitle = newTitle+"  "+str;
		 }else{
			 newTitle = str;
		 }
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").validatebox('options').prompt=newTitle;
		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title",newTitle);
		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").css("border","1px solid red");

	}
	
	// 清除错误信息
	function clearError(id,itemsId,num){
		if($("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("checkFlg")=="true"){
		   $("#"+id).find("[id='"+itemsId+"']:eq("+num+")").attr("title","");
		   $("#"+id).find("[id='"+itemsId+"']:eq("+num+")").css("border","");
		}

//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").validatebox('options').prompt="2";
//		$("#"+id).find("[id='"+itemsId+"']:eq("+num+")").validatebox('remove');
		
	}
	
	function LC_Resetting(id){

	    // 重置检查结果
		$("#"+id).find("input").attr("title","");
		$("#"+id).find("input").css("border","");
		$("#"+id).find("select").attr("title","");
		$("#"+id).find("select").css("border","");
	    retCheckFlg=true;
	    $("#"+id).find("input").attr("checkFlg","true");
        $("#"+id).find("select").attr("checkFlg","true");
//			$('input.easyui-validatebox').validatebox({
//			tipOptions: {	// the options to create tooltip
//				showEvent: 'mouseenter',
//				hideEvent: 'mouseleave',
//				showDelay: 0,
//				hideDelay: 0,
//				zIndex: '',
//				onShow: function(){
//					if (!$(this).hasClass('validatebox-invalid')){
//						if ($(this).tooltip('options').prompt){
//							$(this).tooltip('update', $(this).tooltip('options').prompt);
//						} else {
//							$(this).tooltip('tip').hide();
//						}
//					} else {
//						$(this).tooltip('tip').css({
//							color: '#000',
//							borderColor: '#CC9933',
//							backgroundColor: '#FFFFCC'
//						});
//					}
//				},
//				onHide: function(){
//					if (!$(this).tooltip('options').prompt){
//						$(this).tooltip('destroy');
//					}
//				}
//			}
//		}).tooltip({
//			position: 'bottom',
//			content: function(){
//				var opts = $(this).validatebox('options');
//				//alert(opts.prompt);
//				if(opts.prompt==undefined||opts.prompt==""){
//				   opts.prompt=opts.missingMessage
//				}
//				return opts.prompt;
//			},
//			onShow: function(){
//				$(this).tooltip('tip').css({
//					color: '#000',
//					borderColor: '#CC9933',
//					backgroundColor: '#FFFFCC'
//				});
//			}
//		});
	}
	
	$.extend($.fn.validatebox.methods, { 
			    remove: function(jq, newposition){ 
			        return jq.each(function(){ 
			            $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus.validatebox').unbind('blur.validatebox');
			        }); 
			    },
			    reduce: function(jq, newposition){ 
			        return jq.each(function(){ 
			           var opt = $(this).data().validatebox.options;
			           $(this).addClass("validatebox-text").validatebox(opt);
			        }); 
			    }  
			});
