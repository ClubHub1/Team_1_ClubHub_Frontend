import { defineStore } from 'pinia'

export interface Member {
  id: number | null
  role: string
}

export const useMemberStore = defineStore('ClubMembership', {
  state: (): Member => ({
    id: null,
    role: ''
  }),
  getters: {
    hasMember: (state): boolean => !!state.id,
    Member: (state): Member => ({
      id: state.id,
      role: state.role
    }),
  },
  actions: {
    setMember(payload: Partial<Member>) {
        if (payload.id !== undefined) this.id = payload.id ?? null
        if (payload.role !== undefined) this.name = payload.role
    },

    setId(value: number | null) {
      this.id = value
    },

    setRole(value: string){
        this.role = value
    },

    resetMember() {
      this.id = null
      this.role = ''
    },
  },
})

export default useMemberStore