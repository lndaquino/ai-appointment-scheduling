import { AIModel, ICalendar, Message, Role } from '@/types'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'

const useAssistant = (ai: AIModel, calendar: ICalendar) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return initMessages()
  })
  const [input, setInput] = useState('')
  const { findAppointmentByDate, createAppointment } = calendar
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const mood = 'polite'

  let date = ''

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

      const newUserMessage: Message = {
        id: 0,
        createdAt: new Date(),
        content: input,
        role: 'user',
      }
      setMessages((prevMessages) => {
        newUserMessage.id = prevMessages.length + 1
        return [...prevMessages, newUserMessage]
      })
      setInput('')

      if (date === '') {
        console.log('CHECKING IF IT HAS A DATE')
        date = await checkDateOnMessage(newUserMessage)
        console.log(`DATE = ${date}`)
        if (date === '') {
          console.log('NO DATE, GENERATING NEXT MESSAGE')
          const newDateMessage = await generateNewDateMessage(newUserMessage)
          const newAssistantMessage: Message = {
            id: 0,
            createdAt: new Date(),
            content: newDateMessage,
            role: 'assistant',
          }

          setMessages((prevMessages) => {
            newAssistantMessage.id = prevMessages.length + 1
            return [...prevMessages, newAssistantMessage]
          })
        }
      }
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
    },
    [input, messages, setMessages, ai],
  )

  const getLastMessage = (role: Role): Message => {
    const filteredMessages = messages.filter((message) => message.role === role)
    if (filteredMessages.length > 0) {
      const sortedMessages = filteredMessages.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )
      return sortedMessages[0]
    }
    return messages[0]
  }

  const checkDateOnMessage = async (message: Message): Promise<string> => {
    const today = format(message.createdAt, 'yyyy-MM-dd')
    const dayOfWeek = dayNames[message.createdAt.getDay()]
    const lastAssistantMessage = getLastMessage('assistant')
    const prompt = `An user prompted: "${message.content}" for the question "${lastAssistantMessage.content}". Extract a date in the YYYY-MM-DD format from user's prompt using ${today}, ${dayOfWeek}, as current date. Return only the date in YYYY-MM-DD format without any text. If no date detected return the word "empty"`
    console.log(`CHECK DATE PROMPT = ${prompt}`)
    const response = await ai.generateMessage(prompt)

    console.log(response)
    return response.includes('empty') ? '' : response
  }

  const getUserMessages = (): string => {
    return messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content)
      .join('.')
  }

  const generateNewDateMessage = async (
    newUserMessage: Message,
  ): Promise<string> => {
    const previousUserMessages = getUserMessages()
    const userMessages = previousUserMessages + `. ${newUserMessage.content}`
    console.log(`USER MESSAGES: ${userMessages}`)
    const prompt =
      `You're an clinic's secretary helping an customer to schedule an appointment after ${format(newUserMessage.createdAt, 'yyyy-MM-dd')}. Your last message sent to the customer was: "${getLastMessage('assistant').content}". Generate a ${mood} message up to 20 words asking for a near future date based on the user messages sent so far: "` +
      getUserMessages() +
      `"`
    return await ai.generateMessage(prompt)
  }

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
  ] as Message[]
}

export default useAssistant
