/* eslint-disable react/no-unescaped-entities */
import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'

export function WelcomeModal({ handleClose }: { handleClose: () => void }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Dialog.Portal>
      {isMounted && (
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 flex w-80 translate-x-[-50%] translate-y-[-50%] transform flex-col rounded-lg border border-indigo-500 bg-white outline-none xl:mx-8"
        >
          <Dialog.Close
            onClick={handleClose}
            className="flex justify-end p-2 text-yellow-500 hover:opacity-80"
          >
            <X size={21} />
          </Dialog.Close>

          <div className="flex flex-col items-center justify-center gap-6 p-4 pt-0">
            <h1 className="mb-2 text-center text-lg font-bold text-indigo-600 md:text-2xl">
              Welcome to the new era of scheduling!
            </h1>
            <p className="md:text-md mb-4 text-center text-sm text-gray-600">
              Discover the power of our state-of-the-art AI virtual assistant,
              meticulously designed to optimize your medical appointment
              scheduling. This intuitive service enables you to effortlessly
              browse and secure appointments, transforming a once-tedious task
              into a simple, click-driven process.
            </p>
            <p className="md:text-md text-center text-sm text-gray-600">
              Just type in and schedule your appointment. You can also look at
              the calendar below and find out what times are available.
            </p>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Portal>
  )
}
