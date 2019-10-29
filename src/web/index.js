/**
 * 创建web应用模板
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
// 创建目录结构的文件夹
let { rewriteTemplate, createProject, copyGitIgnore, copyTemplate, getUsername, ensureDir, copy } = require('../creator')

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
      return 'web-cli2'
    }
  },
  {
    type: 'input',
    name: 'context',
    message: '请输入项目API上下文',
    default: function () {
      return 'context'
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
    name: 'projectType',
    message: '请选择WEB端项目模板?',
    choices: [
      'web-cli2',
      'web-cli3'
    ]
  },
  {
    type: 'confirm',
    name: 'isAddDocs',
    message: '是否在项目中加入代码规范文档？',
    default: true
  }
]

module.exports = async function () {
  let answer = await inquirer.prompt(questions)
  answer.username = await getUsername()
  const spinner = ora('building for production...')
  spinner.start('初始化中...')
  try {
    let dir = await createProject(answer.projectName)
    await copyTemplate(answer.projectType, dir)
    switch (answer.projectType) {
      case 'web-cli2' :
        await rewriteTemplate(answer, [
          path.resolve(dir, './package.json'),
          path.resolve(dir, './index.html'),
          path.resolve(dir, './config/proxy.js')
        ])
        break
      case 'web-cli3':
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
