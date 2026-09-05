export function uploadFileWithProgress(
  bucket: string,
  path: string,
  file: File,
  accessToken: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('cacheControl', '3600')
    formData.append('', file)

    const xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
    )
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    xhr.setRequestHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    xhr.setRequestHeader('x-upsert', 'false')

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        resolve()
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))

    xhr.send(formData)
  })
}
