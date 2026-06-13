// TODO : UI
// TODO : Function

import Button from '@/src/components/atoms/Button'
import Search from '@/src/assets/icons/search.svg'

const TopNavBar = () => {
  console.log({ Search })
  return (
    <div className="h-10 w-full flex">
      <div className="flex-1">
        <Button variant="secondary">Eplore</Button>
      </div>
      <div className="flex-1">
        <Button variant="secondary">Eplore</Button>
      </div>
      <div className="">
        <Search />
      </div>
    </div>
  )
}

export default TopNavBar
