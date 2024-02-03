'use client'
import { useState, useContext } from 'react'
import {
  Header,
  Chat,
  Calendar,
  WelcomeModal,
  FinishedModal,
} from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'
import * as Dialog from '@radix-ui/react-dialog'
import { AppContext } from '@/contexts/AppContext'

export default function Home() {
  const calendar = useCalendar()
  const mistralModel = useAiModel('mistral')
  const chatAssistant = useAssistant(mistralModel, calendar)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true)

  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false)
  }

  const { isFinishedOpen, handleFinishedClose } = useContext(AppContext)

  return (
    <div className="flex h-screen overflow-hidden">
      <Dialog.Root open={isWelcomeOpen}>
        <Dialog.Overlay
          className="fixed inset-0 z-40 h-screen w-screen opacity-75"
          onClick={handleWelcomeClose}
        />
        <WelcomeModal handleWelcomeClose={handleWelcomeClose} />
      </Dialog.Root>

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
