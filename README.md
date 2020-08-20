# uni-template-login

基于 uni-app & uniCloud 的前后一体登录模板

![](https://img-cdn-qiniu.dcloud.net.cn/7E6B79E2-B469-4CF3-8F4D-7502E72C4CB8.png?imageView2/0/w/375)
![](https://img-cdn-qiniu.dcloud.net.cn/659AE293-95F8-46E1-AC1F-D62FE3B080DB.png?imageView2/0/w/375)

## 快速体验

手机扫码体验：

![](https://img.cdn.aliyun.dcloud.net.cn/uni-app/uni-template-login-qr.png)

## 本地运行

1. 将项目拖入[HBuilderX](http://www.dcloud.io/hbuilderx.html)
2. 创建服务空间，详情参考[uniCloud 快速上手](https://uniapp.dcloud.net.cn/uniCloud/quickstart)
3. 上传 common 下的公用模块、在云函数 user-center 内安装 uni-id 模块并上传，[公用模块参考文档](https://uniapp.dcloud.io/uniCloud/cf-common)
4. 在 cloudfunctions 目录下的`db_init.json`右键初始化云数据库
5. 运行到 HBuilderX 内置浏览器体验
6. 如果运行到小程序，注意在小程序后台配置域名白名单，[详见](https://uniapp.dcloud.net.cn/uniCloud/quickstart?id=%e5%b0%8f%e7%a8%8b%e5%ba%8f%e4%b8%ad%e4%bd%bf%e7%94%a8unicloud%e7%9a%84%e7%99%bd%e5%90%8d%e5%8d%95%e9%85%8d%e7%bd%ae)

## 特点

- 前端基于uni-app实现，支持所有平台
- 服务端基于 uniCloud 实现，用户管理基于 [uni-id](https://uniapp.dcloud.net.cn/uniCloud/uni-id) 实现
- 使用 vuex 管理登录状态
- 支持账号密码、手机号验证等多种登录模式
- 支持裂变，可以邀请用户注册