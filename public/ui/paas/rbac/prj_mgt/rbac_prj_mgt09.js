rbac_prj_mgt09 = (function () {
  var PT = rbac_prj_mgt09.prototype;
  var thiz;
  PT._g = {
    op_type: '',
    prjid: '',
    pageid: '',
    elements: [],
    pages: []
  };

  $.views.settings.allowCode(true);
  var modal = $('#rbac_prj_mgt09_modal');
  var form = $('#rbac_prj_mgt09_form');
  var elementContainer = modal.find('#rbac_prj_mgt09_elements');
  var pageContainer = modal.find('#rbac_prj_mgt09_pages');
  var tmplElements = $.templates('#rbac_prj_mgt09_tmpl_elements');
  var tmplPages = $.templates('#rbac_prj_mgt09_tmpl_pages');
  var selfid = $('#rbac_prj_mgt09_selfid').attr('data-selfid');
  var rbac_prj_mgt12Container = $('#rbac_prj_mgt01_rbac_prj_mgt12_modal');
  var DEFAULT_INIT_ELEMENT_ID = '0';

  function rbac_prj_mgt09(prjid, pageid, op_type) {
    thiz = this;
    thiz._g.op_type = op_type;
    thiz._g.prjid = prjid;
    thiz._g.pageid = pageid;
    // 隐藏时将自身删除
    modal.on('hidden.bs.modal', function () {
      $('#'+$('#rbac_prj_mgt09_selfid').attr('data-selfid')).remove();
    });
    modal.modal('show');
    form.find('input[name=prjid]').val(prjid);
    form.find('input[name=op_type]').val(op_type);
    loadPageInfo();
    registerEvents();
    return this;
  }

  // 同步页面上的元素和事件数据到 thiz._g.elements
  function syncElements() {
    var tmpElementIds = {};
    var newElements = [];
    var fieldsetElements = $('fieldset[name=fieldsetelements]');
    fieldsetElements.each(function(i, v) {
      var elementid = $.trim($('input[name=elementid]',this).val());
      var elementnm = $.trim($('input[name=elementnm]',this).val());
      var children = [];
      var divSrv = $('div[id=divsrv]',this);
      divSrv.each(function(ii, vv) {
        var inputApi = $('input[name=api]',this);
        if (inputApi && inputApi.val()) {
          var api = inputApi.val().split('/');
          children[ii] = {appid:api[0],moduleid:api[1],apiid:$.trim(api[2]),appnm:$.trim(api[3]),modulenm:api[4],apinm:api[5]};
        }
        var inputModel = $('input[name=model]',this);
        if (inputModel && inputModel.val()) {
          var model = inputModel.val().split('/');
          children[ii] = {modelid:$.trim(model[0]),modelnm:$.trim(model[1])};
        }
      });
      newElements[i]={elementid: elementid, elementnm: elementnm, children: children};
    });
    thiz._g.elements = newElements;
  }

  // 同步页面上的关联页面数据到 thiz._g.pages
  function syncPages() {
    var tmpPages = {};
    var newPages = [];
    var divPages = $('div[id=divpages]');
    divPages.each(function(i, v) {
      var next_pageid = $.trim($('input[name=next_pageid]',this).val());
      var pagenm = $.trim($('input[name=pagenm]',this).val());
      newPages[i]={next_pageid: next_pageid, pagenm: pagenm};
    });
    thiz._g.pages = newPages;
  }

  // 注册事件
  function registerEvents() {
    // 注册添加元素事件
    form.find('#rbac_prj_mgt09_btn_add_element').click(function() {
      var flag = true;
      syncElements();
      // 检查是否还有未设定的元素，防止在页面上无限添加空元素
      $.each(thiz._g.elements, function(i, v){
        if (!v.elementid || $.trim(v.elementid)==='') {
          flag = false;
          zy.ui.msg('提示信息：', '还有未设定的页面元素信息', 'w');
          return;
        }
      });
      if (flag) {
        $.merge(thiz._g.elements, [{elementid:'',elementnm:'',children:[]}]);
        thiz.loadElements(thiz._g.elements);
      }
    });

    // 注册添加关联页面事件
    form.find('#rbac_prj_mgt09_btn_add_page').click(function() {
      var flag = true;
      syncPages();
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt12.htm?&prjid=' + thiz._g.prjid, rbac_prj_mgt12Container, function(){
        var rbac_prj_mgt12Obj = new rbac_prj_mgt12(thiz._g.prjid, thiz.loadNewPages);
      });
    });

    form.validate({
      // Rules for form validation
      rules: {
        pageid: {
          required: true,
          isAlphabetNumber: true,
          maxlength: 40
        },
        pagenm: {
          required: true,
          maxlength: 100
        },
        page_path: {
          required: true,
          maxlength: 200
        }
      },
      // 验证成功后保存
      submitHandler: function(frm) {
        syncElements();
        syncPages();
        var hasError = false;
        // 验证元素
        var tmpElementIds = {};
        var fieldsetElements = $('fieldset[name=fieldsetelements]');
        fieldsetElements.each(function() {
          var inputElementId = $('input[name=elementid]',this);
          var elementid = inputElementId.val();
          if (elementid!==DEFAULT_INIT_ELEMENT_ID){
            if ($.trim(elementid)===''){
              zy.ui.msg('提示信息：', '元素ID不能为空', 'w');
              inputElementId.focus();
              hasError = true;
              return false;
            }
            if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(elementid) === false) {
              zy.ui.msg('提示信息：', '元素ID只能英文字母开头，只含有英文字母、数字和下划线', 'w');
              inputElementId.focus();
              hasError = true;
              return false;
            }
            if (elementid.length>40) {
              zy.ui.msg('提示信息：', '元素ID的长度不能超过40', 'w');
              inputElementId.focus();
              hasError = true;
              return false;
            }
            // 重复验证
            if (tmpElementIds[elementid]) {
              zy.ui.msg('提示信息：', '重复的页面ID ' + elementid, 'w');
              hasError = true;
              return false;
            } else {
              tmpElementIds[elementid] = 0;
            }
            var inputElementNm = $('input[name=elementnm]',this);
            var elementnm = inputElementNm.val();
            if ($.trim(elementnm)===''){
              zy.ui.msg('提示信息：', '元素名称不能为空', 'w');
              inputElementNm.focus();
              hasError = true;
              return false;
            }
            if (elementnm.length>100) {
              zy.ui.msg('提示信息：', '元素名称的长度不能超过100', 'w');
              inputElementNm.focus();
              hasError = true;
              return false;
            }
          }
        });
        if (hasError) {
          return false;
        }

        // 验证关联页面
        var tmpPages = {};
        var divPages = $('div[id=divpages]');
        divPages.each(function() {
          var inputNextPageId = $('input[name=next_pageid]',this);
          var next_pageid = inputNextPageId.val();
          if ($.trim(next_pageid)===''){
            zy.ui.msg('提示信息：', '关联页面ID不能为空', 'w');
            inputNextPageId.focus();
            hasError = true;
            return false;
          }
          if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(next_pageid) === false) {
            zy.ui.msg('提示信息：', '关联页面ID只能英文字母开头，只含有英文字母、数字和下划线', 'w');
            inputNextPageId.focus();
            hasError = true;
            return false;
          }
          if (next_pageid.length>40) {
            zy.ui.msg('提示信息：', '关联页面ID的长度不能超过40', 'w');
            inputNextPageId.focus();
            hasError = true;
            return false;
          }
          // 重复验证
          if (tmpPages[next_pageid]) {
            zy.ui.msg('提示信息：', '重复的页面ID ' + next_pageid, 'w');
            hasError = true;
            return false;
          } else {
            tmpPages[next_pageid] = 0;
          }
          var inputPageNm = $('input[name=pagenm]',this);
          var pagenm = inputPageNm.val();
          if ($.trim(pagenm)===''){
            zy.ui.msg('提示信息：', '关联页面名称不能为空', 'w');
            inputPageNm.focus();
            hasError = true;
            return false;
          }
          if (pagenm.length>100) {
            zy.ui.msg('提示信息：', '关联页面名称的长度不能超过100', 'w');
            inputPageNm.focus();
            hasError = true;
            return false;
          }
        });
        if (hasError) {
          return false;
        }

        zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
        zy.g.am.mod = 'XMGL';
        zy.g.am.json = true;// JSON提交

        // 组织提交数据
        var submitData = {};
        submitData.op_type=thiz._g.op_type;
        submitData.prjid=thiz._g.prjid;
        submitData.pageid=form.find('input[name=pageid]').val();
        submitData.pagenm=form.find('input[name=pagenm]').val();
        submitData.page_path=form.find('input[name=page_path]').val();
        submitData.elementinfo=thiz._g.elements;
        submitData.nextpages=thiz._g.pages;
        zy.net.post('api/prjpagemaint', function (msg) {
          form.formDisable(false);
          if (msg) {
            rbac_prj_mgt11_cache[thiz._g.prjid].v.btnSearch.trigger('click');
            modal.modal('hide');
            zy.ui.msg('提示信息：', '保存成功！', 's');
          }
        }, submitData, null, function(msg){
          if (msg) {
            zy.ui.msg('保存失败：', msg.msg, 'e');
          }
          form.formDisable(false);
        });
        form.formDisable(true);
      },
      // Do not change code below
      errorPlacement: function (error, element) {
        error.insertAfter(element.parent());
      }
	});
  }

  // 加载页面信息
  var loadPageInfo = function() {
    var domPageId = $('#rbac_prj_mgt09_form').find('input[name=pageid]');
    form.clearForm();
    // 更新
    if (thiz._g.op_type==='u') {
      zy.g.am.mod = 'XMGL';
      zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
      zy.net.get('api/prjpageinfo',
        function(msg){
          if (msg.pageinfo && msg.pageinfo.length > 0) {
            form.json2form(msg.pageinfo[0]);
          }
          thiz.loadElements(msg.elementinfo);
          thiz.loadPages(msg.nextpages);
        },
        {prjid:thiz._g.prjid,pageid:thiz._g.pageid}, null, null);
      domPageId.attr('readonly', 'readonly');
    } else if (thiz._g.op_type==='i') {
      // 添加
      form.clearForm();
      thiz.loadElements(null);

      domPageId.blur(function(){
        var userPageId = domPageId.val();
        thiz._g.pageid = userPageId;
        if (_.isEmpty(userPageId)) {
          return false;
        }
        zy.g.am.mod = 'XMGL';
        zy.g.am.app = '03229cbe4f4f11e48d6d6f51497a883b';
        zy.net.get('api/prjpagereplicationcheck',
          function(msg){},
          {pageid:userPageId},
          null,
          function(msg){
            if(msg.ret==='8'){
              zy.ui.msg('错误：', '页面ID ' + userPageId + ' 已被占用', 'e');
            } else if(msg.ret!=='11'){
              zy.ui.msg('请求失败', msg.ret + ' : ' + msg.msg, 'e');
            }
          });
      });
    }
  };

  // 加载页面元素及其事件服务
  PT.loadElements = function(data) {
    if (!data || data.length===0) {
      data = [{elementid:DEFAULT_INIT_ELEMENT_ID,elementnm:'初始化事件',children:[]}];
    }
    // 设定标记方便模板处理
    $.each(data, function(i,v){
      if(v.elementid===DEFAULT_INIT_ELEMENT_ID){
        v.is_init=true;
      }
      var children = v.children;
      if (children) {
        $.each(children, function(ii,vv){
          if(vv.modelid && vv.modelid!==''){
            vv.is_model=true;
          }
        });
      }
    });
    thiz._g.elements = data;

    var html = tmplElements.render(data);
    elementContainer.empty();
    elementContainer.html(html);

    // 注册选择服务事件
    form.find('#fieldsetelements legend div').on('click','#set_srv',function () {
      syncElements();
      var elementid = $(this).parent().find('input[name=elementid]').val();
      var api = '';
      var model = '';
      $.each(thiz._g.elements, function(i,v){
        if (v.elementid===elementid) {
          $.each(v.children, function(ii,vv){
            if (vv.appid && vv.appid!=='') {
              api = api + vv.appid + ',' + vv.moduleid + ',' + vv.apiid + '|';
            }
            if (vv.modelid && vv.modelid!=='') {
              model = model + vv.modelid + '|';
            }
          });
          return false;
        }
      });
      api = api.substring(0, api.length - 1);
      model = model.substring(0, model.length - 1);
      //zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt10.htm?elementid=' + elementid + '&prjid=' + thiz._g.prjid + '&pageid=' + thiz._g.pageid + '&api=' + api + '&model=' + model + '&mgt09_selfid=' + selfid, $('#rbac_prj_mgt01_rbac_prj_mgt10_modal'));
      zy.net.loadHTML('rbac/prj_mgt/rbac_prj_mgt10.htm?mgt09_selfid=' + selfid, $('#rbac_prj_mgt01_rbac_prj_mgt10_modal'),function(){
        var rbac_prj_mgt10Obj = new rbac_prj_mgt10(thiz._g.prjid,thiz._g.pageid,elementid,api,model,selfid);
      });
    });

    // 注册删除元素事件
    form.find('#fieldsetelements legend div').on('click','#del_element',function () {
      syncElements();
      var elementid = $(this).parent().find('input[name=elementid]').val();
      $.each(thiz._g.elements, function(i, v) {
        if (v.elementid === elementid) {
          thiz._g.elements.splice(i,1);
          return false;// 只退出 each 循环
        }
      });
      thiz.loadElements(thiz._g.elements);
    });
  };

  // 加载关联页面
  PT.loadPages = function(data) {
    if (!data || data.length===0) {
      pageContainer.empty();
      return;
    }
    var html = tmplPages.render(data);
    pageContainer.empty();
    pageContainer.html(html);

    // 注册删除关联页面事件
    form.find('#rbac_prj_mgt09_pages div').on('click','#del_next_page',function () {
      syncPages();
      var next_pageid = $(this).parent().find('input[name=next_pageid]').val();
      zy.log(next_pageid);zy.log(JSON.stringify(thiz._g.pages));
      $.each(thiz._g.pages, function(i, v) {
        if (v.next_pageid === next_pageid) {
          thiz._g.pages.splice(i,1);
          return false;// 只退出 each 循环
        }
      });
      zy.log(JSON.stringify(thiz._g.pages));
      thiz.loadPages(thiz._g.pages);
    });
  };

  // 从页面选择页面回来加载关联页面
  PT.loadNewPages = function(pageid, pagenm) {
    var isNotFound = true;
    $.each(thiz._g.pages, function(i, v) {
        if (v.next_pageid === pageid) {
          isNotFound = false;
          return false;// 只退出 each 循环
        }
    });
    if(isNotFound){
      $.merge(thiz._g.pages, [{next_pageid:pageid,pagenm:pagenm}]);
      thiz.loadPages(thiz._g.pages);
      return true;
    } else {
      zy.ui.msg('提示信息：', '页面 ' + pagenm + ' 已经存在，请重新选择', 'w');
      return false;
    }
  };

  return rbac_prj_mgt09;
})();