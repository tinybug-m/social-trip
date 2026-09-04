import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'
import { formatRelativeTime } from '@/src/lib/utils/formatRelativeTime'
import { getMapUrl } from '@/src/lib/utils/mapLink'
import { linkifyCaption } from '@/src/lib/utils/linkifyCaption'
import Avatar from '@/src/components/atoms/Avatar'
import { RatingSummary } from '@/src/components/molecules/RatingSummary'
import { LeafletMap } from '@/src/components/molecules/LeafletMap'
import { ShareButton } from '@/src/components/atoms/ShareButton'
import { SaveButton } from '@/src/components/atoms/SaveButton'
import { CommentsSection } from '@/src/components/organisms/CommentsSection'

type Props = PageProps<'/post/[id]'>

const page = async ({ params }: Props) => {
  const cookieStore = await cookies()
  const supabase = createClientServer({
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })
  const { id } = await params
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) {
    return (
      <div className="flex flex-col min-h-dvh bg-white items-center justify-center text-neutral-500">
        Post not found
      </div>
    )
  }

  const [{ data: comments }, { data: userData }] = await Promise.all([
    supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true }),
    supabase.auth.getUser(),
  ])

  let myRating = 0
  let likedCommentIds: string[] = []
  if (userData.user) {
    const commentIds = (comments ?? []).map((c) => c.id)

    const [{ data: ratingRow }, { data: likedRows }] = await Promise.all([
      supabase
        .from('ratings')
        .select('rating')
        .eq('post_id', id)
        .eq('user_id', userData.user.id)
        .maybeSingle(),
      commentIds.length > 0
        ? supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', userData.user.id)
            .in('comment_id', commentIds)
        : Promise.resolve({ data: [] as { comment_id: string }[] }),
    ])

    myRating = ratingRow?.rating ?? 0
    likedCommentIds = (likedRows ?? []).map((row) => row.comment_id)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center px-3 gap-4">
        <Link href="/feed" className="text-black">
          <ChevronLeft size={26} />
        </Link>
        <Link
          href={`/profile/${data.user_id}`}
          className="flex items-center gap-2"
        >
          <Avatar src={data.user_image} name={data.username} size={28} />
          <span className="font-semibold text-sm">{data.username}</span>
        </Link>
      </div>

      <div className="bg-black">
        {data.type === 'reel' ? (
          <video
            className="w-full max-h-[70dvh] object-contain mx-auto"
            src={data.media_url}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="w-full max-h-[70dvh] object-contain mx-auto"
            src={data.media_url}
            alt={data.caption ?? 'post'}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-3 pt-2">
        <RatingSummary
          postId={data.id}
          initialMyRating={myRating}
          initialAverage={data.average_rating ?? 0}
          initialCount={data.ratings_count ?? 0}
        />
        <div className="flex items-center gap-4">
          <ShareButton postId={data.id} />
          <SaveButton />
        </div>
      </div>

      <div className="px-3 pt-2 space-y-1 pb-2 border-b border-[#dbdbdb]">
        {data.location &&
          (data.location_lat && data.location_lng ? (
            <a
              href={getMapUrl(data.location_lat, data.location_lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <MapPin size={13} />
              {data.location}
            </a>
          ) : (
            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin size={13} />
              {data.location}
            </p>
          ))}

        {data.caption && (
          <p className="text-sm">
            <span className="font-semibold mr-1">{data.username}</span>
            {linkifyCaption(data.caption)}
          </p>
        )}

        <p className="text-[11px] text-neutral-400 uppercase pt-0.5">
          {formatRelativeTime(data.created_at)}
        </p>
      </div>

      {data.location_lat && data.location_lng && (
        <LeafletMap
          lat={data.location_lat}
          lng={data.location_lng}
          height={180}
          className="border-b border-[#dbdbdb]"
        />
      )}

      <CommentsSection
        postId={data.id}
        initialComments={comments ?? []}
        currentUserId={userData.user?.id ?? null}
        initialLikedCommentIds={likedCommentIds}
      />
    </div>
  )
}

export default page
