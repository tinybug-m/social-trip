'use client'

import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { createPost } from '@/src/services/posts/createPost'
import { Controller, useForm } from 'react-hook-form'
import FormField from '../molecules/FormField'
import File from '../atoms/File'
import { useHandleForm } from '@/src/hooks/useHandleForm'
import { PostType } from '@/src/lib/types/entities'
import { PlacePicker } from './PlacePicker'
import { PlaceResult } from '@/src/services/places/searchPlaces'

export type CreatePostData = {
  caption: string
  location: string
  locationLat: number | null
  locationLng: number | null
  file: File | null
  type: PostType
}

const CreatePostForm = () => {
  const [showPicker, setShowPicker] = useState(false)

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
      type: 'post',
    },
  })

  const location = watch('location')

  const form = useHandleForm(createPost)

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
    <form onSubmit={handleSubmit(form.submit)} className="space-y-4">
      {form.error && <p className="text-sm text-red-500">{form.error}</p>}
      <FormField label="فایل پست (عکس یا ویدیو)" error={errors?.file?.message}>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <File onChange={(file) => field.onChange(file)} />
          )}
        ></Controller>
      </FormField>

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

      <FormField label="تایپ" error={errors?.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-neutral-100">
              {(
                [
                  { value: 'post', label: 'پست (Post)' },
                  { value: 'reel', label: 'ریلز (Reel)' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={`py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    field.value === option.value
                      ? 'bg-white text-[#262626] shadow-sm'
                      : 'text-neutral-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </FormField>

      <button
        type="submit"
        disabled={form.pending}
        className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-all"
      >
        {form.pending ? 'در حال آپلود و انتشار...' : 'انتشار پست'}
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
