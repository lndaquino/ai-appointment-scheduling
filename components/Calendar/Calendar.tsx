import { Appointment } from '@/types'

interface IProps {
  calendar: Appointment[]
}

export function Calendar({ calendar }: IProps) {
  return (
    <div>
      <h1>CALENDAR</h1>
    </div>
  )
}
