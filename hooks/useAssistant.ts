import { AIModel, Message } from '@/types'
import { useCallback, useState } from 'react'

const useAssistant = (ai: AIModel) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return initMessages()
  })
  const [input, setInput] = useState('')

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value)
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input) return

      const newMessage: Message = {
        id: messages.length + 1,
        createdAt: new Date(),
        content: input,
        role: 'user',
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      // if !hasDate
      // getDate() from LLM
      // if date detected
      // fetch available times on this day

      // if !hasTime
      // getTime() from LLM with or without date
      // if time detected
      // check if date/time is available

      // if date/time is available
      // ask confirmation and get name
      // else ask for another date or time
      // repeat

      // generate next message based wheter there is date, date/time or deny of the suggested date
      const response = await ai.generateMessage(input)
      console.log(response)
      setInput('')
    },
    [input, messages, setMessages],
  )

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  }
}

const initMessages = () => {
  return [
    {
      id: 1,
      createdAt: new Date(),
      content: `Hi, when would you like to schedule your appointment?`,
      role: 'assistant',
    },
    {
      id: 2,
      createdAt: new Date(),
      content: `User test message for UI purposes`,
      role: 'user',
    },
    {
      id: 3,
      createdAt: new Date(),
      content: `assistant test message for UI purposes`,
      role: 'assistant',
    },
  ] as Message[]
}

export default useAssistant
