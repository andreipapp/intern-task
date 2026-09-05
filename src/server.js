import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { games, builds } from './data.js'
import { downloadsByDay, downloadsByGame } from './stats.js'
import { isValidEvent, describeEvent } from './validation.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT || 3000

const json = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body, null, 2))
}

const readBody = req =>
  new Promise(resolve => {
    let raw = ''
    req.on('data', chunk => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        resolve(null)
      }
    })
  })

const server = createServer(async (req, res) => {
  try {
    await handle(req, res)
  } catch (error) {
    console.error(error)
    if (!res.headersSent) {
      json(res, 500, { error: 'Internal server error' })
    }
  }
})

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(readFileSync(join(root, 'public/index.html')))
    return
  }

  if (url.pathname === '/api/games') {
    return json(res, 200, games)
  }

  if (url.pathname === '/api/builds') {
    return json(res, 200, builds)
  }

  // downloads per game, e.g. ?from=2026-06-01&to=2026-06-30
  if (url.pathname === '/api/stats/downloads') {
    const from = url.searchParams.get('from') || '2026-06-01'
    const to = url.searchParams.get('to') || '2026-07-31'
    const by = url.searchParams.get('by') || null
    const started = Date.now()
    let rows
    if (by !== 'day') {
      rows = downloadsByGame(from, to)
    } else {
      rows = downloadsByDay(from, to)
    }
    return json(res, 200, {
      from,
      to,
      tookMs: Date.now() - started,
      total: rows.reduce((sum, row) => sum + row.downloads, 0),
      rows,
    })
  }

  // where the frontend posts events: { type, buildId, createdAt }
  if (url.pathname === '/api/events' && req.method === 'POST') {
    const body = await readBody(req)
    if (!isValidEvent(body)) {
      return json(res, 400, { error: 'Invalid event' })
    }
    return json(res, 201, describeEvent(body))
  }

  json(res, 404, { error: 'Not found' })
}

server.listen(PORT, () => {
  console.log(`BuildHub listening on http://localhost:${PORT}`)
})
