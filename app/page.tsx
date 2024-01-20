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
      <div className="w-1/2 border-r">
        <Header />
        <main className=" bg-neutral-100">
          <Chat />
        </main>
      </div>

      {/** Ancillary */}
      <div className="w-1/2 pl-4">
        <h1 className="text-2xl">Ancillary Part</h1>
        <Calendar calendar={calendar} />
      </div>
    </div>
  )
}
