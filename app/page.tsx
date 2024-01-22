'use client'
import { Header, Chat, Calendar } from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'

export default function Home() {
  const calendar = useCalendar()
  const mistralModel = useAiModel('mistral')
  const chatAssistant = useAssistant(mistralModel, calendar)

  return (
    <div className="flex h-screen overflow-hidden">
      {/** Main */}
      <div className="w-full xl:w-3/5 xl:border-r">
        <Header />
        <main className=" bg-neutral-100">
          <Chat chatAssistant={chatAssistant} />
        </main>
      </div>

      {/** Ancillary */}
      <div className="hidden w-2/5 overflow-auto p-6 xl:block">
        <Calendar calendar={calendar} />
      </div>
    </div>
  )
}
