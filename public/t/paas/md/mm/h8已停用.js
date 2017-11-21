 
 
// //已停用此js



// (function(zy,$){
//   var _typecd; //用来存放tree节点的typecd（包含父节点）
//   var formdata={};
//   var paramdata={};
//   var tools={
//     api:function(param,cb){
//       var _cb=function(msg){
//         cb &&cb(msg);
//       };
//       zy.g.am.app=param.app;
//       zy.g.am.mod=param.mod;
//       zy.net.get("api/"+param.api,_cb,param.r_param,param.page);
//     }
//   };
//   var node=null;
//   function tree(_params){
//     var  _tree=null;
//     function opt(_dbfunc){
//       function Click(event,treeId,treeNode){
//         _typecd=treeNode.typecd;
//         _dbfunc && _dbfunc(treeNode);
//       }
//       return {
//         view: {
//         dblClickExpand: false
//         },
//         data:{
//           key:{
//             name:"typenm",
//             title:"shownm"
//           },
//           simpleData:{
//             enable : true,
//             idKey:"typecd",
//             pIdKey:"parentcd"
//           }
//         },
//         callback :{
//           onClick : Click
//         }
//       }
//     }
//     function refresh(treeContariner,val,dbclick){
//       var option=opt(dbclick);
//       function filter(node) {
//         return (node.typecd.indexOf(val)>-1);
//       }
//       var node = _tree.getNodesByFilter(filter);
//     _tree= $.fn.zTree.init(treeContariner,option,node);
//     }
//     function init (treeContariner,dbclick) {
//       var option=opt(dbclick);
//       tools.api(_params,function(msg){
//       _tree= $.fn.zTree.init(treeContariner,option,msg.result);
//       });
//     }
//     return {
//       init:init,
//       refresh:refresh
//     };
//   }
//   //注册行点击事件
//   function _tools_rowEvent(){
//     $('#md_mm_h8_table').on('click', 'tr', function(e) {
//         paramdata=_datatable_init.getrow();
//     });
//     $('#md_mm_typecd').click(function() {
//       showMenu();
//     });
//     $('#md_mm_typecd').on('input',function(){
//       var str = $(this).val();
//       console.log(str.indexOf());
//       _tree.refresh($("#md_mm_tree"),str,function(treenode){
//         _datatable_init= _datatable.init($("#md_mm_h8_table"),{typecd:treenode.typecd});
//       });
//     });
//     $('#md_mm_h8_search').click(function() {
//       var mm_datatable=new dyTable({
//           app: 'c879dcc94d204d96a98a34e0b7d75676',
//           api: 'getdelist',
//           mod: 'mm'
//         });
//       conditions = $('#md_mm_h8_form').serialize();
//       _datatable_init=mm_datatable.init($("#md_mm_h8_table"),conditions);
//       // if(md_mm_typecd.value=="") {
//       //   conditions = $('#md_mm_h8_form').serialize();
//       //   _datatable_init=mm_datatable.init($("#md_mm_h8_table"),conditions);
//       // }
//       // else {
//       //   conditions = $('#md_mm_h8_form').serialize();
//       //   function cb (msg) {
//       //     if(msg) {
//       //     _datatable_init=_datatable.init($("#md_mm_h8_table"),conditions);
//       //     }
//       //   }
//       //   zy.g.am.mod = "mm";
//       //   zy.g.am.app = "c879dcc94d204d96a98a34e0b7d75676";
//       //   zy.net.get('api/getdelist',cb,conditions);
//       // }
//       });
//   }
//   //点击类别编码显示tree
//   function showMenu () {
//     var typecdObj = $('#md_mm_typecd');
//     var typecdOffset = $('#md_mm_typecd').offset();
//     $("#menuContent").slideDown("fast");
//     $("#menuContent").offset({left:typecdOffset.left , top:typecdOffset.top + typecdObj.outerHeight()});
//     $("#md_mm_h8").bind("mousedown", onBodyDown);
//   }
//   function hideMenu() {
//       $("#menuContent").fadeOut("fast");
//       $("md_mm_h8").unbind("mousedown", onBodyDown);
//     }
//   function onBodyDown(event) {
//       if (!(event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
//         hideMenu();
//       }
//     }
//   var _tree=tree({
//     app:"c879dcc94d204d96a98a34e0b7d75676",
//     api:"getmetadatatree",
//     mod:"mm"
//   });
  
//   var _datatable=new dyTable({
//     app: 'c879dcc94d204d96a98a34e0b7d75676',
//     api: 'getdatatable',
//     mod: 'mm'
//   });
//   var _datatable_init=null;  //用来存放init后返回的对象
//   _tree.init($("#md_mm_tree"), function(treenode) {
//     node=treenode.typecd;
//     if(treenode.datatable.trim() == "sys_mdm003" ) {
//       v=treenode.typecd;
//       var typecdObj = $('#md_mm_typecd');
//       typecdObj.val(v);
//       _datatable_init= _datatable.init($("#md_mm_h8_table"),{typecd:treenode.typecd});
//     }
//     }
//   );
//   function data() {
//             // $('#sys_md_mm002_form').find('[name=decd]').val(formdata.decd);
//             // $('#sys_md_mm002_form').find('[name=en]').val(formdata.en);
//             // $('#sys_md_mm002_form').find('[name=cn]').val(formdata.cn);
//             console.log(09876,formdata);
//             $('#sys_md_mm002_form').find('[name=typecd]').val(formdata.typecd);
//             $('#sys_md_mm002_form').find('[name=mk]').val(formdata.mk);
//             $('#sys_md_mm002_form').find('[name=must]').val(formdata.must);
//             $('#sys_md_mm002_form').find('[name=status]').val(formdata.status);
//             $('#sys_md_mm002_form').find('[name=mark]').val(formdata.mark);
//             $('#sys_md_mm002_form').find('[name=sorting]').val(formdata.sorting);
//             $('#sys_md_mm002_form').find('[name=decd]').val(paramdata.decd);
//             $('#sys_md_mm002_form').find('[name=en]').val(paramdata.en);
//             console.log(234);
//             $('#sys_md_mm002_form').find('[name=cn]').val(paramdata.cn);
//             $('#sys_md_mm002_form').find('[name=mark]').val(paramdata.mark);
//             $('#sys_md_mm002_form').find('[name=status]').select2("val", '1');
//   }
//   function validate() {
//     $('#md_mm_h8').find('[id=btn_ok],[id=md_mm_btn_exit]').click(function() {
//       $('#sys_md_mm002').modal('show');
//       $('#md_mm_h8').modal('hide');
//       console.log(formdata);
//       if(formdata.en != ''){
//         console.log('有效');
//         // if(formdata.en == ''){
//         //   $('#sys_md_mm002_form').find('[name=decd]').val(_dataform.decd);
//         //     $('#sys_md_mm002_form').find('[name=en]').val(_dataform.en);
//         //     $('#sys_md_mm002_form').find('[name=cn]').val(_dataform.cn);
//         // }
//           if (mm_h1._g.flg == 'u') {
//             $("#sys_md_mm002_title").text('修改');
//             data();
//             $('#sys_md_mm002_form').validate({
//               submitHandler: function(form) {
//                 zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
//                 zy.g.am.mod = 'mm';
//                 zy.net.post("api/updatedata", function(msg) {
//                   if (msg) {
//                     zy.ui.msg('提示', '保存成功', 's');
//                     var table = new dyTable({
//                         app: 'c879dcc94d204d96a98a34e0b7d75676',
//                         api: 'getdatatable',
//                         mod: 'mm'
//                       });
//                     table.init($('[name=tab_first]').children(".dataTables_wrapper"), {
//                       typecd: mm_h1._g._nodeClick.typecd
//                     });
//                     $('#sys_md_mm002').modal('hide');
//                   }
//                 }, $('#sys_md_mm002_form').serialize() + mm_h1._g._oldValue);
//                 //$('#md_mm_h7_form').formDisable(true);
//               }
//             });
//           } else if (mm_h1._g.flg == 'i') {
//             $("sys_md_mm002_title").text('添加');
//             $('#sys_md_mm002').find('[id=sys_md_mm002_sorting]').css('display','none');
//             data();
//             $('#sys_md_mm002_form').validate({
//               submitHandler: function(form) {
//                 var _enval = $('#sys_md_mm002').find('[name=en]').val();
//                 if(zy.tool.checkTableName(_enval)){
//                   function cb(msg) {
//                     if (msg) {
//                       zy.ui.msg("提示信息：", "保存成功！", "s");
//                         var table = new dyTable({
//                           app: 'c879dcc94d204d96a98a34e0b7d75676',
//                           api: 'getdatatable',
//                           mod: 'mm'
//                         });
//                       mm_h1._g.tab1_table_init = table.init($('[name=tab_first]').children(".dataTables_wrapper"), {
//                         typecd: mm_h1._g._nodeClick.typecd
//                       });
//                       $('#sys_md_mm002').modal('hide');
//                       $('[name=tab_first]').find('[name=edit]').btnDisable(true);
//                       $('[name=tab_first]').find('[name=delete]').btnDisable(true);
//                     }
//                   }
//                   zy.g.am.app = 'c879dcc94d204d96a98a34e0b7d75676';
//                   zy.g.am.mod = 'mm';
//                   zy.net.get("api/adddata", cb, $('#sys_md_mm002_form').serialize());
//                 }else{
//                   zy.ui.msg('提示','非法:英文名为字母,数字,_且不能以数字开头!','i');
//                 };
//               }
//             });
//           }
//       }else{
//         console.log('无效');
//       }
//     });
//   }
//   function geth7formdata() {
//     formdata = $('#sys_md_mm002_form').form2json();
//   }
//   _tools_rowEvent();
//   validate();
//   geth7formdata();
// })(zy,jQuery);