import BottomNavigation from '@/src/components/molecules/BottomNavigation'
import TopNavBar from '@/src/components/molecules/TopNavBar'
import React from 'react'

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <TopNavBar />
      {children}
      <BottomNavigation />
    </div>
  )
}

export default FeedLayout
