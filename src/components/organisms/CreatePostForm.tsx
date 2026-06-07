import { useState } from 'react'
import { createPost } from '@/src/services/posts/createPost'
import { useFormSubmit } from '@/src/lib/useFormHandler'
import { Controller, useForm } from 'react-hook-form'
import FormField from '../molecules/FormField'
import File from '../atoms/File'
import Select from '../atoms/Select'

export type CreatePostData = {
  caption: string
  file: File | null
  type: string
}

const CreatePostForm = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<CreatePostData>({
    defaultValues: {
      caption: '',
      file: null,
      type: 'post',
    },
  })
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { createSubmitHandler, isSubmitting } = useFormSubmit({
    onSuccess: () => {
      alert('پست با موفقیت همراه با فایل ساخته شد!')
      setCaption('')
      setSelectedFile(null)
    },
    onError: (error) => {
      alert(error.message || 'خطا در ثبت پست')
    },
  })

  const handleCreatePost = createSubmitHandler(async (data: CreatePostData) => {
    console.log({ data })
    // if (!data.file) {
    //   alert('لطفاً ابتدا یک عکس یا ویدیو انتخاب کنید!')
    //   return
    // }
    // await createPost({ file: data.file, caption: data.caption, type: 'reel' })
  })

  return (
    <form onSubmit={handleSubmit(handleCreatePost)} className="space-y-4">
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
        <label className="text-sm font-semibold text-gray-300">
          کپشن (Caption)
        </label>
        <textarea
          {...register('caption')}
          placeholder="کپشن خود را بنویسید..."
          rows={4}
          className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
          required
        />
      </div>
      
      <FormField label="تایپ" error={errors?.type?.message}>
        <Select
          options={[
            { value: 'post', text: 'post' },
            { value: 'reel', text: 'reel' },
          ]}
          {...register('type')}
        ></Select>
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all"
      >
        {isSubmitting ? 'در حال آپلود و انتشار...' : 'انتشار پست'}
      </button>
    </form>
  )
}

export default CreatePostForm
