export interface Appointment {
    date: Date
    name: string
}

export type Role = 'user' | 'assistant'
export interface Message {
    id: number;
    createdAt: Date;
    content: string;
    role: Role;
}

export interface AIModel {
    generateMessage: (text: string) => Promise<string>
}