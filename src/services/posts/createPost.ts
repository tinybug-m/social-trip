import { CreatePostData } from '@/src/components/organisms/CreatePostForm'
import { supabaseClient } from '@/src/lib/supabase/client'
import { uploadFileWithProgress } from '@/src/lib/utils/uploadFileWithProgress'
import { getCurrentUser } from '@/src/services/user/getCurrentUser'

export const createPost = async (
  { file, caption, location, locationLat, locationLng }: CreatePostData,
  onProgress?: (percent: number) => void,
) => {
  const user = await getCurrentUser()

  if (!file) {
    throw new Error('File is required')
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) {
    throw new Error('Login required')
  }

  const type = file.type.startsWith('video/') ? 'reel' : 'post'
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  await uploadFileWithProgress(
    'posts',
    fileName,
    file,
    session.access_token,
    onProgress ?? (() => {}),
  )

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
        location: location || null,
        location_lat: locationLat,
        location_lng: locationLng,
        type: type,
      },
    ])

  if (insertError) {
    await supabaseClient.storage.from('posts').remove([fileName])
    throw insertError
  }

  return insertData
}
