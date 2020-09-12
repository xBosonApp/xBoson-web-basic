# 开放访问 Api

当 Api 需要匿名访问时, 这些接口无需登录即可访问, 通常用于公共服务.


# 设置

在用户管理中寻找 'anonymous' 匿名用户, 并查看与该用户关联的角色.

在角色管理中寻找这个角色, 将需要访问的 Api 权限预付该角色, 此时该 Api 可用匿名访问.


# 访问

必须将 url 切换到匿名接口上, url 路径的第二个部分改为 openapp

例:

`http://localhost:8080/xboson/app/orgid/appid/module/API`

改为:

`http://localhost:8080/xboson/openapp/orgid/appid/module/API`