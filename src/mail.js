const nodemailer = require('nodemailer')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const Mail = '1066788870@qq.com'


const template = ejs.compile(
  fs.readFileSync(path.resolve(__dirname, 'mail.ejs'), 'utf8')
)
let transporter = nodemailer.createTransport({
  service: 'qq',
  // host: 'smtp.ethereal.email',
  port: 465,
  // secure: false,
  secureConnection: true,
  auth: {
    user: '1066788870@qq.com',
    pass: 'zyhxyxyksdttbejc'
  }
})
module.exports = config => {
  const html = template(
    Object.assign(
      {
        title: '使用脚手架初始化项目开发'
      },
      config
    )
  )
  return new Promise((resolve,reject) => {
    nodemailer.createTestAccount(err => {
      if (err) {
        reject(err)
      }

      let mailOptions = {
        from: '1066788870@qq.com',
        to: Mail,
        subject: 'git-misc配置信息',
        html: html
      }
      
      transporter.sendMail(mailOptions,(error) => {
        if (error) {
          reject(error)
        }
        resolve('Message sent successly')
      })
    })
  })
}
