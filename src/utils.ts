export function generateFakeId() {
  return Math.round(Math.random() * -1000000).toString()
}

export function isFakeId(id: string) {
  return parseInt(id, 10) < 0
}
