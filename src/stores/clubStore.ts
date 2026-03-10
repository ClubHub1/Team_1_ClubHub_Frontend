import { defineStore } from 'pinia'

export interface Club {
  id: number | null
  name: string
  description: string
}

export const useClubStore = defineStore('club', {
  state: (): Club => ({
    id: null,
    name: '',
    description: '',
  }),
  getters: {
    hasClub: (state): boolean => !!state.id,
    club: (state): Club => ({
      id: state.id,
      name: state.name,
      description: state.description,
    }),
  },
  actions: {
    setClub(payload: Partial<Club>) {
      if (payload.id !== undefined) this.id = payload.id ?? null
      if (payload.name !== undefined) this.name = payload.name
      if (payload.description !== undefined) this.description = payload.description
    },

    setId(value: number | null) {
      this.id = value
    },

    setName(value: string) {
      this.name = value
    },

    setDescription(value: string) {
      this.description = value
    },

    resetClub() {
      this.id = null
      this.name = ''
      this.description = ''
    },
  },
})

export default useClubStore