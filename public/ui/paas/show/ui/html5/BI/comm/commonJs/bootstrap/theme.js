//网站换肤
$(function () {
    var $li = $("#inline li");  //查找到元素
    $li.click(function () {   //给元素添加事件
        switchSkin(this.id);//调用函数
    });
    //保存Cookie完毕以后就可以通过Cookie来获取当前的皮肤了
    var cookie_skin = $.cookie("MyCssSkin");     //获取Cookie的值
    if (cookie_skin) {                          //如果确实存在Cookie
        switchSkin(cookie_skin);     //执行
    }
});
function switchSkin(skinName) {   
    $("#" + skinName).addClass("selected")                //当前<li>元素选中
					   .siblings().removeClass("selected");  //去掉其他同辈<li>元素的选中
    $("#cssfile").attr("href", "../comm/commonCss/dist/" + skinName + ".css"); //设置不同皮肤
    $.cookie("MyCssSkin", skinName, { path: '/', expires: 10 });  //保存Cookie
}