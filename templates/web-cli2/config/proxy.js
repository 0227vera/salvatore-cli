const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiMzVhNGNiYmRlZDA0OTViODA0NWEyZDZjZTFlMjczMiIsImV4cCI6MTUyMDkyMDUwOX0.TRGTk53_2a2J1usJesweh6HT0YtGFZw-7NClJyoefew'
const host = '0.0.0.0'

module.exports = {
  // 开发环境代理，将API接口代理到在线API平台
  mock: {
    '/context': {
      target: host,
      changeOrigin: true
    }
  },
  // 线上环境代理，一般线上出现问题，使用这个代理
  // Anthorization表示通过TOKEN认证，虽然PC端的项目用户认证是通过COOKIE来实现的
  // 但是一般接口支持JWT认证。
  // token的生成方式：http://fe.lezhixing.com.cn/files/20180427/H5%E5%BA%94%E7%94%A8%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E5%8F%8AURL%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B-20180427.pdf
  // H5的token和PC端的token一致
  online: {
    '/context': {
      target: host,
      changeOrigin: true,
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  },
  // 测试环境代理
  test: {
    '/context': {
      target: host,
      changeOrigin: true
    }
  },
  // 联调阶段，代理到后端电脑
  backend: {
    '/context': {
      target: host,
      changeOrigin: true
    }
  }
}
