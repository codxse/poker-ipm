export {}

declare global {
  type JoinAs = 'observer' | 'observable'

  interface Participant {
    createdAt: string
    joinAs: JoinAs
    roomId: number
    updatedAt: string
    userId: number
  }

  interface VoteOption {
    id: number
    label: string
    roomId: number
    updatedAt: string
    value: number
  }

  interface Story {}

  interface User {
    id: number
    avatarUrl: string
    email: string
    isVerified: boolean
    createdAt: string
    updatedAt: string
    firstName: string
    lastName?: string
    username?: string
  }

  interface Room {
    createdAt: string
    createdBy: User
    createdById: number
    id: number
    isFinished: boolean
    name?: string
    participants: Participant[]
    stories: Story[]
    updatedAt: string
    voteOptions: VoteOption[]
  }
}
