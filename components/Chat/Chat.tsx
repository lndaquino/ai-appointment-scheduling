import { IChatAssistant } from '@/types'
import { debug } from '@/utils'
import { PaperPlaneRight } from '@phosphor-icons/react'
import React, { useRef, useEffect, useState } from 'react'

interface IProps {
  chatAssistant: IChatAssistant
}
export function Chat({ chatAssistant }: IProps) {
  const { messages, input, handleInputChange, handleSubmit, isConfirmed } =
    chatAssistant
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight
      }
    }

    scrollToBottom()

    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isLoading])

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      await handleSubmit(event)
    } catch (error) {
      debug(error)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex h-screen flex-col justify-between bg-gray-50">
      <div
        ref={messagesContainerRef}
        className="z-0 mt-20 flex max-h-screen w-full flex-col overflow-y-auto p-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`m-2 flex flex-col rounded shadow ${message.role === 'user' ? 'bubble right bg-indigo-200' : 'bubble left bg-gray-200'}`}
          >
            <span className="mx-4 my-2 text-sm">{message.content}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="z-10 flex gap-2 border-t bg-indigo-400 px-4 py-4"
      >
        <input
          ref={inputRef}
          className="z-30 w-full rounded border border-gray-300 bg-gray-50 p-1 text-sm shadow-lg outline-none"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isConfirmed || isLoading}
          autoFocus={true}
        />

        <button
          type="submit"
          disabled={isConfirmed || isLoading}
          className="text-yellow-300 hover:text-yellow-400"
        >
          {isLoading ? (
            <div className="spinner"></div> // Render the spinner when isLoading is true
          ) : (
            <PaperPlaneRight size={26} />
          )}
        </button>
      </form>
    </div>
  )
}
