'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { supabaseClient } from '@/src/lib/supabase/client'
import { Profile } from '@/src/lib/types/entities'
import Avatar from '@/src/components/atoms/Avatar'

export function NewMessageSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    debounceRef.current = setTimeout(
      async () => {
        const trimmed = query.trim()
        if (!trimmed) {
          setResults([])
          return
        }

        setSearching(true)
        const {
          data: { user },
        } = await supabaseClient.auth.getUser()

        const { data } = await supabaseClient
          .from('profiles')
          .select('*')
          .ilike('username', `%${trimmed}%`)
          .neq('id', user?.id ?? '')
          .limit(10)

        setResults(data ?? [])
        setSearching(false)
      },
      query.trim() ? 400 : 0,
    )

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return (
    <div className="border-b border-[#dbdbdb]">
      <div className="p-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#efefef]">
          <Search size={16} className="text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people to message..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-neutral-400"
          />
        </div>
      </div>

      {query.trim() && (
        <div className="pb-2">
          {searching && (
            <p className="text-center text-sm text-neutral-400 py-3">
              Searching...
            </p>
          )}
          {!searching && results.length === 0 && (
            <p className="text-center text-sm text-neutral-400 py-3">
              No users found for &quot;{query.trim()}&quot;
            </p>
          )}
          {results.map((profile) => (
            <Link
              key={profile.id}
              href={`/messages/${profile.id}`}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-neutral-50"
            >
              <Avatar
                src={profile.avatar_url}
                name={profile.username}
                size={36}
              />
              <span className="text-sm font-medium">{profile.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
