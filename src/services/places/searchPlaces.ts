export type PlaceResult = {
  name: string
  lat: number
  lng: number
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  if (!query.trim()) return []

  const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`)

  if (!res.ok) return []

  return res.json()
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string> {
  const res = await fetch(`/api/places/reverse?lat=${lat}&lng=${lng}`)

  if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`

  const data: { name: string } = await res.json()

  return data.name
}
