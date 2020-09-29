/**
 * 创建H5模板
 * inquirer: 交互使用的工具
 * ora: 交互loading
 * chalk: console颜色
 * mail: 发送邮件
 * inGit: 内部git地址标识
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const mail = require('../mail')
// const inGit = /(git\.sogou-inc\.com)/g

const loading = text => {
  return chalk.bgGreen(chalk.white(text))
}

const success = text => {
  return chalk.green(text)
}

const warning = text => {
  return chalk.yellow(text)
}

const info = text => {
  return chalk.blue(text)
}

let {
  rewriteTemplate,
  createProject,
  copyTemplate,
  getUsername,
  ensureDir,
  execCmd
} = require('../creator')

let base = [
  {
    type: 'input',
    name: 'projectName',
    message: info('请输入项目名称'),
    validate: function(value) {
      if (ensureDir(value)) {
        return '此目录已经存在，请重新输入'
      }
      return true
    },
    default: function() {
      return 'h5-template'
    }
  },
  {
    type: 'input',
    name: 'description',
    message: info('请输入项目描述'),
    default: function() {
      return 'h5开发模版'
    }
  },
  {
    type: 'input',
    name: 'author',
    message: info('请输入项目开发人员，如果是多人使用英文 "," 分割'),
    default: function() {
      return 'xx'
    }
  },
  {
    type: 'input',
    name: 'mails',
    message: info('请输入开发人员邮箱，如果是多人使用英文 "," 分割'),
    default: function() {
      return 'xxx@xxxx.com'
    }
  },
  {
    type: 'list',
    name: 'langType',
    message: info('请选择使用vue/react编写'),
    choices: [{ name: 'vue', value: 1 }, { name: 'react', value: 2 }],
    default: 0 // 默认是下标为0的选项
  },
  {
    type: 'input',
    name: 'projectContext',
    message: info('请输入项目上下文(用于项目中的代理)'),
    default: function() {
      return '/context'
    }
  },
  {
    type: 'input',
    name: 'projectProxyUrl',
    message: info('请输入项目需要代理到的服务器(api文档地址))'),
    default: function() {
      return 'http://api.xxx.com/mock/xxx/'
    }
  },
  {
    type: 'confirm',
    name: 'needInitGit',
    message: warning('项目初始化之后是否直接通过命令上传第一次git'),
    default: function() {
      return true
    }
  },
  {
    type: 'input',
    name: 'gitAddress',
    message: warning('请输入项目git地址'),
    default: function() {
      return 'https://github.com/'
    },
    when(answer) {
      return answer.needInitGit
    }
  },
  {
    type: 'confirm',
    name: 'isAddCI',
    message: warning('是否现在填写CI信息？'),
    default: true,
    when(answer) {
      return answer.langType === 0 // 暂时隐藏ci的功能，使用misc的功能
    }
  },
  {
    type: 'input',
    name: 'productionAddress',
    message: warning(
      '请输入项目打包之后的地址(前缀会自动加上https://misc.sogou-inc.com/app/)'
    ),
    default: function() {
      return 'bi/xxx'
    }
    // when(answer) { // 暂时统一使用misc的构建方式
    //   return answer.langType === 2
    // }
  }
]

let vueAddCi = [
  {
    type: 'input',
    name: 'parkName',
    message: warning('请输入构建时输出补丁的压缩包名称(tar.gz)'),
    default: function() {
      return 'app.front.tar.gz'
    }
  },
  {
    type: 'input',
    name: 'host',
    message: warning('请输入SFTP服务器地址'),
    default: function() {
      return '127.0.0.1'
    }
  },
  {
    type: 'input',
    name: 'port',
    message: warning('请输入SFTP服务器端口'),
    default: function() {
      return '80'
    }
  },
  {
    type: 'input',
    name: 'username',
    message: warning('请输入SFTP用户名'),
    default: function() {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'password',
    message: warning('请输入SFTP密码'),
    default: function() {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'sftpProjectPath',
    message: warning('请输入SFTP上传目录'),
    default: function() {
      return '/xxx/xxx/QIYEHAO_school_demo_V1.0.0_000_20200331_name_前端全部补丁'
    }
  }
]

module.exports = async function() {
  let answer = await inquirer.prompt(base)
  const type = answer.langType === 1 ? 'vue' : 'react'
  // 根据基本信息的答案，判断接下来需要问的问题
  // 如果是需要vue的模版，需要考虑到原来的数据是否需要添加ci，不添加给默认值
  if (answer.isAddCI) {
    Object.assign(answer, await inquirer.prompt(vueAddCi))
  } else {
    answer.parkName = 'app.front.tar.gz'
    answer.host = '127.0.0.1'
    answer.port = '80'
    answer.username = 'xxxx'
    answer.password = 'xxx'
    answer.sftpProjectPath =
      '/xxx/xxx/QIYEHAO_school_demo_V1.0.0_000_20200331_name_前端全部补丁'
  }

  const spinner = ora(loading('building for production...\n'))
  spinner.start()
  answer.username = await getUsername()
  let dir = await createProject(answer.projectName)
  await copyTemplate('h5-' + type, dir)
  let awiatArr =
    type === 'vue'
      ? [
          path.resolve(dir, './package.json'),
          path.resolve(dir, './vue.config.js'),
          path.resolve(dir, './.env.temp'),
          path.resolve(dir, './src/services/services.js')
        ]
      : [
          path.resolve(dir, './package.json'),
          path.resolve(dir, './src/services/commenPromise.js'),
          path.resolve(dir, './devProxy.js'),
          path.resolve(dir, './webpack.config.js')
        ]
  if (answer.needInitGit) {
    awiatArr.push(path.resolve(dir, './init.sh'))
  } else {
    execCmd('rm -rf ' + path.resolve(dir, './init.sh'))
  }
  await rewriteTemplate(answer, awiatArr)
  await execCmd(
    'mv ' + path.resolve(dir, './.env.temp') + ' ' + path.resolve(dir, './.env')
  )
  spinner.stop()
  console.log(chalk.green(`\n 项目初始化完成.\n 位置----> ${dir}\n`))

  // 配置了git并且需要初始化信息的时候通过邮箱告知相关人员添加配置
  // if (inGit.test(answer.gitAddress) && answer.needInitGit) {
  const sending = ora(loading('正在为将您的信息发送邮件给相关人，请稍等……'))
  sending.start()
  const msg = await mail(answer)
  console.log(chalk.cyan(`\n ${msg} \n `))
  sending.stop()
  console.log(success(`\n 已将您的项目信息发送给相关人员 \n `))
  // }
  console.log(
    chalk.cyan(`-----------------------------------------------------------`)
  )

  // 如果有git相关信息，直接通过命令初始化git，如果没有需要自己去初始化
  if (answer.needInitGit) {
    console.log(success(`\n cd ${answer.projectName} \n npm run init`))
  } else {
    console.log(
      success(
        `\n cd ${answer.projectName} \n npm i \n npm start/npm run dev \n`
      )
    )
  }
}
