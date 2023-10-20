import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { Home } from './home.tsx'
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
    .use(html())
    .use(staticPlugin({
      assets : "./dist"
    }))
    .get('/', () => (
        Home()
    ))
    .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
