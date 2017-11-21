function hospunitorgcode(){

	var map = new Map();
	map.put("","-全部社区和医院-");
	map.put("1","超级管理机构");
	map.put("2","哈尔滨市卫生局");
	map.put("3","方正县卫生局");
	map.put("4","方正镇社区卫生服务中心");
	map.put("5","会发镇卫生院");
	map.put("6","大罗密镇卫生院");
	map.put("7","天门乡卫生院");
	map.put("8","松南乡卫生院");
	map.put("9","德善乡卫生院");
	map.put("10","宝兴乡卫生院");
	map.put("11","伊汉通乡卫生院");
	map.put("12","林业局社区卫生服务中心");
	map.put("13","沙河农场社区卫生服务中心");
	map.put("14","方正县人民医院");
	map.put("15","全科诊室");
	map.put("16","方正镇卫生院");
	map.put("17","方正县方正镇城西社区卫生服务中心");
	
	return map;
}

function doctor(){

	var map = new Map();
	map.put("","-全部医生-");
	map.put("344","景慧娟");
	map.put("156","井东");
	map.put("120","刘迁乔");
	map.put("121","刑丽丽");
	map.put("122","孟凡辉");
	map.put("123","于忠国");
	map.put("124","李兴平");
	map.put("125","杨大勇");
	map.put("126","王彦丰");
	map.put("127","张奇峰");
	
	return map;
}

function tablename(){

	var map = new Map();
	map.put("","-全部业务-");
	map.put("DC0010","机构信息");
	map.put("DC0011","仪器设备");
	map.put("DC0012","科室信息");
	map.put("DC0001","患者基本信息");
	map.put("DC0002","卫生服务人员");
	map.put("DC0003","卡信息");
	map.put("DC0004","卫生事件摘要");
	map.put("DC1001","门急诊就诊记录");
	map.put("DC1002","门急诊挂号记录");
	map.put("DC1003","门诊处方单");
	map.put("DC1004","处方明细表");
	map.put("DC1005","门诊结算发票");
	map.put("DC1006","门诊结算分类表");
	map.put("DC1007","门诊费用明细");
	map.put("DC1008","门诊诊疗处置单（存诊疗处置与检查检验收费信息）");
	map.put("DC1009","门诊诊疗处置明细单");
	map.put("DC2001","住院就诊记录");
	map.put("DC2002","住院医嘱");
	map.put("DC2003","住院结算表");
	map.put("DC2004","住院费用明细表");
	map.put("DC2005","住院结算分类表");
	map.put("DC2006","病危（重）通知书");
	map.put("DC2007","生命体征测量记录");
	map.put("DC2008","一般护理记录");
	map.put("DC2009","既往史");
	map.put("DC2010","输血记录");
	map.put("DC3001","检查结果报告");
	map.put("DC3010","检查类型代码表");
	map.put("DC4001","检验申请单");
	map.put("DC4002","检验指标结果表");
	map.put("DC4003","细菌结果表");
	map.put("DC4004","药敏表");
	map.put("DC5001","手术记录表");
	map.put("DC5002","手术明细表");
	map.put("DC7001","诊断记录表");
	map.put("DC7002","住院病案首页");
	map.put("DC7003","过敏药物表");
	map.put("DC7004","出院小结");
	map.put("DC1010","门（急）诊病历");
	map.put("DC8001","药品入库表");
	map.put("DC8002","销售表");
	map.put("DC7005","肿瘤专科病人治疗记录表");
	map.put("DC7006","肿瘤专科病人用药记录表");
	map.put("DC7007","产科分娩婴儿记录表");
	
	return map;
}

function selectOption(id,map){
	var list = map.keys();
	$("#"+id).empty();
	for(var i=0;i<list.length;i++){
		$("#"+id).append("<option value="+list[i]+">"+map.get(list[i])+"</option>");
	}
}

