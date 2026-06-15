import { CreatePostData } from '@/src/components/organisms/CreatePostForm'
import { supabaseClient } from '@/src/lib/supabase/client'

export const createPost = async ({ file, caption, type }: CreatePostData) => {
  // ۱. گرفتن اطلاعات کاربر لاگین شده
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()
  if (userError || !user) {
    throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید!')
  }

  // ۲. آپلود فایل در استوریج سوپابیس
  if (!file) {
    return
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

  // ۳. گرفتن لینک عمومی فایل
  const {
    data: { publicUrl },
  } = supabaseClient.storage.from('posts').getPublicUrl(fileName)

  // ۴. ثبت اطلاعات در جدول posts
  const { error: insertError } = await supabaseClient.from('posts').insert([
    {
      user_id: user.id,
      username:
        user.user_metadata?.username ||
        user.email?.split('@')[0] ||
        'کاربر ناشناس',
      user_image: user.user_metadata?.avatar_url || null,
      media_url: publicUrl,
      caption: caption,
      type: type,
    },
  ])

  if (insertError) {
    console.log(insertError)
    throw insertError
  }

  return true
}
