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
import { getNumberOfTestPerJob } from './controllers/overview_controller.js'
import { settingsIndex, settingsCreate, settingsUpdate, settingsBulkUpdate } from "./controllers/settings_controller.js"
import Database from "bun:sqlite";
import { initializeDatabase } from "./db/data_mapper.js";
import { OverviewQueryDatabase } from "./db/overview_queries.js";

const dbCredentials = new Database('credentials.db', { create: true })
const dbFlakio = new Database('flakio.db', { create: true })
const credentialsDb = initializeDatabase(new CredentialsDatabase(dbCredentials))
const jobsDb = initializeDatabase(new JobsDatabase(dbFlakio))
const testsDb = initializeDatabase(new TestsDatabase(dbFlakio))
const settingsDb = initializeDatabase(new SettingsDatabase(dbCredentials))
const overviewQueryDb = new OverviewQueryDatabase(dbFlakio)

const app = new Elysia()
    .decorate("credentialsDb", () => credentialsDb)
    .decorate("jobsDb", () => jobsDb)
    .decorate("testsDb", () => testsDb)
    .decorate("settingsDb", () => settingsDb)
    .decorate("overviewQueryDb", () => overviewQueryDb)
    .use(html())
    .use(staticPlugin({
      assets : "./dist"
    }))

    // React routes
    .get('/', () => Bun.file('./dist/home.html'))
    .get('/settings', () => Bun.file('./dist/home.html'))
    .get('/download', () => Bun.file('./dist/home.html'))
    .get('/reports', () => Bun.file('./dist/home.html'))
    .get('/overview', () => Bun.file('./dist/home.html'))
    
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
    .get('/overview/number_of_test_per_job', getNumberOfTestPerJob)

    // Settings API routes
    .get('/api/settings', settingsIndex)
    .post('/api/settings', settingsCreate)
    .patch('/api/settings', settingsUpdate)
    .put('/api/settings/bulk-update', settingsBulkUpdate)
    
    .listen(3030)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
