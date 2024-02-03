import { Chat, Info } from '@phosphor-icons/react'
import { Microphone } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import logo from '@/assets/logo.svg'
import logoMicro from '@/assets/logo-micro.svg'
import React, { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'

export function Header() {
  const { mood, setMood } = useContext(AppContext)

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(event.target.value)
  }

  return (
    <header className="fixed z-50 flex h-16 w-full justify-between border-b border-r bg-white shadow-lg md:h-20 xl:w-3/5">
      <div className="flex w-1/2 items-center">
        <div className="hidden md:block">
          <Image src={logo} alt="logo" priority style={{ width: 'auto' }} />
        </div>

        <div className="block md:hidden">
          <Image src={logoMicro} alt="logo small" className="w-20 pl-4" />
        </div>
      </div>
      <nav className="flex w-1/2 items-center justify-end space-x-2 pr-4 xl:space-x-6">
        <div>
          <select
            value={mood}
            onChange={handleSelectChange}
            className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white p-1 pr-4 text-xs leading-tight hover:opacity-85 focus:bg-white focus:outline-none md:p-2 md:text-sm"
          >
            <option value=" ">Select Mood</option>
            <option value=" funny ">Funny</option>
            <option value=" polite " defaultChecked>
              Polite
            </option>
            <option value=" ironic ">Ironic</option>
            <option value=" neutral ">Neutral</option>
          </select>
        </div>

        <button className="flex items-center justify-center gap-1 text-indigo-600 hover:text-indigo-500">
          <Chat className="size-4 md:size-6" />
          <h3 className="text-sm md:text-lg">Chat</h3>
        </button>
        <button className="hover:disabled relative flex items-center justify-center gap-1 text-yellow-500 hover:cursor-not-allowed hover:text-yellow-400">
          <Microphone className="size-4 md:size-6" />
          <h3 className="text-sm md:text-lg">Voice</h3>
          <span className="coming-soon absolute -top-full left-1/2 mt-16 hidden w-32 -translate-x-1/2 transform rounded-md bg-gray-100 px-2 py-1 text-sm text-black opacity-90">
            Coming soon...
          </span>
        </button>

        <button className="relative flex items-center justify-center gap-1 text-gray-600 hover:text-gray-500">
          <Info className="size-4 md:size-6" />

          <div className="coming-soon border-1 absolute -top-full ml-12 mt-16 hidden w-96 -translate-x-1/2 transform rounded-md bg-white p-4 text-sm">
            <h1 className="mb-2 text-center text-base font-bold text-indigo-600 md:text-lg">
              Welcome to the new era of scheduling!
            </h1>
            <p className="mb-4 text-center text-xs text-gray-600 md:text-sm">
              Discover the power of our state-of-the-art AI virtual assistant,
              meticulously designed to optimize your medical appointment
              scheduling. This intuitive service enables you to effortlessly
              browse and secure appointments, transforming a once-tedious task
              into a simple, click-driven process.
            </p>
            <p className="text-center text-xs text-gray-600 md:text-sm">
              Just type in and schedule your appointment. You can also look at
              the calendar below and find out what times are available.
            </p>
          </div>
        </button>
      </nav>
    </header>
  )
}
