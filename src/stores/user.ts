import { defineStore } from 'pinia'

export interface User {
  id: number | null
  firstName: string
  lastName: string
  email: string
  bio?: string
  profile_photo_url?: string
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  facebook_url?: string
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    profile_photo_url: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    facebook_url: ''
  }),
  getters: {
    hasUser: (state): boolean => !!state.id,
    user: (state): User => ({
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      bio: state.bio,
      profile_photo_url: state.profile_photo_url,
      linkedin_url: state.linkedin_url,
      twitter_url: state.twitter_url,
      instagram_url: state.instagram_url,
      facebook_url: state.facebook_url
    }),
  },
  actions: {
    setUser(payload: Partial<User>) {
        if (payload.id !== undefined) this.id = payload.id ?? null
        if (payload.firstName !== undefined) this.firstName = payload.firstName
        if (payload.lastName !== undefined) this.lastName = payload.lastName
        if (payload.email !== undefined) this.email = payload.email
        if (payload.bio !== undefined) this.bio = payload.bio
        if (payload.profile_photo_url !== undefined) this.profile_photo_url = payload.profile_photo_url
        if (payload.linkedin_url !== undefined) this.linkedin_url = payload.linkedin_url
        if (payload.twitter_url !== undefined) this.twitter_url = payload.twitter_url
        if (payload.instagram_url !== undefined) this.instagram_url = payload.instagram_url
        if (payload.facebook_url !== undefined) this.facebook_url = payload.facebook_url
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

    setBio(value: string) {
      this.bio = value
    },

    setProfilePhotoUrl(value: string) {
      this.profile_photo_url = value
    },

    setLinkedInUrl(value: string) {
      this.linkedin_url = value
    },

    setTwitterUrl(value: string) {
      this.twitter_url = value
    },

    setInstagramUrl(value: string) {
      this.instagram_url = value
    },

    setFacebookUrl(value: string) {
      this.facebook_url = value
    },

    resetUser() {
      this.id = null
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.bio = ''
      this.profile_photo_url = ''
      this.linkedin_url = ''
      this.twitter_url = ''
      this.instagram_url = ''
      this.facebook_url = ''
    },
  },
})

export default useUserStore