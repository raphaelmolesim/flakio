import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { Home } from './views/home.js'
import { staticPlugin } from '@elysiajs/static'

import { CredentialsDatabase } from './db/credentials.ts'
import { JobsDatabase } from './db/jobs.ts'
import { TestsDatabase } from './db/tests.ts'
import { 
  credentialsIndex, 
  credentialsCreate, 
  credentialsDestroy, 
  credentialsUpdate } from './controllers/credentials_controller.js'
import { getGitLabJobs, syncJobs, getGitLabFailedTests, updateTestRunData } from './controllers/jobs_controller.js'
import { syncTests } from './controllers/tests_controller.js'


new JobsDatabase().database()
new TestsDatabase().database()

const app = new Elysia()
    .decorate("credentialsDb", () => new CredentialsDatabase())
    .decorate("jobsDb", () => new JobsDatabase())
    .decorate("testsDb", () => new TestsDatabase())
    .use(html())
    .use(staticPlugin({
      assets : "./dist"
    }))
    .get('/', () => (
      Bun.file('./dist/home.html')
    ))
    .get('/credentials', credentialsIndex)
    .post('/credentials', credentialsCreate)
    .delete('/credentials/:id', credentialsDestroy)
    .put('/credentials/:id', credentialsUpdate)
    .get('/jobs', getGitLabJobs)
    .get('/jobs/:id/failed-tests', getGitLabFailedTests)
    .patch('/jobs/update-test-run-data', updateTestRunData)
    .post('/sync-jobs', syncJobs)
    .post('/sync-tests', syncTests)
    .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
