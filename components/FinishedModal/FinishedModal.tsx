/* eslint-disable react/no-unescaped-entities */
import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

export function FinishedModal({
  handleFinishedClose,
}: {
  handleFinishedClose: () => void
}) {
  return (
    <Dialog.Portal>
      <Dialog.Content
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="fixed left-1/2 top-1/2 z-50 flex w-80 translate-x-[-50%] translate-y-[-50%] transform flex-col rounded-lg border border-indigo-500 bg-white outline-none md:w-96 xl:mx-8"
      >
        <Dialog.Close
          onClick={handleFinishedClose}
          className="flex justify-end p-2 text-yellow-500 hover:opacity-80"
        >
          <X size={21} />
        </Dialog.Close>

        <div className="flex flex-col items-center justify-center gap-6 p-4 pt-0">
          <h1 className="mb-2 text-center text-lg font-bold text-indigo-600 md:text-2xl">
            Your appointment was just scheduled!
          </h1>
          <p className="mb-4 text-center text-sm text-gray-600 md:text-base">
            Now, you can take a look at the calendar to see your appointment
            date and time! Thank you!
          </p>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
