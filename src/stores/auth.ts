// stores/auth.ts
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useFeathers } from '@/composables/feathersCompose'
import { useUserStore } from './service.User'

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()
  const userStore = useUserStore()
  const auth = useAuth({ api, servicePath: 'User' })

  auth.reAuthenticate()

  return {...auth}
})

if (import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
 