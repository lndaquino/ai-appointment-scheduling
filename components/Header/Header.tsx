import { Chat } from '@phosphor-icons/react'
import { Microphone } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import logo from '@/assets/logo.svg'

export function Header() {
  return (
    <header className="flex justify-between border-b shadow-xl">
      <div className="flex w-1/2">
        <Image src={logo} width={350} alt="logo" />
      </div>
      <nav className="flex w-1/2 items-center justify-end space-x-6 pr-4">
        <button className="flex items-center justify-center gap-1 text-indigo-600 hover:text-indigo-500">
          <Chat size={26} />
          <h3 className="text-lg">Chat</h3>
        </button>
        <button className="flex items-center justify-center gap-1 text-yellow-500 hover:text-yellow-400">
          <Microphone size={26} />
          <h3 className="text-lg">Voice</h3>
        </button>
      </nav>
    </header>
  )
}
