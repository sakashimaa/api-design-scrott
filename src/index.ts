import { app } from './server.ts'
import { env } from '../env.ts'

app.listen(env.PORT, () => {
  console.log(`server running on http://localhost:${env.PORT}`)
})

process.on('uncaughtException', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
