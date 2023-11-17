#!/usr/bin/env bun

import { GitLabService } from "../src/gitlab_service.ts"
import { CredentialsDatabase } from "../src/db/credentials.js"
import { ConsoleOutputLogger } from "../src/console_output_logger.js"

const { exec, spawn } = require('child_process');
const logger = new ConsoleOutputLogger()

if (process.argv.length === 2) {
  logger.error('Expected at least one argument!')
  process.exit(1)
}

const pipelineId = process.argv[2]
new CredentialsDatabase().all().then(async function(credentials) { 
  const credential = credentials[0]
  const gitlabService = new GitLabService(credential.project_id, credential.api_url, credential.private_token)
  let status = 'starting'
  logger.info("==> CI monitoring: ", pipelineId)
  
  while (status === "running" || status == "starting") {
    if (status != 'starting')
      await Bun.sleep(20 * 1000)
    const pipelineData = await gitlabService.getPipeline(pipelineId)
    status = pipelineData["status"]
    logger.inline(".")
  }

  logger.info("\n==> Done!")
  playAudioNotification()
})

const playAudioNotification = function(audioId = 1) {
  const player = require('play-sound')({})  
  player.play(`audio/notification-v${audioId}.mp3`, function(err){
    if (err) throw err
  })
}