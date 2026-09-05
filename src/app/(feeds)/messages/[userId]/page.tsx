import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import Avatar from '@/src/components/atoms/Avatar'
import { ChatThread } from '@/src/components/organisms/ChatThread'

type Props = PageProps<'/messages/[userId]'>

export default async function ChatThreadPage({ params }: Props) {
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

  if (!user) redirect('/login')
  if (user.id === userId) redirect('/profile')

  const [{ data: otherProfile }, { data: messages }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`,
      )
      .order('created_at', { ascending: true }),
  ])

  if (!otherProfile) notFound()

  after(() =>
    supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('sender_id', userId)
      .eq('receiver_id', user.id)
      .is('read_at', null),
  )

  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] h-12 flex items-center px-3 gap-3 shrink-0">
        <Link href="/messages" className="text-black">
          <ChevronLeft size={26} />
        </Link>
        <Link
          href={`/profile/${otherProfile.id}`}
          className="flex items-center gap-2"
        >
          <Avatar
            src={otherProfile.avatar_url}
            name={otherProfile.username}
            size={30}
          />
          <span className="font-semibold text-sm">{otherProfile.username}</span>
        </Link>
      </div>

      <ChatThread
        currentUserId={user.id}
        otherUserId={userId}
        initialMessages={messages ?? []}
      />
    </>
  )
}
