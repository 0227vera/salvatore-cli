/**
 * 创建H5模板
 * inquirer: 交互使用的工具
 * ora: 交互loading
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

let base = [
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
    validate: function (value) {
      if (ensureDir(value)) {
        return '此目录已经存在' // todo: 询问是删除还是重新创建一个新的
      }
      return true
    },
    default: function () {
      return 'h5-template'
    }
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
    default: function () {
      return 'h5开发模版'
    }
  },
  {
    type: 'list',
    name: 'langType',
    message: '请选择使用vue/react编写',
    choices: [{ name: 'vue', value: 1 }, { name: 'react', value: 2 }],
    default: 0 // 默认是下标为0的选项
  },
  {
    type: 'input',
    name: 'projectContext',
    message: '请输入项目上下文(用于项目中的代理)',
    default: function () {
      return '/context'
    }
  },
  {
    type: 'input',
    name: 'projectProxyUrl',
    message: '请输入项目需要代理到的服务器(后端电脑或者测试服务器)',
    default: function () {
      return 'http://api.xxx.com/mock/xxx/'
    }
  },
  {
    type: 'confirm',
    name: 'needInitGit',
    message: '项目初始化之后是否直接通过命令上传第一次git',
    default: function () {
      return true
    }
  },
  {
    type: 'input',
    name: 'gitAddress',
    message: '请输入项目git地址',
    default: function () {
      return 'https://github.com/'
    },
    when (answer) {
      return answer.needInitGit
    }
  },
  {
    type: 'confirm',
    name: 'isAddCI',
    message: '是否现在填写CI信息？',
    default: true,
    when (answer) {
      return answer.langType === 1
    }
  },
  {
    type: 'input',
    name: 'productionAddress',
    message:
      '请输入项目打包之后的地址：（前缀加上https://misc.sogou-inc.com/app/）',
    default: function () {
      return 'bi/xxx'
    },
    when (answer) {
      return answer.langType !== 1
    }
  }
]

let vueAddCi = [
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

  const spinner = ora('building for production...\n')
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
  console.log(chalk.cyan(`\n 项目初始化完成.\n 位置 ${dir}`))
  console.log(
    chalk.cyan(`-----------------------------------------------------------`)
  )
  if (answer.needInitGit) {
    console.log(chalk.cyan(`\n cd ${answer.projectName} \n npm run init`))
  } else {
    console.log(chalk.cyan(`\n cd ${answer.projectName} \n npm i \n npm start/npm run dev \n`))
  }
}
