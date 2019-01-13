$(function(){
    $("#Primary_health_care_home").click(function(){
        $("#Primary_health_care_modal1").slideDown(400);
        $("#Primary_health_care_modal2").slideDown(400)
    })
    var modalOut = function(){
        $("#Primary_health_care_modal1").fadeOut(400);
        $("#Primary_health_care_modal2").fadeOut(400)
    }
    $("#Primary_health_care_modal1 a").click(function(){
        modalOut();
    })
    $("#Primary_health_care_modal2 a").click(function(){
        modalOut();
    })
      // ——————————————————浏览器关闭事件———————————————————— 
    // window.onbeforeunload = function() //author: meizz    
    // { 
    //     // Chrome浏览器  只识别return false
    //     return false
             
    // } 
    
})