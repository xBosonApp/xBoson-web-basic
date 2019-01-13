
if(UrlParm.parm("typeCode")==="-1"){

  
	var urlindex="patientinfo/";
	var info=new Map();
	var itemsList=[];
    pid=LoadUrlParm.parm("pid");
    //localStorage.setItem("pid", pid);
	typeCode="-1";
	info.put('pid',pid);
	info.put('typeCode',typeCode);
    //localStorage.setItem("typeCode", typeCode);
    LC_AjaxGet(EMRBaseUrl+urlindex,"","empi1",info,itemsList);
}else if(UrlParm.parm("typeCode")==="-2"){
    // 姓名，性别，出生年月日
	var urlindex="patientinfo/";
	var info=new Map();
	var itemsList=[];
    //pid=LoadUrlParm.parm("pid");
	typeCode="-2";
      localStorage.setItem("typeCode", typeCode);
	info.put("pname",LoadUrlParm.parm("pname"));
	info.put("birthday",LoadUrlParm.parm("birthday"));
	info.put("sex",LoadUrlParm.parm("sex"));
    LC_AjaxGet(EMRBaseUrl+urlindex,"","empi2",info,itemsList);
}else{
	var urlindex="patientinfo/";
	var info=new Map();
	var itemsList=[];
    pid=LoadUrlParm.parm("pid");
    localStorage.setItem("pid", pid);
	typeCode=LoadUrlParm.parm("typeCode");
     localStorage.setItem("typeCode", typeCode);
    LC_AjaxGet(EMRBaseUrl+urlindex,"","empi3",info,itemsList);
}


function empi1(retData){     
    if(retData.datalist.length!=0){
        localStorage.setItem(LoadUrlParm.parm("pid"),  JSON.stringify(retData)); 
    }else{
        alert("无此EMR信息 PID:"+pid);
    }
	typeCode="-1";
}
function empi2(retData){
    if(retData.datalist.length!=0){
       localStorage.setItem(retData.datalist[0].globalId, JSON.stringify(retData)); 
	   //self.parent.
	   pid=retData.datalist[0].globalId;
           localStorage.setItem("pid", pid)
	  // alert(retData.datalist[0].globalId);
	  // alert(pid);
    }else{
       alert("无此EMR信息 PID:"+pid);
    }
	typeCode="-1";
}
function empi3(retData){
    if(retData.datalist.length!=0){
       localStorage.setItem(retData.datalist[0].globalId,  JSON.stringify(retData)); 
	   pid=retData.datalist[0].globalId;
           localStorage.setItem("pid", pid)
    }else{
       alert("无此EMR信息 PID:"+pid);
    }
	typeCode="-1";
}

