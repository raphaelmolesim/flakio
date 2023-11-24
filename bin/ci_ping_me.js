#!/usr/bin/env bun

import { GitLabService } from "../src/gitlab_service.ts"
import { CredentialsDatabase } from "../src/db/credentials.js"
import { ConsoleOutputLogger } from "../src/console_output_logger.js"
import { isNullOrUndefined } from "util";
import { pipeline } from "stream";

const { exec, spawn } = require('child_process');
const logger = new ConsoleOutputLogger()

new CredentialsDatabase().all().then(async function(credentials) { 
  const credential = credentials[0]
  const gitlabService = new GitLabService(credential.project_id, credential.api_url, credential.private_token)
  
  let id = null
  logger.debug("[Ci Ping Me] Arguments:", process.argv)
  let fetcher = (id) => gitlabService.getPipeline(id)  

  if (process.argv.length === 2) {
    const userData = await gitlabService.getUser()
    const pipelines = await gitlabService.getPipelines("running", userData.username)

    logger.debug("[Ci Ping Me] Pipelines found:", pipelines)
    if (pipelines.length > 1) {
      logger.error('Too many pipelines running, it is not possible which one to track, please provide pipeline id')
      process.exit(1)
    } else if (pipelines.length < 1) {
      logger.error('No running pipeline was found, please provide pipeline id')
      process.exit(1)
    } else {
      id = pipelines[0].id
    }
  } else {
    const argument = process.argv[2]

    if (argument.includes("--trace-job") || argument.includes("-j")) {
      const traceJobFlag = argument.split('=')
      if (traceJobFlag.length < 2) {
        logger.error('Job is not found. Provide job id by following flag --trace-job=$jobId or -j=$jobId. Don\'t forget the \'=\'')
        process.exit(1)
      } else {
        id = traceJobFlag[1]
        fetcher = (id) => gitlabService.getJob(id)
      }

    } else
      id = process.argv[2]
  }
  
  if (isNullOrUndefined(id)) {
    logger.error('Expected at least one argument!')
    process.exit(1)
  }

  let status = 'starting'
  logger.info("==> CI monitoring:", id)
  
  while (status === "running" || status === "starting" || status === "pending") {
    if (status != 'starting')
      await Bun.sleep(20 * 1000)
    const pipelineData = await fetcher(id)
    status = pipelineData["status"]
    logger.inline('.')
  }

  logger.info("\n==> Done!")
  playAudioNotification()
})

const playAudioNotification = function(audioId = null) {
  const player = require('play-sound')({})
  const defaultedId = audioId || Bun.env.NOTIFICATION_SOUND_ID || 1
  player.play(`audio/notification-v${defaultedId}.mp3`, function(err){
    if (err) throw err
  })
}