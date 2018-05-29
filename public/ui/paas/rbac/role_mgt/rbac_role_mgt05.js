rbac_role_mgt05 = (function() {
  var PT = rbac_role_mgt05.prototype;
  var thiz;
  var thisPage;// = $('#rbac_role_mgt05').attr('id', 'rbac_role_mgt05' + newIdSuffix);
  var pageTitle;// = thisPage.find('#rbac_role_mgt05_page_title');
  //$('#rbac_role_mgt05_tmpl_elements').attr('id', 'rbac_role_mgt05_tmpl_elements' + newIdSuffix);
  var tmplElements;// = $.templates('#rbac_role_mgt05_tmpl_elements' + newIdSuffix);
  //$('#rbac_role_mgt05_tmpl_next_page').attr('id', 'rbac_role_mgt05_tmpl_next_page' + newIdSuffix);
  var tmplPages;// = $.templates('#rbac_role_mgt05_tmpl_next_page' + newIdSuffix);
  var elementContainer;// = thisPage.find('#rbac_role_mgt05_page_elements');
  var pageContainer;// = thisPage.find('#rbac_role_mgt05_page_next_page');
  var radioElementId;// = 'rbac_role_mgt05_page_ele_status';
  var divElementId;// = 'rbac_role_mgt05_page_ele_srv';
  var radioSrvId;// = 'rbac_role_mgt05_page_srv_status';
  var divSrvId;// = 'rbac_role_mgt05_page_srv_div';
  var linkNextPageId;// = 'rbac_role_mgt05_next_page_link';
  var radioNextPageId;// = 'rbac_role_mgt05_next_page_status';
  // var btnConfirm;// = thisPage.find('#rbac_role_mgt05_page_confirm');
  // var btnCancel;// = thisPage.find('#rbac_role_mgt05_page_cancel');

  var rolePagePath = 'rbac/role_mgt/rbac_role_mgt05.htm';

  var AUTHORIZED = 'authorized';
  var UNAUTHORIZED = 'unauthorized';
  var ELEMENT_STATUS_1 = '1';
  var ELEMENT_STATUS_2 = '2';
  var ELEMENT_STATUS_3 = '3';
  var DEFAULT_INIT_ELEMENT_ID = '0';

  PT._g = {
    roleid: '',
    pageid: '',
    pageinfo: null,
    elementinfo: null,
    nextpages: null
  };

  // 构造函数
  function rbac_role_mgt05(roleid, pageid) {
    thiz = this;
    thiz._g.roleid = roleid;
    thiz._g.pageid = pageid;
    var newIdSuffix = zy.tool.random();
    thisPage = $('#rbac_role_mgt05').attr('id', 'rbac_role_mgt05' + newIdSuffix);
    thiz._g.id='rbac_role_mgt05' + newIdSuffix;
    pageTitle = thisPage.find('#rbac_role_mgt05_page_title');
    $('#rbac_role_mgt05_tmpl_elements').attr('id', 'rbac_role_mgt05_tmpl_elements' + newIdSuffix);
    tmplElements = $.templates('#rbac_role_mgt05_tmpl_elements' + newIdSuffix);
    $('#rbac_role_mgt05_tmpl_next_page').attr('id', 'rbac_role_mgt05_tmpl_next_page' + newIdSuffix);
    tmplPages = $.templates('#rbac_role_mgt05_tmpl_next_page' + newIdSuffix);
    elementContainer = thisPage.find('#rbac_role_mgt05_page_elements');
    pageContainer = thisPage.find('#rbac_role_mgt05_page_next_page');
    radioElementId = 'rbac_role_mgt05_page_ele_status';
    divElementId = 'rbac_role_mgt05_page_ele_srv';
    radioSrvId = 'rbac_role_mgt05_page_srv_status';
    divSrvId = 'rbac_role_mgt05_page_srv_div';
    linkNextPageId = 'rbac_role_mgt05_next_page_link';
    radioNextPageId = 'rbac_role_mgt05_next_page_status';
    // btnConfirm = thisPage.find('#rbac_role_mgt05_page_confirm');
    // btnCancel = thisPage.find('#rbac_role_mgt05_page_cancel');
    init();
    return this;
  }

  // 初始化
  function init() {
    zy.g.am.app = 'auth';
    zy.g.am.mod = 'rbac';
    zy.net.get('api/rolepageinfo', function(msg) {
      if (msg) {
        var retPageinfo = msg.pageinfo;
        if (!_.isEmpty(retPageinfo)) {
          thiz._g.pageinfo = retPageinfo[0];
          //pageTitle.html('<strong>' + thiz._g.pageinfo.pageid + '&nbsp;' + thiz._g.pageinfo.pagenm + '</strong>');
          pageTitle.html(thiz._g.pageinfo.pageid + '&nbsp;' + thiz._g.pageinfo.pagenm);
        }
        thiz._g.elementinfo = msg.elementinfo;
        thiz._g.nextpages = msg.nextpages;
        loadElements(msg.elementinfo);
        loadPages(msg.nextpages);
      }
    }, {roleid: thiz._g.roleid, pageid: thiz._g.pageid});
  }

  // 加载页面元素及其事件服务
  function loadElements(data) {
    elementContainer.empty();
    if (_.isEmpty(data)) {
      return;
    }

    // 设定标记方便模板处理
    $.each(data, function(i,v){
      if(v.elementid===DEFAULT_INIT_ELEMENT_ID){
        v.is_init=true;
      }
      var children = v.children;
      if (children) {
        $.each(children, function(ii,vv){
          if (!_.isEmpty(vv.modelid)) {
            vv.is_model=true;
          }
        });
      }
    });

    var html = tmplElements.render(data);
    elementContainer.html(html);

    // 注册页面元素授权radio点击事件
    elementContainer.find('input[name^='+radioElementId+']').on('click',function () {
      var ele_id = $(this).attr('data-elementid');
      var domId = '#' + divElementId + ele_id;
      if ($(this).val() === ELEMENT_STATUS_1) {
        $.each(data, function(i,v) {
          if (v.elementid===ele_id) {
            var children = v.children;
            if (children) {
              $.each(children, function(ii,vv){
                if (_.isEmpty(vv.modelid)) {
                  zy.ui.form.setRadioValue(radioSrvId+vv.page_api_id, AUTHORIZED, elementContainer);
                } else {
                  zy.ui.form.setRadioValue(radioSrvId+vv.page_model_id, AUTHORIZED, elementContainer);
                }
              });
            }
          }
        });
        elementContainer.find(domId).formDisable(false);
      } else {
        $.each(data, function(i,v) {
          if (v.elementid===ele_id) {
            var children = v.children;
            if (children) {
              $.each(children, function(ii,vv){
                if (_.isEmpty(vv.modelid)) {
                  zy.ui.form.setRadioValue(radioSrvId+vv.page_api_id, UNAUTHORIZED, elementContainer);
                } else {
                  zy.ui.form.setRadioValue(radioSrvId+vv.page_model_id, UNAUTHORIZED, elementContainer);
                }
              });
            }
          }
        });
        elementContainer.find(domId).formDisable(true);
      }
      setElementSrvWithElementId(ele_id, $(this).val());
    });

    // 注册服务授权radio事件
    elementContainer.find('input[name^='+radioSrvId+']').on('click',function () {
      var srv_id = $(this).attr('data-id');
      var domId = '#' + divSrvId + srv_id;
      if ($(this).val() === AUTHORIZED) {
        elementContainer.find(domId).formDisable(false);
        setElementSrvWithSrvId(srv_id, true);
      } else {
        elementContainer.find(domId).formDisable(true);
        setElementSrvWithSrvId(srv_id, false);
      }
    });

    $.each(data, function(i,v) {
      var domId = '#' + divElementId + v.elementid;
      if (v.element_status === ELEMENT_STATUS_1) {
        elementContainer.find(domId).formDisable(false);
        var children = v.children;
        if (children) {
          $.each(children, function(ii,vv){
            if (_.isEmpty(vv.authorized)) {
              if (_.isEmpty(vv.modelid)) {
                elementContainer.find('#' + divSrvId + vv.page_api_id).formDisable(true);
              } else {
                elementContainer.find('#' + divSrvId + vv.page_model_id).formDisable(true);
              }
            }
          });
        }
      } else {
        elementContainer.find(domId).formDisable(true);
      }
    });
  }

  // 加载关联页面
  function loadPages(data) {
    pageContainer.empty();
    if (_.isEmpty(data)) {
      return;
    }
    var html = tmplPages.render(data);
    pageContainer.html(html);

    // 注册关联页面link点击事件
    pageContainer.find('button[id^='+linkNextPageId+']').on('click',function () {
      if (rbac_role_mgt06Obj) {
        rbac_role_mgt06Obj.addTab($(this).attr('data-next_pageid'));
      }
    });

    // 注册关联页面授权radio点击事件
    pageContainer.find('input[name^='+radioNextPageId+']').on('click',function () {
      var next_pageid = $(this).attr('data-next_pageid');
      var domId = '#' + linkNextPageId + next_pageid;
      var pageAuthorized = $(this).val() === AUTHORIZED;
      pageContainer.find(domId).btnDisable(!pageAuthorized);
      setNextPage(next_pageid, pageAuthorized);
    });
    
    $.each(data, function(i,v) {
      if (_.isEmpty(v.authorized)) {
        pageContainer.find('#' + linkNextPageId + v.next_pageid).btnDisable(true);
      }
    });
  }

  function setElementSrvWithElementId(ele_id, element_status) {
    var authorized = element_status === ELEMENT_STATUS_1;
    var ei = thiz._g.elementinfo;
    $.each(ei, function(i, v) {
      if (v.elementid === ele_id) {
        v.element_status = element_status;
        if (v.children) {
          $.each(v.children, function(ii, vv) {
            if (authorized) {
              vv.authorized = authorized;
            } else {
              vv.authorized = null;
            }
          });
        }
        return false;
      }
    });
  }

  function setElementSrvWithSrvId(srv_id, authorized) {
    var ei = thiz._g.elementinfo;
    var found = false;
    $.each(ei, function(i, v) {
      $.each(v.children, function(ii, vv) {
        if (vv.page_model_id === srv_id || vv.page_api_id === srv_id) {
          if (authorized) {
            vv.authorized = authorized;
          } else {
            vv.authorized = null;
          }
          found = true;
          return false;
        }
      });
      if (found) {
        return false;
      }
    });
  }

  function setNextPage(next_pageid, authorized) {
    var data = thiz._g.nextpages;
    $.each(data, function(i, v) {
      if (v.next_pageid === next_pageid) {
        if (authorized) {
          v.authorized = authorized;
        } else {
          v.authorized = null;
        }
        return false;
      }
    });
  }

  return rbac_role_mgt05;
})();