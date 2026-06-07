import { createServerClient } from '@supabase/ssr'
import { Database } from '../types/database'

type SupabaseOptions = Parameters<typeof createServerClient>[2]

export const createClientServer = (props: SupabaseOptions) =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    props,
  )
