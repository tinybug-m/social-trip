'use client'

import { ReelItem } from '../molecules/ReelItem'
import { Heart, MessageCircle } from 'lucide-react'
import { Tables } from '@/src/lib/types/database'
import { useRouter } from 'next/navigation'

type ExploreProps = {
  feed: Tables<'posts'>[]
}

const ExploreGrid = (props: ExploreProps) => {
  const { feed } = props
  const router = useRouter()

  return (
    <main className="max-w-4xl mx-auto p-1 md:p-4">
      <div className="grid grid-cols-3 gap-1 md:gap-2 auto-rows-[120px] sm:auto-rows-[200px] md:auto-rows-[250px]">
        {feed.map((item) => {
          const isReels = item?.type === 'reel'

          return (
            <div
              key={item?.id}
              className={`relative group overflow-hidden bg-zinc-900 border border-zinc-800/30 cursor-pointer 
                    ${isReels ? 'row-span-2' : ''}`}
              onClick={() => router.push('post/' + item?.id)}
            >
              {!isReels && (
                <img
                  src={item?.media_url}
                  alt={item?.caption || 'Explore media'}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-80"
                  loading="lazy"
                />
              )}

              {isReels && (
                <>
                  <ReelItem post={item} />
                  <div className="absolute top-2 right-2 bg-black/60 text-zinc-200 text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-md border border-zinc-800">
                    Reels
                  </div>
                </>
              )}

              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 space-x-reverse text-white font-semibold text-sm">
                <div className="flex items-center space-x-1 space-x-reverse hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>۰</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>۰</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default ExploreGrid
