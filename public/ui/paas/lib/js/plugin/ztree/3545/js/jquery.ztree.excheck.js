!function(e){var t={event:{CHECK:"ztree_check"},id:{CHECK:"_check"},checkbox:{STYLE:"checkbox",DEFAULT:"chk",DISABLED:"disable",FALSE:"false",TRUE:"true",FULL:"full",PART:"part",FOCUS:"focus"},radio:{STYLE:"radio",TYPE_ALL:"all",TYPE_LEVEL:"level"}},c={check:{enable:!1,autoCheckTrigger:!1,chkStyle:t.checkbox.STYLE,nocheckInherit:!1,chkDisabledInherit:!1,radioType:t.radio.TYPE_LEVEL,chkboxType:{Y:"ps",N:"ps"}},data:{key:{checked:"checked"}},callback:{beforeCheck:null,onCheck:null}},r={onCheckNode:function(e,t){if(!0===t.chkDisabled)return!1;var c=C.getSetting(e.data.treeId);if(0==o.apply(c.callback.beforeCheck,[c.treeId,t],!0))return!0;var h=C.nodeChecked(c,t);C.nodeChecked(c,t,!h),l.checkNodeRelation(c,t);var a=f(t,s.id.CHECK,c);return l.setChkClass(c,a,t),l.repairParentChkClassWithSelf(c,t),c.treeObj.trigger(s.event.CHECK,[e,c.treeId,t]),!0},onMouseoverCheck:function(e,t){if(!0===t.chkDisabled)return!1;var c=C.getSetting(e.data.treeId),h=f(t,s.id.CHECK,c);return t.check_Focus=!0,l.setChkClass(c,h,t),!0},onMouseoutCheck:function(e,t){if(!0===t.chkDisabled)return!1;var c=C.getSetting(e.data.treeId),h=f(t,s.id.CHECK,c);return t.check_Focus=!1,l.setChkClass(c,h,t),!0}},h={tools:{},view:{checkNodeRelation:function(e,t){var c,h,a,n=s.radio,i=C.nodeChecked(e,t);if(e.check.chkStyle==n.STYLE){var r=C.getRadioCheckedList(e);if(i)if(e.check.radioType==n.TYPE_ALL){for(h=r.length-1;0<=h;h--){c=r[h],C.nodeChecked(e,c)&&c!=t&&(C.nodeChecked(e,c,!1),r.splice(h,1),l.setChkClass(e,f(c,s.id.CHECK,e),c),c.parentTId!=t.parentTId&&l.repairParentChkClassWithSelf(e,c))}r.push(t)}else{var o=t.parentTId?t.getParentNode():C.getRoot(e);for(h=0,a=(d=C.nodeChildren(e,o)).length;h<a;h++){c=d[h],C.nodeChecked(e,c)&&c!=t&&(C.nodeChecked(e,c,!1),l.setChkClass(e,f(c,s.id.CHECK,e),c))}}else if(e.check.radioType==n.TYPE_ALL)for(h=0,a=r.length;h<a;h++)if(t==r[h]){r.splice(h,1);break}}else{var d=C.nodeChildren(e,t);i&&(!d||0==d.length||-1<e.check.chkboxType.Y.indexOf("s"))&&l.setSonNodeCheckBox(e,t,!0),i||d&&0!=d.length&&!(-1<e.check.chkboxType.N.indexOf("s"))||l.setSonNodeCheckBox(e,t,!1),i&&-1<e.check.chkboxType.Y.indexOf("p")&&l.setParentNodeCheckBox(e,t,!0),!i&&-1<e.check.chkboxType.N.indexOf("p")&&l.setParentNodeCheckBox(e,t,!1)}},makeChkClass:function(e,t){var c=s.checkbox,h=s.radio,a="",n=C.nodeChecked(e,t);a=!0===t.chkDisabled?c.DISABLED:t.halfCheck?c.PART:e.check.chkStyle==h.STYLE?t.check_Child_State<1?c.FULL:c.PART:n?2===t.check_Child_State||-1===t.check_Child_State?c.FULL:c.PART:t.check_Child_State<1?c.FULL:c.PART;var i=e.check.chkStyle+"_"+(n?c.TRUE:c.FALSE)+"_"+a;return i=t.check_Focus&&!0!==t.chkDisabled?i+"_"+c.FOCUS:i,s.className.BUTTON+" "+c.DEFAULT+" "+i},repairAllChk:function(e,t){if(e.check.enable&&e.check.chkStyle===s.checkbox.STYLE)for(var c=C.getRoot(e),h=C.nodeChildren(e,c),a=0,n=h.length;a<n;a++){var i=h[a];!0!==i.nocheck&&!0!==i.chkDisabled&&C.nodeChecked(e,i,t),l.setSonNodeCheckBox(e,i,t)}},repairChkClass:function(e,t){if(t&&(C.makeChkFlag(e,t),!0!==t.nocheck)){var c=f(t,s.id.CHECK,e);l.setChkClass(e,c,t)}},repairParentChkClass:function(e,t){if(t&&t.parentTId){var c=t.getParentNode();l.repairChkClass(e,c),l.repairParentChkClass(e,c)}},repairParentChkClassWithSelf:function(e,t){if(t){var c=C.nodeChildren(e,t);c&&0<c.length?l.repairParentChkClass(e,c[0]):l.repairParentChkClass(e,t)}},repairSonChkDisabled:function(e,t,c,h){if(t){t.chkDisabled!=c&&(t.chkDisabled=c),l.repairChkClass(e,t);var a=C.nodeChildren(e,t);if(a&&h)for(var n=0,i=a.length;n<i;n++){var r=a[n];l.repairSonChkDisabled(e,r,c,h)}}},repairParentChkDisabled:function(e,t,c,h){t&&(t.chkDisabled!=c&&h&&(t.chkDisabled=c),l.repairChkClass(e,t),l.repairParentChkDisabled(e,t.getParentNode(),c,h))},setChkClass:function(e,t,c){t&&(!0===c.nocheck?t.hide():t.show(),t.attr("class",l.makeChkClass(e,c)))},setParentNodeCheckBox:function(e,t,c,h){var a=f(t,s.id.CHECK,e);if(h||(h=t),C.makeChkFlag(e,t),!0!==t.nocheck&&!0!==t.chkDisabled&&(C.nodeChecked(e,t,c),l.setChkClass(e,a,t),e.check.autoCheckTrigger&&t!=h&&e.treeObj.trigger(s.event.CHECK,[null,e.treeId,t])),t.parentTId){var n=!0;if(!c)for(var i=C.nodeChildren(e,t.getParentNode()),r=0,o=i.length;r<o;r++){var d=i[r],k=C.nodeChecked(e,d);if(!0!==d.nocheck&&!0!==d.chkDisabled&&k||(!0===d.nocheck||!0===d.chkDisabled)&&0<d.check_Child_State){n=!1;break}}n&&l.setParentNodeCheckBox(e,t.getParentNode(),c,h)}},setSonNodeCheckBox:function(e,t,c,h){if(t){var a=f(t,s.id.CHECK,e);h||(h=t);var n=!1,i=C.nodeChildren(e,t);if(i)for(var r=0,o=i.length;r<o;r++){var d=i[r];l.setSonNodeCheckBox(e,d,c,h),!0===d.chkDisabled&&(n=!0)}t!=C.getRoot(e)&&!0!==t.chkDisabled&&(n&&!0!==t.nocheck&&C.makeChkFlag(e,t),!0!==t.nocheck&&!0!==t.chkDisabled?(C.nodeChecked(e,t,c),n||(t.check_Child_State=i&&0<i.length?c?2:0:-1)):t.check_Child_State=-1,l.setChkClass(e,a,t),e.check.autoCheckTrigger&&t!=h&&!0!==t.nocheck&&!0!==t.chkDisabled&&e.treeObj.trigger(s.event.CHECK,[null,e.treeId,t]))}}},event:{},data:{getRadioCheckedList:function(e){for(var t=C.getRoot(e).radioCheckedList,c=0,h=t.length;c<h;c++)C.getNodeCache(e,t[c].tId)||(t.splice(c,1),c--,h--);return t},getCheckStatus:function(e,t){if(!e.check.enable||t.nocheck||t.chkDisabled)return null;var c=C.nodeChecked(e,t);return{checked:c,half:t.halfCheck?t.halfCheck:e.check.chkStyle==s.radio.STYLE?2===t.check_Child_State:c?-1<t.check_Child_State&&t.check_Child_State<2:0<t.check_Child_State}},getTreeCheckedNodes:function(e,t,c,h){if(!t)return[];var a=c&&e.check.chkStyle==s.radio.STYLE&&e.check.radioType==s.radio.TYPE_ALL;h=h||[];for(var n=0,i=t.length;n<i;n++){var r=t[n],o=C.nodeChildren(e,r),d=C.nodeChecked(e,r);if(!0!==r.nocheck&&!0!==r.chkDisabled&&d==c&&(h.push(r),a))break;if(C.getTreeCheckedNodes(e,o,c,h),a&&0<h.length)break}return h},getTreeChangeCheckedNodes:function(e,t,c){if(!t)return[];c=c||[];for(var h=0,a=t.length;h<a;h++){var n=t[h],i=C.nodeChildren(e,n),r=C.nodeChecked(e,n);!0!==n.nocheck&&!0!==n.chkDisabled&&r!=n.checkedOld&&c.push(n),C.getTreeChangeCheckedNodes(e,i,c)}return c},makeChkFlag:function(e,t){if(t){var c=-1,h=C.nodeChildren(e,t);if(h)for(var a=0,n=h.length;a<n;a++){var i=h[a],r=C.nodeChecked(e,i),o=-1;if(e.check.chkStyle==s.radio.STYLE){if(2==(o=!0===i.nocheck||!0===i.chkDisabled?i.check_Child_State:!0===i.halfCheck?2:r?2:0<i.check_Child_State?2:0)){c=2;break}0==o&&(c=0)}else if(e.check.chkStyle==s.checkbox.STYLE){if(1===(o=!0===i.nocheck||!0===i.chkDisabled?i.check_Child_State:!0===i.halfCheck?1:r?-1===i.check_Child_State||2===i.check_Child_State?2:1:0<i.check_Child_State?1:0)){c=1;break}if(2===o&&-1<c&&0<a&&o!==c){c=1;break}if(2===c&&-1<o&&o<2){c=1;break}-1<o&&(c=o)}}t.check_Child_State=c}}}};e.extend(!0,e.fn.zTree.consts,t),e.extend(!0,e.fn.zTree._z,h);var a=e.fn.zTree,o=a._z.tools,s=a.consts,l=a._z.view,C=a._z.data,f=(a._z.event,o.$);C.nodeChecked=function(e,t,c){if(!t)return!1;var h=e.data.key.checked;return void 0!==c?("string"==typeof c&&(c=o.eqs(c,"true")),c=!!c,t[h]=c):"string"==typeof t[h]?t[h]=o.eqs(t[h],"true"):t[h]=!!t[h],t[h]},C.exSetting(c),C.addInitBind(function(a){var e=a.treeObj,t=s.event;e.bind(t.CHECK,function(e,t,c,h){e.srcEvent=t,o.apply(a.callback.onCheck,[e,c,h])})}),C.addInitUnBind(function(e){var t=e.treeObj,c=s.event;t.unbind(c.CHECK)}),C.addInitCache(function(e){}),C.addInitNode(function(e,t,c,h,a,n,i){if(c){var r=C.nodeChecked(e,c);c.checkedOld=r,"string"==typeof c.nocheck&&(c.nocheck=o.eqs(c.nocheck,"true")),c.nocheck=!!c.nocheck||e.check.nocheckInherit&&h&&!!h.nocheck,"string"==typeof c.chkDisabled&&(c.chkDisabled=o.eqs(c.chkDisabled,"true")),c.chkDisabled=!!c.chkDisabled||e.check.chkDisabledInherit&&h&&!!h.chkDisabled,"string"==typeof c.halfCheck&&(c.halfCheck=o.eqs(c.halfCheck,"true")),c.halfCheck=!!c.halfCheck,c.check_Child_State=-1,c.check_Focus=!1,c.getCheckStatus=function(){return C.getCheckStatus(e,c)},e.check.chkStyle==s.radio.STYLE&&e.check.radioType==s.radio.TYPE_ALL&&r&&C.getRoot(e).radioCheckedList.push(c)}}),C.addInitProxy(function(e){var t=e.target,c=C.getSetting(e.data.treeId),h="",a=null,n="",i=null;if(o.eqs(e.type,"mouseover")?c.check.enable&&o.eqs(t.tagName,"span")&&null!==t.getAttribute("treeNode"+s.id.CHECK)&&(h=o.getNodeMainDom(t).id,n="mouseoverCheck"):o.eqs(e.type,"mouseout")?c.check.enable&&o.eqs(t.tagName,"span")&&null!==t.getAttribute("treeNode"+s.id.CHECK)&&(h=o.getNodeMainDom(t).id,n="mouseoutCheck"):o.eqs(e.type,"click")&&c.check.enable&&o.eqs(t.tagName,"span")&&null!==t.getAttribute("treeNode"+s.id.CHECK)&&(h=o.getNodeMainDom(t).id,n="checkNode"),0<h.length)switch(a=C.getNodeCache(c,h),n){case"checkNode":i=r.onCheckNode;break;case"mouseoverCheck":i=r.onMouseoverCheck;break;case"mouseoutCheck":i=r.onMouseoutCheck}return{stop:"checkNode"===n,node:a,nodeEventType:n,nodeEventCallback:i,treeEventType:"",treeEventCallback:null}},!0),C.addInitRoot(function(e){C.getRoot(e).radioCheckedList=[]}),C.addBeforeA(function(e,t,c){e.check.enable&&(C.makeChkFlag(e,t),c.push("<span ID='",t.tId,s.id.CHECK,"' class='",l.makeChkClass(e,t),"' treeNode",s.id.CHECK,!0===t.nocheck?" style='display:none;'":"","></span>"))}),C.addZTreeTools(function(i,h){h.checkNode=function(e,t,c,h){var a=C.nodeChecked(i,e);if(!0!==e.chkDisabled&&(!0!==t&&!1!==t&&(t=!a),h=!!h,(a!==t||c)&&(!h||0!=o.apply(this.setting.callback.beforeCheck,[this.setting.treeId,e],!0))&&o.uCanDo(this.setting)&&this.setting.check.enable&&!0!==e.nocheck)){C.nodeChecked(i,e,t);var n=f(e,s.id.CHECK,this.setting);(c||this.setting.check.chkStyle===s.radio.STYLE)&&l.checkNodeRelation(this.setting,e),l.setChkClass(this.setting,n,e),l.repairParentChkClassWithSelf(this.setting,e),h&&this.setting.treeObj.trigger(s.event.CHECK,[null,this.setting.treeId,e])}},h.checkAllNodes=function(e){l.repairAllChk(this.setting,!!e)},h.getCheckedNodes=function(e){e=!1!==e;var t=C.nodeChildren(i,C.getRoot(this.setting));return C.getTreeCheckedNodes(this.setting,t,e)},h.getChangeCheckedNodes=function(){var e=C.nodeChildren(i,C.getRoot(this.setting));return C.getTreeChangeCheckedNodes(this.setting,e)},h.setChkDisabled=function(e,t,c,h){t=!!t,c=!!c,h=!!h,l.repairSonChkDisabled(this.setting,e,t,h),l.repairParentChkDisabled(this.setting,e.getParentNode(),t,c)};var a=h.updateNode;h.updateNode=function(e,t){if(a&&a.apply(h,arguments),e&&this.setting.check.enable&&f(e,this.setting).get(0)&&o.uCanDo(this.setting)){var c=f(e,s.id.CHECK,this.setting);1!=t&&this.setting.check.chkStyle!==s.radio.STYLE||l.checkNodeRelation(this.setting,e),l.setChkClass(this.setting,c,e),l.repairParentChkClassWithSelf(this.setting,e)}}});var n=l.createNodes;l.createNodes=function(e,t,c,h,a){n&&n.apply(l,arguments),c&&l.repairParentChkClassWithSelf(e,h)};var i=l.removeNode;l.removeNode=function(e,t){var c=t.getParentNode();i&&i.apply(l,arguments),t&&c&&(l.repairChkClass(e,c),l.repairParentChkClass(e,c))};var d=l.appendNodes;l.appendNodes=function(e,t,c,h,a,n,i){var r="";return d&&(r=d.apply(l,arguments)),h&&C.makeChkFlag(e,h),r}}(jQuery);