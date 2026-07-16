// TODO : UI
// TODO : Function
'use client'

import Button from '@/src/components/atoms/Button'
import { SearchIcon } from '../atoms/Icons'
import { usePathname, useRouter } from 'next/navigation'

const TopNavBar = () => {
  const route = useRouter()
  const pathName = usePathname()

  const goToFeed = () => {
    route.push('/feed')
  }
  const goToExplore = () => {
    route.push('/reels')
  }

  const isFeedActive = pathName == '/feed'
  const isReelsActive = pathName == '/reels'

  return (
    <div className="h-10 w-full flex">
      <div className="flex flex-1 relative">
        <div
          className={`absolute bottom-0 bg-neutral-500 z-50 h-1 w-50 transition-all duration-500 ${isReelsActive ? 'left-6/12' : 'left-0'}`}
        ></div>

        <div className="flex-2">
          <Button
            onClick={goToFeed}
            variant="secondary"
            className={`bg-transparent ${isFeedActive ? 'text-blue-501 font-bold' : 'text-gray-500'}`}
          >
            Explore
          </Button>
        </div>
        <div className="flex-2">
          <Button
            onClick={goToExplore}
            variant="secondary"
            className={`bg-transparent ${isReelsActive ? 'text-blue-501 font-bold' : 'text-gray-500'}`}
          >
            Reels
          </Button>
        </div>
      </div>

      <div className="">
        <Button variant="secondary" className="h-full bg-transparent">
          <SearchIcon />
        </Button>
      </div>
    </div>
  )
}

export default TopNavBar
