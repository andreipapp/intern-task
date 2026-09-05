// Example test so you can see the runner: npm test
// This is Node's built-in test runner, nothing to install.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { eventsInRange } from '../src/stats.js'
import { isValidEvent } from '../src/validation.js'

test('eventsInRange filters by type', () => {
  const rows = eventsInRange('2026-06-01', '2026-06-10', ['upload'])
  assert.ok(rows.length > 0, 'expected some uploads in the first ten days of June')
  assert.ok(
    rows.every(event => event.type === 'upload'),
    'every returned event should be an upload',
  )
})
test('invalid events should be refused with a 400', () => {
  const payload = { type: 'downlaod', buildId: 900001, createdAt: '2026-06-15T10:00:00Z' }
  assert.equal(isValidEvent(payload), false, 'an invalid event should be refused')
})
test('date range should be inclusive not exclusive', () => {
  const rows = eventsInRange('2026-06-15', '2026-06-15', ['download'])
  assert.ok(rows.length > 0, 'expected some downloads on the 15th of June')
})
