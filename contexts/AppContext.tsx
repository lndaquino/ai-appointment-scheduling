'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'

interface AppContextType {
  textChat: boolean
  handleChatType: (textChat: boolean) => void
}

interface AppContextProps {
  children: ReactNode
}

export const AppContext = createContext({} as AppContextType)

export function AppContextProvider({ children }: AppContextProps) {
  const [textChat, setTextChat] = useState<boolean>(true)

  function handleChatType(textChat: boolean) {
    setTextChat(textChat)
  }

  return (
    <AppContext.Provider
      value={{
        textChat,
        handleChatType,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
