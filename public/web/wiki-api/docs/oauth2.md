# 使用 OAuth 2.0 进行第三方应用授权


允许第三方应用通过用户许可后访问该用户的数据/资源, 而不需要该用户的密码,
用户可自助操作, 并随时终止许可, 不需要管理员介入, 方便多平台数据交换, 
并保证数据安全.


## 注册 APP

在系统菜单 '应用开发 -> 应用管理 -> 第三方应用注册',
注册完成后可得到两个关键参数:

* `client_id`  应用 iD
* `client_secret`  密钥
* `URI`  授权回调地址


## 授权

第三方应用使用参数在浏览器中打开页面 `/xboson/oauth2/authorize`, 用户必须已经在平台登录.

必要 HTTP 参数:

* `client_id` 应用 iD
* `grant_type` 始终为 `authorization_code`
* `state` 应用生成安全码防止不安全的授权行为.

参数正确且授权成功, 页面将跳转到注册时指定的回调接口上, 否则将显示错误消息页面.

回调接口将通过 HTTP 参数收到授权应答:

* `code` 授权码, 40 英文字符长度.
* `state` 原样返回请求时的 `state` 参数.


## 获取令牌

第三方应用使用参数通过服务器直接调用接口 `/xboson/oauth2/access_token`

必要 HTTP 参数:

* `grant_type` 始终为 `authorization_code`
* `client_id` 应用 iD
* `client_secret` 密钥
* `code` 授权码

接口调用成功将返回:

```json
{
  'access_token': '令牌, 字符串',
  'expires_in': 令牌有效期, 整数, 单位秒,
  'userid': '平台用户 ID, 字符串',
}
```

持有令牌的应用通过接口可以访问该用户的所有资源,
用户可以通过平台的用户权限系统控制令牌权限.


## 撤销令牌

第三方应用使用参数通过服务器直接调用接口 `/xboson/oauth2/revoke_token`

必要 HTTP 参数:

* `client_id` 应用 iD
* `client_secret` 密钥
* `access_token` 令牌, 90 英文字符长度.


## 用令牌访问接口

调用平台接口时附加 `access_token` 的 HTTP 参数即可.


# 非 OAuth 授权方法

第三方应用充当一个 '用户' 直接登录并访问平台接口.

## 步骤

1. 准备一个可登录用户

该用户应该含有希望调用接口的权限.

2. 调用接口 `/xboson/user/login` 进行登录.

http 参数: 

* userid -- 用户名
* password -- 密码的 md5

该接口成功返回后, 应将 http 应答头中的 Cookie 保存起来.
这个 Cookie 值对应用户授权.

3. 调用平台接口

调用时除标准之外, 在 http 请求头中设置 Cookie 头域为保存的值.
