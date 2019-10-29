# 前端手脚架

## 使用方式

npm install -g nic-cli

### H5项目

```shell
nic init h5
```

### WEB端项目

```shell
nic init web
```

### nodejs项目

### 开发指南

入口文件`src/index.js`

注意这个文件开头的`#!/usr/bin/env node`这行代码表示该js文件可以当做linux脚本文件执行。

也就是可以直接在命令行中使用 `./src/index.js`执行.

*脚手架思路*根据不同的输入，选择templates文件夹中不同的模板。
