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

export const signUp = async (data: RegisterFormData) => {
  const { data: res, error } = await supabaseClient.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.name },
    },
  })

  if (error) throw error

  return res
}
