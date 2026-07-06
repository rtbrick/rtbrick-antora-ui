'use strict'

function parseVersion (value) {
  if (typeof value !== 'string') return null

  const raw = value.trim()
  if (!raw) return null
  if (raw.toLowerCase() === 'latest') {
    return { isLatest: true, parts: [Infinity, Infinity, Infinity, Infinity] }
  }

  const parts = raw.split('.').map((part) => Number.parseInt(part, 10))
  if (parts.some(Number.isNaN)) return null

  while (parts.length < 4) parts.push(-1)
  return { isLatest: false, parts: parts.slice(0, 4) }
}

module.exports = (versions) => {
  if (!Array.isArray(versions)) return versions

  const unique = []
  const seen = new Set()

  for (const entry of versions) {
    const key = String(entry?.version ?? '')
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(entry)
  }

  return unique.sort((a, b) => {
    const aVersion = parseVersion(String(a?.version ?? ''))
    const bVersion = parseVersion(String(b?.version ?? ''))

    if (!aVersion && !bVersion) return String(b?.version ?? '').localeCompare(String(a?.version ?? ''))
    if (!aVersion) return 1
    if (!bVersion) return -1

    if (aVersion.isLatest !== bVersion.isLatest) return aVersion.isLatest ? -1 : 1

    for (let i = 0; i < 4; i++) {
      if (aVersion.parts[i] !== bVersion.parts[i]) return bVersion.parts[i] - aVersion.parts[i]
    }

    return 0
  })
}
