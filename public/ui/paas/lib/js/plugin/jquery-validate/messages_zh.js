/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
(function ($) {
  //  $.validator.setDefaults({
  //    submitHandler: function (form) {
  //      form.submit();
  //    }
  //  });
  $.extend($.validator.messages, {
    required: "必须填写",
    remote: "请修正此栏位",
    email: "请输入有效的电子邮件",
    url: "请输入有效的网址",
    date: "请输入有效的日期",
    dateISO: "请输入有效的日期 (YYYY-MM-DD)",
    number: "请输入正确的数字",
    digits: "只可输入数字",
    creditcard: "请输入有效的信用卡号码",
    equalTo: "你的输入不相同",
    extension: "请输入有效的后缀",
    maxlength: $.validator.format("最多 {0} 个字"),
    minlength: $.validator.format("最少 {0} 个字"),
    rangelength: $.validator.format("请输入长度为 {0} 至 {1} 之間的字串"),
    range: $.validator.format("请输入 {0} 至 {1} 之间的数值"),
    max: $.validator.format("请输入不大于 {0} 的数值"),
    min: $.validator.format("请输入不小于 {0} 的数值")
  });
}(jQuery));

// 字符验证 
jQuery.validator.addMethod("stringCheck", function (value, element) {
  return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");
// 中文字两个字节 
jQuery.validator.addMethod("byteRangeLength", function (value, element, param) {
  var length = value.length;
  for (var i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 127) {
      length++;
    }
  }
  return this.optional(element) || (length >= param[0] && length <= param[1]);
}, "请确保输入的值在3-15个字节之间(一个中文字算2个字节)");
// 身份证号码验证 
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
  return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
}, "请正确输入您的身份证号码");
// 护照编号验证
jQuery.validator.addMethod("passport", function (value, element) {
  return this.optional(element) || function (value) {
    var str = number;
    //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
    var Expression = /(P\d{7})|(G\d{8})/;
    var objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
      return true;
    } else {
      return false;
    }
  };
}, "请正确输入您的护照编号");
// 手机号码验证 
jQuery.validator.addMethod("isMobile", function (value, element) {
  var length = value.length;
  var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
  return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");
// 电话号码验证 
jQuery.validator.addMethod("isTel", function (value, element) {
  var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678 
  return this.optional(element) || (tel.test(value));
}, "请正确填写您的固定电话号码（如：010-12345678）");
// 联系电话(手机/电话皆可)验证 
jQuery.validator.addMethod("isPhone", function (value, element) {
  var length = value.length;
  var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
  var tel = /^\d{3,4}-?\d{7,9}$/;
  return this.optional(element) || (tel.test(value) || mobile.test(value));

}, "请正确填写您的联系电话");
// 邮政编码验证 
jQuery.validator.addMethod("isZipCode", function (value, element) {
  var tel = /^[0-9]{6}$/;
  return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码");

/**
 * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
 *
 * @example jQuery.validator.methods.date("01/01/1900")
 * @result true
 *
 * @example jQuery.validator.methods.date("01/13/1990")
 * @result false
 *
 * @example jQuery.validator.methods.date("01.01.1900")
 * @result false
 *
 * @example <input name="pippo" class="{dateITA:true}" />
 * @desc Declares an optional input element whose value must be a valid date.
 *
 * @name jQuery.validator.methods.dateITA
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
jQuery.validator.addMethod("dateITA", function (value, element) {
  var check = false,
    re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    adata, gg, mm, aaaa, xdata;
  if (re.test(value)) {
    adata = value.split("/");
    gg = parseInt(adata[0], 10);
    mm = parseInt(adata[1], 10);
    aaaa = parseInt(adata[2], 10);
    xdata = new Date(aaaa, mm - 1, gg, 12, 0, 0, 0);
    if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
      check = true;
    } else {
      check = false;
    }
  } else {
    check = false;
  }
  return this.optional(element) || check;
}, "请输入正确的日期（dd/mm/yyyy）");
jQuery.validator.addMethod("dateNL", function (value, element) {
  return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
}, "请输入正确的日期");
jQuery.validator.addMethod("ipv4", function (value, element) {
  return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}, "请输入有效的 IP v4 地址");
jQuery.validator.addMethod("ipv6", function (value, element) {
  return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
}, "请输入有效的 IP v6 地址");
jQuery.validator.addMethod("nowhitespace", function (value, element) {
  return this.optional(element) || /^\S+$/i.test(value);
}, "不能含有空格");
jQuery.validator.addMethod("time", function (value, element) {
  return this.optional(element) || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
}, "请输入有效的时间, 00:00 ～ 23:59");
jQuery.validator.addMethod("time12h", function (value, element) {
  return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(value);
}, "请输入有效的时间（1～12 am/pm）");
// same as url, but TLD is optional
jQuery.validator.addMethod("url2", function (value, element) {
  return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}, jQuery.validator.messages.url);

var idCardNoUtil = {
  provinceAndCitys: {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  },
  powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],
  parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],
  genders: {
    male: "男",
    female: "女"
  },
  checkAddressCode: function (addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check) return false;
    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true;
    } else {
      return false;
    }
  },
  checkBirthDayCode: function (birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
    if (!check) return false;
    var yyyy = parseInt(birDayCode.substring(0, 4), 10);
    var mm = parseInt(birDayCode.substring(4, 6), 10);
    var dd = parseInt(birDayCode.substring(6), 10);
    var xdata = new Date(yyyy, mm - 1, dd);
    if (xdata > new Date()) {
      return false; //生日不能大于当前日期
    } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
      return true;
    } else {
      return false;
    }
  },
  getParityBit: function (idCardNo) {
    var id17 = idCardNo.substring(0, 17);

    var power = 0;
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
    }

    var mod = power % 11;
    return idCardNoUtil.parityBit[mod];
  },
  checkParityBit: function (idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase();
    if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
      return true;
    } else {
      return false;
    }
  },
  checkIdCardNo: function (idCardNo) {
    //15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check) return false;
    //判断长度为15位或18位
    if (idCardNo.length == 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo);
    } else {
      return false;
    }
  },
  //校验15位的身份证号码
  check15IdCardNo: function (idCardNo) {
    //15位身份证号码的基本校验
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    var birDayCode = '19' + idCardNo.substring(6, 12);
    //校验日期码
    return idCardNoUtil.checkBirthDayCode(birDayCode);
  },
  //校验18位的身份证号码
  check18IdCardNo: function (idCardNo) {
    //18位身份证号码的基本格式校验
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
    if (!check) return false;
    //校验地址码
    var addressCode = idCardNo.substring(0, 6);
    check = idCardNoUtil.checkAddressCode(addressCode);
    if (!check) return false;
    //校验日期码
    var birDayCode = idCardNo.substring(6, 14);
    check = idCardNoUtil.checkBirthDayCode(birDayCode);
    if (!check) return false;
    //验证校检码
    return idCardNoUtil.checkParityBit(idCardNo);
  },
  formateDateCN: function (day) {
    var yyyy = day.substring(0, 4);
    var mm = day.substring(4, 6);
    var dd = day.substring(6);
    return yyyy + '-' + mm + '-' + dd;
  },
  //获取信息
  getIdCardInfo: function (idCardNo) {
    var idCardInfo = {
      gender: "", //性别
      birthday: "" // 出生日期(yyyy-mm-dd)
    };
    if (idCardNo.length == 15) {
      var aday = '19' + idCardNo.substring(6, 12);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    } else if (idCardNo.length == 18) {
      var aday = idCardNo.substring(6, 14);
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
      if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
        idCardInfo.gender = idCardNoUtil.genders.female;
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male;
      }
    }
    return idCardInfo;
  },

  getId15: function (idCardNo) {
    if (idCardNo.length == 15) {
      return idCardNo;
    } else if (idCardNo.length == 18) {
      return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
    } else {
      return null;
    }
  },

  getId18: function (idCardNo) {
    if (idCardNo.length == 15) {
      var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
      var parityBit = idCardNoUtil.getParityBit(id17);
      return id17 + parityBit;
    } else if (idCardNo.length == 18) {
      return idCardNo;
    } else {
      return null;
    }
  }
};