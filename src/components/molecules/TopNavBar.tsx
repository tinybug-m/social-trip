'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, MessageCircle, ChevronLeft, Menu } from 'lucide-react'
import { SearchIcon } from '../atoms/Icons'
import { useUnreadMessagesCount } from '@/src/hooks/useUnreadMessagesCount'

const BACK_SCREENS: Record<string, { title: string; backHref: string }> = {
  '/create-post': { title: 'New post', backHref: '/feed' },
  '/profile/edit': { title: 'Edit profile', backHref: '/profile' },
  '/messages': { title: 'Messages', backHref: '/feed' },
}

const TopNavBar = () => {
  const pathname = usePathname()
  const unreadCount = useUnreadMessagesCount()

  if (pathname === '/reels') {
    return (
      <div className="sticky top-0 z-40 h-12 flex items-center justify-center text-white font-semibold text-base">
        Reels
      </div>
    )
  }

  if (pathname === '/explore') {
    return (
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] px-4 py-2">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#efefef] text-neutral-500">
          <SearchIcon size={16} />
          <span className="text-sm">Search</span>
        </div>
      </div>
    )
  }

  if (pathname === '/profile') {
    return (
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center justify-between px-4">
        <span className="font-semibold text-base">Profile</span>
        <Menu size={22} />
      </div>
    )
  }

  if (pathname.startsWith('/profile/') && pathname !== '/profile/edit') {
    return (
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center px-3 gap-3">
        <Link href="/feed" className="text-black">
          <ChevronLeft size={26} />
        </Link>
        <span className="font-semibold text-base">Profile</span>
      </div>
    )
  }

  const backScreen = BACK_SCREENS[pathname]
  if (backScreen) {
    return (
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center justify-center">
        <Link
          href={backScreen.backHref}
          className="absolute left-3 flex items-center text-black"
        >
          <ChevronLeft size={26} />
        </Link>
        <span className="font-semibold text-base">{backScreen.title}</span>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center justify-between px-4">
      <span
        className="text-2xl italic"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Mehrvila
      </span>

      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-black">
          <Heart size={24} strokeWidth={1.8} />
        </Link>
        <Link href="/messages" className="relative text-black">
          <MessageCircle size={24} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
          )}
        </Link>
      </div>
    </div>
  )
}

export default TopNavBar
