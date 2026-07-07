import { CreatePostData } from '@/src/components/organisms/CreatePostForm'
import { supabaseClient } from '@/src/lib/supabase/client'

export const createPost = async ({ file, caption, type }: CreatePostData) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) {
    throw new Error(userError.message)
  }
  if (!user) {
    throw new Error('Login required') // Todo : we shouldn't redirect to login then ? maybe in higher level
  }
  if (!file) {
    throw new Error('File is required')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabaseClient.storage
    .from('posts')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.log(uploadError)
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from('posts').getPublicUrl(fileName)

  const { data: insertData, error: insertError } = await supabaseClient
    .from('posts')
    .insert([
      {
        user_id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        user_image: user.user_metadata?.avatar_url || null,
        media_url: publicUrl,
        caption: caption,
        type: type,
      },
    ])

  if (insertError) {
    await supabaseClient.storage.from('posts').remove([fileName])
    throw insertError
  }

  return insertData
}
