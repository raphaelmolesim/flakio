import chalk from 'chalk'

export class ConsoleOutputLogger {

  constructor(debugLevel='info') {
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
}