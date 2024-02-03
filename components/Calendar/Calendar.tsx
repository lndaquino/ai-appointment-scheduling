import { useEffect, useState } from 'react'
import {
  format,
  isSameDay,
  isToday,
  isSameMonth,
  startOfWeek,
  addMonths,
} from 'date-fns'
import { Appointment, ICalendar } from '@/types'

interface IProps {
  calendar: ICalendar
}

export function Calendar({ calendar }: IProps) {
  const [isLoading, setIsLoading] = useState(true)
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)

  const thirdMonth = addMonths(today, 2)
  const lastDayOfThirdMonth = new Date(
    thirdMonth.getFullYear(),
    thirdMonth.getMonth() + 1,
    0,
  )

  const months = []
  let currentDate = firstDayOfMonth

  while (currentDate <= lastDayOfThirdMonth) {
    const startOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    )
    const endOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    )

    const startOfCurrentWeek = startOfWeek(startOfCurrentMonth, {
      weekStartsOn: 0,
    })

    if (currentDate <= startOfCurrentWeek) {
      currentDate = startOfCurrentWeek
    }

    const weeks = []
    let currentWeek = []
    let currentDay = startOfCurrentWeek

    while (currentDay <= endOfCurrentMonth) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(currentDay)
      currentDay = new Date(currentDay.getTime())
      currentDay.setUTCDate(currentDay.getUTCDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    months.push({
      startOfMonth: startOfCurrentMonth,
      weeks,
    })

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    )
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const [clientAppointments, setClientAppointments] = useState<Appointment[]>(
    [],
  )

  function bgColor(index: number) {
    if (index % 2 === 0) return 'bg-indigo-200'

    return 'bg-yellow-200'
  }

  function formatTimeToAMPM(date: Date): string {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours || 12

    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString()

    return `${hours}:${minutesStr}${ampm}`
  }

  useEffect(() => {
    const fetchData = async () => {
      const { appointments } = calendar
      setClientAppointments(appointments)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          {months.map((month, monthIndex) => (
            <div key={monthIndex}>
              <h2 className="mt-4 text-lg font-bold">
                {format(month.startOfMonth, 'MMMM yyyy')}
              </h2>
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
                  {month.weeks.map((week, weekIndex) => {
                    const isWeekBeforeStartOfMonth =
                      week[0] < startOfWeek(new Date())

                    if (isWeekBeforeStartOfMonth) {
                      return null
                    }

                    return (
                      <tr key={weekIndex}>
                        {week.map((date) => (
                          <td
                            key={date.toString()}
                            className={` ${
                              !isSameMonth(date, month.startOfMonth)
                                ? 'text-gray-100'
                                : ''
                            } text-sm`}
                          >
                            <div
                              className={`m-1 h-40 w-auto min-w-16 rounded-lg p-2 shadow-lg ${
                                isToday(date)
                                  ? 'border bg-yellow-50 font-bold'
                                  : ''
                              } ${
                                !isSameMonth(date, month.startOfMonth)
                                  ? 'bg-gray-100'
                                  : ''
                              }`}
                            >
                              <span>{format(date, 'd')}</span>

                              <div className="mt-1 flex flex-col gap-1">
                                {clientAppointments
                                  .filter(
                                    (appointment) =>
                                      isSameMonth(date, appointment.date) &&
                                      isSameDay(date, appointment.date),
                                  )
                                  .sort(
                                    (a, b) => Number(a.date) - Number(b.date),
                                  )
                                  .map((appointment, index) => (
                                    <div
                                      key={appointment.date.toString()}
                                      className="flex gap-1 font-normal"
                                    >
                                      <span
                                        className={`${
                                          !isSameMonth(date, month.startOfMonth)
                                            ? 'bg-gray-100'
                                            : bgColor(index)
                                        } p-1 text-white`}
                                      ></span>
                                      <p className="flex flex-col">
                                        <span>{appointment.name}</span>
                                        <span
                                          className={`whitespace-nowrap text-xs ${
                                            !isSameMonth(
                                              date,
                                              month.startOfMonth,
                                            )
                                              ? 'text-gray-100'
                                              : 'text-gray-600'
                                          }`}
                                        >
                                          {formatTimeToAMPM(appointment.date)}
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
