import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'
import { Message } from '@/types'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import React, { useRef, useEffect } from 'react'

export function Chat() {
  const mistralModel = useAiModel('mistral')
  const { messages, input, handleSubmit, handleInputChange } =
    useAssistant(mistralModel)

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
        className="mt-20 flex h-[calc(100vh-141px)] w-full flex-col overflow-y-auto bg-gray-50 p-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mx-2 my-1 flex max-w-xs flex-col rounded shadow ${message.role === 'user' ? 'bubble right bg-indigo-200' : 'bubble left bg-gray-200'}`}
          >
            <p className="p-2">{message.content}</p>
            <span className="pb-2 pr-4 text-end text-xs text-gray-600">
              {extractHours(message.createdAt)}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="z-10 flex gap-2 border bg-white p-2"
      >
        <input
          className="w-full rounded border border-gray-300 p-2 shadow-xl outline-1 outline-indigo-700"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />

        <button type="submit" className="text-indigo-700 hover:text-indigo-500">
          <PaperPlaneRight size={26} />
        </button>
      </form>
    </div>
  )
}
