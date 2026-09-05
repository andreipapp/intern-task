import { games, events } from './data.js';
import { canonicalPath } from './paths.js';

// Events in the given range, optionally narrowed to certain types.
// from/to are plain dates like "2026-06-01". Both ends count, so a report for
// June has to include whatever happened on the 30th.
export function eventsInRange(from, to, types) {
  const start = new Date(from);
  const end = new Date(to);
  return events.filter((event) => {
    const at = new Date(event.createdAt);
    if (at < start || at > end) {
      return false;
    }
    return types.length === 0 || types.includes(event.type);
  });
}

// Download counts per game for the range.
export function downloadsByGame(from, to) {
  const byGame = {};

  for (const game of games) {
    const rows = eventsInRange(from, to, ['download']);
    const mine = rows.filter((event) => canonicalPath(event.path) === game.pathName);
    byGame[game.name] = { game: game.name, downloads: mine.length };
  }

  // whatever was left over, i.e. paths that matched no game at all
  const all = eventsInRange(from, to, ['download']);
  const matched = Object.values(byGame).reduce((sum, row) => sum + row.downloads, 0);
  if (all.length > matched) {
    byGame.unknown = { game: 'unknown', downloads: all.length - matched };
  }

  return Object.values(byGame).sort((a, b) => b.downloads - a.downloads);
}

// A handful of older games still have their download counts kept in a separate
// legacy counter, so we have two sources to combine. The result per game is
// supposed to be both of them added together.
export function mergeDownloadSources(fromEvents, fromLegacy) {
  const merged = {};
  for (const row of fromEvents) {
    merged[row.game] = { game: row.game, downloads: row.downloads };
  }
  for (const row of fromLegacy) {
    merged[row.game] = { game: row.game, downloads: row.downloads };
  }
  return Object.values(merged);
}
