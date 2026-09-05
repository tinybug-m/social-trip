'use client'

import BottomNavigation from '@/src/components/molecules/BottomNavigation'
import TopNavBar from '@/src/components/molecules/TopNavBar'
import { EnableNotificationsBanner } from '@/src/components/molecules/EnableNotificationsBanner'
import { usePathname } from 'next/navigation'
import React from 'react'

const NO_BOTTOM_NAV = ['/create-post', '/profile/edit', '/messages']

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isReels = pathname === '/reels'
  const isChatThread = pathname.startsWith('/messages/')
  const hideBottomNav = NO_BOTTOM_NAV.includes(pathname) || isChatThread

  if (isChatThread) {
    return <div className="flex flex-col h-dvh bg-white">{children}</div>
  }

  if (isReels) {
    return (
      <div className="relative h-dvh bg-black overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-40">
          <TopNavBar />
        </div>
        {children}
        <div className="absolute inset-x-0 bottom-0 z-40 bg-linear-to-t from-black/60 to-transparent">
          <BottomNavigation />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <TopNavBar />
      <EnableNotificationsBanner />
      <div className="flex-1 pb-2">{children}</div>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  )
}

export default FeedLayout
