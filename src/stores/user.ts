import { defineStore } from 'pinia'

export interface User {
  id: number | null
  firstName: string
  lastName: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: null,
    firstName: '',
    lastName: '',
    email: ''
  }),
  getters: {
    hasUser: (state): boolean => !!state.id,
    user: (state): User => ({
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email
    }),
  },
  actions: {
    setUser(payload: Partial<User>) {
        if (payload.id !== undefined) this.id = payload.id ?? null
        if (payload.firstName !== undefined) this.name = payload.firstName
        if (payload.lastName !== undefined) this.description = payload.lastName
        if (payload.lastName !== undefined) this.description = payload.lastName
    },

    setId(value: number | null) {
      this.id = value
    },

    setFirstName(value: string) {
      this.firstName = value
    },

    setLastName(value: string) {
        this.lastName = value
    },

    setEmail(value: string){
        this.email = value
    },

    resetUser() {
      this.id = null
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    },
  },
})

export default useUserStore