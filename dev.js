const { exec, spawn } = require('child_process');

const subProcesses = []

subProcesses.push(spawn('source ~/.zshrc ; bun start', {
  stdio: 'inherit',
  shell: true
}))

subProcesses.push(spawn('source ~/.zshrc ; bun compile-react', {
  stdio: 'inherit',
  shell: true
}))

subProcesses.push(spawn('source ~/.zshrc ; bun assets', {
  stdio: 'inherit',
  shell: true
}))

subProcesses.forEach((subProcess) => {
  subProcess.on('data', (data) => {
    console.log(`child process stdout:\n ${data}`)
  })
})