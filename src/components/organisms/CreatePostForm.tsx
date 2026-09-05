'use client'

import { useState } from 'react'
import { MapPin, X, Image as ImageIcon, Clapperboard } from 'lucide-react'
import { createPost } from '@/src/services/posts/createPost'
import { Controller, useForm } from 'react-hook-form'
import File from '../atoms/File'
import { useHandleForm } from '@/src/hooks/useHandleForm'
import { PlacePicker } from './PlacePicker'
import { PlaceResult } from '@/src/services/places/searchPlaces'

export type CreatePostData = {
  caption: string
  location: string
  locationLat: number | null
  locationLng: number | null
  file: File | null
}

const CreatePostForm = () => {
  const [showPicker, setShowPicker] = useState(false)
  const [postType, setPostType] = useState<'post' | 'reel'>('post')

  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<CreatePostData>({
    defaultValues: {
      caption: '',
      location: '',
      locationLat: null,
      locationLng: null,
      file: null,
    },
  })

  const location = watch('location')
  const file = watch('file')

  const form = useHandleForm(createPost)

  const handlePostTypeChange = (next: 'post' | 'reel') => {
    setPostType(next)
    setValue('file', null)
  }

  const handlePlaceSelected = (place: PlaceResult) => {
    setValue('location', place.name)
    setValue('locationLat', place.lat)
    setValue('locationLng', place.lng)
    setShowPicker(false)
  }

  const clearLocation = () => {
    setValue('location', '')
    setValue('locationLat', null)
    setValue('locationLng', null)
  }

  return (
    <form onSubmit={handleSubmit(form.submit)} className="space-y-5">
      {form.error && <p className="text-sm text-red-500">{form.error}</p>}

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-neutral-700">
          نوع محتوا (Content type)
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-neutral-100">
          {(
            [
              { value: 'post', label: 'پست (Post)', Icon: ImageIcon },
              { value: 'reel', label: 'ریلز (Reel)', Icon: Clapperboard },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => handlePostTypeChange(value)}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                postType === value
                  ? 'bg-white text-[#262626] shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-neutral-700">
          {postType === 'reel'
            ? 'فایل ویدیو (Video file)'
            : 'فایل عکس (Photo file)'}
        </label>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <File
              key={postType}
              expectedType={postType === 'reel' ? 'video' : 'image'}
              onChange={(file) => field.onChange(file)}
            />
          )}
        />
        {errors?.file?.message && (
          <span className="text-xs text-red-500 mt-0.5">
            {errors.file.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-semibold text-neutral-700">
          کپشن (Caption)
        </label>
        <textarea
          {...register('caption')}
          placeholder="کپشن خود را بنویسید..."
          rows={4}
          className="w-full p-2.5 rounded-lg border border-[#dbdbdb] bg-white text-[#262626] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 placeholder-neutral-400"
          required
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-semibold text-neutral-700">
          موقعیت مکانی (Location)
        </label>
        {location ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#dbdbdb] bg-white">
            <MapPin size={16} className="text-blue-500 shrink-0" />
            <span className="flex-1 text-sm line-clamp-1">{location}</span>
            <button
              type="button"
              onClick={clearLocation}
              aria-label="Remove location"
            >
              <X size={16} className="text-neutral-400" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 p-2.5 rounded-lg border border-[#dbdbdb] bg-white text-neutral-500 hover:bg-neutral-50 text-sm"
          >
            <MapPin size={16} />
            روی نقشه انتخاب کن (Add a real place)
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={form.pending || !file}
        className="relative w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-all overflow-hidden"
      >
        {form.pending && (
          <span
            className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-150"
            style={{ width: `${form.progress}%` }}
          />
        )}
        <span className="relative">
          {form.pending ? `در حال آپلود... ${form.progress}%` : 'انتشار پست'}
        </span>
      </button>

      {showPicker && (
        <PlacePicker
          onSelect={handlePlaceSelected}
          onClose={() => setShowPicker(false)}
        />
      )}
    </form>
  )
}

export default CreatePostForm
