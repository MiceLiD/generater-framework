const childProc = require('child_process')
const chalk = require('chalk')

const OpenChromePlugin = class {
  constructor(options) {
    this.extenal_ip_addr = options.extenal_ip_addr
    this.interal_ip_addr = 'http://localhost'
    this.port = options.port
    this.app_prefix = options.app_prefix
  }
  once(fn) {
    let called = false
    return () => {
      if (!called) {
        called = true
        fn.apply(this, arguments)
      }
    }
  }
  notify(signal, desc) {
    const strategy = {
      success: chalk.green,
      failed: chalk.red
    }
    console.log(strategy[signal](
      `Open Chrome ${signal}, ${desc} \n
        -- App listening at: ${this.interal_ip_addr}:${this.port}${this.app_prefix} \n
        -- Your external url is: ${this.extenal_ip_addr}:${this.port}${this.app_prefix}`
    ))
  }
  apply(compiler) {
    compiler.hooks.done.tap('open-chrome-plugin', this.once(compilation => {
      childProc.exec(`open -a "Google Chrome" ${this.interal_ip_addr}:${this.port}${this.app_prefix}`, (err) => {
        if (err) {
          this.notify('failed', 'Make sure you have chrome installed')
          return
        }
        this.notify('success', 'And...')
      })
    }))
  }
}

module.exports = {
  OpenChromePlugin
}