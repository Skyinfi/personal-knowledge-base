export function excerpt(body: string): string | null {
  if (body.length === 0) return null
  const first = body.split(/\r?\n/, 1)[0]
  if (first.length === 0) return null
  const characters = Array.from(first)
  if (characters.length <= 80) return first
  return characters.slice(0, 80).join('')
}
