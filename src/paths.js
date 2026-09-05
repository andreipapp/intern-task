// The CDN log line carries the game path. Which form it's in depends on the edge
// node that served the request, so "Asphalt 9" sometimes shows up as
// "Asphalt%209". Everything downstream compares this against game.pathName from
// the database.
export function canonicalPath(raw) {
  if (raw == null) {
    return '';
  }
  return String(raw).trim();
}
