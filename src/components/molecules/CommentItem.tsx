'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MoreHorizontal } from 'lucide-react'
import Avatar from '@/src/components/atoms/Avatar'
import { Comment } from '@/src/lib/types/entities'
import { formatRelativeTime } from '@/src/lib/utils/formatRelativeTime'
import { linkifyCaption } from '@/src/lib/utils/linkifyCaption'

interface CommentItemProps {
  comment: Comment
  isOwn: boolean
  liked: boolean
  isReply?: boolean
  onToggleLike: (comment: Comment) => void
  onReply?: (comment: Comment) => void
  onEdit: (comment: Comment, content: string) => Promise<void>
  onDelete: (comment: Comment) => void
}

export function CommentItem({
  comment,
  isOwn,
  liked,
  isReply = false,
  onToggleLike,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(comment.content)
  const [saving, setSaving] = useState(false)

  const wasEdited = comment.updated_at !== comment.created_at

  const submitEdit = async () => {
    const content = draft.trim()
    if (!content || saving) return

    setSaving(true)
    try {
      await onEdit(comment, content)
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className={`flex items-start gap-2.5 px-3 py-2 ${isReply ? 'pl-11' : ''}`}
    >
      <Link href={`/profile/${comment.user_id}`} className="shrink-0">
        <Avatar
          src={comment.user_image}
          name={comment.username}
          size={isReply ? 24 : 28}
        />
      </Link>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-1.5">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="w-full text-sm border border-[#dbdbdb] rounded-md p-1.5 outline-none focus:border-neutral-400"
              autoFocus
            />
            <div className="flex gap-3 text-xs font-semibold">
              <button
                onClick={submitEdit}
                disabled={saving}
                className="text-blue-500 disabled:opacity-40"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(comment.content)
                  setIsEditing(false)
                }}
                className="text-neutral-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm break-words">
              <Link
                href={`/profile/${comment.user_id}`}
                className="font-semibold mr-1"
              >
                {comment.username}
              </Link>
              {linkifyCaption(comment.content)}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[11px] text-neutral-400 uppercase">
                {formatRelativeTime(comment.created_at)}
              </span>
              {wasEdited && (
                <span className="text-[11px] text-neutral-400">Edited</span>
              )}
              {(comment.likes_count ?? 0) > 0 && (
                <span className="text-[11px] text-neutral-400 font-semibold">
                  {comment.likes_count} like
                  {comment.likes_count === 1 ? '' : 's'}
                </span>
              )}
              {!isReply && onReply && (
                <button
                  onClick={() => onReply(comment)}
                  className="text-[11px] text-neutral-400 font-semibold"
                >
                  Reply
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="relative flex items-start gap-1 pt-0.5">
          <button
            onClick={() => onToggleLike(comment)}
            aria-label="Like comment"
          >
            <Heart
              size={13}
              className={liked ? 'text-red-500' : 'text-neutral-400'}
              fill={liked ? 'currentColor' : 'none'}
            />
          </button>

          {isOwn && (
            <button onClick={() => setShowActions((s) => !s)} aria-label="More">
              <MoreHorizontal size={14} className="text-neutral-400" />
            </button>
          )}

          {showActions && (
            <>
              <button
                className="fixed inset-0 z-0 cursor-default"
                onClick={() => setShowActions(false)}
                aria-label="Close menu"
                tabIndex={-1}
              />
              <div className="absolute right-0 top-5 z-10 bg-white border border-[#dbdbdb] rounded-md shadow-md text-xs overflow-hidden">
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setShowActions(false)
                  }}
                  className="block w-full px-3 py-1.5 text-left hover:bg-neutral-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowActions(false)
                    onDelete(comment)
                  }}
                  className="block w-full px-3 py-1.5 text-left text-red-500 hover:bg-neutral-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
