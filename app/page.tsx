'use client'
import { Header, Chat, Calendar } from '../components'
import useCalendar from '@/hooks/useCalendar'
import useAiModel from '@/hooks/useAiModel'
import useAssistant from '@/hooks/useAssistant'

export default function Home() {
  const { calendar } = useCalendar()
  const mistralModel = useAiModel('mistral')
  const { messages, input, handleSubmit, handleInputChange } =
    useAssistant(mistralModel)
  return (
    <div>
      {/** Main */}
      <div>
        <Header />
        <main>
          <Chat messages={messages} />
          <Calendar calendar={calendar} />
          <form onSubmit={handleSubmit}>
            <input
              className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </main>
      </div>

      {/** Ancillary */}
    </div>
  )
}
