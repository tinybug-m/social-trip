'use client'

import CreatePostForm from '@/src/components/organisms/CreatePostForm'

export default function CreatePostPage() {
  return (
    <div
      className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 space-y-6"
      style={{ direction: 'rtl' }}
    >
      <h2 className="text-xl font-bold text-white mb-2">ایجاد پست جدید</h2>
      <CreatePostForm />
    </div>
  )
}
