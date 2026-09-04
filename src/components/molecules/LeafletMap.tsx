'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMapInstance, Marker } from 'leaflet'

const PIN_ICON_SVG = `
<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="#3b82f6"/>
  <circle cx="15" cy="15" r="6" fill="white"/>
</svg>
`

interface LeafletMapProps {
  lat: number
  lng: number
  zoom?: number
  height?: number | string
  interactive?: boolean
  onSelect?: (lat: number, lng: number) => void
  className?: string
}

export function LeafletMap({
  lat,
  lng,
  zoom = 14,
  height = 260,
  interactive = false,
  onSelect,
  className,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMapInstance | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current) return

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: interactive,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: PIN_ICON_SVG,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      })

      const marker = L.marker([lat, lng], {
        icon,
        draggable: interactive,
      }).addTo(map)

      if (interactive) {
        map.on('click', (e) => {
          marker.setLatLng(e.latlng)
          onSelect?.(e.latlng.lat, e.latlng.lng)
        })
        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onSelect?.(pos.lat, pos.lng)
        })
      }

      mapRef.current = map
      markerRef.current = marker
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map is created once, position updates flow through the effect below
  }, [])

  useEffect(() => {
    mapRef.current?.setView([lat, lng], zoom)
    markerRef.current?.setLatLng([lat, lng])
  }, [lat, lng, zoom])

  return <div ref={containerRef} style={{ height }} className={className} />
}
