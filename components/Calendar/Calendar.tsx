import React from 'react'
import { format, isSameDay, isToday, isSameMonth } from 'date-fns'
import { ICalendar } from '@/types'

interface IProps {
  calendar: ICalendar
}

export function Calendar({ calendar }: IProps) {
  const { appointments } = calendar
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

  const weeks = []
  let currentWeek = []
  let currentDate = new Date(currentYear, currentMonth, 1)
  currentDate.setUTCHours(0, 0, 0, 0)

  while (currentDate <= lastDayOfMonth) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }

    currentWeek.push(currentDate)
    currentDate = new Date(currentDate.getTime())
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <table className="w-full" style={{ tableLayout: 'fixed' }}>
      <thead>
        <tr>
          {daysOfWeek.map((day) => (
            <th key={day} className="h-12 text-center">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((date) => (
              <td
                key={date.toString()}
                className={`${
                  !isSameMonth(date, firstDayOfMonth) ? 'text-gray-500' : ''
                } ${isToday(date) ? 'bg-blue-200' : ''}`}
              >
                <div className="h-24 w-24 rounded-lg p-2 shadow-lg">
                  <span>{format(date, 'd')}</span>

                  <div className="mt-1">
                    {appointments.map((appointment) =>
                      isSameMonth(date, appointment.date) &&
                      isSameDay(date, appointment.date) ? (
                        <div
                          key={appointment.date.toString()}
                          className="rounded bg-green-500 p-1 text-white"
                        >
                          {appointment.name}
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
