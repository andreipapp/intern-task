// Builds data/events.json. Seeded on purpose so everyone gets identical numbers.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const games = JSON.parse(readFileSync(join(root, 'data/games.json'), 'utf8'))
const builds = JSON.parse(readFileSync(join(root, 'data/builds.json'), 'utf8'))

// small seeded PRNG, keeps the dataset reproducible
let seed = 20260810
const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
const pick = arr => arr[Math.floor(rand() * arr.length)]

const TYPES = ['download', 'download', 'download', 'upload', 'metadata', 'qr_code', 'share_link']
const START = Date.parse('2026-06-01T00:00:00Z')
const END = Date.parse('2026-08-01T00:00:00Z')

// The CDN writes the game path into the log. Some edge nodes percent-encode it
// and some don't, so both forms turn up in production.
const encodeSometimes = pathName => (rand() < 0.35 ? encodeURIComponent(pathName) : pathName)

const events = []
for (let i = 0; i < 40000; i++) {
  const build = pick(builds)
  const game = games.find(g => g.id === build.gameId)
  events.push({
    id: `evt_${String(i).padStart(6, '0')}`,
    type: pick(TYPES),
    createdAt: new Date(START + rand() * (END - START)).toISOString(),
    buildId: build.id,
    path: encodeSometimes(game.pathName),
    userId: 1 + Math.floor(rand() * 40),
  })
}
events.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

mkdirSync(join(root, 'data'), { recursive: true })
writeFileSync(join(root, 'data/events.json'), JSON.stringify(events, null, 2))
console.log(`wrote data/events.json - ${events.length} events across ${games.length} games`)
