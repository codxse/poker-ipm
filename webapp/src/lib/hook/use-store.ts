import { create } from 'zustand'
import { produce } from 'immer'

interface Store {
  room?: Room
  initRoom(room: Room): void
  removeVoteOptionById(id: VoteOption['id']): void
  appendVoteOptions(voteOption: VoteOption): void
  appendStories(story: Story): void
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
        })
      )
  },
}))

export default useStore
