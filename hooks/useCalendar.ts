import { Appointment } from '@/types'
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

  const getFreeTime = (date: string): string[] => {
    const startDate = new Date(date)
    const endDate = new Date(date)
    const availableTimes = ['08:00', '08:30','09:00','09:30','10:00', '10:30','11:00','11:30','12:00', '12:30','13:00','13:30','14:00', '14:30','15:00','15:30','16:00', '16:30','17:00','17:30','18:00']
    endDate.setTime(endDate.getTime() + 24*60*60*1000)

    const appointmentsOnDate = appointments.filter(
      (appt) => ((startDate.getTime() <= appt.date.getTime()) && (appt.date.getTime()<=endDate.getTime()))
    )
    const occupiedTimes = appointmentsOnDate.map(appt => {
      const hours = String(appt.date.getHours()).padStart(2, '0');
      const minutes = String(appt.date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    })
    const availableTimesWithouOccupied = availableTimes.filter(t => !occupiedTimes.includes(t))

    return availableTimesWithouOccupied
  }

  return {
    appointments,
    findAppointmentByDate,
    createAppointment,
    getFreeTime
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
