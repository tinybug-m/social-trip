'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clapperboard, CircleUserRound } from 'lucide-react'
import { HomeIcon, ExploreIcon, AddIcon } from '@/src/components/atoms/Icons'

const NAV_ITEMS = [
  { href: '/feed', icon: HomeIcon },
  { href: '/explore', icon: ExploreIcon },
  { href: '/create-post', icon: AddIcon },
  { href: '/reels', icon: Clapperboard },
  { href: '/profile', icon: CircleUserRound },
] as const

const BottomNavigation = () => {
  const pathname = usePathname()
  const isReels = pathname === '/reels'

  return (
    <div
      className={`sticky bottom-0 z-40 w-full ${
        isReels ? 'bg-transparent' : 'bg-white border-t border-[#dbdbdb]'
      }`}
    >
      <div className="flex items-center justify-between h-13 px-4 py-2.5">
        {NAV_ITEMS.map(({ href, icon: Icon }) => {
          const isActive = pathname === href
          const activeColor = isReels ? 'text-white' : 'text-black'
          const inactiveColor = isReels
            ? 'text-neutral-300'
            : 'text-neutral-500'

          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex items-center justify-center py-1"
            >
              <Icon
                size={26}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={isActive ? activeColor : inactiveColor}
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
