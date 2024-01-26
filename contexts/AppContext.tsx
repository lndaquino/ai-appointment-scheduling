'use client'

import { createContext, ReactNode, useState } from 'react'

interface AppContextType {
  mood: string
  setMood: (textChat: string) => void
}

interface AppContextProps {
  children: ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppContextProvider({ children }: AppContextProps) {
  const [mood, setMood] = useState('Select Mood')

  return (
    <AppContext.Provider
      value={{
        mood,
        setMood,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
