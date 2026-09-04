import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

// Nominatim doesn't send CORS headers, so it can't be called directly
// from the browser - this route proxies the request server-side, where
// CORS doesn't apply, and identifies the app with a proper User-Agent
// as Nominatim's usage policy asks for.
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json([])
  }

  const url = `${NOMINATIM_BASE}/search?format=jsonv2&addressdetails=0&limit=8&q=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mehrvila/1.0 (tourism social app; place search)',
    },
  })

  if (!res.ok) {
    return NextResponse.json([])
  }

  const data: { display_name: string; lat: string; lon: string }[] =
    await res.json()

  return NextResponse.json(
    data.map((item) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    })),
  )
}
