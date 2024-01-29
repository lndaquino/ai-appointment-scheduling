'use client'

import { createContext, ReactNode, useState } from 'react'

interface AppContextType {
  mood: string
  setMood: (textChat: string) => void
  isFinishedOpen: boolean
  handleFinishedClose: () => void
}

interface AppContextProps {
  children: ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppContextProvider({ children }: AppContextProps) {
  const [mood, setMood] = useState(' ')
  const [isFinishedOpen, setIsFinishedOpen] = useState(false)

  const handleFinishedClose = () => {
    isFinishedOpen ? setIsFinishedOpen(false) : setIsFinishedOpen(true)
  }

  return (
    <AppContext.Provider
      value={{
        mood,
        setMood,
        isFinishedOpen,
        handleFinishedClose,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
