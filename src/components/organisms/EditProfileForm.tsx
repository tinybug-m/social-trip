'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Avatar from '@/src/components/atoms/Avatar'
import FormField from '@/src/components/molecules/FormField'
import Input from '@/src/components/atoms/Input'
import { updateProfile } from '@/src/services/user/updateProfile'

export function EditProfileForm({
  initialUsername,
  initialBio,
  initialAvatarUrl,
}: {
  initialUsername: string
  initialBio: string
  initialAvatarUrl: string | null
}) {
  const router = useRouter()
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setAvatarFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || pending) return

    setPending(true)
    setError(null)

    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarFile,
      })
      router.push('/profile')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update profile')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Avatar src={previewUrl} name={username} size={88} />
          <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer border-2 border-white">
            <Camera size={14} className="text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <label className="text-sm font-semibold text-blue-500 cursor-pointer">
          Change profile photo
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>
      </div>

      <FormField label="Username">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
        />
      </FormField>

      <FormField label="Bio">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={150}
          placeholder="Tell people about yourself..."
          className="w-full p-2.5 text-sm rounded-md border border-[#dbdbdb] bg-[#fafafa] focus:outline-none focus:ring-1 focus:ring-neutral-300 focus:border-neutral-400 placeholder-neutral-400"
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-all"
      >
        {pending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
