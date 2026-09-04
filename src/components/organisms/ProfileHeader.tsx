'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, MessageCircle } from 'lucide-react'
import Avatar from '@/src/components/atoms/Avatar'
import { supabaseClient } from '@/src/lib/supabase/client'

export function ProfileHeader({
  username,
  bio,
  avatarUrl,
  postsCount,
  averageRating,
  otherUserId,
}: {
  username: string
  bio: string | null
  avatarUrl: string | null
  postsCount: number
  averageRating: number
  otherUserId?: string
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between">
        <Avatar src={avatarUrl} name={username} size={72} ring />

        <div className="flex-1 flex justify-around text-center ml-4">
          <div>
            <p className="text-base font-semibold">{postsCount}</p>
            <p className="text-xs text-neutral-500">posts</p>
          </div>
          <div>
            <p className="text-base font-semibold">
              {averageRating > 0 ? averageRating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-neutral-500">avg rating</p>
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold mt-3">{username}</p>
      {bio && <p className="text-sm mt-0.5 whitespace-pre-line">{bio}</p>}

      <div className="flex items-center gap-2 mt-3">
        {otherUserId ? (
          <Link
            href={`/messages/${otherUserId}`}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} />
            Message
          </Link>
        ) : (
          <>
            <Link
              href="/profile/edit"
              className="flex-1 text-center py-1.5 rounded-lg bg-neutral-100 text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              Edit profile
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
