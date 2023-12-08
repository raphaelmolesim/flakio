import { GitLabService } from '../gitlab_service.ts'
import { ConsoleOutputLogger } from '../console_output_logger.js'

const logger = new ConsoleOutputLogger("info", "JobsController")

export const syncJobs = async ({ jobsDb, body }) => {
  const newItems = []
  logger.debug('Syncing jobs')
  const promises = body.jobs.map(async (job) => {
    const existentJob = await jobsDb().find(job.jobId)
    if (existentJob != null) {
      logger.info('Job already exists')
      logger.debug('Job', existentJob)
      return null
    } else {
      const id = await jobsDb().create({
        job_id: job.jobId,
        job_name: job.name,
        status: job.status,
        finished_at: job.finishedAt,
        ref: job.ref,
        author: job.authorName, 
        autor_avatar_url: job.authorAvatarUrl, 
        pipeline_id: job.pipelineId, 
        pipeline_url: job.pipelineUrl, 
        duration: job.duration,
        queue_duration: job.queueDuration,
        coverage: job.coverage
      })
      console.info('Synced job', id)
      newItems.push(id.id)
      return id.id
    }
  })

  await Promise.all(promises)
  return {
    jobIds: newItems
  }
}

export const updateTestRunData = async ({ jobsDb, body }) => {  
  logger.debug('Updating Test Run Data in jobs')
  const promises = body.jobs.map(async (job) => {
    const existentJob = await jobsDb().find(job.jobId)
    if (existentJob != null) {
      logger.debug('Found Job:', existentJob)
      const id = await jobsDb().updateTestRunData(job.jobId, job.overallStatus, job.seed)
      logger.info('Updated Job', id)
    } else {
      throw new Error('Job not found with id: ' + job.jobId)
    }
  })
  await Promise.all(promises)
  return {
    status: 'ok'
  }
}

export const getPreferredJobs = async ({ jobsDb }) => {
  logger.debug('Fetching preferred jobs')
  const jobs = await jobsDb().all()
  //logger.debug('Found jobs', jobs)
  //const groupedByName = Object.groupBy(jobs, (job) => job.name)
  const groupedByName = jobs.reduce((hash, job) => {
    hash[job.job_name] = hash[job.job_name] || []
    hash[job.job_name].push(job)
    return hash
  }, {})
  const preferredJobs = Object.keys(groupedByName)
  logger.debug('Found preferred jobs', preferredJobs)
  return preferredJobs
}

export const getLastImportData = async ({ jobsDb }) => {
  logger.debug('Fetching last import data')
  const jobs = await jobsDb().all()
  const lastJob = jobs.reduce((candidate, job) => {
    const jobDate = new Date(job.finished_at)
    const candidateDate = new Date(candidate.finished_at)
    if (candidate.finished_at === undefined || candidateDate > jobDate)
      return job
    else
      return candidate
  }, {})
  return {
    lastDateFetched: lastJob.finished_at,
    jobsCount: jobs.length
  }
}

export const getGitLabJobs = (ctx) => {
  const { projectId, apiUrl, privateToken, page } = ctx.query
  logger.info('Fetching jobs, page:', page)
  const gitlabService = new GitLabService(projectId, apiUrl, privateToken)
  return gitlabService.getFinishedJobs(page);
}

export const getGitLabFailedTests = async (ctx) => {
  const id = ctx.params.id
  const { projectId, apiUrl, privateToken } = ctx.query
  const gitlabService = new GitLabService(projectId, apiUrl, privateToken)
  const logTrace = await gitlabService.getJobTrace(id);
  
  // Debugging purposes only
  // logger.debug(`log trace`, logTrace, id)
  
  const matches = getTextBetween(logTrace, 'Failed examples:', 'Randomized with seed') 
  logger.debug(`Found ${matches.length} Matches`)

  if (matches.length === 0) {
    logger.info(`No failed tests found`)// , logTrace)
    return {
      failedTests: [],
      seed: null,
      overallStatus: null,
      jobId: id
    }
  }

  const seed = /Randomized with seed ([0-9]+)\W/.exec(logTrace)[1]  
  
  const overallStatus = /[0-9]+ examples?, [0-9]+ failures?(, [0-9]+ pending)?/.exec(logTrace)[0]  
  //const overallStatus = overallStatusArray != null ? overallStatusArray[0] : "not found"
  
  const failedTest = matches.map((match) => {
    if (match.includes('rspec ./spec')) {
      const [line, testName] = match.split('#')
      return {
        line: line.trim(),
        name: testName.trim(),
        jobId: id
      }
    }
    return null
  }).filter(m => m != null)
  
  const errorMessagesCrop = getTextBetween(logTrace, 'Failures:', 'Finished in').join('\n')

  //if (failedTest.length === 0) {
  //  logger.debug(`No failed tests found`, logTrace)
  //}

  failedTest.map((test) => {
    const errorMessages = getErrorMessage(errorMessagesCrop, test.name)
    test.errorMessages = errorMessages
  })

  logger.info(`Found ${failedTest.length} tests`)

  return {
    failedTests: failedTest,
    overallStatus: overallStatus,
    seed: seed,
    jobId: id
  }
}

function getTextBetween(str, start, end) {
  if (str === null || str === undefined) throw new Error('This is a invalid string: ', str)

  const lines = str.split('\n')

  let selectLine = false
  const matches = []

  lines.forEach((line) => {
    if (line.includes(start)) {
      selectLine = true
    }

    if (line.includes(end)) {
      selectLine = false
    }

    if (selectLine) {
      matches.push(line)
    }
  })

  return matches
}

function getErrorMessage(str, testName) {
  const lines = str.split('\n')

  let selectLine = false
  let matches = []
  let countHash = 0
  const returningArray = []  

  lines.forEach((line) => {
    if (line.includes(testName)) {
      logger.debug(line, '=>', testName)
      selectLine = true
    }

    if (line.includes('#') && selectLine) {
      countHash += 1
      if (countHash > 3) {
        countHash = 0
        selectLine = false
        returningArray.push(matches.join('\n'))
        matches = []
      }
    }
    

    if (selectLine) {
      matches.push(line)
    }
  })

  return returningArray
}