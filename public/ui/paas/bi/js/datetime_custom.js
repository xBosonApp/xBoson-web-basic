 //可动态修改时间类型的控件
function chart_datepicker(con){
    var parent_jq = (typeof con=='undefined')?$(".form_xzqujl"):con;
    var i_fr = parent_jq.find('[index=dt_from]'),
        i_ty = parent_jq.find('[index=dt_type]');
		i_fr.css({
			cursor: 'cell'
		});
		i_ty.change(function () {
			_changeDate(i_ty.val());
		}).prop('checked', true).trigger('change');
		function _set_data_parm(_r_parm) {
			i_fr.val(_r_parm.dt_from);
			_changeDate(DT_DAY);
			i_ty.val(_r_parm.dt_type);
			_changeDate(_r_parm.dt_type);
		}
    function _get_data_parm(){
      
    }
    
    function _changeDate(_dtype) {
      var date_opt = get_option(i_fr,_dtype);
      date_opt = $.extend({}, date_opt, {language:"zh-CN",autoclose:true});
      _set_datepicker(i_fr,date_opt);
    }

		return {
			// 日期类型
			DT_DAY: 1,
			DT_YEAR: 3,
			DT_MONTH: 4,
			// 改变控件中时间的(类型)格式,               并保持原日期数据不变
			// function(int:[date type num])
			changeType: _changeDate,
			// 设置日期到控件
			// function(object:[date_parm_key])
			set: _set_data_parm,
			// 从控件取得日期,                返回的日期经过了有效性／格式检查及补全
			// function() : return object:[date_parm_key]
			get: _get_data_parm,
		}
  }

//单纯的时间控件
function new_datepicker(con,type){
  //添加样式
  con.css({
		cursor: 'cell'
	});
	var option =get_option(con,type);
	//修改时间	
  _set_datepicker(con,option);
}

function get_option(_con,_dtype) {
		var date_opt, func;
		var DT_YEA = 1, DT_MON = 3, DT_DAY = 4, DT_DAYs=5;
		(func = _con.data('removeSeason')) && func();
    switch (parseInt(_dtype)) {
			case DT_YEA:
				date_opt = {
					forceParse: false,
					format: "yyyy",
					minViewMode: 2,
					startView: 1
				};
				break;
			case DT_MON:
				date_opt = {
					forceParse: false,
					format: "yyyy-mm",
					minViewMode: 1
				};
				break;
			case DT_DAY:
				date_opt = {
					format: "yyyy-mm-dd",
					endDate: zy.tool.Date.getDate()
				};
				break;
				case DT_DAYs:
				date_opt = {
					format: "yyyymmdd",
					endDate: zy.tool.Date.getDate()
				};
				break;
			default:
				throw new Error("无效的数据格式:" + _dtype);
			}
		date_opt = $.extend({}, date_opt, {language:"zh-CN",autoclose:true});
		return date_opt;
  }

//设置时间控件
function _set_datepicker(_dt_input, _opt) {
	var od = _dt_input.datepicker('getDate');
	if (isNaN(od.getTime())) {
		od = _dt_input.val();
	}
	_dt_input.datepicker('remove');
	_dt_input.datepicker(_opt);	
	_dt_input.datepicker('setDate', od);
}

//获取日期
function getDates(num,id){
  var dd=new Date();
  dd.setDate(dd.getDate()+num);
  var y=dd.getFullYear();
  var m=dd.getMonth()+ 1;
  var d=dd.getDate();
  if(m<10){m='0'+m;}
  if(d<10){d='0'+d;}
  if(!id)
  return y+"-"+m+"-"+d;
  if(id==5)
  return y+m+d;
}
    