// TODO : UI
// TODO : Function
'use client'

import Button from '@/src/components/atoms/Button'
import { Search } from '../atoms/Icons'
import { useRouter } from 'next/navigation'

const TopNavBar = () => {
  const route = useRouter()

  const goToFeed = () => {
    route.push('/feed')
  }
  const goToExplore = () => {
    route.push('/reels')
  }
  return (
    <div className="h-10 w-full flex">
      <div className="flex-1">
        <Button
          onClick={goToFeed}
          variant="secondary"
          className="bg-transparent"
        >
          Explore
        </Button>
      </div>
      <div className="flex-1">
        <Button
          onClick={goToExplore}
          variant="secondary"
          className="bg-transparent"
        >
          Reels
        </Button>
      </div>
      <div className="">
        <Button variant="secondary" className="h-full bg-transparent">
          <Search />
        </Button>
      </div>
    </div>
  )
}

export default TopNavBar
