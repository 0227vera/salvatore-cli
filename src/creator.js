let fse = require('fs-extra')
let fs = require('fs')
let path = require('path')
let download = require('download-git-repo')
let template = require('art-template')
let { exec } = require('child_process')
const chalk = require('chalk')
const username = require('username')
template.defaults.rules.shift() // 移除ejs支持

/**
 *创建项目目录
 *
 * @param {*} projectName
 */
async function createProject (projectName, projectPath) {
  projectPath = projectPath || process.env.PWD
  let dir = await fse.ensureDir(projectPath + '/' + projectName)
  return dir
}

/**
 *检查是否能创建DIR
 *
 * @param {*} projectName 项目名称
 * @param {*} projectPath 项目地址
 * @returns
 */
function ensureDir (projectName, projectPath) {
  projectPath = projectPath || process.env.PWD
  return fs.existsSync(projectPath + '/' + projectName)
}

/**
 *
 * 复制远程模板
 * @param {*} type  h5-vue  h5-react web-vue web-react node applet
 * @param {*} target
 * @returns
 */
async function copyTemplate (type, target) {
  let error = await copyGitTemplace(type, target)
  return error
}

/**
 * 复制远程模板
 * type: 在之前已经拼成了和远程的name相同了
 */
function copyGitTemplace (type, target) {
  console.log(chalk.cyan('\n 开始拉取远程模板\n'))
  const url = 'https://github.com:0227vera/' + type + '#master' // 模板的git地址
  console.log('------>', url)
  return new Promise((resolve, reject) => {
    download(url, target, { clone: true }, function (err) {
      if (!err) {
        console.log(chalk.cyan('\n 拉取远程模板完成\n'))
      } else {
        console.log(chalk.cyan('\n 拉取远程模板失败，查看是否拥有模板权限，或联系脚手架管理人员\n'))
      }
      err ? reject(err) : resolve(true)
    })
  })
}

/**
 * 复制项目.gitignore
 */
async function copyGitIgnore (target) {
  let file = path.resolve(__dirname, '../templates', 'gitignore')
  let error = await copy(file, path.resolve(target, '.gitignore'))
  return error
}

/**
 * 远程模板复制
 */

/**
 * 复制一个文件或者文件夹到另一个目录
 * @param {string} src 文件或者文件夹路径
 * @param {string} dest 文件夹路径
 */
async function copy (src, dir) {
  let err = await fse.copy(src, dir)
  return err
}

/**
 * 将模板中的变量替换成指定值
 */
async function rewriteTemplate (data, files) {
  await files.forEach(file => {
    let newFile = template(file, data)
    fs.writeFile(file, newFile, function () {})
  })
}
/**
 * 执行命令
 */
async function execCmd (cmd) {
  let res = await exec(cmd, async (error, stdout, stderr) => {
    if (error) {
      return error
    }
    return stderr
  })
  return res
}
/**
 * 获取当前项目用户
 */
async function getUsername () {
  let name = await username()
  return name
}

module.exports = {
  rewriteTemplate,
  createProject,
  copyGitIgnore,
  copyTemplate,
  getUsername,
  ensureDir,
  execCmd,
  copy
}
