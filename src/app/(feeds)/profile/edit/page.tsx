import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EditProfileForm } from '@/src/components/organisms/EditProfileForm'

export default async function EditProfilePage() {
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

  const username =
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    ''

  return (
    <EditProfileForm
      initialUsername={username}
      initialBio={user.user_metadata?.bio ?? ''}
      initialAvatarUrl={user.user_metadata?.avatar_url ?? null}
    />
  )
}
