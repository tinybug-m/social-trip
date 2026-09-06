import { supabaseClient } from '@/src/lib/supabase/client'

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (error) throw new Error(error.message)
  if (!user) throw new Error('Login required')

  return user
}
