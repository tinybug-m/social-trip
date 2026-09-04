'use client'

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { supabaseClient } from '@/src/lib/supabase/client'
import { sendMessage } from '@/src/services/messages/sendMessage'
import { Message } from '@/src/lib/types/entities'
import { formatRelativeTime } from '@/src/lib/utils/formatRelativeTime'

export function ChatThread({
  currentUserId,
  otherUserId,
  initialMessages,
}: {
  currentUserId: string
  otherUserId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabaseClient
      .channel(`messages-${currentUserId}-${otherUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const message = payload.new as Message
          const belongsToThread =
            (message.sender_id === currentUserId &&
              message.receiver_id === otherUserId) ||
            (message.sender_id === otherUserId &&
              message.receiver_id === currentUserId)

          if (!belongsToThread) return

          setMessages((prev) =>
            prev.some((m) => m.id === message.id) ? prev : [...prev, message],
          )
        },
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [currentUserId, otherUserId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = text.trim()
    if (!content || pending) return

    setPending(true)
    setError(null)
    setText('')

    const tempId = `temp-${Date.now()}-${Math.random()}`
    const optimisticMessage: Message = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    }
    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const message = await sendMessage(otherUserId, content)
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId)
        return withoutTemp.some((m) => m.id === message.id)
          ? withoutTemp
          : [...withoutTemp, message]
      })
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setError(e instanceof Error ? e.message : 'Could not send message')
      setText(content)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-10">
            Say hello 👋
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === currentUserId
            const isSending = message.id.startsWith('temp-')

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm break-words transition-opacity ${
                    isSending ? 'opacity-50' : 'opacity-100'
                  } ${
                    isMine
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-neutral-100 text-[#262626] rounded-bl-sm'
                  }`}
                >
                  {message.content}
                  <div
                    className={`text-[10px] mt-0.5 ${isMine ? 'text-blue-100' : 'text-neutral-400'}`}
                  >
                    {isSending
                      ? 'Sending...'
                      : formatRelativeTime(message.created_at)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-xs text-red-500 px-3 pb-1">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-[#dbdbdb] px-3 py-2 shrink-0"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="flex-1 text-sm outline-none placeholder-neutral-400 bg-[#fafafa] rounded-full px-4 py-2"
        />
        <button
          type="submit"
          disabled={pending || !text.trim()}
          aria-label="Send"
          className="text-blue-500 font-semibold disabled:opacity-40"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
