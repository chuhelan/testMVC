# 技术架构

- 后端：springboot + mybatis + maven
- 前端：tailwind + webpack + typescript

# 开发环境与工具

- Ubuntu
- Jetbrains IDEA
- Jetbrains Webstrom
- Navicat
- Microaoft Vscode
- postman
- 腾讯云
- 宝塔面板
- github代码托管

# 页面

## 首页

![](https://image.chuhelan.com/i/2023/06/11/6485940134e64.png)

## 登录界面

![image-20230611173030435](https://image.chuhelan.com/i/2023/06/11/6485943a6cac1.png)

## 注册界面

![image-20230611173150203](https://image.chuhelan.com/i/2023/06/11/648594880871f.png)

## home页面

个人信息展示

![image-20230611173244337](https://image.chuhelan.com/i/2023/06/11/648594be5c33d.png)

修改密码和删除账户

![image-20230611173320591](https://image.chuhelan.com/i/2023/06/11/648594e2782a8.png)

# 特点

- 响应式网页 支持多设备适应
- 支持全局暗黑模式 可根据系统主题自动切换



## 数据合法性验证

- 以CZ开头的13位学号的验证
- 真实姓名中文字符的验证判断
- 电子邮件地址的验证



## 数据安全加密

- 密码加密算法采用sha256非对称加密算法+base64编码



## 接口规范

- 使用restfulAPI设计接口规范，统一状态码



## 网页cookie

- 所有cookie自登录起设置三天有效时间，重新登陆刷新cookie
- 用户退出账号设置cookie过期



## 页面未登录拦截

- 若果直接访问目标页面未通过登录页面，程序先检测有没有缓存有效期内的数据，若有则可正常访问，若没有则返回登录页面



# 运行要求

1. mysql5.7
2. jdk1.8
3. nodejs 18



# 运行项目

项目前后端分离

前端项目目录在public文件夹下

项目默认端口：2731



## 从源码构建运行

1. 配置maven依赖

2. 导入sql文件

3. 修改application.yml中数据库配置

4. 使用 npm install 安装modules文件

   ```shell
   npm install
   ```

5. 一件运行StartTest.class



项目已在github开源https://github.com/chuhelan/testMVC
