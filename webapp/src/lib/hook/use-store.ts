import { create } from 'zustand'
import { produce } from 'immer'

interface Store {
  room?: Room
  initRoom(room: Room): void
  removeVoteOptionById(id: VoteOption['id']): void
  appendVoteOptions(voteOption: VoteOption): void
  appendStories(story: Story): void
  removeStoryById(id: Story['id']): void
  appendVotingById(voting: Voting): void
}

const useStore = create<Store>()((set, get) => ({
  initRoom(newRoom) {
    set(
      produce((store) => {
        store.room = newRoom
      }),
    )
  },
  removeVoteOptionById(id) {
    set(
      produce((store) => {
        const newVoteOptions = (get().room?.voteOptions || []).filter(
          (v) => v.id !== id,
        )
        store.room.voteOptions = newVoteOptions
      }),
    )
  },
  appendVoteOptions(voteOption) {
    set(
      produce((store) => {
        store.room.voteOptions.push(voteOption)
      }),
    )
  },
  appendStories(story) {
    set(
      produce((store) => {
        store.room.stories.unshift(story)
      }),
    )
  },
  removeStoryById(id) {
    set(
      produce((store) => {
        const newStories = (get().room?.stories || []).filter(
          (s) => s.id !== id,
        )
        store.room.stories = newStories
      }),
    )
  },
  appendVotingById(voting) {
    set(
      produce((store) => {
        const story = (get().room?.stories || []).find(
          (s) => s.id === voting.storyId,
        )
        const vote = (story?.votes || []).find(
          (v) => v.votedById === voting.votedById,
        )
        const newVotings = [...(vote?.votings || []), voting]
        const newVote = { ...vote, votings: newVotings }
        const newVotes = (story?.votes || []).map((v) => {
          const isReplaced =
            v.storyId === voting.storyId && v.votedById === voting.votedById
          if (isReplaced) return newVote
          return v
        })
        const newStory = { ...story, votes: newVotes }
        const newStories = (get().room?.stories || []).map((s) => {
          if (s.id === voting.storyId) return newStory
          return s
        })
        store.room.stories = newStories
      }),
    )
  },
}))

export default useStore
