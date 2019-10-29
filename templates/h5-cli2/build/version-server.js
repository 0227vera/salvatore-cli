/**
 * 用于模拟build后，测试版本跳转功能。
 */
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');
var path = require('path');
var chalk = require('chalk')
var app = express();

var APP_NAME = '/school_template'

app.use('/template', proxyMiddleware({
  target: 'http://localhost:4000',
  pathRewrite: {
    '/template/': '/'
  },
  changeOrigin: true
}))

app.use('/vue-vendor', proxyMiddleware({
  target: 'https://h5.lezhiyun.com',
  changeOrigin: true
}))

app.use(APP_NAME, express.static(path.join(__dirname, '../dist')))

app.listen(3000, function () {
  console.log('version server listen on 3000\n');
  console.log(chalk.cyan(`打开 http://localhost:3000${APP_NAME}?token=x&host=x\n`));
})
