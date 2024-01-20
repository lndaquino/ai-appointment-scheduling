'use client'
import { Header, Chat, Calendar } from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'

export default function Home() {
  const { calendar } = useCalendar()

  return (
    <div className="flex h-screen overflow-hidden">
      {/** Main */}
      <div className="w-full xl:w-1/2 xl:border-r">
        <Header />
        <main className=" bg-neutral-100">
          <Chat />
        </main>
      </div>

      {/** Ancillary */}
      <div className="hidden w-1/2 px-4 xl:block">
        <Calendar />
      </div>
    </div>
  )
}
