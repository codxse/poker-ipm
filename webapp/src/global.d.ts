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

  interface Voting {
    id: number
    votedById: User['id']
    voteOptionId: VoteOption['id']
    storyId: Story['id']
    createdAt: string
    updatedAt: string
  }
  interface Vote {
    votedBy: User
    votedById: User['id']
    votings: Voting[]
    storyId: Story['id']
    createdAt: string
    updatedAt: string
  }

  interface Story {
    id: number
    createdById: number
    createdBy: User
    roomId: number
    title: string
    description: string
    isFinished: boolean
    createdAt: string
    updatedAt: string
    votes: Vote[]
    url?: string
  }

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

  interface RoomClientProps {
    roomId: string
    token: string
  }
}
