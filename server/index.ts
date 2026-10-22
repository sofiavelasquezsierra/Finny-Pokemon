import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import app from './app'

// Bundled to dist-server/index.js, so the client build sits at ../dist
const distDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../dist'
)
const port = Number(process.env.PORT) || 3000

const server = express()

server.use(app)
server.use(express.static(distDir))

server.listen(port, () => {
  // Startup log for the hosting platform's console
  // eslint-disable-next-line no-console
  console.log(`Pokemon Explorer running at http://localhost:${port}`)
})
