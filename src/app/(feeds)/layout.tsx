import TopNavBar from '@/src/components/molecules/TopNavBar'
import React from 'react'

type Props = {}

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopNavBar />
      {children}
    </div>
  )
}

export default FeedLayout
