import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { ProfileHeader } from '@/src/components/organisms/ProfileHeader'
import ExploreGrid from '@/src/components/templates/ExploreGrid'
import { Grid3x3 } from 'lucide-react'

type Props = PageProps<'/profile/[userId]'>

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params
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

  if (user && user.id === userId) {
    redirect('/profile')
  }

  const [{ data: profile }, { data: posts }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ])

  if (!profile) {
    notFound()
  }

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
        username={profile.username}
        bio={profile.bio}
        avatarUrl={profile.avatar_url}
        postsCount={feed.length}
        averageRating={averageRating}
        otherUserId={profile.id}
      />

      <div className="flex items-center justify-center gap-1 border-t border-[#dbdbdb] py-2 text-xs font-semibold text-neutral-500">
        <Grid3x3 size={14} />
        POSTS
      </div>

      {feed.length === 0 ? (
        <p className="text-center text-neutral-400 text-sm py-16">
          No posts yet.
        </p>
      ) : (
        <ExploreGrid feed={feed} />
      )}
    </div>
  )
}
