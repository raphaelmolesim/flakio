import { GitLabService } from '../gitlab_service.ts'

export const syncTests = async ({ testsDb, body }) => {
  const newItems = []
  console.log('[TestController] Syncing test', body)
  const promises = body.tests.map(async (test) => {
    const existentTest = await testsDb().find(test.jobId, test.line)
    if (existentTest != null) {
      console.log('[TestController] Test already exists', existentTest)
      return null
    } else {
      const id = await testsDb().create({
        line: test.line,
        name: test.name,
        error_messages: test.errorMessages,
        job_id: test.jobId,
      })
      console.log('[TestController] Synced test', id)
      newItems.push(id.id)
      return id.id
    }
  })

  await Promise.all(promises)
  return {
    testIds: newItems
  }
}

export const getErrorsByMR = async ({ testsDb, settingsDb, params }) => {
  const decodedJobName = decodeURI(params.jobName.replaceAll('@slash-bar', '/'))

  const settings = await settingsDb().all()
  const unificationRules = settings.find((setting) => setting.key === 'unificationRules')
  let jobNames = null

  if (unificationRules) {
    const parsedUnificationRules = JSON.parse(unificationRules.value)
    const rules = parsedUnificationRules.filter((rule) => rule.unifiedJob === decodedJobName)
    if (rules.length > 0)
      jobNames = rules.map((rule) => rule.jobs).flat()
  }
  
  // if no rules were found, use the job name as is
  if (jobNames === null)
    jobNames = [ decodedJobName ]
    
  const tests = await testsDb().queryTestByMR(jobNames)
  return tests
}

export const getTestDetails = async ({ testsDb, query }) => {
  console.log('[TestController] #getTestDetails QUERY STRING', query)
  return await testsDb().all(query.testLine, query.jobName)
}