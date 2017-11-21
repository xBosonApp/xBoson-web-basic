var LongCredit = LongCredit || {};

LongCredit.AgricultureSelect = function (options) {
    var opts = {id: 'id', clickFun: function () {
        }, dataList: [], defaultValue: '', single: true, name: '', value: '', group: false},
        _this, _selectValue = {value: []}, _hasDraw = false, _isFirstGroupLoad = true;
    this.options = $.extend(false, opts, options);
    _this = this;

    this.clear = function () {
        _hasDraw = false;
        _this.options = $.extend(false, _this.options, {dataList:[]});
        return this;
    };

    this.ext = function (options) {
        _this.options = $.extend(false, _this.options, options);
    };

    this.draw = function (options) {
        _this.options = $.extend(false, _this.options, options);
        if (_this.options.group) {
            agricultureSelect.drawGroup();
        } else {
            agricultureSelect.draw();
        }
    };

    this.reDraw = function (options) {
        _this.options = $.extend(false, _this.options, options);
        if (_this.options.group) {
            agricultureSelect.reDrawGroup();
        } else {
            agricultureSelect.reDraw();
        }
    };

    this.getSelectValue = function () {
        return _selectValue.value;
    };

    this.getSelectName = function () {
        for (var i = 0; i < _this.options.dataList.length; i++) {
            if (_this.options.dataList[i][_this.options.value] == _selectValue.value) {
                return _this.options.dataList[i][_this.options.name];
            }
        }
    };

    this.select = function (select) {
        if (_this.options.single) {
            if (typeof select == 'string' || typeof select == 'undefined') {
                _selectValue.value = select;
            } else {
                _selectValue.value = select[0];
            }
        } else {
            _selectValue.value = select;
        }
        agricultureSelect.select(_this.options.id, _selectValue, _this.options.single);
    };

    var agricultureSelect = {
        clear: function () {
            $("#" + _this.options.id + " .weidu_main_content").html("<ul></ul>");
        },
        draw: function () {
            _selectValue.value = agricultureSelect.getSelectDatas();
            if (_this.options.dataList != null && _this.options.dataList.length > 0) {
                var selectValue = [];
                var selectOptions = this.createOptions(_this.options.dataList, _this.options.value, _this.options.name);
                this.initSelect(_this.options.id, 200, selectOptions, selectValue, _this.options.title, function (select) {
                    if (_this.options.single) {
                        this.selectValue = select[0];
                    } else {
                        this.selectValue = select;
                    }
                    _selectValue.value = this.selectValue;
                    if (typeof _this.options.clickFun == "function") {
                        _this.options.clickFun.call(this);
                    } else {
                        var fun = _this.options.clickFun.replace(/;$/g, '');
                        var backCall = eval("(" + fun + ")");
                        if (typeof backCall == "function") {
                            backCall.call(this);
                        }
                    }
                }, _this.options.single, _selectValue);
                this.select(_this.options.id, _selectValue, _this.options.single);
                _hasDraw = true;
            }
        },
        reDraw: function () {
            if (!_hasDraw) {
                this.clear();
                this.draw();
            } else {
                _selectValue.value = this.getSelectDatas();
                this.select(_this.options.id, _selectValue, _this.options.single);
            }
        },
        getSelectDatas: function () {
            var selectDatas = [];
            if (_this.options.defaultValue == '' ||
                _this.options.defaultValue == null ||
                typeof _this.options.defaultValue == 'undefined') {
                if (_this.options.single) {
                    _this.options.defaultValue = 'max';
                } else {
                    //TODO
                }
            }
            var dfs = _this.options.defaultValue.toString().split(",");
            for (var i = 0; i < dfs.length; i++) {
                if (_this.options.dataList != null && _this.options.dataList.length > 0) {
                    if (dfs[i] == 'max') {
                        selectDatas.push(_this.options.dataList[0][_this.options.value]);
                    } else if (dfs[i] == 'min') {
                        selectDatas.push(_this.options.dataList[_this.options.dataList.length - 1][_this.options.value]);
                    } else {
                        if (dfs[i] != null && dfs[i] != '') {
                            selectDatas.push(dfs[i]);
                        }
                    }
                }
            }
            if (_this.options.single && selectDatas.length > 0) {
                return selectDatas[0];
            } else if (!_this.options.single && selectDatas.length > 0) {
                return selectDatas;
            } else {
                return null;
            }
        },
        createOptions: function (options, idKey, textKey) {
            var data_options = "";
            for (var i = 0; i < options.length; i++) {
                data_options += "<li><a href='javascript:void(0)' data-value='" + options[i][idKey] + "'>" + $.trim(options[i][textKey]) + "</a></li>";
            }
            return data_options;
        },
        initSelect: function (id, width, index_options, select, text, callBack, single, datas) {
            $("#" + id).find(".weidu_content").hide();
            $("#" + id + "_Tip").text("选择" + text);
            $("#" + id).find(".weidu_title").text("选择" + text);
            $("#" + id).find(".weidu_main_title").find("span").text("选择" + text);
            if (single) {
                $("#" + id).find(".weidu_main_title").find("a").hide();
                $("#" + id).find("ul").addClass("ul_single");
                $("#" + id).find(".ul_single").append(index_options);
                $("#" + id).find(".weidu_main_foot").remove();
                $("#" + id).find(".ul_single").find("li").unbind().bind({
                    mouseenter: function () {
                        $(this).addClass("li_hover");
                    }, mouseleave: function () {
                        $(this).removeClass("li_hover");
                    }, mousedown: function () {
                        $(this).closest(".weidu_content").slideUp().siblings(".weidu_title").text($(this).text());
                        select.length = 0;
                        select.push($(this).find("a").attr("data-value"));
                        callBack.call(this, select);
                    }
                });
            } else {
                $("#" + id).find(".weidu_main_title").find("a").show();
                $("#" + id).find("ul").addClass("ul_more");
                $("#" + id).find(".ul_more").append(index_options);
                $("#" + id).find(".ul_more").find("li").each(function () {
                    $(this).find("a").addClass("a_normal");
                });
                $("#" + id).find(".weidu_main_button_sure").unbind().bind({
                    mousedown: function () {
                        var click_length = $(this).parent().parent().find(".ul_more").find(".a_click").length;
                        if (click_length > 50) {
                            staticDialog.openDialog({
                                width: 400,
                                height: 200,
                                title: '消息提醒',
                                html: "<br />选择的个数不能超过50<br /><br /><br /><br />"
                            });
                            return;
                        }
                        $(this).removeClass("weidu_button_normal").addClass("weidu_button_click");
                        select.length = 0;
                        $("#" + id).find(".ul_more li a").each(function () {
                            if ($(this).attr("class") == 'a_click') {
                                select.push($(this).attr("data-value"));
                            }
                        });
                        $(this).closest(".weidu_content").slideUp(300);
                        callBack.call(this, select);
                    }, mouseup: function () {
                        $(this).removeClass("weidu_button_click").addClass("weidu_button_normal");
                    }
                })//end
                $("#" + id).find(".weidu_main_button_delete").unbind().bind({
                    mousedown: function () {
                        $(this).removeClass("weidu_button_normal").addClass("weidu_button_click");
//                        $(this).closest(".weidu_content").slideUp(300);
                    }, mouseup: function () {
                        $(this).removeClass("weidu_button_click").addClass("weidu_button_normal");
                    }
                })//end
//                $("#" + id).find(".ul_more li").unbind().bind({
//                    mouseenter:function(){
//                        $(this).addClass("li_hover");
//                    },mouseleave:function(){
//                        $(this).removeClass("li_hover");
//                    },mousedown:function(){
//                        $(this).removeClass("li_hover").addClass("li_click").siblings().removeClass("li_click");
//                        $(this).closest(".weidu_main_content").siblings(".weidu_main_title").find("a").removeClass().addClass("a_normal").text("全选");
//                        if($(this).children("a").hasClass("a_normal")){
//                            $(this).find("a").removeClass("a_normal").addClass("a_click");
//                        }else{
//                            $(this).find("a").removeClass("a_click").addClass("a_normal");
//                        }
//                    },mouseup:function(){
//                        var li_length = $(this).closest(".ul_more").find("li").length;
//                        var click_length = $(this).closest(".ul_more").find(".a_click").length;
//                        if(li_length==+click_length){
//                            $(this).closest(".weidu_main_content").siblings(".weidu_main_title").find("a").removeClass("a_normal").addClass("a_click")
//                        };
//                    }
//                })//end
            }
            this.bindClick(id, this.select, datas, single);
            this.bindClass(id);
            $("#" + id).show();
        },
        select: function (id, datas, single) {
            if (typeof datas.value == 'undefined' || datas.value == null || datas.value == '') {
                if (single) {
                    datas.value = $("#" + id).find(".ul_single li a").first().attr("data-value");
                } else {
                    datas.value = [$("#" + id).find(".ul_more li a").first().attr("data-value")];
                }
            }
            if (single) {
                $("#" + id).find(".ul_single li a").each(function () {
                    $(this).parent().removeClass();
                    if ($(this).attr("data-value") == datas.value) {
                        if (!_this.options.group) {
                            $("#" + id).find(".weidu_title").text($(this).text());
                        }
                        $(this).parent().removeClass().addClass("li_hover_select");
                    }
                });
            } else {
                var selectI = 0;
                $("#" + id).find(".weidu_main_title a").removeClass().addClass("a_normal").text("全选");
                $("#" + id).find(".ul_more li a").removeClass().addClass("a_normal");
                $("#" + id).find(".ul_more li a").each(function () {
                    for (var i = 0; i < datas.value.length; i++) {
                        if ($(this).attr("data-value") == datas.value[i]) {
                            $(this).removeClass().addClass("a_click");
                            selectI++;
                            break;
                        }
                    }
                });
                if (selectI == $("#" + id).find(".ul_more li a").length) {
                    $("#" + id).find(".weidu_main_title a").removeClass().addClass("a_click").text("取消");
                }
            }
        },
        bindClick: function (id, callBack, datas, single) {
            $("#" + id).unbind().bind({
                mouseleave: function () {
                    $(this).find(".weidu_content").fadeOut();
                }
            })//end
            $("#" + id).find(".weidu_title").unbind().bind({
                mousedown: function () {
                    if ($(this).siblings(".weidu_content").is(":hidden")) {
                        //适应屏幕宽度
                        agricultureSelect.resizeLeft(id);
                        callBack.call(this, id, datas, single);
                        $(this).siblings(".weidu_content").slideDown("500");
                    } else {
                        $(this).siblings(".weidu_content").slideUp("500");
                    }
                }, mouseenter: function () {

                    $(this).attr("title", $(this).html())

                }
            })//end
            $("#" + id).find(".weidu_main_title a").unbind().bind({
                click: function () {
                    if ($(this).hasClass("a_normal")) {
                       /* if ($("#" + id).find(".ul_more li a").length > 50) {
                            staticDialog.openDialog({
                                width: 400,
                                height: 200,
                                title: '消息提醒',
                                html: "<br />选择的个数不能超过50<br /><br /><br /><br />"
                            });
                            return;
                        }*/
                        $(this).removeClass("a_normal").addClass("a_click").text("取消").closest(".weidu_main_title").siblings(".weidu_main_content").find("li").children("a").removeClass().addClass("a_click");
                    } else {
                        $(this).removeClass("a_click").addClass("a_normal").text("全选").closest(".weidu_main_title").siblings(".weidu_main_content").find("li").children("a").removeClass().addClass("a_normal");
                    }
                }
            })
            $("#" + id).find(".ul_more li").unbind().bind({
                mouseenter: function () {
                    $(this).addClass("li_hover");
                }, mouseleave: function () {
                    $(this).removeClass("li_hover");
                }, mousedown: function () {
                    $(this).removeClass("li_hover").addClass("li_click").siblings().removeClass("li_click");
                    $(this).closest(".weidu_main_content").siblings(".weidu_main_title").find("a").removeClass().addClass("a_normal").text("全选");
                    if ($(this).children("a").hasClass("a_normal")) {
                        $(this).find("a").removeClass("a_normal").addClass("a_click");
                    } else {
                        $(this).find("a").removeClass("a_click").addClass("a_normal");
                    }
                }, mouseup: function () {
                    var li_length = $(this).closest(".ul_more").find("li").length;
                    var click_length = $(this).closest(".ul_more").find(".a_click").length;
                    if (li_length == +click_length) {
                        $(this).closest(".weidu_main_content").siblings(".weidu_main_title").find("a").removeClass("a_normal").addClass("a_click").text("取消");
                    }
                    ;
                }
            })
        },
        resizeLeft: function (id) {
            var positionLeft = $("#" + id).position().left;
            var dropWidth = $("#" + id).find(".weidu_content").width();
            var componentLeft = positionLeft + dropWidth;

            var windowWidth = $(".special_chart").position().left + $(".special_chart").width();

            var clientWidth = windowWidth - 20;//偏移量
            if (componentLeft > clientWidth) {
                var offsetLeft = componentLeft - clientWidth;
                $("#" + id).find(".weidu_content").css("margin-left", -offsetLeft);
                $("#" + id).find(".weidu_content_title").css("left", 10 + offsetLeft);
            } else {
                $("#" + id).find(".weidu_content").css("margin-left", 0);
                $("#" + id).find(".weidu_content_title").css("left", 10);
            }
        },
        bindClass: function (id) {
            $("#" + id).find(".weidu_main_button_sure , .weidu_main_button_delete").addClass("weidu_button_normal");
        },
        drawGroup: function () {
            $("#" + _this.options.id + "_Tip").html(_this.options.title + "选择");
            $("#" + _this.options.id).find(".weidu_title").html("选择" + _this.options.title);
            $("#" + _this.options.id).find(".weidu_content_main").html("");
            this.createGroupHtml();
            $("#" + _this.options.id).find(".weidu_content").hide();
            this.bindGroupClick(_this.options.id, function (select) {
                if (_this.options.single) {
                    this.selectValue = select;
                }
                _selectValue.value = this.selectValue;
                if (typeof _this.options.clickFun == "function") {
                    _this.options.clickFun.call(this);
                } else {
                    var fun = _this.options.clickFun.replace(/;$/g, '');
                    var backCall = eval("(" + fun + ")");
                    if (typeof backCall == "function") {
                        backCall.call(this);
                    }
                }
            });
        },
        reDrawGroup: function () {

        },
        createGroupHtml: function () {
            var groups = this.getGroups();
            this.initGroup(groups);
            for (var i = 0; i < groups.length; i++) {
                var optionStr = this.createOptions(this.getOptions(groups[i]), _this.options.value, _this.options.name);
                this.initOptions(optionStr, i);
            }
            this.groupSelect(groups);
            $("#" + _this.options.id).show();
        },
        splitGroup: function () {
            var arr = {};
            if (_this.options.defaultValue != '') {
                var defaultValues = _this.options.defaultValue.split(",");
                for (var i = 0; i < defaultValues.length; i++) {
                    var dv = defaultValues[i].split(":");
                    if (dv.length == 2) {
                        arr[dv[0]] = dv[1];
                    }
                }
            }
            return arr;
        },
        getGroups: function () {
            var groups = [], _g = '';
            for (var i = 0; i < _this.options.dataList.length; i++) {
                if (_g != _this.options.dataList[i]['group']) {
                    groups.push(_this.options.dataList[i]['group']);
                    _g = _this.options.dataList[i]['group'];
                }
            }
            return groups;
        },
        getOptions: function (group) {
            var options = [];
            for (var i = 0; i < _this.options.dataList.length; i++) {
                if (_this.options.dataList[i]['group'] == group) {
                    options.push({name: _this.options.dataList[i][_this.options.name], value: _this.options.dataList[i][_this.options.value]});
                }
            }
            return options;
        },
        initGroup: function (groups) {
            for (var i = 0; i < groups.length; i++) {
                var html = '<div class="weidu_main_title">' +
                    '<span>' + groups[i] + '</span>' +
                    '</div>' +
                    '<div class="weidu_main_content">' +
                    '<ul id="' + _this.options.id + '_group_' + i + '" class="ul_single">' +
                    '</ul>' +
                    '</div><div style="clear:both;"></div>';
                $("#" + _this.options.id).find(".weidu_content_main").append(html);
            }
        },
        initOptions: function (optionStr, i) {
            $("#" + _this.options.id + "_group_" + i).html(optionStr);
        },
        bindGroupClick: function (id, callBack) {
            var groupSelect = [];
            $("#" + id).unbind().bind({
                mouseleave: function () {
                    $(this).find(".weidu_content").fadeOut();
                }
            })//end
            $("#" + id).find(".weidu_title").unbind().bind({
                mousedown: function () {
                    if ($(this).siblings(".weidu_content").is(":hidden")) {
                        $(this).siblings(".weidu_content").slideDown("500");
                    } else {
                        $(this).siblings(".weidu_content").slideUp("500");
                    }
                }
            })//end
            $("#" + id).find(".ul_single").find("li").unbind().bind({
                mouseenter: function () {
                    $(this).addClass("li_hover");
                }, mouseleave: function () {
                    $(this).removeClass("li_hover");
                }, mousedown: function () {
                    $(this).closest(".weidu_content").slideUp();
                    $(this).siblings("li").removeClass();
                    $(this).removeClass().addClass("li_hover_select");
                    groupSelect.length = 0;
                    $("#" + id).find(".ul_single").each(function () {
                        $(this).find("li").each(function () {
                            if ($(this).hasClass("li_hover_select")) {
                                groupSelect.push($(this).find("a").attr("data-value"));
                            }
                        });
                    });
                    callBack.call(this, groupSelect);
                }
            });
        },
        groupSelect: function (groups) {
            var sv = {};
            var arr = this.splitGroup();
            for (var i = 0; i < groups.length; i++) {
                sv['value'] = arr[groups[i]];
                this.select(_this.options.id, sv, true);
            }
        }
    };
};
