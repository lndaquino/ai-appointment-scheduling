import { Appointment } from '@/types'
import { useState } from 'react'

const useCalendar = () => {
  const [calendar, setCalendar] = useState<Appointment[]>(() => {
    return initCalendar()
  })

  const findAppointmentByDate = (searchDate: Date): Appointment | undefined => {
    const appointmentsOnDate = calendar.find(
      (appointment) => appointment.date.getTime() === searchDate.getTime(),
    )
    return appointmentsOnDate
  }

  const createAppointment = (date: Date, name: string) => {
    const appt = { date, name }
    setCalendar((current) => {
      current.push(appt)
      return current
    })
  }

  return {
    calendar,
    findAppointmentByDate,
    createAppointment,
  }
}

const initCalendar = () => {
  const now = new Date()
  const appts = [] as Appointment[]
  // set the number of random appointments (1 to 30)
  const numberOfAppointments = Math.floor(Math.random() * 30) + 1

  for (let i = 0; i < numberOfAppointments; i++) {
    // randomly generates a number from 0 to 44
    const daysToAdd = Math.floor(Math.random() * 45)
    // randomly generates a number from 8 to 18
    const hour = Math.floor(Math.random() * 10) + 8
    // randomly generates 0 or 30
    const minute = Math.random() < 0.5 ? 0 : 30
    const apptDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysToAdd,
      hour,
      minute,
    )
    const appt = {
      date: apptDate,
      name: 'Test',
    }
    appts.push(appt)
  }

  return appts
}

export default useCalendar
