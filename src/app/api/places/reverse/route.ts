import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat')
  const lng = request.nextUrl.searchParams.get('lng')

  if (!lat || !lng) {
    return NextResponse.json({ name: '' }, { status: 400 })
  }

  const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mehrvila/1.0 (tourism social app; reverse geocoding)',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ name: `${lat}, ${lng}` })
  }

  const data: { display_name?: string } = await res.json()

  return NextResponse.json({ name: data.display_name ?? `${lat}, ${lng}` })
}
