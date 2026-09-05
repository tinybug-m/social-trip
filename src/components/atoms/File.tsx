'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, FileImage, Film } from 'lucide-react'

interface FileUploadProps {
  onChange: (file: File | null) => void
  expectedType: 'image' | 'video'
}

const File = ({ onChange, expectedType }: FileUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    previewUrlRef.current = previewUrl
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    let detectedType: 'image' | 'video'
    if (file.type.startsWith('image/')) {
      detectedType = 'image'
    } else if (file.type.startsWith('video/')) {
      detectedType = 'video'
    } else {
      setFileError('Please select an image or video file.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (detectedType !== expectedType) {
      setFileError(
        expectedType === 'image'
          ? 'Posts can only use a photo. Switch to Reel for a video.'
          : 'Reels can only use a video. Switch to Post for a photo.',
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setFileError(null)
    setFileType(detectedType)

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    onChange(file)
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(null)
    setFileType(null)
    setFileError(null)
    onChange(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <div
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] transition-all
          ${previewUrl ? 'border-[#dbdbdb] bg-neutral-50' : 'border-[#dbdbdb] bg-neutral-50 hover:bg-neutral-100 hover:border-blue-400 cursor-pointer'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={expectedType === 'image' ? 'image/*' : 'video/*'}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full max-h-[300px] flex items-center justify-center overflow-hidden rounded-lg">
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 p-1.5 rounded-full text-white z-10 transition-colors shadow-md"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>

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
          <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
            <div className="p-3 bg-neutral-200 rounded-full text-neutral-500">
              {expectedType === 'image' ? (
                <FileImage className="w-6 h-6 text-neutral-500" />
              ) : (
                <Film className="w-6 h-6 text-neutral-500" />
              )}
            </div>
            <div className="text-sm text-neutral-700 font-medium">
              Click to upload or drag and drop
            </div>
            <div className="text-xs text-neutral-500 flex gap-1">
              {expectedType === 'image' ? (
                <span className="flex items-center gap-1">
                  <FileImage className="w-3 h-3" /> Photo (PNG, JPG)
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3" /> Video (MP4, MOV)
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {fileError && (
        <span className="text-xs text-red-500 mt-1 block">{fileError}</span>
      )}
    </div>
  )
}

export default File
