import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { Home } from './views/pages/home.js'
import { staticPlugin } from '@elysiajs/static'

import { CredentialsDatabase } from './db/credentials.ts'
import { JobsDatabase } from './db/jobs.ts'
import { TestsDatabase } from './db/tests.ts'
import { SettingsDatabase } from './db/settings.js'
import { 
  credentialsIndex, 
  credentialsCreate, 
  credentialsDestroy, 
  credentialsUpdate } from './controllers/credentials_controller.js'
import { 
  getGitLabJobs, 
  syncJobs, 
  getGitLabFailedTests, 
  updateTestRunData, 
  getPreferredJobs,
  getLastImportData
} from './controllers/jobs_controller.js'
import { syncTests, getErrorsByMR, getTestDetails } from './controllers/tests_controller.js'
import { settingsIndex, settingsCreate, settingsUpdate, settingsBulkUpdate } from "./controllers/settings_controller.js"

new CredentialsDatabase().database()
new JobsDatabase().database()
new TestsDatabase().database()
new SettingsDatabase().database()

const app = new Elysia()
    .decorate("credentialsDb", () => new CredentialsDatabase())
    .decorate("jobsDb", () => new JobsDatabase())
    .decorate("testsDb", () => new TestsDatabase())
    .decorate("settingsDb", () => new SettingsDatabase())
    .use(html())
    .use(staticPlugin({
      assets : "./dist"
    }))

    // React routes
    .get('/', () => Bun.file('./dist/home.html'))
    .get('/settings', () => Bun.file('./dist/home.html'))
    .get('/download', () => Bun.file('./dist/home.html'))
    .get('/reports', () => Bun.file('./dist/home.html'))
    
    // API routes
    .get('/credentials', credentialsIndex)
    .post('/credentials', credentialsCreate)
    .delete('/credentials/:id', credentialsDestroy)
    .put('/credentials/:id', credentialsUpdate)
    .get('/jobs', getGitLabJobs)
    .get('/jobs/:id/failed-tests', getGitLabFailedTests)
    .patch('/jobs/update-test-run-data', updateTestRunData)
    .post('/sync-jobs', syncJobs)
    .post('/sync-tests', syncTests)
    .get('/preferred-jobs', getPreferredJobs)
    .get('/tests/:jobName', getErrorsByMR)
    .get('/tests/details', getTestDetails)
    .get('/last-import', getLastImportData)

    // Settings API routes
    .get('/api/settings', settingsIndex)
    .post('/api/settings', settingsCreate)
    .patch('/api/settings', settingsUpdate)
    .put('/api/settings/bulk-update', settingsBulkUpdate)
    
    .listen(3030)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
