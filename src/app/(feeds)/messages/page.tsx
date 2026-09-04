import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/src/components/atoms/Avatar'
import { NewMessageSearch } from '@/src/components/organisms/NewMessageSearch'
import { formatRelativeTime } from '@/src/lib/utils/formatRelativeTime'
import { Message, Profile } from '@/src/lib/types/entities'

export default async function MessagesInboxPage() {
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

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const lastMessageByPartner = new Map<string, Message>()
  for (const message of messages ?? []) {
    const partnerId =
      message.sender_id === user.id ? message.receiver_id : message.sender_id
    if (!lastMessageByPartner.has(partnerId)) {
      lastMessageByPartner.set(partnerId, message)
    }
  }

  const partnerIds = [...lastMessageByPartner.keys()]

  const { data: profiles } =
    partnerIds.length > 0
      ? await supabase.from('profiles').select('*').in('id', partnerIds)
      : { data: [] as Profile[] }

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))

  const conversations = partnerIds
    .map((id) => ({
      profile: profileById.get(id),
      lastMessage: lastMessageByPartner.get(id)!,
    }))
    .filter((c): c is { profile: Profile; lastMessage: Message } =>
      Boolean(c.profile),
    )

  return (
    <div>
      <NewMessageSearch />

      {conversations.length === 0 ? (
        <p className="text-center text-sm text-neutral-400 py-16 px-8">
          No conversations yet. Search for someone above to say hello.
        </p>
      ) : (
        <div className="divide-y divide-[#f0f0f0]">
          {conversations.map(({ profile, lastMessage }) => (
            <Link
              key={profile.id}
              href={`/messages/${profile.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50"
            >
              <Avatar
                src={profile.avatar_url}
                name={profile.username}
                size={48}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{profile.username}</p>
                <p className="text-sm text-neutral-500 truncate">
                  {lastMessage.sender_id === user.id ? 'You: ' : ''}
                  {lastMessage.content}
                </p>
              </div>
              <span className="text-[11px] text-neutral-400 uppercase shrink-0">
                {formatRelativeTime(lastMessage.created_at)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
