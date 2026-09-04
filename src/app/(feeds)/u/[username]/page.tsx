import { supabaseClient } from '@/src/lib/supabase/client'
import { redirect, notFound } from 'next/navigation'

type Props = PageProps<'/u/[username]'>

export default async function ResolveUsernamePage({ params }: Props) {
  const { username } = await params

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('id')
    .eq('username', decodeURIComponent(username))
    .maybeSingle()

  if (!profile) {
    notFound()
  }

  redirect(`/profile/${profile.id}`)
}
