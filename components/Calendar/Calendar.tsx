import { Appointment } from "@/types"

interface IProps {
  calendar: Appointment[]
}

export default function Calendar({calendar}: IProps) {
    return (
      <div>
          <h1>CALENDAR</h1>
      </div>
    )
  }