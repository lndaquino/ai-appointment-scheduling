'use client'
import { Fragment } from 'react'
import './page.module.css'
import {Header, Chat, Calendar} from '../components'
import useCalendar from '@/hooks/useCalendar'

export default function Home() {
  const {calendar} = useCalendar()
  return (
    <Fragment>
      <Header/>
      <main>
        <Chat/>
        <Calendar
          calendar={calendar}
        />
      </main>
    </Fragment>
  )
}
