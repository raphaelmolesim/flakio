import { GitLabService } from "./src/gitlab_service.ts"
import { CredentialsDatabase } from "./src/db/credentials.js"

const { exec, spawn } = require('child_process');

if (process.argv.length === 2) {
  console.error('Expected at least one argument!')
  process.exit(1)
}
const pipelineId = process.argv[2]
new CredentialsDatabase().all().then(async function(credentials) { 
  const credential = credentials[0]
  const gitlabService = new GitLabService(credential.project_id, credential.api_url, credential.private_token)
  let status = 'starting'
  console.log("==> CI monitoring: ", pipelineId)
  
  while (status != "success" && status != "failed") {
    if (status != 'starting')
      await Bun.sleep(20 * 1000)
    const pipelineData = await gitlabService.getPipeline(pipelineId)
    status = pipelineData["status"]
    process.stdout.write(".")
  }

  console.log("==> Done!")
  Bun.spawn(["say", "CI", "has", "finished"])
})

