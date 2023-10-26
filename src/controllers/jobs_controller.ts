import { GitLabService } from '../gitlab_service.ts'

export const syncJobs = async ({ jobsDb, body }) => {
  const newItems = []
  console.log('[JobsController] Syncing jobs', body)
  const promises = body.jobs.map(async (job) => {
    const existentJob = await jobsDb().find(job.jobId)
    if (existentJob != null) {
      console.log('[JobsController] Job already exists', existentJob)
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
      console.log('[JobsController] Synced job', id)
      newItems.push(id.id)
      return id.id
    }
  })

  await Promise.all(promises)
  return {
    jobIds: newItems
  }
}


export const indexJobs = ({ jobsDb, body }) => {

  const jobs = jobsDb().all()
  
  return {
    jobs
  }
}

export const getGitLabJobs = (ctx) => {
  const { projectId, apiUrl, privateToken, page } = ctx.query
  console.log('🦊 Fetching jobs for in: ', projectId, apiUrl, privateToken)
  const gitlabService = new GitLabService(projectId, apiUrl, privateToken)
  return gitlabService.getJobs(page);
}