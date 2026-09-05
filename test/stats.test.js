// Example test so you can see the runner: npm test
// This is Node's built-in test runner, nothing to install.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { eventsInRange } from '../src/stats.js';

test('eventsInRange filters by type', () => {
  const rows = eventsInRange('2026-06-01', '2026-06-10', ['upload']);
  assert.ok(rows.length > 0, 'expected some uploads in the first ten days of June');
  assert.ok(
    rows.every((event) => event.type === 'upload'),
    'every returned event should be an upload',
  );
});
