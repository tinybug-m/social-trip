import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileHeader } from '@/src/components/organisms/ProfileHeader'
import ExploreGrid from '@/src/components/templates/ExploreGrid'
import { Grid3x3 } from 'lucide-react'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createClientServer({
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const username =
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'you'

  const feed = posts ?? []
  const totalRatingSum = feed.reduce(
    (sum, post) => sum + (post.average_rating ?? 0) * (post.ratings_count ?? 0),
    0,
  )
  const totalRatingCount = feed.reduce(
    (sum, post) => sum + (post.ratings_count ?? 0),
    0,
  )
  const averageRating =
    totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0

  return (
    <div className="min-h-dvh bg-white">
      <ProfileHeader
        username={username}
        bio={user.user_metadata?.bio ?? null}
        avatarUrl={user.user_metadata?.avatar_url ?? null}
        postsCount={feed.length}
        averageRating={averageRating}
      />

      <div className="flex items-center justify-center gap-1 border-t border-[#dbdbdb] py-2 text-xs font-semibold text-neutral-500">
        <Grid3x3 size={14} />
        POSTS
      </div>

      {feed.length === 0 ? (
        <p className="text-center text-neutral-400 text-sm py-16">
          You haven&apos;t posted anything yet.
        </p>
      ) : (
        <ExploreGrid feed={feed} />
      )}
    </div>
  )
}
