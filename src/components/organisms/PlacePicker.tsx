'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Search, MapPin } from 'lucide-react'
import { LeafletMap } from '@/src/components/molecules/LeafletMap'
import Button from '@/src/components/atoms/Button'
import {
  searchPlaces,
  reverseGeocode,
  PlaceResult,
} from '@/src/services/places/searchPlaces'

const DEFAULT_CENTER = { lat: 20, lng: 0 }

export function PlacePicker({
  onSelect,
  onClose,
}: {
  onSelect: (place: PlaceResult) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<PlaceResult | null>(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { timeout: 4000 },
    )
  }, [])

  useEffect(() => {
    debounceRef.current = setTimeout(
      async () => {
        if (!query.trim()) {
          setResults([])
          return
        }

        setSearching(true)
        const found = await searchPlaces(query)
        setResults(found)
        setSearching(false)
      },
      query.trim() ? 500 : 0,
    )

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const pickResult = (place: PlaceResult) => {
    setSelected(place)
    setCenter({ lat: place.lat, lng: place.lng })
    setResults([])
    setQuery('')
  }

  const pickFromMap = async (lat: number, lng: number) => {
    setSelected({ name: 'Locating...', lat, lng })
    const name = await reverseGeocode(lat, lng)
    setSelected({ name, lat, lng })
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" dir="ltr">
      <div className="h-12 flex items-center px-3 gap-3 border-b border-[#dbdbdb] shrink-0">
        <button onClick={onClose} className="text-black" aria-label="Close">
          <ChevronLeft size={26} />
        </button>
        <span className="font-semibold text-base">Add location</span>
      </div>

      <div className="p-3 border-b border-[#dbdbdb] shrink-0">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#efefef]">
          <Search size={16} className="text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a place..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-neutral-400"
            autoFocus
          />
        </div>
      </div>

      {query.trim() ? (
        <div className="flex-1 overflow-y-auto">
          {searching && (
            <p className="text-center text-sm text-neutral-400 py-4">
              Searching...
            </p>
          )}
          {!searching && results.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-4">
              No places found for &quot;{query.trim()}&quot;
            </p>
          )}
          {results.map((place, i) => (
            <button
              key={`${place.lat}-${place.lng}-${i}`}
              onClick={() => pickResult(place)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left border-b border-[#f0f0f0] hover:bg-neutral-50"
            >
              <MapPin size={18} className="text-neutral-400 mt-0.5 shrink-0" />
              <span className="text-sm">{place.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 relative">
          <LeafletMap
            lat={selected?.lat ?? center.lat}
            lng={selected?.lng ?? center.lng}
            zoom={selected ? 15 : 3}
            height="100%"
            interactive
            onSelect={pickFromMap}
          />
          {!selected && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
              Search above or tap the map to drop a pin
            </div>
          )}
        </div>
      )}

      <div className="p-3 border-t border-[#dbdbdb] shrink-0">
        {selected && (
          <p className="flex items-start gap-1.5 text-sm mb-2">
            <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{selected.name}</span>
          </p>
        )}
        <Button
          type="button"
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
        >
          Use this location
        </Button>
      </div>
    </div>
  )
}
