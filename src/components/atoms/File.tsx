'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, FileImage, Film } from 'lucide-react'

interface FileUploadProps {
  onChange: (file: File | null) => void
  error?: string
}

const File = ({ onChange, error }: FileUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ۱. مدیریت انتخاب فایل و ساخت پیش‌نمایش موقت
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // مشخص کردن نوع فایل (عکس یا ویدیو)
    if (file.type.startsWith('image/')) {
      setFileType('image')
    } else if (file.type.startsWith('video/')) {
      setFileType('video')
    } else {
      alert('لطفاً فقط فایل عکس یا ویدیو انتخاب کنید!')
      return
    }

    // تولید یک URL موقت در مرورگر برای نمایش Preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // پاس دادن فایل واقعی به کامپوننت پدر برای آپلود نهایی
    onChange(file)
  }

  // ۲. پاک کردن فایل انتخاب شده و ریست کردن استیت‌ها
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl) // پاک کردن کش مرورگر برای جلوگیری از نشت حافظه
    }

    setPreviewUrl(null)
    setFileType(null)
    onChange(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      onClick={() => !previewUrl && fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] transition-all
          ${previewUrl ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500 cursor-pointer'}
        `}
    >
      {/* اینپوت مخفی فایل */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* حالت اول: فایل انتخاب شده و پیش‌نمایش نشان داده می‌شود */}
      {previewUrl ? (
        <div className="relative w-full h-full max-h-[300px] flex items-center justify-center overflow-hidden rounded-lg">
          {/* دکمه حذف فایل */}
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 p-1.5 rounded-full text-white z-10 transition-colors shadow-md"
            title="حذف فایل"
          >
            <X className="w-4 h-4" />
          </button>

          {/* رندر بر اساس نوع فایل */}
          {fileType === 'image' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain max-h-[280px]"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-contain max-h-[280px]"
            />
          )}
        </div>
      ) : (
        /* حالت دوم: هنوز فایلی انتخاب نشده و باکس آپلود خالی است */
        <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
          <div className="p-3 bg-zinc-800 rounded-full text-zinc-400">
            <Upload className="w-6 h-6 text-zinc-400" />
          </div>
          <div className="text-sm text-zinc-300 font-medium">
            برای آپلود کلیک کنید یا فایل را اینجا رها کنید
          </div>
          <div className="text-xs text-zinc-500 flex gap-3 mt-1">
            <span className="flex items-center gap-1">
              <FileImage className="w-3 h-3" /> عکس (PNG, JPG)
            </span>
            <span className="flex items-center gap-1">
              <Film className="w-3 h-3" /> ویدیو (MP4, MOV)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default File
