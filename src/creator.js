let fse = require('fs-extra')
let fs = require('fs')
let path = require('path')
let template = require('art-template')
let { exec } = require('child_process')
const username = require('username')
template.defaults.rules.shift() // 移除ejs支持

/**
 *创建项目目录
 *
 * @param {*} projectName
 */
async function createProject (projectName, projectPath) {
  projectPath = projectPath || process.env.PWD
  let dir = await fse.ensureDir(path.resolve(__dirname, projectName))
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
 * 复制模板
 * @param {string} type 项目类型
 * @param {*} target 复制地址
 */
async function copyTemplate (type, target) {
  let dir = path.resolve(__dirname, '../templates', type)
  let error = await copy(dir, target)
  return error
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
