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

export const getErrorsByMR = async ({ testsDb, params }) => {
  const decodedJobName = decodeURI(params.jobName.replaceAll('@slash-bar', '/'))
  const tests = await testsDb().queryTestByMR(decodedJobName)
  return tests
}

export const getTestDetails = async ({ testsDb, params }) => {
  const decodedTestLine = decodeURI(params.testLine).replaceAll('@slash-bar', '/')
  console.log('[TestController] getTestDetails', decodedTestLine)
  const test = await testsDb().all_by_line(decodedTestLine)
  return test
}