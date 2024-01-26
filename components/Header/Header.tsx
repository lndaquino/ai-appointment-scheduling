import { Chat } from '@phosphor-icons/react'
import { Microphone } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import logo from '@/assets/logo.svg'
import React, { useContext } from 'react'
import { AppContext } from '@/contexts/AppContext'

export function Header() {
  const { mood, setMood } = useContext(AppContext)

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(event.target.value)
  }

  return (
    <header className="fixed z-50 flex h-20 w-full justify-between border-b shadow-lg xl:w-3/5">
      <div className="flex w-1/2">
        <Image src={logo} alt="logo" priority style={{ width: 'auto' }} />
      </div>
      <nav className="flex w-1/2 items-center justify-end space-x-6 pr-4">
        <div>
          <select
            value={mood}
            onChange={handleSelectChange}
            className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-4 text-sm leading-tight hover:opacity-85 focus:bg-white focus:outline-none"
          >
            <option value="">Select Mood</option>
            <option value="funny">Funny</option>
            <option value="polite" defaultChecked>
              Polite
            </option>
            <option value="ironic">Ironic</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <button className="flex items-center justify-center gap-1 text-indigo-600 hover:text-indigo-500">
          <Chat size={26} />
          <h3 className="text-lg">Chat</h3>
        </button>
        <button className="hover:disabled relative flex items-center justify-center gap-1 text-yellow-500 hover:cursor-not-allowed hover:text-yellow-400">
          <Microphone size={26} />
          <h3 className="text-lg">Voice</h3>
          <span className="coming-soon absolute -top-full left-1/2 mt-16 hidden w-32 -translate-x-1/2 transform rounded-md bg-gray-100 px-2 py-1 text-sm text-black opacity-90">
            Coming soon...
          </span>
        </button>
      </nav>
    </header>
  )
}
