'use client'

import { useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Comment } from '@/src/lib/types/entities'
import { CommentItem } from '@/src/components/molecules/CommentItem'
import { addComment } from '@/src/services/comments/addComment'
import {
  deleteComment,
  updateComment,
} from '@/src/services/comments/updateComment'
import {
  likeComment,
  unlikeComment,
} from '@/src/services/comments/toggleCommentLike'

export function CommentsSection({
  postId,
  initialComments,
  currentUserId,
  initialLikedCommentIds,
}: {
  postId: string
  initialComments: Comment[]
  currentUserId: string | null
  initialLikedCommentIds: string[]
}) {
  const [comments, setComments] = useState(initialComments)
  const [likedIds, setLikedIds] = useState(new Set(initialLikedCommentIds))
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const likeTogglesInFlight = useRef(new Set<string>())

  const tree = useMemo(() => {
    const topLevel = comments.filter((c) => !c.parent_comment_id)
    const repliesByParent = new Map<string, Comment[]>()

    for (const comment of comments) {
      if (!comment.parent_comment_id) continue
      const list = repliesByParent.get(comment.parent_comment_id) ?? []
      list.push(comment)
      repliesByParent.set(comment.parent_comment_id, list)
    }

    return topLevel.map((comment) => ({
      comment,
      replies: repliesByParent.get(comment.id) ?? [],
    }))
  }, [comments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || pending) return

    setPending(true)
    setError(null)

    try {
      const comment = await addComment(postId, content, replyTo?.id ?? null)
      setComments((prev) => [...prev, comment])
      setText('')
      setReplyTo(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post comment')
    } finally {
      setPending(false)
    }
  }

  const handleEdit = async (comment: Comment, content: string) => {
    const updated = await updateComment(comment.id, content)
    setComments((prev) => prev.map((c) => (c.id === comment.id ? updated : c)))
  }

  const handleDelete = async (comment: Comment) => {
    const previous = comments
    setComments((prev) =>
      prev.filter(
        (c) => c.id !== comment.id && c.parent_comment_id !== comment.id,
      ),
    )

    try {
      await deleteComment(comment.id)
    } catch (e) {
      setComments(previous)
      setError(e instanceof Error ? e.message : 'Could not delete comment')
    }
  }

  const handleToggleLike = async (comment: Comment) => {
    if (!currentUserId) return
    if (likeTogglesInFlight.current.has(comment.id)) return
    likeTogglesInFlight.current.add(comment.id)

    const isLiked = likedIds.has(comment.id)

    setLikedIds((prev) => {
      const next = new Set(prev)
      if (isLiked) next.delete(comment.id)
      else next.add(comment.id)
      return next
    })
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? {
              ...c,
              likes_count: Math.max(
                (c.likes_count ?? 0) + (isLiked ? -1 : 1),
                0,
              ),
            }
          : c,
      ),
    )

    try {
      if (isLiked) {
        await unlikeComment(comment.id, currentUserId)
      } else {
        await likeComment(comment.id, currentUserId)
      }
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev)
        if (isLiked) next.add(comment.id)
        else next.delete(comment.id)
        return next
      })
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                likes_count: Math.max(
                  (c.likes_count ?? 0) + (isLiked ? 1 : -1),
                  0,
                ),
              }
            : c,
        ),
      )
    } finally {
      likeTogglesInFlight.current.delete(comment.id)
    }
  }

  return (
    <div className="border-t border-[#dbdbdb]">
      {tree.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-6">
          No comments yet.
        </p>
      ) : (
        <div className="divide-y divide-[#f0f0f0]">
          {tree.map(({ comment, replies }) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                isOwn={comment.user_id === currentUserId}
                liked={likedIds.has(comment.id)}
                onToggleLike={handleToggleLike}
                onReply={setReplyTo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isOwn={reply.user_id === currentUserId}
                  liked={likedIds.has(reply.id)}
                  isReply
                  onToggleLike={handleToggleLike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#dbdbdb] px-3 py-2 sticky bottom-0 bg-white"
      >
        {replyTo && (
          <div className="flex items-center justify-between text-xs text-neutral-500 pb-1.5">
            <span>
              Replying to{' '}
              <span className="font-semibold">{replyTo.username}</span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              replyTo ? `Reply to ${replyTo.username}...` : 'Add a comment...'
            }
            className="flex-1 text-sm outline-none placeholder-neutral-400"
          />
          <button
            type="submit"
            disabled={pending || !text.trim()}
            className="text-blue-500 font-semibold text-sm disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      {error && <p className="text-xs text-red-500 px-3 pb-2">{error}</p>}
    </div>
  )
}
