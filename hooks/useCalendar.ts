import { Appointment } from '@/types'
import { isSameDay } from 'date-fns'
import { useState } from 'react'

const useCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return initAppointments()
  })

  const findAppointmentByDate = (searchDate: Date): Appointment | undefined => {
    const appointmentsOnDate = appointments.find(
      (appointment) => appointment.date.getTime() === searchDate.getTime(),
    )
    return appointmentsOnDate
  }

  const createAppointment = (date: Date, name: string) => {
    const appt = { date, name }
    setAppointments((current) => {
      current.push(appt)
      return current
    })
  }

  return {
    appointments,
    findAppointmentByDate,
    createAppointment,
  }
}

const initAppointments = () => {
  const now = new Date()
  const appts = [] as Appointment[]

  const appointmentsPerDay = new Map<string, number>()

  const numberOfAppointments = Math.floor(Math.random() * 30) + 1

  for (let i = 0; i < numberOfAppointments; i++) {
    const daysToAdd = Math.floor(Math.random() * 45)
    const hour = Math.floor(Math.random() * 10) + 8
    const minute = Math.random() < 0.5 ? 0 : 30
    const apptDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysToAdd,
      hour,
      minute,
    )

    const formattedDate = apptDate.toISOString().split('T')[0]
    if (appointmentsPerDay.has(formattedDate)) {
      const appointmentsCount = appointmentsPerDay.get(formattedDate)
      if (appointmentsCount && appointmentsCount >= 3) {
        continue
      }
      appointmentsPerDay.set(
        formattedDate,
        appointmentsCount ? appointmentsCount + 1 : 1,
      )
    } else {
      appointmentsPerDay.set(formattedDate, 1)
    }

    const appt = {
      date: apptDate,
      name: 'Test',
    }
    appts.push(appt)
  }

  return appts
}

export default useCalendar
