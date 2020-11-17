/* Create By xBoson System */
jQuery(function($) {
  
$("#random_password").click(function() {
  xb.api('2e617eb7e1744bbcb6a0518fa85a84a5', 'basic', 'genpass', {}, function(x) {
    $("[name=password]").val(x.data);
  });
  return false;
});


$("#genloginpass").click(function() {
  var dt = xb.load_data("datatable0");
  xb.api('2e617eb7e1744bbcb6a0518fa85a84a5', 'basic', 'gentestpass', {_id: dt._id}, function(x) {
    $("#login_password").text("设备登录密钥: "+ x.data);
  });
  return false;
})

});