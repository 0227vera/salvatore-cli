# pc

> 乐知行PC端应用模板

## 说明

### 主要文件

**config/proxy.js**

该文件主要配置代理相关内容。

开发时一般代理到[在线文档](http://editor.lezhixing.com.cn/)里面。在线文档可以把编写的文档自动生成模拟数据，并提供可以通过接口访问。

`filter: '/context'` context表示API的上下文，在一个项目开始时，需要和后端确认API的上下文。

 Anthorization表示通过TOKEN认证，虽然PC端的项目用户认证是通过COOKIE来实现的，但是一般接口也支持JWT认证。
  
token的生成方式：[说明文档](http://fe.lezhixing.com.cn/files/20180427/H5%E5%BA%94%E7%94%A8%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E5%8F%8AURL%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B-20180427.pdf)

文档主要是说明H5URL构建方式，但是里面包含了token的生成方式

在联调阶段，只需要让后端给你一个项目的用户ID，然后在[http://fe.lezhixing.com.cn/validate](http://fe.lezhixing.com.cn/validate)将ID转换成token即可。

**package.json**

注意，可以直接在运行命令行的时候强制置顶连接的服务。 

```shell
DATA_ORIGIN=online npm run dev
```

