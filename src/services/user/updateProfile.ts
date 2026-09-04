import { supabaseClient } from '@/src/lib/supabase/client'

export type UpdateProfileData = {
  username: string
  bio: string
  avatarFile: File | null
}

export const updateProfile = async ({
  username,
  bio,
  avatarFile,
}: UpdateProfileData) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error('Login required')

  let avatarUrl = user.user_metadata?.avatar_url ?? null

  if (avatarFile) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabaseClient.storage
      .from('posts')
      .upload(fileName, avatarFile, { cacheControl: '3600', upsert: false })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabaseClient.storage.from('posts').getPublicUrl(fileName)

    avatarUrl = publicUrl
  }

  const { data, error } = await supabaseClient.auth.updateUser({
    data: {
      username,
      bio,
      avatar_url: avatarUrl,
    },
  })

  if (error) throw error

  const { error: profileError } = await supabaseClient.from('profiles').upsert({
    id: user.id,
    username,
    bio,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  })

  if (profileError) throw profileError

  return data.user
}
