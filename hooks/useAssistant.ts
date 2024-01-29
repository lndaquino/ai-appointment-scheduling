import { AppContext } from '@/contexts/AppContext'
import { AIModel, ICalendar, Message, Role } from '@/types'
import { format } from 'date-fns'
import { useContext, useState } from 'react'
import { debug } from '@/utils'

const WAIT_DATE = 0
const WAIT_TIME = 1
const WAIT_CONFIRMATION = 2
const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

let status = WAIT_DATE
let date = ''
let time = ''
let dateConfirmedBy = ''

const useAssistant = (ai: AIModel, calendar: ICalendar) => {
  const { mood, handleFinishedClose } = useContext(AppContext)

  const [messages, setMessages] = useState<Message[]>(() => {
    return initMessages()
  })
  const [input, setInput] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { getFreeTime, findAppointmentByDate, createAppointment } = calendar

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    let handlingMessage = true
    while (handlingMessage) {
      debug(
        `status = ${status} / date = ${date} / time = ${time} / dateConfirmedBy = ${dateConfirmedBy}`,
      )
      if (status === WAIT_CONFIRMATION) {
        debug('CHECKING IF IT HAS A CONFIRMATION')
        dateConfirmedBy = await checkForConfirmation(newUserMessage)
        debug(`DATE CONFIRMED BY = ${dateConfirmedBy}`)
        if (dateConfirmedBy === '') {
          debug('NO CONFIRMATION, generateNewConfirmationMessage')
          const newTimeMessage = await generateNewConfirmationMessage()

          const newAssistantMessage: Message = {
            id: 0,
            createdAt: new Date(),
            content: newTimeMessage,
            role: 'assistant',
          }

          setMessages((prevMessages) => {
            newAssistantMessage.id = prevMessages.length + 1
            return [...prevMessages, newAssistantMessage]
          })
          handlingMessage = false
        } else {
          createAppointment(new Date(date + 'T' + time), dateConfirmedBy)
          const newFinalMessage = await generateFinalMessage()

          const newAssistantMessage: Message = {
            id: 0,
            createdAt: new Date(),
            content: newFinalMessage,
            role: 'assistant',
          }

          setMessages((prevMessages) => {
            newAssistantMessage.id = prevMessages.length + 1
            return [...prevMessages, newAssistantMessage]
          })
          handlingMessage = false
          setIsConfirmed(true)
          handleFinishedClose()
        }
      }

      if (status === WAIT_TIME) {
        debug('CHECKING IF IT HAS A TIME')
        time = await checkTimeOnMessage(newUserMessage)
        debug(`TIME = ${time}`)
        const freeTime = getFreeTime(date)
        if (time === '') {
          debug('NO TIME, generateNewTimeMessage')
          const newTimeMessage = await generateNewTimeMessage(freeTime)

          const newAssistantMessage: Message = {
            id: 0,
            createdAt: new Date(),
            content: newTimeMessage,
            role: 'assistant',
          }

          setMessages((prevMessages) => {
            newAssistantMessage.id = prevMessages.length + 1
            return [...prevMessages, newAssistantMessage]
          })
          handlingMessage = false
        } else {
          const timeIsAvailable = checkForAvailableTime(date, time)
          debug(`available time = ${timeIsAvailable}`)
          if (timeIsAvailable) {
            status = WAIT_CONFIRMATION
          } else {
            const newTimeMessage =
              await generateNewTimeMessageForUnavailableDate(freeTime)
            const newAssistantMessage: Message = {
              id: 0,
              createdAt: new Date(),
              content: newTimeMessage,
              role: 'assistant',
            }

            setMessages((prevMessages) => {
              newAssistantMessage.id = prevMessages.length + 1
              return [...prevMessages, newAssistantMessage]
            })
            handlingMessage = false
          }
        }
      }

      if (status === WAIT_DATE) {
        debug('CHECKING IF IT HAS A DATE')
        date = await checkDateOnMessage(newUserMessage)
        debug(`DATE = ${date}`)
        if (date === '') {
          debug('NO DATE, generateNewDateMessage')
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
          handlingMessage = false
        } else {
          status = WAIT_TIME
        }
      }
    }
  }

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
    debug(`CHECK DATE PROMPT = ${prompt}`)
    const response = await ai.generateMessage(prompt)

    debug(response)
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
    debug(`USER MESSAGES: ${userMessages}`)
    const prompt =
      `You're a clinic's secretary helping a customer to schedule an appointment after ${format(newUserMessage.createdAt, 'yyyy-MM-dd')}. Your last message sent to the customer was: "${getLastMessage('assistant').content}". Generate a${mood}message up to 20 words asking for a near future date based on the user messages sent so far: "` +
      getUserMessages() +
      `."`
    return await ai.generateMessage(prompt)
  }

  const generateNewTimeMessage = async (
    freeTime: string[],
  ): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment on day ${date}. Generate a${mood}message up to 30 words offering at least five of the following available times: ${freeTime}.`
    debug(prompt)
    return await ai.generateMessage(prompt)
  }

  const generateNewTimeMessageForUnavailableDate = async (
    freeTime: string[],
  ): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment on day ${date}. The customer prompted an unavailable time at ${time} for your suggestion "${getLastMessage('assistant').content}". Generate a${mood}message up to 30 words offering at least five of the following available times and considering that ${time} is unavailable: ${freeTime}.`
    debug(prompt)
    return await ai.generateMessage(prompt)
  }

  const checkTimeOnMessage = async (
    newUserMessage: Message,
  ): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. A customer prompted: "${newUserMessage.content}" for the question "${getLastMessage('assistant').content}". Extract a time in the mm-HH format from user's prompt. Return only the time in mm:HH format without any text. If no time detected return the word "empty"`
    debug(prompt)
    const response = await ai.generateMessage(prompt)
    debug(response)
    return response.includes('empty') ? '' : response
  }

  const checkForAvailableTime = (date: string, time: string): boolean => {
    const selectedDate = new Date(date + 'T' + time)
    debug(`SELECTED DATE: ${selectedDate}`)
    return !findAppointmentByDate(selectedDate)
  }

  const checkForConfirmation = async (
    newUserMessage: Message,
  ): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. A customer prompted: "${newUserMessage.content}" for the question "${getLastMessage('assistant').content}". Extract a name from user's prompt as a confirmation. Return only the extracted name without any other text. If no name detected return the word "empty"`
    debug(prompt)
    const response = await ai.generateMessage(prompt)
    debug(response)
    return response.includes('empty') ? '' : response
  }

  const generateNewConfirmationMessage = async (): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. The customer is asking for an appointment on ${date}, at ${time} hours. Generate a${mood}message up to 20 words asking the customer's name as a confirmation of the appointment.`
    debug(prompt)
    return await ai.generateMessage(prompt)
  }

  const generateFinalMessage = async (): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. The customer confirmed the appointment on on ${date}, at ${time}. The customer name is ${dateConfirmedBy}. Generate a${mood}message up to 20 words confirming the appointment.`
    debug(prompt)
    return await ai.generateMessage(prompt)
  }

  return {
    messages,
    input,
    mood,
    handleInputChange,
    handleSubmit,
    isConfirmed,
  }
}

const initMessages = () => {
  return [
    {
      id: 1,
      createdAt: new Date(),
      content: `Hi, which day would you like to schedule your appointment?`,
      role: 'assistant',
    },
  ] as Message[]
}

export default useAssistant
