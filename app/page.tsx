'use client'
import { useContext } from 'react'
import { Header, Chat, Calendar, FinishedModal } from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'
import * as Dialog from '@radix-ui/react-dialog'
import { AppContext } from '@/contexts/AppContext'

export default function Home() {
  const calendar = useCalendar()
  const mistralModel = useAiModel('mistral')
  const chatAssistant = useAssistant(mistralModel, calendar)

  const { isFinishedOpen, handleFinishedClose } = useContext(AppContext)

  return (
    <div className="flex h-screen overflow-hidden">
      <Dialog.Root open={isFinishedOpen}>
        <Dialog.Overlay
          className="fixed inset-0 z-40 h-screen w-screen opacity-75"
          onClick={handleFinishedClose}
        />
        <FinishedModal
          lastAppointmentCreated={calendar.lastAppointmentCreated}
          handleFinishedClose={handleFinishedClose}
        />
      </Dialog.Root>

      {/** Main */}
      <div className="relative w-full xl:w-3/5 xl:border-r">
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
