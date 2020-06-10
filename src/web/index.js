/**
 * 创建web应用模板
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
let {
  rewriteTemplate,
  createProject,
  copyTemplate,
  getUsername,
  ensureDir,
  execCmd
} = require('../creator')

let questions = [
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
    validate: function (value) {
      if (ensureDir(value)) {
        return '此目录已经存在'
      }
      return true
    },
    default: function () {
      return 'web'
    }
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
    default: function () {
      return 'WEB端vue模板项目'
    }
  },
  {
    type: 'list',
    name: 'langType',
    message: '请选择使用ts/js编写',
    choices: [
      { name: 'typeScript', value: 1 },
      { name: 'javaScript', value: 2 }
    ],
    default: 0 // 默认是下标为0的选项
  },
  {
    type: 'input',
    name: 'projectContext',
    message: '请输入项目API上下文',
    default: function () {
      return '/context'
    }
  },
  {
    type: 'input',
    name: 'projectProxyUrl',
    message: '请输入项目需要代理到的服务器',
    default: function () {
      return 'http://api.lezhixing.com.cn/mock/295/'
    }
  },
  {
    type: 'confirm',
    name: 'isAddCI',
    message: '是否现在填写CI信息？',
    default: true
  }
]
let questions2 = [
  {
    type: 'input',
    name: 'parkName',
    message: '请输入构建时输出补丁的压缩包名称(tar.gz)',
    default: function () {
      return 'app.front.tar.gz'
    }
  },
  {
    type: 'input',
    name: 'host',
    message: '请输入SFTP服务器地址',
    default: function () {
      return '127.0.0.1'
    }
  },
  {
    type: 'input',
    name: 'port',
    message: '请输入SFTP服务器端口',
    default: function () {
      return '80'
    }
  },
  {
    type: 'input',
    name: 'username',
    message: '请输入SFTP用户名',
    default: function () {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'password',
    message: '请输入SFTP密码',
    default: function () {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'sftpProjectPath',
    message: '请输入SFTP上传目录',
    default: function () {
      return '/xxx/xxx/QIYEHAO_school_demo_V1.0.0_000_20200331_name_前端全部补丁'
    }
  }
]
module.exports = async function () {
  let answer = await inquirer.prompt(questions)
  if (answer.isAddCI) {
    Object.assign(answer, await inquirer.prompt(questions2))
  } else {
    answer.parkName = 'app.front.tar.gz'
    answer.host = '127.0.0.1'
    answer.port = '80'
    answer.username = 'xxxx'
    answer.password = 'xxx'
    answer.sftpProjectPath = '/xxx/xxx/QIYEHAO_school_demo_V1.0.0_000_20200331_name_前端全部补丁'
  }
  answer.username = await getUsername()
  const spinner = ora('building for production...')
  spinner.start('初始化中...')
  try {
    let dir = await createProject(answer.projectName)
    let type = answer.langType === 1 ? 'ts' : 'js'
    await copyTemplate('web-' + type, dir)
    await rewriteTemplate(answer, [
      path.resolve(dir, './package.json'),
      path.resolve(dir, './vue.config.js'),
      path.resolve(dir, './.env.temp'),
      path.resolve(dir, './src/services/services.' + type)
    ])
    await execCmd('mv ' + path.resolve(dir, './.env.temp') + ' ' + path.resolve(dir, './.env'))
    spinner.stop()
    console.log(chalk.cyan(`\n 项目初始化完成.\n 位置 ${dir}`))
  } catch (e) {
    spinner.stop()
    console.log(e)
  }
}
