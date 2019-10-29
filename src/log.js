const chalk = require('chalk')

module.exports = function (str, color) {
  if (color) {
    console.log(chalk[color](str))
  } else {
    console.log(str)
  }
}
