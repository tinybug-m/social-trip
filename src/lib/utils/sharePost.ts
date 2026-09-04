export async function sharePost(postId: string) {
  const url = `${window.location.origin}/post/${postId}`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Check out this place on Mehrvila', url })
    } catch {
      // user cancelled the share sheet, nothing to do
    }
  } else {
    await navigator.clipboard.writeText(url)
    alert('Link copied')
  }
}
