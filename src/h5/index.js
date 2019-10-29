/**
 * 创建H5模板
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')

let {
  rewriteTemplate,
  createProject,
  copyGitIgnore,
  copyTemplate,
  getUsername,
  ensureDir,
  copy
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
      return 'salvatore-xx'
    }
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
    default: function () {
      return '脚手架创建H5模板'
    }
  },
  {
    type: 'list',
    name: 'projectType',
    message: '请选择H5项目模板?',
    choices: [
      'h5-cli2',
      'h5-cli3'
    ]
  },
  {
    type: 'input',
    name: 'projectContext',
    message: '请输入项目上下文',
    default: function () {
      return '/context'
    }
  },
  {
    type: 'input',
    name: 'versionPath',
    message: '请输入版本判断接口',
    default: function () {
      return '/context/who.do'
    }
  }
]

module.exports = async function () {
  let answer = await inquirer.prompt(questions)
  const spinner = ora('building for production...\n')
  spinner.start()
  answer.username = await getUsername()
  spinner.start('初始化中...')
  try {
    let dir = await createProject(answer.projectName)
    await copyTemplate(answer.projectType, dir)
    switch (answer.projectType) {
      case 'h5-cli2' :
        await rewriteTemplate(answer, [
          path.resolve(dir, './package.json'),
          path.resolve(dir, './index.html'),
          path.resolve(dir, './config/proxy.js')
        ])
        break
      case 'h5-cli3':
        await rewriteTemplate(answer, [
          path.resolve(dir, './package.json'),
          path.resolve(dir, './public/index.html'),
          path.resolve(dir, './proxy.js')
        ])
        break
      default:
        break
    }
    await copyGitIgnore(dir)
    if (answer.isAddDocs) {
      copy(path.resolve(__dirname, '../../templates/docs'), dir)
    }
    spinner.stop()
    console.log(chalk.cyan(`\n 项目初始化完成.\n 位置 ${dir}`))
  } catch (e) {
    spinner.stop()
    console.log(e)
  }
}
