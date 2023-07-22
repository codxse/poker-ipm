import { create } from 'zustand'
import { produce, original } from 'immer'
import findIndex from 'lodash/findIndex'

interface Store {
  room?: Room
  initRoom(room: Room): void
  updateParticipants(participants: Participant[]): void
  getUsers(): User[]
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
  updateParticipants(participants) {
    set(
      produce((store) => {
        if (!get().room) {
          store.room = {}
          store.room.participants = participants
          return
        }
        store.room.participants = participants
      }),
    )
  },
  getUsers() {
    return get().room?.participants.map((p) => p.user) || []
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
        const storyIndex = findIndex(
          get().room?.stories,
          (s: Story) => s.id === voting.storyId,
        )
        const _voteIndex = findIndex(get().room?.stories[storyIndex].votes, {
          votedById: voting.votedById,
          storyId: voting.storyId,
        })
        const voteIndex = _voteIndex === -1 ? 0 : _voteIndex

        store.room.stories[storyIndex].votes[voteIndex] = {
          ...get().room?.stories[storyIndex].votes[voteIndex],
          votedById: voting.votedById,
          storyId: voting.storyId,
          votings: [
            ...(get().room?.stories[storyIndex].votes[voteIndex]?.votings ||
              []),
            voting,
          ],
        }
      }),
    )
  },
}))

export default useStore
