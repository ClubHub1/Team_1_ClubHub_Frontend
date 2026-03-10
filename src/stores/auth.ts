// stores/auth.ts
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useFeathers } from '@/composables/feathersCompose'
import useUserStore from './user'

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()
  const auth = useAuth({ api, servicePath: 'User' })
  const userStore = useUserStore()

  auth.reAuthenticate().then(res => {
    if(res){
        userStore.setEmail(res.User?.email)
        userStore.setId(res.User?.id)
        userStore.setFirstName(res.User?.first_name)
        userStore.setLastName(res.User?.last_name)
    }
  });

  return {...auth}
})

if (import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
 