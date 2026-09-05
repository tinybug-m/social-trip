import { supabaseClient } from '@/src/lib/supabase/client'
import { LoginFormData, RegisterFormData } from '@/src/schemas/authSchema'

export const signIn = async (data: LoginFormData) => {
  const { data: res, error } = await supabaseClient.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) throw error

  return res
}

export const signInWithGoogle = async () => {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
}

export const signUp = async (data: RegisterFormData) => {
  const { data: res, error } = await supabaseClient.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.name },
    },
  })

  if (error) throw error

  if (res.user) {
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: res.user.id,
        username: data.name,
        updated_at: new Date().toISOString(),
      })

    if (profileError)
      console.error('Failed to create profile:', profileError.message)
  }

  return res
}
