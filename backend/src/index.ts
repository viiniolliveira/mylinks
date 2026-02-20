import { Hono } from 'hono'
import { logger } from 'hono/logger'
import authRouter from './routes/auth'
import linksRouter from './routes/links'
import foldersRouter from './controllers/folders'

const app = new Hono().basePath('/api')

app.use(logger())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRouter)
app.route('/links', linksRouter)
app.route('/folders', foldersRouter)


export default {
  port: 8000,
  fetch: app.fetch,
}
