export const EVENT_TYPES = {
  download: { label: 'Download build' },
  upload: { label: 'File upload' },
  metadata: { label: 'Get metadata' },
  qr_code: { label: 'Generate QR code' },
  share_link: { label: 'Generate share link' },
}

// An incoming event needs a known type, a numeric buildId and a timestamp.
export function isValidEvent(event) {
  if (!event) {
    return false
  }
  return (
    Object.keys(EVENT_TYPES).includes(event.type) &&
    typeof event.buildId === 'number' &&
    typeof event.createdAt === 'string'
  )
}

// Label we hand back to the client so it doesn't have to know our type codes.
export function describeEvent(event) {
  return {
    ...event,
    typeLabel: EVENT_TYPES[event.type].label,
  }
}
