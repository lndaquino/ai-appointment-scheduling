import { IChatAssistant } from '@/types'
import { PaperPlaneRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import React, { useRef, useEffect, useState } from 'react'

interface IProps {
  chatAssistant: IChatAssistant
}
export function Chat({ chatAssistant }: IProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className="flex h-screen flex-col justify-between bg-gray-50">
      <div
        ref={messagesContainerRef}
        className="mt-20 flex max-h-screen w-full flex-col overflow-y-auto p-4"
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
        className="z-10 flex gap-2 border-t bg-indigo-400 px-4 py-4"
      >
        <input
          className="w-full rounded border border-gray-300 p-1 text-sm shadow-lg outline-none hover:bg-gray-50"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isConfirmed}
        />
        <div>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="cursor-pointer appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-4 text-sm leading-tight shadow-lg hover:opacity-85 focus:bg-white focus:outline-none"
          >
            <option value="">Select Mood</option>
            <option value="funny">Funny</option>
            <option value="polite" defaultChecked>
              Polite
            </option>
            <option value="ironic">Ironic</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <button type="submit" disabled={isConfirmed} className="text-yellow-300 hover:text-yellow-400">
          <PaperPlaneRight size={26} />
        </button>
      </form>
    </div>
  )
}
