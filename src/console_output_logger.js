import chalk from 'chalk'

export class ConsoleOutputLogger {

  constructor(debugLevel='info', context) {
    this.debugLevel = debugLevel
    this.context = context || ''
    this.log = console.log
    this.error = console.error
  }

  info(...args) {
    this.log(chalk.green(...args))
  }

  error(...args) {
    this.error(chalk.red(...args))
  }

  inline(text) {
    process.stdout.write(text)
  }

  debug(...args) {
    if (this.debugLevel === 'debug')
      this.log(`[${this.context}]`, ...args)
  }
}