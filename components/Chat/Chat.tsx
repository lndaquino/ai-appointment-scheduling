import { Message } from '@/types'

interface IProps {
  messages: Message[]
}

export function Chat({ messages }: IProps) {
  return (
    <div>
      <h1>CHAT</h1>
    </div>
  )
}
