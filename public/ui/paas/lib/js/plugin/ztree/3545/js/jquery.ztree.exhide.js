!function(e){var i={view:{clearOldFirstNode:function(e,i){for(var o=i.getNextNode();o;){if(o.isFirstNode){o.isFirstNode=!1,c.setNodeLineIcos(e,o);break}if(o.isLastNode)break;o=o.getNextNode()}},clearOldLastNode:function(e,i,o){for(var d=i.getPreNode();d;){if(d.isLastNode){d.isLastNode=!1,o&&c.setNodeLineIcos(e,d);break}if(d.isFirstNode)break;d=d.getPreNode()}},makeDOMNodeMainBefore:function(e,i,o){var d=h.isHidden(i,o);e.push("<li ",d?"style='display:none;' ":"","id='",o.tId,"' class='",n.className.LEVEL,o.level,"' tabindex='0' hidefocus='true' treenode>")},showNode:function(e,i,o){h.isHidden(e,i,!1),h.initShowForExCheck(e,i),d(i,e).show()},showNodes:function(e,i,o){if(i&&0!=i.length){var d,t,n={};for(d=0,t=i.length;d<t;d++){var s=i[d];if(!n[s.parentTId]){var r=s.getParentNode();n[s.parentTId]=null===r?h.getRoot(e):s.getParentNode()}c.showNode(e,s,o)}for(var a in n){var N=h.nodeChildren(e,n[a]);c.setFirstNodeForShow(e,N),c.setLastNodeForShow(e,N)}}},hideNode:function(e,i,o){h.isHidden(e,i,!0),i.isFirstNode=!1,i.isLastNode=!1,h.initHideForExCheck(e,i),c.cancelPreSelectedNode(e,i),d(i,e).hide()},hideNodes:function(e,i,o){if(i&&0!=i.length){var d,t,n={};for(d=0,t=i.length;d<t;d++){var s=i[d];if((s.isFirstNode||s.isLastNode)&&!n[s.parentTId]){var r=s.getParentNode();n[s.parentTId]=null===r?h.getRoot(e):s.getParentNode()}c.hideNode(e,s,o)}for(var a in n){var N=h.nodeChildren(e,n[a]);c.setFirstNodeForHide(e,N),c.setLastNodeForHide(e,N)}}},setFirstNode:function(e,i){var o=h.nodeChildren(e,i),d=h.isHidden(e,o[0],!1);0<o.length&&!d?o[0].isFirstNode=!0:0<o.length&&c.setFirstNodeForHide(e,o)},setLastNode:function(e,i){var o=h.nodeChildren(e,i),d=h.isHidden(e,o[0]);0<o.length&&!d?o[o.length-1].isLastNode=!0:0<o.length&&c.setLastNodeForHide(e,o)},setFirstNodeForHide:function(e,i){var o,d,t;for(d=0,t=i.length;d<t&&!(o=i[d]).isFirstNode;d++){if(!h.isHidden(e,o)&&!o.isFirstNode){o.isFirstNode=!0,c.setNodeLineIcos(e,o);break}o=null}return o},setFirstNodeForShow:function(e,i){var o,d,t,n,s;for(d=0,t=i.length;d<t;d++){o=i[d];var r=h.isHidden(e,o);if(!n&&!r&&o.isFirstNode){n=o;break}if(n||r||o.isFirstNode){if(n&&o.isFirstNode){o.isFirstNode=!1,s=o,c.setNodeLineIcos(e,o);break}o=null}else o.isFirstNode=!0,n=o,c.setNodeLineIcos(e,o)}return{new:n,old:s}},setLastNodeForHide:function(e,i){var o,d;for(d=i.length-1;0<=d&&!(o=i[d]).isLastNode;d--){if(!h.isHidden(e,o)&&!o.isLastNode){o.isLastNode=!0,c.setNodeLineIcos(e,o);break}o=null}return o},setLastNodeForShow:function(e,i){var o,d,t,n;for(d=i.length-1;0<=d;d--){o=i[d];var s=h.isHidden(e,o);if(!t&&!s&&o.isLastNode){t=o;break}if(t||s||o.isLastNode){if(t&&o.isLastNode){o.isLastNode=!1,n=o,c.setNodeLineIcos(e,o);break}o=null}else o.isLastNode=!0,t=o,c.setNodeLineIcos(e,o)}return{new:t,old:n}}},data:{initHideForExCheck:function(e,i){h.isHidden(e,i)&&e.check&&e.check.enable&&(void 0===i._nocheck&&(i._nocheck=!!i.nocheck,i.nocheck=!0),i.check_Child_State=-1,c.repairParentChkClassWithSelf&&c.repairParentChkClassWithSelf(e,i))},initShowForExCheck:function(e,i){if(!h.isHidden(e,i)&&e.check&&e.check.enable){if(void 0!==i._nocheck&&(i.nocheck=i._nocheck,delete i._nocheck),c.setChkClass){var o=d(i,n.id.CHECK,e);c.setChkClass(e,o,i)}c.repairParentChkClassWithSelf&&c.repairParentChkClassWithSelf(e,i)}}}};e.extend(!0,e.fn.zTree._z,i);var o=e.fn.zTree,t=o._z.tools,n=o.consts,c=o._z.view,h=o._z.data,d=(o._z.event,t.$);h.isHidden=function(e,i,o){if(!i)return!1;var d=e.data.key.isHidden;return void 0!==o?("string"==typeof o&&(o=t.eqs(o,"true")),o=!!o,i[d]=o):"string"==typeof i[d]?i[d]=t.eqs(i[d],"true"):i[d]=!!i[d],i[d]},h.exSetting({data:{key:{isHidden:"isHidden"}}}),h.addInitNode(function(e,i,o,d,t,n,s){var r=h.isHidden(e,o);h.isHidden(e,o,r),h.initHideForExCheck(e,o)}),h.addBeforeA(function(e,i,o){}),h.addZTreeTools(function(t,n){n.showNodes=function(e,i){c.showNodes(t,e,i)},n.showNode=function(e,i){e&&c.showNodes(t,[e],i)},n.hideNodes=function(e,i){c.hideNodes(t,e,i)},n.hideNode=function(e,i){e&&c.hideNodes(t,[e],i)};var s=n.checkNode;s&&(n.checkNode=function(e,i,o,d){e&&h.isHidden(t,e)||s.apply(n,arguments)})});var a=h.initNode;h.initNode=function(e,i,o,d,t,n,s){var r=(d||h.getRoot(e))[e.data.key.children];h.tmpHideFirstNode=c.setFirstNodeForHide(e,r),h.tmpHideLastNode=c.setLastNodeForHide(e,r),s&&(c.setNodeLineIcos(e,h.tmpHideFirstNode),c.setNodeLineIcos(e,h.tmpHideLastNode)),t=h.tmpHideFirstNode===o,n=h.tmpHideLastNode===o,a&&a.apply(h,arguments),s&&n&&c.clearOldLastNode(e,o,s)};var s=h.makeChkFlag;s&&(h.makeChkFlag=function(e,i){i&&h.isHidden(e,i)||s.apply(h,arguments)});var r=h.getTreeCheckedNodes;r&&(h.getTreeCheckedNodes=function(e,i,o,d){if(i&&0<i.length){var t=i[0].getParentNode();if(t&&h.isHidden(e,t))return[]}return r.apply(h,arguments)});var N=h.getTreeChangeCheckedNodes;N&&(h.getTreeChangeCheckedNodes=function(e,i,o){if(i&&0<i.length){var d=i[0].getParentNode();if(d&&h.isHidden(e,d))return[]}return N.apply(h,arguments)});var l=c.expandCollapseSonNode;l&&(c.expandCollapseSonNode=function(e,i,o,d,t){i&&h.isHidden(e,i)||l.apply(c,arguments)});var f=c.setSonNodeCheckBox;f&&(c.setSonNodeCheckBox=function(e,i,o,d){i&&h.isHidden(e,i)||f.apply(c,arguments)});var u=c.repairParentChkClassWithSelf;u&&(c.repairParentChkClassWithSelf=function(e,i){i&&h.isHidden(e,i)||u.apply(c,arguments)})}(jQuery);