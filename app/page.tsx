'use client'
import { useState } from 'react'
import { Header, Chat, Calendar, WelcomeModal } from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'
import * as Dialog from '@radix-ui/react-dialog'

export default function Home() {
  const calendar = useCalendar()
  const mistralModel = useAiModel('mistral')
  const chatAssistant = useAssistant(mistralModel, calendar)
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Dialog.Root open={isOpen}>
        <Dialog.Overlay
          className="fixed inset-0 z-40 h-screen w-screen opacity-75"
          onClick={handleClose}
        />
        <WelcomeModal handleClose={handleClose} />
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
