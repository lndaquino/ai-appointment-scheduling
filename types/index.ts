export interface Appointment {
  date: Date
  name: string
}

export type Role = 'user' | 'assistant'
export interface Message {
  id: number
  createdAt: Date
  content: string
  role: Role
}

export interface AIModel {
  generateMessage: (text: string) => Promise<string>
}

export interface IChatAssistant {
  messages: Message[]
  input: string
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isConfirmed: boolean
}

export interface ICalendar {
  appointments: Appointment[]
  findAppointmentByDate: (searchDate: Date) => Appointment | undefined
  createAppointment: (date: Date, name: string) => void
  getFreeTime: (date: string) => string[]
}
