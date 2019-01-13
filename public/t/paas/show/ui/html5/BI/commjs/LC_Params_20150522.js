var sys_wait=200;

var oid="";
var sys_stepNum=0;
var sys_stepNum0=0;
var sys_stepNum1=0;
var sys_stepNum2=0;
var sys_stepNum3=0;
var sys_stepNum4=0;
var sys_stepNum5=0;

//机构用
var sys_orgInfo = new Map();
sys_orgInfo.put("key",["orgid"]);
sys_orgInfo.put("value",["orgnm"]);

//科室用
var sys_deptInfo = new Map();
sys_deptInfo.put("key",["deptid"]);
sys_deptInfo.put("value",["deptname"]);

//人员用
var sys_staffInfoByOrgId = new Map();
sys_staffInfoByOrgId.put("key",["staffid"]);
sys_staffInfoByOrgId.put("value",["name"]);

//字典用
var sys_dictInfo = new Map();
sys_dictInfo.put("key",["yearversion","typecode1","typecode2"]);
sys_dictInfo.put("value",["typename"]);
sys_dictInfo.put("keySplit","|");
sys_dictInfo.put("valueSplit","|");

//通过部门查询人员信息
var sys_staffInfoByDeptId = new Map();
sys_staffInfoByDeptId.put("key",["staffid"]);
sys_staffInfoByDeptId.put("value",["name","typename"]);
sys_staffInfoByDeptId.put("keySplit","|");
sys_staffInfoByDeptId.put("valueSplit","|");

//通过部门查询职务信息
var sys_jobInfoByDeptId = new Map();
sys_jobInfoByDeptId.put("key",["jobid"]);
sys_jobInfoByDeptId.put("value",["name","typename"]);
sys_jobInfoByDeptId.put("keySplit","|");
sys_jobInfoByDeptId.put("valueSplit","|");

//通过部门查询人员和职务信息
var sys_staffAndJobInfoByDeptId = new Map();
sys_staffAndJobInfoByDeptId.put("key",["staffid","jobid"]);
sys_staffAndJobInfoByDeptId.put("value",["name","typename"]);
sys_staffAndJobInfoByDeptId.put("keySplit","|");
sys_staffAndJobInfoByDeptId.put("valueSplit","|");

// 调试开关 false步调试，true调试
var debuggerFlg=false;
var app="mdm";
var EMRBaseUrl="http://192.168.0.183:8080/emrview/rest/emr/";
var MDMBaseUrl="http://192.168.0.183:8080/mdmServices/service/mdm/mdm_";
var MDMBaseLoginUrl="http://192.168.0.183:8080/mdmServices/service/mdmLogin/mdm_";
var MDMBaseLoginCheckUrl="http://192.168.0.183:8080/mdmServices/service/mdmLoginCheck/mdm_";
//var MDMBaseUrl1="http://192.168.0.183:8080/AppRestful/service/";
var MDMBaseUrl1="http://192.168.0.183:8080/mdmServices/service/mdm/sys_";
var TranLogBaseUrl="http://192.168.0.183:8080/LogServices/service/log/log_";
//var TranLogBaseUrl="http://192.168.0.183:8080/TranLog/service/";
var TestBeeltUrl="http://192.168.0.183:8080/DataServices/service/";
var TRSBaseUrl="http://192.168.0.183:8080/TRS/service/";
//var EMPIUrl="http://192.168.0.105:8080/PID/service/";
var EMPIUrl="http://192.168.0.109:8083/PID/service/";
var BIASUrl="http://192.168.0.183:8080/BiServices/service/biAS/bi_";
var BIUrl="http://192.168.0.183:8080/BiServices/service/bi/bi_";
var BIloginUrl="http://192.168.0.183:8080/BiServices/service/biLogin/bi_";
var DataExchangeUrl="http://192.168.0.183:8080/DataExchange/service/de/de_";
var retData = undefined;
var callback="callback";
var empi="";
var pid="";
var typeCode="";
var dataMap="";
var dataId="";
var datasource="";


var dataxxMap="";
var loginFlg=false;
var orgid="";
var staffid="";
var username="";
var lev="";
var usertype="";