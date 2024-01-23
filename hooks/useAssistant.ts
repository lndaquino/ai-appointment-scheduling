import { AIModel, ICalendar, Message, Role } from '@/types'
import { format } from 'date-fns'
import { useState } from 'react'

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
const mood = 'funny'

let status = WAIT_DATE
let date = ''
let time = ''
let dateConfirmedBy = ''

const useAssistant = (ai: AIModel, calendar: ICalendar) => {
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

      let handlingMessage = true
      while (handlingMessage) {
        console.log(`status = ${status} / date = ${date} / time = ${time} / dateConfirmedBy = ${dateConfirmedBy}`)
        if (status === WAIT_CONFIRMATION) {
          console.log('CHECKING IF IT HAS A CONFIRMATION')
          dateConfirmedBy = await checkForConfirmation(newUserMessage)
          console.log(`DATE CONFIRMED BY = ${dateConfirmedBy}`)
          if (dateConfirmedBy === '') {
            console.log('NO CONFIRMATION, generateNewConfirmationMessage')
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
            handlingMessage=false
          } else {
            createAppointment(new Date(date+"T"+time),dateConfirmedBy)
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
            handlingMessage=false
            setIsConfirmed(true)
          }
        }
        
        if (status===WAIT_TIME) {
          console.log('CHECKING IF IT HAS A TIME')
          time = await checkTimeOnMessage(newUserMessage)
          console.log(`TIME = ${time}`)
          const freeTime = getFreeTime(date)
          if (time === '') {
            console.log('NO TIME, generateNewTimeMessage')
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
            handlingMessage=false
          } else {
            const timeIsAvailable = checkForAvailableTime(date, time)
            console.log(`available time = ${timeIsAvailable}`)
            if (timeIsAvailable) {
              status=WAIT_CONFIRMATION

            } else {
              const newTimeMessage = await generateNewTimeMessageForUnavailableDate(freeTime)
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
              handlingMessage=false
            }
          }
        }

        if (status === WAIT_DATE) {
          console.log('CHECKING IF IT HAS A DATE')
          date = await checkDateOnMessage(newUserMessage)
          console.log(`DATE = ${date}`)
          if (date === '') {
            console.log('NO DATE, generateNewDateMessage')
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
            handlingMessage=false
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
      `You're a clinic's secretary helping a customer to schedule an appointment after ${format(newUserMessage.createdAt, 'yyyy-MM-dd')}. Your last message sent to the customer was: "${getLastMessage('assistant').content}". Generate a ${mood} message up to 20 words asking for a near future date based on the user messages sent so far: "` +
      getUserMessages() +
      `."`
    return await ai.generateMessage(prompt)
  }

  const generateNewTimeMessage = async (freeTime: string[]): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment on day ${date}. Generate a ${mood} message up to 30 words offering at least five of the following available times: ${freeTime}.`
    console.log(prompt)
    return await ai.generateMessage(prompt)
  }

  const generateNewTimeMessageForUnavailableDate = async (freeTime: string[]): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment on day ${date}. The customer prompted an unavailable time at ${time} for your suggestion "${getLastMessage('assistant').content}". Generate a ${mood} message up to 30 words offering at least five of the following available times and considering that ${time} is unavailable: ${freeTime}.`
    console.log(prompt)
    return await ai.generateMessage(prompt)
  }

  const checkTimeOnMessage = async (newUserMessage: Message): Promise<string> => {
    const prompt =`You're a clinic's secretary helping a customer to schedule an appointment. A customer prompted: "${newUserMessage.content}" for the question "${getLastMessage('assistant').content}". Extract a time in the mm-HH format from user's prompt. Return only the time in mm:HH format without any text. If no time detected return the word "empty"`
    console.log(prompt)
    const response = await ai.generateMessage(prompt)
    console.log(response)
    return response.includes('empty') ? '' : response
  }

  const checkForAvailableTime = (date:string, time:string): boolean => {
    const selectedDate = new Date(date + "T"+ time)
    console.log(`SELECTED DATE: ${selectedDate}`)
    return !findAppointmentByDate(selectedDate)
  }

  const checkForConfirmation = async (newUserMessage: Message): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. A customer prompted: "${newUserMessage.content}" for the question "${getLastMessage('assistant').content}". Extract a name from user's prompt as a confirmation. Return only the extracted name without any other text. If no name detected return the word "empty"`
    console.log(prompt)
    const response = await ai.generateMessage(prompt)
    console.log(response)
    return response.includes('empty') ? '' : response
  }

  const generateNewConfirmationMessage = async (): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. The customer is asking for an appointment on ${date}, at ${time} hours. Generate a ${mood} message up to 20 words asking the customer's name as a confirmation of the appointment.`
    console.log(prompt)
    return await ai.generateMessage(prompt)
  }

  const generateFinalMessage = async (): Promise<string> => {
    const prompt = `You're a clinic's secretary helping a customer to schedule an appointment. The customer confirmed the appointment on on ${date}, at ${time}. The customer name is ${dateConfirmedBy}. Generate a ${mood} message up to 20 words confirming the appointment.`
    console.log(prompt)
    return await ai.generateMessage(prompt)
  }

  return {
    messages,
    input,
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
