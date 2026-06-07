import { createBrowserClient } from '@supabase/ssr'

//Supabase for clients (Client Side App)
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
