'use client'
import './page.module.css'
import { Fragment } from 'react'
import {Header, Chat, Calendar} from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'

export default function Home() {
  const {calendar} = useCalendar()
  const mistralModel = useAiModel('mistral')
  const {messages, input,handleSubmit,handleInputChange} = useAssistant(mistralModel)
  return (
    <Fragment>
      <Header/>
      <main>
        <Chat
          messages={messages}
        />
        <Calendar
          calendar={calendar}
        />
        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </main>
    </Fragment>
  )
}
