import { IChatAssistant } from '@/types'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import React, { useRef, useEffect } from 'react'

interface IProps {
  chatAssistant: IChatAssistant
}
export function Chat({ chatAssistant }: IProps) {
  const { messages, input, handleInputChange, handleSubmit, isConfirmed } = chatAssistant
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight
      }
    }

    scrollToBottom()
  }, [messages])

  function extractHours(date: Date) {
    return format(date, 'HH:mm')
  }

  return (
    <div className="">
      <div
        ref={messagesContainerRef}
        className="mt-20 flex h-[calc(100vh-188px)] w-full flex-col overflow-y-auto bg-gray-50 p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mx-2 my-1 flex max-w-xs flex-col rounded shadow ${message.role === 'user' ? 'bubble right bg-indigo-200' : 'bubble left bg-gray-200'}`}
          >
            <p className="p-1 text-sm">{message.content}</p>
            <span className="pb-1 pr-2 text-end text-xs text-gray-600">
              {extractHours(message.createdAt)}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="z-10 flex gap-2 border-t bg-white px-4 py-8"
      >
        <input
          className="w-full rounded border border-gray-300 p-2 text-sm shadow-xl outline-1 outline-indigo-700"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isConfirmed}
        />

        <button type="submit" disabled={isConfirmed} className="text-indigo-700 hover:text-indigo-500">
          <PaperPlaneRight size={26} />
        </button>
      </form>
    </div>
  )
}
