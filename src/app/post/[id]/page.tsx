// import { Database } from '@/src/lib/types/database'
// import { createClient } from '@supabase/supabase-js'

import { createClientServer } from '@/src/lib/supabase/server'
import { cookies } from 'next/headers'

// const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// )

type Props = PageProps<'/post/[id]'>

const page = async ({ params }: Props) => {
  const cookieStore = await cookies()
  const supabase = createClientServer({
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })
  const { id } = await params
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!data) {
    return
  }
  return (
    <>
      <video
        className="max-h-dvh"
        src={data.media_url}
        autoPlay
        muted
        playsInline
      ></video>
      <h1>{data.caption}</h1>
      <h1 className="text-6xl text-white">{id}</h1>
    </>
  )
}

export default page
