jQuery.maskedinput插件

MaskedInput这个jQuery插件让用户能够按照预先设定好的固定格式输入数据(如日期、电话号码等)。

一.下载插件
  http://digitalbush.com/projects/masked-input-plugin/

二.属性
a: 表示只能输入大小写字母
9:表示只能输入0-9之间的数字
*：a和9的结合
placeholder:占位符

三.方法
mask(param1,pararm2)：param1:限制输入格式，param2:制定占位符
umask():删除输入格式的限制

四.扩展 方法 
可以根据自己的需求限制输入格式例如:
$.mask.definitions['z']='[123]';表示只能输入123数字

五.例子 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>

    <script type="text/javascript" src="http://zhyj0303.blog.163.com/blog/../../js/jquery-1.4.2.js"></script>

    <script type="text/javascript" src="http://zhyj0303.blog.163.com/blog/../../js/jquery.maskedinput-1.2.2.js"></script>

    <script type="text/javascript">
        $(document).ready(function() {
        $("#txtdate").mask("99/99/9999", { placeholder: "|" });
            $("#txtphone").mask("(999) 999-9999");
            $("#txttin").mask("99-9999999");
            $("#txtmax").mask("999/99/9999");
            $("#txtdemo1").mask("**/***/****");
            $("#txtdemo2").mask("aa/aaa/aaa");
            
            //自定义格式
            $.mask.definitions['z'] = '[123]';//Z:表示只能输入123
            $("#txtdemo3").mask("zz/ zzz/ zzzz");
        });
       
    </script>

</head>
<body>
    <input type="text" id="txtdate" /><span style="color: Red">输入格式(99/99/9999)</span><br />
    <input type="text" id="txtphone" /><span style="color: Red">输入格式((999)999-9999)</span><br />
    <input type="text" id="txttin" /><span style="color: Red">输入格式(99-99999999)</span><br />
    <input type="text" id="txtmax" /><span style="color: Red">输入格式(999-99-99999)</span><br />
    <input type="text" id="txtdemo1" /><span style="color: Red">以(**/***/****)形式输入大小写字母和数字</span><br />
    <input type="text" id="txtdemo2" /><span style="color: Red">以(aa/aa/aaa)形式输入大小写字母</span><br />
    <input type="text" id="txtdemo3" /><span style="color: Red">自定义的输入方式(zz/zzz/zzz)</span><br />
</body>
</html>