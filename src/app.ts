import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { Home } from './views/home.js'
import { staticPlugin } from '@elysiajs/static'

import { CredentialsDatabase } from './db/credentials.ts'
import { 
  credentialsIndex, 
  credentialsCreate, 
  credentialsDestroy, 
  credentialsUpdate } from './credentials_controller.ts'

import { GitLabService } from './gitlab_service.ts'

const app = new Elysia()
    .decorate("credentialsDb", () => new CredentialsDatabase())
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
    .get('/jobs', (ctx) => {
      const { projectId, apiUrl, privateToken, page } = ctx.query
      console.log('🦊 Fetching jobs for in: ', projectId, apiUrl, privateToken)
      const gitlabService = new GitLabService(projectId, apiUrl, privateToken)
      return gitlabService.getJobs(page);
    })
    .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
